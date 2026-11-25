import { createHash } from "node:crypto"

export interface PageViewInput {
  path: string
  locale: string
  referrerHost: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  screenWidth: number | null
  screenHeight: number | null
  language: string
}

export interface PageViewRecord extends PageViewInput {
  country: string
  region: string
  city: string
  deviceType: string
  browser: string
  os: string
  dailyVisitorHash: string
}

/** Extract the client IP from proxy headers. Used only for transient hashing. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip")?.trim() || ""
}

/** Geo data supplied by Vercel edge headers. IP is never stored. */
export function getGeoFromHeaders(request: Request): { country: string; region: string; city: string } {
  return {
    country: request.headers.get("x-vercel-ip-country") || "",
    region: request.headers.get("x-vercel-ip-country-region") || "",
    city: request.headers.get("x-vercel-ip-city") || "",
  }
}

/** Classify device type from user agent. */
export function parseDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet"
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry|bb10/i.test(ua)) return "mobile"
  if (/android/i.test(ua)) return "tablet" // Android without "mobile" is usually a tablet
  return "desktop"
}

/** Parse browser family from user agent. */
export function parseBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (/edg\//.test(ua)) return "Edge"
  if (/opr\/|opera/.test(ua)) return "Opera"
  if (/chrome|crios/.test(ua) && !/edg\//.test(ua)) return "Chrome"
  if (/firefox|fxios/.test(ua)) return "Firefox"
  if (/safari/.test(ua) && !/chrome|crios/.test(ua)) return "Safari"
  if (/msie|trident/.test(ua)) return "Internet Explorer"
  return "Other"
}

/** Parse operating system from user agent. */
export function parseOs(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (/windows nt 10/.test(ua)) return "Windows 10"
  if (/windows nt 11/.test(ua)) return "Windows 11"
  if (/windows nt/.test(ua)) return "Windows"
  if (/iphone|ipad|ipod/.test(ua)) return "iOS"
  if (/android/.test(ua)) return "Android"
  if (/mac os x/.test(ua)) return "macOS"
  if (/linux/.test(ua)) return "Linux"
  return "Other"
}

/** Known search engines for referrer classification. */
const SEARCH_ENGINES: ReadonlyArray<readonly [string, string]> = [
  ["google.", "Google"],
  ["bing.", "Bing"],
  ["duckduckgo.", "DuckDuckGo"],
  ["ecosia.", "Ecosia"],
  ["yandex.", "Yandex"],
  ["yahoo.", "Yahoo"],
  ["neti.", "Neti"],
  ["startpage.", "Startpage"],
  ["qwant.", "Qwant"],
]

export function classifyReferrer(host: string): string {
  const h = host.toLowerCase()
  if (!h) return "direct"
  for (const [needle, name] of SEARCH_ENGINES) {
    if (h.includes(needle)) return name
  }
  if (h.includes("facebook.") || h.includes("fb.")) return "Facebook"
  if (h.includes("instagram.")) return "Instagram"
  if (h.includes("linkedin.")) return "LinkedIn"
  if (h.includes("t.co") || h.includes("twitter.") || h.includes("x.com")) return "X/Twitter"
  if (h.includes("youtube.")) return "YouTube"
  return host
}

/**
 * Compute a daily anonymous visitor hash. The IP and user agent are used
 * only for this hash and are never stored. The hash changes every day, so
 * cross-day tracking is impossible.
 */
export function computeDailyVisitorHash(ip: string, userAgent: string, date: Date): string {
  const salt = process.env.ANALYTICS_HASH_SALT || "sps-analytics-default-salt"
  const day = date.toISOString().slice(0, 10)
  return createHash("sha256").update(`${ip}|${userAgent}|${day}|${salt}`).digest("hex")
}

/** Sanitize a string value from the client. */
export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

/** Sanitize an optional integer value from the client. */
export function sanitizeInt(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  return Math.round(value)
}

/** Extract UTM parameters from a URL search string. */
export function parseUtm(search: string): Pick<PageViewInput, "utmSource" | "utmMedium" | "utmCampaign" | "utmTerm" | "utmContent"> {
  const params = new URLSearchParams(search)
  return {
    utmSource: sanitizeString(params.get("utm_source"), 100).toLowerCase(),
    utmMedium: sanitizeString(params.get("utm_medium"), 100).toLowerCase(),
    utmCampaign: sanitizeString(params.get("utm_campaign"), 200).toLowerCase(),
    utmTerm: sanitizeString(params.get("utm_term"), 200),
    utmContent: sanitizeString(params.get("utm_content"), 200),
  }
}

/** Extract the hostname from a referrer URL. */
export function extractReferrerHost(referrer: string): string {
  if (!referrer) return ""
  try {
    const url = new URL(referrer)
    return url.hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return ""
  }
}
