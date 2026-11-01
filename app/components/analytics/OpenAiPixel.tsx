"use client"

import { useEffect } from "react"
import { OPENAI_PIXEL_ID } from "@/lib/openai-ads"

/**
 * Ajutine ChatGPT Ads jälgimispiksel (test alates 01.11.2026). Laadib oaiq
 * SDK ja käivitab init'i — kliendi antud seadistuskood, debug:true on
 * testperioodil tahtlik (konsoolis näha, et piksel töötab).
 *
 * Renderdatakse root-shell'is (mitte /spsadmn/ ega Vercel preview'des);
 * CSP lubab bzrcdn.openai.com / bzr.openai.com (proxy.ts). Konversiooni-
 * sündmuse saadab trackOpenAiConversion() (form-conversion.ts).
 */
export default function OpenAiPixel() {
  useEffect(() => {
    if (window.oaiq) return
    const q = ((...args: unknown[]) => {
      q.q.push(args)
    }) as Window["oaiq"] & object
    q.q = []
    window.oaiq = q
    const j = document.createElement("script")
    j.async = true
    j.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js"
    const f = document.getElementsByTagName("script")[0]
    ;(f?.parentNode ?? document.head).insertBefore(j, f ?? null)
    window.oaiq("init", { pixelId: OPENAI_PIXEL_ID, debug: true })
  }, [])
  return null
}
