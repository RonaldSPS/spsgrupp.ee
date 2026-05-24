import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FooterCTA from "../components/FooterCTA"
import ScrollAnimation from "../components/ScrollAnimation"
import type { Metadata } from "next"
import { blogPosts } from "./data"

export const metadata: Metadata = {
  title: "Blogi | SPS Grupp – Koristusfirma artiklid ja uudised",
  description:
    "SPS Grupi blogi: professionaalsed nõuanded koristusteenuste, kontoripuhastuse, akende pesu, põrandahoolduse ja välikoristuse kohta. Loe uudiseid ja artikleid.",
  openGraph: {
    title: "Blogi | SPS Grupp",
    description:
      "Professionaalsed nõuanded ja uudised koristusteenuste vallas.",
    url: "https://spsgrupp.ee/blog",
    siteName: "SPS Grupp",
    locale: "et_EE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogi | SPS Grupp",
    description:
      "Professionaalsed nõuanded ja uudised koristusteenuste vallas.",
  },
  alternates: {
    canonical: "https://spsgrupp.ee/blog",
  },
}

function getReadingTime(minutes: number) {
  if (minutes < 2) return "1 min lugemine"
  return `${minutes} min lugemist`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("et-EE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogArchive() {
  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SPS Grupp Blogi",
    description: "Professionaalsed nõuanded ja uudised koristusteenuste vallas.",
    url: "https://spsgrupp.ee/blog",
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: `https://spsgrupp.ee/blog/${p.slug}`,
      author: {
        "@type": "Organization",
        name: p.author,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-[130px] pb-[50px] bg-gradient-to-b from-[#eef7fc] to-white">
          <div className="max-w-[1200px] mx-auto px-[25px]">
            <ScrollAnimation>
              <h1 className="text-[42px] md:text-[52px] font-bold text-[#17345a] leading-[1.1] mb-4">
                Blogi
              </h1>
              <p className="text-[18px] text-[#2f353f] max-w-[700px] leading-relaxed">
                Professionaalsed nõuanded ja uudised koristusteenuste, kontoripuhastuse,
                akende pesu, põrandahoolduse ja välikoristuse kohta.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Featured post */}
        <section className="py-[30px]">
          <div className="max-w-[1200px] mx-auto px-[25px]">
            <Link
              href={`/blogi/${featured.slug}`}
              className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-[280px] md:h-full min-h-[300px] bg-[#eef7fc] overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className="inline-block text-[13px] font-semibold text-[#3abeff] bg-[#eef7fc] px-3 py-1 rounded-full mb-4 w-fit">
                    {featured.category}
                  </span>
                  <h2 className="text-[28px] md:text-[32px] font-bold text-[#17345a] leading-[1.2] mb-4 group-hover:text-[#3abeff] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[14px] text-[#5a6474]">
                    <span>{formatDate(featured.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#5a6474]" />
                    <span>{getReadingTime(featured.readingTime)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 3-column grid */}
        <section className="py-[40px] pb-[80px]">
          <div className="max-w-[1200px] mx-auto px-[25px]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
              {rest.map((post, idx) => (
                <ScrollAnimation key={post.id} delay={idx * 0.05}>
                  <Link
                    href={`/blogi/${post.slug}`}
                    className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative h-[200px] bg-[#eef7fc] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="inline-block text-[12px] font-semibold text-[#3abeff] bg-[#eef7fc] px-2.5 py-0.5 rounded-full mb-3 w-fit">
                        {post.category}
                      </span>
                      <h3 className="text-[18px] font-bold text-[#17345a] leading-[1.3] mb-3 group-hover:text-[#3abeff] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[15px] text-[#2f353f] leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-[13px] text-[#5a6474] mt-auto pt-3 border-t border-gray-100">
                        <span>{formatDate(post.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-[#5a6474]" />
                        <span>{getReadingTime(post.readingTime)}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterCTA />
      <Footer />
    </>
  )
}
