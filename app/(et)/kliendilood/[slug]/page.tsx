import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import FooterCTA from "../../../components/FooterCTA"
import ContactForm from "../../../components/ContactForm"
import type { Metadata } from "next"
import { caseStudies, getCaseStudiesWithEdits, getCaseStudyBySlug } from "../data"
import { generatePageMetadata } from "@/lib/metadata-helper"
import { generateBreadcrumbSchema, renderLdJson } from "@/lib/json-ld-generator"
import { absoluteUrl, canonicalUrl } from "@/lib/url-utils"

export const revalidate = 60
// Slugid tulevad baasandmetest (stories.ts) - uus lugu läheb live'ile build'iga,
// nagu blogi postitused.
export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return caseStudies.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = await getCaseStudyBySlug(slug)
  if (!story) return {}
  return generatePageMetadata({
    path: `/kliendilood/${story.slug}`,
    locale: "et",
    title: story.metaTitle,
    description: story.metaDescription,
    imagePath: story.heroImage,
    type: "article",
    publishedTime: story.datePublished,
  })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("et-EE", { year: "numeric", month: "long", day: "numeric" })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const story = await getCaseStudyBySlug(slug)
  if (!story) notFound()

  const all = await getCaseStudiesWithEdits()
  const others = all.filter((s) => s.slug !== story.slug).slice(0, 2)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl(`/kliendilood/${story.slug}`)}#article`,
    headline: story.title,
    description: story.metaDescription,
    datePublished: story.datePublished,
    dateModified: story.datePublished,
    author: { "@type": "Organization", "@id": `${canonicalUrl("/")}#organization`, name: "SPS Grupp" },
    publisher: { "@type": "Organization", "@id": `${canonicalUrl("/")}#organization`, name: "SPS Grupp OÜ", url: canonicalUrl("/") },
    image: absoluteUrl(story.heroImage),
    url: canonicalUrl(`/kliendilood/${story.slug}`),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl(`/kliendilood/${story.slug}`) },
  }

  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Avaleht", etPath: "/" },
    { name: "Kliendilood", etPath: "/kliendilood" },
    { name: story.title, etPath: `/kliendilood/${story.slug}` },
  ], "et")

  const faqLd = story.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: story.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(faqLd) }} />}
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-[110px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href="/" className="text-[#5a6474] no-underline hover:text-[#17345a]">Avaleht</Link>
            <span className="mx-2">/</span>
            <Link href="/kliendilood/" className="text-[#5a6474] no-underline hover:text-[#17345a]">Kliendilood</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{story.clientName}</span>
          </nav>

          <div className="relative h-[300px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#eef7fc] mb-8">
            <Image src={story.heroImage} alt={story.heroImageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 1200px" preload />
            <span className="absolute top-4 left-4 bg-[#17345a]/90 text-white text-[15px] font-medium px-3 py-1 rounded-full">
              {story.objectType}
            </span>
          </div>

          <div className="grid md:grid-cols-[65fr_35fr] gap-10">
            <article>
              <div className="flex items-center gap-3 text-[15px] text-[#5a6474] mb-4">
                <span className="font-medium text-[#17345a]">{story.clientName}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(story.datePublished)}</span>
              </div>

              <h1 className="text-[32px] md:text-[42px] font-bold text-[#17345a] leading-[1.15] mb-6">
                {story.title}
              </h1>

              {/* TL;DR - vastus-ees kokkuvõte (AI-ekstraktsioon) */}
              <div className="article-content bg-[#eef7fc] border-l-4 border-[#3abeff] rounded-[12px] p-5 mb-8 text-[16px] text-[#17345a] leading-[1.7] font-medium">
                <div dangerouslySetInnerHTML={{ __html: story.tldrHtml }} />
              </div>

              {/* Põhitekst: vajadus / korraldus / tulemused */}
              <div
                className="article-content text-[15px] text-[#2f353f] leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: story.bodyHtml }}
              />

              {/* Kliendi tsitaat */}
              {story.quoteText && (
                <figure className="my-10 bg-[#edf9f3] border-l-4 border-[#2d9e6b] rounded-[12px] p-6">
                  <blockquote className="text-[17px] text-[#17345a] leading-[1.7] italic m-0">
                    „{story.quoteText}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3 mt-4">
                    {story.clientLogo && (
                      <span className="relative w-[48px] h-[48px] rounded-full bg-white border border-[rgba(23,52,90,0.08)] overflow-hidden shrink-0 flex items-center justify-center">
                        <Image src={story.clientLogo} alt={story.clientName} fill className="object-contain p-1.5" sizes="48px" />
                      </span>
                    )}
                    <span className="text-[15px] text-[#5a6474]">
                      <strong className="text-[#17345a]">{story.quoteAuthor}</strong>
                      {story.quoteRole ? `, ${story.quoteRole}` : ""}, {story.clientName}
                    </span>
                  </figcaption>
                </figure>
              )}

              {/* FAQ (FAQPage schema lehe päises) */}
              {story.faq.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-[24px] font-bold text-[#17345a] mb-4">
                    Korduma kippuvad küsimused
                  </h2>
                  <div className="space-y-4">
                    {story.faq.map((item, i) => (
                      <div key={i} className="bg-white rounded-[12px] border border-[rgba(23,52,90,0.08)] p-5">
                        <h3 className="text-[16px] font-bold text-[#17345a] mb-1.5">{item.q}</h3>
                        <p className="text-[15px] text-[#2f353f] leading-[1.7] m-0">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA */}
              <div className="mt-10 rounded-[16px] bg-[#17345a] text-white p-6 md:p-8">
                <h2 className="text-[22px] font-bold mb-2">Kas teie objekt vajab sama süsteemset korrashoidu?</h2>
                <p className="text-[15px] text-white/80 mb-5 m-0">
                  Teeme tasuta objekti ülevaatuse ja koostame pakkumise ühe tööpäevaga.
                </p>
                <Link
                  href="#pakkumine"
                  className="inline-block bg-[#3abeff] text-[#17345a] font-bold text-[15px] px-6 py-3 rounded-[12px] no-underline hover:bg-[#85cbe9] transition-colors"
                >
                  Küsi tasuta objekti ülevaatust
                </Link>
              </div>
            </article>

            <aside className="space-y-6">
              {/* Faktitabel - masinloetav objekti "kaart" */}
              <div className="bg-white rounded-[16px] border border-[rgba(23,52,90,0.08)] p-6">
                <h2 className="text-[16px] font-bold text-[#17345a] mb-3">Objekti faktid</h2>
                <dl className="m-0">
                  {story.facts.map((fact) => (
                    <div key={fact.label} className="py-2 border-b border-[rgba(23,52,90,0.06)] last:border-b-0">
                      <dt className="text-[15px] font-bold text-[#5a6474]">{fact.label}</dt>
                      <dd className="text-[15px] text-[#2f353f] m-0 mt-0.5">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Teenuselehe lingid */}
              {story.relatedLinks.length > 0 && (
                <div className="bg-[#eef7fc] rounded-[16px] p-6">
                  <h2 className="text-[16px] font-bold text-[#17345a] mb-3">Seotud teenused</h2>
                  <div className="flex flex-col gap-2">
                    {story.relatedLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="text-[15px] font-medium text-[#1e4a7a] no-underline hover:text-[#3abeff]">
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Teised kliendilood */}
          {others.length > 0 && (
            <section className="mt-16">
              <h2 className="text-[28px] font-bold text-[#17345a] mb-6">Loe ka teisi kliendilugusid</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {others.map((s) => (
                  <Link key={s.slug} href={"/kliendilood/" + s.slug} className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-[180px] bg-[#eef7fc]">
                      <Image src={s.heroImage} alt={s.heroImageAlt} fill className="object-cover" sizes="50vw" />
                    </div>
                    <div className="p-5">
                      <div className="text-[15px] text-[#5a6474] mb-1">{s.clientName} · {s.keyStat}</div>
                      <h3 className="text-[16px] font-bold text-[#17345a] leading-tight group-hover:text-[#3abeff] line-clamp-2 m-0">
                        {s.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      {/* Kontaktivorm otse loo all (ankur #pakkumine) - CTA-nupp kerib siia.
          page_url salvestub kui /kliendilood/<slug>, nii et paringud-adminis on
          näha, millise loo pealt päring tuli. */}
      <ContactForm />
      <FooterCTA
        title="SPS Grupp pakub parima lahenduse teie koristusvajadustele"
        description="Võtke meiega ühendust. Vastame päringule üldjuhul ühe tööpäeva jooksul."
      />
      <Footer />
    </>
  )
}
