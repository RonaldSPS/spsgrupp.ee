"use client"

import { GoogleTagManager } from "@next/third-parties/google"
import { useEffect, useState } from "react"

/**
 * Defers the actual gtm.js fetch until after the page has loaded and the
 * browser is idle (with a hard cap). The inline Consent Mode defaults and the
 * gtm.start dataLayer init still run immediately from the server HTML, so
 * queueing/conversions keep working — gtm.js just executes ~0.5–1 s later.
 */
export default function DeferredGoogleTagManager({ gtmId }: { gtmId: string }) {
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (load) return

    const start = () => {
      setLoad(true)
      // Beacon so we can observe the actual load timing in analytics.
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: "gtm_deferred_loaded", t: Date.now() })
    }

    let done = false
    const go = () => {
      if (done) return
      done = true
      cleanup()
      start()
    }
    const onLoad = () => {
      // Wait one idle slice after load so LCP/INP are not competing with gtm.
      window.setTimeout(go, 300)
    }
    const onFirstInteraction = () => go()

    const events = ["pointerdown", "keydown", "touchstart", "scroll"]
    const cleanup = () => {
      window.removeEventListener("load", onLoad)
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction, true))
    }

    if (document.readyState === "complete") {
      onLoad()
    } else {
      window.addEventListener("load", onLoad)
    }
    events.forEach((e) => window.addEventListener(e, onFirstInteraction, { capture: true, passive: true }))

    // Hard fallback: never wait longer than 3 s.
    const t = window.setTimeout(go, 3000)

    return () => {
      window.clearTimeout(t)
      cleanup()
    }
  }, [load])

  if (!load) return null
  return <GoogleTagManager gtmId={gtmId} />
}
