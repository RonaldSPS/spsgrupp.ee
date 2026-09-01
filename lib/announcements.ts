import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { jobAnnouncements } from "@/lib/db/schema"
import type { Announcement } from "./types"
import { getJobTranslationBySlug, type JobTranslationRow } from "@/lib/translate-jobs"
import type { TranslationLanguage } from "@/lib/ai-translation"

const JSON_PATH = path.join(process.cwd(), "data", "admin-toole-announcements.json")

async function jsonFileExists(): Promise<boolean> {
  try {
    await fs.access(JSON_PATH)
    return true
  } catch {
    return false
  }
}

const DB_READ_TIMEOUT_MS = 2500

function withReadTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Announcements database read timed out")),
      DB_READ_TIMEOUT_MS,
    )
    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error) => {
        clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

export async function getAnnouncementsFromDb(): Promise<Announcement[]> {
  const rows = await withReadTimeout(db.select().from(jobAnnouncements))
  return rows as unknown as Announcement[]
}

export async function getAnnouncementsFromJson(): Promise<Announcement[]> {
  const raw = await fs.readFile(JSON_PATH, "utf-8")
  const data = JSON.parse(raw)
  return (data.announcements || []) as Announcement[]
}

export async function saveAnnouncementsToJson(announcements: Announcement[]): Promise<void> {
  const dir = path.dirname(JSON_PATH)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(JSON_PATH, JSON.stringify({ announcements }, null, 2), "utf-8")
}

async function withDbOrJson<T>(
  dbFn: () => Promise<T>,
  jsonFn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await dbFn()
  } catch {
    try {
      if (await jsonFileExists()) return await jsonFn()
    } catch {
      // JSON also failed
    }
    return fallback
  }
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  return withDbOrJson(
    async () => {
      const rows = await getAnnouncementsFromDb()
      rows.sort((a, b) =>
        new Date(b.updatedAt ?? b.publishedDate).getTime() -
        new Date(a.updatedAt ?? a.publishedDate).getTime()
      )
      if (rows.length > 0) return rows
      if (await jsonFileExists()) return await getAnnouncementsFromJson()
      return []
    },
    async () => await getAnnouncementsFromJson(),
    [],
  )
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const dbResult = await getAnnouncementsFromDb()
    if (dbResult.length > 0) return dbResult.sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    if (await jsonFileExists()) return await getAnnouncementsFromJson()
    return []
  } catch {
    try {
      if (await jsonFileExists()) return await getAnnouncementsFromJson()
    } catch {
      // empty
    }
    return []
  }
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const all = await getAnnouncements()
  return all.filter((a) => a.active === true)
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | undefined> {
  return withDbOrJson(
    async () => {
      // withReadTimeout: without it a paused/slow Supabase connection hangs the
      // job page render indefinitely (observed >15 s during a pause, 2026-09).
      const rows = await withReadTimeout(
        db.select()
          .from(jobAnnouncements)
          .where(eq(jobAnnouncements.slug, slug))
          .limit(1)
      )
      if (rows.length > 0) return rows[0] as unknown as Announcement
      if (await jsonFileExists()) {
        const all = await getAnnouncementsFromJson()
        return all.find((a) => a.slug === slug && a.active) as Announcement | undefined
      }
      return undefined
    },
    async () => {
      const all = await getAnnouncementsFromJson()
      return all.find((a) => a.slug === slug && a.active) as Announcement | undefined
    },
    undefined,
  )
}

export async function getTranslatedAnnouncementBySlug(
  language: TranslationLanguage,
  slug: string,
): Promise<Announcement | undefined> {
  try {
    const translation = await getJobTranslationBySlug(language, slug)
    if (!translation || translation.status === "stale") return undefined
    const all = await getAnnouncements()
    const source = all.find((announcement) => announcement.id === translation.jobId && announcement.active)
    if (!source) return undefined
    return applyJobTranslation(source, translation)
  } catch {
    return undefined
  }
}

export function applyJobTranslation(source: Announcement, translation: JobTranslationRow): Announcement {
  return {
    ...source,
    title: translation.title || source.title,
    subtitle: translation.subtitle || source.subtitle,
    companyDescription: translation.companyDescription || source.companyDescription,
    tasks: translation.tasks || source.tasks,
    requirements: translation.requirements || source.requirements,
    benefits: translation.benefits || source.benefits,
    location: translation.location || source.location,
    salaryDetails: translation.salaryDetails || source.salaryDetails,
    workTime: translation.workTime || source.workTime,
    workTimeDetails: translation.workTimeDetails || source.workTimeDetails,
    contactRole: translation.contactRole || source.contactRole,
    slug: translation.slug || source.slug,
  }
}

export async function upsertAnnouncement(
  id: string,
  fields: Partial<Announcement>,
  defaultsProvider: () => Omit<Announcement, "id">,
): Promise<Announcement | null> {
  const now = new Date()

  return withDbOrJson(
    async () => {
      const existing = await db.select()
        .from(jobAnnouncements)
        .where(eq(jobAnnouncements.id, id))
        .limit(1)

      if (existing.length > 0) {
        await db.update(jobAnnouncements).set({ ...fields, updatedAt: now } as any)
          .where(eq(jobAnnouncements.id, id))
      } else {
        const defaults = defaultsProvider()
        await db.insert(jobAnnouncements).values({
          ...defaults, id, ...fields, createdAt: now, updatedAt: now,
        } as any)
      }

      const saved = await db.select()
        .from(jobAnnouncements)
        .where(eq(jobAnnouncements.id, id))
        .limit(1)

      syncDbToJson().catch(() => {})
      return (saved[0] as unknown as Announcement) ?? null
    },
    async () => {
      const all = await getAnnouncementsFromJson()
      const idx = all.findIndex((a) => a.id === id)
      const defaults = defaultsProvider()
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...fields }
      } else {
        all.push({ id, ...defaults, ...fields } as Announcement)
      }
      await saveAnnouncementsToJson(all)
      return all.find((a) => a.id === id) ?? null
    },
    null,
  )
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  return withDbOrJson(
    async () => {
      await db.delete(jobAnnouncements).where(eq(jobAnnouncements.id, id))
      syncDbToJson().catch(() => {})
      return true
    },
    async () => {
      const all = await getAnnouncementsFromJson()
      const filtered = all.filter((a) => a.id !== id)
      await saveAnnouncementsToJson(filtered)
      return true
    },
    false,
  )
}

export async function syncDbToJson(): Promise<void> {
  try {
    const rows = await db.select().from(jobAnnouncements)
    const announcements = rows.map(r => ({ ...r })) as Announcement[]
    await saveAnnouncementsToJson(announcements)
  } catch {
    // Non-critical
  }
}

export { JSON_PATH }
