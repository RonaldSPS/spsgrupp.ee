/**
 * TEMP: probe KeywordPlanIdeaService:generateKeywordHistoricalMetrics —
 * a different method from generateKeywordIdeas that returns monthly search
 * volumes directly for a keyword list. Run: npx tsx scripts/tmp-kw-hist-metrics.ts
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs"
import { getGoogleAccessToken } from "../lib/reporting/google-auth"

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
  const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (login) headers["login-customer-id"] = login

  const keywords = readFileSync("tmp/keyword-planner-list.txt", "utf-8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const url = `https://googleads.googleapis.com/v25/customers/${cid}:generateKeywordHistoricalMetrics`
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      keywords,
      geoTargetConstants: ["geoTargetConstants/2233"],
      language: "languageConstants/1022",
      keywordPlanNetwork: "GOOGLE_SEARCH",
    }),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`FAILED ${res.status}: ${text.slice(0, 800)}`)
    process.exitCode = 1
    return
  }
  writeFileSync("tmp/kw-planner-hist.json", text, "utf-8")
  const data = JSON.parse(text) as { results?: any[] }
  console.log(`OK — ${data.results?.length ?? 0} rows`)
  for (const r of (data.results ?? []).slice(0, 60)) {
    const m = r.keywordMetrics ?? {}
    console.log(
      `${r.text} | avgMonthly=${m.avgMonthlySearches ?? "?"} | comp=${m.competition ?? "?"} | lowBid=${(+(m.lowTopOfPageBidMicros ?? 0)) / 1e6} | highBid=${(+(m.highTopOfPageBidMicros ?? 0)) / 1e6}`,
    )
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})

