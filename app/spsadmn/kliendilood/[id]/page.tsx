"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { caseStudies } from "@/app/(et)/kliendilood/stories"
import { factsToText, faqToText } from "@/lib/case-study-format"
import ImageBrowser from "@/app/components/ImageBrowser"

const inputCls =
  "w-full border border-[rgba(23,52,90,0.12)] rounded-lg px-3 py-2 text-[15px] text-[#2d3748] outline-none focus:border-[#5ab5da]"
const labelCls = "text-[15px] font-medium text-[#17345a]"
const hintCls = "text-[15px] text-[#5a6474] mt-1"

export default function AdminKliendiluguEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const base = caseStudies.find((s) => s.id === id) ?? null

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [imageBrowserOpen, setImageBrowserOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    heroImage: "",
    quoteText: "",
    quoteAuthor: "",
    quoteRole: "",
    factsText: "",
    faqText: "",
    tldrHtml: "",
    bodyHtml: "",
    active: true,
  })

  useEffect(() => {
    if (!base) {
      setLoading(false)
      router.push("/spsadmn/kliendilood")
      return
    }
    const baseForm = {
      title: base.title,
      slug: base.slug,
      excerpt: base.excerpt,
      metaTitle: base.metaTitle,
      metaDescription: base.metaDescription,
      heroImage: base.heroImage,
      quoteText: base.quoteText,
      quoteAuthor: base.quoteAuthor,
      quoteRole: base.quoteRole,
      factsText: factsToText(base.facts),
      faqText: faqToText(base.faq),
      tldrHtml: base.tldrHtml,
      bodyHtml: base.bodyHtml,
      active: true,
    }
    fetch("/api/spsadmn/kliendilood")
      .then((r) => r.json())
      .then((data) => {
        const edit = data.stories?.[id]
        if (!edit) {
          setForm(baseForm)
          return
        }
        setForm({
          title: edit.title ?? base.title,
          slug: edit.slug ?? base.slug,
          excerpt: edit.excerpt ?? base.excerpt,
          metaTitle: edit.metaTitle ?? base.metaTitle,
          metaDescription: edit.metaDescription ?? base.metaDescription,
          heroImage: edit.heroImage ?? base.heroImage,
          quoteText: edit.quoteText ?? base.quoteText,
          quoteAuthor: edit.quoteAuthor ?? base.quoteAuthor,
          quoteRole: edit.quoteRole ?? base.quoteRole,
          factsText: edit.factsText ?? factsToText(base.facts),
          faqText: edit.faqText ?? faqToText(base.faq),
          tldrHtml: edit.tldrHtml ?? base.tldrHtml,
          bodyHtml: edit.bodyHtml ?? base.bodyHtml,
          active: edit.active !== false,
        })
      })
      .catch(() => setForm(baseForm))
      .finally(() => setLoading(false))
  }, [id, base, router])

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError("")
    try {
      const res = await fetch("/api/spsadmn/kliendilood", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, fields: form }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 4000)
      } else {
        const data = await res.json().catch(() => ({}))
        setSaveError(data.error || "Viga salvestamisel")
      }
    } catch {
      setSaveError("Viga salvestamisel")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !base) {
    return <p className="text-[15px] text-[#5a6474]">Laadin...</p>
  }

  return (
    <div className="max-w-[900px]">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <Link href="/spsadmn/kliendilood" className="text-[15px] text-[#5a6474] no-underline hover:text-[#17345a]">
            ← Tagasi nimekirja
          </Link>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mt-1 mb-0">{base.clientName}</h1>
          <p className="text-[15px] text-[#5a6474] mt-1 mb-0">
            /kliendilood/{form.slug || base.slug}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[15px] text-[#17345a]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4"
            />
            Avaldatud
          </label>
          <a
            href={`/kliendilood/${form.slug || base.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] px-4 py-2 rounded-xl font-medium border border-[rgba(23,52,90,0.12)] text-[#17345a] hover:bg-[#f8fafc] no-underline"
          >
            Vaata lehte
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#17345a] text-white px-5 py-2 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
          >
            {saving ? "Salvestan..." : "Salvesta"}
          </button>
        </div>
      </div>

      {saved && (
        <p className="text-[15px] text-[#2d9e6b] bg-[#edf9f3] rounded-lg px-4 py-2 mb-4">
          Salvestatud. Avalik leht uueneb hetkega (ISR).
        </p>
      )}
      {saveError && (
        <p className="text-[15px] text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{saveError}</p>
      )}

      <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-6 space-y-5">
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Pealkiri (H1)</label>
          <input type="text" value={form.title} onChange={set("title")} className={inputCls} />
          <p className={hintCls}>Ei tohi alata teenusemärksõnaga (nt „Hoolduskoristus”) — muster „Kliendilugu: …” on ohutu.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Slug (URL)</label>
            <input type="text" value={form.slug} onChange={set("slug")} className={inputCls} />
            <p className={hintCls}>Muudatus jõustub avalikul lehel järgmise build’i järel.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Hero-pilt (pildikoht)</label>
            <div className="flex gap-2">
              <input type="text" value={form.heroImage} onChange={set("heroImage")} className={inputCls} />
              <button
                type="button"
                onClick={() => setImageBrowserOpen(true)}
                className="shrink-0 px-3 py-2 rounded-lg border border-[rgba(23,52,90,0.12)] text-[15px] text-[#17345a] hover:bg-[#eef7fc]"
              >
                Sirvi
              </button>
            </div>
            <p className={hintCls}>Objekti/hoone foto. Sirvija kaudu saab üles laadida uusi pilte.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Excerpt (kaartidel ja hubis)</label>
          <textarea value={form.excerpt} onChange={set("excerpt")} rows={2} className={inputCls} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Meta title</label>
            <input type="text" value={form.metaTitle} onChange={set("metaTitle")} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Meta description</label>
            <textarea value={form.metaDescription} onChange={set("metaDescription")} rows={2} className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>TL;DR kokkuvõte (HTML)</label>
          <textarea value={form.tldrHtml} onChange={set("tldrHtml")} rows={4} className={`${inputCls} font-mono text-[14px]`} />
          <p className={hintCls}>Peab sisaldama linki teenuselehele (nt /koristusteenus/hoolduskoristus/) esimese 500 märgi sees.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Põhitekst (HTML): vajadus / korraldus / tulemused</label>
          <textarea value={form.bodyHtml} onChange={set("bodyHtml")} rows={14} className={`${inputCls} font-mono text-[14px]`} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Faktitabel (iga rida: Silt = Väärtus)</label>
            <textarea value={form.factsText} onChange={set("factsText")} rows={9} className={`${inputCls} font-mono text-[14px]`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>KKK (plokid: „K: küsimus” / „V: vastus”, plokkide vahel tühi rida)</label>
            <textarea value={form.faqText} onChange={set("faqText")} rows={9} className={`${inputCls} font-mono text-[14px]`} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelCls}>Kliendi tsitaat</label>
          <textarea value={form.quoteText} onChange={set("quoteText")} rows={3} className={inputCls} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Tsitaadi autor</label>
            <input type="text" value={form.quoteAuthor} onChange={set("quoteAuthor")} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Autori roll</label>
            <input type="text" value={form.quoteRole} onChange={set("quoteRole")} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#17345a] text-white px-6 py-2.5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
        >
          {saving ? "Salvestan..." : "Salvesta"}
        </button>
      </div>

      <ImageBrowser
        open={imageBrowserOpen}
        onClose={() => setImageBrowserOpen(false)}
        onSelect={(url) => {
          setForm((prev) => ({ ...prev, heroImage: url }))
          setImageBrowserOpen(false)
        }}
      />
    </div>
  )
}
