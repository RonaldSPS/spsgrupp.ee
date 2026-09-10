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
import { saveWeeklyReport } from "./store"
import type { StoredReport } from "./types"

export async function generateWeeklyReport(): Promise<StoredReport> {
  const snapshot = await collectSnapshot()
  const insights = buildInsights(snapshot)
  const narrative = (await generateNarrative(snapshot, insights)) ?? ""

  return saveWeeklyReport({
    weekStart: snapshot.period.start,
    weekEnd: snapshot.period.end,
    snapshot,
    insights,
    narrative,
  })
}
