/**
 * Form-submission aggregates for the weekly report. "Päris päringud" (real
 * inquiries from form_submissions) are the ground truth for conversions -
 * per the reporting convention in raportid/, GA4 key events are not trusted
 * for this (double counting, tracking outages).
 *
 * Also classifies each contact inquiry against the primary marketing goal
 * (regulaarne hoolduskoristus B2B) so the report can highlight how many of
 * the week's inquiries were maintenance-cleaning prospects — rules-based and
 * transparent, see classifyMaintenance().
 */

import { getFormSubmissions, type FormSubmission } from "../form-submissions"
import type { FormsData, FormsPeriod, LeadMaintenance, LeadRow, ReportPeriod } from "./types"

/** Selge korduvuse/lepingu signaal: "3x nädalas", "korra nädalas", "kord kuus", "regulaarne", "hooldus", "leping" jm. */
const MAINTENANCE_SIGNAL =
  /(\d+\s*[x×]|korda?|korduvalt)\s*(nädalas|ndalas|kuus|kuu\b|kvartalis|kvartali|aastas)|regulaar\w*|hooldus\w*|leping\w*|igapäev\w*|püsiv\w*|pideva?t|graafik\w*|nädalas|ndalas/i

/** Ühekordse/muu töö signaal — võidab, kui selget korduvust pole. */
const ONEOFF_SIGNAL =
  /ühekord\w*|ehitusjärg\w*|remondijärg\w*|kolimisjärg\w*|suurpuhast\w*|akende?\s+(pesu|pesemine|puhastus)|vaip\w*|diivan\w*|mööbl\w*|lammut\w*|ehitusprahi|jäätme\w*|ventilatsiooni|gra?ffiti?|lum\w+\s*koristus|süvapesu|süvapuhastus|põhjalik\w*\s+\w*(puhastus|koristus)/i

/** Äripinna signaal (B2B objekt) — "tõenäoliselt regulaarne" kui korduvust pole otseselt öeldud. */
const PREMISES_SIGNAL =
  /kontor\w*|büroo\w*|äripind\w*|äriruum\w*|kaubandus\w*|kauplus\w*|laos?\b|lao\w*|tootmis\w*|tootmishoone\w*|restoran\w*|kohvik\w*|hoone\w*|trepi\w*|ühistu\w*|korteriühistu\w*|ruum\w*|põrand\w*|\bwc\b|tualet\w*|saal\w*/i

function classifyMaintenance(company: string, message: string): LeadMaintenance {
  if (MAINTENANCE_SIGNAL.test(message)) return "yes"
  if (ONEOFF_SIGNAL.test(message)) return "no"
  if (company.trim() && PREMISES_SIGNAL.test(message)) return "likely"
  return "no"
}

function toLead(row: FormSubmission): LeadRow {
  return {
    id: row.id,
    createdAt: row.createdAt,
    company: row.company.trim(),
    maintenance: classifyMaintenance(row.company, row.message),
    viaAds: Boolean(row.gclid) || /[?&]gclid=/.test(row.pageUrl) || row.source === "google_ads",
    source: row.source,
    pageUrl: row.pageUrl,
    summary: row.message.replace(/\s+/g, " ").trim().slice(0, 160),
  }
}

function aggregate(rows: FormSubmission[], leads: LeadRow[] | null): FormsPeriod {
  const out: FormsPeriod = { contact: 0, career: 0, spam: 0, gclidLeads: 0, maintenanceLeads: 0, feeTotal: 0, profitTotal: 0 }
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
  if (leads) out.maintenanceLeads = leads.filter((l) => l.maintenance !== "no").length
  out.feeTotal = Math.round(out.feeTotal * 100) / 100
  out.profitTotal = Math.round(out.profitTotal * 100) / 100
  return out
}

export async function pullForms(period: ReportPeriod): Promise<FormsData> {
  const [curRows, prevRows] = await Promise.all([
    getFormSubmissions({ from: period.start, to: period.end }),
    getFormSubmissions({ from: period.prevStart, to: period.prevEnd }),
  ])

  const leads = curRows
    .filter((row) => row.form === "contact" && !row.isSpam)
    .map(toLead)

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
    current: aggregate(curRows, leads),
    previous: aggregate(prevRows, null),
    topPages,
    leads,
  }
}
