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
import { listWeeklyReports, saveWeeklyReport } from "./store"
import type { Insight, StoredReport } from "./types"

const SEVERITY_ORDER: Record<Insight["severity"], number> = { negative: 0, warning: 1, opportunity: 2, positive: 3 }

export async function generateWeeklyReport(): Promise<StoredReport> {
  const snapshot = await collectSnapshot()
  const insights = buildInsights(snapshot)

  /* GSC täiendab värskeimaid päevi järelkorras — kui eelmise raporti salvestatud
   * arv samale perioodile erineb selle nädala "eelmine periood" tõmmisest,
   * märgi see raportis ära (kliendi küsimus 25.09.2026: 7,4 vs 10,1 / +6 %). */
  const latest = await listWeeklyReports(1).then((r) => r[0]).catch(() => undefined)
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
