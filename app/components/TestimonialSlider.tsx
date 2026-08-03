"use client";

import TestimonialCards, { type TestimonialData } from "./TestimonialCards";

const GAP = 10;

export default function TestimonialSlider({ testimonials }: { testimonials: TestimonialData[] }) {
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
            <TestimonialCards testimonials={[t]} cols={1} />
          </div>
        ))}
      </div>
    </div>
  );
}