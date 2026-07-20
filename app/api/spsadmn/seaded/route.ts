import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { systemSettings } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

const JSON_PATH = path.join(process.cwd(), "data", "admin-settings.json")

interface SettingsJson {
  settings: Record<string, string>
}

async function readSettingsJson(): Promise<SettingsJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return { settings: {} }
  }
}

async function writeSettingsJson(data: SettingsJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      if (!process.env.DATABASE_URL) {
        const data = await readSettingsJson()
        return NextResponse.json({ settings: data.settings }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const rows = await db.select().from(systemSettings)
      const settings: Record<string, string> = {}
      for (const row of rows) {
        settings[row.key] = row.value
      }
      return NextResponse.json({ settings }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Settings GET error:", error)
      return NextResponse.json({ settings: {} }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    }
  }, true)
}

export async function PUT(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const { settings } = body as { settings: Record<string, string> }

      if (!settings || typeof settings !== "object") {
        return noStoreResponse(JSON.stringify({ error: "settings required" }), 400)
      }

      if (!process.env.DATABASE_URL) {
        const data = await readSettingsJson()
        for (const [key, value] of Object.entries(settings)) {
          data.settings[key] = String(value).slice(0, 10000)
        }
        await writeSettingsJson(data)
        return NextResponse.json({ success: true }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      for (const [key, value] of Object.entries(settings)) {
        await db.insert(systemSettings)
          .values({ key, value: String(value).slice(0, 10000) })
          .onConflictDoUpdate({
            target: systemSettings.key,
            set: { value: String(value).slice(0, 10000), updatedAt: new Date() },
          })
      }

      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Settings PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save settings" }), 500)
    }
  }, true)
}

export async function DELETE(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const { searchParams } = new URL(request.url)
      const key = searchParams.get("key")
      if (!key) return noStoreResponse(JSON.stringify({ error: "key required" }), 400)

      if (!process.env.DATABASE_URL) {
        const data = await readSettingsJson()
        delete data.settings[key]
        await writeSettingsJson(data)
        return NextResponse.json({ success: true }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      await db.delete(systemSettings).where(eq(systemSettings.key, key))
      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Settings DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete setting" }), 500)
    }
  }, true)
}
