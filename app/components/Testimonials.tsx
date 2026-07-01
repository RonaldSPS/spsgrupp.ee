"use client";

import Image from "next/image";
import TwoToneHeading from "./TwoToneHeading";

const testimonials = [
  {
    quote: "Oleme väga rahul, kuidas meil toimetab tänane koristaja SPS'ist ja loodame, et ta jätkab oma tööd sama hästi.",
    shortQuote: "Oleme väga rahul, kuidas meil toimetab koristaja SPS'ist. Võrreldes eelmiste teenusepakkujatega nagu öö ja päev.",
    author: "Teledyne Flir",
    location: "Tallinn",
    initials: "TF",
    logo: "/logod/teledyne.png",
  },
  {
    quote: "Tahame kiita puhastusteenindajat. Võrreldes eelmiste teenusepakkujatega nagu öö ja päev! Viisakad & positiivsed. Ning WC-s on ka nüüd kõik tarvikud olemas.",
    shortQuote: "Tahame kiita puhastusteenindajat. Viisakad & positiivsed. Ning WC-s on kõik tarvikud olemas.",
    author: "Maiki Nautras",
    location: "General Services Specialist, AS Norma",
    initials: "M",
    logo: "/arvamused-logod/maiki.png",
  },
  {
    quote: "SPS Grupp on professionaalne ja kiire reageerimisvõimega partner. Kontoripinnad on puhtad ja esinduslikud.",
    shortQuote: "SPS Grupp on professionaalne ja kiire reageerimisvõimega partner. Kontoripinnad on puhtad ja esinduslikud.",
    author: "Ericsson",
    location: "Tallinn",
    initials: "ER",
    logo: "/logod/ericsson.png",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Klientide tagasiside
          </div>
          <TwoToneHeading text="Mida ütlevad meie kliendid" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 border border-[rgba(23,52,90,0.06)]"
              style={{
                boxShadow: "0 4px 24px rgba(23,52,90,0.10)",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div className="flex gap-[3px] mb-4 text-[#f59e0b]">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-[15px]">★</span>
                ))}
              </div>
              <p className="text-[15px] leading-[1.8] text-[#2d3748] mb-5 font-light italic flex-1">
                &quot;{t.shortQuote}&quot;
              </p>

              <div className="flex justify-center mb-3">
                <div className="h-20 flex items-center justify-center">
                  <Image
                    src={t.logo}
                    alt={t.author}
                    width={240}
                    height={80}
                    className="object-contain max-h-20 w-auto"
                    style={{ maxWidth: "240px" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="min-w-0 text-center w-full">
                  <div className="text-[15px] font-medium text-[#17345a]">{t.author}</div>
                  <div className="text-[15px] text-[#5a6474]">{t.location}</div>
                </div>
              </div>

              <a
                href="#pakkumine"
                className="inline-flex items-center justify-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline mt-4 pt-4 border-t border-[rgba(23,52,90,0.06)] transition-all hover:text-[#17345a] hover:gap-2.5"
                onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Soovid sama tulemust? Küsi pakkumist <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Video section */}
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
  );
}
