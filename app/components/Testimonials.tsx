"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import TwoToneHeading from "./TwoToneHeading"
import TestimonialCards, { type TestimonialData } from "./TestimonialCards"

const pool: TestimonialData[] = [
  { shortQuote: "Kontor on puhas, korras ja hästi hooldatud.", author: "Paul", initials: "P", logo: "/arvamused-logod/paul.png", quote: "" },
  { shortQuote: "Kontor on puhas ja hooldatud.", author: "Elis", initials: "E", logo: "/arvamused-logod/elis.png", quote: "" },
  { shortQuote: "Kontoriruumid on olnud puhtad ja korras.", author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png", quote: "" },
  { shortQuote: "Puhas ja korrastatud kontor loob parema töökeskkonna.", author: "Kaiti", initials: "K", logo: "/arvamused-logod/kaiti.png", quote: "" },
  { shortQuote: "Lao ja tootmiskoristuse tööd said korrektselt tehtud.", author: "Heigar", initials: "H", logo: "/arvamused-logod/heigar.png", quote: "" },
  { shortQuote: "Nii ladu kui ka kontoriruumid on puhtad ja hästi hooldatud.", author: "Katri", initials: "K", logo: "/arvamused-logod/katri.png", quote: "" },
  { shortQuote: "Koristuse kvaliteet on järjepidevalt kõrgel tasemel.", author: "Heido", initials: "H", logo: "/arvamused-logod/heido.png", quote: "" },
]

const GAP = 10

export default function Testimonials() {
  const t = useTranslations("testimonials")
  const [items] = useState<TestimonialData[]>(() => [...pool])

  const duo = [...items, ...items]

  return (
    <section className="testimonials-section py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {t("sectionTag")}
          </div>
          <TwoToneHeading text={t("heading")} />
        </div>

        <div className="overflow-hidden w-full">
          <div className="testimonial-scroll-track flex items-center w-max" style={{ gap: `${GAP}px` }}>
            {duo.map((t, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[320px] md:w-[309px] self-stretch [&>div]:h-full">
                <TestimonialCards testimonials={[t]} cols={1} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/sps-grupp/arvamused"
            className="inline-flex items-center gap-2 bg-[#17345a] text-white py-3 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors"
          >
            {t("viewAll")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="mt-16 w-full md:w-3/4 mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <video
              src="/SPS-TarmoSildberg.mp4"
              controls
              preload="none"
              poster="/TarmoHero.jpg"
              className="w-full h-auto"
              style={{ borderRadius: "24px" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
