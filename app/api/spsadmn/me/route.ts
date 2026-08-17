import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse, getCurrentAdminUser, hashAdminPassword } from "@/lib/auth"
import { syncAdminUsersSnapshotFromDb } from "@/lib/admin-users-snapshot"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

const JSON_PATH = path.join(process.cwd(), "data", "admin-users.json")

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      const user = await getCurrentAdminUser()
      if (!user) return unauthorizedResponse()

      if (user.id === 0) {
        return NextResponse.json({
          user: { id: 0, email: "", displayName: "Peaadmin", role: "admin", isEnvAdmin: true },
        }, { headers: { "Cache-Control": "no-store, max-age=0" } })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          isEnvAdmin: false,
        },
      }, { headers: { "Cache-Control": "no-store, max-age=0" } })
    } catch (error) {
      console.error("Me GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to get user" }), 500)
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

      const currentUser = await getCurrentAdminUser()
      if (!currentUser) return unauthorizedResponse()

      const body = await request.json()
      const { email, password, displayName } = body as {
        email?: string
        password?: string
        displayName?: string
      }

      // Env-based admin: create a DB user to "claim" their identity
      if (currentUser.id === 0) {
        if (!email || !password) {
          return noStoreResponse(JSON.stringify({ error: "E-mail ja parool on kohustuslikud" }), 400)
        }
        if (password.length < 6) {
          return noStoreResponse(JSON.stringify({ error: "Parool peab olema vähemalt 6 tähemärki" }), 400)
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return noStoreResponse(JSON.stringify({ error: "Vigane e-maili aadress" }), 400)
        }

        const safeEmail = email.trim().toLowerCase().slice(0, 254)
        const rawName = (displayName || "").trim()
        const safeName = rawName
          ? rawName.slice(0, 200)
          : safeEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 200)

        if (!process.env.DATABASE_URL) {
          const raw = await fs.readFile(JSON_PATH, "utf-8").catch(() => JSON.stringify({ users: [] }))
          const data = JSON.parse(raw)
          let nextId = 1
          for (const u of data.users || []) { if (u.id >= nextId) nextId = u.id + 1 }
          data.users.push({
            id: nextId,
            email: safeEmail,
            passwordHash: hashAdminPassword(password),
            displayName: safeName,
            role: "admin",
            active: true,
          })
          await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
          await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
          return NextResponse.json({
            success: true,
            user: { id: nextId, email: safeEmail, displayName: safeName, role: "admin", isEnvAdmin: false },
          }, { headers: { "Cache-Control": "no-store, max-age=0" } })
        }

        const [inserted] = await db.insert(adminUsers).values({
          email: safeEmail,
          passwordHash: hashAdminPassword(password),
          displayName: safeName,
          role: "admin",
          active: true,
        }).returning()
        void syncAdminUsersSnapshotFromDb()

        return NextResponse.json({
          success: true,
          message: "Konto loodud. Palun logi sisse oma uue e-posti ja parooliga.",
          user: { id: inserted.id, email: inserted.email, displayName: inserted.displayName, role: inserted.role, isEnvAdmin: false },
        }, { headers: { "Cache-Control": "no-store, max-age=0" } })
      }

      // DB user: update own profile
      const updates: Record<string, unknown> = { updatedAt: new Date() }
      if (email !== undefined) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return noStoreResponse(JSON.stringify({ error: "Vigane e-maili aadress" }), 400)
        }
        updates.email = email.trim().toLowerCase().slice(0, 254)
      }
      if (password !== undefined) {
        if (password.length < 6) {
          return noStoreResponse(JSON.stringify({ error: "Parool peab olema vähemalt 6 tähemärki" }), 400)
        }
        updates.passwordHash = hashAdminPassword(password)
      }
      if (displayName !== undefined) {
        updates.displayName = displayName.trim().slice(0, 200)
      }

      if (!process.env.DATABASE_URL) {
        const raw = await fs.readFile(JSON_PATH, "utf-8").catch(() => JSON.stringify({ users: [] }))
        const data = JSON.parse(raw)
        const idx = (data.users || []).findIndex((u: { id: number }) => u.id === currentUser.id)
        if (idx === -1) return noStoreResponse(JSON.stringify({ error: "Kasutajat ei leitud" }), 404)

        const user = data.users[idx]
        if (updates.email !== undefined) user.email = updates.email as string
        if (updates.passwordHash !== undefined) user.passwordHash = updates.passwordHash as string
        if (updates.displayName !== undefined) user.displayName = updates.displayName as string
        await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
        return NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, isEnvAdmin: false },
        }, { headers: { "Cache-Control": "no-store, max-age=0" } })
      }

      await db.update(adminUsers).set(updates).where(eq(adminUsers.id, currentUser.id))
      void syncAdminUsersSnapshotFromDb()

      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Me PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Uuendamine ebaõnnestus" }), 500)
    }
  }, true)
}
