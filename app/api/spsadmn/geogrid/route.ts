import { NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { measureGeoGrid, normalizeGeoKeyword, GEOGRID_POINTS } from "@/lib/reporting/geogrid"

/** Üks märksõna × 27 punkti × ~0,5 s ≈ 20 s; piiriks 60. */
export const maxDuration = 60

/**
 * POST — mõõda vabasõnaline märksõna geo-grid'iga kohe (admini raporti
 * detailvaate "Mõõda kohe" nupp). Tulemust EI salvestata — iganädalane
 * mõõtmine vaikimisi märksõnadega käib raporti genereerimise kaudu.
 */
export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = (await request.json().catch(() => null)) as { keyword?: unknown } | null
      const keyword = normalizeGeoKeyword(body?.keyword)
      if (!keyword) {
        return noStoreResponse(JSON.stringify({ error: "Sobimatu märksõna (2–80 märki, tähed/numbrid/tühikud)" }), 400)
      }

      const run = await measureGeoGrid(keyword, null)
      return NextResponse.json({ run, points: GEOGRID_POINTS.length }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Geogrid POST error:", error)
      return noStoreResponse(
        JSON.stringify({ error: error instanceof Error ? error.message : "Mõõtmine ebaõnnestus" }),
        500,
      )
    }
  }, true)
}
