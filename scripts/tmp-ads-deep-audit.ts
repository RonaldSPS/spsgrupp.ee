/**
 * TEMP (analüüs 14.10.2026): Google Ads konto süva-audit — read-only GAQL.
 * Täiendab scripts/ads-report.ts: kampaaniate seaded (geo-tyyp, võrgud, budget),
 * sihtimised, reklaamgrupid, RSA reklaamide tekstid, negatiivsed märksõnad
 * (kampaania + shared + konto tase), täielik otsingusõnade nimekiri jäme
 * klassifikatsiooniga, seadmed ja nädalapäevad.
 * Käivita: npx tsx scripts/tmp-ads-deep-audit.ts
 * Väljundid: konsool + tmp/ads-audit-search-terms.json + tmp/ads-deep-audit.json
 */
import { writeFileSync } from "node:fs"
import { getGoogleAccessToken } from "../lib/reporting/google-auth"
import { readFileSync, existsSync } from "node:fs"

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
      throw new Error(`GAQL ${res.status}: ${text.slice(0, 400)}\nQUERY: ${query.slice(0, 200)}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const micros = (v: unknown) => (Number(v ?? 0) / 1e6).toFixed(2)
const int = (v: unknown) => String(Math.round(Number(v ?? 0)))

/* Otsingusõnade jäme klassifikatsioon (analüüsiks, mitte toodangu loogika). */
const BUCKETS: Array<[string, RegExp]> = [
  ["bränd (sps)", /\bsps\b|sps[\s-]?(grupp|group)/i],
  ["vihmaveerennid", /renn|vihmavee/i],
  ["ventilatsioon", /ventila/i],
  ["B2C kodu/korter", /\bkodu\b|kodukorist|korter|eramaja|eramu|maja\s*koristus|kolimis/i],
  ["surmajärgne", /surma|lahkun/i],
  ["tööotsija", /tööd|töökohta|töötaja|palga|vakants/i],
  ["piirkonnaväline", /tartu|pärnu|pärnu|valga|narva|viljandi|rakvere|kuressaare/i],
  ["auto/muu võõras", /\bauto\b|autode|salongi/i],
  ["konkurendi bränd", /liisu|\bsol\b|tondi|\biss\b|kvatro|forus/i],
  ["hind/hinnakiri", /hind|hinnakiri|hinnad|kulu|maksumus/i],
  ["hoolduskoristus-core", /hoolduskorist|kontori\s*korist|kontorikorist|äripind|trepik|regulaar/i],
]

async function main() {
  TOKEN = await getGoogleAccessToken(["https://www.googleapis.com/auth/adwords"])
  const end = new Date()
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - 89)
  const from = start.toISOString().slice(0, 10)
  const to = end.toISOString().slice(0, 10)
  const between = `segments.date BETWEEN '${from}' AND '${to}'`
  console.log(`# Süva-audit ${from} -> ${to} (customer ${CID})\n`)
  const dump: Record<string, unknown> = {}

  /* 1. Kampaaniate seaded */
  try {
    const rows = await gaql(
      `SELECT campaign.id, campaign.name, campaign.status, campaign.bidding_strategy_type,
              campaign.advertising_channel_type, campaign.start_date,
              campaign_budget.amount_micros, campaign_budget.explicitly_shared,
              campaign.network_settings.target_google_search,
              campaign.network_settings.target_search_network,
              campaign.network_settings.target_partner_search_network,
              campaign.network_settings.target_content_network,
              campaign.geo_target_type_setting.positive_geo_target_type,
              campaign.geo_target_type_setting.negative_geo_target_type
       FROM campaign`,
    )
    dump.campaignSettings = rows
    console.log(`## Kampaaniate seaded`)
    for (const r of rows) {
      const c = r.campaign ?? {}
      const ns = c.network_settings ?? {}
      const gt = c.geo_target_type_setting ?? {}
      console.log(
        `- ${c.name} [${c.status}] bidding=${c.bidding_strategy_type} päevaeelarve=€${micros(r.campaign_budget?.amount_micros)} sharedBudget=${r.campaign_budget?.explicitly_shared} võrgud: google=${ns.target_google_search} searchPartners=${ns.target_search_network} partner=${ns.target_partner_search_network} display=${ns.target_content_network} geo+: ${gt.positive_geo_target_type} geo-: ${gt.negative_geo_target_type} start=${c.start_date}`,
      )
    }
  } catch (e) {
    console.log(`## Kampaaniate seaded — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 2. Sihtimised: geo + keel + ajakava */
  for (const [label, type] of [
    ["Geo-sihtimine", "LOCATION"],
    ["Keeled", "LANGUAGE"],
    ["Ajakava", "AD_SCHEDULE"],
  ] as const) {
    try {
      const rows = await gaql(
        `SELECT campaign.name, campaign_criterion.negative, campaign_criterion.type,
                campaign_criterion.location.geo_target_constant,
                campaign_criterion.language.language_constant,
                campaign_criterion.ad_schedule.day_of_week,
                campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.end_hour
         FROM campaign_criterion
         WHERE campaign_criterion.type = '${type}' AND campaign.status != 'REMOVED'`,
      )
      console.log(`\n## ${label}`)
      for (const r of rows) {
        const cc = r.campaign_criterion ?? {}
        const extra =
          type === "LOCATION"
            ? cc.location?.geo_target_constant
            : type === "LANGUAGE"
              ? cc.language?.language_constant
              : `${cc.ad_schedule?.day_of_week} ${cc.ad_schedule?.start_hour}-${cc.ad_schedule?.end_hour}`
        console.log(`- ${r.campaign?.name}: ${cc.negative ? "NEG " : ""}${extra}`)
      }
    } catch (e) {
      console.log(`\n## ${label} — VIGA: ${e instanceof Error ? e.message : e}`)
    }
  }

  /* 3. Reklaamgrupid */
  try {
    const rows = await gaql(
      `SELECT campaign.name, ad_group.name, ad_group.status, ad_group.type,
              metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
       FROM ad_group WHERE ${between}
       ORDER BY metrics.cost_micros DESC`,
    )
    dump.adGroups = rows
    console.log(`\n## Reklaamgrupid`)
    for (const r of rows) {
      const m = r.metrics ?? {}
      console.log(
        `- ${r.campaign?.name} / ${r.ad_group?.name} [${r.ad_group?.status}] €${micros(m.cost_micros)} kl=${int(m.clicks)} näit=${int(m.impressions)} konv=${Number(m.conversions ?? 0).toFixed(1)}`,
      )
    }
  } catch (e) {
    console.log(`\n## Reklaamgrupid — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 4. RSA reklaamid */
  try {
    const rows = await gaql(
      `SELECT campaign.name, ad_group.name, ad_group_ad.ad.id, ad_group_ad.status,
              ad_group_ad.ad.final_urls,
              ad_group_ad.ad.responsive_search_ad.headlines,
              ad_group_ad.ad.responsive_search_ad.descriptions,
              ad_group_ad.ad.responsive_search_ad.path1, ad_group_ad.ad.responsive_search_ad.path2,
              metrics.impressions, metrics.clicks
       FROM ad_group_ad
       WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED'`,
    )
    dump.ads = rows
    console.log(`\n## RSA reklaamid`)
    for (const r of rows) {
      const rsa = r.ad_group_ad?.ad?.responsive_search_ad ?? {}
      const heads = (rsa.headlines ?? []).map((h: any) => h.text).filter(Boolean)
      const descs = (rsa.descriptions ?? []).map((d: any) => d.text).filter(Boolean)
      console.log(`- ${r.campaign?.name} / ${r.ad_group?.name} [${r.ad_group_ad?.status}] url=${(r.ad_group_ad?.ad?.final_urls ?? []).join(",")}`)
      console.log(`  H (${heads.length}): ${heads.join(" | ")}`)
      console.log(`  D (${descs.length}): ${descs.join(" | ")}`)
    }
  } catch (e) {
    console.log(`\n## RSA reklaamid — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 5. Negatiivsed: kampaania-tase */
  try {
    const rows = await gaql(
      `SELECT campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
       FROM campaign_criterion
       WHERE campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'
         AND campaign.status != 'REMOVED'`,
    )
    dump.campaignNegatives = rows
    console.log(`\n## Kampaania-taseme negatiivsed (${rows.length})`)
    for (const r of rows) {
      console.log(`- ${r.campaign?.name}: [${r.campaign_criterion?.keyword?.match_type}] ${r.campaign_criterion?.keyword?.text}`)
    }
  } catch (e) {
    console.log(`\n## Kampaania-negatiivsed — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 6. Negatiivsed: jagatud nimekirjad + konto tase */
  try {
    const rows = await gaql(
      `SELECT shared_set.name, shared_set.status, shared_criterion.keyword.text, shared_criterion.keyword.match_type
       FROM shared_criterion`,
    )
    dump.sharedNegatives = rows
    console.log(`\n## Jagatud negatiivsete nimekirjad (${rows.length})`)
    for (const r of rows) {
      console.log(`- ${r.shared_set?.name}: [${r.shared_criterion?.keyword?.match_type}] ${r.shared_criterion?.keyword?.text}`)
    }
  } catch (e) {
    console.log(`\n## Jagatud negatiivsed — VIGA: ${e instanceof Error ? e.message : e}`)
  }
  for (const q of [
    `SELECT customer_criterion.keyword.text, customer_criterion.keyword.match_type
     FROM customer_criterion
     WHERE customer_criterion.negative = TRUE AND customer_criterion.type = 'KEYWORD'`,
    `SELECT customer_negative_criterion.keyword.text, customer_negative_criterion.keyword.match_type
     FROM customer_negative_criterion`,
  ]) {
    try {
      const rows = await gaql(q)
      dump.accountNegatives = rows
      console.log(`\n## Konto-taseme negatiivsed (${rows.length})`)
      for (const r of rows) {
        const kw = r.customer_criterion?.keyword ?? r.customer_negative_criterion?.keyword ?? {}
        console.log(`- [${kw.match_type}] ${kw.text}`)
      }
      break
    } catch {
      /* järgmine variant */
    }
  }

  /* 7. Kõik otsingusõnad (kulu>0 või näitamisi>0) + jäme klassifikatsioon */
  const terms = await gaql(
    `SELECT search_term_view.search_term, campaign.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM search_term_view
     WHERE ${between} AND (metrics.cost_micros > 0 OR metrics.impressions > 0)
     ORDER BY metrics.cost_micros DESC
     LIMIT 800`,
  )
  writeFileSync("tmp/ads-audit-search-terms.json", JSON.stringify(terms, null, 2), "utf-8")
  const totals: Record<string, { cost: number; clicks: number; conv: number; terms: string[] }> = {}
  let allCost = 0
  for (const r of terms) {
    const t = String(r.search_term_view?.search_term ?? "")
    const m = r.metrics ?? {}
    const cost = Number(m.cost_micros ?? 0)
    allCost += cost
    const bucket = BUCKETS.find(([, re]) => re.test(t))?.[0] ?? "muu (teenuse-üldine)"
    totals[bucket] ??= { cost: 0, clicks: 0, conv: 0, terms: [] }
    totals[bucket].cost += cost
    totals[bucket].clicks += Number(m.clicks ?? 0)
    totals[bucket].conv += Number(m.all_conversions ?? 0)
    if (cost > 3e6 && totals[bucket].terms.length < 12) totals[bucket].terms.push(t)
  }
  console.log(`\n## Otsingusõnade klassifikatsioon (kokku €${(allCost / 1e6).toFixed(2)} terminites)`)
  console.log(`| Kimp | Kulu € | Klikid | Kõik konv. | Näidisterminid (kulu>€3) |`)
  console.log(`|---|---|---|---|---|`)
  for (const [b, v] of Object.entries(totals).sort((a, b) => b[1].cost - a[1].cost)) {
    console.log(`| ${b} | ${(v.cost / 1e6).toFixed(2)} | ${Math.round(v.clicks)} | ${v.conv.toFixed(1)} | ${v.terms.join(", ").slice(0, 180)} |`)
  }

  /* 8. Seadmed + nädalapäevad */
  try {
    const rows = await gaql(
      `SELECT segments.device, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.all_conversions
       FROM campaign WHERE ${between}`,
    )
    console.log(`\n## Seadmed`)
    for (const r of rows) {
      const m = r.metrics ?? {}
      console.log(`- ${r.segments?.device}: €${micros(m.cost_micros)} kl=${int(m.clicks)} konv=${Number(m.all_conversions ?? 0).toFixed(1)}`)
    }
  } catch (e) {
    console.log(`\n## Seadmed — VIGA: ${e instanceof Error ? e.message : e}`)
  }
  try {
    const rows = await gaql(
      `SELECT segments.day_of_week, metrics.cost_micros, metrics.clicks, metrics.all_conversions
       FROM campaign WHERE ${between}`,
    )
    console.log(`\n## Nädalapäevad`)
    for (const r of rows) {
      const m = r.metrics ?? {}
      console.log(`- ${r.segments?.day_of_week}: €${micros(m.cost_micros)} kl=${int(m.clicks)} konv=${Number(m.all_conversions ?? 0).toFixed(1)}`)
    }
  } catch (e) {
    console.log(`\n## Nädalapäevad — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  writeFileSync("tmp/ads-deep-audit.json", JSON.stringify(dump, null, 2), "utf-8")
  console.log(`\nSalvestatud: tmp/ads-audit-search-terms.json, tmp/ads-deep-audit.json`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
