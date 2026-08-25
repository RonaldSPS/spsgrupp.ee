/**
 * Hardcoded form-conversion event pushed straight onto the GTM dataLayer.
 *
 * Deliberately dependency-free: no `@next/third-parties`, no gtag shim — a
 * raw `window.dataLayer.push()` works with any GTM loader and cannot break
 * when the analytics stack is refactored. Conversion tracking has been lost
 * several times to technical changes, so this event name and payload shape
 * must stay STABLE. Do not rename `form_submission_success` — GTM conversion
 * triggers listen for exactly this string.
 *
 * This is pushed IN ADDITION to the `form_submit` event (sendGTMEvent), which
 * the existing GA4 "päring" tag + Enhanced Conversions tags use. GTM should
 * bind the Google Ads conversion trigger to `form_submission_success`; both
 * events carry the same fields, including `user_data.email` for Enhanced
 * Conversions and `form_id` so career submissions can stay excluded from
 * lead conversions.
 *
 * Consent-safe: the push itself only queues data; Consent Mode v2 governs
 * whether any tag actually fires.
 */
export function pushFormSubmissionSuccess(payload: {
  form_id: "contact" | "career"
  page_path: string
  locale: string
  email: string
}) {
  if (typeof window === "undefined") return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({
    event: "form_submission_success",
    form_id: payload.form_id,
    page_path: payload.page_path,
    locale: payload.locale,
    user_data: { email: payload.email },
  })
}
