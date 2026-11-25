/**
 * TEMP one-off pull for the client keyword/SEO/Ads analysis (16.09.2026 letter).
 * Writes tmp/kw-analysis-data.json with raw data:
 *   - Ads: campaigns, keywords, search terms, negatives, landing pages, ad copy (90d/30d)
 *   - Keyword Planner: Google-wide monthly search volumes for our seed keywords (EE geo)
 *   - GSC: query-level data, current 28d + previous 28d
 *   - GA4: channels + paid landing pages (90d, context only)
 *   - DB: form_submissions with source/gclid/pageUrl attribution (no e-mail/phone PII)
 *
 * Run: npx tsx scripts/tmp-kw-analysis-pull.ts
 * Delete after use (tmp script, keep out of the repo long-term).
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs"
import { getGoogleAccessToken, postJson } from "../lib/reporting/google-auth"
import { getFormSubmissions } from "../lib/form-submissions"

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

const ADS_API_VERSION = "v25"
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const GSC_SITE_URL = process.env.GSC_SITE_URL

type Row = Record<string, Record<string, unknown> | undefined>

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
    "developer-token": DEVELOPER_TOKEN,
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
      throw new Error(`GAQL failed (${res.status}): ${text.slice(0, 500)}\nQuery: ${query.slice(0, 200)}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

/** Keyword Planner: generateKeywordIdeas (up to 20 seeds per call). */
async function keywordIdeas(token: string, seeds: string[], language: string) {
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}:generateKeywordIdeas`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": DEVELOPER_TOKEN,
    "Content-Type": "application/json",
  }
  if (LOGIN_CUSTOMER_ID) headers["login-customer-id"] = LOGIN_CUSTOMER_ID
  const out: unknown[] = []
  for (let i = 0; i < seeds.length; i += 20) {
    const batch = seeds.slice(i, i + 20)
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        keywordSeed: { keywords: batch },
        geoTargetConstants: ["geoTargetConstants/2333"], // Estonia
        language: `languageConstants/${language}`,
        keywordPlanNetwork: "GOOGLE_SEARCH",
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`generateKeywordIdeas failed (${res.status}): ${text.slice(0, 500)}`)
    }
    const data = (await res.json()) as { results?: unknown[] }
    out.push(...(data.results ?? []).map((r) => snakeKeys(r)))
  }
  return out
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const SEEDS_ET = [
  "koristusfirma", "koristusfirma tallinnas", "koristusfirmad", "koristusettevõte",
  "koristusteenus", "koristusteenused", "koristusteenus tallinnas", "koristusteenused tallinnas",
  "puhastusteenused", "puhastusteenused tallinnas", "puhastusfirma", "puhastusettevõte",
  "kontori koristus", "kontorikoristus", "büroo koristus", "büroode koristus",
  "hoolduskoristus", "hoolduskoristus tallinnas", "äripindade koristus", "kaubanduspindade koristus",
  "trepikoja koristus", "trepikodade koristus", "kojamehe teenus",
  "akende pesu", "akende pesu tallinnas", "suurpuhastus", "ehitusjärgne koristus",
  "põrandate süvapesu", "fassaadipesu", "tööstuskoristus",
  "vaipade puhastus", "desinfitseerimine", "ehitusprahi äravedu", "ventilatsiooni puhastus",
]
const SEEDS_EN = [
  "cleaning company", "cleaning services", "cleaning tallinn", "cleaning company tallinn",
  "office cleaning tallinn", "commercial cleaning services", "facility maintenance services",
]
const SEEDS_RU = [
  "клининг таллинн", "клининговая компания", "уборка офисов таллинн", "мойка окон таллинн", "вывоз мусора таллинн",
]

async function main() {
  const token = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/adwords",
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ])

  const end = iso(daysAgo(2)) // 2026-09-14
  const d90 = { from: iso(daysAgo(91)), to: end }
  const d30 = { from: iso(daysAgo(31)), to: end }
  const gscCur = { from: iso(daysAgo(29)), to: end }
  const gscPrev = { from: iso(daysAgo(57)), to: iso(daysAgo(30)) }

  const between90 = `segments.date BETWEEN '${d90.from}' AND '${d90.to}'`
  const between30 = `segments.date BETWEEN '${d30.from}' AND '${d30.to}'`

  console.log(`Periods: 90d ${d90.from}..${d90.to} | 30d ${d30.from}..${d30.to}`)

  // ---------- Ads ----------
  console.log("Ads: campaigns…")
  const adsCampaigns = await gaql(
    token,
    `SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.impressions,
            metrics.ctr, metrics.average_cpc, metrics.conversions, metrics.all_conversions,
            metrics.search_impression_share, metrics.search_rank_lost_impression_share,
            metrics.search_budget_lost_impression_share, metrics.search_top_impression_share
     FROM campaign WHERE ${between90} ORDER BY metrics.cost_micros DESC`,
  )

  console.log("Ads: keywords 90d…")
  const adsKeywords90 = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type, ad_group_criterion.status,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.all_conversions
     FROM keyword_view
     WHERE ${between90} AND ad_group_criterion.status != 'REMOVED' AND ad_group_criterion.negative = FALSE
     ORDER BY metrics.cost_micros DESC LIMIT 500`,
  )

  console.log("Ads: keywords 30d…")
  const adsKeywords30 = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type, ad_group_criterion.status,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.all_conversions
     FROM keyword_view
     WHERE ${between30} AND ad_group_criterion.status != 'REMOVED' AND ad_group_criterion.negative = FALSE
     ORDER BY metrics.cost_micros DESC LIMIT 500`,
  )

  console.log("Ads: search terms 90d…")
  const adsTerms90 = await gaql(
    token,
    `SELECT search_term_view.search_term, campaign.name, ad_group.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.all_conversions
     FROM search_term_view WHERE ${between90} ORDER BY metrics.cost_micros DESC LIMIT 1000`,
  )

  console.log("Ads: search terms 30d…")
  const adsTerms30 = await gaql(
    token,
    `SELECT search_term_view.search_term, campaign.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM search_term_view WHERE ${between30} ORDER BY metrics.cost_micros DESC LIMIT 1000`,
  )

  console.log("Ads: negatives…")
  const negativesCampaign = await gaql(
    token,
    `SELECT campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
     FROM campaign_criterion WHERE campaign_criterion.negative = TRUE AND campaign.status != 'REMOVED'`,
  )
  const negativesAdGroup = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
     FROM ad_group_criterion WHERE ad_group_criterion.negative = TRUE AND campaign.status != 'REMOVED' AND ad_group.status != 'REMOVED'`,
  )

  console.log("Ads: landing pages…")
  const adsLanding = await gaql(
    token,
    `SELECT landing_page_view.unexpanded_final_url, campaign.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM landing_page_view WHERE ${between90} ORDER BY metrics.clicks DESC LIMIT 50`,
  )

  console.log("Ads: ad copy…")
  const adsCopy = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions, ad_group_ad.ad.final_urls
     FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND campaign.status = 'ENABLED'`,
  )

  console.log("Ads: ad groups…")
  const adsGroups = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group.status,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM ad_group WHERE ${between90} AND campaign.status = 'ENABLED' ORDER BY metrics.cost_micros DESC`,
  )

  // ---------- Keyword Planner ----------
  console.log("Keyword Planner (ET/EN/RU, EE geo)…")
  let planner: Record<string, unknown[]> = {}
  try {
    planner = {
      et: await keywordIdeas(token, SEEDS_ET, "1022"),
      en: await keywordIdeas(token, SEEDS_EN, "1000"),
      ru: await keywordIdeas(token, SEEDS_RU, "1031"),
    }
    console.log(`  ideas: et=${planner.et.length} en=${planner.en.length} ru=${planner.ru.length}`)
  } catch (e) {
    console.error(`  Keyword Planner failed: ${e instanceof Error ? e.message : e}`)
    planner = { error: [String(e instanceof Error ? e.message : e)] }
  }

  // ---------- GSC ----------
  console.log("GSC queries…")
  const gscQuery = (body: Record<string, unknown>) =>
    postJson<{ rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }>(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL!)}/searchAnalytics/query`,
      token,
      body,
    )
  const gscCurRows = (await gscQuery({ startDate: gscCur.from, endDate: gscCur.to, dimensions: ["query"], rowLimit: 5000 })).rows ?? []
  const gscPrevRows = (await gscQuery({ startDate: gscPrev.from, endDate: gscPrev.to, dimensions: ["query"], rowLimit: 5000 })).rows ?? []
  const gscTotals = (await gscQuery({ startDate: gscCur.from, endDate: gscCur.to, dimensions: [] })).rows ?? []

  // ---------- GA4 (context) ----------
  console.log("GA4 channels…")
  const ga4 = (body: Record<string, unknown>) =>
    postJson<{ rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[] }>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      token,
      body,
    )
  let ga4Channels: unknown = null
  let ga4PaidLandings: unknown = null
  try {
    ga4Channels = await ga4({
      dateRanges: [{ startDate: d90.from, endDate: d90.to }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "engagedSessions" }, { name: "totalUsers" }],
    })
    ga4PaidLandings = await ga4({
      dateRanges: [{ startDate: d90.from, endDate: d90.to }],
      dimensions: [{ name: "landingPage" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        filter: { fieldName: "sessionDefaultChannelGroup", stringFilter: { value: "Paid Search" } },
      },
      limit: 30,
    })
  } catch (e) {
    console.error(`  GA4 failed: ${e instanceof Error ? e.message : e}`)
  }

  // ---------- DB form submissions ----------
  console.log("Form submissions…")
  const allSubs = await getFormSubmissions({ from: "2026-05-01", to: end })
  const subs = allSubs.map((s) => ({
    createdAt: s.createdAt,
    form: s.form,
    locale: s.locale,
    company: s.company,
    message: (s.message ?? "").slice(0, 220),
    isSpam: s.isSpam,
    pageUrl: s.pageUrl,
    gclid: s.gclid ? true : false,
    source: s.source,
    fee: s.fee,
    profit: s.profit,
  }))

  const out = {
    generatedAt: new Date().toISOString(),
    periods: { d90, d30, gscCur, gscPrev },
    ads: {
      campaigns: adsCampaigns,
      keywords90: adsKeywords90,
      keywords30: adsKeywords30,
      terms90: adsTerms90,
      terms30: adsTerms30,
      negativesCampaign,
      negativesAdGroup,
      landing: adsLanding,
      copy: adsCopy,
      groups: adsGroups,
    },
    planner,
    gsc: { cur: gscCurRows, prev: gscPrevRows, totalsCur: gscTotals },
    ga4: { channels: ga4Channels, paidLandings: ga4PaidLandings },
    submissions: subs,
  }
  writeFileSync("tmp/kw-analysis-data.json", JSON.stringify(out, null, 1), "utf-8")
  console.log(`OK -> tmp/kw-analysis-data.json (${subs.length} submissions, ${gscCurRows.length} GSC queries cur28)`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
