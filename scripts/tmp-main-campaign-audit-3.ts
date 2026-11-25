/** TEMP 23.10.2026: parandatud päringud v2 (read-only). */
import { writeFileSync, readFileSync, existsSync } from "node:fs"
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
const CAMPAIGN_ID = "22548785025"

type Row = Record<string, any>
function snakeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeKeys)
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), snakeKeys(v)]))
  }
  return value
}
let TOKEN = ""
async function gaql(query: string): Promise<Row[]> {
  const url = `https://googleads.googleapis.com/v25/customers/${CID}/googleAds:search`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${TOKEN}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  const login = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (login) headers["login-customer-id"] = login
  const rows: Row[] = []
  let pageToken: string | undefined
  do {
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) })
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 1500)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

async function main() {
  TOKEN = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const end = new Date(); end.setDate(end.getDate() - 2)
  const start = new Date(end); start.setDate(start.getDate() - 89)
  const between = `segments.date BETWEEN '${start.toISOString().slice(0, 10)}' AND '${end.toISOString().slice(0, 10)}'`
  const out: Record<string, unknown> = {}

  try {
    const r = await gaql(`SELECT campaign.id, campaign.name, campaign.status, campaign.serving_status,
      campaign.bidding_strategy_type, campaign.bidding_strategy,
      campaign.advertising_channel_type, campaign.tracking_url_template,
      campaign_budget.amount_micros, campaign_budget.explicitly_shared, campaign_budget.name
      FROM campaign WHERE campaign.id = ${CAMPAIGN_ID}`)
    out.settings = r
    console.log("SETTINGS:", JSON.stringify(r, null, 1))
  } catch (e) { console.log("SETTINGS VIGA:", e instanceof Error ? e.message : e) }

  try {
    const r = await gaql(`SELECT campaign.id, campaign_asset.field_type, campaign_asset.status, asset.type, asset.name,
      asset.final_urls,
      asset.sitelink_asset.link_text, asset.sitelink_asset.description1, asset.sitelink_asset.description2,
      asset.callout_asset.callout_text,
      asset.structured_snippet_asset.header, asset.structured_snippet_asset.values,
      asset.call_asset.phone_number, asset.call_asset.country_code,
      asset.image_asset.full_size.url, asset.image_asset.full_size.width_pixels, asset.image_asset.full_size.height_pixels
      FROM campaign_asset WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_asset.status != 'REMOVED'`)
    out.assets = r
    console.log(`\nASSETS (${r.length}):`)
    for (const x of r) {
      const a = x.asset ?? {}
      const d = a.sitelink_asset ? `sitelink "${a.sitelink_asset.link_text}" -> ${(a.final_urls ?? []).join(",")} :: ${a.sitelink_asset.description1 ?? ""} / ${a.sitelink_asset.description2 ?? ""}`
        : a.callout_asset ? `callout "${a.callout_asset.callout_text}"`
        : a.structured_snippet_asset ? `snippet ${a.structured_snippet_asset.header}: ${(a.structured_snippet_asset.values ?? []).join(", ")}`
        : a.call_asset ? `call ${a.call_asset.country_code} ${a.call_asset.phone_number}`
        : a.image_asset ? `image ${a.image_asset.full_size?.width_pixels}x${a.image_asset.full_size?.height_pixels} ${a.image_asset.full_size?.url}`
        : `${a.type} ${a.name ?? ""}`
      console.log(`- [${x.campaign_asset?.field_type}][${x.campaign_asset?.status}] ${d}`)
    }
  } catch (e) { console.log("ASSETS VIGA:", e instanceof Error ? e.message : e) }

  try {
    const r = await gaql(`SELECT search_term_view.search_term,
      metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
      FROM search_term_view
      WHERE campaign.id = ${CAMPAIGN_ID} AND ${between} AND metrics.cost_micros > 0
      ORDER BY metrics.cost_micros DESC LIMIT 500`)
    out.searchTerms = r
    console.log(`\nSEARCH TERMS kulu>0 (${r.length}), top 70:`)
    for (const x of r.slice(0, 70)) {
      const m = x.metrics ?? {}
      console.log(`- €${(Number(m.cost_micros ?? 0) / 1e6).toFixed(2)} kl=${Math.round(Number(m.clicks ?? 0))} konv=${Number(m.all_conversions ?? 0).toFixed(1)} :: ${x.search_term_view?.search_term}`)
    }
  } catch (e) { console.log("TERMS VIGA:", e instanceof Error ? e.message : e) }

  writeFileSync("tmp/main-campaign-audit-3.json", JSON.stringify(out, null, 2), "utf-8")
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1 })
