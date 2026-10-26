import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { deleteFormSubmissions, getFormSubmissions, saveFormSubmission, type FormSubmissionFilter } from "@/lib/form-submissions"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Käsitsi lisatud (telefon/e-post) päringu lubatud väärtused. */
const MANUAL_CHANNELS = new Set(["phone", "email"])
const MANUAL_SOURCES = new Set(["", "google_ads", "direct", "organic:google", "organic:bing", "referral", "utm"])
const MANUAL_SERVICE_KINDS = new Set(["", "maintenance", "oneoff", "other"])

export function parseSubmissionFilter(searchParams: URLSearchParams): FormSubmissionFilter {
  const form = searchParams.get("form")
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const spam = searchParams.get("spam")
  return {
    form: form === "contact" || form === "career" ? form : undefined,
    from: from && DATE_RE.test(from) ? from : undefined,
    to: to && DATE_RE.test(to) ? to : undefined,
    spamOnly: spam === "1" ? true : undefined,
  }
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      const { searchParams } = new URL(request.url)
      const submissions = await getFormSubmissions(parseSubmissionFilter(searchParams))

      return NextResponse.json({ submissions }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Submissions GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to load submissions" }), 500)
    }
  }, true)
}

const MAX_DELETE_IDS = 500

/**
 * Käsitsi sisestatud telefoni-/e-posti päring (26.10.2026 tegevuskava punkt 7).
 * Keegi ei saa kunagi teada, kui palju kanal teenib, kui kõne/kiri jääb
 * logimata — admin lisab need siia. E-kirju EI saadeta (rida on juba
 * tegelikult toimunud kontakt, mitte vormipäring).
 */
export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
      if (!body || typeof body !== "object") {
        return noStoreResponse(JSON.stringify({ error: "Invalid body" }), 400)
      }

      const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : ""
      const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : ""
      const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 60) : ""
      const company = typeof body.company === "string" ? body.company.trim().slice(0, 200) : ""
      const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : ""
      const channel = typeof body.channel === "string" ? body.channel : ""
      const source = typeof body.source === "string" ? body.source : ""
      const serviceKind = typeof body.serviceKind === "string" ? body.serviceKind : ""

      if (!name) return noStoreResponse(JSON.stringify({ error: "Nimi on kohustuslik" }), 400)
      if (!MANUAL_CHANNELS.has(channel)) return noStoreResponse(JSON.stringify({ error: "Kanal peab olema phone või email" }), 400)
      if (!phone && !email) return noStoreResponse(JSON.stringify({ error: "Vähemalt telefon või e-post on kohustuslik" }), 400)
      if (!MANUAL_SOURCES.has(source)) return noStoreResponse(JSON.stringify({ error: "Invalid source" }), 400)
      if (!MANUAL_SERVICE_KINDS.has(serviceKind)) return noStoreResponse(JSON.stringify({ error: "Invalid serviceKind" }), 400)

      await saveFormSubmission({
        form: "contact",
        locale: "et",
        name,
        email,
        phone,
        company,
        message,
        channel: channel as "phone" | "email",
        source,
        serviceKind,
        salesStatus: "new",
      })

      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Submissions POST error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save submission" }), 500)
    }
  }, true)
}

/** Bulk delete: body `{ ids: number[] }`. */
export async function DELETE(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = (await request.json().catch(() => null)) as { ids?: unknown } | null
      const ids = Array.isArray(body?.ids) ? body.ids : null
      if (
        !ids
        || ids.length === 0
        || ids.length > MAX_DELETE_IDS
        || !ids.every((id) => Number.isInteger(id) && id > 0)
      ) {
        return noStoreResponse(JSON.stringify({ error: "Invalid ids" }), 400)
      }

      const deleted = await deleteFormSubmissions(ids as number[])
      if (!deleted) {
        return noStoreResponse(JSON.stringify({ error: "Failed to delete submissions" }), 500)
      }

      return NextResponse.json({ success: true, deleted: ids.length }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Submissions DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete submissions" }), 500)
    }
  }, true)
}
