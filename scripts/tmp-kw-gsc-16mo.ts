/**
 * TEMP: exact GSC stats for the core keyword set over the full 16-month GSC window.
 * GSC impressions are exact measured counts (not estimates). For queries where we
 * rank on page 1 for the whole period, impressions ≈ true total searches.
 *
 * Output: tmp/kw-gsc-16mo.json + console summary (monthly series per query).
 * Run: npx tsx scripts/tmp-kw-gsc-16mo.ts
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs"
import { getGoogleAccessToken, postJson } from "../lib/reporting/google-auth"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    if (process.env[t.slice(0, eq).trim()] === undefined) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
}
loadEnvLocal()

const GSC_SITE_URL = process.env.GSC_SITE_URL!

interface GscRow {
  keys?: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

async function main() {
  const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/webmasters.readonly"])
  const site = encodeURIComponent(GSC_SITE_URL)
  const query = (body: Record<string, unknown>) =>
    postJson<{ rows?: GscRow[] }>(
      `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
      token,
      body,
    )

  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setMonth(start.getMonth() - 16)
  const startDate = start.toISOString().slice(0, 10)
  const endDate = end.toISOString().slice(0, 10)
  console.log(`GSC window: ${startDate} .. ${endDate}`)

  // query+date daily rows for 16 months, then aggregate monthly per query
  const rows: GscRow[] = []
  let startRow = 0
  for (;;) {
    const resp = await query({
      startDate,
      endDate,
      dimensions: ["query", "date"],
      rowLimit: 25000,
      startRow,
    })
    const batch = resp.rows ?? []
    rows.push(...batch)
    if (batch.length < 25000) break
    startRow += 25000
  }
  console.log(`rows pulled: ${rows.length}`)

  const CORE = [
    "puhastusteenused", "puhastusteenused tallinnas", "puhastusteenused tallinn",
    "koristusteenus", "koristusteenused", "koristusteenus tallinnas", "koristusteenused tallinnas",
    "koristusfirma", "koristusfirma tallinnas", "koristusfirmad", "koristusfirmad tallinnas",
    "puhastusfirma", "puhastusfirmad", "koristusettevõte",
    "kontori koristus", "kontorikoristus", "büroo koristus", "hoolduskoristus",
    "trepikoja koristus", "trepikodade koristus", "kojamehe teenus",
    "äripindade koristus", "kaubanduspindade koristus",
    "akende pesu", "akende pesu tallinnas", "suurpuhastus", "ehitusjärgne koristus",
    "põrandate süvapesu", "fassaadipesu", "tööstuskoristus", "desinfitseerimine",
    "välikoristus", "lumekoristus", "kinnisvarahooldus",
    "клининг таллинн", "мойка окон таллинн", "cleaning company tallinn", "cleaning services tallinn",
  ]

  interface QStat {
    monthly: Record<string, { impr: number; clicks: number; posW: number }>
    totalImpr: number
    totalClicks: number
  }
  const byQuery = new Map<string, QStat>()
  for (const r of rows) {
    const q = (r.keys?.[0] ?? "").toLowerCase()
    const date = r.keys?.[1] ?? ""
    const month = date.slice(0, 7)
    if (!byQuery.has(q)) byQuery.set(q, { monthly: {}, totalImpr: 0, totalClicks: 0 })
    const s = byQuery.get(q)!
    const m = (s.monthly[month] ??= { impr: 0, clicks: 0, posW: 0 })
    m.impr += r.impressions
    m.clicks += r.clicks
    m.posW += r.position * r.impressions
    s.totalImpr += r.impressions
    s.totalClicks += r.clicks
  }

  writeFileSync("tmp/kw-gsc-16mo.json", JSON.stringify(Object.fromEntries(byQuery), null, 1), "utf-8")

  // console summary for core queries: last-3-full-months avg + 16mo totals + weighted pos (recent 90d)
  const months = [...new Set(rows.map((r) => (r.keys?.[1] ?? "").slice(0, 7)))].sort()
  const fullMonths = months.slice(0, -1) // current month is partial
  const last3 = fullMonths.slice(-3)
  console.log(`full months available: ${fullMonths[0]} .. ${fullMonths[fullMonths.length - 1]}; last3 = ${last3.join(", ")}`)
  console.log("\nquery | 16mo impr | 16mo clicks | last-3-full-months avg impr/mo | recent90d pos")
  for (const q of CORE) {
    const s = byQuery.get(q)
    if (!s) {
      console.log(`${q} | 0 | 0 | 0 | -`)
      continue
    }
    const l3 = last3.reduce((sum, m) => sum + (s.monthly[m]?.impr ?? 0), 0) / last3.length
    // recent 90d position
    const cutoff = new Date(end)
    cutoff.setDate(cutoff.getDate() - 90)
    let posW = 0,
      impr90 = 0
    for (const r of rows) {
      const rq = (r.keys?.[0] ?? "").toLowerCase()
      const rd = r.keys?.[1] ?? ""
      if (rq === q && rd >= cutoff.toISOString().slice(0, 10)) {
        posW += r.position * r.impressions
        impr90 += r.impressions
      }
    }
    console.log(`${q} | ${s.totalImpr} | ${s.totalClicks} | ${l3.toFixed(0)} | ${impr90 > 0 ? (posW / impr90).toFixed(1) : "-"}`)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
