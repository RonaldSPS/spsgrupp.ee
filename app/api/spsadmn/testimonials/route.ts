import { NextRequest, NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import {
  deleteTestimonial,
  getAllTestimonials,
  upsertTestimonial,
} from "@/lib/testimonials"
import {
  getTestimonialSourceHash,
  getTestimonialTranslations,
  markTestimonialTranslationsStale,
} from "@/lib/translate-testimonials"
import type { Testimonial } from "@/lib/types"

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      const testimonials = await getAllTestimonials()
      const withTranslations = await Promise.all(testimonials.map(async (testimonial) => {
        try {
          const sourceHash = getTestimonialSourceHash(testimonial)
          const translations = await getTestimonialTranslations(testimonial.id)
          return { ...testimonial, sourceHash, translations }
        } catch {
          return testimonial
        }
      }))

      return NextResponse.json({ testimonials: withTranslations }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Testimonials GET error:", error)
      return NextResponse.json({ testimonials: [] }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    }
  })
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const { id, fields } = body as { id: string; fields: Partial<Testimonial> }
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const safeFields = sanitizeTestimonialFields(fields)
      const defaultsProvider = (): Omit<Testimonial, "id"> => ({
        categoryTitle: "",
        categoryHref: "",
        quote: "",
        shortQuote: "",
        author: "",
        initials: "",
        logo: "",
        active: true,
        sortOrder: 0,
      })

      const testimonial = await upsertTestimonial(id, safeFields, defaultsProvider)
      if (testimonial) {
        try {
          await markTestimonialTranslationsStale(testimonial.id, getTestimonialSourceHash(testimonial))
        } catch (error) {
          console.warn(`Could not mark testimonial translations stale for ${testimonial.id}:`, error)
        }
      }

      return NextResponse.json({
        success: true,
        testimonial: testimonial
          ? { ...testimonial, translations: await getTestimonialTranslations(testimonial.id) }
          : null,
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Testimonials PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save testimonial" }), 500)
    }
  }, true)
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const id = request.nextUrl.searchParams.get("id")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const ok = await deleteTestimonial(id)

      return NextResponse.json({ success: ok }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Testimonials DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete testimonial" }), 500)
    }
  }, true)
}

function sanitizePlainText(value: unknown, maxLength: number): string {
  return String(value ?? "").slice(0, maxLength).replace(/[<>]/g, "")
}

function sanitizeTestimonialFields(fields: Partial<Testimonial>): Partial<Testimonial> {
  const safe: Partial<Testimonial> = {}

  if (fields.categoryTitle !== undefined) safe.categoryTitle = sanitizePlainText(fields.categoryTitle, 200)
  if (fields.categoryHref !== undefined) {
    const href = String(fields.categoryHref || "").trim()
    safe.categoryHref = href.startsWith("/") ? href.slice(0, 500) : ""
  }
  if (fields.quote !== undefined) safe.quote = sanitizePlainText(fields.quote, 50000)
  if (fields.shortQuote !== undefined) safe.shortQuote = sanitizePlainText(fields.shortQuote, 5000)
  if (fields.author !== undefined) safe.author = sanitizePlainText(fields.author, 300)
  if (fields.initials !== undefined) safe.initials = sanitizePlainText(fields.initials, 10)
  if (fields.logo !== undefined) {
    const logo = String(fields.logo || "").trim()
    safe.logo = logo && (logo.startsWith("/") || logo.startsWith("https://")) ? logo.slice(0, 500) : ""
  }
  if (fields.active !== undefined) safe.active = !!fields.active
  if (fields.sortOrder !== undefined) safe.sortOrder = Math.min(Math.max(Number(fields.sortOrder) || 0, -999999), 999999)

  return safe
}
