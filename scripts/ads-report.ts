/**
 * Google Ads account digest via the Google Ads API (GAQL) - direct account
 * access, unlike scripts/analytics-report.ts which only sees cost/clicks
 * through the GA4 <-> Ads link.
 *
 * Pulls, for the last N days:
 *   - conversion actions (explains UI "conversions" vs real form submits)
 *   - campaign performance incl. impression share (budget-lost vs rank-lost)
 *   - conversions per campaign per conversion action
 *   - search terms (brand vs non-brand split)
 *   - keywords with quality score
 *
 * Setup (one-time, see ANALYTICS.md "Google Ads API" section):
 *   .env.local:
 *     GOOGLE_ADS_DEVELOPER_TOKEN=...        # Ads MANAGER account -> https://ads.google.com/aw/apicenter
 *                                           # (API Center exists only in manager accounts)
 *     GOOGLE_ADS_CUSTOMER_ID=1234567890     # 10 digits, no dashes
 *     GOOGLE_ADS_LOGIN_CUSTOMER_ID=...      # optional, only if access goes via an MCC manager
 *   Auth — either:
 *     a) service account (preferred): .secrets/gcp-analytics.json (same key as
 *        analytics-report.ts), with the SA email added as a Read-only user in
 *        the Ads account (Admin -> Access and security -> Users)
 *     b) user OAuth: GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET /
 *        GOOGLE_ADS_REFRESH_TOKEN (minted by npm run setup:ads-auth)
 *
 * Usage:
 *   npm run report:ads                # last 90 days
 *   tsx scripts/ads-report.ts --days=30
 */

import { readFileSync, existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

/* ---------- env ---------- */

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvLocal()

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
/** Service-account key (same file as analytics-report.ts) — the preferred auth path. */
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const HAS_OAUTH = Boolean(REFRESH_TOKEN && CLIENT_ID && CLIENT_SECRET)

/** Bump when Google sunsets this version (a 404/INVALID_VERSION error means: bump). */
const ADS_API_VERSION = "v25"

const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const DAYS = daysFlag ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 90) : 90

/* ---------- auth (service account preferred, OAuth2 refresh-token as fallback) ---------- */

async function getAccessToken(): Promise<string> {
  if (!HAS_OAUTH) {
    // Service account: its email must be added as a user (Read only) in the
    // Google Ads account (Admin -> Access and security -> Users).
    if (!existsSync(KEY_FILE)) {
      throw new Error(
        `No auth available: neither the OAuth trio (GOOGLE_ADS_REFRESH_TOKEN/CLIENT_ID/CLIENT_SECRET) ` +
          `nor a service-account key at ${KEY_FILE}. See ANALYTICS.md "Google Ads API" section.`,
      )
    }
    const auth = new GoogleAuth({
      keyFile: KEY_FILE,
      scopes: ["https://www.googleapis.com/auth/adwords"],
    })
    const client = await auth.getClient()
    const token = await client.getAccessToken()
    if (!token.token) throw new Error("Failed to mint an access token from the service-account key")
    return token.token
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok || typeof data.access_token !== "string") {
    throw new Error(
      `OAuth token refresh failed: ${JSON.stringify(data).slice(0, 300)}\n` +
        `Re-run npm run setup:ads-auth to mint a new refresh token.`,
    )
  }
  return data.access_token
}

/* ---------- GAQL ---------- */

type Row = Record<string, Record<string, unknown> | undefined>

/** The REST API returns camelCase keys; the report code uses proto snake_case. */
function snakeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeKeys)
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`),
        snakeKeys(v),
      ]),
    )
  }
  return value
}

async function gaql(token: string, query: string): Promise<Row[]> {
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  if (LOGIN_CUSTOMER_ID) headers["login-customer-id"] = LOGIN_CUSTOMER_ID

  const rows: Row[] = []
  let pageToken: string | undefined
  do {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GAQL failed (${res.status}): ${text.slice(0, 500)}\n\nQuery was:\n${query}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

/* ---------- formatting helpers ---------- */

const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))
const micros = (v: unknown) => (num(v) / 1e6).toFixed(2)
const pct = (v: unknown) => (v === undefined || v === null ? "-" : `${(num(v) * 100).toFixed(1)}%`)
const int = (v: unknown) => String(Math.round(num(v)))

function field(row: Row, resource: string, name: string): unknown {
  return row[resource]?.[name]
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/* Ads data lags ~2 days, same convention as analytics-report.ts */
function dateRange(days: number) {
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - days + 1)
  return { from: iso(start), to: iso(end) }
}

/* ---------- report ---------- */

async function main() {
  const missing: string[] = []
  if (!DEVELOPER_TOKEN) missing.push("GOOGLE_ADS_DEVELOPER_TOKEN")
  if (!CUSTOMER_ID) missing.push("GOOGLE_ADS_CUSTOMER_ID")
  if (!HAS_OAUTH && !existsSync(KEY_FILE)) {
    missing.push(`auth: GOOGLE_ADS_REFRESH_TOKEN/CLIENT_ID/CLIENT_SECRET or a service-account key at ${KEY_FILE}`)
  }
  if (missing.length) {
    console.error(
      [
        `Missing env vars in .env.local: ${missing.join(", ")}`,
        ``,
        `One-time setup (see ANALYTICS.md "Google Ads API" section):`,
        `  1. Developer token: Ads MANAGER account -> https://ads.google.com/aw/apicenter`,
        `     (API Center exists only in manager accounts - create a free one and`,
        `     link the client account under it if you only have a regular account)`,
        `  2. Auth, either:`,
        `     a. add the service-account email as a Read-only user in the Ads account`,
        `        (Admin -> Access and security -> Users) - uses ${KEY_FILE}`,
        `     b. or npm run setup:ads-auth (user OAuth, needs CLIENT_ID/SECRET)`,
        `  3. Set GOOGLE_ADS_DEVELOPER_TOKEN + GOOGLE_ADS_CUSTOMER_ID in .env.local`,
      ].join("\n"),
    )
    process.exitCode = 1
    return
  }

  const token = await getAccessToken()
  const { from, to } = dateRange(DAYS)
  const between = `segments.date BETWEEN '${from}' AND '${to}'`
  const out: string[] = []

  out.push(`# Google Ads digest (direct API)`, ``)
  out.push(`**Customer:** ${CUSTOMER_ID} · **Period:** ${from} -> ${to} (${DAYS} days)`, ``)

  /* --- 1. conversion actions (what the UI "conversions" number counts) --- */
  const actions = await gaql(
    token,
    `SELECT conversion_action.name, conversion_action.category, conversion_action.status,
            conversion_action.origin,
            conversion_action.include_in_conversions_metric, conversion_action.primary_for_goal
     FROM conversion_action`,
  )
  out.push(`## Conversion actions`)
  out.push(`| Name | Category | Status | Origin | In "Conversions" col | Primary |`)
  out.push(`|---|---|---|---|---|---|`)
  for (const r of actions) {
    out.push(
      `| ${field(r, "conversion_action", "name")} | ${field(r, "conversion_action", "category")} | ${field(r, "conversion_action", "status")} | ${field(r, "conversion_action", "origin")} | ${field(r, "conversion_action", "include_in_conversions_metric")} | ${field(r, "conversion_action", "primary_for_goal")} |`,
    )
  }

  /* --- 2. campaign performance incl. impression share --- */
  const campaigns = await gaql(
    token,
    `SELECT campaign.name, campaign.status, campaign.advertising_channel_type,
            metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.ctr, metrics.average_cpc,
            metrics.conversions, metrics.all_conversions,
            metrics.search_impression_share, metrics.search_rank_lost_impression_share,
            metrics.search_budget_lost_impression_share,
            metrics.search_top_impression_share, metrics.search_absolute_top_impression_share
     FROM campaign
     WHERE ${between}
     ORDER BY metrics.cost_micros DESC`,
  )
  const active = campaigns.filter((r) => num(field(r, "metrics", "cost_micros")) > 0 || num(field(r, "metrics", "impressions")) > 0)
  out.push(``, `## Campaigns`)
  out.push(`| Campaign | Status | Cost € | Clicks | Impr. | CTR | Avg CPC € | Conv. | All conv. | Imp. share | Lost (rank) | Lost (budget) | Top IS | Abs top IS |`)
  out.push(`|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`)
  for (const r of active) {
    const m = r.metrics ?? {}
    out.push(
      `| ${field(r, "campaign", "name")} | ${field(r, "campaign", "status")} | ${micros(m.cost_micros)} | ${int(m.clicks)} | ${int(m.impressions)} | ${pct(m.ctr)} | ${micros(m.average_cpc)} | ${num(m.conversions).toFixed(1)} | ${num(m.all_conversions).toFixed(1)} | ${pct(m.search_impression_share)} | ${pct(m.search_rank_lost_impression_share)} | ${pct(m.search_budget_lost_impression_share)} | ${pct(m.search_top_impression_share)} | ${pct(m.search_absolute_top_impression_share)} |`,
    )
  }

  /* --- 3. conversions per campaign per conversion action --- */
  const convRows = (
    await gaql(
      token,
      `SELECT campaign.name, segments.conversion_action_name, segments.conversion_action_category,
              metrics.conversions, metrics.all_conversions
       FROM campaign
       WHERE ${between}
       ORDER BY metrics.all_conversions DESC`,
    )
  ).filter((r) => num(field(r, "metrics", "all_conversions")) > 0 || num(field(r, "metrics", "conversions")) > 0)
  out.push(``, `## Conversions by action`)
  out.push(`| Campaign | Action | Category | Conv. | All conv. |`)
  out.push(`|---|---|---|---|---|`)
  for (const r of convRows) {
    const m = r.metrics ?? {}
    const s = r.segments ?? {}
    out.push(
      `| ${field(r, "campaign", "name")} | ${s.conversion_action_name ?? "?"} | ${s.conversion_action_category ?? "?"} | ${num(m.conversions).toFixed(1)} | ${num(m.all_conversions).toFixed(1)} |`,
    )
  }

  /* --- 4. search terms (brand vs non-brand) --- */
  const terms = await gaql(
    token,
    `SELECT search_term_view.search_term, campaign.name, ad_group.name,
            metrics.impressions, metrics.clicks, metrics.ctr, metrics.cost_micros,
            metrics.conversions, metrics.all_conversions
     FROM search_term_view
     WHERE ${between}
     ORDER BY metrics.cost_micros DESC
     LIMIT 300`,
  )
  const isBrand = (t: string) => /\bsps\b|sps[\s-]?(grupp|group)/i.test(t)
  let brandCost = 0,
    brandClicks = 0,
    brandConv = 0,
    otherCost = 0,
    otherClicks = 0,
    otherConv = 0
  for (const r of terms) {
    const t = String(field(r, "search_term_view", "search_term") ?? "")
    const m = r.metrics ?? {}
    if (isBrand(t)) {
      brandCost += num(m.cost_micros)
      brandClicks += num(m.clicks)
      brandConv += num(m.all_conversions)
    } else {
      otherCost += num(m.cost_micros)
      otherClicks += num(m.clicks)
      otherConv += num(m.all_conversions)
    }
  }
  out.push(``, `## Search terms - brand vs non-brand`)
  out.push(`| Segment | Cost € | Clicks | All conv. |`)
  out.push(`|---|---|---|---|`)
  out.push(`| Brand (sps…) | ${(brandCost / 1e6).toFixed(2)} | ${Math.round(brandClicks)} | ${brandConv.toFixed(1)} |`)
  out.push(`| Non-brand | ${(otherCost / 1e6).toFixed(2)} | ${Math.round(otherClicks)} | ${otherConv.toFixed(1)} |`)
  out.push(``, `## Top search terms by cost`)
  out.push(`| Term | Campaign | Cost € | Clicks | Impr. | All conv. |`)
  out.push(`|---|---|---|---|---|---|`)
  for (const r of terms.slice(0, 40)) {
    const m = r.metrics ?? {}
    out.push(
      `| ${field(r, "search_term_view", "search_term")} | ${field(r, "campaign", "name")} | ${micros(m.cost_micros)} | ${int(m.clicks)} | ${int(m.impressions)} | ${num(m.all_conversions).toFixed(1)} |`,
    )
  }

  /* --- 5. keywords + quality score --- */
  let keywords: Row[] = []
  try {
    keywords = await gaql(
      token,
      `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
              ad_group_criterion.keyword.match_type, ad_group_criterion.status,
              ad_group_criterion.quality_info.quality_score,
              metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
       FROM keyword_view
       WHERE ${between} AND ad_group_criterion.status != 'REMOVED'
       ORDER BY metrics.cost_micros DESC
       LIMIT 100`,
    )
  } catch {
    /* quality_info is not always combinable with date segments - retry without it */
    keywords = await gaql(
      token,
      `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
              ad_group_criterion.keyword.match_type, ad_group_criterion.status,
              metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
       FROM keyword_view
       WHERE ${between} AND ad_group_criterion.status != 'REMOVED'
       ORDER BY metrics.cost_micros DESC
       LIMIT 100`,
    )
  }
  out.push(``, `## Keywords by cost`)
  out.push(`| Keyword | Match | QS | Status | Campaign | Cost € | Clicks | Impr. | Conv. |`)
  out.push(`|---|---|---|---|---|---|---|---|---|`)
  for (const r of keywords) {
    const m = r.metrics ?? {}
    const c = r.ad_group_criterion ?? {}
    const kw = (c.keyword ?? {}) as Record<string, unknown>
    const qs = (c.quality_info ?? {}) as Record<string, unknown> | undefined
    out.push(
      `| ${kw.text ?? "?"} | ${kw.match_type ?? "?"} | ${qs?.quality_score ?? "-"} | ${c.status ?? "?"} | ${field(r, "campaign", "name")} | ${micros(m.cost_micros)} | ${int(m.clicks)} | ${int(m.impressions)} | ${num(m.conversions).toFixed(1)} |`,
    )
  }

  console.log(out.join("\n"))
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
