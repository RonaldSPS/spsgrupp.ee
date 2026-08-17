/**
 * Analytics digest: GA4 traffic + Google Ads cost data + Search Console.
 *
 * Pulls read-only reports through the Google REST APIs using a service
 * account (no gRPC deps — plain fetch):
 *   - GA4 Data API   https://analyticsdata.googleapis.com/v1beta
 *   - Search Console https://www.googleapis.com/webmasters/v3
 *
 * Setup:
 *   1. `.env.local`:
 *        GA4_PROPERTY_ID=328729351
 *        GSC_SITE_URL=https://spsgrupp.ee/
 *        GOOGLE_APPLICATION_CREDENTIALS=.secrets/gcp-analytics.json
 *   2. The service-account email must be a Viewer on the GA4 property and a
 *      user on the Search Console property. Ads cost/clicks come via the
 *      GA4 <-> Google Ads link (no Ads API token needed).
 *
 * Usage:
 *   npm run report:analytics            # last 28 days vs previous 28
 *   tsx scripts/analytics-report.ts --days=7
 */

import { readFileSync, existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

/* ---------- env (.env.local is a Next convention; tsx does not load it) ---------- */

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

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const GSC_SITE_URL = process.env.GSC_SITE_URL
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"

const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const DAYS = daysFlag ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 28) : 28

/* ---------- auth ---------- */

async function getAccessToken(): Promise<string> {
  if (!existsSync(KEY_FILE)) {
    console.error(
      [
        `Service-account key not found at ${KEY_FILE}`,
        ``,
        `Setup:`,
        `  1. Google Cloud Console -> IAM & Admin -> Service Accounts -> create one,`,
        `     enable "Google Analytics Data API" and "Google Search Console API".`,
        `  2. Keys -> Add key -> JSON -> save as ${KEY_FILE}`,
        `  3. Add the service-account email as:`,
        `       - GA4 property Viewer (Analytics -> Admin -> Property access management)`,
        `       - Search Console user (Settings -> Users and permissions)`,
      ].join("\n"),
    )
    process.exit(1)
  }
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/webmasters.readonly",
    ],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("Failed to mint an access token from the service-account key")
  return token.token
}

/* ---------- tiny REST helpers ---------- */

async function postJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${url} -> ${res.status}: ${text.slice(0, 400)}`)
  }
  return (await res.json()) as T
}

/* ---------- date ranges (GA4/GSC data lags ~2 days) ---------- */

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function ranges(days: number) {
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - days + 1)
  const prevEnd = new Date(start)
  prevEnd.setDate(prevEnd.getDate() - 1)
  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - days + 1)
  return {
    current: { startDate: iso(start), endDate: iso(end) },
    previous: { startDate: iso(prevStart), endDate: iso(prevEnd) },
  }
}

/* ---------- GA4 ---------- */

interface Ga4Row {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}
interface Ga4Report {
  rows?: Ga4Row[]
  totals?: { metricValues?: { value: string }[] }[]
}

async function ga4Report(
  token: string,
  body: Record<string, unknown>,
): Promise<Ga4Report> {
  return postJson<Ga4Report>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    token,
    body,
  )
}

const num = (v: string | undefined) => (v ? Number(v) : 0)

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? " (new)" : ""
  const pct = ((current - previous) / previous) * 100
  return ` (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)`
}

/* ---------- GSC ---------- */

interface GscRow {
  keys?: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}
interface GscResponse {
  rows?: GscRow[]
}

async function gscQuery(token: string, body: Record<string, unknown>): Promise<GscResponse> {
  const site = encodeURIComponent(GSC_SITE_URL!)
  return postJson<GscResponse>(
    `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    token,
    body,
  )
}

/* ---------- report ---------- */

async function main() {
  if (!GA4_PROPERTY_ID || !GSC_SITE_URL) {
    console.error("Set GA4_PROPERTY_ID and GSC_SITE_URL in .env.local")
    process.exit(1)
  }

  const token = await getAccessToken()
  const { current, previous } = ranges(DAYS)
  const rangeLabel = `${current.startDate} -> ${current.endDate}`
  const out: string[] = []

  /* --- GA4 overview (current vs previous period) --- */
  const overview = await ga4Report(token, {
    dateRanges: [
      { ...current, name: "current" },
      { ...previous, name: "previous" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "engagementRate" },
      { name: "keyEvents" },
    ],
  })
  // With two date ranges and no dimensions, rows arrive per date range.
  const cur = overview.rows?.find((r) => r.dimensionValues?.[0]?.value === "current")?.metricValues
  const prev = overview.rows?.find((r) => r.dimensionValues?.[0]?.value === "previous")?.metricValues
  const curVals = cur ?? overview.totals?.[0]?.metricValues ?? []
  const prevVals = prev ?? []

  out.push(`# SPS Grupp analytics digest`, ``, `**Period:** ${rangeLabel} (${DAYS} days, vs previous ${DAYS})`, ``)
  out.push(`## GA4 — overview`)
  out.push(`| Metric | Current | Previous |`)
  out.push(`|---|---|---|`)
  const labels = ["Sessions", "Users", "New users", "Engagement rate", "Key events"]
  labels.forEach((label, i) => {
    const c = num(curVals[i]?.value)
    const p = num(prevVals[i]?.value)
    const fmt = label === "Engagement rate" ? `${(c * 100).toFixed(1)}%` : String(Math.round(c))
    const fmtP = label === "Engagement rate" ? `${(p * 100).toFixed(1)}%` : String(Math.round(p))
    out.push(`| ${label} | ${fmt} | ${fmtP}${delta(c, p)} |`)
  })

  /* --- GA4 channels --- */
  const channels = await ga4Report(token, {
    dateRanges: [current],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "keyEvents" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  })
  out.push(``, `## GA4 — sessions by channel`)
  out.push(`| Channel | Sessions | Key events |`)
  out.push(`|---|---|---|`)
  for (const row of channels.rows ?? []) {
    out.push(
      `| ${row.dimensionValues?.[0]?.value ?? "?"} | ${Math.round(num(row.metricValues?.[0]?.value))} | ${Math.round(num(row.metricValues?.[1]?.value))} |`,
    )
  }

  /* --- GA4 top pages --- */
  const pages = await ga4Report(token, {
    dateRanges: [current],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 15,
  })
  out.push(``, `## GA4 — top pages`)
  out.push(`| Page | Sessions |`)
  out.push(`|---|---|`)
  for (const row of pages.rows ?? []) {
    out.push(`| ${row.dimensionValues?.[0]?.value ?? "?"} | ${Math.round(num(row.metricValues?.[0]?.value))} |`)
  }

  /* --- Google Ads cost data via the GA4 link --- */
  const ads = await ga4Report(token, {
    dateRanges: [current],
    dimensions: [{ name: "sessionGoogleAdsCampaignName" }],
    metrics: [
      { name: "advertiserAdCost" },
      { name: "advertiserAdClicks" },
      { name: "advertiserAdImpressions" },
      { name: "sessions" },
      { name: "keyEvents" },
    ],
    orderBys: [{ metric: { metricName: "advertiserAdCost" }, desc: true }],
    limit: 10,
  })
  const adsRows = (ads.rows ?? []).filter(
    (r) => num(r.metricValues?.[0]?.value) > 0 || num(r.metricValues?.[1]?.value) > 0,
  )
  out.push(``, `## Google Ads (via GA4 link)`)
  if (adsRows.length === 0) {
    out.push(`No Ads cost data in this period (not linked or no active campaigns).`)
  } else {
    out.push(`| Campaign | Cost € | Clicks | Impr. | Sessions | Key events |`)
    out.push(`|---|---|---|---|---|---|`)
    for (const row of adsRows) {
      const m = row.metricValues ?? []
      out.push(
        `| ${row.dimensionValues?.[0]?.value ?? "?"} | ${num(m[0]?.value).toFixed(2)} | ${Math.round(num(m[1]?.value))} | ${Math.round(num(m[2]?.value))} | ${Math.round(num(m[3]?.value))} | ${Math.round(num(m[4]?.value))} |`,
      )
    }
  }

  /* --- GSC totals --- */
  const gscTotals = await gscQuery(token, {
    startDate: current.startDate,
    endDate: current.endDate,
    dimensions: [],
  })
  const t = gscTotals.rows?.[0]
  out.push(``, `## Search Console — totals`)
  if (t) {
    out.push(
      `Clicks **${Math.round(t.clicks)}** · Impressions **${Math.round(t.impressions)}** · CTR **${(t.ctr * 100).toFixed(2)}%** · Avg position **${t.position.toFixed(1)}**`,
    )
  } else {
    out.push(`No GSC data for this period.`)
  }

  /* --- GSC top queries / pages --- */
  const gscQueries = await gscQuery(token, {
    startDate: current.startDate,
    endDate: current.endDate,
    dimensions: ["query"],
    rowLimit: 20,
  })
  out.push(``, `## GSC — top queries`)
  out.push(`| Query | Clicks | Impr. | CTR | Pos |`)
  out.push(`|---|---|---|---|---|`)
  for (const row of (gscQueries.rows ?? []).slice(0, 20)) {
    out.push(
      `| ${row.keys?.[0] ?? "?"} | ${Math.round(row.clicks)} | ${Math.round(row.impressions)} | ${(row.ctr * 100).toFixed(1)}% | ${row.position.toFixed(1)} |`,
    )
  }

  const gscPages = await gscQuery(token, {
    startDate: current.startDate,
    endDate: current.endDate,
    dimensions: ["page"],
    rowLimit: 15,
  })
  out.push(``, `## GSC — top pages`)
  out.push(`| Page | Clicks | Impr. | CTR | Pos |`)
  out.push(`|---|---|---|---|---|`)
  for (const row of (gscPages.rows ?? []).slice(0, 15)) {
    out.push(
      `| ${row.keys?.[0] ?? "?"} | ${Math.round(row.clicks)} | ${Math.round(row.impressions)} | ${(row.ctr * 100).toFixed(1)}% | ${row.position.toFixed(1)} |`,
    )
  }

  console.log(out.join("\n"))
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
