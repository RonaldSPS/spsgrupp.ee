/** TEMP 23.10.2026: target_spend detail + bidding strategy ressurss (read-only). */
import { readFileSync, existsSync } from "node:fs"
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
const CID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")

type Row = Record<string, any>
function snakeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeKeys)
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), snakeKeys(v)]))
  }
  return value
}

async function main() {
  const TOKEN = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const q = async (query: string) => {
    const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/googleAds:search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 800)}`)
    return ((await res.json()).results ?? []).map((r: Row) => snakeKeys(r) as Row)
  }
  const r = await q(`SELECT campaign.id, campaign.name, campaign.bidding_strategy_type,
    campaign.target_spend.cpc_bid_ceiling_micros, campaign.target_spend.target_spend_micros,
    campaign.bidding_strategy
    FROM campaign WHERE campaign.id = 22548785025`)
  console.log(JSON.stringify(r, null, 1))
  // kas on eraldi portfolio bidding_strategy ressurss?
  if (r[0]?.campaign?.bidding_strategy) {
    const bs = await q(`SELECT bidding_strategy.resource_name, bidding_strategy.type,
      bidding_strategy.target_spend.cpc_bid_ceiling_micros
      FROM bidding_strategy WHERE bidding_strategy.resource_name = '${r[0].campaign.bidding_strategy}'`)
    console.log(JSON.stringify(bs, null, 1))
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1 })
