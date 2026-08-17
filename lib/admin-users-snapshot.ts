/**
 * Local JSON snapshot of the admin_users table. Lets admin login survive a
 * Supabase outage: when the DB read fails, auth falls back to this snapshot.
 * Contains password hashes, so the file is gitignored and never committed —
 * on Vercel the env ADMIN_PASSWORD login remains the no-DB backdoor.
 */
import { promises as fs } from "fs"
import path from "path"

export interface AdminUserSnapshot {
  id: number
  email: string
  passwordHash: string
  displayName: string
  role: string
  active: boolean
}

const JSON_PATH = path.join(process.cwd(), "data", "admin-users.json")

export async function readAdminUsersSnapshot(): Promise<AdminUserSnapshot[] | null> {
  try {
    const raw = await fs.readFile(JSON_PATH, "utf-8")
    const data = JSON.parse(raw)
    return Array.isArray(data?.users) ? (data.users as AdminUserSnapshot[]) : null
  } catch {
    return null
  }
}

export async function writeAdminUsersSnapshot(users: AdminUserSnapshot[]): Promise<void> {
  await fs.mkdir(path.dirname(JSON_PATH), { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify({ users }, null, 2), "utf-8")
}

/** Best-effort: refresh the snapshot from the DB after an admin-user mutation. */
export async function syncAdminUsersSnapshotFromDb(): Promise<void> {
  if (!process.env.DATABASE_URL) return
  try {
    const { db } = await import("@/lib/db")
    const { adminUsers } = await import("@/lib/db/schema")
    const rows = await db.select().from(adminUsers).orderBy(adminUsers.id)
    await writeAdminUsersSnapshot(rows.map((r) => ({
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      displayName: r.displayName,
      role: r.role,
      active: r.active,
    })))
  } catch {
    // snapshot is best-effort; the DB remains the source of truth
  }
}
