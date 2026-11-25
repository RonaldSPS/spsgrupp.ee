/**
 * TEMP: aggregate Ads search terms across campaigns for the last N days.
 * Prints one row per distinct term: cost, clicks, impressions, all conversions.
 * Run: npx tsx scripts/tmp-ads-search-terms-agg.ts [--days=90]
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

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const ADS_API_VERSION = "v25"

const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const DAYS = daysFlag ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 90) : 90

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

async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("no token")
  return token.token
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
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) })
    if (!res.ok) throw new Error(`GAQL failed (${res.status}): ${(await res.text()).slice(0, 400)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))
const iso = (d: Date) => d.toISOString().slice(0, 10)

async function main() {
  const token = await getAccessToken()
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - DAYS + 1)
  const between = `segments.date BETWEEN '${iso(start)}' AND '${iso(end)}'`

  // Account-wide total for the visibility share calc
  const totals = await gaql(token, `SELECT metrics.cost_micros, metrics.clicks, metrics.impressions FROM campaign WHERE ${between}`)
  let totCost = 0
  for (const r of totals) totCost += num(r.metrics?.cost_micros)

  const terms = await gaql(
    token,
    `SELECT search_term_view.search_term, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM search_term_view WHERE ${between}`,
  )

  type Agg = { cost: number; clicks: number; impressions: number; conv: number }
  const byTerm = new Map<string, Agg>()
  let visCost = 0
  for (const r of terms) {
    const t = String(r.search_term_view?.search_term ?? "")
    const m = r.metrics ?? {}
    const a = byTerm.get(t) ?? { cost: 0, clicks: 0, impressions: 0, conv: 0 }
    a.cost += num(m.cost_micros)
    a.clicks += num(m.clicks)
    a.impressions += num(m.impressions)
    a.conv += num(m.all_conversions)
    byTerm.set(t, a)
    visCost += num(m.cost_micros)
  }

  const sorted = [...byTerm.entries()].sort((a, b) => b[1].cost - a[1].cost)
  console.log(`# Ads search terms aggregated across campaigns, ${iso(start)} -> ${iso(end)}`)
  console.log(`Distinct terms: ${sorted.length} · visible cost €${(visCost / 1e6).toFixed(2)} of account total €${(totCost / 1e6).toFixed(2)} (${((visCost / totCost) * 100).toFixed(0)}%)\n`)
  console.log(`| # | Term | Cost € | Clicks | Impr. | CPC € | All conv. |`)
  console.log(`|---|---|---|---|---|---|---|`)
  sorted.slice(0, 50).forEach(([t, a], i) => {
    const cpc = a.clicks ? (a.cost / 1e6 / a.clicks).toFixed(2) : "-"
    console.log(`| ${i + 1} | ${t} | ${(a.cost / 1e6).toFixed(2)} | ${Math.round(a.clicks)} | ${Math.round(a.impressions)} | ${cpc} | ${a.conv.toFixed(1)} |`)
  })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
