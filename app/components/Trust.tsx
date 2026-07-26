"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";
import { localizePath, type Locale } from "@/lib/slug-map";

export default function Trust() {
  const t = useTranslations("trust")
  const locale = useLocale() as Locale
  const copy = {
    et: {
      years: "Alates 2006",
      experience: "Kogemust",
      employees: "300+ töötajat",
      trained: "Koolitatud",
      area: "Üle 1 000 000 m²",
      areaLabel: "Meie hoolduses",
      regularTitle: "Regulaarne koristusteenus",
      regularText: "Igapäevane ja perioodiline hooldus, mis hoiab teie tööruumid pidevalt puhtad ja esinduslikud.",
      regularNote: "Teenuse osutamiseks vajalikud tavapärased puhastus- ja töövahendid sisalduvad pakkumises vastavalt kokkulepitud teenusemahule.",
      specialTitle: "Puhastusteenused ja eritööd",
      specialText: "Perioodilised ja spetsiifilised tööd, mis taastavad pindade seisukorra ja pikendavad nende eluiga.",
      specialNote: "Operatiivne reageerimine kokkulepitud teenuste raames.",
      outdoorTitle: "Välikoristus ja territooriumi hooldus",
      outdoorText: "Hooldame teie hoone ümbrust aastaringselt, igal hooajal oma plaaniga.",
      outdoorNote: "Soovi korral koondame hooajalised välitööd ühe teenuslepingu alla.",
      more: "Vaata lähemalt",
    },
    en: {
      years: "Since 2006",
      experience: "Experience",
      employees: "300+ employees",
      trained: "Trained",
      area: "Over 1,000,000 m²",
      areaLabel: "Under our care",
      regularTitle: "Regular cleaning",
      regularText: "Daily and periodic maintenance that keeps your workplace consistently clean and presentable.",
      regularNote: "Standard cleaning products and tools required for the agreed service scope are included in the quote.",
      specialTitle: "Specialist cleaning",
      specialText: "Periodic and specialist work that restores surfaces and helps extend their service life.",
      specialNote: "Operational response within the scope of agreed services.",
      outdoorTitle: "Outdoor cleaning and grounds care",
      outdoorText: "We maintain the surroundings of your building year-round with a plan for every season.",
      outdoorNote: "Seasonal outdoor work can be combined under one service agreement if requested.",
      more: "Learn more",
    },
    ru: {
      years: "С 2006 года",
      experience: "Опыта",
      employees: "300+ сотрудников",
      trained: "Обучены",
      area: "Более 1 000 000 м²",
      areaLabel: "На нашем обслуживании",
      regularTitle: "Регулярная уборка",
      regularText: "Ежедневное и периодическое обслуживание, благодаря которому рабочие помещения остаются чистыми и презентабельными.",
      regularNote: "Стандартные чистящие средства и инвентарь для согласованного объёма услуг включаются в предложение.",
      specialTitle: "Специализированная уборка",
      specialText: "Периодические и специальные работы, восстанавливающие состояние поверхностей и продлевающие срок их службы.",
      specialNote: "Оперативное реагирование в рамках согласованных услуг.",
      outdoorTitle: "Наружная уборка и уход за территорией",
      outdoorText: "Круглый год ухаживаем за территорией вокруг здания по сезонному плану.",
      outdoorNote: "По желанию сезонные наружные работы можно объединить в одном договоре обслуживания.",
      more: "Подробнее",
    },
  }[locale]

  return (
    <section className="trust-section py-[100px] bg-white" id="garantii">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{t("highlight1Title")}</div>
                  <div className="text-[15px] text-[#5a6474]">ISO 9001 + ISO 14001</div>
                </div>
              </div>
              <div className="trust-badge-card hover:-translate-y-0.5">
                <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="w-[22px] h-[22px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{copy.years}</div>
                  <div className="text-[15px] text-[#5a6474]">{copy.experience}</div>
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
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{copy.employees}</div>
                  <div className="text-[15px] text-[#5a6474]">{copy.trained}</div>
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
                  <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{copy.area}</div>
                  <div className="text-[15px] text-[#5a6474]">{copy.areaLabel}</div>
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
                alt="SPS Grupp ISO 9001 ja ISO 14001"
                width={640}
                height={460}
                className="w-full h-auto"
                style={{ }}
              />
            </div>

            <div
              className="absolute -bottom-6 left-0 right-0 md:-left-6 md:right-6 bg-white rounded-4xl p-4 md:p-6 flex flex-col sm:flex-row gap-3 md:gap-4 shadow-md border border-[rgba(23,52,90,0.06)]"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              <div className="flex items-center gap-2.5 bg-[#eef7fc] border border-[rgba(133,203,233,0.25)] rounded-[10px] px-3.5 py-2.5 flex-1 md:min-w-[140px]">
                <div className="w-9 h-9 bg-[#17345a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="w-[18px] h-[18px] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#17345a]">{t("highlight2Title")}</div>
                </div>
              </div>
              {t("highlight2Cta") && (
                <div className="flex items-center gap-2.5 bg-[#eef7fc] border border-[rgba(133,203,233,0.25)] rounded-[10px] px-3.5 py-2.5 flex-1 md:min-w-[140px]">
                  <div className="w-9 h-9 bg-[#17345a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="w-[18px] h-[18px] text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#17345a]">{t("highlight2Cta")}</div>
                  </div>
                </div>
              )}
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
                alt={`${copy.regularTitle} — SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{copy.regularTitle}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {copy.regularText}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{copy.regularNote}</p>
            <Link href={localizePath("/koristusteenus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {copy.more} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/puhastusteenused2.jpg"
                alt={`${copy.specialTitle} — SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{copy.specialTitle}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {copy.specialText}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{copy.specialNote}</p>
            <Link href={localizePath("/puhastusteenused", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {copy.more} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/valikoristus.jpg"
                alt={`${copy.outdoorTitle} — SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">{copy.outdoorTitle}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {copy.outdoorText}
            </p>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">{copy.outdoorNote}</p>
            <Link href={localizePath("/koristusteenus/valikoristus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {copy.more} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
