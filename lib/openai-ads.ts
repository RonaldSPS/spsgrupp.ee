/**
 * Ajutine ChatGPT Ads (OpenAI) jälgimispiksli test — kliendi palvel alates
 * 01.11.2026. Konversiooniks loetakse KONTAKTVORMI päringut (mitte
 * tööavaldust). Kolm osa:
 *
 *   1. Piksel (brauser): app/components/analytics/OpenAiPixel.tsx laadib
 *      oaiq SDK (bzrcdn.openai.com) — root-shell'is, mitte /spsadmn/ ega
 *      Vercel preview'des.
 *   2. Sündmus (brauser): trackOpenAiConversion() app/components/analytics/
 *      form-conversion.ts-is — kutsutakse ContactForm'i õnnestumisel.
 *   3. Sündmus (server): lib/openai-ads-server.ts saadab sama sündmuse
 *      Conversions API kaudu (after() lib/actions.ts-is) — no-op kuni
 *      OPENAI_CONVERSIONS_API_KEY on seadistatud.
 *
 * Eemaldamine = kustuta need kohad + CSP read proxy.ts-is + raporti sektsioon
 * (chatGptAdsSection lib/reporting/email-html.ts-is).
 */

export const OPENAI_PIXEL_ID = "VeKUzbj5PSN5K641vfQRaK"

/** Sündmuse tüüp — kliendi antud seadistuse järgi (registration_completed). */
export const OPENAI_CONVERSION_TYPE = "registration_completed"

/** Sama payload pikslis ja Conversions API-s. */
export const OPENAI_CONVERSION_DATA = { type: "customer_action" } as const

export type OaiqFn = ((...args: unknown[]) => void) & { q: unknown[][] }

declare global {
  interface Window {
    oaiq?: OaiqFn
  }
}

export interface OpenAiConversionEvent {
  id: string
  type: typeof OPENAI_CONVERSION_TYPE
  timestamp_ms: number
  source_url: string
  action_source: "web"
  /** OpenAI klikiviide (?oppref=... landing-URL-is) — omistab sündmuse reklaamklõpsule. */
  oppref?: string
  data: typeof OPENAI_CONVERSION_DATA
}

/**
 * oppref on OpenAI klikiviite identifikaator. Doku järgi tuleb originaal-
 * väärtust MITTE muuta — lubame ainult base64(url) tähestiku ja piirame
 * pikkuse; kõik muu loeme puuduvaks.
 */
export function sanitizeOppref(raw: unknown): string {
  if (typeof raw !== "string") return ""
  const trimmed = raw.trim()
  return /^[A-Za-z0-9_+\-/=]{1,512}$/.test(trimmed) ? trimmed : ""
}

/**
 * Conversions API nõuab absoluutset source_url-i. Vormi hidden page_url võib
 * olla juursuhteline ("/kontakt/") — prefiksime saidi domeeniga.
 */
export function buildAbsoluteSourceUrl(pageUrl: string): string {
  const trimmed = pageUrl.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith("/")) return `https://spsgrupp.ee${trimmed}`
  return "https://spsgrupp.ee/"
}

export function buildOpenAiConversionEvent(params: {
  id: string
  timestampMs: number
  pageUrl: string
  oppref?: string
}): OpenAiConversionEvent {
  const event: OpenAiConversionEvent = {
    id: params.id,
    type: OPENAI_CONVERSION_TYPE,
    timestamp_ms: params.timestampMs,
    source_url: buildAbsoluteSourceUrl(params.pageUrl),
    action_source: "web",
    data: { ...OPENAI_CONVERSION_DATA },
  }
  if (params.oppref) event.oppref = params.oppref
  return event
}
