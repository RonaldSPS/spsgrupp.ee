/** TEMP: cluster-level Ads aggregates (each keyword/term in exactly one cluster). Run: npx tsx scripts/tmp-kw-clusters.ts */
import { readFileSync } from "node:fs"

const d = JSON.parse(readFileSync("tmp/kw-analysis-data.json", "utf-8"))
const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v))
const micros = (v: unknown) => num(v) / 1e6
const field = (row: any, res: string, n: string) => row?.[res]?.[n]

const CLUSTERS: [string, RegExp][] = [
  ["hoolduskoristus", /hoolduskoristus/i],
  ["kontori-koristus", /kontori|kontorikoristus|büroo|buroo/i],
  ["trepikoja-koristus", /trepikoj|trepikodade|trepp/i],
  ["kojamehe-teenus", /kojameh/i],
  ["koristusfirma", /koristus\s?firma|koristusettev/i],
  ["puhastusfirma", /puhastus\s?firma|puhastusettev/i],
  ["ehitusjärgne", /ehitusjär|ehitusjarg|remondijär|remondijarg|ehituskoristus/i],
  ["EN-cleaning", /cleaning|facility/i],
  ["puhastusteenused", /puhastus\s?teenus|puhastusteen/i],
  ["koristusteenused", /koristust|koristustööd|^koristus$/i],
  ["akende-pesu", /akende|akna/i],
  ["fassaadipesu", /fassaad/i],
  ["heakord", /heakorr/i],
]

function clusterOf(text: string): string {
  for (const [name, re] of CLUSTERS) if (re.test(text)) return name
  return "muu"
}

interface S { cost: number; clicks: number; impr: number; conv: number; convAll: number; kws: string[] }

function aggregate(rows: any[], getText: (r: any) => string, label: string) {
  const map = new Map<string, S>()
  let total = 0
  for (const r of rows) {
    const t = getText(r)
    const c = clusterOf(t)
    if (!map.has(c)) map.set(c, { cost: 0, clicks: 0, impr: 0, conv: 0, convAll: 0, kws: [] })
    const s = map.get(c)!
    const m = r.metrics ?? {}
    const cost = micros(m.cost_micros)
    total += cost
    s.cost += cost
    s.clicks += num(m.clicks)
    s.impr += num(m.impressions)
    s.conv += num(m.conversions)
    s.convAll += num(m.all_conversions)
    if (cost > 0 && !s.kws.includes(t)) s.kws.push(t)
  }
  console.log(`\n## ${label} (total cost ${total.toFixed(2)})`)
  console.log("cluster | cost | clicks | impr | conv | allconv")
  for (const [c, s] of [...map.entries()].sort((a, b) => b[1].cost - a[1].cost)) {
    console.log(`${c} | ${s.cost.toFixed(2)} | ${s.clicks} | ${s.impr} | ${s.conv.toFixed(1)} | ${s.convAll.toFixed(1)}`)
  }
  return map
}

aggregate(d.ads.keywords90, (r) => String(field(r, "ad_group_criterion", "keyword")?.text ?? "?"), "ADS KEYWORDS 90d by cluster")
aggregate(d.ads.keywords30, (r) => String(field(r, "ad_group_criterion", "keyword")?.text ?? "?"), "ADS KEYWORDS 30d by cluster")
aggregate(d.ads.terms90, (r) => String(field(r, "search_term_view", "search_term") ?? "?"), "ADS SEARCH TERMS 90d by cluster (visible)")

// conversions "all" breakdown per campaign totals
console.log("\n## ad group -> keyword breakdown 90d (2026 campaign, cost>0)")
for (const r of d.ads.keywords90) {
  const c = String(field(r, "campaign", "name") ?? "")
  if (!c.includes("Teenused - 2026") || c.includes("Maximize")) continue
  const m = r.metrics ?? {}
  const cost = micros(m.cost_micros)
  if (cost <= 0) continue
  const kw = field(r, "ad_group_criterion", "keyword") as any
  console.log(
    `${String(field(r, "ad_group", "name")).padEnd(22)} | ${String(kw?.text).padEnd(28)} | ${String(kw?.match_type).padEnd(6)} | ${cost.toFixed(2)} | cl=${num(m.clicks)} | conv=${num(m.all_conversions).toFixed(1)}`,
  )
}

// conversions "all" breakdown per campaign totals
console.log("\n## campaign totals 90d")
for (const r of d.ads.campaigns) {
  const m = r.metrics ?? {}
  console.log(
    `${field(r, "campaign", "name")} | ${field(r, "campaign", "status")} | cost=${micros(m.cost_micros).toFixed(2)} | cl=${num(m.clicks)} | impr=${num(m.impressions)} | conv=${num(m.conversions).toFixed(1)} | allconv=${num(m.all_conversions).toFixed(1)} | IS=${(num(m.search_impression_share) * 100).toFixed(1)}% | lostRank=${(num(m.search_rank_lost_impression_share) * 100).toFixed(1)}% | lostBudget=${(num(m.search_budget_lost_impression_share) * 100).toFixed(1)}%`,
  )
}
