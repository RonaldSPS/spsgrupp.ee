import { canonicalUrl } from "@/lib/url-utils"
import { localizePath } from "@/lib/slug-map"
import type { Locale } from "@/lib/slug-map"

export function renderLdJson(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function generateServiceSchema(
  etPath: string,
  locale: Locale,
  name: string,
  description: string,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${canonicalUrl("/")}#organization` },
    areaServed: ["Tallinn", "Harjumaa"],
    url: canonicalUrl(localizePath(etPath, locale)),
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; etPath: string }>,
  locale: Locale,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(localizePath(item.etPath, locale)),
    })),
  }
}

export function generateFaqSchema(
  items: Array<{ q: string; a: string }>,
): object | null {
  if (items.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}
