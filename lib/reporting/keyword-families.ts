/**
 * The tracked keyword families (märksõnaperekonnad) — same set as the manual
 * weekly reports in raportid/ (see RAPORTI-KOOSTAMINE-JUHEND.md §4 "Märksõnade
 * peatabel", 21 peret) plus the RU/EN/ehitusprahi clusters the reports track
 * in §6. Matching is case-insensitive substring/regex on the GSC query;
 * families may overlap on purpose (a parent family includes its variants).
 *
 * Position per family = impression-weighted average across matching queries
 * (same methodology as the manual reports).
 */

import type { GscQuery, KeywordFamilyStat } from "./types"

interface KeywordFamilyDef {
  id: string
  label: string
  pattern: RegExp
}

export const KEYWORD_FAMILIES: KeywordFamilyDef[] = [
  { id: "koristusfirma", label: "koristusfirma", pattern: /koristus\s?firma|koristusfirma/i },
  { id: "koristusfirma-tallinnas", label: "koristusfirma tallinnas", pattern: /koristus\s?firma.*tallinn|tallinn.*koristus\s?firma/i },
  { id: "kontori-koristus", label: "kontori koristus", pattern: /kontori\w*\s+(korist|puhast)/i },
  { id: "kontorikoristus", label: "kontorikoristus", pattern: /kontorikoristus/i },
  { id: "buroode-koristus", label: "büroode koristus", pattern: /büroo\w*\s+(korist|puhast)/i },
  { id: "hoolduskoristus", label: "hoolduskoristus", pattern: /hoolduskoristus/i },
  { id: "puhastusteenused", label: "puhastusteenused", pattern: /puhastusteenus/i },
  { id: "puhastusteenused-tallinnas", label: "puhastusteenused tallinnas", pattern: /puhastusteenus\w*.*tallinn|tallinn.*puhastusteenus/i },
  { id: "koristusteenused", label: "koristusteenused", pattern: /koristusteenus/i },
  { id: "koristusteenused-tallinnas", label: "koristusteenused tallinnas", pattern: /koristusteenus\w*.*tallinn|tallinn.*koristusteenus/i },
  { id: "puhastusfirma", label: "puhastusfirma", pattern: /puhastusfirma|puhastus\s?firma/i },
  { id: "aripindade-koristus", label: "äripindade koristus", pattern: /äripind|kaubanduspind|arihoone/i },
  { id: "akende-pesu", label: "akende pesu", pattern: /akende?\w*\s+(pesu|pesemine|puhast)|aknapesu|akende pesu/i },
  { id: "akende-pesu-tallinnas", label: "akende pesu tallinnas", pattern: /(akende?\w*\s+(pesu|pesemine|puhast)|aknapesu).*tallinn|tallinn.*(akende|akna)/i },
  { id: "suurpuhastus", label: "suurpuhastus", pattern: /suurpuhastus/i },
  { id: "porandate-suvapesu", label: "põrandate süvapesu", pattern: /põrand\w*\s+(süva|süvapuhastus|süvapesu)|süvapesu/i },
  { id: "fassaadipesu", label: "fassaadipesu", pattern: /fassaadi?\w*\s*pesu/i },
  { id: "eripuhastustood", label: "eripuhastustööd", pattern: /eripuhastus/i },
  { id: "toostuskoristus", label: "tööstuskoristus", pattern: /tööstus\w*\s*(korist|puhast)/i },
  { id: "ehitusprahi-aravedu", label: "ehitusprahi/jäätmete äravedu", pattern: /äravedu|ära\s?vedu|ehituspraht|ehitusprahi|ehitusjäätme|konteineri?\w*\s+(rent|tellim)|prahi/i },
  { id: "ru-kliining", label: "клининг (RU)", pattern: /клининг|уборка|мойка окон|вывоз мусора/i },
  { id: "en-cleaning", label: "cleaning company/services (EN)", pattern: /cleaning\s+(compan|service)|facade cleaning/i },
]

/** Impression-weighted average position of matching rows (null when no impressions). */
function aggregate(rows: GscQuery[]): { impressions: number; clicks: number; position: number | null } {
  let impressions = 0
  let clicks = 0
  let weightedPos = 0
  for (const row of rows) {
    impressions += row.impressions
    clicks += row.clicks
    if (row.impressions > 0) weightedPos += row.position * row.impressions
  }
  return {
    impressions,
    clicks,
    position: impressions > 0 ? weightedPos / impressions : null,
  }
}

export function computeFamilyStats(current: GscQuery[], previous: GscQuery[]): KeywordFamilyStat[] {
  return KEYWORD_FAMILIES.map((fam) => ({
    id: fam.id,
    label: fam.label,
    current: aggregate(current.filter((q) => fam.pattern.test(q.query))),
    previous: aggregate(previous.filter((q) => fam.pattern.test(q.query))),
  }))
}

/** Brand queries (excluded from "new keyword" discovery - not interesting). */
const BRAND_RE = /\bsps\b|sps[\s-]?(grupp|group)/i

/** Queries with real impressions now that were absent/invisible in the previous period. */
export function findNewQueries(current: GscQuery[], previous: GscQuery[], minImpressions = 10): GscQuery[] {
  const prevByQuery = new Map(previous.map((q) => [q.query, q.impressions]))
  return current
    .filter((q) => q.impressions >= minImpressions)
    .filter((q) => (prevByQuery.get(q.query) ?? 0) < minImpressions / 2)
    .filter((q) => !BRAND_RE.test(q.query))
    .sort((a, b) => b.impressions - a.impressions)
}
