"use client"

import Image from "next/image"

const logos = [
  "21kool.png",
  "abakhan.png",
  "bestair.png",
  "city-motors.png",
  "decora.png",
  "draudimas.png",
  "eften.png",
  "elering.png",
  "ericsson.png",
  "infoauto.png",
  "leibur.png",
  "maxima.png",
  "mustikas.png",
  "mustikas2.png",
  "myfitness.png",
  "Nordichotels.png",
  "norma.png",
  "prike.png",
  "proekspert.png",
  "puumarket.png",
  "ra.png",
  "rimi.png",
  "sokos.png",
  "storz.png",
  "talleks.png",
  "taltech.png",
  "teledyne.png",
  "uponor.png",
  "veho.png",
  "zoo.png"
]

export default function Logos() {
  return (
    <section className="logos-section bg-white border-t border-b border-[rgba(23,52,90,0.05)]" id="kliendid" aria-label="Meie kliendid">
      <div className="overflow-hidden w-full" aria-hidden="true">
        <div className="logo-scroll-track flex items-center gap-0 w-max">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center py-2.5 px-5 sm:px-10 opacity-40 transition-all hover:opacity-80 min-w-[120px] sm:min-w-[160px]"
            >
              <span className="relative block h-[50px] w-[90px]">
                <Image
                  src={`/logod/${logo}`}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-contain"
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
