"use client"

import { useActionState, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import TwoToneHeading from "./TwoToneHeading"
import { submitCareerForm } from "@/lib/actions"
import { localizePath, type Locale } from "@/lib/slug-map"

const initialState = { success: false, error: undefined as string | undefined, fields: undefined as Record<string, string> | undefined }

export default function CareerForm() {
  const t = useTranslations("careerForm")
  const locale = useLocale() as Locale
  const [state, formAction, pending] = useActionState(submitCareerForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const privacyPath = localizePath("/andmekaitsetingimused", locale)
  const workTimeOptions = [
    { value: "day", label: t("workTimeDay") },
    { value: "evening", label: t("workTimeEvening") },
    { value: "night", label: t("workTimeNight") },
    { value: "any", label: t("workTimeAny") },
  ]

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  return (
    <section className="form-section py-[100px] bg-[#eceef1]" id="pakkumine">
      <div className="max-w-[800px] mx-auto px-[5%]">
        <div className="form-card">
          <div className="section-tag mx-auto w-fit">{t("sectionTag")}</div>
          <TwoToneHeading text={t("heading")} className="mb-6 text-center" />
          <p className="text-[15px] text-[#5a6474] mb-6 font-light text-center">
            {t("subtitle")}
          </p>

          <form ref={formRef} action={formAction}>
            <div hidden aria-hidden="true">
              <label htmlFor="career-website_url">Website</label>
              <input type="text" id="career-website_url" name="website_url" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="career-name" className="text-[15px] font-medium text-[#17345a]">{t("nameLabel")}</label>
                <input
                  id="career-name"
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
                <label htmlFor="career-email" className="text-[15px] font-medium text-[#17345a]">{t("emailLabel")}</label>
                <input
                  id="career-email"
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
                <label htmlFor="career-phone" className="text-[15px] font-medium text-[#17345a]">{t("phoneLabel")}</label>
                <input
                  id="career-phone"
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
                <label htmlFor="career-region" className="text-[15px] font-medium text-[#17345a]">{t("regionLabel")}</label>
                <select
                  id="career-region"
                  name="region"
                  required
                  defaultValue={state.fields?.region ?? ""}
                  className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)]"
                >
                  <option value="">{t("regionPlaceholder")}</option>
                  <option value="Tallinn">{t("regionTallinn")}</option>
                  <option value="Harjumaa">{t("regionHarjumaa")}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <span className="text-[15px] font-medium text-[#17345a]">{t("workloadLabel")}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workload"
                    value="full"
                    required
                    defaultChecked={state.fields?.workload === "full"}
                    className="w-5 h-5 accent-[#17345a] shrink-0"
                  />
                  <span className="text-[15px] text-[#2f353f]">{t("workloadFull")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workload"
                    value="part"
                    required
                    defaultChecked={state.fields?.workload === "part"}
                    className="w-5 h-5 accent-[#17345a] shrink-0"
                  />
                  <span className="text-[15px] text-[#2f353f]">{t("workloadPart")}</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <span className="text-[15px] font-medium text-[#17345a]">{t("workTimeLabel")}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workTimeOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer min-h-[44px] rounded-lg border border-[rgba(23,52,90,0.12)] px-3 py-2 bg-white">
                    <input
                      type="radio"
                      name="work_time"
                      value={option.value}
                      required
                      defaultChecked={state.fields?.workTime === option.value}
                      className="w-5 h-5 accent-[#17345a] shrink-0"
                    />
                    <span className="text-[15px] text-[#2f353f]">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.25 mb-3.5">
              <label htmlFor="career-info" className="text-[15px] font-medium text-[#17345a]">{t("infoLabel")}</label>
              <textarea
                id="career-info"
                name="info"
                maxLength={5000}
                defaultValue={state.fields?.info ?? ""}
                className="px-3 py-2.75 border border-[rgba(23,52,90,0.12)] rounded-[10px] text-[15px] text-[#2d3748] bg-white outline-none transition-all focus:border-[#5ab5da] focus:shadow-[0_0_0_3px_rgba(133,203,233,0.15)] resize-y min-h-[90px]"
                placeholder={t("infoPlaceholder")}
              />
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

          <div className="mt-8 pt-6 border-t border-[rgba(23,52,90,0.1)] text-center">
            <p className="text-[15px] text-[#5a6474] font-light">
              {t("cvNote")}{" "}
              <a href="mailto:personal@spsgrupp.ee" className="text-[#17345a] font-medium no-underline hover:underline">
                personal@spsgrupp.ee
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
