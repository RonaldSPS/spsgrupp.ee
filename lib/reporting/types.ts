/**
 * Shared types for the weekly marketing report (lib/reporting/*).
 * The snapshot is the full structured data pull for one week; it is stored
 * as JSONB in weekly_reports (or data/weekly-reports.json as fallback) so
 * week-over-week trends survive beyond GSC's 16-month window.
 */

export interface ReportPeriod {
  start: string
  end: string
  prevStart: string
  prevEnd: string
}

export interface MetricSet {  sessions: number
  users: number
  newUsers: number
  engagementRate: number
  keyEvents: number
}

export interface Ga4Channel {
  channel: string
  sessions: number
  keyEvents: number
}

export interface Ga4Page {
  path: string
  sessions: number
}

/** Per-day session counts - used for the tracking-health check (outages). */
export interface Ga4Daily {
  date: string
  sessions: number
}

export interface Ga4Data {
  current: MetricSet
  previous: MetricSet
  channels: Ga4Channel[]
  topPages: Ga4Page[]
  daily: Ga4Daily[]
}

export interface GscTotals {
  clicks: number
  impressions: number
  ctr: number
  position: number
  /** Days in the period, for per-day averages. */
  days: number
}

export interface GscQuery {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  /** Kandjaleht (dominant page by impressions), set on newQueries when known. */
  page?: string
}

export interface GscPage {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

/** One query×page row — which landing page Google serves for a query. */
export interface GscQueryPage {
  query: string
  page: string
  clicks: number
  impressions: number
  position: number
}

/** Aggregated stats for one tracked keyword family (märksõnapere). */
export interface KeywordFamilyStat {
  id: string
  label: string
  current: { impressions: number; clicks: number; position: number | null }
  previous: { impressions: number; clicks: number; position: number | null }
  /** Kandjaleht: dominant landing page in the current period, by impressions. */
  carrier?: { page: string; impressions: number } | null
  /** Previous period's dominant page — for carrier-swap detection. */
  prevCarrier?: { page: string; impressions: number } | null
}

export interface GscData {
  current: GscTotals
  previous: GscTotals
  /** Current period queries by impressions (up to ~100 kept in the snapshot). */
  topQueries: GscQuery[]
  /** Previous period queries, kept whole for position-movement matching. */
  prevQueries: GscQuery[]
  topPages: GscPage[]
  families: KeywordFamilyStat[]
  /** Queries present now but absent (or ~invisible) in the previous period. */
  newQueries: GscQuery[]
}

export interface AdsCampaign {
  name: string
  status: string
  cost: number
  clicks: number
  impressions: number
  ctr: number
  avgCpc: number
  conversions: number
  allConversions: number
  impressionShare: number | null
  rankLostIS: number | null
  budgetLostIS: number | null
  topIS: number | null
  absTopIS: number | null
}

export interface AdsTerm {
  term: string
  campaign: string
  cost: number
  clicks: number
  impressions: number
  conversions: number
}

export interface AdsKeyword {
  keyword: string
  matchType: string
  qualityScore: number | null
  campaign: string
  cost: number
  clicks: number
  impressions: number
  conversions: number
}

/**
 * Ads'i konversioonid toimingu kaupa („Conversions" veerg = ainult primaarsed
 * toimingud). Kliendi palve 01.10.2026: eristada päris hinnapäringud telefoni
 * ja e-posti klikkidest — kategooria alusel (SUBMIT_LEAD_FORM = vorm,
 * CONTACT / PHONE_CALL_LEAD = telefon/e-post klikk).
 */
export interface AdsConversionBreakdown {
  name: string
  category: string
  conversions: number
}

export interface AdsData {
  available: boolean
  campaigns: AdsCampaign[]
  brand: { cost: number; clicks: number; conversions: number }
  nonBrand: { cost: number; clicks: number; conversions: number }
  topTerms: AdsTerm[]
  keywords: AdsKeyword[]
  totals: { cost: number; clicks: number; impressions: number; conversions: number }
  /** Valikuline — vanades salvestatud raportites puudub. */
  conversionBreakdown?: AdsConversionBreakdown[]
}

export interface FormsPeriod {
  contact: number
  career: number
  spam: number
  /** Contact submissions carrying a gclid = attributable to Google Ads. */
  gclidLeads: number
  /** Contact submissions wanting regular maintenance cleaning (yes + likely). */
  maintenanceLeads: number
  feeTotal: number
  profitTotal: number
  /** Testpäringud, mis jäeti arvestusest välja (forms.ts isTestSubmission). */
  tests?: number
}

/**
 * Päringu klassifikatsioon põhieesmärgi (regulaarne hoolduskoristus B2B) suhtes:
 *   yes    = sõnumis on selge korduvus/sagedus või lepingu viide
 *   likely = ettevõtte äripinna koristus ilma ühekordse töö märgita
 *   no     = ühekordne töö, B2C-laadne või muu
 */
export type LeadMaintenance = "yes" | "likely" | "no"

export interface LeadRow {
  id: number
  createdAt: string
  company: string
  maintenance: LeadMaintenance
  /** Ads-seos: gclid väli, gclid page_url-s või source = google_ads. */
  viaAds: boolean
  /** Kanal (source-kood, nt google_ads / organic:google / direct; "" = teadmata). */
  source: string
  pageUrl: string
  /** Sõnumi lühikokkuvõte (üks rida, kuni ~160 märki). */
  summary: string
}

export interface FormsData {
  current: FormsPeriod
  previous: FormsPeriod
  topPages: { pageUrl: string; count: number }[]
  /** Nädala kontaktpäringud (spämmita) kvaliteedikontrolliks — uusimad ees. */
  leads: LeadRow[]
}

export interface ReportSnapshot {
  generatedAt: string
  period: { start: string; end: string; prevStart: string; prevEnd: string }
  ga4: Ga4Data | null
  gsc: GscData | null
  ads: AdsData | null
  forms: FormsData | null
  /** Per-source failure notes (a failing API must not kill the whole report). */
  errors: string[]
}

export type InsightArea = "seo" | "ads" | "ga4" | "forms" | "strategy"
export type InsightSeverity = "negative" | "warning" | "opportunity" | "positive"

export interface Insight {
  area: InsightArea
  severity: InsightSeverity
  title: string
  detail: string
  /** Järgmine samm - concrete next action. */
  action: string
}

export interface StoredReport {
  id: number
  weekStart: string
  weekEnd: string
  createdAt: string
  snapshot: ReportSnapshot
  insights: Insight[]
  /** LLM-written Estonian narrative ("" when ANTHROPIC_API_KEY is unset). */
  narrative: string
  emailSentAt: string | null
  emailError: string
}
