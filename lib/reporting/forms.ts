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
import { isoDate } from "./google-auth"
import type { FormsData, FormsPeriod, LeadMaintenance, LeadRow, ReportPeriod } from "./types"

/** Selge korduvuse/lepingu signaal: "3x nädalas", "korra nädalas", "kord kuus", "regulaarne", "hooldus", "leping" jm. */
const MAINTENANCE_SIGNAL =
  /(\d+\s*[x×]|korda?|korduvalt)\s*(nädalas|ndalas|kuus|kuu\b|kvartalis|kvartali|aastas)|regulaar\w*|hooldus\w*|leping\w*|igapäev\w*|püsiv\w*|pideva?t|graafik\w*|nädalas|ndalas/i

/**
 * Ühekordse/muu töö signaal — võidab, kui selget korduvust pole.
 * 02.10.2026 karmistatud (kliendi palve: ühekordseid töid ei tohi
 * hoolduskoristuse päringuna käsitleda — nt Siili 13 korteriühistu
 * tänavakivide samblikupesu märgistati ekslikult "tõenäoliselt regulaarne",
 * sest käituks äripinna-signaalist "korteriühistu"): välispindade pesu,
 * sammal, fassaad, muruniit jt ilma korduvuseta = ühekordne.
 */
const ONEOFF_SIGNAL =
  /ühekord\w*|ehitusjärg\w*|remondijärg\w*|kolimisjärg\w*|suurpuhast\w*|akende?\s+(pesu|pesemine|puhastus)|vaip\w*|diivan\w*|mööbl\w*|lammut\w*|ehitusprahi|jäätme\w*|ventilatsiooni|gra?ffiti?|lum\w+\s*koristus|süvapesu|süvapuhastus|põhjalik\w*\s+\w*(puhastus|koristus)|tänavakiv\w*|asfal\w*|sammal\w*|samblik\w*|survepesu|kõrgsurve\w*|fassaad\w*|kõnnitee\w*|muruniit\w*|muru\s*niit\w*|heki?\w*\s*(lõik|korrast)\w*/i

/** Äripinna signaal (B2B objekt) — "tõenäoliselt regulaarne" kui korduvust pole otseselt öeldud. */
const PREMISES_SIGNAL =
  /kontor\w*|büroo\w*|äripind\w*|äriruum\w*|kaubandus\w*|kauplus\w*|laos?\b|lao\w*|tootmis\w*|tootmishoone\w*|restoran\w*|kohvik\w*|hoone\w*|trepi\w*|ühistu\w*|korteriühistu\w*|ruum\w*|põrand\w*|\bwc\b|tualet\w*|saal\w*/i

/**
 * Testpäringud ei lähe raporti arvestusse (kliendi korduv palve 25.09.2026 —
 * "jätke testpäringud arvestusest välja"). Signaalid: agentuuri nimi/outline
 * või sõnum algab test-sõnaga ("testing, puhastage 45 tuutu" muster).
 */
const TEST_ACTOR = /outline/i
/** Alguses test-sõna VÕI sõnumis ise deklareeritud proovipäring ("See on päringu proov" — kliendi oma test 25.09.2026). */
const TEST_MESSAGE = /^\s*(test|testing|testimine|testimaks)\b|päringu?\s+proov\b/i

export function isTestSubmission(row: FormSubmission): boolean {
  return (
    TEST_ACTOR.test(row.company) ||
    TEST_ACTOR.test(row.name) ||
    TEST_ACTOR.test(row.email) ||
    TEST_MESSAGE.test(row.message)
  )
}

/**
 * Tööotsingud ei ole hinnapäringud ja ei lähe raporti kontaktide arvestusse
 * (kliendi palve 02.10.2026 — "tööotsinguid ei peaks hinnapäringute hulka
 * arvestama, võtame need välja"; 24.09 tuli 2 pelga "Housekeeping"-sõnumiga
 * kontakti töötukassa.ee viite kaudu). Kehtib AINULT kontaktivormile —
 * career-vormi read on seaduslikud tööavaldused ja loendatakse career-all.
 * Signaalid: tööportaali viide, pelk ametinimetus sõnumis või selge
 * tööotsingu fraas.
 */
const JOB_BOARD_REFERRAL =
  /^referral:(www\.)?(tootukassa\.ee|cv\.ee|cvkeskus\.ee|cvonline\.|indeed\.|monster\.|goworkabit\.|tööportaal)/i
/** Sõnum on pelk ametinimetus (kuni paar sõna) — tööotsija, mitte tellimus. (\p{L}, sest \w ei kata kirillitsat.) */
const JOB_TITLE_MESSAGE =
  /^\s*(housekeeping|cleaner|cleaning\s*(lady|man|person)|koristaja\p{L}*|puhastaja\p{L}*|valvekoristaja\p{L}*|kojamees|hooldaja\p{L}*|уборщик\p{L}*|уборщиц\p{L}*)\s*[.!]?\s*$/iu
/** Selge tööotsingu fraas sõnumis. */
const JOB_INTENT_MESSAGE =
  /tööd\s+otsi|otsin\s+tööd|tööotsing|tööle\s+asum|vabu?\s+töökoh\w*|looking\s+for\s+(a\s+)?(job|work)|seeking\s+(a\s+)?(job|work)|job\s+application|ищу\s+работу|нужна\s+работа/i

export function isJobSeeker(row: FormSubmission): boolean {
  if (row.form !== "contact") return false
  return (
    JOB_BOARD_REFERRAL.test(row.source) ||
    JOB_TITLE_MESSAGE.test(row.message) ||
    JOB_INTENT_MESSAGE.test(row.message)
  )
}

/** Exported for tests. */
export function classifyMaintenance(company: string, message: string): LeadMaintenance {
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

/** ISO-kuupäeva nihutamine päevade võrra (UTC). */
function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Kahe ISO-kuupäeva vahe päevades, KAASA ARVATUD mõlemad otsad. */
function inclusiveDays(start: string, end: string): number {
  const ms = new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()
  return Math.round(ms / 86_400_000) + 1
}

/**
 * Päringute tegelik aken (kliendi palve 09.10.2026): vormipäringud
 * salvestuvad reaalajas, seega peab raport kajastama KÕIKI päringuid kuni
 * genereerimishetkeni (reede hommik) — Google'i statistika ~2-päevane
 * viivitus ei tohi päringuid raportist välja jätta (08.10 saabunud päring
 * jäi 01.10–07.10 aknaga raportist puudu). Eelmine aken on sama pikk ja
 * lõpeb vahetult enne käesoleva algust, et nädalavõrdlus oleks õiglane.
 */
export function formsWindow(period: ReportPeriod, now?: Date): { start: string; end: string; prevStart: string; prevEnd: string } {
  const start = period.start
  const end = now ? isoDate(now) : period.end
  const days = Math.max(inclusiveDays(start, end), 1)
  const prevEnd = shiftDays(start, -1)
  const prevStart = shiftDays(prevEnd, -(days - 1))
  return { start, end, prevStart, prevEnd }
}

export async function pullForms(period: ReportPeriod, now?: Date): Promise<FormsData> {
  const win = formsWindow(period, now)
  const [curRowsAll, prevRowsAll] = await Promise.all([
    getFormSubmissions({ from: win.start, to: win.end }),
    getFormSubmissions({ from: win.prevStart, to: win.prevEnd }),
  ])

  const counted = (r: FormSubmission) => !isTestSubmission(r) && !isJobSeeker(r)
  const curRows = curRowsAll.filter(counted)
  const prevRows = prevRowsAll.filter(counted)

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

  const current = aggregate(curRows, leads)
  current.tests = curRowsAll.filter(isTestSubmission).length
  current.jobSeekers = curRowsAll.filter((r) => !isTestSubmission(r) && isJobSeeker(r)).length
  const previous = aggregate(prevRows, null)
  previous.tests = prevRowsAll.filter(isTestSubmission).length
  previous.jobSeekers = prevRowsAll.filter((r) => !isTestSubmission(r) && isJobSeeker(r)).length

  return {
    current,
    previous,
    topPages,
    leads,
    window: win,
  }
}
