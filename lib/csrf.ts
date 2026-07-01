import { createHash, timingSafeEqual } from "crypto"

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET
  if (!secret) {
    const pw = process.env.ADMIN_PASSWORD
    if (!pw) return crypto.randomUUID()
    return createHash("sha256").update("csrf_" + pw).digest("hex")
  }
  return secret
}

export function generateCsrfToken(): string {
  const timestamp = Date.now().toString()
  const secret = getCsrfSecret()
  const hash = createHash("sha256").update(secret + timestamp).digest("hex").slice(0, 32)
  return timestamp + "." + hash
}

export function verifyCsrfToken(token: string): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [timestamp, hash] = parts
  const secret = getCsrfSecret()
  const expected = createHash("sha256").update(secret + timestamp).digest("hex").slice(0, 32)
  if (hash.length !== expected.length) return false
  const hashBuf = Buffer.from(hash)
  const expectedBuf = Buffer.from(expected)
  return timingSafeEqual(hashBuf, expectedBuf)
}

export function verifySameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  const xForwardedHost = request.headers.get("x-forwarded-host")
  if (!origin) return true
  const originUrl = safeParseOrigin(origin)
  const hostToCheck = xForwardedHost || host
  if (!originUrl || !hostToCheck) return true
  return originUrl === hostToCheck
}

function safeParseOrigin(origin: string): string | null {
  try {
    const url = new URL(origin)
    return url.host
  } catch {
    return null
  }
}
