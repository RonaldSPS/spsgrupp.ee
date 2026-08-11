"use client";

import { useLocale } from "next-intl";
import TestimonialCards, { type TestimonialData } from "./TestimonialCards";
import type { Locale } from "@/lib/slug-map";

const GAP = 10;

const cardCtaByLocale: Record<Locale, string> = {
  et: "Soovid sama tulemust? Küsi pakkumist",
  en: "Want the same result? Request a quote",
  ru: "Хотите такой же результат? Получите предложение",
};

export default function TestimonialSlider({ testimonials }: { testimonials: TestimonialData[] }) {
  const locale = useLocale() as Locale;
  const duo = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden w-full">
      <div className="testimonial-scroll-track flex items-center w-max" style={{ gap: `${GAP}px` }}>
        {duo.map((t, i) => (
          <div
            key={`${t.author}-${i}`}
            aria-hidden={i >= testimonials.length}
            inert={i >= testimonials.length ? true : undefined}
            data-nosnippet={i >= testimonials.length ? true : undefined}
            tabIndex={i >= testimonials.length ? -1 : undefined}
            className="shrink-0 w-[309px] self-stretch [&>div]:h-full"
          >
            <TestimonialCards testimonials={[t]} cols={1} ctaLabel={cardCtaByLocale[locale]} />
          </div>
        ))}
      </div>
    </div>
  );
}