"use client"

import { useEffect } from "react"
import { captureAttribution } from "./attribution"

/**
 * Stamps the session's attribution evidence (gclid/UTM/landing referrer) into
 * sessionStorage on the first pageview. Mounted site-wide from the root shell
 * and deliberately NOT gated on GTM: this is our own first-party measurement,
 * so it must also run for visitors who decline the cookie banner - otherwise
 * their form submissions would lose the "came from an ad" signal.
 * Renders nothing, so SSR HTML is unaffected.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
