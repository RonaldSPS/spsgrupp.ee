/**
 * Cloudflare Turnstile server-side verification for the public forms.
 *
 * Design notes:
 * - Enabled only when BOTH keys are set: TURNSTILE_SECRET_KEY (server-side
 *   verification) and NEXT_PUBLIC_TURNSTILE_SITE_KEY (renders the widget in
 *   the client bundle). A secret without the public site key means no token
 *   can ever be produced, so enforcing then would fail closed on EVERY real
 *   submission - that misconfiguration must behave as "disabled", not as a
 *   site-wide form outage.
 * - When enabled, a missing/invalid token FAILS CLOSED: the submitter gets a
 *   generic "send failed, try again" error (localized copy), the submission
 *   is not saved and no e-mail is sent. Bots get no signal beyond that, and a
 *   rare false negative (script blocked by an ad-blocker) still sees feedback.
 * - Verification call has a hard timeout so a Cloudflare hiccup can't hang
 *   the server action.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const VERIFY_TIMEOUT_MS = 5000

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
}

export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !isTurnstileEnabled()) return true
  if (!token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set("remoteip", remoteIp)

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      cache: "no-store",
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error("Turnstile verification request failed:", err)
    return false
  }
}
