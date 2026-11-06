"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import ScrollAnimation from "./ScrollAnimation"

// w = logo box width in px (default 152). Wide wordmarks get a wider box so
// they render at a comparable visual height to the more compact logos.
const logos: { file: string; w?: number }[] = [
  { file: "21kool.png" },
  { file: "abakhan.png" },
  { file: "bestair.png" },
  { file: "city-motors.png", w: 150 },
  { file: "decora.png" },
  { file: "draudimas.png" },
  { file: "eften.png" },
  { file: "elering.png" },
  { file: "ericsson.png" },
  { file: "infoauto.png" },
  { file: "leibur.png" },
  { file: "maxima.png" },
  { file: "mustikas.png", w: 100 },
  { file: "mustikas2.png", w: 155 },
  { file: "myfitness.png", w: 150 },
  { file: "Nordichotels.png", w: 160 },
  { file: "norma.png", w: 155 },
  { file: "prike.png" },
  { file: "proekspert.png", w: 210 },
  { file: "puumarket.png" },
  { file: "ra.png" },
  { file: "rimi.png" },
  { file: "sokos.png", w: 220 },
  { file: "storz.png" },
  { file: "talleks.png" },
  { file: "taltech.png" },
  { file: "teledyne.png" },
  { file: "uponor.png" },
  { file: "veho.png" },
  { file: "zoo.png" }
]

export default function Logos({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("trust")

  const content = (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <div className="logo-scroll-track flex items-center gap-0 w-max">
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center py-2.5 px-5 sm:px-10 opacity-60 transition-all hover:opacity-90 min-w-[203px] sm:min-w-[270px]"
          >
            <span
              className="relative block h-[85px]"
              style={{ width: logo.w ?? 152 }}
            >
              <Image
                src={`/logod/${logo.file}`}
                alt=""
                fill
                sizes={`${logo.w ?? 152}px`}
                className="object-contain"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="logos-section bg-white border-t border-b border-[rgba(23,52,90,0.05)]" id="kliendid" aria-label={t("clientsAria")}>
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </section>
  )
}
