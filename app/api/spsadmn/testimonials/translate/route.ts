import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { getTestimonial } from "@/lib/testimonials"
import { getTestimonialTranslations, translateTestimonial } from "@/lib/translate-testimonials"

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const id = String(body?.id || "")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const testimonial = await getTestimonial(id)
      if (!testimonial) return noStoreResponse(JSON.stringify({ error: "testimonial not found" }), 404)
      if (!testimonial.quote && !testimonial.shortQuote) {
        return noStoreResponse(JSON.stringify({ error: "testimonial quote is required before translation" }), 400)
      }

      const result = await translateTestimonial(testimonial)
      const translations = await getTestimonialTranslations(id)

      return NextResponse.json({ success: true, result, translations }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Testimonial translate error:", error)
      return noStoreResponse(JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to translate testimonial",
      }), 500)
    }
  }, true)
}
