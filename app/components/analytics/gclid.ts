/**
 * Google Click ID (gclid) capture for lead attribution.
 *
 * Google Ads auto-tagging appends ?gclid=... to the landing URL; GTM's
 * Conversion Linker tag then persists it in the first-party `_gcl_aw` cookie
 * (format: "GCL.<unix-ts>.<gclid>"). We read the URL param first (freshest
 * click wins) and fall back to the cookie, so the id is available on any
 * page the visitor eventually submits a form from.
 *
 * Consent-safe by construction: with ad_storage denied, Conversion Linker
 * writes no `_gcl_aw` cookie and the field stays empty.
 */
export function getGclid(): string {
  if (typeof window === "undefined") return ""

  const fromUrl = new URLSearchParams(window.location.search).get("gclid")
  if (fromUrl) return fromUrl.slice(0, 100)

  const match = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/)
  if (match) {
    const parts = decodeURIComponent(match[1]).split(".")
    const gclid = parts[parts.length - 1]
    if (gclid) return gclid.slice(0, 100)
  }
  return ""
}
