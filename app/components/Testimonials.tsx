"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import TwoToneHeading from "./TwoToneHeading"
import ScrollAnimation from "./ScrollAnimation"
import TestimonialCards, { type TestimonialData } from "./TestimonialCards"
import { localizePath, type Locale } from "@/lib/slug-map"
import { generateReviewsPageSchema, renderLdJson } from "@/lib/json-ld-generator"

export const testimonialPools: Record<Locale, TestimonialData[]> = {
  et: [
    { shortQuote: "Hommikul tuli vastu puhas ja korras kööginurk. Sellised tähelepanelikud teod jäävad silma.", author: "Käthlin", initials: "K", logo: "/arvamused-logod/kathlin.png", quote: "" },
    { shortQuote: "Lao ja tootmiskoristuse tööd said korrektselt tehtud, koostöö sujus hästi ning jäime tulemusega rahule.", author: "Heigar", initials: "H", logo: "/arvamused-logod/heigar.png", quote: "" },
    { shortQuote: "Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.", author: "Tarmo", initials: "T", quote: "" },
    { shortQuote: "Tööd olid läbi mõeldud, korralikult planeeritud ja professionaalselt teostatud.", author: "Juta", initials: "J", logo: "/arvamused-logod/juta.png", quote: "" },
    { shortQuote: "Suhtlus on selge ning vajalikud küsimused saavad lahendatud kiiresti ja professionaalselt.", author: "Renat", initials: "R", logo: "/arvamused-logod/renat.png", quote: "" },
    { shortQuote: "Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea.", author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png", quote: "" },
    { shortQuote: "Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel.", author: "Heido", initials: "H", logo: "/arvamused-logod/heido.png", quote: "" },
  ],
  en: [
    { shortQuote: "In the morning, the kitchen area was clean and tidy. Thoughtful actions like this stand out.", author: "Käthlin", initials: "K", logo: "/arvamused-logod/kathlin.png", quote: "" },
    { shortQuote: "The warehouse and production cleaning was completed properly, cooperation went smoothly and we were pleased with the result.", author: "Heigar", initials: "H", logo: "/arvamused-logod/heigar.png", quote: "" },
    { shortQuote: "Continuous monitoring of cleaning quality helps maintain a clean and pleasant learning environment.", author: "Tarmo", initials: "T", quote: "" },
    { shortQuote: "The work was well considered, properly planned and professionally carried out.", author: "Juta", initials: "J", logo: "/arvamused-logod/juta.png", quote: "" },
    { shortQuote: "Communication is clear, and the necessary questions are resolved quickly and professionally.", author: "Renat", initials: "R", logo: "/arvamused-logod/renat.png", quote: "" },
    { shortQuote: "The office premises have been clean and tidy, and the overall impression is very good.", author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png", quote: "" },
    { shortQuote: "The production, warehouse and office premises have consistently been maintained to a high standard.", author: "Heido", initials: "H", logo: "/arvamused-logod/heido.png", quote: "" },
  ],
  ru: [
    { shortQuote: "Утром кухонная зона была чистой и аккуратной. Такие внимательные поступки не остаются незамеченными.", author: "Käthlin", initials: "K", logo: "/arvamused-logod/kathlin.png", quote: "" },
    { shortQuote: "Уборка склада и производства была выполнена аккуратно, сотрудничество прошло гладко, и мы довольны результатом.", author: "Heigar", initials: "H", logo: "/arvamused-logod/heigar.png", quote: "" },
    { shortQuote: "Постоянный контроль качества уборки помогает поддерживать чистую и приятную учебную среду.", author: "Tarmo", initials: "T", quote: "" },
    { shortQuote: "Работы были хорошо продуманы, тщательно спланированы и профессионально выполнены.", author: "Juta", initials: "J", logo: "/arvamused-logod/juta.png", quote: "" },
    { shortQuote: "Общение понятное, а необходимые вопросы решаются быстро и профессионально.", author: "Renat", initials: "R", logo: "/arvamused-logod/renat.png", quote: "" },
    { shortQuote: "Офисные помещения были чистыми и аккуратными, общее впечатление очень хорошее.", author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png", quote: "" },
    { shortQuote: "Производственные, складские и офисные помещения стабильно содержатся на высоком уровне.", author: "Heido", initials: "H", logo: "/arvamused-logod/heido.png", quote: "" },
  ],
}

const GAP = 10

export default function Testimonials({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("testimonials")
  const locale = useLocale() as Locale
  const items = testimonialPools[locale]
  const cardCta = {
    et: "Soovid sama tulemust? Küsi pakkumist",
    en: "Want the same result? Request a quote",
    ru: "Хотите такой же результат? Получите предложение",
  }[locale]

  // The marquee loop (-50% translate) needs a second copy of the cards.
  // It is cloned into the DOM only after hydration (with aria-hidden/inert),
  // so served HTML contains each review exactly once and no aria-hidden
  // markup at all - crawlers and AI agents always see the full testimonials.
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const originals = Array.from(track.children)
    const clones = originals.map((node) => {
      const clone = node.cloneNode(true) as HTMLElement
      clone.setAttribute("aria-hidden", "true")
      clone.setAttribute("inert", "")
      return clone
    })
    track.append(...clones)
    return () => clones.forEach((clone) => clone.remove())
  }, [])

  // Review schema mirrors the visible cards; TestimonialCards renders 5 stars each.
  const reviewsSchema = generateReviewsPageSchema(
    items.map((item) => ({ author: item.author, text: item.shortQuote || item.quote, ratingValue: 5 })),
  )

  const content = (
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
          <div ref={trackRef} className="testimonial-scroll-track flex items-center w-max" style={{ gap: `${GAP}px` }}>
            {items.map((t, i) => (
              <div
                key={`${t.author}-${i}`}
                className="shrink-0 w-[280px] sm:w-[320px] md:w-[309px] self-stretch [&>div]:h-full"
              >
                <TestimonialCards testimonials={[t]} cols={1} ctaLabel={cardCta} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href={localizePath("/sps-grupp/arvamused", locale)}
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
              poster="/TarmoHero-poster.webp"
              className="w-full h-auto"
              style={{ borderRadius: "24px" }}
            />
          </div>
        </div>
      </div>
  )

  return (
    <section className="testimonials-section py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(reviewsSchema) }} />
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  )
}
