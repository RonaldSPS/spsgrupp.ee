import type { MetadataRoute } from "next"
import { promises as fs } from "fs"
import path from "path"
import { getBlogPostsWithEdits } from "@/app/blog/data"

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
      "utf-8"
    )
    const data = JSON.parse(raw)
    return (data.announcements || []).filter((a: JobAnnouncement) => a.active && a.slug)
  } catch {
    return []
  }
}

async function getLatestEditDate(...dataPaths: string[]): Promise<Date> {
  let latest = new Date(0)
  for (const dp of dataPaths) {
    try {
      const stat = await fs.stat(path.join(process.cwd(), dp))
      if (stat.mtime > latest) latest = stat.mtime
    } catch {}
  }
  return latest > new Date(0) ? latest : new Date("2024-01-01")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const postsWithEdits = await getBlogPostsWithEdits()

  const koristusDate = await getLatestEditDate(
    "app/koristusteenus/layout.tsx",
    "app/koristusteenus/page.tsx",
    "data/admin-blog-edits.json",
  )
  const valikoristusDate = await getLatestEditDate(
    "app/koristusteenus/valikoristus/layout.tsx",
    "app/koristusteenus/valikoristus/page.tsx",
  )

  entries.push({ url: BASE_URL, lastModified: new Date("2024-01-01"), changeFrequency: "weekly", priority: 1 })

  entries.push({
    url: `${BASE_URL}/koristusteenus`,
    lastModified: koristusDate,
    changeFrequency: "weekly",
    priority: 0.9,
  })

  const sisekoristusPages = [
    "kontori-koristus",
    "kaubanduspindade-koristus",
    "tootmishoonete-koristus",
    "koolide-koristamine",
  ]
  for (const slug of sisekoristusPages) {
    const d = await getLatestEditDate(
      `app/koristusteenus/${slug}/layout.tsx`,
      `app/koristusteenus/${slug}/page.tsx`,
    )
    entries.push({
      url: `${BASE_URL}/koristusteenus/${slug}`,
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.9,
    })
  }

  entries.push({
    url: `${BASE_URL}/koristusteenus/valikoristus`,
    lastModified: valikoristusDate,
    changeFrequency: "weekly",
    priority: 0.9,
  })

  const valikoristusPages = [
    "akende-pesu",
    "fassaadipesu",
    "grafiti-eemaldamine",
    "kojameheteenus",
    "lehtedekoristamine",
    "lumekoristus",
    "muruniitmine",
    "tanavakivide-pesu-ja-hooldus",
  ]
  for (const slug of valikoristusPages) {
    const d = await getLatestEditDate(
      `app/koristusteenus/valikoristus/${slug}/layout.tsx`,
      `app/koristusteenus/valikoristus/${slug}/page.tsx`,
    )
    entries.push({
      url: `${BASE_URL}/koristusteenus/valikoristus/${slug}`,
      lastModified: d,
      changeFrequency: "weekly",
      priority: slug === "lumekoristus" || slug === "tanavakivide-pesu-ja-hooldus" ? 0.85 : 0.9,
    })
  }

  const puhastusDate = await getLatestEditDate(
    "app/puhastusteenused/layout.tsx",
    "app/puhastusteenused/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/puhastusteenused`,
    lastModified: puhastusDate,
    changeFrequency: "weekly",
    priority: 0.9,
  })

  const puhastusPages = [
    "ehitusjargne-koristus",
    "desinfitseerimine",
    "eskalaatorite-suvapuhastus",
    "suitsu-ja-tulekahjustuste-puhastamine",
    "porandate-hooldus",
    "vaipade-puhastus",
  ]
  for (const slug of puhastusPages) {
    const d = await getLatestEditDate(
      `app/puhastusteenused/${slug}/layout.tsx`,
      `app/puhastusteenused/${slug}/page.tsx`,
    )
    entries.push({
      url: `${BASE_URL}/puhastusteenused/${slug}`,
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.85,
    })
  }

  const remontDate = await getLatestEditDate(
    "app/remonditeenused-tallinnas/layout.tsx",
    "app/remonditeenused-tallinnas/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/remonditeenused-tallinnas`,
    lastModified: remontDate,
    changeFrequency: "weekly",
    priority: 0.9,
  })

  const remontPages = [
    "elektritood",
    "katuse-remont",
    "lammutustood",
    "plaatimistood",
    "sanitaarremont-ja-umberehitus",
    "siseviimistlustood",
    "torutood",
    "ventilatsioonide-ehitus-ja-hooldus",
  ]
  for (const slug of remontPages) {
    const d = await getLatestEditDate(
      `app/remonditeenused-tallinnas/${slug}/layout.tsx`,
      `app/remonditeenused-tallinnas/${slug}/page.tsx`,
    )
    entries.push({
      url: `${BASE_URL}/remonditeenused-tallinnas/${slug}`,
      lastModified: d,
      changeFrequency: "weekly",
      priority: 0.85,
    })
  }

  const ehitushrahtDate = await getLatestEditDate(
    "app/ehitusprahi-aravedu/layout.tsx",
    "app/ehitusprahi-aravedu/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/ehitusprahi-aravedu`,
    lastModified: ehitushrahtDate,
    changeFrequency: "weekly",
    priority: 0.85,
  })

  const spsGruppDate = await getLatestEditDate(
    "app/sps-grupp/layout.tsx",
    "app/sps-grupp/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/sps-grupp`,
    lastModified: spsGruppDate,
    changeFrequency: "monthly",
    priority: 0.9,
  })

  const arvamusedDate = await getLatestEditDate(
    "app/sps-grupp/arvamused/layout.tsx",
    "app/sps-grupp/arvamused/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/sps-grupp/arvamused`,
    lastModified: arvamusedDate,
    changeFrequency: "monthly",
    priority: 0.8,
  })

  const privaatsusDate = await getLatestEditDate(
    "app/privaatsus/layout.tsx",
    "app/privaatsus/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/privaatsus`,
    lastModified: privaatsusDate,
    changeFrequency: "monthly",
    priority: 0.5,
  })

  entries.push({
    url: `${BASE_URL}/tule-meile-toole`,
    lastModified: await getLatestEditDate("app/tule-meile-toole/layout.tsx", "app/tule-meile-toole/page.tsx"),
    changeFrequency: "monthly",
    priority: 0.8,
  })

  const jobs = await getActiveJobs()
  for (const job of jobs) {
    entries.push({
      url: `${BASE_URL}/tule-meile-toole/${job.slug}`,
      lastModified: new Date(job.publishedDate),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  const kontaktDate = await getLatestEditDate(
    "app/kontakt/layout.tsx",
    "app/kontakt/page.tsx",
  )
  entries.push({
    url: `${BASE_URL}/kontakt`,
    lastModified: kontaktDate,
    changeFrequency: "monthly",
    priority: 0.9,
  })

  entries.push({
    url: `${BASE_URL}/blog`,
    lastModified: await getLatestEditDate("app/blog/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.8,
  })

  for (const post of postsWithEdits) {
    const postDate = new Date(post.date)
    const finalSlug = post.slug
    entries.push({
      url: `${BASE_URL}/blog/${finalSlug}`,
      lastModified: isNaN(postDate.getTime()) ? new Date() : postDate,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  return entries
}
