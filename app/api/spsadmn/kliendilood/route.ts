import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { caseStudyEdits } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { sanitizeHtml } from "@/lib/sanitize"
import { isHeroImagePosition } from "@/lib/case-study-format"

/**
 * Kliendilugude admin-muudatused (overlay). Baas-sisu: app/(et)/kliendilood/stories.ts.
 * id on string (nt "estravel-kontor"). factsText/faqText on lihttekst-vormingud
 * (vt lib/case-study-format.ts).
 */

const JSON_PATH = path.join(process.cwd(), "data", "admin-case-study-edits.json")

interface CaseStudyEditRow {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  heroImage?: string | null
  heroPosition?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  tldrHtml?: string | null
  bodyHtml?: string | null
  quoteText?: string | null
  quoteAuthor?: string | null
  quoteRole?: string | null
  factsText?: string | null
  faqText?: string | null
  active?: boolean
  updatedAt?: string
}

interface AdminEditsJson {
  stories: Record<string, CaseStudyEditRow>
}

const TEXT_FIELDS = [
  "title",
  "excerpt",
  "metaTitle",
  "metaDescription",
  "quoteText",
  "quoteAuthor",
  "quoteRole",
  "factsText",
  "faqText",
] as const

/**
 * Loo muudatus (pilt, pealkiri, peidetud olek vms) peab kajastuma KOHE kõigil
 * lehtedel — muidu jääb avalehe slider (catch-all, revalidate=300) kuni 5 min
 * ja hub/detail (60 s) vanaks. revalidatePath märgib lehed järgmiseks visiidiks
 * uuesti genereeritavaks. Oluline: proxy rewrite'i tõttu on avalehe
 * cache-võti sisemine "/et" (revalidatePath nõuab rewrite'i SIHTTEED,
 * mitte avalikku "/"). Revalideerimise viga ei tohi salvestust nurjata.
 */
function revalidateCaseStudyPages(): void {
  try {
    revalidatePath("/et")
    revalidatePath("/kliendilood")
    revalidatePath("/kliendilood/[slug]", "page")
    revalidatePath("/sitemap.xml")
  } catch (error) {
    console.error("Kliendilood revalidate error:", error)
  }
}

function sanitizeTextField(value: string | undefined): string {
  if (!value) return ""
  return value.slice(0, 50000).replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;"))
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        const stories: Record<string, unknown> = {}
        for (const [id, row] of Object.entries(data.stories)) {
          stories[id] = { ...row, active: row.active !== false }
        }
        return NextResponse.json({ stories }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const rows = await db.select().from(caseStudyEdits)
      const stories: Record<string, unknown> = {}
      for (const row of rows) {
        stories[row.id] = {
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          heroImage: row.heroImage,
          heroPosition: row.heroPosition,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          tldrHtml: row.tldrHtml,
          bodyHtml: row.bodyHtml,
          quoteText: row.quoteText,
          quoteAuthor: row.quoteAuthor,
          quoteRole: row.quoteRole,
          factsText: row.factsText,
          faqText: row.faqText,
          active: row.active,
          updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
        }
      }
      return NextResponse.json({ stories }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Kliendilood GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to load case studies" }), 500)
    }
  }, true)
}

export async function PUT(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const { id, fields } = body as { id: string; fields: Record<string, string | boolean | undefined> }
      if (!id || typeof id !== "string") return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const safeFields: Record<string, string | boolean | null> = {}

      for (const key of TEXT_FIELDS) {
        if (fields[key] !== undefined) safeFields[key] = sanitizeTextField(fields[key] as string | undefined)
      }
      if (fields.slug !== undefined) {
        safeFields.slug = sanitizeTextField(fields.slug as string | undefined).replace(/\s+/g, "-")
      }
      if (fields.heroImage !== undefined) {
        const img = String(fields.heroImage || "").trim()
        if (img && !img.startsWith("/") && !img.startsWith("https://")) safeFields.heroImage = ""
        else safeFields.heroImage = img
      }
      if (fields.heroPosition !== undefined) {
        const pos = String(fields.heroPosition || "").trim()
        safeFields.heroPosition = isHeroImagePosition(pos) ? pos : ""
      }
      if (fields.tldrHtml !== undefined) safeFields.tldrHtml = sanitizeHtml((fields.tldrHtml as string) || "")
      if (fields.bodyHtml !== undefined) safeFields.bodyHtml = sanitizeHtml((fields.bodyHtml as string) || "")
      if (fields.active !== undefined) safeFields.active = fields.active ? "true" : "false"

      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        const existing = data.stories[id] || {}
        const story: CaseStudyEditRow = {
          ...existing,
          ...Object.fromEntries(
            Object.entries(safeFields).filter(([k]) => k !== "active").map(([k, v]) => [k, v as string | null]),
          ),
          active: safeFields.active === "false" ? false : true,
          updatedAt: new Date().toISOString(),
        }
        data.stories[id] = story
        await writeAdminEditsJson(data)
        revalidateCaseStudyPages()
        return NextResponse.json({ success: true, story }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const activeValue =
        safeFields.active === "false" ? false : safeFields.active === "true" ? true : undefined

      const insertValues = {
        id,
        title: (safeFields.title as string) ?? null,
        slug: (safeFields.slug as string) ?? null,
        excerpt: (safeFields.excerpt as string) ?? null,
        heroImage: (safeFields.heroImage as string) ?? null,
        heroPosition: (safeFields.heroPosition as string) ?? null,
        metaTitle: (safeFields.metaTitle as string) ?? null,
        metaDescription: (safeFields.metaDescription as string) ?? null,
        tldrHtml: (safeFields.tldrHtml as string) ?? null,
        bodyHtml: (safeFields.bodyHtml as string) ?? null,
        quoteText: (safeFields.quoteText as string) ?? null,
        quoteAuthor: (safeFields.quoteAuthor as string) ?? null,
        quoteRole: (safeFields.quoteRole as string) ?? null,
        factsText: (safeFields.factsText as string) ?? null,
        faqText: (safeFields.faqText as string) ?? null,
        active: activeValue ?? true,
        updatedAt: new Date(),
      }

      await db
        .insert(caseStudyEdits)
        .values(insertValues)
        .onConflictDoUpdate({
          target: caseStudyEdits.id,
          set: {
            title: (safeFields.title as string) ?? null,
            slug: (safeFields.slug as string) ?? null,
            excerpt: (safeFields.excerpt as string) ?? null,
            heroImage: (safeFields.heroImage as string) ?? null,
            heroPosition: (safeFields.heroPosition as string) ?? null,
            metaTitle: (safeFields.metaTitle as string) ?? null,
            metaDescription: (safeFields.metaDescription as string) ?? null,
            tldrHtml: (safeFields.tldrHtml as string) ?? null,
            bodyHtml: (safeFields.bodyHtml as string) ?? null,
            quoteText: (safeFields.quoteText as string) ?? null,
            quoteAuthor: (safeFields.quoteAuthor as string) ?? null,
            quoteRole: (safeFields.quoteRole as string) ?? null,
            factsText: (safeFields.factsText as string) ?? null,
            faqText: (safeFields.faqText as string) ?? null,
            active: activeValue ?? true,
            updatedAt: new Date(),
          },
        })

      const saved = await db.select().from(caseStudyEdits).where(eq(caseStudyEdits.id, id)).limit(1)
      revalidateCaseStudyPages()
      return NextResponse.json({ success: true, story: saved[0] ?? null }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Kliendilood PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save case study" }), 500)
    }
  }, true)
}

export async function DELETE(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const { searchParams } = new URL(request.url)
      const id = searchParams.get("id")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      if (!process.env.DATABASE_URL) {
        const data = await readAdminEditsJson()
        if (data.stories[id]) {
          data.stories[id] = { active: false, updatedAt: new Date().toISOString() }
          await writeAdminEditsJson(data)
        }
        revalidateCaseStudyPages()
        return NextResponse.json({ success: true }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      await db
        .insert(caseStudyEdits)
        .values({ id, active: false, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: caseStudyEdits.id,
          set: { active: false, updatedAt: new Date() },
        })

      revalidateCaseStudyPages()
      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Kliendilood DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete case study" }), 500)
    }
  }, true)
}

async function readAdminEditsJson(): Promise<AdminEditsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const parsed = JSON.parse(raw) as AdminEditsJson
    return { stories: parsed.stories || {} }
  } catch {
    return { stories: {} }
  }
}

async function writeAdminEditsJson(data: AdminEditsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}
