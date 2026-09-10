/**
 * Google API auth for reporting: mints OAuth access tokens from the
 * sps-analytics-reader service account. Two credential sources:
 *
 *   1. GCP_SERVICE_ACCOUNT_JSON  - the full service-account JSON as an env
 *      var (Vercel production; the file must never be committed/deployed).
 *   2. GOOGLE_APPLICATION_CREDENTIALS / .secrets/gcp-analytics.json - local
 *      key file (same file the CLI report scripts use).
 *
 * No "server-only" import here: scripts/weekly-report.ts also uses this.
 */

import { existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"
import type { ReportPeriod } from "./types"

export type { ReportPeriod }

const DEFAULT_KEY_FILE = ".secrets/gcp-analytics.json"

export async function getGoogleAccessToken(scopes: string[]): Promise<string> {
  const jsonEnv = process.env.GCP_SERVICE_ACCOUNT_JSON?.trim()
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? DEFAULT_KEY_FILE

  let auth: GoogleAuth
  if (jsonEnv) {
    let credentials: Record<string, unknown>
    try {
      credentials = JSON.parse(jsonEnv) as Record<string, unknown>
    } catch {
      throw new Error("GCP_SERVICE_ACCOUNT_JSON is not valid JSON")
    }
    auth = new GoogleAuth({ credentials: credentials as never, scopes })
  } else {
    if (!existsSync(keyFile)) {
      throw new Error(
        `Service-account key not found at ${keyFile} and GCP_SERVICE_ACCOUNT_JSON is not set. ` +
          `See ANALYTICS.md §4.2 for setup.`,
      )
    }
    auth = new GoogleAuth({ keyFile, scopes })
  }

  const client = await auth.getClient()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error("Failed to mint an access token from the service-account key")
  return token.token
}

export async function postJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${url} -> ${res.status}: ${text.slice(0, 400)}`)
  }
  return (await res.json()) as T
}

/* ---------- shared date-range convention (GA4/GSC/Ads data lags ~2 days) ---------- */

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Last 7 days (ending 2 days ago) vs the 7 days before that. */
export function weeklyPeriod(now: Date = new Date()): ReportPeriod {
  const end = new Date(now)
  end.setDate(end.getDate() - 2)
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  const prevEnd = new Date(start)
  prevEnd.setDate(prevEnd.getDate() - 1)
  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - 6)
  return {
    start: isoDate(start),
    end: isoDate(end),
    prevStart: isoDate(prevStart),
    prevEnd: isoDate(prevEnd),
  }
}
