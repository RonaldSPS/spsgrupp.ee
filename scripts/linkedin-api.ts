/**
 * Generic LinkedIn Marketing API CLI helper.
 *
 * Credentials live in raportid/LinkedIn/env.local (gitignored — NOT the root
 * .env.local, see raportid/LinkedIn/README.md). Exchanges the refresh token
 * for a 60-day access token, then performs the requested REST call.
 *
 * Usage:
 *   npx tsx scripts/linkedin-api.ts GET  "adAccounts?q=search"
 *   npx tsx scripts/linkedin-api.ts POST "adCampaignGroups" '{"account":"urn:li:sponsoredAccount:509346657",...}'
 *   npx tsx scripts/linkedin-api.ts GET  "adAccounts?q=search" --raw
 *
 * Scope guard: token was consented with r_ads r_ads_reporting rw_ads — do NOT
 * change scopes (invalidates tokens).
 */

import { readFileSync, existsSync } from "node:fs"

const ENV_PATH = "raportid/LinkedIn/env.local"
const API_BASE = "https://api.linkedin.com/rest/"
// Monthly version header. If calls start 4xx-ing on version, bump to the
// current month (YYYYMM). 202511 verified working 11.11.2026 but sunsets
// 2026-11-16 -> default moved to 202610 (verified 11.11.2026).
const LINKEDIN_VERSION = process.env.LINKEDIN_API_VERSION ?? "202610"

function loadLinkedInEnv() {
  if (!existsSync(ENV_PATH)) {
    console.error(`Missing ${ENV_PATH} — see raportid/LinkedIn/README.md`)
    process.exit(1)
  }
  for (const line of readFileSync(ENV_PATH, "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key) process.env[key] = value
  }
}

export async function getLinkedInAccessToken(): Promise<string> {
  loadLinkedInEnv()
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.LINKEDIN_REFRESH_TOKEN ?? "",
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
    }),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`Token refresh failed ${res.status}: ${text}`)
    console.error("-> re-consent with: npm run setup:linkedin-auth (see README)")
    process.exit(1)
  }
  const json = JSON.parse(text)
  return json.access_token as string
}

export interface LinkedInResponse {
  status: number
  ok: boolean
  /** x-restli-id header (entity id/URN on creates) */
  restliId: string | null
  json: any
  text: string
}

/** Authenticated versioned REST call. `pathOrUrl` is either a path under
 *  /rest/ or an absolute URL (e.g. media uploadUrl). Pass `json` for a JSON
 *  body or `rawBody`+`contentType` for binary uploads. Throws on !ok. */
export async function linkedInApiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  pathOrUrl: string,
  opts: { json?: unknown; rawBody?: BodyInit; contentType?: string; headers?: Record<string, string> } = {},
): Promise<LinkedInResponse> {
  const token = await getLinkedInAccessToken()
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Linkedin-Version": LINKEDIN_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    ...opts.headers,
  }
  const init: RequestInit = { method, headers }
  if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json"
    init.body = JSON.stringify(opts.json)
  } else if (opts.rawBody !== undefined) {
    headers["Content-Type"] = opts.contentType ?? "application/octet-stream"
    init.body = opts.rawBody
  }
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : API_BASE + pathOrUrl
  const res = await fetch(url, init)
  const text = await res.text()
  let json: any = null
  try { json = JSON.parse(text) } catch { /* empty/binary body */ }
  const out: LinkedInResponse = { status: res.status, ok: res.ok, restliId: res.headers.get("x-restli-id"), json, text }
  if (!res.ok) {
    throw new Error(`LinkedIn API ${method} ${url} -> ${res.status}: ${text.slice(0, 2000)}`)
  }
  return out
}

async function main() {
  const [method, restPath, bodyJson] = process.argv.slice(2)
  if (!method || !restPath || !["GET", "POST", "PATCH", "DELETE", "PARTIAL"].includes(method.toUpperCase())) {
    console.error('Usage: npx tsx scripts/linkedin-api.ts <GET|POST|PATCH|DELETE|PARTIAL> "<path>" [jsonBody|@file]')
    console.error("  PARTIAL = POST with X-RestLi-Method: PARTIAL_UPDATE (entity field updates)")
    process.exit(1)
  }
  try {
    // "@path/file.json" reads the body from a file (PowerShell quote-mangling
    // makes inline JSON unreliable).
    const raw = bodyJson?.startsWith("@") ? readFileSync(bodyJson.slice(1), "utf-8") : bodyJson
    const isPartial = method.toUpperCase() === "PARTIAL"
    const res = await linkedInApiRequest(isPartial ? "POST" : (method.toUpperCase() as any), restPath, {
      ...(raw ? { json: JSON.parse(raw) } : {}),
      ...(isPartial ? { headers: { "X-RestLi-Method": "PARTIAL_UPDATE" } } : {}),
    })
    console.log(`HTTP ${res.status}`)
    if (res.restliId) console.log(`x-restli-id: ${res.restliId}`)
    console.log(res.json ? JSON.stringify(res.json, null, 2) : res.text || "(empty body)")
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

if (process.argv[1] && process.argv[1].endsWith("linkedin-api.ts")) {
  main()
}
