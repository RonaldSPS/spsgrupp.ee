import type { Locale } from "@/lib/slug-map"
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  renderLdJson,
  type PriceCardInput,
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
  priceCards?: PriceCardInput[]
}

export default function SeoJsonLd({ etPath, locale, serviceName, serviceDescription, breadcrumbs, priceCards }: Props) {
  const serviceSchema = generateServiceSchema(etPath, locale, serviceName, serviceDescription, priceCards)
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, locale)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbSchema) }} />
    </>
  )
}
