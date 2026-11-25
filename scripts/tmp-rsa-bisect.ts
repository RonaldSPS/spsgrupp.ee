/** TEMP: Vahetus-2027 RSA PROHIBITED-disapprovals bisekt — prindib TÄISvea. */
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
const GROUP_RN = `customers/${CID}/adGroups/205146764761`

const HEADLINES = [
  "Koristuspartneri vahetus 2027", "Vaheta koristusfirmat", "Leping 2027. aastaks",
  "Tasuta objekti ülevaatus", "Hind alates 1,20 €/m² kuus", "Vahetus on kontrollitud",
  "Kindel meeskond objektil", "Objektijuht ja kontroll", "ISO 9001 ja 14001",
  "Kogemus alates 2006", "Vastus 1 tööpäevaga", "300+ töötajat", "SPS Grupp",
]
const DESCRIPTIONS = [
  "Koristuspartneri vahetus on kontrollitud protsess: ülevaatus, tööplaan, käivitus nädalaga.",
  "Hind alates 1,20 €/m² kuus. Tasuta ülevaatus ja hinnapakkumine 1 tööpäevaga.",
  "Kindel meeskond, objektijuht ja kvaliteedikontroll. Asendus ka puhkuste ajal.",
]

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

  const variant = process.argv[2] ?? "hub-url"
  let heads = HEADLINES
  if (variant === "no-2027") heads = HEADLINES.filter((h) => !h.includes("2027"))
  if (variant === "no-iso") heads = HEADLINES.filter((h) => !h.includes("ISO"))
  if (variant === "no-2027-iso") heads = HEADLINES.filter((h) => !h.includes("2027") && !h.includes("ISO"))
  const ad = {
    finalUrls: ["https://spsgrupp.ee/koristusteenus/hoolduskoristus/"],
    responsiveSearchAd: { headlines: heads.map((text) => ({ text })), descriptions: DESCRIPTIONS.map((text) => ({ text })), path1: "hoolduskoristus" },
  }

  const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/adGroupAds:mutate`, {
    method: "POST", headers: h,
    body: JSON.stringify({ operations: [{ create: { adGroup: GROUP_RN, status: "ENABLED", ad } }], partialFailure: true }),
  })
  console.log("HTTP", res.status, "variant:", variant)
  console.log((await res.text()).slice(0, 3000))
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
