"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TranslationStatus {
  language: string
  status: string
}

interface AdminTestimonial {
  id: string
  categoryTitle: string
  categoryHref: string
  quote: string
  shortQuote: string
  author: string
  initials: string
  logo: string
  active: boolean
  sortOrder: number
  translations?: TranslationStatus[]
}

export default function AdminTestimonialsList() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("")

  const categories = useMemo(() => {
    return Array.from(new Set(testimonials.map((item) => item.categoryTitle).filter(Boolean))).sort()
  }, [testimonials])

  const filtered = useMemo(() => {
    return testimonials
      .filter((item) => !categoryFilter || item.categoryTitle === categoryFilter)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  }, [testimonials, categoryFilter])

  const fetchData = () => {
    fetch("/api/spsadmn/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const createNew = () => {
    router.push(`/spsadmn/testimonials/testimonial-${Date.now()}`)
  }

  const toggleActive = async (item: AdminTestimonial) => {
    await fetch("/api/spsadmn/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, fields: { active: !item.active } }),
    })
    fetchData()
  }

  const deleteItem = async (item: AdminTestimonial) => {
    if (!confirm(`Kustutada "${item.author || item.id}" arvamus?`)) return
    await fetch(`/api/spsadmn/testimonials?id=${encodeURIComponent(item.id)}`, { method: "DELETE" })
    fetchData()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Arvamused</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-[15px] text-[#5a6474]">Halda kliendi arvamusi ja nende tõlkeid</p>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[15px] px-3 py-1.5 rounded-lg bg-white border border-[rgba(23,52,90,0.12)] text-[#17345a] font-medium cursor-pointer hover:bg-[#f8fafc] transition-colors outline-none"
            >
              <option value="">Kõik kategooriad</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={createNew}
          className="bg-[#3abeff] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#2ba8e8] transition-colors flex items-center gap-2 shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Lisa uus
        </button>
      </div>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center">
          <p className="text-[15px] text-[#5a6474]">Arvamusi pole. Lisa esimene!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-hidden">
          <div className="divide-y divide-[rgba(23,52,90,0.06)]">
            {filtered.map((item) => {
              const translatedCount = item.translations?.filter((translation) => translation.status === "auto").length || 0
              return (
                <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors ${item.active ? "hover:bg-[#f8fafc]" : "bg-[#f0f2f5] hover:bg-[#e8eaed]"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link
                        href={`/spsadmn/testimonials/${item.id}`}
                        className="text-[16px] font-medium text-[#17345a] hover:text-[#3abeff] transition-colors truncate"
                      >
                        {item.author || "Nimetu arvamus"}
                      </Link>
                      <button
                        onClick={() => toggleActive(item)}
                        className={`shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                          item.active ? "bg-[#2d9e6b]/10 text-[#2d9e6b]" : "bg-gray-100 text-[#5a6474]"
                        }`}
                      >
                        {item.active ? "Aktiivne" : "Peidetud"}
                      </button>
                      <span className="shrink-0 text-[15px] px-2 py-0.5 rounded-full bg-[#eef7fc] text-[#17345a]">
                        {translatedCount}/2 tõlgitud
                      </span>
                    </div>
                    <p className="text-[15px] text-[#5a6474] truncate">
                      {item.categoryTitle} | {item.shortQuote || item.quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/spsadmn/testimonials/${item.id}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                      title="Muuda"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteItem(item)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Kustuta"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
