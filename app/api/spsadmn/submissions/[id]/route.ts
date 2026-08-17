import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { updateFormSubmission, type FormSubmissionFinancials } from "@/lib/form-submissions"

const MAX_AMOUNT = 9_999_999_999.99
const AMOUNT_RE = /^-?\d{1,10}(\.\d{1,2})?$/

/** Returns normalized decimal string, "" for empty (clears the value), or null when invalid. */
function parseAmount(value: unknown): string | null {
  if (value === "" || value === null) return ""
  if (typeof value !== "string" && typeof value !== "number") return null
  const trimmed = String(value).trim().replace(",", ".")
  if (!AMOUNT_RE.test(trimmed)) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || Math.abs(n) > MAX_AMOUNT) return null
  return String(Math.round(n * 100) / 100)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const { id: rawId } = await params
      const id = Number(rawId)
      if (!Number.isInteger(id) || id <= 0) {
        return noStoreResponse(JSON.stringify({ error: "Invalid id" }), 400)
      }

      const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
      if (!body || typeof body !== "object") {
        return noStoreResponse(JSON.stringify({ error: "Invalid body" }), 400)
      }

      const fields: FormSubmissionFinancials = {}
      if ("fee" in body) {
        const fee = parseAmount(body.fee)
        if (fee === null) return noStoreResponse(JSON.stringify({ error: "Invalid fee" }), 400)
        fields.fee = fee
      }
      if ("profit" in body) {
        const profit = parseAmount(body.profit)
        if (profit === null) return noStoreResponse(JSON.stringify({ error: "Invalid profit" }), 400)
        fields.profit = profit
      }
      if ("notes" in body) {
        if (typeof body.notes !== "string") {
          return noStoreResponse(JSON.stringify({ error: "Invalid notes" }), 400)
        }
        fields.notes = body.notes.slice(0, 5000)
      }
      if (Object.keys(fields).length === 0) {
        return noStoreResponse(JSON.stringify({ error: "No fields to update" }), 400)
      }

      const updated = await updateFormSubmission(id, fields)
      if (!updated) {
        return noStoreResponse(JSON.stringify({ error: "Failed to update submission" }), 500)
      }

      return NextResponse.json({ success: true, ...fields }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Submission PATCH error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to update submission" }), 500)
    }
  }, true)
}
