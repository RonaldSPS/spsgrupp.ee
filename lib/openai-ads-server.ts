import "server-only"

import { randomUUID } from "node:crypto"
import { buildOpenAiConversionEvent, OPENAI_PIXEL_ID } from "./openai-ads"

const EVENTS_URL = `https://bzr.openai.com/v1/events?pid=${OPENAI_PIXEL_ID}`
const TIMEOUT_MS = 5000

/**
 * Jagatud sündmuse id ("form-<uuid>"): sama id läheb nii brauseri-pikslile
 * (event_id) kui Conversions API-le (id) — OpenAI dedupleerib selle alusel,
 * muidu loendataks üks konversioon kahekordselt.
 */
export function newOpenAiEventId(): string {
  return `form-${randomUUID()}`
}

/**
 * ChatGPT Ads Conversions API — serveripoolne konversioonisündmus
 * (kontaktvormi päring). Ajutine test alates 01.11.2026.
 *
 * No-op kuni OPENAI_CONVERSIONS_API_KEY on seadistatud (sama muster nagu
 * Turnstile'il: poolik seadistus ei tohi vormi takistada). Ei viska kunagi
 * viga — ebaõnnestumine logitakse ja vormi õnnestumine ei sõltu sellest.
 */
export async function sendOpenAiConversion(params: {
  pageUrl: string
  eventId: string
  oppref?: string
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.OPENAI_CONVERSIONS_API_KEY
  if (!apiKey) return { sent: false, error: "OPENAI_CONVERSIONS_API_KEY pole seadistatud" }

  const event = buildOpenAiConversionEvent({
    id: params.eventId,
    timestampMs: Date.now(),
    pageUrl: params.pageUrl,
    oppref: params.oppref,
  })

  try {
    const response = await fetch(EVENTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ validate_only: false, events: [event] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      const body = await response.text().catch(() => "")
      return { sent: false, error: `OpenAI Conversions API ${response.status}: ${body}` }
    }
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Tundmatu viga" }
  }
}
