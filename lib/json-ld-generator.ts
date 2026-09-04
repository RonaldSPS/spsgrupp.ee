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
  priceCards?: PriceCardInput[],
): object {
  const offers = priceCards ? generateServiceOffers(priceCards) : undefined
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${canonicalUrl("/")}#organization` },
    areaServed: ["Tallinn", "Harjumaa"],
    url: canonicalUrl(localizePath(etPath, locale)),
    ...(offers ? { offers } : {}),
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

/* ------------------------------------------------------------------ */
/* Reviews / ratings                                                   */
/* ------------------------------------------------------------------ */

export interface ReviewInput {
  author: string
  text: string
  /** Star rating shown next to the review in the UI (TestimonialCards renders 5). */
  ratingValue: number
}

export function generateReviewSchema({ author, text, ratingValue }: ReviewInput): object {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: author },
    reviewBody: text,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    // Required by Google for review snippets: every review rates the
    // organization (links to the root-shell Organization node by @id).
    itemReviewed: { "@id": `${canonicalUrl("/")}#organization` },
  }
}

export function generateAggregateRatingSchema(ratingValue: number, reviewCount: number): object {
  return {
    "@type": "AggregateRating",
    ratingValue: Number(ratingValue.toFixed(1)),
    bestRating: 5,
    worstRating: 1,
    reviewCount,
  }
}

/**
 * Review graph for the testimonials page: per-review nodes plus an
 * Organization node (merged by @id) carrying the aggregate rating.
 */
export function generateReviewsPageSchema(reviews: ReviewInput[]): object {
  const count = reviews.length
  const avg = count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.ratingValue, 0) / count
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonicalUrl("/")}#organization`,
        aggregateRating: generateAggregateRatingSchema(avg, count),
      },
      ...reviews.map(generateReviewSchema),
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Service offers (pricing)                                            */
/* ------------------------------------------------------------------ */

export interface PriceCardInput {
  size: string
  area: string
  price: string
  period: string
  highlight?: boolean
}

/** Parse a localized price card ("2 €/m²", "1,20 €/m²", "al. 180 €/kuu",
 *  "from 350 EUR per month", "от 250 EUR") into a numeric min price + unit.
 *  Unit is read from the price string and period only - the area field
 *  describes the size tier ("up to 1 m²"), not the price unit. */
export function parsePriceCard(card: PriceCardInput): { minPrice: number; unitText?: string } | null {
  const m = card.price.match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return null
  const value = Number(m[1].replace(",", "."))
  if (!Number.isFinite(value) || value <= 0) return null

  const haystack = `${card.price} ${card.period}`.toLowerCase()
  if (haystack.includes("m²")) return { minPrice: value, unitText: "per m²" }
  if (/kuu|month|месяц/.test(haystack)) return { minPrice: value, unitText: "per month" }
  if (/h\b|tunnid|tund|hour|час\b/.test(haystack)) return { minPrice: value, unitText: "per hour" }
  return { minPrice: value }
}

/** The highlighted card is the representative offer; fall back to the lowest
 *  parseable card when the highlighted one has no numeric price. */
export function generateServiceOffers(cards: PriceCardInput[]): object | undefined {
  if (!cards || cards.length === 0) return undefined
  const highlighted = cards.find((c) => c.highlight) ?? cards[0]
  const primary = parsePriceCard(highlighted)
  const all = cards.map(parsePriceCard).filter((p): p is NonNullable<typeof p> => p !== null)
  if (all.length === 0) return undefined
  const offer = primary ?? all.reduce((min, p) => (p.minPrice < min.minPrice ? p : min), all[0])
  return {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: offer.minPrice,
      priceCurrency: "EUR",
      ...(offer.unitText ? { unitText: offer.unitText } : {}),
      description: "Indicative starting price; exact quote after site assessment",
    },
  }
}

/* ------------------------------------------------------------------ */
/* Lists (blog index, careers index)                                   */
/* ------------------------------------------------------------------ */

export function generateItemListSchema(
  items: Array<{ name: string; url: string; position?: number }>,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  items: Array<{ name: string; url: string }>,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: generateItemListSchema(items),
  }
}

/* ------------------------------------------------------------------ */
/* JobPosting shared shape                                             */
/* ------------------------------------------------------------------ */

/** HTML (already sanitized) -> plain text for schema description fields. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

export function generateJobPostingSchema(input: {
  canonicalPath: string
  title: string
  descriptionText: string
  publishedDate: string
  applicationDeadline?: string
  id: string | number
  company: string
  companyWebsite?: string
  location?: string
  workTime?: string
  salary?: number
  salaryUnit?: string
  vacancies?: number
}): object {
  const canonical = canonicalUrl(input.canonicalPath)
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${canonical}#jobposting`,
    title: input.title,
    description: input.descriptionText,
    datePosted: input.publishedDate,
    validThrough: input.applicationDeadline || undefined,
    identifier: {
      "@type": "PropertyValue",
      name: input.company,
      value: input.id,
    },
    employmentType: input.workTime || "FULL_TIME",
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${canonicalUrl("/")}#organization`,
      name: input.company,
      sameAs: input.companyWebsite || canonicalUrl("/"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: input.location || "Tallinn",
        addressCountry: "EE",
      },
    },
    baseSalary:
      input.salary && input.salary > 0
        ? {
            "@type": "MonetaryAmount",
            currency: input.salaryUnit || "EUR",
            value: {
              "@type": "QuantitativeValue",
              value: input.salary,
              unitText: "MONTH",
            },
          }
        : undefined,
    totalJobOpenings: input.vacancies && input.vacancies > 0 ? input.vacancies : undefined,
  }
}
