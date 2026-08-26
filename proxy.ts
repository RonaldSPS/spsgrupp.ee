import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "sps_admin_token"
const TOKEN_PREFIX = "sps_"
const LEGACY_RU_REPAIR_REDIRECTS: Record<string, string> = {
  "/ru/услуги-по-ремонту-в-таллинне/бетонные-работы":
    "/ru/услуги-по-ремонту-в-таллинне/",
  "/ru/услуги-по-ремонту-в-таллинне/строительство-гардеробной":
    "/ru/услуги-по-ремонту-в-таллинне/",
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || ""
}

async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const msgData = encoder.encode(message)
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgData)
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

const DB_AUTH_TIMEOUT_MS = 5000
const DB_DOWN_COOLDOWN_MS = 10_000
let dbDownUntil = 0

async function validateTokenViaSnapshot(token: string, timestamp: string, userId: number): Promise<boolean> {
  try {
    const { readAdminUsersSnapshot } = await import("@/lib/admin-users-snapshot")
    const snapshot = await readAdminUsersSnapshot()
    const user = snapshot?.find((u) => u.id === userId)
    if (!user || !user.active) return false
    const providedHash = token.split("_")[2]
    const expectedHash = await hmacSha256(user.passwordHash, `${timestamp}_${userId}`)
    return timingSafeEqual(expectedHash, providedHash)
  } catch {
    return false
  }
}

function withAuthReadTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Admin auth database read timed out")),
      DB_AUTH_TIMEOUT_MS,
    )
    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error) => {
        clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

async function validateToken(token: string): Promise<boolean> {
  if (!token.startsWith(TOKEN_PREFIX)) return false
  const payload = token.slice(TOKEN_PREFIX.length)
  const parts = payload.split("_")
  if (parts.length < 2) return false
  const timestamp = parts[0]

  const age = Date.now() - parseInt(timestamp, 10)
  if (age < 0 || age >= 24 * 60 * 60 * 1000) return false

  // Env-based admin (2 parts: ts_hash)
  if (parts.length === 2) {
    const password = getAdminPassword()
    if (!password) return false
    const providedHash = parts[1]
    const expectedHash = await hmacSha256(password, timestamp)
    return timingSafeEqual(expectedHash, providedHash)
  }

  // DB user (3 parts: ts_userId_hash)
  if (parts.length === 3) {
    const userId = parseInt(parts[1], 10)
    if (isNaN(userId)) return false
    if (Date.now() < dbDownUntil) {
      return validateTokenViaSnapshot(token, timestamp, userId)
    }
    try {
      const { db } = await import("@/lib/db")
      const { adminUsers } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      const rows = await withAuthReadTimeout(db.select({ passwordHash: adminUsers.passwordHash, active: adminUsers.active }).from(adminUsers).where(eq(adminUsers.id, userId)).limit(1))
      dbDownUntil = 0
      if (rows.length === 0 || !rows[0].active) return false
      const providedHash = parts[2]
      const expectedHash = await hmacSha256(rows[0].passwordHash, `${timestamp}_${userId}`)
      return timingSafeEqual(expectedHash, providedHash)
    } catch {
      // DB unreachable: free the wedged connection and fall back to the local
      // snapshot so logged-in admins are not kicked out during a DB outage.
      dbDownUntil = Date.now() + DB_DOWN_COOLDOWN_MS
      void import("@/lib/db").then((m) => m.resetDbConnection()).catch(() => {})
      return validateTokenViaSnapshot(token, timestamp, userId)
    }
  }

  return false
}

function buildCspHeader(): string {
  const isDev = process.env.NODE_ENV === "development"
  // Google tag stack (GTM + GA4 + Ads + Consent Mode) hosts must be whitelisted
  // or the browser blocks gtm.js and every collect call — verified 2026-08:
  // plain script-src 'self' silently killed all tracking after launch.
  // Host lists follow https://developers.google.com/tag-platform/security/guides/csp
  // (GA4 with advertising features + Google Ads conversion/linker sections).
  // Note: *.g.doubleclick.net does NOT cover ad.doubleclick.net — both needed.
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://tagassistant.google.com https://tagmanager.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com`,
    "img-src 'self' blob: data: https://*.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net https://ad.doubleclick.net https://google.com https://*.google.com https://www.google.ee https://www.google.fi https://www.google.lv https://www.google.lt https://www.googleadservices.com https://pagead2.googlesyndication.com https://ssl.gstatic.com https://www.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://ad.doubleclick.net https://google.com https://*.google.com https://www.google.ee https://www.google.fi https://www.google.lv https://www.google.lt https://www.googleadservices.com https://pagead2.googlesyndication.com https://challenges.cloudflare.com",
    // Turnstile renders its (invisible) widget inside an iframe on this host.
    "frame-src https://www.googletagmanager.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")
}

function makeResponse(request: NextRequest, csp: string, rewritePathname?: string): NextResponse {
  const requestHeaders = new Headers(request.headers)
  const { pathname } = request.nextUrl
  const locale = pathname === "/en" || pathname.startsWith("/en/")
    ? "en"
    : pathname === "/ru" || pathname.startsWith("/ru/")
      ? "ru"
      : "et"
  requestHeaders.set("Content-Security-Policy", csp)
  requestHeaders.set("X-SPS-Locale", locale)

  const init = { request: { headers: requestHeaders } }
  const response = rewritePathname
    ? NextResponse.rewrite(rewriteUrl(request, rewritePathname), init)
    : NextResponse.next(init)
  response.headers.set("Content-Security-Policy", csp)
  // Preview/alias hosts must never be indexed; prod domain is unaffected.
  if (request.nextUrl.hostname.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("X-DNS-Prefetch-Control", "off")
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  let decodedPathname = normalizedPathname
  try {
    decodedPathname = decodeURI(normalizedPathname)
  } catch {}

  const legacyRepairDestination = LEGACY_RU_REPAIR_REDIRECTS[decodedPathname]
  if (legacyRepairDestination) {
    return NextResponse.redirect(new URL(legacyRepairDestination, request.url), 308)
  }

  const csp = buildCspHeader()

  if (normalizedPathname === "/api/jobs") {
    const response = makeResponse(request, csp)
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    return response
  }

  if (normalizedPathname.startsWith("/api/spsadmn/")) {
    if (normalizedPathname === "/api/spsadmn/login" || normalizedPathname === "/api/spsadmn/logout") {
      const response = makeResponse(request, csp)
      response.headers.set("Cache-Control", "no-store, max-age=0")
      return response
    }
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, {
        status: 401,
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    }
    const response = makeResponse(request, csp)
    response.headers.set("Cache-Control", "no-store, max-age=0")
    return response
  }

  if (normalizedPathname.startsWith("/spsadmn")) {
    const response = makeResponse(request, csp)
    response.headers.set("Cache-Control", "no-store, max-age=0")
    response.headers.set("X-Robots-Tag", "noindex, nofollow")

    if (normalizedPathname !== "/spsadmn") {
      const token = request.cookies.get(COOKIE_NAME)?.value
      if (!token || !(await validateToken(token))) {
        return NextResponse.redirect(new URL("/spsadmn/", request.url))
      }
    }

    return response
  }

  // ET pages live at unprefixed URLs but render from the app/[locale] tree.
  // Rewrite them to the internal /et prefix (blog + admin stay ET-direct in
  // app/(et), /en and /ru keep their prefixes, files are untouched). Server
  // action POSTs to page URLs take the same path so they resolve correctly.
  const isPublicEtPath =
    !normalizedPathname.startsWith("/api/") &&
    !normalizedPathname.startsWith("/blog") &&
    normalizedPathname !== "/en" &&
    !normalizedPathname.startsWith("/en/") &&
    normalizedPathname !== "/ru" &&
    !normalizedPathname.startsWith("/ru/") &&
    !/\.[a-zA-Z0-9]+$/.test(normalizedPathname)
  if (isPublicEtPath) {
    return makeResponse(request, csp, `/et${normalizedPathname === "/" ? "" : normalizedPathname}`)
  }

  return makeResponse(request, csp)
}

function rewriteUrl(request: NextRequest, pathname: string): URL {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return url
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
