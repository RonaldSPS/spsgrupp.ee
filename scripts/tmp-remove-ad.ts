/** TEMP: eemaldab nõrgema bisekt-RSA (ilma 2027-pealkirjadeta), jätame täisversiooni. */
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
const REMOVE_RN = `customers/${CID}/adGroupAds/205146764761~829704377267`

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
  const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/adGroupAds:mutate`, {
    method: "POST", headers: h,
    body: JSON.stringify({ operations: [{ remove: REMOVE_RN }] }),
  })
  console.log("HTTP", res.status, (await res.text()).slice(0, 300))
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
