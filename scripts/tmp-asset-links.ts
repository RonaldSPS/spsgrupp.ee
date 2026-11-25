/** TEMP: millistesse (aktiivsetesse?) kampaaniatesse on 800-TEXT-asset'id lingitud. */
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
const TEXT_RNS = [
  "customers/3967281610/assets/62800609173", "customers/3967281610/assets/62800609176",
  "customers/3967281610/assets/62800609179", "customers/3967281610/assets/91501090800",
  "customers/3967281610/assets/109348006739", "customers/3967281610/assets/109348006742",
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
  const q = async (query: string): Promise<any[]> => {
    const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/googleAds:search`, { method: "POST", headers: h, body: JSON.stringify({ query }) })
    const d = (await res.json()) as any
    if (!res.ok) throw new Error(JSON.stringify(d).slice(0, 500))
    return d.results ?? []
  }

  // Leia 800-TEXT asset'id otse
  const all = await q("SELECT asset.resource_name, asset.text_asset.text FROM asset WHERE asset.type = 'TEXT'")
  const bad = all.filter((r) => String(r.asset?.textAsset?.text ?? "").includes("800")).map((r) => String(r.asset.resourceName))
  console.log("800-TEXT asset'id:", bad.length)

  const links = await q(
    `SELECT campaign.id, campaign.name, campaign.status, campaign_asset.asset, campaign_asset.field_type, campaign_asset.status
     FROM campaign_asset WHERE campaign_asset.asset IN (${bad.map((r) => `'${r}'`).join(",")})`,
  )
  console.log("\nkampaania-lingid:")
  for (const r of links) console.log(`- ${r.campaign.name} [${r.campaign.status}] field=${r.campaignAsset.fieldType} linkstatus=${r.campaignAsset.status} asset=${r.campaignAsset.asset}`)
  if (links.length === 0) console.log("(pole kampaania-linke)")

  const clinks = await q(
    `SELECT customer_asset.asset, customer_asset.field_type, customer_asset.status
     FROM customer_asset WHERE customer_asset.asset IN (${bad.map((r) => `'${r}'`).join(",")})`,
  )
  console.log("\nkonto-lingid:")
  for (const r of clinks) console.log(`- field=${r.customerAsset.fieldType} status=${r.customerAsset.status} asset=${r.customerAsset.asset}`)
  if (clinks.length === 0) console.log("(pole konto-linke)")

  const glinks = await q(
    `SELECT ad_group.name, ad_group.status, campaign.name, campaign.status, ad_group_asset.asset, ad_group_asset.field_type
     FROM ad_group_asset WHERE ad_group_asset.asset IN (${bad.map((r) => `'${r}'`).join(",")})`,
  )
  console.log("\ngrupi-lingid:")
  for (const r of glinks) console.log(`- ${r.campaign.name}/${r.adGroup?.name} [${r.campaign.status}] field=${r.adGroupAsset.fieldType}`)
  if (glinks.length === 0) console.log("(pole grupi-linke)")
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1 })
