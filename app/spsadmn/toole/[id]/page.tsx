"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import ImageBrowser from "@/app/components/ImageBrowser"

interface Announcement {
  id: string
  title: string
  subtitle: string
  publishedDate: string
  offerNumber: string
  company: string
  registryCode: string
  website: string
  companyDescription: string
  tasks: string
  requirements: string
  benefits: string
  location: string
  vacancies: number
  salary: number
  salaryUnit: string
  salaryDetails: string
  workTime: string
  workTimeDetails: string
  startDate: string
  applicationDeadline: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactPhone2: string
  contactEmail: string
  active: boolean
  slug: string
  translations?: TranslationStatus[]
}

interface TranslationStatus {
  language: string
  slug: string
  status: string
  sourceHash?: string | null
}

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

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [imageBrowserOpen, setImageBrowserOpen] = useState(false)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  const execCmd = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    ref.current?.focus()
    if (ref.current) onChange(ref.current.innerHTML)
  }, [onChange])

  return (
    <>
      <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)]">
        <div className="p-3 border-b border-[rgba(23,52,90,0.06)] flex flex-wrap gap-0.5 sticky top-0 z-10 bg-white rounded-t-2xl">
          <button type="button" onClick={() => execCmd("bold")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] font-bold text-[15px]" title="Bold">B</button>
          <button type="button" onClick={() => execCmd("italic")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] italic text-[15px]" title="Italic">I</button>
          <span className="w-px bg-[rgba(23,52,90,0.1)] mx-0.5" />
          <button type="button" onClick={() => execCmd("insertUnorderedList")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]" title="Täpploend">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="3" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="3" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg>
          </button>
          <button type="button" onClick={() => execCmd("insertOrderedList")} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]" title="Nummerdatud loend">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="1" y="8" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">1</text><text x="1" y="14" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">2</text><text x="1" y="20" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">3</text></svg>
          </button>
          <span className="w-px bg-[rgba(23,52,90,0.1)] mx-0.5" />
          <button type="button" onClick={() => linkPrompt((url) => execCmd("createLink", url))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]" title="Lisa link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button type="button" onClick={() => setImageBrowserOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eef7fc] text-[#17345a] text-[15px]" title="Lisa pilt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => { if (ref.current) onChange(ref.current.innerHTML) }}
          className="p-4 min-h-[80px] text-[15px] text-[#2f353f] leading-[1.7] outline-none"
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </div>
      <ImageBrowser
        open={imageBrowserOpen}
        onClose={() => setImageBrowserOpen(false)}
        onSelect={(url) => {
          ref.current?.focus()
          document.execCommand("insertImage", false, url)
          if (ref.current) onChange(ref.current.innerHTML)
          setImageBrowserOpen(false)
        }}
      />
    </>
  )
}

interface FieldProps {
  label: string
  field: keyof Announcement
  type?: string
  rows?: number
  form: Announcement
  updateField: (field: keyof Announcement, value: string | number | boolean) => void
}

function Field({ label, field, type = "text", rows, form, updateField }: FieldProps) {
  if (type === "textarea" && rows) {
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
  if (field === "applicationDeadline" || field === "startDate") {
    return (
      <div>
        <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
        <input
          type="date"
          value={String(form[field] ?? "")}
          onChange={(e) => updateField(field, e.target.value)}
          className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
        />
      </div>
    )
  }
  if (field === "location") {
    const districts = ["Lasnamäe", "Mustamäe", "Kesklinn", "Õismäe", "Kristiine", "Pirita", "Nõmme", "Haabersti", "Põhja-Tallinn", "Tallinn", "Maardu", "Rae vald"]
    const currentValue = String(form[field] ?? "")
    const showCustom = currentValue !== "" && !districts.includes(currentValue)
    return (
      <div>
        <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
        <select
          value={showCustom ? "__custom__" : (districts.includes(currentValue) ? currentValue : "")}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              updateField(field, " ")
            } else {
              updateField(field, e.target.value)
            }
          }}
          className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] bg-white"
        >
          <option value="">Vali asukoht...</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          <option value="__custom__">Muu (kirjuta ise)...</option>
        </select>
        {showCustom && (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => updateField(field, e.target.value)}
            placeholder="Kirjuta asukoht..."
            className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff] mt-2"
          />
        )}
      </div>
    )
  }
  if (field === "active") {
    return (
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form[field]}
            onChange={(e) => updateField(field, e.target.checked)}
            className="w-5 h-5 rounded border-[rgba(23,52,90,0.2)] text-[#2d9e6b] focus:ring-[#2d9e6b]"
          />
          <span className="text-[15px] font-medium text-[#17345a]">{label}</span>
        </label>
      </div>
    )
  }
  if (type === "number") {
    return (
      <div>
        <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
        <input
          type="number"
          value={String(form[field] ?? 0)}
          onChange={(e) => updateField(field, Number(e.target.value))}
          className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
        />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-[15px] font-medium text-[#17345a] mb-1">{label}</label>
      <input
        type="text"
        value={String(form[field] ?? "")}
        onChange={(e) => updateField(field, e.target.value)}
        className="w-full border border-[rgba(23,52,90,0.15)] rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#3abeff]"
      />
    </div>
  )
}

export default function AdminTooleEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Announcement | null>(null)
  const [translations, setTranslations] = useState<TranslationStatus[]>([])
  const [translating, setTranslating] = useState(false)
  const [translationError, setTranslationError] = useState("")

  useEffect(() => {
    fetch("/api/spsadmn/toole")
      .then((r) => r.json())
      .then((data) => {
        const found = data.announcements?.find((a: Announcement) => a.id === id)
        if (found) {
          setForm(found)
          setTranslations(found.translations ?? [])
        } else {
          const idSlug = "uus-toopakkumine-" + Date.now()
          const oneMonthLater = new Date()
          oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)
          const newAnnouncement: Announcement = {
            id,
            title: "",
            subtitle: "",
            publishedDate: new Date().toISOString().split("T")[0],
            offerNumber: "",
            company: "SP Service OÜ",
            registryCode: "11312978",
            website: "https://spsgrupp.ee/",
            companyDescription: "Ettevõtte põhitegevusala on tööjõu renditeenuse osutamine, keskendudes eeskätt puhastus- ja hooldusteenuste valdkonna tööjõu pakkumisele.",
            tasks: "",
            requirements: "<ul><li>Korrektsus ja kohusetundlikkus</li><li>Hea füüsiline vorm ja tervis</li><li>Valmisolek töötada graafiku alusel</li><li>Ausus ja usaldusväärsus</li><li>Iseseisvus ja omaalgatusvõime</li><li>Eesti keele oskus suhtlustasandil</li></ul>",
            benefits: "<p><strong>Pakume Sulle:</strong></p><ul><li>Väljaõpet ja täiendkoolitusi</li><li>Õigeaegset töötasu</li><li>Kaasaegseid ja ergonoomilisi töövahendeid</li><li>Tunnustust pikaajalise panuse eest</li><li>Rahalist toetust erijuhtudel</li><li>Sotsiaalset kaitset ja kindlustunnet</li><li>Tervisekontrolli vastavalt töö iseloomule</li><li>Mugavaid ja kvaliteetseid tööriideid</li></ul>",
            location: "",
            vacancies: 1,
            salary: 0,
            salaryUnit: "EUR",
            salaryDetails: "",
            workTime: "",
            workTimeDetails: "",
            startDate: "",
            applicationDeadline: oneMonthLater.toISOString().split("T")[0],
            contactName: "Jelena Smirnov",
            contactRole: "Personalispetsialist",
            contactPhone: "56 820 520",
            contactPhone2: "6623 328",
            contactEmail: "personal@spsgrupp.ee",
            active: true,
            slug: idSlug,
          }
          setForm(newAnnouncement)
        }
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const updateField = (field: keyof Announcement, value: string | number | boolean) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    const res = await fetch("/api/spsadmn/toole", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: form.id, fields: form }),
    })
    if (res.ok) {
      setSaved(true)
      const data = await res.json().catch(() => null)
      if (data?.announcement?.translations) setTranslations(data.announcement.translations)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const handleTranslate = async () => {
    if (!form) return
    setTranslating(true)
    setTranslationError("")
    try {
      const res = await fetch("/api/spsadmn/toole/translate", {
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
          <h1 className="text-[32px] font-bold text-[#17345a]">Muuda tööpakkumist</h1>
          <p className="text-[15px] text-[#5a6474]">ID: {form.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/tule-meile-toole/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-[#3abeff] py-2.5 px-5 rounded-xl border border-[#3abeff] font-medium hover:bg-[#3abeff] hover:text-white transition-colors"
          >
            Vaata kuulutust
          </a>
          <a
            href="/tule-meile-toole#pakkumised"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-[#5a6474] py-2.5 px-5 rounded-xl border border-[rgba(23,52,90,0.15)] font-medium hover:bg-[#f8fafc] transition-colors"
          >
            Vaata koondvaadet
          </a>
          {saved && <span className="text-[15px] text-[#2d9e6b] font-medium">Salvestatud!</span>}
          <button onClick={handleSave} disabled={saving} className="bg-[#17345a] text-white py-2.5 px-6 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-60">
            {saving ? "Salvestan..." : "Salvesta"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 space-y-4">
            <h2 className="text-[18px] font-bold text-[#17345a]">Põhiinfo</h2>
            <Field form={form} updateField={updateField} label="Ametinimetus" field="title" />
            <Field form={form} updateField={updateField} label="Alapealkiri / asukoht lühidalt" field="subtitle" />
            <Field form={form} updateField={updateField} label="Slug (URL)" field="slug" />
            <Field form={form} updateField={updateField} label="Avaldamiskuupäev" field="publishedDate" />
            <Field form={form} updateField={updateField} label="Pakkumise number" field="offerNumber" />
            <Field form={form} updateField={updateField} label="Aktiivne (näidatakse lehel)" field="active" />
            <Field form={form} updateField={updateField} type="textarea" rows={4} label="Ettevõtte kirjeldus" field="companyDescription" />
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 space-y-4">
            <h2 className="text-[18px] font-bold text-[#17345a]">Kandideerimisinfo</h2>
            <Field form={form} updateField={updateField} label="Kandideerimise tähtaeg" field="applicationDeadline" />
            <Field form={form} updateField={updateField} label="Kontaktisik" field="contactName" />
            <Field form={form} updateField={updateField} label="Kontaktisiku roll" field="contactRole" />
            <Field form={form} updateField={updateField} label="Telefon (Jelena)" field="contactPhone" />
            <Field form={form} updateField={updateField} label="Telefon (üldnumber)" field="contactPhone2" />
            <Field form={form} updateField={updateField} label="E-post" field="contactEmail" />
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
                const parent = language === "en" ? "/en/come-work-for-us" : "/ru/приходите-работать-к-нам"
                return (
                  <div key={language} className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2">
                    <span className="font-medium text-[#17345a] uppercase">{language}</span>
                    <span className={item?.status === "auto" ? "text-[#2d9e6b]" : "text-[#5a6474]"}>
                      {item ? item.status : "puudub"}
                    </span>
                    {item?.slug ? (
                      <a
                        href={`${parent}/${item.slug}`}
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
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[rgba(23,52,90,0.08)] p-5 space-y-4">
            <h2 className="text-[18px] font-bold text-[#17345a]">Töökoha andmed</h2>
            <Field form={form} updateField={updateField} label="Asukoht" field="location" />
            <Field form={form} updateField={updateField} type="number" label="Vabade kohtade arv" field="vacancies" />
            <div className="grid grid-cols-2 gap-3">
              <Field form={form} updateField={updateField} type="number" label="Töötasu (bruto)" field="salary" />
              <Field form={form} updateField={updateField} label="Ühik" field="salaryUnit" />
            </div>
            <Field form={form} updateField={updateField} label="Palga täpsustus" field="salaryDetails" />
            <Field form={form} updateField={updateField} label="Tööaeg" field="workTime" />
            <Field form={form} updateField={updateField} label="Tööaja täpsustus" field="workTimeDetails" />
            <Field form={form} updateField={updateField} label="Tööle asumise aeg" field="startDate" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[15px] font-medium text-[#17345a] mb-1">Tööülesanded</label>
              <RichTextEditor value={form.tasks} onChange={(v) => updateField("tasks", v)} label="Tööülesanded" />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-[#17345a] mb-1">Nõuded kandidaadile</label>
              <RichTextEditor value={form.requirements} onChange={(v) => updateField("requirements", v)} label="Nõuded" />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-[#17345a] mb-1">Ettevõte pakub</label>
              <RichTextEditor value={form.benefits} onChange={(v) => updateField("benefits", v)} label="Hüved" />
            </div>
          </div>

          <button
            onClick={() => router.push("/spsadmn/toole")}
            className="w-full text-[15px] text-[#5a6474] py-2.5 rounded-xl border border-[rgba(23,52,90,0.1)] hover:bg-[#f8fafc] transition-colors"
          >
            Tagasi nimekirja
          </button>
        </div>
      </div>
    </div>
  )
}
