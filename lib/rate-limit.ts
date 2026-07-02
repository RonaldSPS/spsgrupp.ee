const MAX_ENTRIES = 10000
const WINDOW_MS = 60_000
const MAX_REQUESTS = 60
const ADMIN_MAX_REQUESTS = 30
const LOGIN_MAX_REQUESTS = 5
const LOGIN_WINDOW_MS = 60_000
const BAN_THRESHOLD = 10
const BAN_DURATION_MS = 600_000

interface RateEntry {
  count: number
  resetAt: number
  blockedUntil?: number
  consecutiveBreaches: number
}

// NOTE: This in-memory Map is process-local and is NOT shared across
// serverless instances or multiple Node.js processes. In production
// deployments with horizontal scaling, consider replacing with a shared
// store such as Redis (ioredis), Upstash Redis, or a database-backed
// counter for consistent rate limiting across all instances.
const store = new Map<string, RateEntry>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}

function getPathKey(request: Request): string {
  const ip = getClientIp(request)
  const pathname = new URL(request.url).pathname
  return `${ip}:${pathname}`
}

function getLoginKey(request: Request): string {
  return `${getClientIp(request)}:#login`
}

function pruneOld(): void {
  if (store.size <= MAX_ENTRIES) return
  const keys = Array.from(store.keys())
  const oldest = keys.sort((a, b) => (store.get(a)?.resetAt ?? 0) - (store.get(b)?.resetAt ?? 0))
  for (const key of oldest.slice(0, Math.floor(MAX_ENTRIES * 0.1))) {
    if (key.startsWith("#")) continue
    store.delete(key)
  }
}

function getEntry(key: string, windowMs: number): { entry: RateEntry; isNew: boolean } {
  const now = Date.now()
  const existing = store.get(key)
  if (!existing || now > existing.resetAt) {
    const entry: RateEntry = { count: 1, resetAt: now + windowMs, consecutiveBreaches: 0 }
    store.set(key, entry)
    pruneOld()
    return { entry, isNew: true }
  }
  if (existing.blockedUntil && now < existing.blockedUntil) {
    return { entry: existing, isNew: false }
  }
  return { entry: existing, isNew: false }
}

export function checkRateLimit(
  request: Request,
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS,
): { allowed: boolean; remaining: number; resetIn: number; retryAfter: number } {
  const key = getPathKey(request)
  const { entry, isNew } = getEntry(key, windowMs)
  const now = Date.now()

  if (!isNew) {
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return { allowed: false, remaining: 0, resetIn: 0, retryAfter: entry.blockedUntil - now }
    }
    entry.count++
  }

  if (entry.count > maxRequests) {
    entry.consecutiveBreaches++
    if (entry.consecutiveBreaches >= BAN_THRESHOLD) {
      entry.blockedUntil = now + BAN_DURATION_MS
      return { allowed: false, remaining: 0, resetIn: 0, retryAfter: BAN_DURATION_MS }
    }
    const retryAfter = entry.resetAt - now
    return { allowed: false, remaining: 0, resetIn: retryAfter, retryAfter }
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now, retryAfter: 0 }
}

export function checkLoginRateLimit(request: Request): { allowed: boolean; remaining: number; resetIn: number; retryAfter: number } {
  const key = getLoginKey(request)
  const { entry, isNew } = getEntry(key, LOGIN_WINDOW_MS)
  const now = Date.now()

  if (!isNew) {
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return { allowed: false, remaining: 0, resetIn: 0, retryAfter: entry.blockedUntil - now }
    }
    entry.count++
  }

  if (entry.count > LOGIN_MAX_REQUESTS) {
    entry.consecutiveBreaches++
    const penalty = Math.min(entry.consecutiveBreaches, 6)
    const banDuration = LOGIN_WINDOW_MS * (1 << penalty)
    entry.blockedUntil = now + banDuration
    return { allowed: false, remaining: 0, resetIn: 0, retryAfter: banDuration }
  }

  return { allowed: true, remaining: LOGIN_MAX_REQUESTS - entry.count, resetIn: entry.resetAt - now, retryAfter: 0 }
}

export function rateLimitResponse(retryAfterMs: number) {
  const retrySeconds = Math.max(1, Math.ceil(retryAfterMs / 1000))
  return new Response(
    JSON.stringify({ error: "Too many requests. Try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Retry-After": String(retrySeconds),
      },
    },
  )
}

export function withRateLimit(
  request: Request,
  handler: () => Promise<Response>,
  isAdmin: boolean = false,
): Promise<Response> {
  const max = isAdmin ? ADMIN_MAX_REQUESTS : MAX_REQUESTS
  const { allowed, retryAfter } = checkRateLimit(request, max)
  if (!allowed) return Promise.resolve(rateLimitResponse(retryAfter))
  return handler()
}

export function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt && (!entry.blockedUntil || now > entry.blockedUntil)) {
      store.delete(key)
    }
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000)
}

const REQUEST_SIZE_LIMIT = 4.5 * 1024 * 1024

export function checkRequestSize(request: Request): boolean {
  const contentLength = request.headers.get("content-length")
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    if (!isNaN(size) && size > REQUEST_SIZE_LIMIT) return false
  }
  return true
}

export function sizeLimitResponse() {
  return new Response(JSON.stringify({ error: "Request entity too large" }), {
    status: 413,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
