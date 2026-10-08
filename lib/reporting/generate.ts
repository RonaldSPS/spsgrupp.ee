/**
 * Weekly report pipeline: collect snapshot → rule-based insights → LLM
 * narrative (when ANTHROPIC_API_KEY is set) → store. E-mail delivery lives
 * in notify.ts (imports lib/email which is "server-only" and cannot load in
 * plain-tsx scripts) — callers: app/api/cron/weekly-report, the admin
 * reports API, and scripts/weekly-report.ts for local runs.
 */

import { collectSnapshot } from "./snapshot"
import { buildInsights } from "./insights"
import { generateNarrative } from "./llm"
import { collectSiteChanges } from "./changes"
import { listWeeklyReports, saveWeeklyReport } from "./store"
import type { Insight, StoredReport } from "./types"

const SEVERITY_ORDER: Record<Insight["severity"], number> = { negative: 0, warning: 1, opportunity: 2, positive: 3 }

export async function generateWeeklyReport(): Promise<StoredReport> {
  const snapshot = await collectSnapshot()

  /* GSC täiendab värskeimaid päevi järelkorras — kui eelmise raporti salvestatud
   * arv samale perioodile erineb selle nädala "eelmine periood" tõmmisest,
   * märgi see raportis ära (kliendi küsimus 25.09.2026: 7,4 vs 10,1 / +6 %). */
  const recent = await listWeeklyReports(2).catch(() => [] as StoredReport[])
  const latest = recent[0]

  /* „Lehekülje arendus" (git-põhine muudatuste kokkuvõte, kliendi palve
   * 08.10.2026): aken = eelmise NÄDALA raporti genereerimisest tänaseni.
   * Sama nädala raportit vahele jättes ei kaha aken „Genereeri kohe"
   * uuesti käivitamisel nulli (raport upsert'itakse sama nädala peale). */
  const prevWeekReport = recent.find(
    (r) => !(r.weekStart === snapshot.period.start && r.weekEnd === snapshot.period.end),
  )
  const changesSince = prevWeekReport?.snapshot.generatedAt ?? `${snapshot.period.start}T00:00:00.000Z`
  const changes = await collectSiteChanges(changesSince, snapshot.generatedAt)
  if (changes) snapshot.changes = changes

  const insights = buildInsights(snapshot)
  const prevGsc = latest?.snapshot.gsc
  if (
    prevGsc &&
    snapshot.gsc &&
    latest!.snapshot.period.start === snapshot.period.prevStart &&
    latest!.snapshot.period.end === snapshot.period.prevEnd &&
    prevGsc.current.clicks !== snapshot.gsc.previous.clicks
  ) {
    insights.push({
      area: "seo",
      severity: "warning",
      title: `GSC täpsustas eelmise nädala klikke: ${prevGsc.current.clicks} → ${snapshot.gsc.previous.clicks}`,
      detail: `Periood ${snapshot.period.prevStart}–${snapshot.period.prevEnd} oli eelmise raporti genereerimisel veel esialgne; Google on andmeid vahepeal täiendanud. Nädala muutuse protsent arvutatakse alati täpsustatud eelmise nädala suhtes, mitte eelmise raporti tolleaegse arvu suhtes.`,
      action: "Võrdle nädalaid täpsustatud arvudega — eelmise raporti tolleaegne klikkiarv võib tagantjärele muutuda.",
    })
    insights.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  }

  const narrative = (await generateNarrative(snapshot, insights)) ?? ""

  return saveWeeklyReport({
    weekStart: snapshot.period.start,
    weekEnd: snapshot.period.end,
    snapshot,
    insights,
    narrative,
  })
}
