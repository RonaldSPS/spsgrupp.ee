/**
 * Google Consent Mode v2 state, shared by the consent-default inline script
 * (rendered by RootShell before GTM loads) and the CookieConsentBanner.
 *
 * Minimal-restriction policy (owner decision 03.09.2026): only the signals
 * Google's EU User Consent Policy actually requires consent for are gated —
 * `ad_storage`, `ad_user_data` and `ad_personalization` stay DENIED until
 * the visitor accepts (granting those by default would breach Google's
 * terms for EEA traffic). Everything else, incl. `analytics_storage`, is
 * GRANTED by default so audience measurement stays intact and the banner
 * effectively controls ads consent only. This is "advanced" consent mode:
 * tags load immediately and send cookieless pings while ads consent is
 * denied, so Ads conversion modeling keeps working — the most data Google
 * allows without consent.
 *
 * The banner flips state via gtag('consent', 'update', ...) which queues
 * onto dataLayer even when gtm.js has not finished loading yet.
 */

export const CONSENT_STORAGE_KEY = "sps_consent"

export type ConsentChoice = "granted" | "denied"

/** Consent defaults pushed before GTM loads. Only Ads signals are gated. */
export const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
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
  const ads = choice === "granted" ? "granted" : "denied"
  w.dataLayer = w.dataLayer || []
  w.gtag =
    w.gtag ??
    function gtagShim(...args: unknown[]) {
      w.dataLayer!.push(args)
    }
  w.gtag("consent", "update", {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    // Analytics stays granted either way — the choice gates ads consent only.
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
  })
}

/**
 * Consent-banner funnel events for the accept/decline rate, pushed straight
 * onto the GTM dataLayer (raw push, zero deps — same contract and stability
 * requirements as `form_submission_success`). Do not rename — GTM listens
 * for exactly these event names:
 *   consent_banner_shown · consent_accept · consent_decline
 * GTM wiring: one Custom Event trigger, "Use regex matching" on the Event
 * name with ^consent_(banner_shown|accept|decline)$ → one GA4 Event tag
 * whose Event Name is the built-in {{Event}} variable.
 */
export type ConsentEventName = "consent_banner_shown" | "consent_accept" | "consent_decline"

export function pushConsentEvent(event: ConsentEventName, locale: string) {
  if (typeof window === "undefined") return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, locale })
}
