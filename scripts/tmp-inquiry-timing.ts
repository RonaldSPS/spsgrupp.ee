/**
 * Ad-hoc analysis: WHEN do inquiries arrive vs WHEN do ads show?
 *
 * 1. form_submissions (DB)  -> weekday + hour distribution (Europe/Tallinn)
 * 2. Google Ads API (GAQL)  -> impressions/clicks/cost by day_of_week + hour
 * 3. GA4 Data API           -> sessions by dayOfWeekName/hour x channel group
 *
 * Run:  npx tsx scripts/tmp-inquiry-timing.ts
 */

import postgres from "postgres"
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

const DATABASE_URL = process.env.DATABASE_URL
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const ADS_API_VERSION = "v25"

/* ---------- time helpers (Europe/Tallinn) ---------- */

const WD_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
const WD_ET = ["E", "T", "K", "N", "R", "L", "P"] as const

const partsFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Tallinn",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short",
})

function tallinn(d: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(d).map((x) => [x.type, x.value]))
  const hour = parseInt(p.hour, 10) % 24
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    hour,
    time: `${String(hour).padStart(2, "0")}:${p.minute}`,
    wd: WD_EN.indexOf(p.weekday as (typeof WD_EN)[number]),
  }
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/* ---------- Google auth ---------- */

async function googleToken(scopes: string[]): Promise<string> {
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("service-account access token failed")
  return token.token
}

/* ---------- Ads GAQL ---------- */

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
      throw new Error(`GAQL failed (${res.status}): ${text.slice(0, 400)}\nQuery: ${query}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))

/* ---------- GA4 ---------- */

interface Ga4Report {
  rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[]
}

async function ga4Report(token: string, dimensions: string[]): Promise<{ dims: string[]; sessions: number }[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: ANALYSIS_FROM, endDate: ANALYSIS_TO }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: [{ name: "sessions" }],
        limit: 10000,
      }),
    },
  )
  if (!res.ok) throw new Error(`GA4 failed (${res.status}): ${(await res.text()).slice(0, 300)}`)
  const data = (await res.json()) as Ga4Report
  return (data.rows ?? []).map((r) => ({
    dims: (r.dimensionValues ?? []).map((d) => d.value ?? ""),
    sessions: Number(r.metricValues?.[0]?.value ?? 0),
  }))
}

/* ---------- main ---------- */

let ANALYSIS_FROM = ""
let ANALYSIS_TO = ""

async function main() {
  if (!DATABASE_URL) throw new Error("DATABASE_URL missing")

  /* --- 1. submissions from DB --- */
  const sql = postgres(DATABASE_URL, { max: 1, prepare: false, connect_timeout: 10 })
  type Sub = {
    id: number; form: string; is_spam: boolean; name: string; email: string
    source: string | null; gclid: string | null; page_url: string | null; created_at: Date
  }
  let subs: Sub[]
  try {
    subs = await sql<Sub[]>`
      select id, form, is_spam, name, email, source, gclid, page_url, created_at
      from form_submissions order by created_at asc
    `
  } finally {
    await sql.end()
  }

  const isTest = (s: Sub) =>
    /test/i.test(s.name ?? "") ||
    (s.email ?? "").endsWith("@outline.ee") ||
    (s.page_url ?? "").includes("gtm_debug")

  const contact = subs.filter((s) => s.form === "contact" && !s.is_spam && !isTest(s))
  const tests = subs.filter((s) => !s.is_spam && isTest(s))
  const allDates = subs.map((s) => s.created_at.getTime())

  const first = new Date(Math.min(...allDates))
  // Ads/GA4 data lags ~2 days
  const end = new Date()
  end.setDate(end.getDate() - 2)
  ANALYSIS_FROM = tallinn(first).date
  ANALYSIS_TO = iso(end)

  console.log(`# Päringute ajastus vs reklaamide näitamise aeg`)
  console.log(`Periood: ${ANALYSIS_FROM} -> ${ANALYSIS_TO} (Eesti aeg; Ads/GA4 lõpp -2p andmeviivituse tõttu)`)
  console.log(
    `Päringuid DB-s kokku: ${subs.length} (contact mitte-spämm mitte-test: ${contact.length}; ` +
      `spämm: ${subs.filter((s) => s.is_spam).length}; test-ridadest välja jäetud: ${tests.length}; ` +
      `career: ${subs.filter((s) => s.form === "career" && !s.is_spam).length})`,
  )

  // weekday occurrences inside the analysis window (for per-day normalization)
  const wdCount = Array(7).fill(0) as number[]
  {
    const d = new Date(`${ANALYSIS_FROM}T12:00:00Z`)
    const endD = new Date(`${ANALYSIS_TO}T12:00:00Z`)
    while (d <= endD) {
      wdCount[tallinn(d).wd]++ // Mon=0, Europe/Tallinn calendar day
      d.setUTCDate(d.getUTCDate() + 1)
    }
  }

  /* --- submissions by weekday / hour --- */
  const subByWd = Array(7).fill(0) as number[]
  const subByHour = Array(24).fill(0) as number[]
  const subByWdAds = Array(7).fill(0) as number[] // source=google_ads or gclid present
  const adsAttributed = (s: Sub) => s.source === "google_ads" || Boolean(s.gclid) || (s.page_url ?? "").includes("gclid=")
  const detailLines: string[] = []
  for (const s of contact) {
    const t = tallinn(new Date(s.created_at))
    subByWd[t.wd]++
    subByHour[t.hour]++
    if (adsAttributed(s)) subByWdAds[t.wd]++
    detailLines.push(
      `  ${t.date} ${WD_ET[t.wd]} ${t.time}  src=${s.source || "-"}${adsAttributed(s) ? " [ADS]" : ""}  ${s.name}`,
    )
  }

  console.log(`\n## Kõik kontaktpäringud (Eesti aeg)`)
  console.log(detailLines.join("\n"))

  /* --- 2. Ads API --- */
  console.log(`\n## Google Ads — näitamised/klõpsud/kulu nädalapäeva ja tunni lõikes`)
  let adsByWd: { wd: number; impr: number; clicks: number; cost: number }[] = []
  let adsByHour: { hour: number; impr: number; clicks: number; cost: number }[] = []
  let adsTz = "(teadmata)"
  if (DEVELOPER_TOKEN && CUSTOMER_ID && existsSync(KEY_FILE)) {
    const token = await googleToken(["https://www.googleapis.com/auth/adwords"])
    const between = `segments.date BETWEEN '${ANALYSIS_FROM}' AND '${ANALYSIS_TO}'`
    try {
      const tzRows = await gaql(token, `SELECT customer.time_zone FROM customer LIMIT 1`)
      adsTz = String(tzRows[0]?.customer?.time_zone ?? "(teadmata)")
    } catch { /* ignore */ }

    const agg = (rows: Row[], keyFn: (r: Row) => number) => {
      const m = new Map<number, { impr: number; clicks: number; cost: number }>()
      for (const r of rows) {
        const k = keyFn(r)
        const cur = m.get(k) ?? { impr: 0, clicks: 0, cost: 0 }
        cur.impr += num(r.metrics?.impressions)
        cur.clicks += num(r.metrics?.clicks)
        cur.cost += num(r.metrics?.cost_micros) / 1e6
        m.set(k, cur)
      }
      return m
    }
    const WD_ADS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
    try {
      // one query with both segments
      const rows = await gaql(
        token,
        `SELECT segments.day_of_week, segments.hour, metrics.impressions, metrics.clicks, metrics.cost_micros
         FROM campaign WHERE ${between}`,
      )
      const mWd = agg(rows, (r) => WD_ADS.indexOf(String(r.segments?.day_of_week)))
      const mH = agg(rows, (r) => num(r.segments?.hour))
      adsByWd = [...mWd.entries()].map(([wd, v]) => ({ wd, ...v }))
      adsByHour = [...mH.entries()].map(([hour, v]) => ({ hour, ...v }))
    } catch {
      // fallback: separate queries
      const rowsWd = await gaql(
        token,
        `SELECT segments.day_of_week, metrics.impressions, metrics.clicks, metrics.cost_micros
         FROM campaign WHERE ${between}`,
      )
      const mWd = agg(rowsWd, (r) => WD_ADS.indexOf(String(r.segments?.day_of_week)))
      adsByWd = [...mWd.entries()].map(([wd, v]) => ({ wd, ...v }))
      const rowsH = await gaql(
        token,
        `SELECT segments.hour, metrics.impressions, metrics.clicks, metrics.cost_micros
         FROM campaign WHERE ${between}`,
      )
      const mH = agg(rowsH, (r) => num(r.segments?.hour))
      adsByHour = [...mH.entries()].map(([hour, v]) => ({ hour, ...v }))
    }
    console.log(`Ads konto ajavöönd: ${adsTz}`)
  } else {
    console.log("(Ads API seadistus puudub — jätan vahele)")
  }

  /* --- 3. GA4 --- */
  const ga4ByWd = new Map<string, Map<string, number>>() // weekday -> channel -> sessions
  const ga4ByHour = new Map<number, Map<string, number>>()
  if (GA4_PROPERTY_ID && existsSync(KEY_FILE)) {
    const token = await googleToken(["https://www.googleapis.com/auth/analytics.readonly"])
    const rowsWd = await ga4Report(token, ["dayOfWeekName", "sessionDefaultChannelGroup"])
    for (const r of rowsWd) {
      const [wd, ch] = r.dims
      if (!ga4ByWd.has(wd)) ga4ByWd.set(wd, new Map())
      const m = ga4ByWd.get(wd)!
      m.set(ch, (m.get(ch) ?? 0) + r.sessions)
    }
    const rowsH = await ga4Report(token, ["hour", "sessionDefaultChannelGroup"])
    for (const r of rowsH) {
      const [h, ch] = r.dims
      const hour = Number(h)
      if (!ga4ByHour.has(hour)) ga4ByHour.set(hour, new Map())
      const m = ga4ByHour.get(hour)!
      m.set(ch, (m.get(ch) ?? 0) + r.sessions)
    }
  }

  /* --- 4. combined tables --- */
  const GA4_WD_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const adsWdMap = new Map(adsByWd.map((x) => [x.wd, x]))
  const totSub = subByWd.reduce((a, b) => a + b, 0)
  const totImpr = adsByWd.reduce((a, b) => a + b.impr, 0)
  const totClicks = adsByWd.reduce((a, b) => a + b.clicks, 0)

  console.log(`\n## KOKKUVÕTE: nädalapäeviti (keskmine ühe nädalapäeva-esinemise kohta)`)
  console.log(
    `| Päev | Päringuid | Päringu keskm/päev | millest Ads-jällega | Ads näitamisi | Ads klõpse | Ads kulu € | GA4 sessioone (Paid Search) | GA4 sessioone kokku |`,
  )
  console.log(`|---|---|---|---|---|---|---|---|---|`)
  for (let wd = 0; wd < 7; wd++) {
    const n = wdCount[wd] || 1
    const ads = adsWdMap.get(wd)
    const ga4m = ga4ByWd.get(GA4_WD_EN[wd])
    let ga4Paid = 0, ga4Tot = 0
    if (ga4m) for (const [ch, v] of ga4m) { ga4Tot += v; if (ch === "Paid Search" || ch === "Cross-network") ga4Paid += v }
    console.log(
      `| ${WD_ET[wd]} | ${subByWd[wd]} | ${(subByWd[wd] / n).toFixed(1)} | ${subByWdAds[wd]} | ` +
        `${ads ? Math.round(ads.impr / n) : "-"} | ${ads ? (ads.clicks / n).toFixed(1) : "-"} | ` +
        `${ads ? (ads.cost / n).toFixed(2) : "-"} | ${ga4Paid || "-"} | ${ga4Tot || "-"} |`,
    )
  }
  console.log(
    `\nKeskmised on normaliseeritud: perioodis on iga nädalapäeva ${wdCount[0]}–${wdCount[6]} korda ` +
      `(E ${wdCount[0]}, T ${wdCount[1]}, K ${wdCount[2]}, N ${wdCount[3]}, R ${wdCount[4]}, L ${wdCount[5]}, P ${wdCount[6]}).`,
  )
  if (totImpr > 0) {
    console.log(`Perioodi kokku: ${totSub} päringut, ${Math.round(totImpr)} näitamist, ${totClicks} klõpsu.`)
    console.log(`\nPäringuid 1000 klõpsu kohta nädalapäeviti:`)
    for (let wd = 0; wd < 7; wd++) {
      const ads = adsWdMap.get(wd)
      if (!ads || ads.clicks === 0) continue
      console.log(`  ${WD_ET[wd]}: ${((subByWd[wd] / ads.clicks) * 1000).toFixed(1)}`)
    }
  }

  console.log(`\n## KOKKUVÕTE: kellaajati (Eesti aeg; Ads tunnid konto ajavööndis ${adsTz})`)
  console.log(`| Tund | Päringuid | Ads näitamisi | Ads klõpse | GA4 sessioone (Paid Search) | GA4 sessioone kokku |`)
  console.log(`|---|---|---|---|---|---|`)
  const adsHourMap = new Map(adsByHour.map((x) => [x.hour, x]))
  for (let h = 0; h < 24; h++) {
    const ads = adsHourMap.get(h)
    const ga4m = ga4ByHour.get(h)
    let ga4Paid = 0, ga4Tot = 0
    if (ga4m) for (const [ch, v] of ga4m) { ga4Tot += v; if (ch === "Paid Search" || ch === "Cross-network") ga4Paid += v }
    if (subByHour[h] === 0 && !ads && ga4Tot === 0) continue
    console.log(
      `| ${String(h).padStart(2, "0")}–${String((h + 1) % 24).padStart(2, "0")} | ${subByHour[h] || ""} | ` +
        `${ads ? Math.round(ads.impr) : "-"} | ${ads ? ads.clicks.toFixed(0) : "-"} | ${ga4Paid || "-"} | ${ga4Tot || "-"} |`,
    )
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
