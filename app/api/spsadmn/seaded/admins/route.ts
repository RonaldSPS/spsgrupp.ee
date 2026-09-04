import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse, getCurrentAdminUser, hashAdminPassword, requireAdminRole } from "@/lib/auth"
import { syncAdminUsersSnapshotFromDb } from "@/lib/admin-users-snapshot"
import { sendEmail } from "@/lib/email"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"

const JSON_PATH = path.join(process.cwd(), "data", "admin-users.json")

interface AdminUserJson {
  id: number
  email: string
  passwordHash: string
  displayName: string
  role: string
  active: boolean
}

interface AdminUsersJson {
  users: AdminUserJson[]
}

let _nextId = 0

async function readUsersJson(): Promise<AdminUsersJson> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return { users: [] }
  }
}

async function writeUsersJson(data: AdminUsersJson): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      if (!process.env.DATABASE_URL) {
        const data = await readUsersJson()
        const users = data.users.map((u) => ({
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          role: u.role,
          active: u.active,
        }))
        return NextResponse.json({ users }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const rows = await db.select().from(adminUsers).orderBy(adminUsers.id)
      const users = rows.map((r) => ({
        id: r.id,
        email: r.email,
        displayName: r.displayName,
        role: r.role,
        active: r.active,
      }))
      return NextResponse.json({ users }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Admin users GET error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to load admin users" }), 500)
    }
  }, true)
}

/** Notify the newly created user about their account. Failures only log - user creation must not fail because of email. */
async function sendNewUserNotice(email: string, password: string, role: string, origin: string): Promise<boolean> {
  const result = await sendEmail({
    to: email,
    subject: "SPS Grupi halduspaneeli konto on loodud",
    text: [
      "Tere!",
      "",
      "Sinule on loodud SPS Grupi veebilehe halduspaneeli konto.",
      "",
      `E-mail: ${email}`,
      `Parool: ${password}`,
      `Roll: ${role === "admin" ? "Admin" : "Manager"}`,
      "",
      `Logi sisse: ${origin}/spsadmn/`,
      "",
      "Küsimuste korral võta ühendust peaadministraatoriga.",
    ].join("\n"),
  })
  if (!result.success) {
    console.error("New admin user notice email failed:", result.error)
  }
  return result.success
}

export async function POST(request: Request) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const body = await request.json()
      const { email, password, displayName, role } = body as {
        email: string
        password: string
        displayName?: string
        role: string
      }

      if (!email || !password) {
        return noStoreResponse(JSON.stringify({ error: "email ja parool on kohustuslikud" }), 400)
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return noStoreResponse(JSON.stringify({ error: "Vigane e-maili aadress" }), 400)
      }

      if (password.length < 6) {
        return noStoreResponse(JSON.stringify({ error: "Parool peab olema vähemalt 6 tähemärki" }), 400)
      }

      const validRoles = ["admin", "manager"]
      const safeRole = validRoles.includes(role) ? role : "manager"
      const safeEmail = email.trim().toLowerCase().slice(0, 254)
      const rawName = (displayName || "").trim()
      const safeName = rawName
        ? rawName.slice(0, 200)
        : safeEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 200)

      if (!process.env.DATABASE_URL) {
        const data = await readUsersJson()
        if (_nextId === 0) {
          for (const u of data.users) {
            if (u.id >= _nextId) _nextId = u.id + 1
          }
        }
        const newUser: AdminUserJson = {
          id: ++_nextId,
          email: safeEmail,
          passwordHash: hashAdminPassword(password),
          displayName: safeName,
          role: safeRole,
          active: true,
        }
        data.users.push(newUser)
        await writeUsersJson(data)
        const emailSent = await sendNewUserNotice(newUser.email, password, newUser.role, new URL(request.url).origin)
        return NextResponse.json({
          success: true,
          emailSent,
          user: { id: newUser.id, email: newUser.email, displayName: newUser.displayName, role: newUser.role, active: newUser.active },
        }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const [inserted] = await db.insert(adminUsers).values({
        email: safeEmail,
        passwordHash: hashAdminPassword(password),
        displayName: safeName,
        role: safeRole,
        active: true,
      }).returning()
      void syncAdminUsersSnapshotFromDb()

      const emailSent = await sendNewUserNotice(inserted.email, password, inserted.role, new URL(request.url).origin)

      return NextResponse.json({
        success: true,
        emailSent,
        user: {
          id: inserted.id,
          email: inserted.email,
          displayName: inserted.displayName,
          role: inserted.role,
          active: inserted.active,
        },
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Admin users POST error:", error)
      return noStoreResponse(JSON.stringify({ error: "Kasutaja loomine ebaõnnestus" }), 500)
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

      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const body = await request.json()
      const { id, fields } = body as {
        id: number
        fields: { email?: string; password?: string; displayName?: string; role?: string; active?: boolean }
      }

      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const currentUser = await getCurrentAdminUser()
      if (currentUser && currentUser.id === id && fields.role === "manager") {
        return noStoreResponse(JSON.stringify({ error: "Enda rolli ei saa muuta" }), 400)
      }

      if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        return noStoreResponse(JSON.stringify({ error: "Vigane e-maili aadress" }), 400)
      }

      const validRoles = ["admin", "manager"]

      if (!process.env.DATABASE_URL) {
        const data = await readUsersJson()
        const idx = data.users.findIndex((u) => u.id === id)
        if (idx === -1) return noStoreResponse(JSON.stringify({ error: "Kasutajat ei leitud" }), 404)

        const user = data.users[idx]
        if (fields.email !== undefined) user.email = fields.email.trim().toLowerCase().slice(0, 254)
        if (fields.password !== undefined) user.passwordHash = hashAdminPassword(fields.password)
        if (fields.displayName !== undefined) user.displayName = fields.displayName.trim().slice(0, 200)
        if (fields.role !== undefined && validRoles.includes(fields.role)) user.role = fields.role
        if (fields.active !== undefined) user.active = fields.active
        await writeUsersJson(data)

        return NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, active: user.active },
        }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      const updates: Record<string, unknown> = { updatedAt: new Date() }
      if (fields.email !== undefined) updates.email = fields.email.trim().toLowerCase().slice(0, 254)
      if (fields.password !== undefined) updates.passwordHash = hashAdminPassword(fields.password)
      if (fields.displayName !== undefined) updates.displayName = fields.displayName.trim().slice(0, 200)
      if (fields.role !== undefined && validRoles.includes(fields.role)) updates.role = fields.role
      if (fields.active !== undefined) updates.active = fields.active

      await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id))
      void syncAdminUsersSnapshotFromDb()

      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Admin users PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Kasutaja uuendamine ebaõnnestus" }), 500)
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

      const roleCheck = await requireAdminRole()
      if (roleCheck) return roleCheck

      const { searchParams } = new URL(request.url)
      const id = parseInt(searchParams.get("id") || "", 10)
      if (!id || isNaN(id)) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const currentUser = await getCurrentAdminUser()
      if (currentUser && currentUser.id === id) {
        return noStoreResponse(JSON.stringify({ error: "Enda kontot ei saa kustutada" }), 400)
      }

      if (!process.env.DATABASE_URL) {
        const data = await readUsersJson()
        const idx = data.users.findIndex((u) => u.id === id)
        if (idx === -1) return noStoreResponse(JSON.stringify({ error: "Kasutajat ei leitud" }), 404)
        data.users.splice(idx, 1)
        await writeUsersJson(data)
        return NextResponse.json({ success: true }, {
          headers: { "Cache-Control": "no-store, max-age=0" },
        })
      }

      await db.delete(adminUsers).where(eq(adminUsers.id, id))
      void syncAdminUsersSnapshotFromDb()
      return NextResponse.json({ success: true }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Admin users DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Kasutaja kustutamine ebaõnnestus" }), 500)
    }
  }, true)
}
