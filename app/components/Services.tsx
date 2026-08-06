"use client"

import { useTranslations } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";

export default function Services({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("services")

  const scrollToForm = () => {
    const el = document.getElementById("pakkumine")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const content = (
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="mb-12 max-w-[800px] mx-auto">
          <div className="mb-[20px]">
            <TwoToneHeading text={t("heading")} className="text-center" />
          </div>
          <div className="text-[16px] text-[#333a46] leading-[1.3]">
            <div className="mb-[calc(var(--spacing)*2)] flex gap-5">
              <span className="text-[62px] font-bold text-[#85cbe94d] leading-none shrink-0">01</span>
              <p>{t("para1")}</p>
            </div>
            <div className="mb-[calc(var(--spacing)*2)] flex gap-5">
              <span className="text-[62px] font-bold text-[#85cbe94d] leading-none shrink-0">02</span>
              <p>{t("para2")}</p>
            </div>
            <div className="mb-[calc(var(--spacing)*2)] flex gap-5">
              <span className="text-[62px] font-bold text-[#85cbe94d] leading-none shrink-0">03</span>
              <p>{t("para3")}</p>
            </div>
            <div className="mb-[calc(var(--spacing)*2)] flex gap-5">
              <span className="text-[62px] font-bold text-[#85cbe94d] leading-none shrink-0">04</span>
              <p>{t("para4")}</p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={scrollToForm}
              className="btn-primary text-[15px] py-2.5 px-4"
            >
              {t("ctaButton")}
            </button>
          </div>
        </div>
      </div>
  )

  return (
    <section className="services-section py-[100px] bg-white" id="teenused">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  );
}
