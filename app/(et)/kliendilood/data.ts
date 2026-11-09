import { cache } from "react"
import { promises as fs } from "fs"
import path from "path"
import { sanitizeHtmlSafe } from "@/lib/sanitize-server"
import { textToFacts, textToFaq, isHeroImagePosition } from "@/lib/case-study-format"
import { caseStudies as _caseStudies, type CaseStudy } from "./stories"

export type { CaseStudy }
export const caseStudies = _caseStudies

const DB_READ_TIMEOUT_MS = 2500

export interface CaseStudyEdit {
  title?: string
  slug?: string
  excerpt?: string
  heroImage?: string
  /** Hero-pildi joondus: "top" | "center" | "bottom" (puudub = center). */
  heroPosition?: string
  metaTitle?: string
  metaDescription?: string
  tldrHtml?: string
  bodyHtml?: string
  quoteText?: string
  quoteAuthor?: string
  quoteRole?: string
  /** Admini tekstivormingud (vt lib/case-study-format.ts). */
  factsText?: string
  faqText?: string
  active?: boolean
  updatedAt: string
}

interface AdminEdits {
  stories: Record<string, CaseStudyEdit>
}

function withReadTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Case study database read timed out")),
      DB_READ_TIMEOUT_MS,
    )
    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error) => {
        clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

const getAdminEdits = cache(async (): Promise<AdminEdits> => {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { caseStudyEdits } = await import("@/lib/db/schema")
      const rows = await withReadTimeout(db.select().from(caseStudyEdits))
      const stories: AdminEdits["stories"] = {}
      for (const row of rows) {
        stories[row.id] = {
          title: row.title ?? undefined,
          slug: row.slug ?? undefined,
          excerpt: row.excerpt ?? undefined,
          heroImage: row.heroImage ?? undefined,
          heroPosition: row.heroPosition ?? undefined,
          metaTitle: row.metaTitle ?? undefined,
          metaDescription: row.metaDescription ?? undefined,
          tldrHtml: row.tldrHtml ?? undefined,
          bodyHtml: row.bodyHtml ?? undefined,
          quoteText: row.quoteText ?? undefined,
          quoteAuthor: row.quoteAuthor ?? undefined,
          quoteRole: row.quoteRole ?? undefined,
          factsText: row.factsText ?? undefined,
          faqText: row.faqText ?? undefined,
          active: row.active,
          updatedAt: row.updatedAt?.toISOString?.() ?? String(row.updatedAt ?? ""),
        }
      }
      return { stories }
    } catch {
      // fall through to JSON file fallback
    }
  }

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "admin-case-study-edits.json"),
      "utf-8",
    )
    return JSON.parse(raw)
  } catch {
    return { stories: {} }
  }
})

function applyEdit(base: CaseStudy, edit: CaseStudyEdit): CaseStudy {
  return {
    ...base,
    title: edit.title ?? base.title,
    slug: edit.slug ?? base.slug,
    excerpt: edit.excerpt ?? base.excerpt,
    heroImage: edit.heroImage ?? base.heroImage,
    heroImagePosition: isHeroImagePosition(edit.heroPosition) ? edit.heroPosition : base.heroImagePosition,
    metaTitle: edit.metaTitle ?? base.metaTitle,
    metaDescription: edit.metaDescription ?? base.metaDescription,
    tldrHtml: sanitizeHtmlSafe(edit.tldrHtml ?? base.tldrHtml),
    bodyHtml: sanitizeHtmlSafe(edit.bodyHtml ?? base.bodyHtml),
    quoteText: edit.quoteText ?? base.quoteText,
    quoteAuthor: edit.quoteAuthor ?? base.quoteAuthor,
    quoteRole: edit.quoteRole ?? base.quoteRole,
    facts: edit.factsText ? textToFacts(edit.factsText) : base.facts,
    faq: edit.faqText ? textToFaq(edit.faqText) : base.faq,
  }
}

/** Aktiivsed lood (hub, slider, sitemap) - uusimad ees. */
export const getCaseStudiesWithEdits = cache(async (): Promise<CaseStudy[]> => {
  const edits = await getAdminEdits()
  return _caseStudies
    .flatMap((story) => {
      const edit = edits.stories[story.id]
      if (edit && edit.active === false) return []
      const merged = edit ? applyEdit(story, edit) : {
        ...story,
        tldrHtml: sanitizeHtmlSafe(story.tldrHtml),
        bodyHtml: sanitizeHtmlSafe(story.bodyHtml),
      }
      return [merged]
    })
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
})

/** Üks lugu detaillehele (slugi järgi; admin-slugi-muudatus jõustub build'il). */
export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudy | undefined> => {
  const edits = await getAdminEdits()
  const base = _caseStudies.find((s) => s.slug === slug)
  if (!base) return undefined
  const edit = edits.stories[base.id]
  if (edit && edit.active === false) return undefined
  if (!edit) {
    return {
      ...base,
      tldrHtml: sanitizeHtmlSafe(base.tldrHtml),
      bodyHtml: sanitizeHtmlSafe(base.bodyHtml),
    }
  }
  return applyEdit(base, edit)
})
