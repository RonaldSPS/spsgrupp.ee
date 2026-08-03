import type { Locale } from "@/lib/slug-map"
import {
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateServiceSchema,
  renderLdJson,
} from "@/lib/json-ld-generator"

type BreadcrumbItem = {
  name: string
  etPath: string
}

type Props = {
  etPath: string
  locale: Locale
  serviceName: string
  serviceDescription: string
  breadcrumbs: BreadcrumbItem[]
  faq?: Array<{ question: string; answer: string }>
}

export default function SeoJsonLd({ etPath, locale, serviceName, serviceDescription, breadcrumbs, faq }: Props) {
  const serviceSchema = generateServiceSchema(etPath, locale, serviceName, serviceDescription)
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, locale)
  const faqSchema = generateFaqSchema(
    (faq || []).map((item) => ({ q: item.question, a: item.answer })),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbSchema) }} />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: renderLdJson(faqSchema),
          }}
        />
      )}
    </>
  )
}
