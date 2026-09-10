/**
 * Snapshot orchestrator: pulls GA4 + GSC + Ads + form submissions for the
 * weekly period and merges them into one ReportSnapshot. Each source is
 * isolated - a failing API (paused Supabase, expired Ads token, ...) is
 * recorded in `errors` and never aborts the rest of the report.
 */

import { pullGa4 } from "./ga4"
import { pullGsc } from "./gsc"
import { pullAds } from "./ads"
import { pullForms } from "./forms"
import { weeklyPeriod } from "./google-auth"
import type { ReportSnapshot } from "./types"

async function attempt<T>(errors: string[], label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`${label}: ${message.slice(0, 300)}`)
    return null
  }
}

export async function collectSnapshot(now: Date = new Date()): Promise<ReportSnapshot> {
  const period = weeklyPeriod(now)
  const errors: string[] = []

  // GA4+GSC share the token host but are independent pulls; run sequentially
  // enough to stay friendly with API quotas, but sources stay isolated.
  const [gsc, ga4, ads, forms] = await Promise.all([
    attempt(errors, "GSC", () => pullGsc(period)),
    attempt(errors, "GA4", () => pullGa4(period)),
    attempt(errors, "Ads", () => pullAds(period)),
    attempt(errors, "Päringud", () => pullForms(period)),
  ])

  return {
    generatedAt: now.toISOString(),
    period,
    ga4,
    gsc,
    ads,
    forms,
    errors,
  }
}
