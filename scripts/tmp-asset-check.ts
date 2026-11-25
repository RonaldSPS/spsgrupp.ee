/** TEMP: kas 800-TEXT asset'id on tõesti REMOVED. */
import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
    if (k && process.env[k] === undefined) process.env[k] = v
  }
}
loadEnvLocal()

const CID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")

async function main() {
  const { GoogleAuth } = await import("google-auth-library")
  const auth = new GoogleAuth({ keyFile: ".secrets/gcp-analytics.json", scopes: ["https://www.googleapis.com/auth/adwords"] })
  const token = (await (await auth.getClient()).getAccessToken()).token
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (login) h["login-customer-id"] = login
  const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/googleAds:search`, {
    method: "POST", headers: h,
    body: JSON.stringify({
      query: "SELECT asset.resource_name, asset.text_asset.text FROM asset WHERE asset.type = 'TEXT'",
    }),
  })
  const d = (await res.json()) as { results?: any[] }
  const all = d.results ?? []
  const with800 = all.filter((r) => String(r.asset?.textAsset?.text ?? "").includes("800"))
  console.log("HTTP", res.status, "TEXT asset'e kokku:", all.length, "| 800-tekstiga:", with800.length)
  for (const r of with800) console.log("-", r.asset.resourceName, ":", String(r.asset.textAsset.text).slice(0, 90))

  // Proovi ühe eemaldust ja prindi TÄISviga
  if (with800.length > 0 && process.argv.includes("--try-remove")) {
    const mres = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/assets:mutate`, {
      method: "POST", headers: h,
      body: JSON.stringify({ operations: [{ remove: with800[0].asset.resourceName }] }),
    })
    console.log("remove status:", mres.status)
    console.log((await mres.text()).slice(0, 1500))
  }
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1 })
