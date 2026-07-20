"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Locale } from "@/lib/slug-map"

interface Announcement {
  id: string
  title: string
  subtitle: string
  location: string
  salary: number
  salaryUnit: string
  salaryDetails: string
  workTime: string
  publishedDate: string
  slug: string
  active: boolean
}

const labels = {
  et: {
    tag: "Tööpakkumised",
    title: "Aktiivsed tööpakkumised",
    intro: "Liitu meie meeskonnaga! Varasem kogemus pole oluline - juhendame kohapeal.",
    loading: "Laadin...",
    from: "alates",
    details: "Vaata lähemalt",
    parent: "/tule-meile-toole",
  },
  en: {
    tag: "Job offers",
    title: "Active job offers",
    intro: "Join our team. Previous experience is not required - we train people on site.",
    loading: "Loading...",
    from: "from",
    details: "View details",
    parent: "/en/come-work-for-us",
  },
  ru: {
    tag: "Вакансии",
    title: "Активные вакансии",
    intro: "Присоединяйтесь к нашей команде. Предыдущий опыт не обязателен - мы обучаем на месте.",
    loading: "Загрузка...",
    from: "от",
    details: "Подробнее",
    parent: "/ru/приходите-работать-к-нам",
  },
} as const

export default function TooleAnnouncements({ locale = "et" }: { locale?: Locale }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const t = labels[locale]

  useEffect(() => {
    let cancelled = false
    const params = locale === "et" ? "" : `?lang=${locale}`
    fetch(`/api/jobs${params}`)
      .then((r) => { if (!r.ok) throw new Error("Failed to load") ; return r.json() })
      .then((data) => {
        if (cancelled) return
        const active = (data.announcements || []).filter((a: Announcement) => a.active)
        active.sort((a: Announcement, b: Announcement) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        setAnnouncements(active)
      })
      .catch(() => {
        if (!cancelled) setAnnouncements([])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [locale])

  if (loading) {
    return (
      <section id="pakkumised" className="py-[100px] bg-white scroll-mt-[100px]">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <h2 className="text-[clamp(26px,3.2vw,50px)] font-bold text-[#17345a] mb-2 text-center">{t.title}</h2>
          <p className="text-[16px] text-[#5a6474] text-center mb-10">{t.loading}</p>
        </div>
      </section>
    )
  }

  if (announcements.length === 0) return null

  return (
    <section id="pakkumised" className="py-[100px] bg-white scroll-mt-[100px]">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.tag}
          </div>
          <h2 className="text-[clamp(26px,3.2vw,50px)] font-bold text-[#17345a] mb-2">
            {t.title}
          </h2>
          <p className="text-[16px] text-[#5a6474] max-w-[660px] mx-auto">
            {t.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="group rounded-[16px] border border-[rgba(23,52,90,0.08)] bg-white shadow-md hover:shadow-lg transition-all flex flex-col"
            >
              <div className="p-7 flex-1">
                <h3 className="text-[17px] font-bold text-[#17345a] mb-3 leading-snug">
                  {a.title}
                </h3>
                {a.subtitle ? (
                  <p className="text-[15px] text-[#5a6474] mb-3">{a.subtitle}</p>
                ) : null}
                <div className="space-y-1.5">
                  {a.location ? (
                    <p className="text-[15px] text-[#5a6474] flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {a.location}
                    </p>
                  ) : null}
                  {a.salary > 0 ? (
                    <p className="text-[15px] text-[#17345a] font-medium flex items-center gap-1">
                      <span className="text-[16px] font-bold">€</span>
                      {t.from} {a.salary} {a.salaryUnit || "EUR"}
                      {a.salaryDetails ? ` (${a.salaryDetails})` : ""}
                    </p>
                  ) : null}
                  {a.workTime ? (
                    <p className="text-[15px] text-[#5a6474] flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {a.workTime}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="p-7 pt-0">
                <Link
                  href={`${t.parent}/${a.slug}`}
                  className="inline-flex items-center gap-2 bg-[#3abeff] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#2ba8e8] transition-colors"
                >
                  {t.details}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
