"use client";

import Image from "next/image";

export interface TestimonialData {
  quote: string;
  shortQuote: string;
  author: string;
  initials: string;
  logo?: string;
}

interface Props {
  testimonials: TestimonialData[];
  cols?: number;
  ctaLabel?: string;
}

export default function TestimonialCards({ testimonials, cols, ctaLabel = "Soovid sama tulemust? Küsi pakkumist" }: Props) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 border border-[rgba(23,52,90,0.06)] h-full"
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

          {/* Logo row - prominently above author */}
          {t.logo ? (
            <div className="flex justify-center mb-3">
              <div className="h-16 w-[200px] relative flex items-center justify-center">
                <Image
                  src={t.logo}
                  alt={t.author}
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>
            </div>
          ) : null}

          {/* Author row */}
          <div className="flex items-center gap-3">
            {!t.logo ? (
              <div className="w-11 h-11 rounded-full bg-[#eef7fc] flex items-center justify-center text-[15px] font-bold text-[#17345a] shrink-0">
                {t.initials}
              </div>
            ) : null}
            <div className="min-w-0 text-center w-full">
              <div className="text-[15px] font-medium text-[#17345a]">{t.author}</div>
            </div>
          </div>

          <a
            href="#pakkumine"
            className="inline-flex items-center justify-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline mt-4 pt-4 border-t border-[rgba(23,52,90,0.06)] transition-all hover:text-[#17345a] hover:gap-2.5"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
          >
            {ctaLabel} <span aria-hidden="true">→</span>
          </a>
        </div>
      ))}
    </div>
  );
}
