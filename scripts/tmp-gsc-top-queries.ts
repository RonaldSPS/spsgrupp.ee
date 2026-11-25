/**
 * TEMP: GSC top queries with their landing pages, last N days (default 90).
 * Aggregates per query: clicks, impressions, CTR, weighted avg position,
 * and the top landing pages by impressions.
 * Run: npx tsx scripts/tmp-gsc-top-queries.ts [--days=90]
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

const daysFlag = process.argv.find((a) => a.startsWith("--days="))
const DAYS = daysFlag ? Math.max(1, parseInt(daysFlag.slice(7), 10) || 90) : 90

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

async function gsc(token: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL!)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) throw new Error(`GSC -> ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

const pathOf = (url: string) => {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

async function main() {
  if (!GSC_SITE_URL) throw new Error("GSC_SITE_URL not set")
  const token = await getAccessToken()

  const end = new Date()
  end.setDate(end.getDate() - 2) // GSC data lags ~2 days
  const start = new Date(end)
  start.setDate(start.getDate() - DAYS + 1)
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const range = { startDate: iso(start), endDate: iso(end) }

  const allRows: any[] = []
  let startRow = 0
  for (;;) {
    const resp = await gsc(token, {
      ...range,
      dimensions: ["query", "page"],
      rowLimit: 25000,
      startRow,
    })
    const rows = resp.rows ?? []
    allRows.push(...rows)
    console.error(`fetched ${rows.length} rows (total ${allRows.length})`)
    if (rows.length < 25000) break
    startRow += 25000
  }

  type Agg = {
    clicks: number
    impressions: number
    posWeight: number
    pages: Map<string, { clicks: number; impressions: number }>
  }
  const byQuery = new Map<string, Agg>()
  for (const r of allRows) {
    const q = String(r.keys?.[0] ?? "")
    const page = pathOf(String(r.keys?.[1] ?? ""))
    const a = byQuery.get(q) ?? { clicks: 0, impressions: 0, posWeight: 0, pages: new Map() }
    a.clicks += r.clicks
    a.impressions += r.impressions
    a.posWeight += r.position * r.impressions
    const p = a.pages.get(page) ?? { clicks: 0, impressions: 0 }
    p.clicks += r.clicks
    p.impressions += r.impressions
    a.pages.set(page, p)
    byQuery.set(q, a)
  }

  const sorted = [...byQuery.entries()].sort((a, b) => b[1].impressions - a[1].impressions)

  console.log(`# GSC top queries (query+page), ${range.startDate} -> ${range.endDate}`)
  console.log(`Queries total: ${sorted.length} (anonymized queries are not in the API)\n`)
  console.log(`| # | Query | Impr. | Clicks | CTR | Pos | Top landing pages (impr.) |`)
  console.log(`|---|---|---|---|---|---|---|`)
  const TOP = 60
  sorted.slice(0, TOP).forEach(([q, a], i) => {
    const ctr = a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(1) + "%" : "-"
    const pos = a.impressions ? (a.posWeight / a.impressions).toFixed(1) : "-"
    const pages = [...a.pages.entries()]
      .sort((x, y) => y[1].impressions - x[1].impressions)
      .slice(0, 3)
      .map(([p, v]) => `${p} (${v.impressions})`)
      .join("<br>")
    console.log(`| ${i + 1} | ${q} | ${a.impressions} | ${a.clicks} | ${ctr} | ${pos} | ${pages} |`)
  })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
