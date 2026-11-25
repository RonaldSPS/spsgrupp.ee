/**
 * One-off backfill diagnostic (25.09.2026): which page carries each tracked
 * keyword family week over week, and did Google switch the carrier page?
 * Uses the new query×page carrier logic in lib/reporting/gsc.ts.
 *
 * Run: npx tsx scripts/tmp-carrier-backfill.ts   (needs GSC_SITE_URL + .secrets/gcp-analytics.json)
 * Env: BACKFILL_WEEKS (default 8).
 */

import { pullGsc } from "../lib/reporting/gsc"
import { isoDate, weeklyPeriod } from "../lib/reporting/google-auth"
import type { ReportPeriod } from "../lib/reporting/types"

const TARGET_FAMILIES = ["koristusfirma", "koristusfirma-tallinnas", "puhastusteenused", "ru-kliining", "suurpuhastus"]

function stepBack(period: ReportPeriod, weeks: number): ReportPeriod {
  const shift = (d: string, days: number): string => {
    const x = new Date(`${d}T00:00:00Z`)
    x.setUTCDate(x.getUTCDate() - days)
    return isoDate(x)
  }
  return {
    start: shift(period.start, 7 * weeks),
    end: shift(period.end, 7 * weeks),
    prevStart: shift(period.prevStart, 7 * weeks),
    prevEnd: shift(period.prevEnd, 7 * weeks),
  }
}

async function main(): Promise<void> {
  const weeks = Number(process.env.BACKFILL_WEEKS ?? 8)
  let period = weeklyPeriod(new Date())
  for (let w = 0; w < weeks; w++) {
    const gsc = await pullGsc(period)
    console.log(`\n=== nädal ${period.start} .. ${period.end} (eelmine ${period.prevStart} .. ${period.prevEnd}) ===`)
    for (const f of gsc.families.filter((x) => TARGET_FAMILIES.includes(x.id))) {
      const cur = f.carrier ? `${f.carrier.page} (${f.carrier.impressions} näit)` : "–"
      const prev = f.prevCarrier ? `${f.prevCarrier.page} (${f.prevCarrier.impressions} näit)` : "–"
      const swap = f.carrier && f.prevCarrier && f.carrier.page !== f.prevCarrier.page ? "  *** VAHETUS ***" : ""
      console.log(
        `${f.label}: pos ${f.current.position === null ? "–" : f.current.position.toFixed(1)} (eelmine ${f.previous.position === null ? "–" : f.previous.position.toFixed(1)}), ` +
          `${f.current.impressions}/${f.previous.impressions} näitamist | maandumisleht ${cur} | eelmine maandumisleht ${prev}${swap}`,
      )
    }
    period = stepBack(period, 1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
