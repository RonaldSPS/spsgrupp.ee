"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"

export interface CaseStudySlide {
  slug: string
  title: string
  excerpt: string
  clientName: string
  clientLogo: string
  objectType: string
  keyStat: string
  heroImage: string
  heroImageAlt: string
}

/**
 * Avalehe kliendilugude slider - horisontaalne scroll-snap rida + nooled.
 * Kaardil on alati kujutis (heroImage = pildikoht; admin saab vahetada).
 */
export default function CaseStudiesSlider({ stories }: { stories: CaseStudySlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>("[data-slide]")
    const step = card ? card.offsetWidth + 24 : 360
    track.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  return (
    <section aria-label="Kliendilood" className="py-[64px] bg-[#f8fafc]">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#17345a] m-0">Kliendilood</h2>
            <p className="text-[16px] text-[#5a6474] mt-2 mb-0 max-w-[620px]">
              Päris objektid, päris graafikud, mõõdetavad tulemused - vaata, kuidas me oma klientide koristust korraldame.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/kliendilood/"
              className="hidden sm:inline-block text-[15px] font-medium text-[#1e4a7a] no-underline hover:text-[#3abeff] mr-2"
            >
              Kõik kliendilood →
            </Link>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Eelmine kliendilugu"
              className="w-11 h-11 rounded-full border border-[rgba(23,52,90,0.15)] bg-white text-[#17345a] hover:bg-[#17345a] hover:text-white transition-colors flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Järgmine kliendilugu"
              className="w-11 h-11 rounded-full border border-[rgba(23,52,90,0.15)] bg-white text-[#17345a] hover:bg-[#17345a] hover:text-white transition-colors flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]"
        >
          {stories.map((s) => (
            <Link
              key={s.slug}
              data-slide
              href={"/kliendilood/" + s.slug}
              className="group snap-start shrink-0 w-[86%] sm:w-[47%] lg:w-[31.5%] rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all no-underline"
            >
              <div className="relative h-[190px] bg-[#eef7fc]">
                <Image src={s.heroImage} alt={s.heroImageAlt} fill className="object-cover" sizes="(max-width: 640px) 86vw, (max-width: 1024px) 47vw, 400px" />
                <span className="absolute top-3 left-3 bg-[#17345a]/90 text-white text-[15px] font-medium px-3 py-1 rounded-full">
                  {s.objectType}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {s.clientLogo && (
                    <span className="relative w-[46px] h-[46px] rounded-full bg-white border border-[rgba(23,52,90,0.08)] overflow-hidden shrink-0 flex items-center justify-center">
                      <Image src={s.clientLogo} alt={s.clientName} fill className="object-contain p-1.5" sizes="46px" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-[#17345a] truncate">{s.clientName}</div>
                    <div className="text-[15px] text-[#5a6474]">{s.keyStat}</div>
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-[#17345a] leading-snug m-0 line-clamp-2 group-hover:text-[#3abeff] transition-colors">
                  {s.title}
                </h3>
                <span className="inline-block mt-3 text-[15px] font-medium text-[#1e4a7a] group-hover:text-[#3abeff]">
                  Loe kliendilugu →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
