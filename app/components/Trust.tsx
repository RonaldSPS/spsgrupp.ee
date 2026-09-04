"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";
import { localizePath, type Locale } from "@/lib/slug-map";

export default function Trust({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("trust")
  const locale = useLocale() as Locale
  const certificatesAlt = {
    et: "SPS Grupp ISO 9001 ja ISO 14001",
    en: "SPS Grupp ISO 9001 and ISO 14001",
    ru: "SPS Grupp ISO 9001 и ISO 14001",
  }[locale]

  const content = (
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <TwoToneHeading text={t("heading")} />
            <p className="text-[16px] text-[#2f353f] leading-[1.8] mb-7 font-light">
              {t("description")}
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{t("highlight2Title")}</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">ISO 9001 + ISO 14001</div>
                  <div className="text-[15px] text-[#5a6474]">{t("certificates")}</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{t("employees")}</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{t("area")}</div>
                  <div className="text-[15px] text-[#5a6474]">{t("areaDaily")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-[20px] overflow-hidden shadow-lg"
              style={{ height: "460px" }}
            >
              <Image
                src="/9001-14001-ENG.webp"
                alt={certificatesAlt}
                width={640}
                height={460}
                className="w-full h-auto"
                style={{ }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-14 mt-20">
          <div className="section-tag">{t("sectionTag")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/regulaarnekoristusteenus.jpg"
                alt={`${t("regularTitle")} - SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{t("regularTitle")}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {t("regularText")}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{t("regularNote")}</p>
            <Link href={localizePath("/koristusteenus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {t("more")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/puhastusteenused2.jpg"
                alt={`${t("specialTitle")} - SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{t("specialTitle")}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {t("specialText")}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{t("specialNote")}</p>
            <Link href={localizePath("/puhastusteenused", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {t("more")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/valikoristus.jpg"
                alt={`${t("outdoorTitle")} - SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{t("outdoorTitle")}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {t("outdoorText")}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{t("outdoorNote")}</p>
            <Link href={localizePath("/koristusteenus/valikoristus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {t("more")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
  )

  return (
    <section className="trust-section py-[100px] bg-white" id="garantii">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  );
}

