import { NextRequest, NextResponse } from "next/server"
import { validateAdminRequest, unauthorizedResponse, noStoreResponse } from "@/lib/auth"
import { withRateLimit } from "@/lib/rate-limit"
import { verifySameOrigin } from "@/lib/csrf"
import { sanitizeHtml } from "@/lib/sanitize"
import {
  getAllAnnouncements,
  upsertAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcements"

interface Announcement {
  id: string
  title: string
  subtitle: string
  publishedDate: string
  offerNumber: string
  company: string
  registryCode: string
  website: string
  companyDescription: string
  tasks: string
  requirements: string
  benefits: string
  location: string
  vacancies: number
  salary: number
  salaryUnit: string
  salaryDetails: string
  workTime: string
  workTimeDetails: string
  startDate: string
  applicationDeadline: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactPhone2: string
  contactEmail: string
  active: boolean
  slug: string
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()

      const announcements = await getAllAnnouncements()
      return NextResponse.json({ announcements }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Toole GET error:", error)
      return NextResponse.json({ announcements: [] }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    }
  })
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const body = await request.json()
      const { id, fields } = body as { id: string; fields: Partial<Announcement> }
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const safeFields = sanitizeAnnouncementFields(fields)
      const now = new Date()

      const defaultsProvider = (): Omit<Announcement, "id"> => ({
        title: "",
        subtitle: "",
        publishedDate: new Date().toISOString().split("T")[0],
        offerNumber: "",
        company: "SP Service OÜ",
        registryCode: "11312978",
        website: "https://spsgrupp.ee/",
        companyDescription: "Ettevõtte põhitegevusala on tööjõu renditeenuse osutamine, keskendudes eeskätt puhastus- ja hooldusteenuste valdkonna tööjõu pakkumisele.",
        tasks: "",
        requirements: "<ul><li>Korrektsus ja kohusetundlikkus</li><li>Hea füüsiline vorm ja tervis</li><li>Valmisolek töötada graafiku alusel</li><li>Ausus ja usaldusväärsus</li><li>Iseseisvus ja omaalgatusvõime</li><li>Eesti keele oskus suhtlustasandil</li></ul>",
        benefits: "<p><strong>Pakume Sulle:</strong></p><ul><li>Väljaõpet ja täiendkoolitusi</li><li>Õigeaegset töötasu</li><li>Kaasaegseid ja ergonoomilisi töövahendeid</li><li>Tunnustust pikaajalise panuse eest</li><li>Rahalist toetust erijuhtudel</li><li>Sotsiaalset kaitset ja kindlustunnet</li><li>Tervisekontrolli vastavalt töö iseloomule</li><li>Mugavaid ja kvaliteetseid tööriideid</li></ul>",
        location: "",
        vacancies: 1,
        salary: 0,
        salaryUnit: "EUR",
        salaryDetails: "",
        workTime: "",
        workTimeDetails: "",
        startDate: "",
        applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
        contactName: "Jelena Smirnov",
        contactRole: "Personalispetsialist",
        contactPhone: "56 820 520",
        contactPhone2: "6623 328",
        contactEmail: "personal@spsgrupp.ee",
        active: true,
        slug: "",
      })

      const announcement = await upsertAnnouncement(id, safeFields as Partial<Announcement>, defaultsProvider)

      return NextResponse.json({
        success: true,
        announcement,
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Toole PUT error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to save announcement" }), 500)
    }
  }, true)
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      if (!(await validateAdminRequest())) return unauthorizedResponse()
      if (!verifySameOrigin(request)) {
        return noStoreResponse(JSON.stringify({ error: "Invalid origin" }), 403)
      }

      const id = request.nextUrl.searchParams.get("id")
      if (!id) return noStoreResponse(JSON.stringify({ error: "id required" }), 400)

      const ok = await deleteAnnouncement(id)

      return NextResponse.json({ success: ok }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      })
    } catch (error) {
      console.error("Toole DELETE error:", error)
      return noStoreResponse(JSON.stringify({ error: "Failed to delete announcement" }), 500)
    }
  }, true)
}

function sanitizeAnnouncementFields(fields: Partial<Announcement>): Partial<Announcement> {
  const safe: Partial<Announcement> = {}

  if (fields.title !== undefined) safe.title = String(fields.title).slice(0, 500).replace(/[<>]/g, "")
  if (fields.subtitle !== undefined) safe.subtitle = String(fields.subtitle).slice(0, 500).replace(/[<>]/g, "")
  if (fields.publishedDate !== undefined) safe.publishedDate = String(fields.publishedDate).slice(0, 20)
  if (fields.offerNumber !== undefined) safe.offerNumber = String(fields.offerNumber).slice(0, 100).replace(/[<>]/g, "")
  if (fields.company !== undefined) safe.company = String(fields.company).slice(0, 200).replace(/[<>]/g, "")
  if (fields.registryCode !== undefined) safe.registryCode = String(fields.registryCode).slice(0, 20).replace(/[^0-9]/g, "")
  if (fields.website !== undefined) {
    const url = String(fields.website).trim()
    if (url.startsWith("https://") || url.startsWith("/")) safe.website = url.slice(0, 500)
    else safe.website = ""
  }
  if (fields.companyDescription !== undefined) safe.companyDescription = sanitizeHtml(String(fields.companyDescription).slice(0, 10000))
  if (fields.tasks !== undefined) safe.tasks = sanitizeHtml(String(fields.tasks).slice(0, 50000))
  if (fields.requirements !== undefined) safe.requirements = sanitizeHtml(String(fields.requirements).slice(0, 50000))
  if (fields.benefits !== undefined) safe.benefits = sanitizeHtml(String(fields.benefits).slice(0, 50000))
  if (fields.location !== undefined) safe.location = String(fields.location).slice(0, 200).replace(/[<>]/g, "")
  if (fields.vacancies !== undefined) safe.vacancies = Math.min(Math.max(Number(fields.vacancies) || 0, 0), 999999)
  if (fields.salary !== undefined) safe.salary = Math.min(Math.max(Number(fields.salary) || 0, 0), 99999999)
  if (fields.salaryUnit !== undefined) safe.salaryUnit = String(fields.salaryUnit).slice(0, 10).replace(/[<>]/g, "")
  if (fields.salaryDetails !== undefined) safe.salaryDetails = String(fields.salaryDetails).slice(0, 500).replace(/[<>]/g, "")
  if (fields.workTime !== undefined) safe.workTime = String(fields.workTime).slice(0, 200).replace(/[<>]/g, "")
  if (fields.workTimeDetails !== undefined) safe.workTimeDetails = String(fields.workTimeDetails).slice(0, 500).replace(/[<>]/g, "")
  if (fields.startDate !== undefined) safe.startDate = String(fields.startDate).slice(0, 20)
  if (fields.applicationDeadline !== undefined) safe.applicationDeadline = String(fields.applicationDeadline).slice(0, 20)
  if (fields.contactName !== undefined) safe.contactName = String(fields.contactName).slice(0, 200).replace(/[<>]/g, "")
  if (fields.contactRole !== undefined) safe.contactRole = String(fields.contactRole).slice(0, 200).replace(/[<>]/g, "")
  if (fields.contactPhone !== undefined) safe.contactPhone = String(fields.contactPhone).slice(0, 50).replace(/[<>]/g, "")
  if (fields.contactPhone2 !== undefined) safe.contactPhone2 = String(fields.contactPhone2).slice(0, 50).replace(/[<>]/g, "")
  if (fields.contactEmail !== undefined) safe.contactEmail = String(fields.contactEmail).slice(0, 200).replace(/[<>]/g, "")
  if (fields.active !== undefined) safe.active = !!fields.active
  if (fields.slug !== undefined) safe.slug = String(fields.slug).slice(0, 200).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_-]/g, "")

  return safe
}
