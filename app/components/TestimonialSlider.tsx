"use client";

import { useEffect, useRef } from "react";
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
  // The marquee loop (-50% translate) needs a second copy of the cards.
  // It is cloned into the DOM only after hydration (with
  // aria-hidden/inert/data-nosnippet), so served HTML contains each review
  // exactly once and no aria-hidden markup - crawlers and AI agents always
  // see the full testimonials.
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const originals = Array.from(track.children);
    const clones = originals.map((node) => {
      const clone = node.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("inert", "");
      clone.setAttribute("data-nosnippet", "");
      clone.querySelectorAll("a, button, [tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));
      return clone;
    });
    track.append(...clones);
    return () => clones.forEach((clone) => clone.remove());
  }, []);

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="testimonial-scroll-track flex items-center w-max" style={{ gap: `${GAP}px` }}>
        {testimonials.map((t, i) => (
          <div
            key={`${t.author}-${i}`}
            className="shrink-0 w-[309px] self-stretch [&>div]:h-full"
          >
            <TestimonialCards testimonials={[t]} cols={1} ctaLabel={cardCtaByLocale[locale]} />
          </div>
        ))}
      </div>
    </div>
  );
}
