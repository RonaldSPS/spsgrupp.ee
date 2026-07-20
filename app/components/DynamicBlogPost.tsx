import Image from "next/image"
import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./Footer"
import FooterCTA from "./FooterCTA"
import type { BlogPost } from "@/app/blog/data"
import type { Locale } from "@/lib/slug-map"

export default function DynamicBlogPost({ post, locale }: { post: BlogPost; locale: Locale }) {
  const blogPath = locale === "et" ? "/blog" : `/${locale}/blog`
  const homePath = locale === "et" ? "/" : `/${locale}`

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href={homePath} className="text-[#5a6474] no-underline hover:text-[#17345a]">{locale === "ru" ? "Главная" : "Home"}</Link>
            <span className="mx-2">/</span>
            <Link href={blogPath} className="text-[#5a6474] no-underline hover:text-[#17345a]">{locale === "ru" ? "Блог" : "Blog"}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{post.title}</span>
          </nav>

          <div className="relative h-[300px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#eef7fc] mb-8">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>

          <article className="max-w-[820px] mx-auto">
            <div className="flex items-center gap-3 text-[15px] text-[#5a6474] mb-4">
              <span>{formatDate(post.date, locale)}</span>
            </div>
            <h1 className="text-[36px] md:text-[42px] font-bold text-[#17345a] leading-[1.15] mb-6">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-[18px] text-[#2f353f] leading-relaxed mb-8 font-medium">
                {post.excerpt}
              </p>
            ) : null}
            <div
              className="article-content text-[15px] text-[#2f353f] leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </article>
        </div>
      </main>
      <FooterCTA />
      <Footer />
    </>
  )
}

function formatDate(date: string, locale: Locale): string {
  const intlLocale = locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "et-EE"
  return new Date(date).toLocaleDateString(intlLocale, { year: "numeric", month: "long", day: "numeric" })
}
