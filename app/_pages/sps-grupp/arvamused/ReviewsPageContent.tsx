"use client"

import Link from "next/link"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import FooterCTA from "../../../components/FooterCTA"
import ContactForm from "../../../components/ContactForm"
import TwoToneHeading from "../../../components/TwoToneHeading"
import ScrollAnimation from "../../../components/ScrollAnimation"
import SeoJsonLd from "../../../components/SeoJsonLd"
import TestimonialCards from "../../../components/TestimonialCards"
import HeroBackgroundImage from "../../../components/HeroBackgroundImage"
import { localizePath, type Locale } from "@/lib/slug-map"
import { generateReviewsPageSchema, renderLdJson } from "@/lib/json-ld-generator"
import type { TestimonialCategoryGroup } from "@/lib/testimonials"

interface ReviewsPageText {
  serviceName: string
  serviceDescription: string
  home: string
  spsGroup: string
  reviews: string
  heroLine1: string
  heroLine2: string
  heroDescription: string
  heroCta: string
  sectionTag: string
  sectionHeading: string
  viewService: string
  videoTag: string
  videoHeading: string
  videoDescription: string
  footerTitle: string
  footerDescription: string
  cardCta: string
}

function formatReviewCount(locale: Locale, n: number): string {
  if (locale === "et") return `${n} arvamus${n === 1 ? "" : "t"}`
  if (locale === "en") return `${n} review${n === 1 ? "" : "s"}`
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} отзыв`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} отзыва`
  return `${n} отзывов`
}

interface Props {
  locale: Locale
  categories: TestimonialCategoryGroup[]
  text: ReviewsPageText
}

export default function ReviewsPageContent({ locale, categories, text }: Props) {
  const spsGroupPath = localizePath("/sps-grupp", locale)
  const homePath = locale === "et" ? "/" : `/${locale}`

  // Review schema mirrors the visible cards; TestimonialCards renders 5 stars each.
  const reviewsSchema = generateReviewsPageSchema(
    categories.flatMap((group) =>
      group.testimonials.map((t) => ({
        author: t.author,
        text: t.shortQuote || t.quote,
        ratingValue: 5,
      })),
    ),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(reviewsSchema) }} />
      <SeoJsonLd
        etPath="/sps-grupp/arvamused"
        locale={locale}
        serviceName={text.serviceName}
        serviceDescription={text.serviceDescription}
        breadcrumbs={[
          { name: text.home, etPath: "/" },
          { name: text.spsGroup, etPath: "/sps-grupp" },
          { name: text.reviews, etPath: "/sps-grupp/arvamused" },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section
          className="hero-section relative overflow-hidden min-h-[50vh] max-h-[550px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          aria-label={text.reviews}
        >
          <HeroBackgroundImage src="/images/arvamused.jpg" preload alt="" />
          <div className="grid grid-cols-1 gap-[30px] items-start max-w-[1280px] mx-auto w-full relative z-10">
            <div
              className="animate-fade-up max-w-[750px]"
              style={{
                background: "rgba(55, 54, 45, 0.62)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(3px)",
                padding: "32px",
                borderRadius: "20px",
                border: "1px solid rgba(133, 203, 233, 0.2)",
              }}
            >
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                {text.heroLine1}
                <br />
                <span className="text-[#3abeff]">{text.heroLine2}</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] font-light">
                {text.heroDescription}
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4" onClick={(e) => { e.preventDefault(); const el = document.getElementById("pakkumine"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>
                  {text.heroCta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href={homePath} className="text-white/80 no-underline hover:text-white transition-colors">{text.home}</Link>
                <span className="text-white/50">/</span>
                <Link href={spsGroupPath} className="text-white/80 no-underline hover:text-white transition-colors">{text.spsGroup}</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{text.reviews}</span>
              </nav>
            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {text.sectionTag}
                </div>
                <TwoToneHeading text={text.sectionHeading} />
              </div>

              {categories.map((category) => (
                <div key={`${category.title}-${category.href}`} className="mb-20 last:mb-0">
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-[24px] font-bold text-[#17345a]">{category.title}</h2>
                    <span className="text-[15px] text-[#5a6474] bg-[#f0f2f5] rounded-full px-3 py-0.5">
                      {formatReviewCount(locale, category.testimonials.length)}
                    </span>
                    <Link
                      href={localizePath(category.href, locale)}
                      className="text-[15px] text-[#3abeff] no-underline font-medium transition-colors hover:text-[#17345a] ml-auto"
                    >
                      {text.viewService} →
                    </Link>
                  </div>

                  <TestimonialCards testimonials={category.testimonials} cols={3} ctaLabel={text.cardCta} />
                </div>
              ))}
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {text.videoTag}
                </div>
                <TwoToneHeading text={text.videoHeading} />
                <p className="section-intro mx-auto mt-4">
                  {text.videoDescription}
                </p>
              </div>

              <div className="w-full md:w-3/4 mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <video
                    src="/SPS-TarmoSildberg.mp4"
                    controls
                    preload="none"
                    poster="/TarmoHero.jpg"
                    className="w-full h-auto"
                    style={{ borderRadius: "24px" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA title={text.footerTitle} description={text.footerDescription} />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  )
}

export type { ReviewsPageText }
