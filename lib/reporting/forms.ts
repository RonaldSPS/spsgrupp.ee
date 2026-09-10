/**
 * Form-submission aggregates for the weekly report. "Päris päringud" (real
 * inquiries from form_submissions) are the ground truth for conversions -
 * per the reporting convention in raportid/, GA4 key events are not trusted
 * for this (double counting, tracking outages).
 */

import { getFormSubmissions, type FormSubmission } from "../form-submissions"
import type { FormsData, FormsPeriod, ReportPeriod } from "./types"

function aggregate(rows: FormSubmission[]): FormsPeriod {
  const out: FormsPeriod = { contact: 0, career: 0, spam: 0, gclidLeads: 0, feeTotal: 0, profitTotal: 0 }
  for (const row of rows) {
    if (row.isSpam) {
      out.spam += 1
      continue
    }
    if (row.form === "contact") out.contact += 1
    if (row.form === "career") out.career += 1
    if (row.form === "contact" && row.gclid) out.gclidLeads += 1
    const fee = Number(row.fee)
    if (Number.isFinite(fee)) out.feeTotal += fee
    const profit = Number(row.profit)
    if (Number.isFinite(profit)) out.profitTotal += profit
  }
  out.feeTotal = Math.round(out.feeTotal * 100) / 100
  out.profitTotal = Math.round(out.profitTotal * 100) / 100
  return out
}

export async function pullForms(period: ReportPeriod): Promise<FormsData> {
  const [curRows, prevRows] = await Promise.all([
    getFormSubmissions({ from: period.start, to: period.end }),
    getFormSubmissions({ from: period.prevStart, to: period.prevEnd }),
  ])

  const pageCounts = new Map<string, number>()
  for (const row of curRows) {
    if (row.isSpam || !row.pageUrl) continue
    pageCounts.set(row.pageUrl, (pageCounts.get(row.pageUrl) ?? 0) + 1)
  }
  const topPages = [...pageCounts.entries()]
    .map(([pageUrl, count]) => ({ pageUrl, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    current: aggregate(curRows),
    previous: aggregate(prevRows),
    topPages,
  }
}
