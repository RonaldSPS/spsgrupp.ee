import type { MetadataRoute } from "next"
import { promises as fs } from "fs"
import { execSync } from "child_process"
import path from "path"
import { getBlogPostsWithEdits } from "@/app/blog/data"
import { getAllPaths } from "@/lib/page-registry"
import { localizePath, type Locale } from "@/lib/slug-map"

const BASE_URL = "https://spsgrupp.ee"

interface JobAnnouncement {
  id: string
  slug: string
  active: boolean
  publishedDate: string
}

async function getActiveJobs(): Promise<JobAnnouncement[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "admin-toole-announcements.json"),
      "utf-8",
    )
    const data = JSON.parse(raw)
    return (data.announcements || []).filter((a: JobAnnouncement) => a.active && a.slug)
  } catch {
    return []
  }
}

let _editorialDatesCache: Record<string, string> | null = null

async function loadEditorialDates(): Promise<Record<string, string>> {
  if (_editorialDatesCache) return _editorialDatesCache
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "editorial-dates.json"),
      "utf-8",
    )
    _editorialDatesCache = JSON.parse(raw)
  } catch {
    _editorialDatesCache = {}
  }
  return _editorialDatesCache ?? {}
}

function getGitLastDate(filePaths: string[]): Date | null {
  try {
    const args = filePaths.map((p) => `"${p}"`).join(" ")
    const result = execSync(
      `git log --format=%ci --max-count=1 -- ${args}`,
      { cwd: process.cwd(), encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim()
    if (result && !isNaN(new Date(result).getTime())) {
      return new Date(result)
    }
  } catch {}
  return null
}

async function getEditorialDate(urlPath: string, ...filePaths: string[]): Promise<Date> {
  const gitDate = getGitLastDate(filePaths)
  if (gitDate) return gitDate

  const dates = await loadEditorialDates()
  const key = urlPath.toLowerCase()
  if (dates[key]) {
    const d = new Date(dates[key])
    if (!isNaN(d.getTime())) return d
  }

  return new Date("2025-06-01")
}

function canonicalUrl(urlPath: string): string {
  if (urlPath === "/") return BASE_URL
  return `${BASE_URL}${urlPath.replace(/\/$/, "")}/`
}

function priorityForPath(urlPath: string): number {
  if (urlPath === "/") return 1
  if (urlPath === "/kontakt" || urlPath === "/koristusteenus" || urlPath === "/sps-grupp") return 0.9
  if (urlPath.startsWith("/blog/") || urlPath.startsWith("/tule-meile-toole/")) return 0.7
  if (urlPath === "/andmekaitsetingimused") return 0.5
  return 0.8
}

function alternateLanguages(etPath: string): Record<string, string> {
  return {
    et: canonicalUrl(etPath),
    en: canonicalUrl(localizePath(etPath, "en")),
    ru: canonicalUrl(localizePath(etPath, "ru")),
    "x-default": canonicalUrl(etPath),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const seen = new Set<string>()

  async function addEntry(
    urlPath: string,
    lastModified: Date,
    alternates?: Record<string, string>,
  ) {
    const url = canonicalUrl(urlPath)
    if (seen.has(url)) return
    seen.add(url)
    entries.push({
      url,
      lastModified,
      changeFrequency: urlPath.startsWith("/blog/") ? "monthly" : "weekly",
      priority: priorityForPath(urlPath),
      alternates: alternates ? { languages: alternates } : undefined,
    })
  }

  for (const etPath of getAllPaths()) {
    const lastModified = await getEditorialDate(etPath)
    const alternates = alternateLanguages(etPath)
    await addEntry(etPath, lastModified, alternates)

    for (const locale of ["en", "ru"] as Locale[]) {
      await addEntry(localizePath(etPath, locale), lastModified, alternates)
    }
  }

  const jobs = await getActiveJobs()
  for (const job of jobs) {
    await addEntry(
      `/tule-meile-toole/${job.slug}`,
      new Date(job.publishedDate),
    )
  }

  const postsWithEdits = await getBlogPostsWithEdits()
  for (const post of postsWithEdits) {
    const postDate = new Date(post.date)
    await addEntry(
      `/blog/${post.slug}`,
      isNaN(postDate.getTime()) ? new Date() : postDate,
    )
  }

  return entries
}
