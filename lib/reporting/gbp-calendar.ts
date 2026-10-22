/**
 * GBP + sisu avaldamise kalender (kliendi palve 21.10.2026): iganädalased
 * GBP-postitused (valmis tekst + CTA-link), kahenädalased foto-ülesanded ja
 * püsitoimetused (arvustuste kontroll, review-link, Q&A, Performance).
 *
 * Andmeallikas on data/gbp-calendar.json (committitud sisu, MITTE fallback).
 * Loetakse dünaamilise fs-iga nagu changes.ts — serverless'is peab fail olema
 * kaasatud next.config outputFileTracingIncludes kaudu.
 *
 * Kalender algab 26.10.2026 (12 nädalat); pärast lõppu keerleb nädalate
 * rotatsiooniga edasi (faili tuleks kvartaalselt uuendada).
 */

export interface GbpWeekPost {
  text: string
  ctaUrl: string
  photoIdea: string
}

export interface GbpCalendarWeek {
  weekStart: string // ISO date (esmaspäev)
  theme: string
  blogTopic: string | null
  post: GbpWeekPost
  photoTask: string | null
  done?: string
}

export interface GbpCalendar {
  updatedAt: string
  startMonday: string
  rhythm: Record<string, string>
  reviewLink: string
  standingTasks: string[]
  weeks: GbpCalendarWeek[]
  rotationNote?: string
}

/** data/gbp-calendar.json lugemine; null kui puudub või katki (sektsioon jääb vahele). */
export async function loadGbpCalendar(): Promise<GbpCalendar | null> {
  try {
    const { promises: fs } = await import("fs")
    const path = await import("path")
    const raw = await fs.readFile(path.join(process.cwd(), "data", "gbp-calendar.json"), "utf-8")
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.weeks) || parsed.weeks.length === 0) return null
    return parsed as GbpCalendar
  } catch {
    return null
  }
}

function mondayOf(d: Date): Date {
  const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = (m.getUTCDay() + 6) % 7 // esmaspäev=0
  m.setUTCDate(m.getUTCDate() - day)
  return m
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export interface GbpWeekTasks {
  /** Kalendrinädala algus, millele ülesanded kuuluvad. */
  weekStart: string
  weekEnd: string
  week: GbpCalendarWeek
  /** True kui kalender on läbi ja kirje on rotatsioonist. */
  rotated: boolean
}

/**
 * Tagastab JÄRGMISE töönädala (raporti koostamise nädalale järgneva) kalendrikirje —
 * raport saabub reedel, GBP-postitus avaldatakse E–K, seega meeldetuletus peab
 * olema eelmise nädala lõpus. Kui kalender on läbi, keerleb rotatsiooniga edasi.
 */
export function getGbpWeekTasks(now: Date, calendar: GbpCalendar): GbpWeekTasks {
  const nextMonday = mondayOf(now)
  nextMonday.setUTCDate(nextMonday.getUTCDate() + 7)
  const start = new Date(calendar.startMonday + "T00:00:00.000Z")
  const weekMs = 7 * 24 * 3600 * 1000
  const idx = Math.floor((nextMonday.getTime() - start.getTime()) / weekMs)
  const rotated = idx >= calendar.weeks.length
  const week = calendar.weeks[((idx % calendar.weeks.length) + calendar.weeks.length) % calendar.weeks.length]
  const weekEnd = new Date(nextMonday.getTime() + 6 * 24 * 3600 * 1000)
  return { weekStart: isoDate(nextMonday), weekEnd: isoDate(weekEnd), week, rotated }
}
