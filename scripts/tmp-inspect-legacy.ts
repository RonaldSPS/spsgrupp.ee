// TEMP: URL Inspection API demo - does Google know the legacy 404 URLs and via which referring pages?
// Run: npx tsx scripts/tmp-inspect-legacy.ts
import { readFileSync, existsSync } from "node:fs"
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

const GSC_SITE_URL = process.env.GSC_SITE_URL!
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"

const URLS = [
  "https://spsgrupp.ee/teenused/eripuhastustood/ehitusjargne-koristus-ja-puhastus/",
  "https://spsgrupp.ee/hoolduskoristus",
  "https://spsgrupp.ee/teenused/hoolduskoristus/koristusteenused-buroos-ja-kontoris",
]

async function main() {
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()

  for (const inspectionUrl of URLS) {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl, siteUrl: GSC_SITE_URL, languageCode: "et" }),
    })
    if (!res.ok) {
      console.log(`ERR ${res.status}: ${(await res.text()).slice(0, 200)}`)
      continue
    }
    const r = (await res.json()).inspectionResult?.indexStatusResult ?? {}
    console.log("URL:", inspectionUrl)
    console.log("  verdict:", r.verdict, "| coverage:", r.coverageState)
    console.log("  lastCrawl:", r.lastCrawlTime ?? "-", "| pageFetch:", r.pageFetchState ?? "-")
    console.log("  referringUrls:", JSON.stringify(r.referringUrls ?? [], null, 2))
    console.log("  sitemap:", JSON.stringify(r.sitemap ?? []))
    await new Promise((s) => setTimeout(s, 1000))
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
