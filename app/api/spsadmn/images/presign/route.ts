import { NextResponse } from "next/server"
import { handleUpload } from "@vercel/blob/client"
import type { HandleUploadBody } from "@vercel/blob/client"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
]

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp"]

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return noStoreResponse(
          JSON.stringify({ error: "BLOB_READ_WRITE_TOKEN not configured" }),
          500
        )
      }

      const body = (await request.json()) as HandleUploadBody

      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          const ext = pathname.split(".").pop()?.toLowerCase() ?? ""
          if (!ALLOWED_EXTENSIONS.includes(ext)) {
            throw new Error(`Unsupported file type: .${ext}`)
          }
          return {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: 50 * 1024 * 1024,
            tokenPayload: JSON.stringify({
              uploadedAt: new Date().toISOString(),
            }),
          }
        },
        onUploadCompleted: async ({ blob }) => {
          console.log(`[images/presign] Upload completed: ${blob.pathname}`)
        },
      })

      return NextResponse.json(jsonResponse)
    } catch (error) {
      console.error("Images presign error:", error)
      return noStoreResponse(
        JSON.stringify({ error: "Failed to authorize upload" }),
        500
      )
    }
  }, true)
}
