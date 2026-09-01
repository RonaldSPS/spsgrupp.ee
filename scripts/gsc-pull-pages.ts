/**
 * GSC page-level data pull: every URL that got impressions in the last 16 months.
 * Run: npx tsx scripts/gsc-pull-pages.ts
 * Writes: tmp/gsc-pages.json
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs"
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

async function main() {
  if (!GSC_SITE_URL) throw new Error("GSC_SITE_URL not set")
  const token = await getAccessToken()

  // Default: only data after the new site launch (17.08.2026) is actionable.
  // Override for full-history checks: GSC_FROM=2025-05-01 GSC_OUT=tmp/gsc-pages-16mo.json
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(process.env.GSC_FROM ?? "2026-08-17")
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  const range = { startDate: iso(start), endDate: iso(end) }

  // Paginate with startRow (rowLimit cap 25000 per call)
  const allRows: any[] = []
  let startRow = 0
  for (;;) {
    const resp = await gsc(token, {
      ...range,
      dimensions: ["page"],
      rowLimit: 25000,
      startRow,
    })
    const rows = resp.rows ?? []
    allRows.push(...rows)
    console.log(`fetched ${rows.length} rows (total ${allRows.length})`)
    if (rows.length < 25000) break
    startRow += 25000
  }

  mkdirSync("tmp", { recursive: true })
  const out = {
    range,
    pulledAt: new Date().toISOString(),
    count: allRows.length,
    pages: allRows.map((r: any) => ({
      page: r.keys?.[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
  }
  const outFile = process.env.GSC_OUT ?? "tmp/gsc-pages.json"
  writeFileSync(outFile, JSON.stringify(out, null, 1), "utf-8")
  console.log(`wrote ${outFile} (${allRows.length} pages, ${range.startDate} -> ${range.endDate})`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
