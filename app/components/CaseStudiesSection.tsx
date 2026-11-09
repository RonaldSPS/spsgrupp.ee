import { locale as rootLocale } from "next/root-params"
import { getCaseStudiesWithEdits } from "@/app/(et)/kliendilood/data"
import CaseStudiesSlider from "./CaseStudiesSlider"

/**
 * Avalehe „Kliendilood" sektsioon - iga uus AKTIIVNE kliendilugu ilmub siia
 * automaatselt (uusimad ees, kuni 6 kaarti). Ainult ET-locale'il (sisu on
 * eestikeelne, nagu blogi).
 */
export default async function CaseStudiesSection() {
  const current = await rootLocale()
  if (current !== "et") return null

  const stories = await getCaseStudiesWithEdits()
  if (stories.length === 0) return null

  return (
    <CaseStudiesSlider
      stories={stories.slice(0, 6).map((s) => ({
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        clientName: s.clientName,
        clientLogo: s.clientLogo,
        objectType: s.objectType,
        keyStat: s.keyStat,
        heroImage: s.heroImage,
        heroImageAlt: s.heroImageAlt,
        heroImagePosition: s.heroImagePosition,
      }))}
    />
  )
}
