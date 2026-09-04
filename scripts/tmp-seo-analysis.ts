/**
 * TEMP analysis script: conversion reconciliation (July) + keyword/GSC data pull.
 * Run: npx tsx scripts/tmp-seo-analysis.ts  (delete after use)
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

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

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/webmasters.readonly",
    ],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("no token")
  return token.token
}

async function postJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${url} -> ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return (await res.json()) as T
}

const ga4 = (token: string, body: Record<string, unknown>) =>
  postJson<any>(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`, token, body)

const gsc = (token: string, body: Record<string, unknown>) =>
  postJson<any>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL!)}/searchAnalytics/query`, token, body)

/* Periods (GSC/GA4 lag ~2 days; today = 2026-08-26) */
const PERIODS = {
  july: { startDate: "2026-07-01", endDate: "2026-07-31" },          // reconciliation month
  prev28: { startDate: "2026-06-30", endDate: "2026-07-27" },        // eelmine 28p
  cur28: { startDate: "2026-07-28", endDate: "2026-08-24" },         // viimane 28p
  preLaunch: { startDate: "2026-07-20", endDate: "2026-08-16" },     // 28p enne uut lehte (launch ~17.08)
  postLaunch: { startDate: "2026-08-17", endDate: "2026-08-24" },    // 8p pärast uut lehte
}

const KEYWORDS = [
  "puhastusteenused", "puhastusteenused tallinnas", "koristusteenused", "koristusteenused tallinnas",
  "puhastusfirma", "puhastusfirma tallinnas", "koristusfirma", "koristusfirma tallinnas",
  "kontorikoristus", "kontorite koristus", "kontorikoristus tallinnas", "hoolduskoristus",
  "äripindade koristus", "büroode koristus", "eripuhastustööd", "akende pesu",
  "akende pesu tallinnas", "põrandate süvapesu", "suurpuhastus", "fassaadipesu", "tööstuskoristus",
]

function rowsByQuery(resp: any): Map<string, { clicks: number; impressions: number; ctr: number; position: number }> {
  const map = new Map<string, { clicks: number; impressions: number; ctr: number; position: number }>()
  for (const row of resp.rows ?? []) {
    const q = (row.keys?.[0] ?? "").toLowerCase()
    if (!map.has(q)) map.set(q, { clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })
  }
  return map
}

async function main() {
  const token = await getAccessToken()
  const out: any = { periods: PERIODS }

  /* ============ 1. DB: tegelikud päringud ============ */
  const { getFormSubmissions } = await import("@/lib/form-submissions")
  const julyRows = await getFormSubmissions({ from: "2026-07-01", to: "2026-07-31" })
  const augRows = await getFormSubmissions({ from: "2026-08-01", to: "2026-08-26" })
  const agg = (rows: any[]) => ({
    total: rows.length,
    contact: rows.filter((r) => r.form === "contact").length,
    career: rows.filter((r) => r.form === "career").length,
    spam: rows.filter((r) => r.isSpam).length,
    contactNotSpam: rows.filter((r) => r.form === "contact" && !r.isSpam).length,
    careerNotSpam: rows.filter((r) => r.form === "career" && !r.isSpam).length,
    contactSpam: rows.filter((r) => r.form === "contact" && r.isSpam).length,
    careerSpam: rows.filter((r) => r.form === "career" && r.isSpam).length,
    byLocale: rows.reduce((acc: any, r) => { acc[r.locale] = (acc[r.locale] ?? 0) + 1; return acc }, {}),
  })
  out.db = { july: agg(julyRows), augustToDate: agg(augRows) }

  /* ============ 2. GA4 juuli: sündmused + konversioonid ============ */
  const num = (v: string | undefined) => (v ? Number(v) : 0)
  const mapRows = (resp: any) =>
    (resp.rows ?? []).map((r: any) => ({
      dims: (r.dimensionValues ?? []).map((d: any) => d.value),
      metrics: (r.metricValues ?? []).map((m: any) => num(m.value)),
    }))

  out.ga4 = {}
  // July: events by name (count + key events)
  out.ga4.julyEventsByName = mapRows(await ga4(token, {
    dateRanges: [PERIODS.july],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "keyEvents" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 40,
  }))
  // July: key events by channel
  out.ga4.julyKeyEventsByChannel = mapRows(await ga4(token, {
    dateRanges: [PERIODS.july],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "keyEvents" }],
    orderBys: [{ metric: { metricName: "keyEvents" }, desc: true }],
    limit: 15,
  }))
  // July: totals
  out.ga4.julyTotals = mapRows(await ga4(token, {
    dateRanges: [PERIODS.july],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "keyEvents" }],
  }))
  // July: Ads via GA4 link
  out.ga4.julyAds = mapRows(await ga4(token, {
    dateRanges: [PERIODS.july],
    dimensions: [{ name: "sessionGoogleAdsCampaignName" }],
    metrics: [
      { name: "advertiserAdCost" }, { name: "advertiserAdClicks" }, { name: "advertiserAdImpressions" },
      { name: "sessions" }, { name: "keyEvents" },
    ],
    orderBys: [{ metric: { metricName: "advertiserAdCost" }, desc: true }],
    limit: 15,
  }))
  // Post-launch (new site) events for comparison
  out.ga4.postLaunchEventsByName = mapRows(await ga4(token, {
    dateRanges: [PERIODS.postLaunch],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "keyEvents" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 40,
  }))

  /* ============ 3. GSC: perioodide query-taseme andmed ============ */
  out.gsc = { keywords: {}, topQueriesCur28: [], totals: {}, keywordPages: {}, allQueries: {} }
  for (const [name, range] of Object.entries(PERIODS)) {
    const resp = await gsc(token, { ...range, dimensions: ["query"], rowLimit: 5000 })
    // keep ALL queries per period for local family aggregation
    out.gsc.allQueries[name] = (resp.rows ?? []).map((r: any) => ({ q: (r.keys?.[0] ?? "").toLowerCase(), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }))
    const byQuery = rowsByQuery(resp)
    for (const kw of KEYWORDS) {
      const stats = byQuery.get(kw)
      if (stats) {
        out.gsc.keywords[kw] = out.gsc.keywords[kw] ?? {}
        out.gsc.keywords[kw][name] = stats
      }
    }
    if (name === "cur28") {
      out.gsc.topQueriesCur28 = (resp.rows ?? [])
        .slice(0, 80)
        .map((r: any) => ({ q: r.keys?.[0], clicks: r.clicks, impr: r.impressions, ctr: r.ctr, pos: r.position }))
    }
    // period totals
    const totals = await gsc(token, { ...range, dimensions: [] })
    out.gsc.totals[name] = totals.rows?.[0] ?? null
  }

  // keyword -> leht (viimane 28p) - dump ALL query+page rows for local aggregation
  const qp = await gsc(token, { ...PERIODS.cur28, dimensions: ["query", "page"], rowLimit: 25000 })
  out.gsc.queryPageRows = (qp.rows ?? []).map((r: any) => ({
    q: (r.keys?.[0] ?? "").toLowerCase(), page: r.keys?.[1], clicks: r.clicks, impr: r.impressions, pos: r.position,
  }))

  const file = `${process.env.TEMP ?? "."}/seo-data.json`
  writeFileSync(file, JSON.stringify(out, null, 1), "utf-8")
  console.log("written to", file)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
