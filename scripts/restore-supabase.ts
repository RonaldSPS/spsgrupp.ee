/**
 * Checks the Supabase project status and restores it if paused, then verifies
 * the database accepts queries. Use when admin auth or EN/RU reviews/jobs
 * suddenly stop working (free-tier auto-pause after inactivity).
 * Requires SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF (and DATABASE_URL for
 * the final query check) from .env.local.
 *   npm run db:restore
 */
import { readFileSync } from "node:fs"
import path from "node:path"

// Load .env.local (tsx does not auto-load it)
try {
  const envRaw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
  for (const line of envRaw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, "")
  }
} catch {}

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const REF = process.env.SUPABASE_PROJECT_REF
const API = "https://api.supabase.com/v1"
const POLL_INTERVAL_MS = 5000
const POLL_TIMEOUT_MS = 5 * 60 * 1000

async function api<T>(method: string, path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Supabase API ${method} ${path} → HTTP ${res.status}: ${text.slice(0, 300)}`)
  return (text ? JSON.parse(text) : {}) as T
}

async function getStatus(): Promise<string> {
  const project = await api<{ status?: string }>("GET", `/projects/${REF}`)
  return project.status ?? "UNKNOWN"
}

async function main() {
  if (!TOKEN || !REF) {
    console.error("SUPABASE_ACCESS_TOKEN / SUPABASE_PROJECT_REF puuduvad (.env.local)")
    process.exit(1)
  }

  let status = await getStatus()
  console.log(`Projekti staatus: ${status}`)

  if (!status.startsWith("ACTIVE")) {
    console.log("Projekt ei ole aktiivne — käivitan taastamise (restore)...")
    await api("POST", `/projects/${REF}/restore`)

    const deadline = Date.now() + POLL_TIMEOUT_MS
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
      status = await getStatus()
      console.log(`  staatus: ${status}`)
      if (status.startsWith("ACTIVE")) break
    }
    if (!status.startsWith("ACTIVE")) {
      console.error("Projekt ei taastunud 5 minuti jooksul — kontrolli Supabase dashboardi.")
      process.exit(1)
    }
  }

  // Confirm the database actually answers queries (pooler can lag behind restore).
  if (process.env.DATABASE_URL) {
    const { db } = await import("../lib/db")
    const { systemSettings } = await import("../lib/db/schema")
    const deadline = Date.now() + POLL_TIMEOUT_MS
    for (;;) {
      try {
        await db.select({ key: systemSettings.key }).from(systemSettings).limit(1)
        console.log("Andmebaas vastab päringutele.")
        break
      } catch (error) {
        if (Date.now() > deadline) throw error
        console.log("  ootan andmebaasi ühendust...")
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
      }
    }
  }

  console.log("\nValmis. Kui EN/RU arvamused/tööpakkumised olid tühjad, jooksuta nüüd:")
  console.log("  npx tsx scripts/sync-translation-fallbacks.ts")
}

main().catch((error) => {
  console.error("Restore ebaõnnestus:", error instanceof Error ? error.message : error)
  process.exit(1)
})
