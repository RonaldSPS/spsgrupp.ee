/**
 * TEMP (26.10.2026 audit, osa 2):
 *  1. Kulu kampaania kaupa (30p) — kes tegelikult kulutab.
 *  2. Jäkk-otsingusõnade (muru/vaiba/pesula/konkurendid) allikkampaaniad (30p).
 *  3. Konversioonid toiminguti (30p) — millised toimingud tegelikult loevad.
 *  4. 800 m² tekst kampaania-/konto-asset'ides (sitelink/callout) kõigis kampaaniates.
 *  5. P26 kampaaniate RSA-d (800-kontroll).
 * Käivita: npx tsx scripts/tmp-audit-2026-10-26b.ts
 */
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

const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? ".secrets/gcp-analytics.json"
const ADS_API_VERSION = "v25"

async function getAccessToken(): Promise<string> {
  const { GoogleAuth } = await import("google-auth-library")
  const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/adwords"] })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("access token puudub")
  return token.token
}

function headers(token: string): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": DEVELOPER_TOKEN!,
    "Content-Type": "application/json",
  }
  if (LOGIN_CUSTOMER_ID) h["login-customer-id"] = LOGIN_CUSTOMER_ID
  return h
}

type Row = Record<string, any>

async function gaql(token: string, query: string): Promise<Row[]> {
  const rows: Row[] = []
  let pageToken: string | undefined
  do {
    const res = await fetch(
      `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:search`,
      { method: "POST", headers: headers(token), body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) },
    )
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 500)}\nQ: ${query.slice(0, 200)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const eur = (v: unknown) => (Number(v ?? 0) / 1e6).toFixed(2)

async function main() {
  const token = await getAccessToken()
  const end = new Date(); end.setDate(end.getDate() - 1)
  const start = new Date(end); start.setDate(start.getDate() - 29)
  const win = `segments.date BETWEEN '${start.toISOString().slice(0, 10)}' AND '${end.toISOString().slice(0, 10)}'`

  console.log("=== 1. Kulu kampaania kaupa (30p) ===")
  const byCamp = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions, metrics.all_conversions
     FROM campaign WHERE ${win} AND metrics.cost_micros > 0 ORDER BY metrics.cost_micros DESC`,
  )
  for (const r of byCamp) {
    const m = r.metrics ?? {}
    console.log(`- ${r.campaign?.id} ${r.campaign?.name} [${r.campaign?.status}] €${eur(m.costMicros ?? m.cost_micros)} kl=${m.clicks} näit=${m.impressions} konv=${Number(m.conversions ?? 0).toFixed(1)} kõik=${Number(m.allConversions ?? m.all_conversions ?? 0).toFixed(1)}`)
  }

  console.log("\n=== 2. Jäkk-terminite allikkampaaniad (30p) ===")
  const terms = await gaql(
    token,
    `SELECT search_term_view.search_term, campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros
     FROM search_term_view WHERE ${win} AND metrics.impressions > 0
     ORDER BY metrics.cost_micros DESC LIMIT 1000`,
  )
  const junkRe = /muru|niit|vaiba|vaip|pesula|прачеч|laundromat|pesumaja|\bsol\b|liisu|clean planet|happy clean|goclean|multiclean|euroclean|forus|kvatro|tondi|iss |iss\b|cleansmart|masterclean|wetrok|diversey/i
  const junk = terms.filter((r) => junkRe.test(String(r.searchTermView?.searchTerm ?? r.search_term_view?.search_term ?? "")))
  const byCampJunk = new Map<string, { cost: number; terms: string[] }>()
  for (const r of junk) {
    const key = `${r.campaign?.id} ${r.campaign?.name}`
    const m = r.metrics ?? {}
    const e = byCampJunk.get(key) ?? { cost: 0, terms: [] }
    e.cost += Number(m.costMicros ?? m.cost_micros ?? 0)
    const t = String(r.searchTermView?.searchTerm ?? r.search_term_view?.search_term ?? "")
    if (e.terms.length < 15 && !e.terms.includes(t)) e.terms.push(t)
    byCampJunk.set(key, e)
  }
  for (const [k, v] of [...byCampJunk.entries()].sort((a, b) => b[1].cost - a[1].cost)) {
    console.log(`- ${k}: €${eur(v.cost)} | ${v.terms.join(", ")}`)
  }
  console.log(`(jäkk-termeid kokku: ${junk.length}, kulu €${eur(junk.reduce((s, r) => s + Number(r.metrics?.costMicros ?? r.metrics?.cost_micros ?? 0), 0))})`)

  console.log("\n=== 3. Konversioonid toiminguti (30p, kogu konto) ===")
  const conv = await gaql(
    token,
    `SELECT segments.conversion_action_name, segments.conversion_action_category, metrics.conversions, metrics.all_conversions
     FROM campaign WHERE ${win} AND metrics.all_conversions > 0`,
  )
  for (const r of conv) {
    const s = r.segments ?? {}
    console.log(`- ${s.conversionActionName ?? s.conversion_action_name} [${s.conversionActionCategory ?? s.conversion_action_category}] konv=${Number(r.metrics?.conversions ?? 0).toFixed(1)} kõik=${Number(r.metrics?.allConversions ?? r.metrics?.all_conversions ?? 0).toFixed(1)}`)
  }

  console.log("\n=== 4. Asset'id, mis sisaldavad 800 (kampaania+konto tase) ===")
  try {
    const assets = await gaql(
      token,
      `SELECT asset.resource_name, asset.name, asset.type,
              asset.sitelink_asset.link_text, asset.sitelink_asset.description1, asset.sitelink_asset.description2,
              asset.callout_asset.callout_text, asset.structured_snippet_asset.values
       FROM asset`,
    )
    for (const r of assets) {
      const a = r.asset ?? {}
      const blob = JSON.stringify(a)
      if (/800\s*m|800m/i.test(blob)) console.log(`- ASSET ${a.type} rn=${a.resourceName ?? a.resource_name}: ${blob.slice(0, 300)}`)
    }
    console.log("(asset-skann valmis)")
  } catch (e) {
    console.log(`asset viga: ${e instanceof Error ? e.message : e}`)
  }

  console.log("\n=== 5. P26 RSA-d (800-kontroll) ===")
  const p26ads = await gaql(
    token,
    `SELECT campaign.name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.status,
            ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions
     FROM ad_group_ad
     WHERE campaign.name LIKE 'P26%' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED'`,
  )
  for (const r of p26ads) {
    const aga = r.adGroupAd ?? r.ad_group_ad ?? {}
    const blob = JSON.stringify(aga.ad ?? {})
    const has800 = /800/.test(blob)
    console.log(`- ${r.campaign?.name} / ${r.adGroup?.name ?? r.ad_group?.name} [${aga.status}] ${has800 ? "*** SISALDAB 800 *** " + blob.slice(0, 400) : "OK"}`)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
