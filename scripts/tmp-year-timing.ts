/**
 * Ad-hoc: inquiry timing across the WHOLE year 2026 (incl. the old WP site).
 * New-site DB starts 2026-08-12, so for Jan-Aug we use GA4 events + Ads conversions.
 * Run:  npx tsx scripts/tmp-year-timing.ts
 */

import { existsSync, readFileSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    const v = t.slice(eq + 1).trim()
    if (k && process.env[k] === undefined) process.env[k] = v
  }
}
loadEnvLocal()

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const API = "v25"
const FROM = "2026-01-01"
const TO = "2026-09-26"

const WD_ET = ["E", "T", "K", "N", "R", "L", "P"]
const WD_ADS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
const WD_GA4 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

async function googleToken(scopes: string[]): Promise<string> {
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes })
  const client = await auth.getClient()
  const t = await client.getAccessToken()
  if (!t.token) throw new Error("SA token failed")
  return t.token
}

type Row = Record<string, Record<string, unknown> | undefined>
function snakeKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(snakeKeys)
  if (v !== null && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, x]) => [
        k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`),
        snakeKeys(x),
      ]),
    )
  }
  return v
}
const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))

async function gaql(token: string, query: string): Promise<Row[]> {
  const url = `https://googleads.googleapis.com/${API}/customers/${CUSTOMER_ID}/googleAds:search`
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
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 300)}\nQ: ${query}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

interface Ga4Report {
  rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[]
}
async function ga4(token: string, dims: string[], mets: string[], from: string, to: string) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: dims.map((name) => ({ name })),
        metrics: mets.map((name) => ({ name })),
        limit: 100000,
      }),
    },
  )
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = (await res.json()) as Ga4Report
  return (data.rows ?? []).map((r) => ({
    dims: (r.dimensionValues ?? []).map((d) => d.value ?? ""),
    vals: (r.metricValues ?? []).map((m) => Number(m.value ?? 0)),
  }))
}

function wdTable(title: string, arr: number[], total?: number) {
  const t = total ?? arr.reduce((a, b) => a + b, 0)
  console.log(`${title} (kokku ${Math.round(t)}):`)
  console.log("  " + arr.map((v, i) => `${WD_ET[i]} ${typeof v === "number" && v % 1 !== 0 ? v.toFixed(1) : v}`).join("  "))
  if (t > 0) {
    console.log("  osakaal: " + arr.map((v, i) => `${WD_ET[i]} ${((v / t) * 100).toFixed(0)}%`).join("  "))
  }
}

async function main() {
  console.log(`# Aasta-pikkune ajastusanaluus (${FROM} -> ${TO})\n`)

  /* ---------- GA4 ---------- */
  const gaToken = await googleToken(["https://www.googleapis.com/auth/analytics.readonly"])

  const byDate = await ga4(gaToken, ["date"], ["sessions"], FROM, TO)
  const dates = byDate.map((r) => r.dims[0]).sort()
  console.log(`GA4 andmestik: ${dates[0] ?? "-"} ... ${dates[dates.length - 1] ?? "-"} (${dates.length} paeva)`)

  const events = await ga4(gaToken, ["eventName"], ["eventCount"], FROM, TO)
  events.sort((a, b) => b.vals[0] - a.vals[0])
  console.log(`\n## GA4 sundmused (top 20)`)
  for (const e of events.slice(0, 20)) console.log(`  ${e.dims[0]}: ${e.vals[0]}`)

  const formRe = /form|lead|contact|submit|conversion|paring|päring|generate/i
  const allFormNames = events.filter((e) => formRe.test(e.dims[0])).map((e) => e.dims[0])
  // only real SUBMIT events (form_start = vormi alustamine, mitte saatmine)
  const formNames = allFormNames.filter((n) => !/start/i.test(n))
  console.log(`\nVormitaolised: ${allFormNames.join(", ") || "(puuduvad)"}`)
  console.log(`Jaotustes kasutan ainult saatmis-sundmusi: ${formNames.join(", ")}`)

  if (allFormNames.length > 0) {
    const byMonthEv = await ga4(gaToken, ["yearMonth", "eventName"], ["eventCount"], FROM, TO)
    const months = [...new Set(byMonthEv.map((r) => r.dims[0]))].sort()
    console.log(`\n## Vormisundmused kuude kaupa`)
    console.log(`sundmus | ${months.join(" | ")}`)
    for (const name of allFormNames) {
      const row = months.map((m) => byMonthEv.find((x) => x.dims[0] === m && x.dims[1] === name)?.vals[0] ?? 0)
      console.log(`${name} | ${row.join(" | ")}`)
    }

    for (const range of [
      { label: "vana leht 01.01-11.08", from: FROM, to: "2026-08-11" },
      { label: "uus leht 12.08-26.09", from: "2026-08-12", to: TO },
    ]) {
      const byWd = await ga4(gaToken, ["dayOfWeekName", "eventName"], ["eventCount"], range.from, range.to)
      const arr = Array(7).fill(0) as number[]
      for (const r of byWd) {
        if (!formNames.includes(r.dims[1])) continue
        const i = WD_GA4.indexOf(r.dims[0])
        if (i >= 0) arr[i] += r.vals[0]
      }
      wdTable(`\nVormisundmused nadalapaeviti (${range.label})`, arr)

      const byHour = await ga4(gaToken, ["hour", "eventName"], ["eventCount"], range.from, range.to)
      const hArr = Array(24).fill(0) as number[]
      for (const r of byHour) {
        if (!formNames.includes(r.dims[1])) continue
        hArr[Number(r.dims[0])] += r.vals[0]
      }
      console.log(`Vormisundmused tunniti (${range.label}):`)
      console.log("  " + hArr.map((v, h) => `${String(h).padStart(2, "0")}:${v}`).filter((s) => !s.endsWith(":0")).join("  "))
    }
  }

  const sessWd = await ga4(gaToken, ["dayOfWeekName"], ["sessions"], FROM, TO)
  const sessArr = Array(7).fill(0) as number[]
  for (const r of sessWd) {
    const i = WD_GA4.indexOf(r.dims[0])
    if (i >= 0) sessArr[i] += r.vals[0]
  }
  wdTable("\nGA4 sessioonid nadalapaeviti (terve aasta)", sessArr)

  /* ---------- Ads ---------- */
  if (!(DEVELOPER_TOKEN && CUSTOMER_ID && existsSync(KEY_FILE))) {
    console.log("\n(Ads API seadistus puudub)")
    return
  }
  const adsToken = await googleToken(["https://www.googleapis.com/auth/adwords"])
  const between = `segments.date BETWEEN '${FROM}' AND '${TO}'`

  console.log(`\n## Ads konversiooni-toimingud`)
  const actions = await gaql(
    adsToken,
    `SELECT conversion_action.name, conversion_action.category, conversion_action.status,
            conversion_action.origin, conversion_action.include_in_conversions_metric
     FROM conversion_action`,
  )
  for (const r of actions) {
    console.log(
      `  ${r.conversion_action?.name} | ${r.conversion_action?.category} | ${r.conversion_action?.status} | origin=${r.conversion_action?.origin} | inConv=${r.conversion_action?.include_in_conversions_metric}`,
    )
  }

  console.log(`\n## Ads konversioonid nadalapaeva loikes (all_conversions, per action)`)
  try {
    const convWd = await gaql(
      adsToken,
      `SELECT segments.day_of_week, segments.conversion_action_name, metrics.all_conversions
       FROM campaign WHERE ${between}`,
    )
    const table = new Map<string, number[]>()
    for (const r of convWd) {
      const name = String(r.segments?.conversion_action_name ?? "?")
      const wd = WD_ADS.indexOf(String(r.segments?.day_of_week))
      if (wd < 0) continue
      if (!table.has(name)) table.set(name, Array(7).fill(0))
      table.get(name)![wd] += num(r.metrics?.all_conversions)
    }
    for (const [name, arr] of table) wdTable(name, arr)
  } catch (e) {
    console.log(`  (ebaonnestus: ${e instanceof Error ? e.message.slice(0, 250) : e})`)
  }

  const imprWd = await gaql(
    adsToken,
    `SELECT segments.day_of_week, metrics.impressions, metrics.clicks, metrics.cost_micros
     FROM campaign WHERE ${between}`,
  )
  const iArr = Array(7).fill(0) as number[]
  const cArr = Array(7).fill(0) as number[]
  const costArr = Array(7).fill(0) as number[]
  for (const r of imprWd) {
    const wd = WD_ADS.indexOf(String(r.segments?.day_of_week))
    if (wd < 0) continue
    iArr[wd] += num(r.metrics?.impressions)
    cArr[wd] += num(r.metrics?.clicks)
    costArr[wd] += num(r.metrics?.cost_micros) / 1e6
  }
  wdTable("\nAds naitamised nadalapaeviti (terve aasta)", iArr)
  wdTable("Ads klopsud nadalapaeviti", cArr)
  console.log("Ads kulu EUR: " + costArr.map((v, i) => `${WD_ET[i]} ${v.toFixed(0)}`).join("  "))

  // monthly impressions (was the Mon-Fri schedule in place all year?)
  const imprMonth = await gaql(
    adsToken,
    `SELECT segments.month, metrics.impressions, metrics.clicks FROM campaign WHERE ${between}`,
  )
  console.log(`\n## Ads naitamised kuude kaupa`)
  for (const r of imprMonth.sort((a, b) => String(a.segments?.month).localeCompare(String(b.segments?.month)))) {
    console.log(`  ${r.segments?.month}: ${num(r.metrics?.impressions)} naitamist, ${num(r.metrics?.clicks)} klopsu`)
  }

  // hourly all-year
  const imprH = await gaql(
    adsToken,
    `SELECT segments.hour, metrics.impressions, metrics.clicks FROM campaign WHERE ${between}`,
  )
  const hImpr = Array(24).fill(0) as number[]
  for (const r of imprH) hImpr[num(r.segments?.hour)] += num(r.metrics?.impressions)
  console.log(`\nAds naitamised tunniti (terve aasta):`)
  console.log("  " + hImpr.map((v, h) => `${String(h).padStart(2, "0")}:${Math.round(v)}`).join("  "))
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
