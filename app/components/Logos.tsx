"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import ScrollAnimation from "./ScrollAnimation"

// w = logo box width in px (default 152). Wide wordmarks get a wider box so
// they render at a comparable visual height to the more compact logos.
// name = the brand as shown in the logo (verified against the image files);
// it feeds the alt text so crawlers/AI can actually read the client list.
const logos: { file: string; name: string; w?: number }[] = [
  { file: "21kool.png", name: "Tallinna XXI Kool" },
  { file: "abakhan.png", name: "Abakhan" },
  { file: "bestair.png", name: "Bestair" },
  { file: "city-motors.png", name: "City Motors", w: 150 },
  { file: "decora.png", name: "Decora" },
  { file: "draudimas.png", name: "Lietuvos Draudimas" },
  { file: "eften.png", name: "Eften Capital" },
  { file: "elering.png", name: "Elering" },
  { file: "ericsson.png", name: "Ericsson" },
  { file: "infoauto.png", name: "Info-Auto" },
  { file: "leibur.png", name: "Leibur" },
  { file: "maxima.png", name: "Maxima" },
  { file: "mustikas.png", name: "Mustikas", w: 100 },
  { file: "mustikas2.png", name: "Mustikas", w: 155 },
  { file: "myfitness.png", name: "MyFitness", w: 150 },
  { file: "Nordichotels.png", name: "Nordic Hotels & Resorts", w: 160 },
  { file: "norma.png", name: "Norma", w: 155 },
  { file: "prike.png", name: "Prike" },
  { file: "proekspert.png", name: "Proekspert", w: 210 },
  { file: "puumarket.png", name: "Puumarket" },
  { file: "ra.png", name: "Rahva Raamat" },
  { file: "rimi.png", name: "Rimi" },
  { file: "sokos.png", name: "Sokos Hotels", w: 220 },
  { file: "storz.png", name: "Karl Storz" },
  { file: "talleks.png", name: "Eesti Talleks" },
  { file: "taltech.png", name: "TalTech" },
  { file: "teledyne.png", name: "Teledyne" },
  { file: "uponor.png", name: "Uponor" },
  { file: "veho.png", name: "Veho" },
  { file: "zoo.png", name: "Tallinna Loomaaed" }
]

function LogoList({ decorative }: { decorative?: boolean }) {
  return (
    <ul
      className="flex items-center gap-0 list-none m-0 p-0"
      aria-hidden={decorative ? "true" : undefined}
    >
      {logos.map((logo, i) => (
        <li
          key={decorative ? `d-${i}` : logo.file}
          className="flex items-center justify-center py-2.5 px-5 sm:px-10 opacity-60 transition-all hover:opacity-90 min-w-[203px] sm:min-w-[270px]"
        >
          <span
            className="relative block h-[85px]"
            style={{ width: logo.w ?? 152 }}
          >
            <Image
              src={`/logod/${logo.file}`}
              alt={decorative ? "" : logo.name}
              fill
              sizes={`${logo.w ?? 152}px`}
              className="object-contain"
            />
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Logos({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("trust")

  const content = (
    <div className="overflow-hidden w-full">
      {/* The marquee needs 3 copies for the seamless loop. Only the first is
          semantic (real alt texts) - the clones are aria-hidden so assistive
          tech and crawlers meet each client name exactly once. */}
      <div className="logo-scroll-track flex items-center gap-0 w-max">
        <LogoList />
        <LogoList decorative />
        <LogoList decorative />
      </div>
      {/* Machine-readable client list (AEO): the logos above are images, so
          the names also exist once as text. Visually hidden, not cloaking -
          it names exactly what the logos show. */}
      <p className="sr-only">{t("clientsList")}</p>
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
