"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { blogPosts, type BlogPost } from "@/app/(et)/blog/posts.generated"
import ImageBrowser from "@/app/components/ImageBrowser"

function linkPrompt(callback: (url: string) => void) {
  const sel = window.getSelection()
  if (sel && sel.toString().length > 0) {
    const url = prompt("Sisesta URL:", "https://")
    if (url) callback(url)
  } else {
    const txt = prompt("Sisesta lingi tekst:", "")
    if (!txt) return
    const url = prompt("Sisesta URL:", "https://")
    if (url) {
      document.execCommand("insertHTML", false, `<a href="${url}">${txt}</a>`)
    }
  }
}

export default function AdminBlogEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const contentRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [imageBrowserOpen, setImageBrowserOpen] = useState(false)
  const [imageBrowserForFeatured, setImageBrowserForFeatured] = useState(false)
  const [pendingContent, setPendingContent] = useState("")
  const foundPost = blogPosts.find((p: BlogPost) => String(p.id) === id) ?? null

  const [formData, setFormData] = useState(() => {
    if (!foundPost) return { title: "", slug: "", featuredImage: "", excerpt: "" }
    return {
      title: foundPost.title,
      slug: foundPost.slug,
      featuredImage: foundPost.featuredImage,
      excerpt: foundPost.excerpt,
    }
  })
  const loadingInit = foundPost !== null
  const [loading, setLoading] = useState(loadingInit)

  useEffect(() => {
    if (!foundPost) return

    fetch("/api/spsadmn/blog")
      .then((r) => r.json())
      .then((data) => {
        const edits = data.posts?.[id]
        const content = edits?.contentHtml ?? foundPost.contentHtml
        setFormData({
          title: edits?.title ?? foundPost.title,
          slug: edits?.slug ?? foundPost.slug,
          featuredImage: edits?.featuredImage ?? foundPost.featuredImage,
          excerpt: edits?.excerpt ?? foundPost.excerpt,
        })
        setPendingContent(content)
      })
      .catch(() => {
        setFormData({
          title: foundPost.title,
          slug: foundPost.slug,
          featuredImage: foundPost.featuredImage,
          excerpt: foundPost.excerpt,
        })
        setPendingContent(foundPost.contentHtml)
      })
      .finally(() => setLoading(false))
  }, [id, foundPost, router])

  useEffect(() => {
    if (!loading && contentRef.current && pendingContent) {
      contentRef.current.innerHTML = pendingContent
    }
  }, [loading, pendingContent])

  useEffect(() => {
    if (foundPost === null && !loading) {
      router.push("/spsadmn/blog")
    }
  }, [foundPost, loading, router])

  const execCmd = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    contentRef.current?.focus()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError("")
    const contentHtml = contentRef.current?.innerHTML || ""

    try {
      const res = await fetch("/api/spsadmn/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          fields: {
            ...formData,
            contentHtml,
          },
        }),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({ error: "Salvestamine ebaõnnestus" }))
        setSaveError(data.error || `Viga: ${res.status}`)
      }
    } catch {
      setSaveError("Võrguühenduse viga")
    }
    setSaving(false)
  }

  if (loading || !foundPost) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[15px] text-[#5a6474]">Laadin...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#17345a]">Muuda artiklit</h1>
          <p className="text-[15px] text-[#5a6474]">ID: {foundPost.id}</p>
        </div>
        <div className="flex items-center gap-3">
          {saveError && <span className="text-[15px] text-red-600 font-medium">{saveError}</span>}
          {saved && <span className="text-[15px] text-[#2d9e6b] font-medium">Salvestatud!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60"
          >
            {saving ? "Salvestan..." : "Salvesta"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)]">
            <div className="p-4 border-b border-[rgba(23,52,90,0.06)] sticky top-0 z-10 bg-white rounded-t-2xl">
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => execCmd("bold")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] font-bold text-[15px]"
                  title="Rasvane (Bold)"
                >B</button>
                <button
                  type="button"
                  onClick={() => execCmd("italic")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] italic text-[15px]"
                  title="Kaldkiri (Italic)"
                >I</button>
                <span className="w-px bg-[rgba(23,52,90,0.1)] mx-1" />
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<h2>")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[15px] text-[#17345a] font-bold"
                  title="Pealkiri H2"
                >H2</button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<h3>")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[15px] text-[#17345a] font-bold"
                  title="Pealkiri H3"
                >H3</button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<h4>")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[15px] text-[#17345a] font-bold"
                  title="Pealkiri H4"
                >H4</button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<p>")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[15px] text-[#17345a]"
                  title="Tavaline tekst"
                >P</button>
                <span className="w-px bg-[rgba(23,52,90,0.1)] mx-1" />
                <button
                  type="button"
                  onClick={() => execCmd("insertUnorderedList")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]"
                  title="Täpploend"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="3" cy="6" r="1.3" fill="currentColor" stroke="none" />
                    <circle cx="3" cy="12" r="1.3" fill="currentColor" stroke="none" />
                    <circle cx="3" cy="18" r="1.3" fill="currentColor" stroke="none" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("insertOrderedList")}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]"
                  title="Nummerdatud loend"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
                    <text x="1" y="8" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">1</text>
                    <text x="1" y="14" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">2</text>
                    <text x="1" y="20" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">3</text>
                  </svg>
                </button>
                <span className="w-px bg-[rgba(23,52,90,0.1)] mx-1" />
                <button
                  type="button"
                  onClick={() => linkPrompt((url) => execCmd("createLink", url))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]"
                  title="Lisa link"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setImageBrowserOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]"
                  title="Lisa pilt"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Sisesta pildi URL:", "https://")
                    if (url) execCmd("insertImage", url)
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]"
                  title="Lisa pilt URL-i järgi"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    <line x1="16" y1="5" x2="22" y2="5" />
                    <line x1="19" y1="2" x2="19" y2="8" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="p-6 min-h-[400px] text-[15px] text-[#2f353f] leading-[1.8] outline-none article-content"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
            <label className="block text-[15px] font-medium text-[#17345a] mb-1">Pealkiri</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
            <label className="block text-[15px] font-medium text-[#17345a] mb-1">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] font-mono"
            />
            <p className="text-[15px] text-[#5a6474] mt-1">URL: /blog/{formData.slug}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
            <label className="block text-[15px] font-medium text-[#17345a] mb-1">Esiletõstetud pilt (URL)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="flex-1 border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] font-mono"
              />
              <button
                type="button"
                onClick={() => { setImageBrowserForFeatured(true); setImageBrowserOpen(true) }}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-[rgba(23,52,90,0.15)] hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                title="Vali pilt kogust"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
            </div>
            {formData.featuredImage && (
              <div className="mt-3 rounded-xl overflow-hidden bg-[#eef7fc] h-[120px] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.featuredImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
            <label className="block text-[15px] font-medium text-[#17345a] mb-1">Lühitutvustus (excerpt)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={4}
              className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] resize-y"
            />
          </div>

          <button
            onClick={() => router.push("/spsadmn/blog")}
            className="w-full text-[15px] text-[#5a6474] py-2.5 rounded-xl border border-[rgba(23,52,90,0.1)] hover:bg-[#f8fafc] transition-colors"
          >
            Tagasi nimekirja
          </button>
        </div>
      </div>

      <ImageBrowser
        open={imageBrowserOpen}
        onClose={() => { setImageBrowserOpen(false); setImageBrowserForFeatured(false) }}
        onSelect={(url) => {
          if (imageBrowserForFeatured) {
            setFormData((prev) => ({ ...prev, featuredImage: url }))
          } else {
            contentRef.current?.focus()
            document.execCommand("insertImage", false, url)
          }
          setImageBrowserOpen(false)
          setImageBrowserForFeatured(false)
        }}
      />
    </div>
  )
}
