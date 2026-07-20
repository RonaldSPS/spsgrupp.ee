"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { blogPosts, type BlogPost } from "@/app/blog/posts.generated"

interface BlogEdit {
  title?: string
  slug?: string
  contentHtml?: string
  featuredImage?: string
  excerpt?: string
  active?: boolean
  updatedAt: string
}

export default function AdminBlogList() {
  const [edits, setEdits] = useState<Record<string, BlogEdit>>({})
  const [loading, setLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false)

  const fetchData = () => {
    fetch("/api/spsadmn/blog")
      .then((r) => r.json())
      .then((data) => {
        setEdits(data.posts || {})
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const allPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const filteredPosts = useMemo(() => {
    if (showInactive) return allPosts
    return allPosts.filter((post) => {
      const edit = edits[String(post.id)]
      return edit ? edit.active !== false : true
    })
  }, [allPosts, edits, showInactive])

  const toggleActive = async (postId: number, currentActive: boolean) => {
    await fetch("/api/spsadmn/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(postId), fields: { active: !currentActive } }),
    })
    fetchData()
  }

  const deletePost = async (postId: number) => {
    if (!confirm("Peita see blogi postitus? Seda saab hiljem uuesti aktiveerida.")) return
    await fetch(`/api/spsadmn/blog?id=${postId}`, { method: "DELETE" })
    fetchData()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Blogi artiklid</h1>
          <p className="text-[15px] text-[#5a6474]">Vali artikkel muutmiseks. Sinise märgiga on adminis muudetud postitused.</p>
        </div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`text-[15px] px-4 py-2 rounded-xl font-medium transition-colors border shrink-0 ${
            showInactive ? "bg-[#17345a] text-white border-[#17345a]" : "bg-white border-[rgba(23,52,90,0.12)] text-[#17345a] hover:bg-[#f8fafc]"
          }`}
        >
          {showInactive ? "Peida peidetud" : "Näita peidetud"}
        </button>
      </div>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-hidden">
          <div className="divide-y divide-[rgba(23,52,90,0.06)]">
            {filteredPosts.map((post: BlogPost) => {
              const edit = edits[String(post.id)]
              const isEdited = !!edit?.title
              const isActive = edit ? edit.active !== false : true
              return (
                <div key={post.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors ${isActive ? "hover:bg-[#f8fafc]" : "bg-[#f0f2f5] hover:bg-[#e8eaed]"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link
                        href={`/spsadmn/blog/${post.id}`}
                        className="text-[16px] font-medium text-[#17345a] hover:text-[#3abeff] transition-colors truncate"
                      >
                        {isEdited ? (edit.title || post.title) : post.title}
                      </Link>
                      <button
                        onClick={() => toggleActive(post.id, isActive)}
                        className={`shrink-0 text-[15px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                          isActive ? "bg-[#2d9e6b]/10 text-[#2d9e6b]" : "bg-gray-100 text-[#5a6474]"
                        }`}
                      >
                        {isActive ? "Aktiivne" : "Peidetud"}
                      </button>
                      {isEdited && (
                        <span className="shrink-0 bg-[#3abeff]/10 text-[#3abeff] text-[15px] px-2 py-0.5 rounded-full font-medium">
                          Muudetud
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-[#5a6474] truncate">
                      /blog/{isEdited ? (edit.slug || post.slug) : post.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/spsadmn/blog/${post.id}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                      title="Muuda"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Peida"
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
