"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { blogPosts, type BlogPost } from "@/app/blog/posts.generated"

interface BlogEdit {
  title?: string
  slug?: string
  contentHtml?: string
  featuredImage?: string
  excerpt?: string
  updatedAt: string
}

export default function AdminBlogList() {
  const [edits, setEdits] = useState<Record<string, BlogEdit>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/spsadmn/blog")
      .then((r) => r.json())
      .then((data) => {
        setEdits(data.posts || {})
      })
      .finally(() => setLoading(false))
  }, [])

  const allPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div>
      <h1 className="text-[32px] font-bold text-[#17345a] mb-2">Blogi artiklid</h1>
      <p className="text-[15px] text-[#5a6474] mb-8">Vali artikkel muutmiseks. Sinise märgiga on adminis muudetud postitused.</p>

      {loading ? (
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] overflow-hidden">
          <div className="divide-y divide-[rgba(23,52,90,0.06)]">
            {allPosts.map((post: BlogPost) => {
              const isEdited = !!edits[String(post.id)]
              return (
                <Link
                  key={post.id}
                  href={`/spsadmn/blog/${post.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8fafc] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[16px] font-medium text-[#17345a] group-hover:text-[#3abeff] transition-colors truncate">
                        {isEdited ? (edits[String(post.id)].title || post.title) : post.title}
                      </span>
                      {isEdited && (
                        <span className="shrink-0 bg-[#3abeff]/10 text-[#3abeff] text-[15px] px-2 py-0.5 rounded-full font-medium">
                          Muudetud
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] text-[#5a6474] truncate">
                      /blog/{isEdited ? (edits[String(post.id)].slug || post.slug) : post.slug}
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a6474" strokeWidth="2" className="group-hover:stroke-[#3abeff] transition-colors">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
