"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";

const industryKeys = ["office", "retail", "industrial", "hospitality", "healthcare", "education"] as const

const industryImages = [
  "/images/industries/kontorid-1600x920.webp",
  "/images/industries/kaubanduskeskused-1600x920.webp",
  "/tootmishoonete-koristus.webp",
  "/images/industries/hotellid-1600x920.webp",
  "/desinfitseerimine-1.jpg",
  "/koolide-koristamine4.jpg",
]

export default function Industries({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("industries")
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSetActive = (index: number) => {
    if (index !== active && !isAnimating) {
      setPrevActive(active);
      setActive(index);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (!isAnimating) {
        setPrevActive(active);
        setActive((prev) => (prev + 1) % industryKeys.length);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAnimating, active, isHovered]);

  const content = (
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-12 items-end mb-12">
          <div>
            <div className="section-tag">{t("sectionTag")}</div>
            <TwoToneHeading text={t("heading")} />
          </div>
          <p className="text-[17px] text-[#2f353f] leading-[1.8] font-light lg:pb-2">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="hidden md:flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {industryKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSetActive(i)}
                className={`industry-btn min-w-[240px] md:min-w-0 ${active === i ? "active" : ""}`}
              >
                <span className="industry-btn-title">{t(`${key}.title`)}</span>
                <span className="industry-btn-sub">{t(`${key}.subtitle`)}</span>
              </button>
            ))}
          </div>

          <div className="relative rounded-[8px] overflow-hidden min-h-[470px] bg-[#17345a]">
            <div className="absolute inset-0">
              <Image
                src={industryImages[prevActive]}
                alt={t(`${industryKeys[prevActive]}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                style={{  }}
              />
            </div>

            <div key={active} className={`absolute inset-0 ${isAnimating ? "animate-slide-over" : ""}`}>
              <Image
                src={industryImages[active]}
                alt={t(`${industryKeys[active]}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                style={{  }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f33]/88 via-[#0f1f33]/22 to-transparent pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 p-6 md:p-9">
              <span className="inline-flex bg-white/18 backdrop-blur-[8px] px-3.5 py-1.5 rounded-full text-[15px] font-semibold text-white mb-4">
                {t(`${industryKeys[active]}.badge`)}
              </span>
              <h3 className="text-[30px] md:text-[38px] leading-[1.12] font-bold text-white mb-4">
                {t(`${industryKeys[active]}.title`)}
              </h3>
              <p className="text-[17px] text-white/88 leading-[1.7] max-w-[620px]">
                {t(`${industryKeys[active]}.text`)}
              </p>
            </div>
          </div>
        </div>
      </div>
  )

  return (
    <section
      className="industries-section py-[100px] bg-white"
      id="valdkonnad"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  );
}
