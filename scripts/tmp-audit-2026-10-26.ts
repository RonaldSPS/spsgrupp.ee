/**
 * TEMP (26.10.2026 audit): kogub täpse hetkeoleku nelja paranduse jaoks:
 *  1. Põhikampaania (22548785025) kõik mitte-REMOVED RSA-d täistekstiga
 *     (800 m² kohtad) + resource_name'id create+remove jaoks.
 *  2. Kõik kampaaniad: staatus, eelarve, geo_target_type_setting (P26 kohalolu).
 *  3. DSA-kaevuri dünaamilise otsingu seaded + webpage-kriteeriumid.
 *  4. Konversioonitoimingud: kategooria, primary_for_goal, staatus.
 * Käivita: npx tsx scripts/tmp-audit-2026-10-26.ts
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
    if (!res.ok) throw new Error(`GAQL ${res.status}: ${(await res.text()).slice(0, 600)}\nQ: ${query.slice(0, 200)}`)
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

async function main() {
  if (!DEVELOPER_TOKEN || !CUSTOMER_ID) throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID puuduvad")
  const token = await getAccessToken()

  /* 1. Põhikampaania RSA-d */
  console.log("=== 1. Põhikampaania RSA-d (22548785025) ===")
  const ads = await gaql(
    token,
    `SELECT ad_group_ad.resource_name, ad_group.name, ad_group.id, ad_group_ad.status,
            ad_group_ad.ad.final_urls,
            ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions,
            ad_group_ad.ad.responsive_search_ad.path1,
            ad_group_ad.ad.responsive_search_ad.path2
     FROM ad_group_ad
     WHERE campaign.id = 22548785025 AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
       AND ad_group_ad.status != 'REMOVED'
     ORDER BY ad_group.id`,
  )
  for (const r of ads) {
    const aga = r.adGroupAd ?? r.ad_group_ad
    const rsa = aga?.ad?.responsiveSearchAd ?? aga?.ad?.responsive_search_ad ?? {}
    const heads = (rsa.headlines ?? []).map((h: any) => (h.pinnedField ? `[${h.pinnedField}] ` : "") + h.text)
    const descs = (rsa.descriptions ?? []).map((d: any) => (d.pinnedField ? `[${d.pinnedField}] ` : "") + d.text)
    const has800 = [...heads, ...descs].some((t: string) => /800/.test(t))
    console.log(`\n--- ${has800 ? "*** SISALDAB 800 *** " : ""}${r.adGroup?.name ?? r.ad_group?.name} [${aga?.status}]`)
    console.log(`    rn=${aga?.resourceName ?? aga?.resource_name}`)
    console.log(`    url=${(aga?.ad?.finalUrls ?? aga?.ad?.final_urls ?? []).join(",")} path=${rsa.path1 ?? ""}/${rsa.path2 ?? ""}`)
    console.log(`    H(${heads.length}): ${heads.join(" | ")}`)
    console.log(`    D(${descs.length}): ${descs.join(" | ")}`)
  }

  /* 2. Kampaaniad + geo-seade */
  console.log("\n\n=== 2. Kampaaniad + geo_target_type_setting ===")
  const camps = await gaql(
    token,
    `SELECT campaign.id, campaign.name, campaign.status, campaign.bidding_strategy_type,
            campaign_budget.amount_micros,
            campaign.geo_target_type_setting.positive_geo_target_type,
            campaign.geo_target_type_setting.negative_geo_target_type
     FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.id`,
  )
  for (const r of camps) {
    const c = r.campaign ?? {}
    const gt = c.geoTargetTypeSetting ?? c.geo_target_type_setting ?? {}
    const b = r.campaignBudget ?? r.campaign_budget ?? {}
    console.log(`- id=${c.id} ${c.name} [${c.status}] €${(Number(b.amountMicros ?? b.amount_micros ?? 0) / 1e6).toFixed(2)}/p geo+:${gt.positiveGeoTargetType ?? gt.positive_geo_target_type} geo-:${gt.negativeGeoTargetType ?? gt.negative_geo_target_type} bid=${c.biddingStrategyType ?? c.bidding_strategy_type}`)
  }

  /* 3. DSA seaded + webpage-kriteeriumid */
  console.log("\n\n=== 3. DSA kampaania seaded + webpage kriteeriumid ===")
  try {
    const dsa = await gaql(
      token,
      `SELECT campaign.id, campaign.name, campaign.dynamic_search_ads_setting.domain_name,
              campaign.dynamic_search_ads_setting.language_code
       FROM campaign WHERE campaign.dynamic_search_ads_setting.domain_name IS NOT NULL`,
    )
    console.log(JSON.stringify(dsa, null, 2))
  } catch (e) {
    console.log(`DSA setting viga: ${e instanceof Error ? e.message : e}`)
  }
  /* v25 ei luba GAQL-is webpage_info alamvälju — toome ainult rn/staatus/negatiivsus. */
  const dsaCrit = await gaql(
    token,
    `SELECT campaign.name, campaign.id, ad_group.name, ad_group.id, ad_group_criterion.resource_name,
            ad_group_criterion.status, ad_group_criterion.negative
     FROM ad_group_criterion
     WHERE ad_group_criterion.type = 'WEBPAGE' AND campaign.status != 'REMOVED' AND ad_group_criterion.status != 'REMOVED'`,
  )
  for (const r of dsaCrit) {
    const c = r.adGroupCriterion ?? r.ad_group_criterion ?? {}
    console.log(`- ${r.campaign?.name} / ${r.adGroup?.name ?? r.ad_group?.name} (gid=${r.adGroup?.id ?? r.ad_group?.id}) [${c.status}]${c.negative ? " NEG" : ""} rn=${c.resourceName ?? c.resource_name}`)
  }

  /* 4. Konversioonitoimingud */
  console.log("\n\n=== 4. Konversioonitoimingud ===")
  const cas = await gaql(
    token,
    `SELECT conversion_action.resource_name, conversion_action.name, conversion_action.category,
            conversion_action.primary_for_goal, conversion_action.status, conversion_action.type,
            conversion_action.include_in_conversions_metric,
            conversion_action.counting_type
     FROM conversion_action ORDER BY conversion_action.name`,
  )
  for (const r of cas) {
    const a = r.conversionAction ?? r.conversion_action ?? {}
    console.log(`- ${a.name} | cat=${a.category} type=${a.type} primary_for_goal=${a.primaryForGoal ?? a.primary_for_goal} status=${a.status} counting=${a.countingType ?? a.counting_type} | rn=${a.resourceName ?? a.resource_name}`)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
