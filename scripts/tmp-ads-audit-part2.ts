/**
 * TEMP (analüüs 14.10.2026): Ads süva-audit OSA 2 — parandab osa 1 vead.
 *  - kampaaniate seaded (väljadega, mis v25-s töötavad)
 *  - otsingusõnad ilma metrics-WHERE-ta (filtreeritakse JS-is)
 *  - seadmed + nädalapäevad
 *  - negatiivsete jaotus kampaaniate kaupa + 2026 kampaania negatiivsed
 *  - geo/keele konstantide nimede lahendus
 * Käivita: npx tsx scripts/tmp-ads-audit-part2.ts
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
let TOKEN = ""

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

type Row = Record<string, any>

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
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GAQL ${res.status}: ${text.slice(0, 300)}\nQUERY: ${query.slice(0, 160)}`)
    }
    const data = (await res.json()) as { results?: Row[]; nextPageToken?: string }
    rows.push(...(data.results ?? []).map((r) => snakeKeys(r) as Row))
    pageToken = data.nextPageToken
  } while (pageToken)
  return rows
}

const micros = (v: unknown) => (Number(v ?? 0) / 1e6).toFixed(2)
const int = (v: unknown) => String(Math.round(Number(v ?? 0)))

const BUCKETS: Array<[string, RegExp]> = [
  ["bränd (sps)", /\bsps\b|sps[\s-]?(grupp|group)/i],
  ["vihmaveerennid", /renn|vihmavee/i],
  ["ventilatsioon", /ventila/i],
  ["B2C kodu/korter", /\bkodu\b|kodukorist|korter|eramaja|eramu|kolimis|korteriühist/i],
  ["surmajärgne", /surma|lahkun/i],
  ["tööotsija", /tööd|töökohta|töötaja|palga|vakants/i],
  ["piirkonnaväline", /tartu|pärnu|valga|narva|viljandi|rakvere|kuressaare|haapsalu|paide|jõhvi/i],
  ["auto/muu võõras", /\bauto\b|autode|salongi/i],
  ["konkurendi bränd", /liisu|\bsol\b|tondi|\biss\b|kvatro|forus/i],
  ["hind/hinnakiri", /hind|hinnakiri|hinnad|maksumus/i],
  ["hoolduskoristus-core", /hoolduskorist|kontori\s*korist|kontorikorist|äripind|trepik|regulaar|lepingul/i],
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
  console.log(`# Süva-audit OSA 2 — ${from} -> ${to}\n`)

  /* 1. Kampaaniate seaded — sammhaaval, et leida toetatud väljad */
  try {
    const rows = await gaql(
      `SELECT campaign.name, campaign.status, campaign.bidding_strategy_type,
              campaign_budget.amount_micros, campaign_budget.explicitly_shared
       FROM campaign`,
    )
    console.log(`## Eelarved ja pakkumisstrateegiad`)
    for (const r of rows) {
      console.log(
        `- ${r.campaign?.name} [${r.campaign?.status}] ${r.campaign?.bidding_strategy_type} €${micros(r.campaign_budget?.amount_micros)}/päev shared=${r.campaign_budget?.explicitly_shared}`,
      )
    }
  } catch (e) {
    console.log(`## Eelarved — VIGA: ${e instanceof Error ? e.message : e}`)
  }
  try {
    const rows = await gaql(
      `SELECT campaign.name,
              campaign.network_settings.target_google_search,
              campaign.network_settings.target_search_network,
              campaign.network_settings.target_content_network,
              campaign.geo_target_type_setting.positive_geo_target_type
       FROM campaign WHERE campaign.status = 'ENABLED'`,
    )
    console.log(`\n## Võrgud + geo-tüüp (ENABLED kampaaniad)`)
    for (const r of rows) {
      const ns = r.campaign?.network_settings ?? {}
      console.log(
        `- ${r.campaign?.name}: googleSearch=${ns.target_google_search} searchPartners=${ns.target_search_network} display=${ns.target_content_network} geo+=${r.campaign?.geo_target_type_setting?.positive_geo_target_type}`,
      )
    }
  } catch (e) {
    console.log(`\n## Võrgud — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 2. Geo + keele konstantide nimed */
  try {
    const rows = await gaql(
      `SELECT geo_target_constant.name, geo_target_constant.id, geo_target_constant.target_type
       FROM geo_target_constant
       WHERE geo_target_constant.resource_name IN ('geoTargetConstants/9061552','geoTargetConstants/9061562')`,
    )
    console.log(`\n## Geo-konstandid`)
    for (const r of rows) console.log(`- ${r.geo_target_constant?.id}: ${r.geo_target_constant?.name} (${r.geo_target_constant?.target_type})`)
  } catch (e) {
    console.log(`\n## Geo-konstandid — VIGA: ${e instanceof Error ? e.message : e}`)
  }
  try {
    const rows = await gaql(
      `SELECT language_constant.name, language_constant.id
       FROM language_constant
       WHERE language_constant.resource_name IN ('languageConstants/1000','languageConstants/1001','languageConstants/1031','languageConstants/1043')`,
    )
    console.log(`\n## Keelekonstandid`)
    for (const r of rows) console.log(`- ${r.language_constant?.id}: ${r.language_constant?.name}`)
  } catch (e) {
    console.log(`\n## Keelekonstandid — VIGA: ${e instanceof Error ? e.message : e}`)
  }

  /* 3. Otsingusõnad — ilma metrics-WHERE-ta */
  const terms = await gaql(
    `SELECT search_term_view.search_term, campaign.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions
     FROM search_term_view
     WHERE ${between}
     ORDER BY metrics.cost_micros DESC
     LIMIT 1000`,
  )
  const withCost = terms.filter((r) => Number(r.metrics?.cost_micros ?? 0) > 0 || Number(r.metrics?.impressions ?? 0) > 0)
  writeFileSync("tmp/ads-audit-search-terms.json", JSON.stringify(withCost, null, 2), "utf-8")
  const totals: Record<string, { cost: number; clicks: number; conv: number; n: number; terms: string[] }> = {}
  let allCost = 0
  for (const r of withCost) {
    const t = String(r.search_term_view?.search_term ?? "")
    const m = r.metrics ?? {}
    const cost = Number(m.cost_micros ?? 0)
    allCost += cost
    const bucket = BUCKETS.find(([, re]) => re.test(t))?.[0] ?? "muu (teenuse-üldine)"
    totals[bucket] ??= { cost: 0, clicks: 0, conv: 0, n: 0, terms: [] }
    totals[bucket].cost += cost
    totals[bucket].clicks += Number(m.clicks ?? 0)
    totals[bucket].conv += Number(m.all_conversions ?? 0)
    totals[bucket].n += 1
    if (cost > 2e6) totals[bucket].terms.push(`${t} (€${micros(cost)})`)
  }
  console.log(`\n## Otsingusõnade klassifikatsioon (${withCost.length} terminit, kulu kokku €${(allCost / 1e6).toFixed(2)})`)
  console.log(`| Kimp | Termineid | Kulu € | Klikid | Kõik konv. | Suurimad (kulu>€2) |`)
  console.log(`|---|---|---|---|---|---|`)
  for (const [b, v] of Object.entries(totals).sort((a, b) => b[1].cost - a[1].cost)) {
    console.log(`| ${b} | ${v.n} | ${(v.cost / 1e6).toFixed(2)} | ${Math.round(v.clicks)} | ${v.conv.toFixed(1)} | ${v.terms.slice(0, 8).join(", ").slice(0, 200)} |`)
  }

  /* 4. Seadmed + nädalapäevad */
  const dev = await gaql(
    `SELECT segments.device, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.all_conversions
     FROM campaign WHERE ${between}`,
  )
  console.log(`\n## Seadmed`)
  for (const r of dev) {
    const m = r.metrics ?? {}
    console.log(`- ${r.segments?.device}: €${micros(m.cost_micros)} kl=${int(m.clicks)} näit=${int(m.impressions)} konv=${Number(m.all_conversions ?? 0).toFixed(1)}`)
  }
  const dow = await gaql(
    `SELECT segments.day_of_week, metrics.cost_micros, metrics.clicks, metrics.all_conversions
     FROM campaign WHERE ${between}`,
  )
  console.log(`\n## Nädalapäevad`)
  for (const r of dow) {
    const m = r.metrics ?? {}
    console.log(`- ${r.segments?.day_of_week}: €${micros(m.cost_micros)} kl=${int(m.clicks)} konv=${Number(m.all_conversions ?? 0).toFixed(1)}`)
  }

  /* 5. Negatiivsete jaotus + 2026 kampaania negatiivsed */
  const negs = await gaql(
    `SELECT campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
     FROM campaign_criterion
     WHERE campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'
       AND campaign.status != 'REMOVED'`,
  )
  const byCampaign = new Map<string, number>()
  for (const r of negs) byCampaign.set(r.campaign?.name, (byCampaign.get(r.campaign?.name) ?? 0) + 1)
  console.log(`\n## Kampaania-negatiivsete jaotus`)
  for (const [c, n] of [...byCampaign.entries()].sort((a, b) => b[1] - a[1])) console.log(`- ${c}: ${n}`)
  const neg2026 = negs.filter((r) => r.campaign?.name === "Otsing - Teenused - 2026")
  console.log(`\n## "Otsing - Teenused - 2026" negatiivsed (${neg2026.length}) — esimesed 120`)
  for (const r of neg2026.slice(0, 120)) {
    console.log(`- [${r.campaign_criterion?.keyword?.match_type}] ${r.campaign_criterion?.keyword?.text}`)
  }

  /* 6. Jagatud nimekirjade kokkuvõte (nimi + mitu kw) */
  try {
    const rows = await gaql(
      `SELECT shared_set.name, shared_set.status, shared_set.type, shared_set.member_count
       FROM shared_set`,
    )
    console.log(`\n## Jagatud nimekirjad`)
    for (const r of rows) console.log(`- ${r.shared_set?.name} [${r.shared_set?.status}] ${r.shared_set?.type} liiget=${r.shared_set?.member_count}`)
  } catch (e) {
    console.log(`\n## Jagatud nimekirjad — VIGA: ${e instanceof Error ? e.message : e}`)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
