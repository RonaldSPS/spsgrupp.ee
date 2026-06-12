import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import FooterCTA from "../../components/FooterCTA"
import type { Metadata } from "next"
import { blogPosts, getPostBySlug, getRelatedPosts } from "../data"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title + " | SPS Grupp Blogi",
    description: post.excerpt,
    alternates: { canonical: "https://spsgrupp.ee/blog/" + post.slug },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: "https://spsgrupp.ee/blog/" + post.slug,
      type: "article",
      publishedTime: post.date,
      images: [{ url: "https://spsgrupp.ee" + post.featuredImage, width: 1200, height: 630, alt: post.title }],
    },
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("et-EE", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "SPS Grupp" },
    image: "https://spsgrupp.ee" + post.featuredImage,
    url: "https://spsgrupp.ee/blog/" + post.slug,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="pt-[110px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href="/" className="text-[#5a6474] no-underline hover:text-[#17345a]">Avaleht</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="text-[#5a6474] no-underline hover:text-[#17345a]">Blogi</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{post.title}</span>
          </nav>

          <div className="relative h-[300px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#eef7fc] mb-8">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>

          <div className="grid md:grid-cols-[65fr_35fr] gap-10">
            <article>
              <div className="flex items-center gap-3 text-[15px] text-[#5a6474] mb-4">
                <span>{formatDate(post.date)}</span>
              </div>

              <h1 className="text-[36px] md:text-[42px] font-bold text-[#17345a] leading-[1.15] mb-6">
                {post.title}
              </h1>

              <p className="text-[18px] text-[#2f353f] leading-relaxed mb-8 font-medium">
                {post.excerpt}
              </p>

              <div
                className="article-content text-[15px] text-[#2f353f] leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </article>

            <aside className="space-y-6">
              <div className="bg-[#eef7fc] rounded-[16px] p-6">
                <h3 className="text-[16px] font-bold text-[#17345a] mb-2">Autor</h3>
                <p className="text-[15px] text-[#2f353f]">SPS Grupp</p>
              </div>

              <div className="bg-[#eef7fc] rounded-[16px] p-6">
                <h3 className="text-[16px] font-bold text-[#17345a] mb-2">Avaldatud</h3>
                <p className="text-[15px] text-[#2f353f]">{formatDate(post.date)}</p>
              </div>

              {related.length > 0 && (
                <div className="bg-white rounded-[16px] border border-[rgba(23,52,90,0.08)] p-6">
                  <h3 className="text-[16px] font-bold text-[#17345a] mb-3">Seotud</h3>
                  <div className="space-y-3">
                    {related.map((rp) => (
                      <Link key={rp.id} href={"/blog/" + rp.slug} className="group flex gap-3 no-underline">
                        <div className="relative w-[70px] h-[70px] rounded-[10px] overflow-hidden bg-[#eef7fc] shrink-0">
                          <Image src={rp.featuredImage} alt={rp.title} fill className="object-cover" sizes="70px" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-semibold text-[#17345a] leading-tight group-hover:text-[#3abeff] line-clamp-2">
                            {rp.title}
                          </h4>
                          <div className="text-[15px] text-[#5a6474] mt-1">{formatDate(rp.date)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-[28px] font-bold text-[#17345a] mb-6">Seotud artiklid</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((rp) => (
                  <Link key={rp.id} href={"/blog/" + rp.slug} className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-[180px] bg-[#eef7fc]">
                      <Image src={rp.featuredImage} alt={rp.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" sizes="33vw" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-[16px] font-bold text-[#17345a] leading-tight group-hover:text-[#3abeff] line-clamp-2">{rp.title}</h3>
                      <div className="text-[15px] text-[#5a6474] mt-2">{formatDate(rp.date)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <FooterCTA />
      <Footer />
    </>
  )
}
