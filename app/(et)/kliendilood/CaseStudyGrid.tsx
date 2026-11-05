"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export interface CaseStudyCardData {
  slug: string
  title: string
  excerpt: string
  clientName: string
  clientLogo: string
  objectType: string
  objectTypeSlug: string
  keyStat: string
  heroImage: string
  heroImageAlt: string
  datePublished: string
}

function formatDate(d: string) {
  const t = new Date(d).getTime()
  if (Number.isNaN(t)) return d
  return new Date(t).toLocaleDateString("et-EE", { year: "numeric", month: "long", day: "numeric" })
}

export default function CaseStudyGrid({ stories }: { stories: CaseStudyCardData[] }) {
  const [filter, setFilter] = useState<string>("")

  const types = useMemo(() => {
    const map = new Map<string, string>()
    for (const s of stories) map.set(s.objectTypeSlug, s.objectType)
    return [...map.entries()]
  }, [stories])

  const visible = filter ? stories.filter((s) => s.objectTypeSlug === filter) : stories

  return (
    <>
      {types.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("")}
            className={`text-[15px] px-4 py-2 rounded-full font-medium border transition-colors ${
              filter === ""
                ? "bg-[#17345a] text-white border-[#17345a]"
                : "bg-white text-[#17345a] border-[rgba(23,52,90,0.15)] hover:bg-[#eef7fc]"
            }`}
          >
            Kõik
          </button>
          {types.map(([slug, label]) => (
            <button
              key={slug}
              onClick={() => setFilter(slug)}
              className={`text-[15px] px-4 py-2 rounded-full font-medium border transition-colors ${
                filter === slug
                  ? "bg-[#17345a] text-white border-[#17345a]"
                  : "bg-white text-[#17345a] border-[rgba(23,52,90,0.15)] hover:bg-[#eef7fc]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((s) => (
          <Link
            key={s.slug}
            href={"/kliendilood/" + s.slug}
            className="group block rounded-[16px] overflow-hidden border border-[rgba(23,52,90,0.08)] bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-[200px] bg-[#eef7fc]">
              <Image src={s.heroImage} alt={s.heroImageAlt} fill className="object-cover" sizes="33vw" />
              <span className="absolute top-3 left-3 bg-[#17345a]/90 text-white text-[15px] font-medium px-3 py-1 rounded-full">
                {s.objectType}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                {s.clientLogo && (
                  <span className="relative w-[54px] h-[54px] rounded-full bg-white border border-[rgba(23,52,90,0.08)] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                    <Image src={s.clientLogo} alt={s.clientName} fill className="object-contain p-1.5" sizes="54px" />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-[#17345a] truncate">{s.clientName}</div>
                  <div className="text-[15px] text-[#5a6474]">{s.keyStat}</div>
                </div>
              </div>
              <h2 className="text-[17px] font-bold text-[#17345a] mb-2 leading-snug group-hover:text-[#3abeff] transition-colors">
                {s.title}
              </h2>
              <p className="text-[15px] text-[#2f353f] leading-relaxed line-clamp-3">{s.excerpt}</p>
              <div className="text-[15px] text-[#5a6474] mt-3">{formatDate(s.datePublished)}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
