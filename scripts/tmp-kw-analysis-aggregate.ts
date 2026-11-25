/**
 * TEMP aggregator for tmp/kw-analysis-data.json -> console sections for the
 * client keyword analysis report. Run: npx tsx scripts/tmp-kw-analysis-aggregate.ts
 */
import { readFileSync } from "node:fs"
import { KEYWORD_FAMILIES } from "../lib/reporting/keyword-families"

const d = JSON.parse(readFileSync("tmp/kw-analysis-data.json", "utf-8"))

const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))
const micros = (v: unknown) => num(v) / 1e6
const field = (row: any, resource: string, name: string) => row?.[resource]?.[name]

/* ============ 1. SUBMISSIONS ============ */
console.log("## SUBMISSIONS (since 2026-05-01)")
for (const s of d.submissions.sort((a: any, b: any) => a.createdAt.localeCompare(b.createdAt))) {
  console.log(
    `${s.createdAt.slice(0, 10)} | ${s.form} | ${s.locale} | src=${s.source || "?"} | gclid=${s.gclid ? "Y" : "n"} | spam=${s.isSpam ? "Y" : "n"} | ${s.pageUrl || "-"} | ${s.company || "-"} | ${(s.message || "").replace(/\s+/g, " ").slice(0, 110)}`,
  )
}

/* ============ 2. AD COPY ============ */
console.log("\n## AD COPY (enabled ads)")
for (const r of d.ads.copy) {
  const rsa = field(r, "ad_group_ad", "ad") as any
  const headlines = (rsa?.responsive_search_ad?.headlines ?? []).map((h: any) => h.text).join(" | ")
  const descs = (rsa?.responsive_search_ad?.descriptions ?? []).map((x: any) => x.text).join(" | ")
  const urls = (rsa?.final_urls ?? []).join(",")
  console.log(`### ${field(r, "campaign", "name")} / ${field(r, "ad_group", "name")} -> ${urls}`)
  console.log(`  H: ${headlines}`)
  console.log(`  D: ${descs}`)
}

/* ============ 3. AD GROUPS ============ */
console.log("\n## AD GROUPS (90d)")
for (const r of d.ads.groups) {
  const m = r.metrics ?? {}
  console.log(
    `${field(r, "campaign", "name")} / ${field(r, "ad_group", "name")} [${field(r, "ad_group", "status")}] cost=${micros(m.cost_micros).toFixed(2)} clicks=${num(m.clicks)} impr=${num(m.impressions)} conv=${num(m.all_conversions).toFixed(1)}`,
  )
}

/* ============ 4. LANDING PAGES ============ */
console.log("\n## ADS LANDING PAGES (90d)")
for (const r of d.ads.landing) {
  const m = r.metrics ?? {}
  console.log(
    `${field(r, "landing_page_view", "unexpanded_final_url")} | ${field(r, "campaign", "name")} | clicks=${num(m.clicks)} impr=${num(m.impressions)} cost=${micros(m.cost_micros).toFixed(2)} conv=${num(m.all_conversions).toFixed(1)}`,
  )
}

/* ============ 5. NEGATIVES summary ============ */
console.log("\n## NEGATIVES")
const negByCampaign = new Map<string, number>()
for (const r of d.ads.negativesCampaign) {
  const c = String(field(r, "campaign", "name"))
  negByCampaign.set(c, (negByCampaign.get(c) ?? 0) + 1)
}
console.log("Campaign-level negatives by campaign:", JSON.stringify(Object.fromEntries(negByCampaign)))
const negAgByCampaign = new Map<string, number>()
for (const r of d.ads.negativesAdGroup) {
  const c = String(field(r, "campaign", "name"))
  negAgByCampaign.set(c, (negAgByCampaign.get(c) ?? 0) + 1)
}
console.log("Ad-group-level negatives by campaign:", JSON.stringify(Object.fromEntries(negAgByCampaign)))
// sample of campaign negatives in main campaign
const mainNeg = d.ads.negativesCampaign.filter((r: any) => String(field(r, "campaign", "name")).includes("Teenused - 2026"))
console.log(`Main campaign negatives (${mainNeg.length}):`, mainNeg.map((r: any) => field(r, "campaign_criterion", "keyword")?.text).slice(0, 200).join(", "))

/* ============ 6. SEARCH TERMS classification (90d, main campaign) ============ */
console.log("\n## SEARCH TERMS 90d — classification")
const WASTE = {
  b2c: /kod|korter|kolim|madrats|airbnb|elamu|maja(?!juhataja)|privaat/i,
  job: /töö\s|too\s|toole|tööd$|palk|palga|cv\b|töötaja|koolitus|vakants|tööpakkum|tööülesann|tööle|osatöö|koristajat|koristaja\s*o|otsime|tööintervjuu/i,
  region: /tartu|pärnu|valga|narva|haapsalu|kuressaare|viljandi|rakvere|paide|võru|jõhvi|saue(?!\s*korist)|kohila/i,
  gutter: /vihmavee|renn/i,
  death: /surma|surnu|lahkunu/i,
  irrelevant: /kanalisats|salvkaev|lohesurf|torupuhastus|keemiline puhastus|auto\b|köök|vaip(?!a)|lamellkardin/i,
}
function classify(term: string): string {
  const t = term.toLowerCase()
  if (/\bsps\b|sps[\s-]?(grupp|group)/i.test(t)) return "brand"
  for (const [k, re] of Object.entries(WASTE)) if (re.test(t)) return k
  if (/sol|iss\b|krausberg|kleenest|luuclean|smartclean|rentokil|tondi puhastus|aadli puhastus|liisu puhastus|kvatro|kendra/i.test(t)) return "competitor"
  return "ok"
}
const buckets: Record<string, { cost: number; clicks: number; conv: number; terms: { t: string; cost: number; clicks: number; conv: number }[] }> = {}
for (const r of d.ads.terms90) {
  const t = String(field(r, "search_term_view", "search_term") ?? "")
  const m = r.metrics ?? {}
  const b = classify(t)
  buckets[b] ??= { cost: 0, clicks: 0, conv: 0, terms: [] }
  buckets[b].cost += micros(m.cost_micros)
  buckets[b].clicks += num(m.clicks)
  buckets[b].conv += num(m.all_conversions)
  buckets[b].terms.push({ t, cost: micros(m.cost_micros), clicks: num(m.clicks), conv: num(m.all_conversions) })
}
let totalTermCost = 0
for (const [k, v] of Object.entries(buckets).sort((a, b) => b[1].cost - a[1].cost)) {
  totalTermCost += v.cost
  console.log(`- ${k}: cost=${v.cost.toFixed(2)} clicks=${v.clicks} conv=${v.conv.toFixed(1)} (${v.terms.length} terms)`)
}
console.log(`(sum of visible term cost = ${totalTermCost.toFixed(2)} — rest of spend is Google's hidden "other" terms)`)
for (const b of ["b2c", "job", "region", "gutter", "irrelevant", "competitor"]) {
  const v = buckets[b]
  if (!v) continue
  console.log(`\n### waste bucket "${b}":`)
  for (const t of v.terms.sort((a, b) => b.cost - a.cost).slice(0, 25)) {
    console.log(`  ${t.t} | ${t.cost.toFixed(2)} | cl=${t.clicks} | conv=${t.conv}`)
  }
}

/* ============ 7. MASTER KEYWORD TABLE ============ */
console.log("\n## MASTER KEYWORD TABLE (family -> GSC cur28 + Ads90 + Ads30)")
interface Agg { impr: number; clicks: number; wpos: number; cost: number; aClicks: number; aImpr: number; conv: number; convAll: number; aClicks30: number; cost30: number; conv30: number }
const gscFam: Record<string, Agg> = {}
for (const fam of KEYWORD_FAMILIES) {
  const g: Agg = { impr: 0, clicks: 0, wpos: 0, cost: 0, aClicks: 0, aImpr: 0, conv: 0, convAll: 0, aClicks30: 0, cost30: 0, conv30: 0 }
  for (const q of d.gsc.cur) {
    if (!fam.pattern.test(q.keys?.[0] ?? "")) continue
    g.impr += q.impressions
    g.clicks += q.clicks
    g.wpos += q.position * q.impressions
  }
  for (const r of d.ads.keywords90) {
    const kwText = String(field(r, "ad_group_criterion", "keyword")?.text ?? "")
    if (!fam.pattern.test(kwText)) continue
    const m = r.metrics ?? {}
    g.cost += micros(m.cost_micros)
    g.aClicks += num(m.clicks)
    g.aImpr += num(m.impressions)
    g.conv += num(m.conversions)
    g.convAll += num(m.all_conversions)
  }
  for (const r of d.ads.keywords30) {
    const kwText = String(field(r, "ad_group_criterion", "keyword")?.text ?? "")
    if (!fam.pattern.test(kwText)) continue
    const m = r.metrics ?? {}
    g.aClicks30 += num(m.clicks)
    g.cost30 += micros(m.cost_micros)
    g.conv30 += num(m.all_conversions)
  }
  gscFam[fam.id] = g
}
console.log("family | gscImpr28 | gscClicks28 | gscPos28 | adsCost90 | adsClicks90 | adsImpr90 | adsConvAll90 | adsCost30 | adsClicks30 | adsConv30")
for (const fam of KEYWORD_FAMILIES) {
  const g = gscFam[fam.id]
  console.log(
    `${fam.label} | ${g.impr} | ${g.clicks} | ${g.impr > 0 ? (g.wpos / g.impr).toFixed(1) : "-"} | ${g.cost.toFixed(2)} | ${g.aClicks} | ${g.aImpr} | ${g.convAll.toFixed(1)} | ${g.cost30.toFixed(2)} | ${g.aClicks30} | ${g.conv30.toFixed(1)}`,
  )
}

/* ============ 8b. KEYWORDS 30d with cost ============ */
console.log("\n## KEYWORDS 30d (cost>0)")
let kw30tot = 0
const kw30rows = d.ads.keywords30
  .map((r: any) => ({
    kw: field(r, "ad_group_criterion", "keyword")?.text,
    mt: field(r, "ad_group_criterion", "keyword")?.match_type,
    st: field(r, "ad_group_criterion", "status"),
    camp: String(field(r, "campaign", "name") ?? ""),
    cost: micros(r.metrics?.cost_micros),
    cl: num(r.metrics?.clicks),
    impr: num(r.metrics?.impressions),
    conv: num(r.metrics?.all_conversions),
  }))
  .filter((r: any) => r.cost > 0)
  .sort((a: any, b: any) => b.cost - a.cost)
for (const r of kw30rows) {
  kw30tot += r.cost
  const c = r.camp.includes("EN") ? "EN" : r.camp.includes("Maximize") ? "TEST" : "ET2026"
  console.log(`${r.kw} | ${r.mt} | ${r.st} | ${c} | ${r.cost.toFixed(2)} | cl=${r.cl} | impr=${r.impr} | conv=${r.conv.toFixed(1)}`)
}
console.log(`TOTAL kw30d = ${kw30tot.toFixed(2)}`)

/* ============ 8c. SEARCH TERMS 30d (cost>1) ============ */
console.log("\n## SEARCH TERMS 30d (cost>1)")
for (const r of d.ads.terms30.filter((r: any) => micros(r.metrics?.cost_micros) > 1)) {
  const m = r.metrics ?? {}
  console.log(
    `${field(r, "search_term_view", "search_term")} | ${micros(m.cost_micros).toFixed(2)} | cl=${num(m.clicks)} | impr=${num(m.impressions)} | conv=${num(m.all_conversions).toFixed(1)}`,
  )
}

/* ============ 8d. which ad group holds hoolduskoristus keywords (90d) ============ */
console.log("\n## hoolduskoristus keyword placement (90d)")
for (const r of d.ads.keywords90) {
  const kw = String(field(r, "ad_group_criterion", "keyword")?.text ?? "")
  if (!/hooldus/i.test(kw)) continue
  console.log(
    `${kw} | ${field(r, "ad_group_criterion", "keyword")?.match_type} | ${field(r, "ad_group_criterion", "status")} | ${field(r, "campaign", "name")} / ${field(r, "ad_group", "name")} | cost=${micros(r.metrics?.cost_micros).toFixed(2)}`,
  )
}

/* ============ 8. Ads search-term cost coverage ============ */
let termCostSum = 0
for (const r of d.ads.terms90) termCostSum += micros(r.metrics?.cost_micros)
console.log(`\ntermCostSum90 = ${termCostSum.toFixed(2)}`)
let term30 = 0
for (const r of d.ads.terms30) term30 += micros(r.metrics?.cost_micros)
console.log(`termCostSum30 = ${term30.toFixed(2)}`)
let kwCostSum = 0
for (const r of d.ads.keywords90) kwCostSum += micros(r.metrics?.cost_micros)
console.log(`kwCostSum90 = ${kwCostSum.toFixed(2)}`)

/* ============ 9. GSC top queries cur28 (top 60) ============ */
console.log("\n## GSC TOP QUERIES cur28")
const sorted = [...d.gsc.cur].sort((a: any, b: any) => b.impressions - a.impressions)
for (const q of sorted.slice(0, 60)) {
  console.log(`${q.keys?.[0]} | impr=${q.impressions} cl=${q.clicks} pos=${q.position.toFixed(1)}`)
}
console.log("\n## GSC totals cur28:", JSON.stringify(d.gsc.totalsCur))

/* ============ 10. GA4 ============ */
console.log("\n## GA4 channels 90d")
for (const r of d.ga4?.channels?.rows ?? []) {
  console.log(`${r.dimensionValues?.[0]?.value} | sessions=${r.metricValues?.[0]?.value} engaged=${r.metricValues?.[1]?.value} users=${r.metricValues?.[2]?.value}`)
}
console.log("\n## GA4 paid landing pages 90d")
for (const r of d.ga4?.paidLandings?.rows ?? []) {
  console.log(`${r.dimensionValues?.[0]?.value} | sessions=${r.metricValues?.[0]?.value}`)
}
