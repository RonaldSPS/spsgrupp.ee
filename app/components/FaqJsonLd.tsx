"use client";

import { useTranslations } from "next-intl";

export default function FaqJsonLd() {
  const t = useTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("faq.items.0.q"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.items.0.a"),
        },
      },
      {
        "@type": "Question",
        "name": t("faq.items.1.q"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.items.1.a"),
        },
      },
      {
        "@type": "Question",
        "name": t("faq.items.4.q"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.items.4.a"),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
