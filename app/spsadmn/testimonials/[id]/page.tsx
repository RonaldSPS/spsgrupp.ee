"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ImageBrowser from "@/app/components/ImageBrowser"

interface TranslationStatus {
  language: string
  status: string
  sourceHash?: string | null
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

interface FieldProps {
  label: string
  field: keyof AdminTestimonial
  form: AdminTestimonial
  updateField: (field: keyof AdminTestimonial, value: string | number | boolean) => void
  type?: "text" | "number" | "textarea" | "checkbox"
  rows?: number
}

function Field({ label, field, form, updateField, type = "text", rows = 3 }: FieldProps) {
  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form[field]}
          onChange={(e) => updateField(field, e.target.checked)}
          className="w-5 h-5 rounded border-[rgba(23,52,90,0.2)] text-[#2d9e6b] focus:ring-[#2d9e6b]"
        />
        <span className="text-[15px] font-medium text-[#17345a]">{label}</span>
      </label>
    )
  }

  if (type === "textarea") {
    return (
      <div>
        <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
        <textarea
          value={String(form[field] ?? "")}
          onChange={(e) => updateField(field, e.target.value)}
          rows={rows}
          className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] resize-y"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
      <input
        type={type}
        value={String(form[field] ?? "")}
        onChange={(e) => updateField(field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
      />
    </div>
  )
}

export default function AdminTestimonialEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<AdminTestimonial | null>(null)
  const [translations, setTranslations] = useState<TranslationStatus[]>([])
  const [translating, setTranslating] = useState(false)
  const [translationError, setTranslationError] = useState("")
  const [imageBrowserOpen, setImageBrowserOpen] = useState(false)

  useEffect(() => {
    fetch("/api/spsadmn/testimonials")
      .then((r) => r.json())
      .then((data) => {
        const found = data.testimonials?.find((item: AdminTestimonial) => item.id === id)
        if (found) {
          setForm(found)
          setTranslations(found.translations ?? [])
        } else {
          setForm({
            id,
            categoryTitle: "",
            categoryHref: "/koristusteenus",
            quote: "",
            shortQuote: "",
            author: "",
            initials: "",
            logo: "",
            active: true,
            sortOrder: 0,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const updateField = (field: keyof AdminTestimonial, value: string | number | boolean) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    const res = await fetch("/api/spsadmn/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: form.id, fields: form }),
    })
    if (res.ok) {
      setSaved(true)
      const data = await res.json().catch(() => null)
      if (data?.testimonial?.translations) setTranslations(data.testimonial.translations)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const handleTranslate = async () => {
    if (!form) return
    setTranslating(true)
    setTranslationError("")
    try {
      const res = await fetch("/api/spsadmn/testimonials/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || `Translation failed: ${res.status}`)
      setTranslations(data.translations || [])
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : "Translation failed")
    } finally {
      setTranslating(false)
    }
  }

  if (loading || !form) {
    return <div className="flex items-center justify-center h-[60vh]"><p className="text-[15px] text-[#5a6474]">Laadin...</p></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#17345a]">Muuda arvamust</h1>
          <p className="text-[15px] text-[#5a6474]">ID: {form.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/sps-grupp/arvamused"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-[#3abeff] py-2.5 px-5 rounded-xl border border-[#3abeff] font-medium hover:bg-[#3abeff] hover:text-white transition-colors"
          >
            Vaata lehte
          </a>
          {saved && <span className="text-[15px] text-[#2d9e6b] font-medium">Salvestatud!</span>}
          <button onClick={handleSave} disabled={saving} className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60">
            {saving ? "Salvestan..." : "Salvesta"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 space-y-4">
            <h2 className="text-[18px] font-bold text-[#17345a]">Sisu</h2>
            <Field form={form} updateField={updateField} label="Autor / allikas" field="author" />
            <Field form={form} updateField={updateField} label="Lühitsiaalid" field="initials" />
            <Field form={form} updateField={updateField} type="textarea" rows={8} label="Täispikk arvamus" field="quote" />
            <Field form={form} updateField={updateField} type="textarea" rows={5} label="Lühike tsitaat kaardile" field="shortQuote" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 space-y-4">
            <h2 className="text-[18px] font-bold text-[#17345a]">Kuvamine</h2>
            <Field form={form} updateField={updateField} label="Kategooria" field="categoryTitle" />
            <Field form={form} updateField={updateField} label="Teenuse link" field="categoryHref" />
            <Field form={form} updateField={updateField} type="number" label="Järjekord" field="sortOrder" />
            <Field form={form} updateField={updateField} type="checkbox" label="Aktiivne (näidatakse lehel)" field="active" />
            <div>
              <label className="block text-[15px] font-medium text-[#17345a] mb-1">Logo / pilt</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => updateField("logo", e.target.value)}
                  className="flex-1 border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
                />
                <button
                  type="button"
                  onClick={() => setImageBrowserOpen(true)}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-[rgba(23,52,90,0.15)] hover:bg-[#eef7fc] text-[#17345a] transition-colors"
                  title="Vali pilt kogust"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>
              </div>
              {form.logo ? (
                <div className="mt-3 rounded-xl overflow-hidden bg-[#eef7fc] h-[100px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.logo} alt="" className="max-w-full max-h-full object-contain" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-[18px] font-bold text-[#17345a]">Tõlked</h2>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating}
                className="bg-[#3abeff] text-white py-2 px-4 rounded-xl text-[15px] font-medium hover:bg-[#2ba8e8] transition-colors disabled:opacity-60"
              >
                {translating ? "Tõlgin..." : "Tõlgi EN/RU"}
              </button>
            </div>
            {translationError ? <p className="text-[15px] text-red-600 mb-3">{translationError}</p> : null}
            <div className="space-y-2 text-[15px]">
              {["en", "ru"].map((language) => {
                const item = translations.find((translation) => translation.language === language)
                const href = language === "en" ? "/en/sps-group/reviews" : "/ru/группа-sps/отзывы"
                return (
                  <div key={language} className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2">
                    <span className="font-medium text-[#17345a] uppercase">{language}</span>
                    <span className={item?.status === "auto" ? "text-[#2d9e6b]" : "text-[#5a6474]"}>
                      {item ? item.status : "puudub"}
                    </span>
                    {item ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3abeff] font-medium"
                      >
                        Ava
                      </a>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => router.push("/spsadmn/testimonials")}
            className="w-full text-[15px] text-[#5a6474] py-2.5 rounded-xl border border-[rgba(23,52,90,0.1)] hover:bg-[#f8fafc] transition-colors"
          >
            Tagasi nimekirja
          </button>
        </div>
      </div>

      <ImageBrowser
        open={imageBrowserOpen}
        onClose={() => setImageBrowserOpen(false)}
        onSelect={(url) => {
          updateField("logo", url)
          setImageBrowserOpen(false)
        }}
      />
    </div>
  )
}
