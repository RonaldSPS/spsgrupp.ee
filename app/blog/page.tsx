import Link from "next/link"
import Image from "next/image"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FooterCTA from "../components/FooterCTA"
import type { Metadata } from "next"
import { blogPosts } from "./data"

export const metadata: Metadata = {
  title: "Blogi | SPS Grupp",
  description: "SPS Grupi blogi: artiklid ja uudised koristusteenuste kohta.",
  alternates: { canonical: "https://spsgrupp.ee/blog" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("et-EE", { year: "numeric", month: "long", day: "numeric" })
}

export default function BlogArchive() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Avaleht", "item": "https://spsgrupp.ee" },
      { "@type": "ListItem", "position": 2, "name": "Blogi", "item": "https://spsgrupp.ee/blog" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Navbar />
      <main className="pt-[130px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <h1 className="text-[42px] font-bold text-[#17345a] mb-2">Blogi</h1>
          <p className="text-[18px] text-[#2f353f] mb-10 max-w-[700px]">
            Artiklid ja uudised koristusteenuste, kontoripuhastuse ja välikoristuse kohta.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={"/blog/" + post.slug}
                className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-[200px] bg-[#eef7fc]">
                  <Image src={post.image} alt={post.title} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-5">
                  <span className="text-[12px] font-semibold text-[#3abeff] bg-[#eef7fc] px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <h2 className="text-[17px] font-bold text-[#17345a] mt-2 mb-2 leading-snug group-hover:text-[#3abeff] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[15px] text-[#2f353f] leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="text-[13px] text-[#5a6474] mt-3">{formatDate(post.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterCTA />
      <Footer />
    </>
  )
}
