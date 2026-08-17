import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { deleteFormSubmissions, getFormSubmissions, type FormSubmissionFilter } from "@/lib/form-submissions"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

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
