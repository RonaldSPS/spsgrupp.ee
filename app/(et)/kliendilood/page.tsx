import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import FooterCTA from "../../components/FooterCTA"
import type { Metadata } from "next"
import { getCaseStudiesWithEdits } from "./data"
import CaseStudyGrid from "./CaseStudyGrid"
import { generatePageMetadata } from "@/lib/metadata-helper"
import { generateBreadcrumbSchema, generateCollectionPageSchema, renderLdJson } from "@/lib/json-ld-generator"
import { canonicalUrl } from "@/lib/url-utils"

export const revalidate = 60

export const metadata: Metadata = generatePageMetadata({
  path: "/kliendilood",
  locale: "et",
  title: "Kliendilood | SPS Grupp",
  description:
    "Päris SPS Grupi kliendilood: kuidas korraldame kontorite, tootmisruumide ja logistikakeskuste regulaarset hoolduskoristust Tallinnas ja Harjumaal - objekt, graafik, tulemus.",
  imagePath: "/images/kruiisiterminal/terminal-tables-wide-1920x1080.webp",
})

export default async function CaseStudiesPage() {
  const stories = await getCaseStudiesWithEdits()
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Avaleht", etPath: "/" },
    { name: "Kliendilood", etPath: "/kliendilood" },
  ], "et")
  const collectionLd = generateCollectionPageSchema(
    "SPS Grupi kliendilood",
    "Päris kliendilood regulaarsest hoolduskoristusest: objekt, töökorraldus ja tulemus.",
    canonicalUrl("/kliendilood"),
    stories.map((s) => ({ name: s.title, url: canonicalUrl(`/kliendilood/${s.slug}`) })),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(collectionLd) }} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-[130px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <h1 className="text-[42px] font-bold text-[#17345a] mb-2">Kliendilood</h1>
          <p className="text-[18px] text-[#2f353f] mb-10 max-w-[760px]">
            Kuidas me oma klientide objektide koristust igapäevaselt korraldame - päris objektid,
            päris graafikud ja mõõdetavad tulemused.
          </p>
          <CaseStudyGrid
            stories={stories.map((s) => ({
              slug: s.slug,
              title: s.title,
              excerpt: s.excerpt,
              clientName: s.clientName,
              clientLogo: s.clientLogo,
              objectType: s.objectType,
              objectTypeSlug: s.objectTypeSlug,
              keyStat: s.keyStat,
              heroImage: s.heroImage,
              heroImageAlt: s.heroImageAlt,
              datePublished: s.datePublished,
            }))}
          />
        </div>
      </main>
      <FooterCTA
        title="Kas teie objekt vajab sama süsteemset korrashoidu?"
        description="Võtke meiega ühendust - teeme tasuta objekti ülevaatuse ja pakkumise ühe tööpäevaga."
      />
      <Footer />
    </>
  )
}
