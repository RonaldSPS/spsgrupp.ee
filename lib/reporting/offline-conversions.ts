/**
 * Offline-conversion upload to Google Ads via the Data Manager API
 * (events:ingest). UploadClickConversions is restricted to existing users —
 * new integrations must use the Data Manager API (verified 25.09.2026).
 *
 * Why: browser-side Ads conversion tags depend on ad_storage consent; the gclid
 * stored in form_submissions is consent-independent, so uploading it server-side
 * feeds Smart Bidding the REAL inquiry signal regardless of cookie choice. This
 * is the automated successor of scripts/ads-offline-conversions.ts (CSV export +
 * manual Data manager upload). Idempotency: each submission gets stable
 * transactionIds ("form-<id>" and "won-<id>"), so the daily cron can re-upload
 * a trailing window without state tracking.
 *
 * Auth: service account (.secrets/gcp-analytics.json / GCP_SERVICE_ACCOUNT_JSON)
 * — it can mint both required scopes (adwords for the action lookup/create,
 * datamanager for the ingest). OAuth refresh-token trio is the fallback, but a
 * token minted by setup:ads-auth only carries the adwords scope — re-consent
 * with both scopes before using it for uploads. The account used needs at
 * least "Standard" access on the Ads account (read-only fails).
 *
 * Conversion actions:
 *   - "Vormipäring (gclid offline import)" — every real contact inquiry with a
 *     gclid (default, override GOOGLE_ADS_OFFLINE_CONVERSION_NAME). Created as
 *     a SECONDARY UPLOAD_CLICKS action when missing.
 *   - "Võidetud leping (gclid offline import)" — sent only when the admin sets
 *     salesStatus = "won". Created as a SECONDARY UPLOAD_CLICKS action when
 *     missing. Value = fee (kokkulepitud maksumus). Flipping either action to
 *     PRIMARY is a deliberate manual step in the Ads UI.
 *
 * Callers: app/api/cron/offline-conversions (daily Vercel Cron) and
 * scripts/ads-offline-conversions-upload.ts (local runs, --dry-run).
 */

import { getFormSubmissions, type FormSubmission } from "../form-submissions"
import { isJobSeeker, isTestSubmission } from "./forms"
import { getGoogleAccessToken } from "./google-auth"
import type { OfflineConversionUploadStatus } from "./types"

/** Bump when Google sunsets this version (a 404/INVALID_VERSION error means: bump). */
const ADS_API_VERSION = "v25"
const ADWORDS_SCOPE = "https://www.googleapis.com/auth/adwords"
const DATAMANAGER_SCOPE = "https://www.googleapis.com/auth/datamanager"
const DEFAULT_ACTION_NAME = "Vormipäring (gclid offline import)"
const WON_ACTION_NAME = "Võidetud leping (gclid offline import)"
/**
 * Trailing re-upload window for the form-inquiry conversion — transactionId
 * keeps daily uploads idempotent. 60 days: DM API treats a re-ingested
 * transactionId as a conversion ADJUSTMENT and overwrites conversionValue,
 * so a Tasu value the admin enters weeks after the inquiry still reaches Ads.
 */
const DEFAULT_WINDOW_DAYS = 60
/**
 * Won-contract conversions look back to the inquiry date (createdAt), not the
 * win date, because Google's gclid hard limit is 90 days from the click. A
 * contract won 3 months after the inquiry is still uploadable; anything older
 * is rejected by Google and logged as skipped.
 */
const WON_WINDOW_DAYS = 90

export interface OfflineUploadSummary {
  candidates: number
  uploaded: number
  skippedNoValue: number
  actionResourceName: string | null
  actionCreated: boolean
  wonCandidates: number
  wonUploaded: number
  wonSkippedNoValue: number
  wonActionResourceName: string | null
  wonActionCreated: boolean
  dryRun: boolean
  errors: string[]
  requestId?: string
  /** Per-event processing results from Data Manager API. */
  formResults?: { success: number; errors: number; details: string[] }
  wonResults?: { success: number; errors: number; details: string[] }
}

async function getAdsAccessToken(scopes: string[]): Promise<string> {
  // The service account can mint any scope; OAuth refresh tokens are scope-bound.
  if (process.env.GCP_SERVICE_ACCOUNT_JSON?.trim()) return getGoogleAccessToken(scopes)
  const { GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET } = process.env
  if (GOOGLE_ADS_REFRESH_TOKEN && GOOGLE_ADS_CLIENT_ID && GOOGLE_ADS_CLIENT_SECRET) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_ADS_CLIENT_ID,
        client_secret: GOOGLE_ADS_CLIENT_SECRET,
        refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    })
    const data = (await res.json()) as Record<string, unknown>
    if (!res.ok || typeof data.access_token !== "string") {
      throw new Error(`OAuth token refresh failed: ${JSON.stringify(data).slice(0, 300)}`)
    }
    return data.access_token
  }
  return getGoogleAccessToken(scopes)
}

function adsHeaders(token: string, developerToken: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": developerToken,
    "Content-Type": "application/json",
  }
  const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId
  return headers
}

/** "2026-09-23T10:17:08+03:00" — ISO 8601 in Europe/Tallinn, as the DM API expects. */
function eventTimestamp(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Tallinn",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(d)
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const wallAsUtc = Date.parse(`${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}:${g("second")}Z`)
  const offsetMin = Math.round((wallAsUtc - d.getTime()) / 60000)
  const sign = offsetMin >= 0 ? "+" : "-"
  const abs = Math.abs(offsetMin)
  const off = `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}:${g("second")}${off}`
}

/** Find the offline conversion action by name; create it (secondary) when missing. */
async function resolveConversionAction(
  headers: Record<string, string>,
  customerId: string,
  name: string,
  dryRun: boolean,
): Promise<{ resourceName: string | null; created: boolean }> {
  const searchUrl = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${customerId}/googleAds:search`
  const query = `SELECT conversion_action.resource_name, conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.name = '${name.replace(/'/g, "\\'")}'`
  const res = await fetch(searchUrl, { method: "POST", headers, body: JSON.stringify({ query }) })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`conversion_action lookup failed (${res.status}): ${text.slice(0, 400)}`)
  }
  const data = (await res.json()) as { results?: { conversionAction?: { resourceName?: string } }[] }
  const found = data.results?.[0]?.conversionAction?.resourceName
  if (found) return { resourceName: found, created: false }
  if (dryRun) return { resourceName: null, created: false }

  const mutateUrl = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${customerId}/conversionActions:mutate`
  const createRes = await fetch(mutateUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      operations: [
        {
          create: {
            name,
            type: "UPLOAD_CLICKS",
            category: "SUBMIT_LEAD_FORM",
            status: "ENABLED",
            primaryForGoal: false,
            countingType: "ONE_PER_CLICK",
            valueSettings: { defaultValue: 0, defaultCurrencyCode: "EUR", alwaysUseDefaultValue: false },
          },
        },
      ],
    }),
  })
  const created = (await createRes.json()) as { results?: { resourceName?: string }[] }
  if (!createRes.ok) {
    throw new Error(
      `conversion action create failed (${createRes.status}): ${JSON.stringify(created).slice(0, 400)}. ` +
        `Create "${name}" manually: Ads -> Goals -> Conversions -> New conversion action -> Import -> from clicks.`,
    )
  }
  return { resourceName: created.results?.[0]?.resourceName ?? null, created: true }
}

function toFormEvent(row: FormSubmission): Record<string, unknown> {
  const fee = Number(row.fee)
  // Always send conversionValue so a later re-upload with a cleared fee overwrites
  // any previously imported value in Google Ads (DM API adjustment semantics).
  const value = Number.isFinite(fee) && fee > 0 ? Math.round(fee * 100) / 100 : 0
  return {
    adIdentifiers: { gclid: row.gclid },
    eventTimestamp: eventTimestamp(new Date(row.createdAt)),
    transactionId: `form-${row.id}`,
    eventSource: "WEB",
    conversionValue: value,
    currency: "EUR",
  }
}

function toWonEvent(row: FormSubmission): Record<string, unknown> | null {
  const fee = Number(row.fee)
  if (!Number.isFinite(fee) || fee <= 0) return null
  const timestamp = row.wonAt ? new Date(row.wonAt) : new Date(row.createdAt)
  return {
    adIdentifiers: { gclid: row.gclid },
    eventTimestamp: eventTimestamp(timestamp),
    transactionId: `won-${row.id}`,
    eventSource: "WEB",
    conversionValue: Math.round(fee * 100) / 100,
    currency: "EUR",
  }
}

function isoDateDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 3600 * 1000).toISOString().slice(0, 10)
}

export async function uploadOfflineConversions(options?: {
  sinceDays?: number
  dryRun?: boolean
}): Promise<OfflineUploadSummary> {
  const dryRun = options?.dryRun ?? false
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (!developerToken || !customerId) {
    throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID are not set")
  }

  const formSince = isoDateDaysAgo(options?.sinceDays ?? DEFAULT_WINDOW_DAYS)
  const wonSince = isoDateDaysAgo(WON_WINDOW_DAYS)

  const [formRows, wonRows] = await Promise.all([
    getFormSubmissions({ from: formSince }),
    getFormSubmissions({ from: wonSince }),
  ])

  const formCandidates = formRows.filter(
    // Tööotsingud ei ole päris hinnapäringud — neid Adsi konversioonina ei impordita (kliendi palve 02.10.2026).
    (r) => r.form === "contact" && !r.isSpam && Boolean(r.gclid) && !isTestSubmission(r) && !isJobSeeker(r),
  )

  const wonCandidates = wonRows.filter(
    (r) =>
      r.form === "contact"
      && r.salesStatus === "won"
      && Boolean(r.gclid)
      && Boolean(r.wonAt)
      && !r.isSpam
      && !isTestSubmission(r)
      && !isJobSeeker(r),
  )

  const summary: OfflineUploadSummary = {
    candidates: formCandidates.length,
    uploaded: 0,
    skippedNoValue: 0,
    actionResourceName: null,
    actionCreated: false,
    wonCandidates: wonCandidates.length,
    wonUploaded: 0,
    wonSkippedNoValue: 0,
    wonActionResourceName: null,
    wonActionCreated: false,
    dryRun,
    errors: [],
    formResults: { success: 0, errors: 0, details: [] },
    wonResults: { success: 0, errors: 0, details: [] },
  }

  const actionName = process.env.GOOGLE_ADS_OFFLINE_CONVERSION_NAME ?? DEFAULT_ACTION_NAME
  const adsToken = await getAdsAccessToken([ADWORDS_SCOPE])
  const adsHdrs = adsHeaders(adsToken, developerToken)

  const [formAction, wonAction] = await Promise.all([
    resolveConversionAction(adsHdrs, customerId, actionName, dryRun),
    resolveConversionAction(adsHdrs, customerId, WON_ACTION_NAME, dryRun),
  ])
  summary.actionResourceName = formAction.resourceName
  summary.actionCreated = formAction.created
  summary.wonActionResourceName = wonAction.resourceName
  summary.wonActionCreated = wonAction.created

  const formEvents = formCandidates.map(toFormEvent)
  summary.skippedNoValue = formEvents.filter((e) => e.conversionValue === 0).length
  const wonEventsRaw = wonCandidates.map(toWonEvent)
  summary.wonSkippedNoValue = wonEventsRaw.filter((e) => e === null).length
  const wonEvents = wonEventsRaw.filter((e): e is Record<string, unknown> => e !== null)

  if (dryRun) return summary

  const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")

  const destinations: Record<string, unknown>[] = []
  if (formAction.resourceName) {
    const dest: Record<string, unknown> = {
      reference: "form",
      operatingAccount: { accountType: "GOOGLE_ADS", accountId: customerId },
      productDestinationId: formAction.resourceName.split("/").pop()!,
    }
    if (loginCustomerId) dest.loginAccount = { accountType: "GOOGLE_ADS", accountId: loginCustomerId }
    destinations.push(dest)
  }
  if (wonAction.resourceName) {
    const dest: Record<string, unknown> = {
      reference: "won",
      operatingAccount: { accountType: "GOOGLE_ADS", accountId: customerId },
      productDestinationId: wonAction.resourceName.split("/").pop()!,
    }
    if (loginCustomerId) dest.loginAccount = { accountType: "GOOGLE_ADS", accountId: loginCustomerId }
    destinations.push(dest)
  }

  if (destinations.length === 0) {
    throw new Error("Conversion action resource names unresolved")
  }

  const events: Record<string, unknown>[] = []
  if (formAction.resourceName) {
    events.push(...formEvents.map((e) => ({ ...e, destinationReferences: ["form"] })))
  }
  if (wonAction.resourceName) {
    events.push(...wonEvents.map((e) => ({ ...e, destinationReferences: ["won"] })))
  }
  if (events.length === 0) return summary

  const dmToken = await getAdsAccessToken([DATAMANAGER_SCOPE])
  const res = await fetch("https://datamanager.googleapis.com/v1/events:ingest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dmToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destinations, encoding: "HEX", events }),
  })
  const data = (await res.json()) as {
    requestId?: string
    error?: { message?: string }
    results?: Array<{ status?: string; error?: { code?: number; message?: string } }>
  }
  if (!res.ok) {
    throw new Error(`Data Manager events:ingest failed (${res.status}): ${JSON.stringify(data).slice(0, 2000)}`)
  }
  summary.requestId = data.requestId

  // Parse per-event processing results. Google returns a result entry for
  // every event, even when the overall HTTP status is 200.
  const results = data.results ?? []
  const formCount = formAction.resourceName ? formEvents.length : 0
  results.forEach((result, index) => {
    const isForm = index < formCount
    const target = isForm ? summary.formResults! : summary.wonResults!
    const eventRef = isForm ? `form-${formCandidates[index]?.id ?? index}` : `won-${wonCandidates[index - formCount]?.id ?? index}`
    if (result.status === "OK" || result.status === "ok" || result.status === undefined) {
      target.success += 1
    } else {
      target.errors += 1
      const msg = result.error?.message ?? `unknown error (status: ${result.status ?? "missing"})`
      const detail = `${eventRef}: ${msg}`
      target.details.push(detail)
      if (target.details.length <= 10) {
        summary.errors.push(detail)
      }
    }
  })

  summary.uploaded = summary.formResults!.success
  summary.wonUploaded = summary.wonResults!.success

  // Persist the result so the weekly report can show Google-side processing
  // status (not just our HTTP 200). Fire-and-forget: storage errors are logged
  // but never fail the upload itself.
  if (!dryRun) {
    saveOfflineUploadResult(summary, formCandidates, wonCandidates).catch((err) => {
      console.error("Failed to persist offline-conversion upload result:", err)
    })
  }

  return summary
}

const UPLOADS_JSON_FILE = "data/offline-conversion-uploads.json"
const MAX_UPLOAD_HISTORY = 120

async function uploadsJsonPath(): Promise<string> {
  const path = await import("path")
  return path.join(process.cwd(), UPLOADS_JSON_FILE)
}

export interface PersistedOfflineEvent {
  submissionId: number
  eventType: "form" | "won"
  status: "success" | "error"
  errorMessage: string
  uploadedAt: string
}

export interface PersistedOfflineUpload {
  id?: number
  runAt: string
  candidates: number
  uploaded: number
  skippedNoValue: number
  actionResourceName: string
  actionCreated: boolean
  wonCandidates: number
  wonUploaded: number
  wonSkippedNoValue: number
  wonActionResourceName: string
  wonActionCreated: boolean
  dryRun: boolean
  requestId: string
  errors: string[]
  formResults?: { success: number; errors: number; details: string[] }
  wonResults?: { success: number; errors: number; details: string[] }
  events?: PersistedOfflineEvent[]
}

function buildEventDetails(
  candidates: FormSubmission[],
  results: { success: number; errors: number; details: string[] } | undefined,
  eventType: "form" | "won",
): PersistedOfflineEvent[] {
  if (!results) return []
  const errorMap = new Map<number, string>()
  for (const detail of results.details) {
    // detail format: "form-123: error message" or "won-123: error message"
    const match = detail.match(/^(?:form|won)-(\d+):\s*(.*)$/)
    if (match) {
      errorMap.set(Number(match[1]), match[2].trim())
    }
  }
  return candidates.map((c) => ({
    submissionId: c.id,
    eventType,
    status: errorMap.has(c.id) ? "error" : "success",
    errorMessage: errorMap.get(c.id) ?? "",
    uploadedAt: new Date().toISOString(),
  }))
}

/** Store one upload run + per-submission event log. Non-fatal: failures are logged, never thrown. */
async function saveOfflineUploadResult(
  summary: OfflineUploadSummary,
  formCandidates: FormSubmission[],
  wonCandidates: FormSubmission[],
): Promise<void> {
  const events: PersistedOfflineEvent[] = [
    ...buildEventDetails(formCandidates, summary.formResults, "form"),
    ...buildEventDetails(wonCandidates, summary.wonResults, "won"),
  ]

  const record: PersistedOfflineUpload = {
    runAt: new Date().toISOString(),
    candidates: summary.candidates,
    uploaded: summary.uploaded,
    skippedNoValue: summary.skippedNoValue,
    actionResourceName: summary.actionResourceName ?? "",
    actionCreated: summary.actionCreated,
    wonCandidates: summary.wonCandidates,
    wonUploaded: summary.wonUploaded,
    wonSkippedNoValue: summary.wonSkippedNoValue,
    wonActionResourceName: summary.wonActionResourceName ?? "",
    wonActionCreated: summary.wonActionCreated,
    dryRun: summary.dryRun,
    requestId: summary.requestId ?? "",
    errors: summary.errors,
    formResults: summary.formResults,
    wonResults: summary.wonResults,
    events,
  }

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { offlineConversionUploads, offlineConversionEvents } = await import("@/lib/db/schema")
      const rows = await db
        .insert(offlineConversionUploads)
        .values({
          runAt: new Date(),
          candidates: record.candidates,
          uploaded: record.uploaded,
          skippedNoValue: record.skippedNoValue,
          actionResourceName: record.actionResourceName,
          actionCreated: record.actionCreated,
          wonCandidates: record.wonCandidates,
          wonUploaded: record.wonUploaded,
          wonSkippedNoValue: record.wonSkippedNoValue,
          wonActionResourceName: record.wonActionResourceName,
          wonActionCreated: record.wonActionCreated,
          dryRun: record.dryRun,
          requestId: record.requestId,
          errors: record.errors,
          formResults: record.formResults,
          wonResults: record.wonResults,
        })
        .returning({ id: offlineConversionUploads.id })
      const runId = rows[0]?.id
      if (runId && events.length > 0) {
        await db.insert(offlineConversionEvents).values(
          events.map((e) => ({
            submissionId: e.submissionId,
            eventType: e.eventType,
            runId,
            status: e.status,
            errorMessage: e.errorMessage,
            uploadedAt: new Date(e.uploadedAt),
          })),
        )
      }
      return
    } catch (err) {
      console.error("DB offline-conversion upload save failed, falling back to JSON:", err)
    }
  }

  try {
    const { promises: fs } = await import("fs")
    const path = await import("path")
    const file = await uploadsJsonPath()
    let rows: PersistedOfflineUpload[] = []
    try {
      const raw = await fs.readFile(file, "utf-8")
      const parsed = JSON.parse(raw)
      rows = Array.isArray(parsed) ? parsed : parsed?.uploads ?? []
    } catch {
      rows = []
    }
    rows.unshift(record)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify({ uploads: rows.slice(0, MAX_UPLOAD_HISTORY) }, null, 2), "utf-8")
  } catch (err) {
    console.error("JSON offline-conversion upload save failed:", err)
  }
}

/**
 * Build a report-friendly status from the most recent successful upload run.
 * This is the source of truth for the "inquiries sent to Google" indicator.
 */
export async function getLatestOfflineUploadStatus(): Promise<OfflineConversionUploadStatus> {
  let record: PersistedOfflineUpload | null = null

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { offlineConversionUploads } = await import("@/lib/db/schema")
      const { desc } = await import("drizzle-orm")
      const rows = await db
        .select()
        .from(offlineConversionUploads)
        .orderBy(desc(offlineConversionUploads.runAt))
        .limit(1)
      const row = rows[0]
      if (row) {
        record = {
          id: row.id,
          runAt: row.runAt.toISOString(),
          candidates: row.candidates,
          uploaded: row.uploaded,
          skippedNoValue: row.skippedNoValue,
          actionResourceName: row.actionResourceName,
          actionCreated: row.actionCreated,
          wonCandidates: row.wonCandidates,
          wonUploaded: row.wonUploaded,
          wonSkippedNoValue: row.wonSkippedNoValue,
          wonActionResourceName: row.wonActionResourceName,
          wonActionCreated: row.wonActionCreated,
          dryRun: row.dryRun,
          requestId: row.requestId,
          errors: Array.isArray(row.errors) ? (row.errors as string[]) : [],
          formResults: row.formResults as PersistedOfflineUpload["formResults"],
          wonResults: row.wonResults as PersistedOfflineUpload["wonResults"],
        }
      }
    } catch (err) {
      console.error("DB offline-conversion upload read failed, falling back to JSON:", err)
    }
  }

  if (!record) {
    try {
      const { promises: fs } = await import("fs")
      const file = await uploadsJsonPath()
      const raw = await fs.readFile(file, "utf-8")
      const parsed = JSON.parse(raw)
      const rows = Array.isArray(parsed) ? parsed : parsed?.uploads ?? []
      record = rows[0] ?? null
    } catch {
      record = null
    }
  }

  if (!record) {
    return {
      lastRunAt: null,
      formSuccess: 0,
      formErrors: 0,
      wonSuccess: 0,
      wonErrors: 0,
      hasErrors: false,
      requestId: null,
      status: "missing",
      note: "Offline-konversioonide üleslaadimise logi puudub — kontrolli, kas igapäevane cron töötab.",
    }
  }

  const formSuccess = record.formResults?.success ?? record.uploaded
  const formErrors = record.formResults?.errors ?? 0
  const wonSuccess = record.wonResults?.success ?? record.wonUploaded
  const wonErrors = record.wonResults?.errors ?? 0
  const hasErrors = formErrors > 0 || wonErrors > 0 || record.errors.length > 0

  return buildOfflineUploadStatus(record, { formSuccess, formErrors, wonSuccess, wonErrors, hasErrors })
}

export function buildOfflineUploadStatus(
  record: PersistedOfflineUpload,
  computed: { formSuccess: number; formErrors: number; wonSuccess: number; wonErrors: number; hasErrors: boolean },
): OfflineConversionUploadStatus {
  const { formSuccess, formErrors, wonSuccess, wonErrors, hasErrors } = computed
  const totalSuccess = formSuccess + wonSuccess
  const totalErrors = formErrors + wonErrors

  const runDate = new Date(record.runAt).toLocaleString("et-EE", {
    timeZone: "Europe/Tallinn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  let status: OfflineConversionUploadStatus["status"] = "ok"
  let note = `Viimane üleslaadimine: ${runDate}. Google töötleis ${totalSuccess} sündmust edukalt${record.requestId ? ` (request ID: ${record.requestId})` : ""}.`
  if (totalErrors > 0) {
    status = totalSuccess > 0 ? "partial" : "failed"
    note = `Viimane üleslaadimine: ${runDate}. Google tagastas ${totalErrors} töötlemisviga (kokku ${totalSuccess + totalErrors} sündmust).`
  }

  return {
    lastRunAt: record.runAt,
    formSuccess,
    formErrors,
    wonSuccess,
    wonErrors,
    hasErrors,
    requestId: record.requestId || null,
    status,
    note,
  }
}

export interface SubmissionOfflineStatus {
  form?: PersistedOfflineEvent | null
  won?: PersistedOfflineEvent | null
  lastUploadedAt: string | null
  lastRequestId: string | null
  eligible: boolean
  reason?: string
}

/**
 * Return the latest upload event status for a single form submission.
 * Used by the admin inquiries table to show whether Google actually received
 * this gclid-carrying contact form as an offline conversion event.
 */
export async function getSubmissionOfflineStatus(submissionId: number): Promise<SubmissionOfflineStatus> {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { offlineConversionEvents, offlineConversionUploads } = await import("@/lib/db/schema")
      const { desc, eq } = await import("drizzle-orm")
      const rows = await db
        .select({
          event: offlineConversionEvents,
          upload: offlineConversionUploads,
        })
        .from(offlineConversionEvents)
        .leftJoin(offlineConversionUploads, eq(offlineConversionEvents.runId, offlineConversionUploads.id))
        .where(eq(offlineConversionEvents.submissionId, submissionId))
        .orderBy(desc(offlineConversionEvents.uploadedAt))
        .limit(2)

      let form: PersistedOfflineEvent | null = null
      let won: PersistedOfflineEvent | null = null
      let lastUploadedAt: string | null = null
      let lastRequestId: string | null = null
      for (const r of rows) {
        const e: PersistedOfflineEvent = {
          submissionId: r.event.submissionId,
          eventType: r.event.eventType as "form" | "won",
          status: r.event.status as "success" | "error",
          errorMessage: r.event.errorMessage,
          uploadedAt: r.event.uploadedAt.toISOString(),
        }
        if (e.eventType === "form" && !form) form = e
        if (e.eventType === "won" && !won) won = e
        if (!lastUploadedAt) lastUploadedAt = e.uploadedAt
        if (!lastRequestId && r.upload?.requestId) lastRequestId = r.upload.requestId
      }
      return { form, won, lastUploadedAt, lastRequestId, eligible: true }
    } catch (err) {
      console.error("DB submission offline status read failed, falling back to JSON:", err)
    }
  }

  // JSON fallback.
  try {
    const { promises: fs } = await import("fs")
    const file = await uploadsJsonPath()
    const raw = await fs.readFile(file, "utf-8")
    const parsed = JSON.parse(raw)
    const uploads: PersistedOfflineUpload[] = Array.isArray(parsed) ? parsed : parsed?.uploads ?? []

    let form: PersistedOfflineEvent | null = null
    let won: PersistedOfflineEvent | null = null
    let lastUploadedAt: string | null = null
    let lastRequestId: string | null = null

    for (const upload of uploads) {
      for (const e of upload.events ?? []) {
        if (e.submissionId !== submissionId) continue
        if (e.eventType === "form" && !form) form = e
        if (e.eventType === "won" && !won) won = e
        if (!lastUploadedAt) lastUploadedAt = e.uploadedAt
        if (!lastRequestId && upload.requestId) lastRequestId = upload.requestId
        if (form && won && lastUploadedAt && lastRequestId) break
      }
      if (form && won && lastUploadedAt && lastRequestId) break
    }
    return { form, won, lastUploadedAt, lastRequestId, eligible: true }
  } catch {
    return { form: null, won: null, lastUploadedAt: null, lastRequestId: null, eligible: true }
  }
}
