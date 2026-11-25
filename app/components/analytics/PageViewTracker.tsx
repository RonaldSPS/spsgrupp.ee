"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Lightweight cookieless page-view tracker.
 *
 * Sends an anonymous page-view event to our own API on every route change.
 * No cookies, no persistent identifiers, no third-party requests.
 * Works independently of the cookie-consent banner and GTM.
 */
export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const url = window.location.href
    const payload = {
      url,
      locale: document.documentElement.lang || "",
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language || "",
    }

    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" })
    const endpoint = "/api/analytics/pageview"

    // sendBeacon is more reliable for page-unload scenarios; fall back to fetch.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob)
    } else {
      fetch(endpoint, {
        method: "POST",
        body: blob,
        keepalive: true,
      }).catch(() => {
        // Analytics must never affect the user experience.
      })
    }
  }, [pathname])

  return null
}
