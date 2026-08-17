/**
 * Google Consent Mode v2 state, shared by the consent-default inline script
 * (rendered by RootShell before GTM loads) and the CookieConsentBanner.
 *
 * Defaults are DENIED for everything except security_storage; the banner
 * flips them via gtag('consent', 'update', ...) which queues onto dataLayer
 * even when gtm.js has not finished loading yet.
 */

export const CONSENT_STORAGE_KEY = "sps_consent"

export type ConsentChoice = "granted" | "denied"

/** Consent defaults pushed before GTM loads (mirrors the previous Cookiebot setup). */
export const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
`

/** Window with the GTM/gtag globals (declared locally to stay decoupled). */
type ConsentWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === "granted" || value === "denied" ? value : null
  } catch {
    return null
  }
}

export function storeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice)
  } catch {
    // private mode etc. — consent still applies for this page view
  }
}

/** Push a consent update onto the dataLayer (gtag shim is set up by the inline script). */
export function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return
  const w = window as ConsentWindow
  const value = choice === "granted" ? "granted" : "denied"
  w.dataLayer = w.dataLayer || []
  w.gtag =
    w.gtag ??
    function gtagShim(...args: unknown[]) {
      w.dataLayer!.push(args)
    }
  w.gtag("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    functionality_storage: value,
    personalization_storage: value,
  })
}
