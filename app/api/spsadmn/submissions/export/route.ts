import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { getFormSubmissions, type FormSubmission } from "@/lib/form-submissions"
import { parseSubmissionFilter } from "../route"

const FORM_LABELS: Record<string, string> = {
  contact: "Kontaktivorm",
  career: "Tööavaldus",
}

const LOCALE_LABELS: Record<string, string> = {
  et: "ET",
  en: "EN",
  ru: "RU",
}

const WORKLOAD_LABELS: Record<string, string> = {
  full: "Täistööaeg",
  part: "Osaline tööaeg",
}

const WORK_TIME_LABELS: Record<string, string> = {
  day: "Päevane tööaeg (8.00–17.00)",
  evening: "Õhtune tööaeg (16.00–00.00)",
  night: "Öine tööaeg (22.00–06.00)",
  any: "Sobivad kõik tööajad",
}

const CSV_HEADER = [
  "Kuupäev",
  "Vorm",
  "Nimi",
  "E-post",
  "Telefon",
  "Ettevõte",
  "Piirkond",
  "Töökoormus",
  "Tööaeg",
  "Sõnum",
  "Manus",
  "Keel",
  "Leht",
  "GCLID",
]

function csvCell(value: string): string {
  // CSV formula-injection guard: cells starting with = + - @ (or tab/CR) are
  // prefixed with ' so Excel/LibreOffice render them as literal text.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toRow(s: FormSubmission): string[] {
  return [
    formatDateTime(s.createdAt),
    FORM_LABELS[s.form] ?? s.form,
    s.name,
    s.email,
    s.phone,
    s.company,
    s.region,
    WORKLOAD_LABELS[s.workload] ?? s.workload,
    WORK_TIME_LABELS[s.workTime] ?? s.workTime,
    s.message,
    s.attachmentName,
    LOCALE_LABELS[s.locale] ?? s.locale,
    s.pageUrl,
    s.gclid,
  ]
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      const { searchParams } = new URL(request.url)
      const submissions = await getFormSubmissions(parseSubmissionFilter(searchParams))

      const lines = [CSV_HEADER, ...submissions.map(toRow)]
        .map((cells) => cells.map(csvCell).join(";"))
      // UTF-8 BOM so Estonian Excel opens diacritics correctly; semicolon-delimited for EE locale
      const csv = "﻿" + lines.join("\r\n")

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="paringud-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Cache-Control": "no-store, max-age=0",
        },
      })
    } catch (error) {
      console.error("Submissions export error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to export submissions" }), 500)
    }
  }, true)
}
