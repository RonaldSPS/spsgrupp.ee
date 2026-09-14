/**
 * First-party lead-source attribution.
 *
 * The landing URL carries the evidence of where a visitor came from
 * (?gclid=..., ?utm_source=..., the external referrer), but it is gone as
 * soon as the visitor navigates to another page - and the Conversion Linker
 * `_gcl_aw` cookie only exists when the visitor granted ads consent. To keep
 * per-submission source attribution working also for visitors who DECLINE
 * cookies, the first pageview of each tab session copies the evidence into
 * sessionStorage (key `sps_attr`) and the forms read it back when stamping
 * their hidden `source` field.
 *
 * Classification is deliberately conservative - nothing is assumed without
 * positive evidence (e.g. a missing gclid never implies "organic"):
 *   google_ads            - gclid captured (URL/session) or _gcl_aw cookie
 *   utm:<source>[/<medium>] - utm_source in the landing URL
 *   organic:<engine>      - referrer is a known search engine
 *   referral:<host>       - referrer is another external site
 *   direct                - captured this session, no external referrer
 *   ""                    - no data at all (no-JS etc.) → admin shows "Teadmata"
 */

const STORAGE_KEY = "sps_attr"

export interface StoredAttribution {
  gclid: string
  utmSource: string
  utmMedium: string
  /** External landing referrer hostname (www-stripped), "" when there was none. */
  refHost: string
}

/** Known search engines: substring match on the referrer hostname. */
const SEARCH_ENGINES: ReadonlyArray<readonly [string, string]> = [
  ["google.", "google"],
  ["bing.", "bing"],
  ["duckduckgo.", "duckduckgo"],
  ["ecosia.", "ecosia"],
  ["yandex.", "yandex"],
  ["yahoo.", "yahoo"],
  ["neti.", "neti"],
  ["startpage.", "startpage"],
  ["qwant.", "qwant"],
]

function stripWww(host: string): string {
  return host.toLowerCase().replace(/^www\./, "")
}

/** External referrer hostname, "" when there is none or it is our own site. */
function externalReferrerHost(referrer: string): string {
  if (!referrer) return ""
  try {
    const host = stripWww(new URL(referrer).hostname)
    if (!host || host === stripWww(window.location.hostname)) return ""
    return host
  } catch {
    return ""
  }
}

function readStored(): StoredAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return null
    const p = parsed as Record<string, unknown>
    return {
      gclid: typeof p.gclid === "string" ? p.gclid : "",
      utmSource: typeof p.utmSource === "string" ? p.utmSource : "",
      utmMedium: typeof p.utmMedium === "string" ? p.utmMedium : "",
      refHost: typeof p.refHost === "string" ? p.refHost : "",
    }
  } catch {
    return null
  }
}

/**
 * Capture attribution evidence from the current pageview. Idempotent: the
 * landing referrer is written only on the first capture of the tab session,
 * while gclid/UTM follow a freshest-click-wins rule (matching getGclid()).
 * Mounted site-wide via AttributionCapture; also called lazily by
 * getAttributionSource() so a direct landing on a form page still works.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return
  try {
    const params = new URLSearchParams(window.location.search)
    const existing = readStored()
    const urlGclid = (params.get("gclid") ?? "").slice(0, 100)
    const utmSource = (params.get("utm_source") ?? "").slice(0, 100).toLowerCase()
    const utmMedium = (params.get("utm_medium") ?? "").slice(0, 100).toLowerCase()
    const next: StoredAttribution = {
      gclid: urlGclid || existing?.gclid || "",
      utmSource: utmSource || existing?.utmSource || "",
      utmMedium: utmMedium || existing?.utmMedium || "",
      refHost: existing ? existing.refHost : externalReferrerHost(document.referrer),
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode etc.) - source falls back to cookie/URL only
  }
}

/** gclid captured at landing (consent-independent), "" when none. */
export function getCapturedGclid(): string {
  if (typeof window === "undefined") return ""
  return readStored()?.gclid ?? ""
}

function gclidFromCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/)
  if (!match) return ""
  const parts = decodeURIComponent(match[1]).split(".")
  return parts[parts.length - 1] || ""
}

function searchEngineName(host: string): string | null {
  for (const [needle, name] of SEARCH_ENGINES) {
    if (host.includes(needle)) return name
  }
  return null
}

/**
 * Classified source code for the form's hidden `source` field (see the list
 * at the top of this file). "" when there is no evidence at all.
 */
export function getAttributionSource(): string {
  if (typeof window === "undefined") return ""
  try {
    captureAttribution()
    const stored = readStored()
    if (stored?.gclid || gclidFromCookie()) return "google_ads"
    if (stored?.utmSource) {
      return `utm:${stored.utmSource}${stored.utmMedium ? `/${stored.utmMedium}` : ""}`
    }
    if (stored?.refHost) {
      const engine = searchEngineName(stored.refHost)
      return engine ? `organic:${engine}` : `referral:${stored.refHost}`
    }
    return stored ? "direct" : ""
  } catch {
    return ""
  }
}
