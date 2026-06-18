import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "admin-toole-announcements.json")

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
  contractType: string
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

interface AnnouncementsData {
  announcements: Announcement[]
}

async function readData(): Promise<AnnouncementsData> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return { announcements: [] }
  }
}

async function writeData(data: AnnouncementsData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, fields } = body as { id: string; fields: Partial<Announcement> }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const data = await readData()
  const idx = data.announcements.findIndex((a: Announcement) => a.id === id)

  if (idx >= 0) {
    data.announcements[idx] = { ...data.announcements[idx], ...fields }
  } else {
    const newAnnouncement: Announcement = {
      id,
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
      contractType: "",
      startDate: "",
      applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
      contactName: "Jelena Smirnov",
      contactRole: "Personalispetsialist",
      contactPhone: "56 820 520",
      contactPhone2: "6623 328",
      contactEmail: "personal@spsgrupp.ee",
      active: true,
      slug: "",
      ...fields,
    }
    data.announcements.push(newAnnouncement)
  }

  await writeData(data)
  return NextResponse.json({ success: true, announcement: idx >= 0 ? data.announcements[idx] : data.announcements[data.announcements.length - 1] })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const data = await readData()
  data.announcements = data.announcements.filter((a: Announcement) => a.id !== id)

  await writeData(data)
  return NextResponse.json({ success: true })
}
