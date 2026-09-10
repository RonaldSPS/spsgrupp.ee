/**
 * Local runner for the weekly marketing report — same pipeline as the Friday
 * cron (lib/reporting/generate.ts), for testing and ad-hoc runs.
 *
 *   npm run report:weekly            # generate + store (data/weekly-reports.json
 *                                    #   or the DB when DATABASE_URL is set)
 *
 * E-mail sending is not wired into the CLI (lib/email is a server-only
 * module) — test delivery via the cron route (?send=0 to skip) or the admin
 * "Genereeri kohe" flow on a deployed environment.
 *
 * Env (.env.local): GA4_PROPERTY_ID, GSC_SITE_URL, GOOGLE_ADS_DEVELOPER_TOKEN,
 * GOOGLE_ADS_CUSTOMER_ID, GOOGLE_APPLICATION_CREDENTIALS (or
 * GCP_SERVICE_ACCOUNT_JSON), ANTHROPIC_API_KEY (optional), DATABASE_URL
 * (optional — falls back to data/weekly-reports.json).
 */

import { readFileSync, existsSync } from "node:fs"

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvLocal()

async function main() {
  const { generateWeeklyReport } = await import("../lib/reporting/generate")
  const report = await generateWeeklyReport()

  const s = report.snapshot
  console.log(`\n# Nädalaraport ${report.weekStart} → ${report.weekEnd} (id ${report.id})`)
  if (s.gsc) {
    console.log(
      `GSC: ${(s.gsc.current.clicks / s.gsc.current.days).toFixed(1)} klikki/päev · ` +
        `${Math.round(s.gsc.current.impressions / s.gsc.current.days)} näitamist/päev · pos ${s.gsc.current.position.toFixed(1)} · ` +
        `perekondi: ${s.gsc.families.filter((f) => f.current.impressions > 0).length}`,
    )
  }
  if (s.ga4) console.log(`GA4: ${Math.round(s.ga4.current.sessions)} sessiooni · kaasatus ${(s.ga4.current.engagementRate * 100).toFixed(1)} %`)
  if (s.ads?.available) console.log(`Ads: ${s.ads.totals.cost.toFixed(2)} € · ${s.ads.totals.clicks} klikki · ${s.ads.totals.conversions.toFixed(1)} konv`)
  if (s.forms) console.log(`Päringud: ${s.forms.current.contact} kontakt + ${s.forms.current.career} tööavaldus (+${s.forms.current.spam} spämm)`)
  console.log(`Leide: ${report.insights.length} · Narratiiv: ${report.narrative ? "LLM" : "ainult reeglid"}`)
  if (s.errors.length) console.log(`Andmevead: ${s.errors.join(" | ")}`)
  console.log("E-kirja ei saadetud (CLI toetab ainult genereerimist).")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
