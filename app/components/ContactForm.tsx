"use client"

import { useActionState, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import TwoToneHeading from "./TwoToneHeading"
import ScrollAnimation from "./ScrollAnimation"
import { submitContactForm } from "@/lib/actions"
import { getCurrentEtPath, localizePath, type Locale } from "@/lib/slug-map"

const initialState = { success: false, error: undefined as string | undefined, fields: undefined as Record<string, string> | undefined }

export default function ContactForm({ animDelay }: { animDelay?: number }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const t = useTranslations("contactForm")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const isRepairPage = getCurrentEtPath(pathname, locale).startsWith("/remonditeenused-tallinnas")
  const privacyPath = localizePath("/andmekaitsetingimused", locale)
  const repairCopy = {
    et: {
      heading: "Aitame leida sobiva lahenduse teie remondi- või hooldustöödele",
      subtitle: "Kirjeldage töö vajadust ja võtame teiega üldjuhul ühe tööpäeva jooksul ühendust.",
    },
    en: {
      heading: "We help find the right solution for your repair or maintenance work",
      subtitle: "Describe the work you need and we will generally contact you within one business day.",
    },
    ru: {
      heading: "Поможем найти подходящее решение для ремонтных или технических работ",
      subtitle: "Опишите необходимую работу, и мы свяжемся с вами, как правило, в течение одного рабочего дня.",
    },
  }[locale]

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  const content = (
      <div className="max-w-[800px] mx-auto px-[5%]">
        <div className="form-card">
          <div className="section-tag mx-auto w-fit">{t("sectionTag")}</div>
          <TwoToneHeading text={isRepairPage ? repairCopy.heading : t("heading")} className="mb-6 text-center" />
          <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
            {isRepairPage ? repairCopy.subtitle : t("subtitle")}
          </p>

          <form ref={formRef} action={formAction}>
            <div hidden aria-hidden="true">
              <label htmlFor="contact-website_url">Website</label>
              <input type="text" id="contact-website_url" name="website_url" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-name" className="text-[15px] font-medium text-[#17345a]">{t("nameLabel")}</label>
                <input
                  id="form-name"
                  name="name"
                  type="text"
                  required
                  maxLength={200}
                  defaultValue={state.fields?.name ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-email" className="text-[15px] font-medium text-[#17345a]">{t("emailLabel")}</label>
                <input
                  id="form-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  defaultValue={state.fields?.email ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-phone" className="text-[15px] font-medium text-[#17345a]">{t("phoneLabel")}</label>
                <input
                  id="form-phone"
                  name="phone"
                  type="tel"
                  required
                  maxLength={30}
                  defaultValue={state.fields?.phone ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder={t("phonePlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="form-company" className="text-[15px] font-medium text-[#17345a]">{t("companyLabel")}</label>
                <input
                  id="form-company"
                  name="company"
                  type="text"
                  maxLength={200}
                  defaultValue={state.fields?.company ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                  placeholder={t("companyPlaceholder")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="form-message" className="text-[15px] font-medium text-[#17345a]">{t("messageLabel")}</label>
              <textarea
                id="form-message"
                name="message"
                required
                maxLength={5000}
                defaultValue={state.fields?.message ?? ""}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                placeholder={t("messagePlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="form-attachment" className="text-[15px] font-medium text-[#17345a]">{t("attachmentLabel")}</label>
              <input
                id="form-attachment"
                name="attachment"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] file:mr-3 file:py-1.5 file:px-3 file:rounded-[8px] file:border-0 file:text-[15px] file:font-medium file:bg-[#17345a] file:text-white file:cursor-pointer hover:file:bg-[#1e4a7a]"
              />
              <p className="text-[15px] text-[#8a94a3] mt-0.5 font-light">{t("attachmentHint")}</p>
            </div>

            <div className="mb-3.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacy_consent"
                  required
                  className="w-4 h-4 mt-0.5 accent-[#17345a] shrink-0"
                />
                <span className="text-[15px] text-[#5a6474]">
                  {t("privacyConsent").split(t("privacyLink"))[0]}
                  <a href={privacyPath} target="_blank" rel="noopener noreferrer" className="text-[#17345a] font-medium underline hover:text-[#3abeff]">
                    {t("privacyLink")}
                  </a>
                  {t("privacyConsent").split(t("privacyLink"))[1] || ""}
                </span>
              </label>
            </div>

            <div aria-live="polite" aria-atomic="true">
              {state?.error && (
                <p className="text-[15px] text-red-600 mb-3.5 font-medium" role="alert">
                  {state.error}
                </p>
              )}
              {state?.success && (
                <p className="text-[15px] text-[#2d9e6b] mb-3.5 font-medium" role="status">
                  {t("successMessage")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#17345a] text-white py-3.5 border-none rounded-[10px] text-[15px] font-medium cursor-pointer transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <span className="relative z-10">{pending ? t("submitting") : t("submitButton")}</span>
            </button>

            <p className="text-center text-[15px] text-[#5a6474] mt-3 flex items-center justify-center gap-1.5 font-light">
              {t("footerNote")}
            </p>
          </form>
        </div>
      </div>
  )

  return (
    <section className="form-section py-[100px] bg-[#eceef1]" id="pakkumine">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  )
}
