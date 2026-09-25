/**
 * Offline-conversion upload to Google Ads via the Data Manager API
 * (events:ingest). UploadClickConversions is restricted to existing users —
 * new integrations must use the Data Manager API (verified 25.09.2026).
 *
 * Why: browser-side Ads conversion tags depend on ad_storage consent; the gclid
 * stored in form_submissions is consent-independent, so uploading it server-side
 * feeds Smart Bidding the REAL inquiry signal regardless of cookie choice. This
 * is the automated successor of scripts/ads-offline-conversions.ts (CSV export +
 * manual Data manager upload). Idempotency: each submission gets a stable
 * transactionId ("form-<id>"), so the daily cron can re-upload a trailing
 * window without state tracking.
 *
 * Auth: service account (.secrets/gcp-analytics.json / GCP_SERVICE_ACCOUNT_JSON)
 * — it can mint both required scopes (adwords for the action lookup/create,
 * datamanager for the ingest). OAuth refresh-token trio is the fallback, but a
 * token minted by setup:ads-auth only carries the adwords scope — re-consent
 * with both scopes before using it for uploads. The account used needs at
 * least "Standard" access on the Ads account (read-only fails).
 *
 * Conversion action: looked up by name (default "Vormipäring (gclid offline
 * import)", override GOOGLE_ADS_OFFLINE_CONVERSION_NAME); created automatically
 * as a SECONDARY UPLOAD_CLICKS action when missing. Flipping it to PRIMARY is a
 * deliberate manual step in the Ads UI (once browser-tag duplicates are clean).
 *
 * Callers: app/api/cron/offline-conversions (daily Vercel Cron) and
 * scripts/ads-offline-conversions-upload.ts (local runs, --dry-run).
 */

import { getFormSubmissions, type FormSubmission } from "../form-submissions"
import { isTestSubmission } from "./forms"
import { getGoogleAccessToken } from "./google-auth"

/** Bump when Google sunsets this version (a 404/INVALID_VERSION error means: bump). */
const ADS_API_VERSION = "v25"
const ADWORDS_SCOPE = "https://www.googleapis.com/auth/adwords"
const DATAMANAGER_SCOPE = "https://www.googleapis.com/auth/datamanager"
const DEFAULT_ACTION_NAME = "Vormipäring (gclid offline import)"
/** Trailing re-upload window — transactionId keeps daily uploads idempotent. */
const DEFAULT_WINDOW_DAYS = 14

export interface OfflineUploadSummary {
  candidates: number
  uploaded: number
  skippedNoValue: number
  actionResourceName: string | null
  actionCreated: boolean
  dryRun: boolean
  errors: string[]
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

function toEvent(row: FormSubmission): Record<string, unknown> {
  const fee = Number(row.fee)
  const event: Record<string, unknown> = {
    adIdentifiers: { gclid: row.gclid },
    eventTimestamp: eventTimestamp(new Date(row.createdAt)),
    transactionId: `form-${row.id}`,
    eventSource: "WEB",
  }
  if (Number.isFinite(fee) && fee > 0) {
    event.conversionValue = Math.round(fee * 100) / 100
    event.currency = "EUR"
  }
  return event
}

export async function uploadOfflineConversions(options?: {
  sinceDays?: number
  dryRun?: boolean
}): Promise<OfflineUploadSummary> {
  const sinceDays = options?.sinceDays ?? DEFAULT_WINDOW_DAYS
  const dryRun = options?.dryRun ?? false
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (!developerToken || !customerId) {
    throw new Error("GOOGLE_ADS_DEVELOPER_TOKEN / GOOGLE_ADS_CUSTOMER_ID are not set")
  }

  const since = new Date(Date.now() - sinceDays * 24 * 3600 * 1000).toISOString().slice(0, 10)
  const rows = await getFormSubmissions({ from: since })
  const candidates = rows.filter(
    (r) => r.form === "contact" && !r.isSpam && Boolean(r.gclid) && !isTestSubmission(r),
  )

  const summary: OfflineUploadSummary = {
    candidates: candidates.length,
    uploaded: 0,
    skippedNoValue: 0,
    actionResourceName: null,
    actionCreated: false,
    dryRun,
    errors: [],
  }
  if (candidates.length === 0) return summary

  const actionName = process.env.GOOGLE_ADS_OFFLINE_CONVERSION_NAME ?? DEFAULT_ACTION_NAME
  const adsToken = await getAdsAccessToken([ADWORDS_SCOPE])
  const action = await resolveConversionAction(adsHeaders(adsToken, developerToken), customerId, actionName, dryRun)
  summary.actionResourceName = action.resourceName
  summary.actionCreated = action.created

  if (dryRun) return summary
  if (!action.resourceName) throw new Error("Conversion action resource name unresolved")
  const conversionActionId = action.resourceName.split("/").pop()!

  const events = candidates.map(toEvent)
  summary.skippedNoValue = events.filter((e) => e.conversionValue === undefined).length

  const destination: Record<string, unknown> = {
    operatingAccount: { accountType: "GOOGLE_ADS", accountId: customerId },
    productDestinationId: conversionActionId,
  }
  const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/-/g, "")
  if (loginCustomerId) destination.loginAccount = { accountType: "GOOGLE_ADS", accountId: loginCustomerId }

  const dmToken = await getAdsAccessToken([DATAMANAGER_SCOPE])
  const res = await fetch("https://datamanager.googleapis.com/v1/events:ingest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dmToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destinations: [destination], encoding: "HEX", events }),
  })
  const data = (await res.json()) as { requestId?: string; error?: { message?: string } }
  if (!res.ok) {
    throw new Error(`Data Manager events:ingest failed (${res.status}): ${JSON.stringify(data).slice(0, 2000)}`)
  }
  summary.uploaded = events.length
  return summary
}

