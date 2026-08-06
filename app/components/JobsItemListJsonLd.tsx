import { getActiveAnnouncements } from "@/lib/announcements"
import { generateItemListSchema, renderLdJson } from "@/lib/json-ld-generator"
import { canonicalUrl } from "@/lib/url-utils"
import { localizedPaths, type Locale } from "@/lib/slug-map"

/** ItemList of active job postings for the careers index page (all locales). */
export default async function JobsItemListJsonLd({ locale }: { locale: Locale }) {
  const announcements = await getActiveAnnouncements()
  if (announcements.length === 0) return null

  const parent = locale === "et" ? "/tule-meile-toole" : `/${locale}${localizedPaths["/tule-meile-toole"][locale]}`
  const schema = generateItemListSchema(
    announcements.map((a) => ({ name: a.title, url: canonicalUrl(`${parent}/${a.slug}`) })),
  )

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(schema) }} />
}
