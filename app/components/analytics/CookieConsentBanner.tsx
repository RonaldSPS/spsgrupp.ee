"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useLocale, useTranslations } from "next-intl"
import { localizePath, type Locale } from "@/lib/slug-map"
import { applyConsent, getStoredConsent, storeConsent, type ConsentChoice } from "./consent"

/**
 * Cookie consent banner for Google Consent Mode v2.
 *
 * Hydration-safe: the server snapshot is `null` (banner hidden), so the SSG
 * HTML never contains banner markup; after hydration the stored choice is
 * read from localStorage and the banner appears only when no choice exists.
 * A stored "granted" is re-applied to the dataLayer on every load.
 */

const subscribeNoop = () => () => {}

export default function CookieConsentBanner() {
  const t = useTranslations("cookieConsent")
  const locale = useLocale() as Locale
  const stored = useSyncExternalStore(subscribeNoop, getStoredConsent, () => null)
  const [dismissed, setDismissed] = useState(false)
  const privacyPath = localizePath("/andmekaitsetingimused", locale)

  useEffect(() => {
    if (stored === "granted") {
      applyConsent("granted")
    }
  }, [stored])

  function choose(choice: ConsentChoice) {
    storeConsent(choice)
    applyConsent(choice)
    setDismissed(true)
  }

  if (stored !== null || dismissed) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("message")}
      className="fixed bottom-0 inset-x-0 z-[9999] bg-white border-t border-[rgba(23,52,90,0.12)] shadow-[0_-8px_30px_rgba(23,52,90,0.12)]"
    >
      <div className="max-w-[1200px] mx-auto px-[5%] py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-[15px] text-[#2d3748] font-light flex-1 text-center sm:text-left">
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
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="px-5 py-2.5 rounded-[10px] text-[15px] font-medium text-[#17345a] bg-transparent border border-[rgba(23,52,90,0.25)] cursor-pointer transition-colors hover:bg-[#eceef1]"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="px-5 py-2.5 rounded-[10px] text-[15px] font-medium text-white bg-[#17345a] border-none cursor-pointer transition-colors hover:bg-[#1e4a7a]"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  )
}
