/**
 * URL Inspection API: index-coverage state for every GSC page URL.
 * This is the API equivalent of the GSC "Pages" (indexing) report.
 * Run: npx tsx scripts/gsc-inspect-index.ts   (reads tmp/gsc-pages.json)
 * Writes: tmp/gsc-inspection.json
 * Quota: ~2000 inspections/day/property, 600/min.
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

async function inspect(token: string, url: string): Promise<any> {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: GSC_SITE_URL }),
  })
  if (!res.ok) throw new Error(`inspect ${url} -> ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  if (!GSC_SITE_URL) throw new Error("GSC_SITE_URL not set")
  const data = JSON.parse(readFileSync(process.env.GSC_IN ?? "tmp/gsc-pages.json", "utf-8"))
  const token = await getAccessToken()
  const outFile = "tmp/gsc-inspection.json"
  const out: any[] = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf-8")) : []
  const done = new Set(out.map((r) => r.page))
  if (done.size) console.log(`resuming: ${done.size} already inspected`)
  for (const row of data.pages) {
    if (done.has(row.page)) continue
    try {
      const r = await inspect(token, row.page)
      const idx = r.inspectionResult?.indexStatusResult ?? {}
      out.push({
        page: row.page,
        impressions: row.impressions,
        clicks: row.clicks,
        verdict: idx.verdict,
        coverageState: idx.coverageState,
        indexingState: idx.indexingState,
        lastCrawlTime: idx.lastCrawlTime,
        pageFetchState: idx.pageFetchState,
        referringUrls: (idx.referringUrls ?? []).slice(0, 3),
        sitemap: idx.sitemap,
      })
    } catch (err) {
      out.push({ page: row.page, error: err instanceof Error ? err.message : String(err) })
    }
    writeFileSync(outFile, JSON.stringify(out, null, 1), "utf-8") // incremental: survive timeouts
    if (out.length % 20 === 0) console.log(`inspected ${out.length}/${data.pages.length}`)
    await sleep(150) // stay well under 600/min
  }

  const by = <K extends string>(key: K) =>
    out.reduce((acc: Record<string, number>, r) => {
      const v = r[key] ?? r.error ?? "?"
      acc[v] = (acc[v] ?? 0) + 1
      return acc
    }, {})
  console.log("\n=== verdict ===", by("verdict"))
  console.log("\n=== coverageState ===", by("coverageState"))
  console.log("\n=== not indexed / problematic ===")
  for (const r of out.filter((x) => x.verdict && x.verdict !== "PASS")) {
    console.log(`${r.coverageState}\t${decodeURIComponent(r.page).replace("https://spsgrupp.ee", "")}`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
