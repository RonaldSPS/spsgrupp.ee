"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Announcement {
  id: string
  title: string
  subtitle: string
  location: string
  salary: number
  salaryUnit: string
  active: boolean
  publishedDate: string
  slug: string
}

export default function AdminTooleList() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch("/api/spsadmn/toole")
      .then((r) => r.json())
      .then((data) => {
        setAnnouncements(data.announcements || [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const toggleActive = async (a: Announcement) => {
    await fetch("/api/spsadmn/toole", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, fields: { active: !a.active } }),
    })
    fetchData()
  }

  const deleteAnnouncement = async (a: Announcement) => {
    if (!confirm(`Kustutada "${a.title}"?`)) return
    await fetch(`/api/spsadmn/toole?id=${a.id}`, { method: "DELETE" })
    fetchData()
  }

  const createNew = async () => {
    const id = "toole-" + Date.now()
    await fetch("/api/spsadmn/toole", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fields: { title: "Uus tööpakkumine", active: true, slug: "uus-toopakkumine-" + Date.now() } }),
    })
    router.push(`/spsadmn/toole/${id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#17345a] mb-2">Tööpakkumised</h1>
          <p className="text-[15px] text-[#5a6474]">Halda Tule tööle lehe kuulutusi</p>
        </div>
        <button
          onClick={createNew}
          className="bg-[#2d9e6b] text-white py-2.5 px-5 rounded-xl text-[15px] font-medium hover:bg-[#238a5a] transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Lisa uus
        </button>
      </div>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-10 text-center">
          <p className="text-[15px] text-[#5a6474]">Pakkumisi pole. Lisa esimene!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-hidden">
          <div className="divide-y divide-[rgba(23,52,90,0.06)]">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8fafc] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/spsadmn/toole/${a.id}`}
                      className="text-[16px] font-medium text-[#17345a] hover:text-[#3abeff] transition-colors truncate"
                    >
                      {a.title || "Pealkirjata"}
                    </Link>
                    <button
                      onClick={() => toggleActive(a)}
                      className={`shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                        a.active ? "bg-[#2d9e6b]/10 text-[#2d9e6b]" : "bg-gray-100 text-[#5a6474]"
                      }`}
                    >
                      {a.active ? "Aktiivne" : "Peidetud"}
                    </button>
                  </div>
                  <p className="text-[15px] text-[#5a6474] truncate">
                    {a.location} {a.salary > 0 ? `| alates ${a.salary} ${a.salaryUnit}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/spsadmn/toole/${a.id}`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                    title="Muuda"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => deleteAnnouncement(a)}
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
