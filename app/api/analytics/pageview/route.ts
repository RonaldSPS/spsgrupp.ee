import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { pageViews } from "@/lib/db/schema"
import {
  getClientIp,
  getGeoFromHeaders,
  parseDeviceType,
  parseBrowser,
  parseOs,
  computeDailyVisitorHash,
  sanitizeString,
  sanitizeInt,
  parseUtm,
  extractReferrerHost,
  type PageViewInput,
} from "@/lib/analytics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Privacy-friendly page-view collection endpoint.
 *
 * Accepts a POST with the current page URL and metadata, derives device/geo
 * information server-side, and stores an anonymous record in Supabase.
 * No cookies are set, no IP address is stored, and no persistent user ID is
 * created. The daily_visitor_hash is computed from IP + user-agent + date
 * and is used only for same-day unique visitor and session metrics.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const url = sanitizeString(body.url, 1000)
    const locale = sanitizeString(body.locale, 10)
    const referrer = sanitizeString(body.referrer, 1000)
    const screenWidth = sanitizeInt(body.screenWidth)
    const screenHeight = sanitizeInt(body.screenHeight)
    const language = sanitizeString(body.language, 20)

    let path = "/"
    let search = ""
    try {
      const parsed = new URL(url)
      path = parsed.pathname
      search = parsed.search
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    // Do not track admin or API routes.
    if (path.startsWith("/spsadmn") || path.startsWith("/api/")) {
      return new NextResponse(null, { status: 204 })
    }

    const userAgent = request.headers.get("user-agent") || ""
    const ip = getClientIp(request)
    const geo = getGeoFromHeaders(request)
    const utm = parseUtm(search)

    const input: PageViewInput = {
      path,
      locale,
      referrerHost: extractReferrerHost(referrer),
      ...utm,
      screenWidth,
      screenHeight,
      language,
    }

    const record = {
      ...input,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      deviceType: parseDeviceType(userAgent),
      browser: parseBrowser(userAgent),
      os: parseOs(userAgent),
      dailyVisitorHash: computeDailyVisitorHash(ip, userAgent, new Date()),
    }

    await db.insert(pageViews).values(record)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    // Analytics must never break the user experience.
    console.error("Page-view tracking error:", error)
    return new NextResponse(null, { status: 204 })
  }
}

/** Some browsers send a preflight OPTIONS request. */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
