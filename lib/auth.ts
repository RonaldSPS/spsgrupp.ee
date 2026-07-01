import "server-only"
import { cookies } from "next/headers"

const COOKIE_NAME = "sps_admin_token"
const TOKEN_PREFIX = "sps_"

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error("ADMIN_PASSWORD environment variable is not set")
  return pw
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

export async function createAdminToken(password: string): Promise<string | null> {
  if (password !== getAdminPassword()) return null
  const timestamp = Date.now().toString()
  const hash = await hmacSha256(getAdminPassword(), timestamp)
  return TOKEN_PREFIX + timestamp + "_" + hash
}

export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token.startsWith(TOKEN_PREFIX)) return false
  const payload = token.slice(TOKEN_PREFIX.length)
  const parts = payload.split("_")
  if (parts.length < 2) return false
  const timestamp = parts[0]
  const providedHash = parts.slice(1).join("_")
  const expectedHash = await hmacSha256(getAdminPassword(), timestamp)
  if (!timingSafeEqual(expectedHash, providedHash)) return false
  const age = Date.now() - parseInt(timestamp, 10)
  const MAX_AGE = 24 * 60 * 60 * 1000
  return age >= 0 && age < MAX_AGE
}

export async function validateAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return validateAdminToken(token)
  } catch {
    return false
  }
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  })
}

export function noStoreResponse(body: string, status: number, extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
    ...extraHeaders,
  }
  return new Response(body, { status, headers })
}
