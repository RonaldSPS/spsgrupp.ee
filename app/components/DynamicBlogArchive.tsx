import Image from "next/image"
import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./Footer"
import FooterCTA from "./FooterCTA"
import type { BlogPost } from "@/app/blog/data"
import type { Locale } from "@/lib/slug-map"

const copy = {
  en: {
    home: "Home",
    blog: "Blog",
    title: "Blog",
    intro: "Articles and news about cleaning services, office cleaning and outdoor maintenance.",
  },
  ru: {
    home: "Главная",
    blog: "Блог",
    title: "Блог",
    intro: "Статьи и новости об уборочных услугах, уборке офисов и обслуживании наружных территорий.",
  },
} as const

export default function DynamicBlogArchive({ posts, locale }: { posts: BlogPost[]; locale: Exclude<Locale, "et"> }) {
  const labels = copy[locale]
  const homePath = `/${locale}`
  const blogPath = `/${locale}/blog`

  return (
    <>
      <Navbar />
      <main className="pt-[130px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href={homePath} className="text-[#5a6474] no-underline hover:text-[#17345a]">{labels.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{labels.blog}</span>
          </nav>
          <h1 className="text-[42px] font-bold text-[#17345a] mb-2">{labels.title}</h1>
          <p className="text-[18px] text-[#2f353f] mb-10 max-w-[700px]">
            {labels.intro}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`${blogPath}/${post.slug}`}
                className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-[200px] bg-[#eef7fc]">
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-5">
                  <h2 className="text-[17px] font-bold text-[#17345a] mt-2 mb-2 leading-snug group-hover:text-[#3abeff] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[15px] text-[#2f353f] leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="text-[15px] text-[#5a6474] mt-3">{formatDate(post.date, locale)}</div>
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

function formatDate(date: string, locale: Locale): string {
  const intlLocale = locale === "ru" ? "ru-RU" : "en-GB"
  return new Date(date).toLocaleDateString(intlLocale, { year: "numeric", month: "long", day: "numeric" })
}
