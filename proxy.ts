import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "sps_admin_token"
const TOKEN_PREFIX = "sps_"

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

async function validateToken(token: string): Promise<boolean> {
  const password = getAdminPassword()
  if (!password) return false
  if (!token.startsWith(TOKEN_PREFIX)) return false
  const payload = token.slice(TOKEN_PREFIX.length)
  const parts = payload.split("_")
  if (parts.length < 2) return false
  const timestamp = parts[0]
  const providedHash = parts.slice(1).join("_")
  const expectedHash = await hmacSha256(password, timestamp)
  if (!timingSafeEqual(expectedHash, providedHash)) return false
  const age = Date.now() - parseInt(timestamp, 10)
  return age >= 0 && age < 24 * 60 * 60 * 1000
}

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development"
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")
}

function generateNonce(): string {
  return btoa(crypto.randomUUID())
}

function makeResponse(request: NextRequest, csp: string, nonce: string): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("Content-Security-Policy", csp)
  requestHeaders.set("X-CSP-Nonce", nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set("Content-Security-Policy", csp)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("X-DNS-Prefetch-Control", "off")
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = generateNonce()
  const csp = buildCspHeader(nonce)

  if (pathname === "/api/jobs") {
    const response = makeResponse(request, csp, nonce)
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    return response
  }

  if (pathname.startsWith("/api/spsadmn/")) {
    if (pathname === "/api/spsadmn/login" || pathname === "/api/spsadmn/logout") {
      const response = makeResponse(request, csp, nonce)
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
    const response = makeResponse(request, csp, nonce)
    response.headers.set("Cache-Control", "no-store, max-age=0")
    return response
  }

  if (pathname.startsWith("/spsadmn")) {
    const response = makeResponse(request, csp, nonce)
    response.headers.set("Cache-Control", "no-store, max-age=0")
    response.headers.set("X-Robots-Tag", "noindex, nofollow")

    if (pathname !== "/spsadmn") {
      const token = request.cookies.get(COOKIE_NAME)?.value
      if (!token || !(await validateToken(token))) {
        return NextResponse.redirect(new URL("/spsadmn", request.url))
      }
    }

    return response
  }

  return makeResponse(request, csp, nonce)
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
