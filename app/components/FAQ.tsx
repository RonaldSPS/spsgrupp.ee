"use client";

import { useState } from "react";
import { useLocale, useTranslations, useMessages } from "next-intl";
import { usePathname } from "next/navigation";
import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";
import { getCurrentEtPath, type Locale } from "@/lib/slug-map";
import { renderLdJson } from "@/lib/json-ld-generator";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ({ items, animDelay }: { items?: FAQItem[]; animDelay?: number }) {
  const t = useTranslations("faq")
  const messages = useMessages()
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const isRepairPage = getCurrentEtPath(pathname, locale).startsWith("/remonditeenused-tallinnas")
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const repairDescription = {
    et: "Vastame kõige levinumatele küsimustele remonditeenuste kohta.",
    en: "Answers to the most common questions about repair services.",
    ru: "Ответы на самые распространённые вопросы о ремонтных услугах.",
  }[locale]

  const msgItems = ((messages as Record<string, unknown>).faq as { items: FAQItem[] })?.items || []
  const faq = items ?? msgItems
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }

  const content = (
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Sidebar */}
          <div>
            <TwoToneHeading text={t("heading")} />
            <p className="text-[15px] text-[#2f353f] leading-[1.7] mb-6 font-light">
              {isRepairPage ? repairDescription : t("description")}
            </p>
            <a
              href="#pakkumine"
              className="inline-flex items-center gap-2 bg-[#17345a] text-white py-2.5 px-5 rounded-[10px] text-[15px] font-medium no-underline transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5"
              style={{ boxShadow: "0 2px 12px rgba(23,52,90,0.07)" }}
            >
              {t("cta")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* FAQ List */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            {faq.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openIndex === i ? "open" : ""}`}
              >
                <button
                  className="faq-question w-full text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="text-[15px] font-medium text-[#17345a] flex-1">
                    {item.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                    style={{ background: openIndex === i ? "#85cbe9" : "#eef7fc" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className="overflow-hidden transition-all"
                  hidden={openIndex !== i}
                  style={{
                    maxHeight: openIndex === i ? "300px" : "0",
                    padding: openIndex === i ? "0 22px 20px" : "0 22px",
                  }}
                >
                  <p className="text-[15px] text-[#2f353f] leading-[1.8] font-light">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(faqLd) }} />
      <section className="faq-section py-[100px] bg-white" id="kkk">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
    </>
  );
}
