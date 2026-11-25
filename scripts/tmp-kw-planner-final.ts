/**
 * TEMP: union keyword list (mine + HTML report Lisa B) → Planner historical
 * metrics for BOTH geos: Estonia (2233) and Harju County (9061562).
 * Output: tmp/kw-planner-final.json + console table.
 * Run: npx tsx scripts/tmp-kw-planner-final.ts
 */
import { readFileSync, writeFileSync } from "node:fs"
import { getGoogleAccessToken } from "../lib/reporting/google-auth"
import { existsSync } from "node:fs"

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

async function main() {
  // union list: my seed file + first-column terms from the HTML report tables
  const mine = readFileSync("tmp/keyword-planner-list.txt", "utf-8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  const html = readFileSync("raportid/marksonad-seo-ads-2026-09-16.html", "utf-8")
  const his = [...html.matchAll(/<tr><td>([^<]{2,60})<\/td>/g)]
    .map((m) => m[1].trim())
    .filter((s) => !/[€%]|^\d/.test(s))
  const union = [...new Set([...mine, ...his].map((s) => s.toLowerCase()))].sort()
  console.log(`union keywords: ${union.length}`)
  writeFileSync("tmp/keyword-planner-union.txt", union.join("\n"), "utf-8")

  const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }

  async function hist(geo: string): Promise<Record<string, { avg: number | null; comp: string; low: number; high: number }>> {
    const res = await fetch(`https://googleads.googleapis.com/v25/customers/${cid}:generateKeywordHistoricalMetrics`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        keywords: union,
        geoTargetConstants: [geo],
        language: "languageConstants/1022",
        keywordPlanNetwork: "GOOGLE_SEARCH",
      }),
    })
    if (!res.ok) throw new Error(`hist ${geo} failed ${res.status}: ${(await res.text()).slice(0, 300)}`)
    const data = (await res.json()) as { results?: any[] }
    const out: Record<string, { avg: number | null; comp: string; low: number; high: number }> = {}
    for (const r of data.results ?? []) {
      const m = r.keywordMetrics ?? {}
      out[String(r.text).toLowerCase()] = {
        avg: m.avgMonthlySearches === undefined ? null : Number(m.avgMonthlySearches),
        comp: m.competition ?? "?",
        low: (+(m.lowTopOfPageBidMicros ?? 0)) / 1e6,
        high: (+(m.highTopOfPageBidMicros ?? 0)) / 1e6,
      }
    }
    return out
  }

  const ee = await hist("geoTargetConstants/2233")
  const harju = await hist("geoTargetConstants/9061562")
  console.log(`EE rows: ${Object.keys(ee).length}, Harju rows: ${Object.keys(harju).length}`)

  const allKeys = [...new Set([...Object.keys(ee), ...Object.keys(harju)])].sort()
  const merged = allKeys.map((kw) => ({ kw, ee: ee[kw] ?? null, harju: harju[kw] ?? null }))
  writeFileSync("tmp/kw-planner-final.json", JSON.stringify(merged, null, 1), "utf-8")

  console.log("\nkeyword | EE/mo | Harju/mo | comp | bidLow | bidHigh")
  for (const m of merged) {
    const e = m.ee
    console.log(`${m.kw} | ${e?.avg ?? "—"} | ${m.harju?.avg ?? "—"} | ${e?.comp ?? "?"} | ${e?.low.toFixed(2) ?? "-"} | ${e?.high.toFixed(2) ?? "-"}`)
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
