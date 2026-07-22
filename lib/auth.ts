import "server-only"
import { cookies } from "next/headers"
import { createHash } from "crypto"

const COOKIE_NAME = "sps_admin_token"
const TOKEN_PREFIX = "sps_"

export type AdminRole = "admin" | "manager"

export interface AdminUserInfo {
  id: number
  email: string
  displayName: string
  role: AdminRole
}

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error("ADMIN_PASSWORD environment variable is not set")
  return pw
}

function hashPasswordSha256(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export function hashAdminPassword(password: string): string {
  return hashPasswordSha256(password)
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

async function getAdminUsersFromDb(): Promise<Array<{ id: number; email: string; passwordHash: string; displayName: string; role: string; active: boolean }> | null> {
  if (!process.env.DATABASE_URL) return null
  try {
    const { db } = await import("@/lib/db")
    const { adminUsers } = await import("@/lib/db/schema")
    const { eq, and } = await import("drizzle-orm")
    const rows = await db.select().from(adminUsers).where(and(eq(adminUsers.active, true)))
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      displayName: r.displayName,
      role: r.role,
      active: r.active,
    }))
  } catch {
    return null
  }
}

export async function createAdminToken(password: string, email?: string): Promise<string | null> {
  if (!email) {
    if (password === getAdminPassword()) {
      const timestamp = Date.now().toString()
      const hash = await hmacSha256(getAdminPassword(), timestamp)
      return TOKEN_PREFIX + timestamp + "_" + hash
    }

    const users = await getAdminUsersFromDb()
    if (users) {
      for (const user of users) {
        if (user.active && user.passwordHash === hashPasswordSha256(password)) {
          const timestamp = Date.now().toString()
          const hash = await hmacSha256(user.passwordHash, `${timestamp}_${user.id}`)
          return TOKEN_PREFIX + timestamp + "_" + user.id + "_" + hash
        }
      }
    }

    return null
  }

  const users = await getAdminUsersFromDb()
  if (!users) return null

  const cleanEmail = email.trim().toLowerCase()
  const hashedPw = hashPasswordSha256(password)

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (!user || !user.active || user.passwordHash !== hashedPw) return null

  const timestamp = Date.now().toString()
  const hash = await hmacSha256(user.passwordHash, `${timestamp}_${user.id}`)
  return TOKEN_PREFIX + timestamp + "_" + user.id + "_" + hash
}

export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token.startsWith(TOKEN_PREFIX)) return false
  const payload = token.slice(TOKEN_PREFIX.length)
  const parts = payload.split("_")
  if (parts.length < 2) return false
  const timestamp = parts[0]

  const age = Date.now() - parseInt(timestamp, 10)
  const MAX_AGE = 24 * 60 * 60 * 1000
  if (age < 0 || age >= MAX_AGE) return false

  if (parts.length === 2) {
    const providedHash = parts[1]
    const expectedHash = await hmacSha256(getAdminPassword(), timestamp)
    return timingSafeEqual(expectedHash, providedHash)
  }

  if (parts.length === 3) {
    const userId = parseInt(parts[1], 10)
    const providedHash = parts[2]
    if (isNaN(userId)) return false

    const users = await getAdminUsersFromDb()
    if (!users) return false

    const user = users.find((u) => u.id === userId)
    if (!user || !user.active) return false

    const expectedHash = await hmacSha256(user.passwordHash, `${timestamp}_${user.id}`)
    return timingSafeEqual(expectedHash, providedHash)
  }

  return false
}

export async function getAdminTokenInfo(token: string): Promise<AdminUserInfo | null> {
  if (!token.startsWith(TOKEN_PREFIX)) return null
  const payload = token.slice(TOKEN_PREFIX.length)
  const parts = payload.split("_")
  if (parts.length < 2) return null

  // DB user (3+ parts: ts_userId_hash)
  const maybeUserId = parseInt(parts[1], 10)
  if (!isNaN(maybeUserId)) {
    const users = await getAdminUsersFromDb()
    if (users) {
      const user = users.find((u) => u.id === maybeUserId)
      if (user) {
        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role as AdminRole,
        }
      }
    }
  }

  return {
    id: 0,
    email: "admin",
    displayName: "Peaadmin",
    role: "admin",
  }
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

export async function getCurrentAdminUser(): Promise<AdminUserInfo | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return getAdminTokenInfo(token)
  } catch {
    return null
  }
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

export async function requireAdminRole(): Promise<Response | null> {
  const user = await getCurrentAdminUser()
  if (!user || user.role !== "admin") {
    return noStoreResponse(JSON.stringify({ error: "Ainult peaadmin saab seda toimingut teha" }), 403)
  }
  return null
}

export function noStoreResponse(body: string, status: number, extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
    ...extraHeaders,
  }
  return new Response(body, { status, headers })
}
