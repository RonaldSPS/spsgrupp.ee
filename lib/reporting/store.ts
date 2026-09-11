/**
 * Storage for weekly marketing reports. Primary: weekly_reports table
 * (migration drizzle/0010). Fallback: data/weekly-reports.json when
 * DATABASE_URL is unset or the DB is unreachable (same pattern as
 * lib/form-submissions.ts). One report per week — re-generating the same
 * week upserts (replaces) it.
 */

import type { Insight, ReportSnapshot, StoredReport } from "./types"

const MAX_STORED = 156 // ~3 years of weekly reports

async function jsonFilePath(): Promise<string> {
  const path = await import("path")
  return path.join(process.cwd(), "data", "weekly-reports.json")
}

async function readJsonReports(): Promise<StoredReport[]> {
  const { promises: fs } = await import("fs")
  try {
    const raw = await fs.readFile(await jsonFilePath(), "utf-8")
    const parsed = JSON.parse(raw)
    const rows = Array.isArray(parsed) ? parsed : parsed?.reports
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

async function writeJsonReports(rows: StoredReport[]): Promise<void> {
  const { promises: fs } = await import("fs")
  const path = await import("path")
  const file = await jsonFilePath()
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, JSON.stringify({ reports: rows }, null, 2), "utf-8")
}

interface ReportRowShape {
  id: number
  weekStart: string
  weekEnd: string
  createdAt: Date
  snapshot: unknown
  insights: unknown
  narrative: string
  emailSentAt: Date | null
  emailError: string
}

function rowToReport(row: ReportRowShape): StoredReport {
  return {
    id: row.id,
    weekStart: row.weekStart,
    weekEnd: row.weekEnd,
    createdAt: row.createdAt.toISOString(),
    snapshot: row.snapshot as ReportSnapshot,
    insights: (Array.isArray(row.insights) ? row.insights : []) as Insight[],
    narrative: row.narrative ?? "",
    emailSentAt: row.emailSentAt ? row.emailSentAt.toISOString() : null,
    emailError: row.emailError ?? "",
  }
}

export interface SaveReportInput {
  weekStart: string
  weekEnd: string
  snapshot: ReportSnapshot
  insights: Insight[]
  narrative: string
}

/** Insert or replace the report for the given week. Returns the stored row. */
export async function saveWeeklyReport(input: SaveReportInput): Promise<StoredReport> {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { weeklyReports } = await import("@/lib/db/schema")
      const { sql } = await import("drizzle-orm")
      const rows = await db
        .insert(weeklyReports)
        .values({
          weekStart: input.weekStart,
          weekEnd: input.weekEnd,
          snapshot: input.snapshot,
          insights: input.insights,
          narrative: input.narrative,
        })
        .onConflictDoUpdate({
          target: [weeklyReports.weekStart, weeklyReports.weekEnd],
          set: {
            snapshot: sql`excluded.snapshot`,
            insights: sql`excluded.insights`,
            narrative: sql`excluded.narrative`,
            createdAt: new Date(),
            emailSentAt: null,
            emailError: "",
          },
        })
        .returning()
      return rowToReport(rows[0] as ReportRowShape)
    } catch (error) {
      console.error("DB report save failed, falling back to JSON storage:", error)
    }
  }

  const rows = await readJsonReports()
  const nextId = rows.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1
  const report: StoredReport = {
    id: nextId,
    weekStart: input.weekStart,
    weekEnd: input.weekEnd,
    createdAt: new Date().toISOString(),
    snapshot: input.snapshot,
    insights: input.insights,
    narrative: input.narrative,
    emailSentAt: null,
    emailError: "",
  }
  const rest = rows.filter((r) => !(r.weekStart === input.weekStart && r.weekEnd === input.weekEnd))
  rest.unshift(report)
  await writeJsonReports(rest.slice(0, MAX_STORED))
  return report
}

/** Newest first. `limit` guards the JSON fallback file growth on reads. */
export async function listWeeklyReports(limit = 104): Promise<StoredReport[]> {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { weeklyReports } = await import("@/lib/db/schema")
      const { desc } = await import("drizzle-orm")
      const rows = await db.select().from(weeklyReports).orderBy(desc(weeklyReports.weekEnd)).limit(limit)
      return rows.map((r) => rowToReport(r as ReportRowShape))
    } catch (error) {
      console.error("DB report list failed, falling back to JSON storage:", error)
    }
  }
  const rows = await readJsonReports()
  return rows
    .sort((a, b) => b.weekEnd.localeCompare(a.weekEnd))
    .slice(0, limit)
}

export async function getWeeklyReport(id: number): Promise<StoredReport | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { weeklyReports } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      const rows = await db.select().from(weeklyReports).where(eq(weeklyReports.id, id)).limit(1)
      return rows[0] ? rowToReport(rows[0] as ReportRowShape) : null
    } catch (error) {
      console.error("DB report read failed, falling back to JSON storage:", error)
    }
  }
  const rows = await readJsonReports()
  return rows.find((r) => Number(r.id) === Number(id)) ?? null
}

/** Delete reports by id. Returns the number of deleted rows. */
export async function deleteWeeklyReports(ids: number[]): Promise<number> {
  const unique = [...new Set(ids)]
  if (unique.length === 0) return 0
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { weeklyReports } = await import("@/lib/db/schema")
      const { inArray } = await import("drizzle-orm")
      const rows = await db
        .delete(weeklyReports)
        .where(inArray(weeklyReports.id, unique))
        .returning({ id: weeklyReports.id })
      return rows.length
    } catch (error) {
      console.error("DB report delete failed, falling back to JSON storage:", error)
    }
  }
  const rows = await readJsonReports()
  const keep = rows.filter((r) => !unique.includes(Number(r.id)))
  await writeJsonReports(keep)
  return rows.length - keep.length
}

export async function markReportEmailSent(id: number, error?: string): Promise<void> {
  const sentAt = error ? null : new Date()
  const errorText = error ?? ""
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db")
      const { weeklyReports } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      await db.update(weeklyReports).set({ emailSentAt: sentAt, emailError: errorText }).where(eq(weeklyReports.id, id))
      return
    } catch (err) {
      console.error("DB report email-mark failed, falling back to JSON storage:", err)
    }
  }
  const rows = await readJsonReports()
  const row = rows.find((r) => Number(r.id) === Number(id))
  if (row) {
    row.emailSentAt = sentAt ? sentAt.toISOString() : null
    row.emailError = errorText
    await writeJsonReports(rows)
  }
}

/** Report e-mail recipients: admin setting `report_email_recipients`, fallback ronald@outline.ee. */
export async function getReportRecipients(): Promise<string> {
  try {
    if (process.env.DATABASE_URL) {
      const { db } = await import("@/lib/db")
      const { systemSettings } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")
      const rows = await db.select().from(systemSettings).where(eq(systemSettings.key, "report_email_recipients"))
      if (rows[0]?.value) return rows[0].value
    } else {
      const { promises: fs } = await import("fs")
      const path = await import("path")
      const raw = await fs.readFile(path.join(process.cwd(), "data", "admin-settings.json"), "utf-8")
      const data = JSON.parse(raw)
      if (data.settings?.report_email_recipients) return data.settings.report_email_recipients
    }
  } catch {
    // fallback
  }
  return "ronald@outline.ee"
}
