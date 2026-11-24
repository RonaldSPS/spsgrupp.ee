import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { getFormSubmissions, updateFormSubmission, type FormSubmissionFinancials } from "@/lib/form-submissions"

const MAX_AMOUNT = 9_999_999_999.99
const AMOUNT_RE = /^-?\d{1,10}(\.\d{1,2})?$/

/** Müügitoru väljade lubatud väärtused (26.10.2026). */
const SERVICE_KINDS = new Set(["", "maintenance", "oneoff", "other"])
const SALES_STATUSES = new Set(["", "new", "contacted", "quoted", "won", "lost"])
/** Päringu kvaliteedi lubatud väärtused (04.11.2026): "" = määramata. */
const LEAD_QUALITIES = new Set(["", "hot", "warm", "cold"])

/** Sales-status helper: set won timestamp when transitioning to won, clear on un-won. */
function applyWonTransition(fields: FormSubmissionFinancials, makeWon: boolean): void {
  if (makeWon) {
    fields.salesStatus = "won"
    // The caller supplies wonAt when known; otherwise we stamp now below.
    if (!fields.wonAt) fields.wonAt = new Date().toISOString()
  } else {
    fields.salesStatus = ""
    fields.wonAt = null
  }
}

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
      if ("serviceKind" in body) {
        if (typeof body.serviceKind !== "string" || !SERVICE_KINDS.has(body.serviceKind)) {
          return noStoreResponse(JSON.stringify({ error: "Invalid serviceKind" }), 400)
        }
        fields.serviceKind = body.serviceKind
      }
      if ("won" in body && typeof body.won === "boolean") {
        if (body.won) {
          // Preserve the existing won timestamp when the checkbox is already on.
          const current = await getFormSubmissions({})
          const row = current.find((r) => r.id === id)
          applyWonTransition(fields, true)
          if (row?.wonAt) fields.wonAt = row.wonAt
        } else {
          applyWonTransition(fields, false)
        }
      }

      if ("salesStatus" in body) {
        if (typeof body.salesStatus !== "string" || !SALES_STATUSES.has(body.salesStatus)) {
          return noStoreResponse(JSON.stringify({ error: "Invalid salesStatus" }), 400)
        }
        fields.salesStatus = body.salesStatus
        if (body.salesStatus === "won") {
          // Preserve the original win timestamp if the row was already won.
          const current = await getFormSubmissions({})
          const row = current.find((r) => r.id === id)
          if (!row?.wonAt) {
            fields.wonAt = new Date().toISOString()
          }
        } else {
          // Moving away from won clears the win date so the offline conversion stops.
          fields.wonAt = null
        }
      }
      if ("leadQuality" in body) {
        if (typeof body.leadQuality !== "string" || !LEAD_QUALITIES.has(body.leadQuality)) {
          return noStoreResponse(JSON.stringify({ error: "Invalid leadQuality" }), 400)
        }
        fields.leadQuality = body.leadQuality
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
