"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ScrollAnimation from "./ScrollAnimation";
import { localizePath, type Locale } from "@/lib/slug-map";

export default function ServiceColumns({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("trust")
  const locale = useLocale() as Locale

  const content = (
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">{t("sectionTag")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          <div className="service-column-card md:col-span-3">
            <div className="w-full h-[220px] md:h-[340px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src="/regulaarnekoristusteenus.jpg"
                alt={`${t("regularTitle")} - SPS Grupp`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                style={{ }}
              />
            </div>
            <h3 className="text-[38px] font-bold text-[#17345a] leading-[1.15] tracking-[-0.5px] mb-4">{t("regularTitle")}</h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              {t("regularText")}
            </p>
            <p className="text-[15px] text-[#5ab5da] font-medium mb-4">{t("regularNote")}</p>
            <Link href={localizePath("/koristusteenus/hoolduskoristus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              {t("more")} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="service-column-card flex-1">
              <div className="flex items-center gap-5 mb-5">
                <div className="w-[130px] h-[96px] relative overflow-hidden rounded-xl flex-shrink-0">
                  <Image
                    src="/puhastusteenused2.jpg"
                    alt={`${t("specialTitle")} - SPS Grupp`}
                    fill
                    sizes="130px"
                    className="object-cover"
                    style={{ }}
                  />
                </div>
                <h3 className="text-[18px] font-bold text-[#17345a]">{t("specialTitle")}</h3>
              </div>
              <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
                {t("specialText")}
              </p>
              <p className="text-[15px] text-[#5ab5da] font-medium mb-4">{t("specialNote")}</p>
              <Link href={localizePath("/puhastusteenused", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
                {t("more")} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="service-column-card flex-1">
              <div className="flex items-center gap-5 mb-5">
                <div className="w-[130px] h-[96px] relative overflow-hidden rounded-xl flex-shrink-0">
                  <Image
                    src="/valikoristus.jpg"
                    alt={`${t("outdoorTitle")} - SPS Grupp`}
                    fill
                    sizes="130px"
                    className="object-cover"
                    style={{ }}
                  />
                </div>
                <h3 className="text-[18px] font-bold text-[#17345a]">{t("outdoorTitle")}</h3>
              </div>
              <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
                {t("outdoorText")}
              </p>
              <p className="text-[15px] text-[#5ab5da] font-medium mb-4">{t("outdoorNote")}</p>
              <Link href={localizePath("/koristusteenus/valikoristus", locale)} className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
                {t("more")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
  )

  return (
    <section className="service-columns-section py-[80px] bg-white">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  );
}
