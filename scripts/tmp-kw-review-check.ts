/** TEMP: verify an external SEO review's claimed rankings against fresh GSC data.
 *  Pulls query-level stats for the claimed keywords, last 28 days + since-launch window.
 *  Run: npx tsx scripts/tmp-kw-review-check.ts
 */
import { readFileSync, existsSync } from "node:fs"
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

const GSC_SITE_URL = process.env.GSC_SITE_URL
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"

// Queries exactly as claimed in the review (+ close variants)
const CLAIMED = [
  "kontori koristus tallinnas",
  "kontori koristus",
  "kontorikoristus",
  "tootmishoone koristus",
  "tootmishoonete koristus",
  "hoolduskoristus",
  "koristusteenus",
  "koristusfirma",
  "ladude koristus",
  "äripindade koristus",
]
const STEMS = ["tootmishoone", "tootmishoon", "hoolduskoristus", "koristusfirma", "ladude", "lao ", "äripind", "koristusteenus"]

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("no token")
  return token.token
}

async function gscQuery(token: string, startDate: string, endDate: string): Promise<any[]> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL!)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit: 25000 }),
    },
  )
  if (!res.ok) throw new Error(`GSC -> ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return (await res.json()).rows ?? []
}

function fmt(rows: any[], label: string) {
  const map = new Map<string, any>()
  for (const r of rows) map.set((r.keys?.[0] ?? "").toLowerCase(), r)
  console.log(`\n=== ${label} ===`)
  console.log("query | impressions | clicks | avg position")
  for (const q of CLAIMED) {
    const r = map.get(q)
    console.log(`${q} | ${r?.impressions ?? 0} | ${r?.clicks ?? 0} | ${r ? r.position.toFixed(1) : "-"}`)
  }
  console.log("\n-- stem clusters (all queries containing stem, summed) --")
  for (const stem of STEMS) {
    let impr = 0,
      clicks = 0,
      wpos = 0
    const matched: string[] = []
    for (const r of rows) {
      const q = (r.keys?.[0] ?? "").toLowerCase()
      if (q.includes(stem)) {
        impr += r.impressions
        clicks += r.clicks
        wpos += r.position * r.impressions
        if (r.impressions >= 2) matched.push(`${q}(${r.impressions}i,pos ${r.position.toFixed(0)})`)
      }
    }
    console.log(`${stem} | impr ${impr} | clicks ${clicks} | wpos ${impr ? (wpos / impr).toFixed(1) : "-"} | ${matched.slice(0, 8).join(", ")}`)
  }
}

async function main() {
  if (!GSC_SITE_URL) throw new Error("GSC_SITE_URL not set")
  const token = await getAccessToken()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const end = new Date()
  end.setDate(end.getDate() - 2) // GSC data lag
  const d28 = new Date(end)
  d28.setDate(d28.getDate() - 27)
  const launch = new Date("2026-08-17")

  const [cur28, sinceLaunch] = await Promise.all([
    gscQuery(token, iso(d28), iso(end)),
    gscQuery(token, iso(launch), iso(end)),
  ])
  fmt(cur28, `LAST 28 DAYS (${iso(d28)} .. ${iso(end)})`)
  fmt(sinceLaunch, `SINCE LAUNCH (${iso(launch)} .. ${iso(end)})`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
