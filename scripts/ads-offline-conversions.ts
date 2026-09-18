/**
 * Offline conversion export for Google Ads (gclid-based "Import from clicks").
 *
 * Why: browser-side Ads conversion tags depend on ad_storage consent; on the
 * new site (since ~18.08.2026) Ads recorded 1 of 6 real gclid-carrying form
 * submissions in 30 days. Offline import uses the gclid stored in
 * form_submissions, so it works regardless of the visitor's cookie choice and
 * feeds the value-based bidding experiment with REAL inquiry signal.
 *
 * Prereq in Google Ads (one-time, Margus): create a conversion action of type
 * "Import from clicks" (offline), e.g. named exactly:
 *   Vormipäring (gclid offline import)
 * Set it as PRIMARY once the browser tag duplicates are cleaned.
 *
 * Usage:
 *   npx tsx scripts/ads-offline-conversions.ts                 # last 10 days
 *   npx tsx scripts/ads-offline-conversions.ts --since=2026-08-18
 *   npx tsx scripts/ads-offline-conversions.ts --action="Muu nimi"
 *
 * Output: data/offline-conversions-<date>.csv — upload in Google Ads ->
 * Data manager -> Offline conversions. Re-uploading the same click+name+time
 * is deduped by Google, but keep the weekly cadence to stay clean.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs"
import postgres from "postgres"

for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith("#")) continue
  const i = t.indexOf("=")
  if (i > 0 && process.env[t.slice(0, i).trim()] === undefined) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const sinceFlag = process.argv.find((a) => a.startsWith("--since="))
const actionFlag = process.argv.find((a) => a.startsWith("--action="))
const ACTION_NAME = actionFlag ? actionFlag.slice(9) : "Vormipäring (gclid offline import)"

const since = sinceFlag
  ? sinceFlag.slice(8)
  : new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().slice(0, 10)

/** Google offline-conversion CSV expects MM/DD/YYYY h:mm:ss AM/PM. */
function googleTime(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Tallinn",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  }).formatToParts(d)
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  return `${g("month")}/${g("day")}/${g("year")} ${g("hour")}:${g("minute")}:${g("second")} ${g("dayPeriod")}`
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL puudub (.env.local)")
  const sql = postgres(process.env.DATABASE_URL, { max: 1 })
  const rows = await sql`
    SELECT id, created_at, gclid, coalesce(fee, 0) AS fee
    FROM form_submissions
    WHERE gclid IS NOT NULL AND gclid <> ''
      AND is_spam = false
      AND form = 'contact'
      AND created_at >= ${since}::date
    ORDER BY created_at
  `
  await sql.end()

  if (rows.length === 0) {
    console.log(`Päringuid gclid-ga alates ${since}: 0 — faili ei kirjutatud.`)
    return
  }

  const header = "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency"
  const lines = rows.map((r: { id: number; created_at: Date; gclid: string; fee: string | number }) => {
    const value = Number(r.fee) > 0 ? Number(r.fee).toFixed(2) : ""
    const currency = value ? "EUR" : ""
    return [r.gclid, ACTION_NAME, googleTime(new Date(r.created_at)), value, currency].join(",")
  })

  const out = `data/offline-conversions-${new Date().toISOString().slice(0, 10)}.csv`
  writeFileSync(out, [header, ...lines].join("\r\n") + "\r\n", "utf8")
  console.log(`Kirjutatud: ${out}`)
  console.log(`Ridu: ${rows.length} (alates ${since})`)
  console.log("Näidis (2 esimest):")
  lines.slice(0, 2).forEach((l: string) => console.log("  " + l))
}
main().catch((e) => { console.error("ERR", e.message); process.exit(1) })
