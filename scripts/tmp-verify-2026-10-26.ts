/** TEMP: verifitseerib 26.10.2026 paranduste hetkeoleku. */
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
  const q = async (query: string): Promise<any[]> => {
    const res = await fetch(`https://googleads.googleapis.com/v25/customers/${CID}/googleAds:search`, { method: "POST", headers: h, body: JSON.stringify({ query }) })
    const d = (await res.json()) as any
    if (!res.ok) throw new Error(JSON.stringify(d).slice(0, 500))
    return d.results ?? []
  }

  console.log("== ENABLED konversioonitoimingud ==")
  const cas = await q("SELECT conversion_action.name, conversion_action.primary_for_goal, conversion_action.category, conversion_action.status FROM conversion_action")
  for (const r of cas) {
    const a = r.conversionAction
    if (a.status === "ENABLED") console.log(`- ${a.name} [${a.category}] primary=${a.primaryForGoal}`)
  }

  console.log("\n== Kampaania-taseme konversioonieesmargid ==")
  try {
    const goals = await q("SELECT campaign.id, campaign.name, campaign_conversion_goal.category, campaign_conversion_goal.biddable, campaign_conversion_goal.origin FROM campaign_conversion_goal WHERE campaign.id IN (22548785025, 24235989746, 24367981618) AND campaign_conversion_goal.category IN ('CONTACT','SUBMIT_LEAD_FORM','PHONE_CALL_LEAD')")
    for (const r of goals) console.log(`- ${r.campaign.id} ${r.campaign.name} | ${r.campaignConversionGoal.category} (${r.campaignConversionGoal.origin}) | biddable=${r.campaignConversionGoal.biddable}`)
  } catch (e) { console.log("viga:", (e as Error).message.slice(0, 200)) }

  console.log("\n== DSA-kaevur (24361988072) ==")
  const c = await q("SELECT campaign.status, campaign.geo_target_type_setting.positive_geo_target_type FROM campaign WHERE campaign.id = 24361988072")
  console.log(`- status=${c[0]?.campaign?.status} geo+=${c[0]?.campaign?.geoTargetTypeSetting?.positiveGeoTargetType}`)
  const wp = await q("SELECT ad_group_criterion.negative FROM ad_group_criterion WHERE campaign.id = 24361988072 AND ad_group_criterion.type = 'WEBPAGE' AND ad_group_criterion.status != 'REMOVED'")
  console.log(`- webpage kriteeriumid: positiivsed=${wp.filter((r) => r.adGroupCriterion.negative === false).length}, negatiivsed=${wp.filter((r) => r.adGroupCriterion.negative === true).length}`)

  console.log("\n== P26 geo ==")
  const p26 = await q("SELECT campaign.id, campaign.name, campaign.status, campaign.geo_target_type_setting.positive_geo_target_type FROM campaign WHERE campaign.id IN (24367981618,24361988072,24356948292)")
  for (const r of p26) console.log(`- ${r.campaign.name} [${r.campaign.status}] geo+=${r.campaign.geoTargetTypeSetting?.positiveGeoTargetType}`)

  console.log("\n== 800-kontroll: pohikampaania RSA-d (ainult tekstiväljad) ==")
  const ads = await q("SELECT ad_group_ad.resource_name, ad_group_ad.status, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions FROM ad_group_ad WHERE campaign.id = 22548785025 AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED'")
  let n = 0
  for (const r of ads) {
    const rsa = r.adGroupAd?.ad?.responsiveSearchAd ?? {}
    const texts = [...(rsa.headlines ?? []), ...(rsa.descriptions ?? [])].map((x: any) => String(x.text ?? ""))
    if (texts.some((t: string) => /800/.test(t))) { n++; console.log(`  VEEL 800: ${r.adGroupAd.resourceName} [${r.adGroupAd.status}]`) }
  }
  console.log(`800-teksti sisaldavaid RSA-sid: ${n} / ${ads.length}`)

  console.log("\n== 800-kontroll: koik asset'id (ainult tekstiväljad) ==")
  const assets = await q("SELECT asset.resource_name, asset.type, asset.sitelink_asset.link_text, asset.sitelink_asset.description1, asset.sitelink_asset.description2, asset.callout_asset.callout_text, asset.structured_snippet_asset.values, asset.text_asset.text FROM asset")
  let na = 0
  for (const r of assets) {
    const a = { ...r.asset }
    delete a.resourceName
    if (/800/.test(JSON.stringify(a))) { na++; console.log(`  VEEL 800: ${JSON.stringify(a).slice(0, 250)}`) }
  }
  console.log(`800-teksti sisaldavaid asset'e: ${na}`)
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1 })
