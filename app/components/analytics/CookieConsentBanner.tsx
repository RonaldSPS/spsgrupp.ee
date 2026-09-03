"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useLocale, useTranslations } from "next-intl"
import { localizePath, type Locale } from "@/lib/slug-map"
import {
  applyConsent,
  getStoredConsent,
  pushConsentEvent,
  storeConsent,
  type ConsentChoice,
} from "./consent"

/**
 * Cookie consent banner for Google Consent Mode v2.
 *
 * Hydration-safe: the server snapshot is `null` (banner hidden), so the SSG
 * HTML never contains banner markup; after hydration the stored choice is
 * read from localStorage and the banner appears only when no choice exists.
 * A stored choice is re-applied to the dataLayer on every load.
 *
 * Fires consent_banner_shown / consent_accept / consent_decline dataLayer
 * events (see consent.ts) so the accept/decline rate is measurable in GA4.
 */

const subscribeNoop = () => () => {}

export default function CookieConsentBanner() {
  const t = useTranslations("cookieConsent")
  const locale = useLocale() as Locale
  const stored = useSyncExternalStore(subscribeNoop, getStoredConsent, () => null)
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const shownTracked = useRef(false)
  const privacyPath = localizePath("/andmekaitsetingimused", locale)

  // Re-apply a stored choice on every load.
  useEffect(() => {
    if (stored !== null) {
      applyConsent(stored)
    }
  }, [stored])

  const show = stored === null && !dismissed

  // Slide-in on mount + one-time "shown" funnel event.
  useEffect(() => {
    if (!show) return
    const frame = requestAnimationFrame(() => setVisible(true))
    if (!shownTracked.current) {
      shownTracked.current = true
      pushConsentEvent("consent_banner_shown", locale)
    }
    return () => cancelAnimationFrame(frame)
  }, [show, locale])

  function choose(choice: ConsentChoice) {
    storeConsent(choice)
    applyConsent(choice)
    pushConsentEvent(choice === "granted" ? "consent_accept" : "consent_decline", locale)
    setDismissed(true)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("message")}
      className={`fixed z-[9999] inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-[420px] bg-white border border-[rgba(23,52,90,0.12)] rounded-[14px] shadow-[0_12px_40px_rgba(23,52,90,0.18)] transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="px-5 py-4 flex flex-col gap-4">
        <p className="text-[15px] leading-[1.5] text-[#2d3748] font-light">
          {t("message")}{" "}
          <a
            href={privacyPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#17345a] font-medium underline hover:text-[#3abeff]"
          >
            {t("privacyLink")}
          </a>
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 px-5 py-2.5 rounded-[10px] text-[15px] font-medium text-white bg-[#17345a] cursor-pointer transition-colors hover:bg-[#1e4a7a]"
          >
            {t("acceptAll")}
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="px-2 py-2.5 text-[15px] font-normal text-[#6b7280] underline decoration-[rgba(107,114,128,0.5)] underline-offset-4 bg-transparent border-none cursor-pointer transition-colors hover:text-[#17345a]"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  )
}
