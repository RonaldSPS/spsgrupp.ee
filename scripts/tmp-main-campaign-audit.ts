/**
 * TEMP (analüüs 23.10.2026): põhikampaania "Otsing - Teenused - 2026" (22548785025)
 * täielik read-only audit parandusplaani koostamiseks.
 * EI MUUDA midagi — ainult GAQL SELECT päringud.
 * Käivita: npx tsx scripts/tmp-main-campaign-audit.ts
 * Väljund: konsool + tmp/main-campaign-audit.json
 */
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
const ADS_API_VERSION = "v25"

type Row = Record<string, any>
function snakeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeKeys)
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`),
        snakeKeys(v),
      ]),
    )
  }
  return value
}

let TOKEN = ""
async function gaql(query: string): Promise<Row[]> {
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${CID}/googleAds:search`
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
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GAQL ${res.status}: ${text.slice(0, 500)}\nQUERY: ${query.slice(0, 300)}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const micros = (v: unknown) => (Number(v ?? 0) / 1e6).toFixed(2)

async function tryQ(label: string, q: string, dump: Record<string, unknown>, key: string) {
  try {
    const rows = await gaql(q)
    dump[key] = rows
    console.log(`## ${label} (${rows.length} rida) — OK`)
    return rows
  } catch (e) {
    console.log(`## ${label} — VIGA: ${e instanceof Error ? e.message.slice(0, 300) : e}`)
    return [] as Row[]
  }
}

async function main() {
  TOKEN = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - 89)
  const from = start.toISOString().slice(0, 10)
  const to = end.toISOString().slice(0, 10)
  const between = `segments.date BETWEEN '${from}' AND '${to}'`
  console.log(`# Põhikampaania audit ${CAMPAIGN_ID} · aken ${from} -> ${to}\n`)
  const dump: Record<string, unknown> = { window: { from, to } }

  /* 1. Kampaania seaded + pakkumisstrateegia detailid */
  const settings = await tryQ(
    "1. Kampaania seaded",
    `SELECT campaign.id, campaign.name, campaign.status, campaign.bidding_strategy_type,
            campaign.maximize_conversions.target_cpa_micros,
            campaign_budget.amount_micros, campaign_budget.explicitly_shared,
            campaign.network_settings.target_google_search,
            campaign.network_settings.target_search_network,
            campaign.network_settings.target_partner_search_network,
            campaign.network_settings.target_content_network,
            campaign.geo_target_type_setting.positive_geo_target_type,
            campaign.geo_target_type_setting.negative_geo_target_type,
            campaign.tracking_url_template,
            campaign.start_date, campaign.advertising_channel_type, campaign.serving_status
     FROM campaign WHERE campaign.id = ${CAMPAIGN_ID}`,
    dump, "settings",
  )
  for (const r of settings) {
    const c = r.campaign ?? {}
    const ns = c.network_settings ?? {}
    console.log(JSON.stringify({
      name: c.name, status: c.status, serving: c.serving_status, bidding: c.bidding_strategy_type,
      targetCpaMicros: c.maximize_conversions?.target_cpa_micros ?? null,
      budgetEur: micros(r.campaign_budget?.amount_micros), sharedBudget: r.campaign_budget?.explicitly_shared,
      networks: ns, geo: c.geo_target_type_setting, tracking: c.tracking_url_template ?? null,
      start: c.start_date, channel: c.advertising_channel_type,
    }, null, 1))
  }

  /* 2. Kampaania-taseme konversioonieesmärgid */
  const goals = await tryQ(
    "2. Konversioonieesmärgid",
    `SELECT campaign_conversion_goal.category, campaign_conversion_goal.origin,
            campaign_conversion_goal.biddable
     FROM campaign_conversion_goal WHERE campaign.id = ${CAMPAIGN_ID}`,
    dump, "conversionGoals",
  )
  for (const r of goals) {
    const g = r.campaign_conversion_goal ?? {}
    console.log(`- ${g.category} · origin=${g.origin} · biddable=${g.biddable}`)
  }

  /* 3. Reklaamgrupid + 90p metrikad */
  const groups = await tryQ(
    "3. Reklaamgrupid",
    `SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.type,
            ad_group.cpc_bid_micros, ad_group.target_cpa_micros,
            metrics.impressions, metrics.clicks, metrics.cost_micros,
            metrics.conversions, metrics.all_conversions
     FROM ad_group WHERE campaign.id = ${CAMPAIGN_ID} AND ${between}
     ORDER BY metrics.cost_micros DESC`,
    dump, "adGroups",
  )
  for (const r of groups) {
    const m = r.metrics ?? {}
    console.log(`- ${r.ad_group?.name} [${r.ad_group?.status}] €${micros(m.cost_micros)} kl=${Math.round(Number(m.clicks ?? 0))} näit=${Math.round(Number(m.impressions ?? 0))} konv=${Number(m.conversions ?? 0).toFixed(1)}`)
  }

  /* 4. Kõik märksõnad + QS komponendid + final_urls (seis) */
  const kwState = await tryQ(
    "4. Märksõnade seis + QS",
    `SELECT ad_group.name, ad_group.status,
            ad_group_criterion.criterion_id, ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type, ad_group_criterion.status,
            ad_group_criterion.quality_info.quality_score,
            ad_group_criterion.quality_info.creative_quality_score,
            ad_group_criterion.quality_info.post_click_quality_score,
            ad_group_criterion.quality_info.search_predicted_ctr,
            ad_group_criterion.final_urls
     FROM keyword_view
     WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group.status != 'REMOVED'
       AND ad_group_criterion.status != 'REMOVED'`,
    dump, "keywordState",
  )
  const kwPerf = await tryQ(
    "5. Märksõnade 90p metrikad",
    `SELECT ad_group.name, ad_group_criterion.criterion_id,
            ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            metrics.impressions, metrics.clicks, metrics.cost_micros,
            metrics.conversions, metrics.all_conversions, metrics.average_cpc
     FROM keyword_view
     WHERE campaign.id = ${CAMPAIGN_ID} AND ${between}`,
    dump, "keywordPerf",
  )
  console.log(`- Märksõnu seisukokku: ${kwState.length}, metrikatega: ${kwPerf.length}`)
  console.log(`\n### ENABLED märksõnad kulu järjekorras (90p)`)
  console.log(`| Grupp | Märksõna | Match | QS (ctr/kr/lp) | Kulu € | Kl | Konv | Sihtleht |`)
  console.log(`|---|---|---|---|---|---|---|---|`)
  const stateById = new Map<string, Row>()
  for (const r of kwState) stateById.set(String(r.ad_group_criterion?.criterion_id), r)
  for (const r of kwPerf.filter((x) => x.ad_group_criterion?.status === "ENABLED").sort((a, b) => Number(b.metrics?.cost_micros ?? 0) - Number(a.metrics?.cost_micros ?? 0))) {
    const m = r.metrics ?? {}
    const st = stateById.get(String(r.ad_group_criterion?.criterion_id))
    const qi = st?.ad_group_criterion?.quality_info ?? {}
    const urls = st?.ad_group_criterion?.final_urls ?? []
    console.log(`| ${r.ad_group?.name} | ${r.ad_group_criterion?.keyword?.text} | ${r.ad_group_criterion?.keyword?.match_type} | ${qi.quality_score ?? "-"} (${qi.search_predicted_ctr ?? "-"}/${qi.creative_quality_score ?? "-"}/${qi.post_click_quality_score ?? "-"}) | ${micros(m.cost_micros)} | ${Math.round(Number(m.clicks ?? 0))} | ${Number(m.conversions ?? 0).toFixed(1)} | ${urls[0] ?? "-"} |`)
  }

  /* 6. RSA-d täistekstidega + ad_strength */
  const ads = await tryQ(
    "6. RSA reklaamid",
    `SELECT ad_group.name, ad_group_ad.ad.id, ad_group_ad.status, ad_group_ad.ad_strength,
            ad_group_ad.ad.final_urls,
            ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions,
            ad_group_ad.ad.responsive_search_ad.path1,
            ad_group_ad.ad.responsive_search_ad.path2
     FROM ad_group_ad
     WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
       AND ad_group_ad.status != 'REMOVED'`,
    dump, "ads",
  )
  for (const r of ads) {
    const a = r.ad_group_ad ?? {}
    const rsa = a.ad?.responsive_search_ad ?? {}
    const heads = (rsa.headlines ?? []).map((h: any) => h.text).filter(Boolean)
    const descs = (rsa.descriptions ?? []).map((d: any) => d.text).filter(Boolean)
    console.log(`\n### ${r.ad_group?.name} · ad ${a.ad?.id} [${a.status}] strength=${a.ad_strength} url=${(a.ad?.final_urls ?? []).join(",")} path=${rsa.path1 ?? ""}/${rsa.path2 ?? ""}`)
    console.log(`  H(${heads.length}): ${heads.join(" | ")}`)
    console.log(`  D(${descs.length}): ${descs.join(" | ")}`)
  }

  /* 7. Kampaania-assetid */
  const assets = await tryQ(
    "7. Kampaania-assetid",
    `SELECT campaign_asset.field_type, campaign_asset.status, asset.type, asset.name,
            asset.sitelink_asset.link_text, asset.sitelink_asset.description1,
            asset.sitelink_asset.link_text, asset.sitelink_asset.final_urls,
            asset.callout_asset.callout_text,
            asset.structured_snippet_asset.header, asset.structured_snippet_asset.values,
            asset.call_asset.phone_number, asset.call_asset.country_code,
            asset.image_asset.full_size.url
     FROM campaign_asset WHERE campaign.id = ${CAMPAIGN_ID}`,
    dump, "assets",
  )
  for (const r of assets) {
    const a = r.asset ?? {}
    const desc =
      a.sitelink_asset ? `sitelink: ${a.sitelink_asset.link_text} -> ${(a.sitelink_asset.final_urls ?? []).join(",")}` :
      a.callout_asset ? `callout: ${a.callout_asset.callout_text}` :
      a.structured_snippet_asset ? `snippet: ${a.structured_snippet_asset.header} = ${(a.structured_snippet_asset.values ?? []).join(", ")}` :
      a.call_asset ? `call: ${a.call_asset.country_code} ${a.call_asset.phone_number}` :
      a.image_asset ? `image: ${a.image_asset.full_size?.url ?? ""}` : (a.name ?? a.type)
    console.log(`- [${r.campaign_asset?.field_type}] [${r.campaign_asset?.status}] ${desc}`)
  }

  /* 8. Kampaania-negatiivsed */
  const negs = await tryQ(
    "8. Kampaania-negatiivsed",
    `SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
     FROM campaign_criterion
     WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
       AND campaign_criterion.type = 'KEYWORD'`,
    dump, "negatives",
  )
  for (const r of negs) {
    console.log(`- [${r.campaign_criterion?.keyword?.match_type}] ${r.campaign_criterion?.keyword?.text}`)
  }

  /* 9. Kampaaniale seotud jagatud nimekirjad */
  const shared = await tryQ(
    "9. Jagatud nimekirjad kampaanial",
    `SELECT campaign_shared_set.shared_set, campaign_shared_set.status, shared_set.name, shared_set.type
     FROM campaign_shared_set WHERE campaign.id = ${CAMPAIGN_ID}`,
    dump, "sharedSets",
  )
  for (const r of shared) {
    console.log(`- ${r.shared_set?.name} [${r.shared_set?.type}] [${r.campaign_shared_set?.status}]`)
  }

  /* 10. Otsingusõnad 90p AINULT põhikampaania */
  const terms = await tryQ(
    "10. Otsingusõnad 90p",
    `SELECT search_term_view.search_term, ad_group.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM search_term_view
     WHERE campaign.id = ${CAMPAIGN_ID} AND ${between} AND (metrics.cost_micros > 0 OR metrics.impressions > 0)
     ORDER BY metrics.cost_micros DESC LIMIT 800`,
    dump, "searchTerms",
  )
  console.log(`| Otsingusõna | Grupp | Kulu € | Kl | Konv(kõik) |`)
  console.log(`|---|---|---|---|---|`)
  for (const r of terms.slice(0, 80)) {
    const m = r.metrics ?? {}
    console.log(`| ${r.search_term_view?.search_term} | ${r.ad_group?.name} | ${micros(m.cost_micros)} | ${Math.round(Number(m.clicks ?? 0))} | ${Number(m.all_conversions ?? 0).toFixed(1)} |`)
  }

  /* 11. Nädalatrend: CPC ja IS */
  const weeks = await tryQ(
    "11. Nädalatrend",
    `SELECT segments.week, metrics.cost_micros, metrics.clicks, metrics.impressions,
            metrics.average_cpc, metrics.search_impression_share,
            metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share,
            metrics.conversions
     FROM campaign WHERE campaign.id = ${CAMPAIGN_ID} AND ${between} ORDER BY segments.week`,
    dump, "weeks",
  )
  console.log(`| Nädal | Kulu € | Kl | CPC € | IS | rank-lost | budget-lost | konv |`)
  console.log(`|---|---|---|---|---|---|---|---|`)
  for (const r of weeks) {
    const m = r.metrics ?? {}
    const pct = (v: unknown) => (v == null ? "-" : (Number(v) * 100).toFixed(0) + "%")
    console.log(`| ${r.segments?.week} | ${micros(m.cost_micros)} | ${Math.round(Number(m.clicks ?? 0))} | ${micros(m.average_cpc)} | ${pct(m.search_impression_share)} | ${pct(m.search_rank_lost_impression_share)} | ${pct(m.search_budget_lost_impression_share)} | ${Number(m.conversions ?? 0).toFixed(1)} |`)
  }

  /* 12. Keeled + ajakava + geo (kampaania kriteeriumid) */
  const crits = await tryQ(
    "12. Geo/keel/ajakava",
    `SELECT campaign_criterion.type, campaign_criterion.negative,
            campaign_criterion.location.geo_target_constant,
            campaign_criterion.language.language_constant,
            campaign_criterion.ad_schedule.day_of_week,
            campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.end_hour
     FROM campaign_criterion
     WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_criterion.type IN ('LOCATION','LANGUAGE','AD_SCHEDULE')`,
    dump, "criteria",
  )
  for (const r of crits) {
    const cc = r.campaign_criterion ?? {}
    const v = cc.location?.geo_target_constant ?? cc.language?.language_constant ??
      `${cc.ad_schedule?.day_of_week} ${cc.ad_schedule?.start_hour}-${cc.ad_schedule?.end_hour}`
    console.log(`- ${cc.type}: ${cc.negative ? "NEG " : ""}${v}`)
  }

  writeFileSync("tmp/main-campaign-audit.json", JSON.stringify(dump, null, 2), "utf-8")
  console.log(`\nSalvestatud: tmp/main-campaign-audit.json`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
