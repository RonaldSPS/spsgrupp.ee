import { promises as fs } from "fs"
import path from "path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ScrollAnimation from "../../components/ScrollAnimation"

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

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "admin-toole-announcements.json"),
      "utf-8"
    )
    return JSON.parse(raw).announcements || []
  } catch {
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const announcements = await getAnnouncements()
  const a = announcements.find((a) => a.slug === slug && a.active)
  if (!a) return { title: "Tööpakkumine | SPS Grupp" }
  return {
    title: a.title + " | SPS Grupp",
    description: a.subtitle || a.title + " - " + a.location,
    alternates: { canonical: "https://spsgrupp.ee/tule-meile-toole/" + a.slug },
  }
}

export default async function TooleAnnouncementPage({ params }: Props) {
  const { slug } = await params
  const announcements = await getAnnouncements()
  const a = announcements.find((a) => a.slug === slug && a.active)
  if (!a) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: a.title,
    description: a.subtitle || a.title,
    datePosted: a.publishedDate,
    validThrough: a.applicationDeadline,
    hiringOrganization: {
      "@type": "Organization",
      name: a.company,
    },
    jobLocation: {
      "@type": "Place",
      address: a.location,
    },
    baseSalary: a.salary > 0 ? {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        value: a.salary,
        unitText: "MONTH",
      },
    } : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-[130px] pb-[80px]">
        <div className="max-w-[900px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href="/" className="text-[#5a6474] no-underline hover:text-[#17345a]">Avaleht</Link>
            <span className="mx-2">/</span>
            <Link href="/tule-meile-toole" className="text-[#5a6474] no-underline hover:text-[#17345a]">Tule meile tööle</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{a.title}</span>
          </nav>

          <h1 className="text-[36px] md:text-[42px] font-bold text-[#17345a] leading-[1.15] mb-4">
            {a.title}
          </h1>
          {a.subtitle && (
            <p className="text-[18px] text-[#3abeff] font-medium mb-6">{a.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[15px] text-[#5a6474] mb-8 pb-8 border-b border-[rgba(23,52,90,0.08)]">
            <span>Avaldatud: {new Date(a.publishedDate).toLocaleDateString("et-EE")}</span>
            {a.offerNumber && <span>| Pakkumise nr: {a.offerNumber}</span>}
          </div>

          <div className="grid md:grid-cols-[1fr_280px] gap-10">
            <div className="space-y-8">
              {a.companyDescription && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#17345a] mb-3">Ettevõttest</h2>
                  <p className="text-[15px] text-[#2f353f] leading-[1.8]">{a.companyDescription}</p>
                </div>
              )}

              {a.tasks && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#17345a] mb-3">Tööülesanded</h2>
                  <div className="text-[15px] text-[#2f353f] leading-[1.8] article-content" dangerouslySetInnerHTML={{ __html: a.tasks }} />
                </div>
              )}

              {a.requirements && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#17345a] mb-3">Nõuded kandidaadile</h2>
                  <div className="text-[15px] text-[#2f353f] leading-[1.8] article-content" dangerouslySetInnerHTML={{ __html: a.requirements }} />
                </div>
              )}

              {a.benefits && (
                <div>
                  <h2 className="text-[20px] font-bold text-[#17345a] mb-3">Ettevõte pakub</h2>
                  <div className="text-[15px] text-[#2f353f] leading-[1.8] article-content" dangerouslySetInnerHTML={{ __html: a.benefits }} />
                </div>
              )}

              <div className="bg-[#eef7fc] rounded-[16px] p-6">
                <h2 className="text-[18px] font-bold text-[#17345a] mb-4">Kandideerimine</h2>
                <div className="space-y-2 text-[15px] text-[#2f353f]">
                  {a.applicationDeadline && (
                    <p><strong>Kandideerimise tähtaeg:</strong> {new Date(a.applicationDeadline).toLocaleDateString("et-EE")}</p>
                  )}
                  {a.contactName && <p><strong>Kontakt:</strong> {a.contactName}, {a.contactRole}</p>}
                  {a.contactPhone && (
                    <p>
                      <strong>Telefon:</strong>{" "}
                      <a href={`tel:${a.contactPhone.replace(/\s/g, "")}`} className="text-[#17345a] font-medium">{a.contactPhone}</a>
                      {a.contactPhone2 && (
                        <>, <a href={`tel:${a.contactPhone2.replace(/\s/g, "")}`} className="text-[#17345a] font-medium">{a.contactPhone2}</a></>
                      )}
                    </p>
                  )}
                  {a.contactEmail && (
                    <p>
                      <strong>E-post:</strong>{" "}
                      <a href={`mailto:${a.contactEmail}`} className="text-[#3abeff] font-medium">{a.contactEmail}</a>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${a.contactEmail}?subject=Kandideerin: ${encodeURIComponent(a.title)}`}
                  className="btn-primary text-[15px]"
                >
                  Kandideeri
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link href="/tule-meile-toole#pakkumised" className="btn-outline text-[15px]">
                  Kõik pakkumised
                </Link>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded-[16px] border border-[rgba(23,52,90,0.08)] p-5 sticky top-[100px]">
                <h3 className="text-[16px] font-bold text-[#17345a] mb-4">Töökoha andmed</h3>
                <div className="space-y-3 text-[15px]">
                  {a.location && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Asukoht</div>
                      <div className="text-[#17345a] font-medium">{a.location}</div>
                    </div>
                  )}
                  {a.vacancies > 0 && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Vabu kohti</div>
                      <div className="text-[#17345a] font-medium">{a.vacancies}</div>
                    </div>
                  )}
                  {a.salary > 0 && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Töötasu</div>
                      <div className="text-[#3abeff] font-bold text-[18px]">alates {a.salary} {a.salaryUnit}</div>
                      {a.salaryDetails && <div className="text-[#5a6474]">{a.salaryDetails}</div>}
                    </div>
                  )}
                  {a.workTime && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Tööaeg</div>
                      <div className="text-[#17345a] font-medium">{a.workTime}</div>
                    </div>
                  )}
                  {a.workTimeDetails && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Tööaja täpsustus</div>
                      <div className="text-[#17345a]">{a.workTimeDetails}</div>
                    </div>
                  )}
                  {a.startDate && (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">Algus</div>
                      <div className="text-[#17345a] font-medium">{a.startDate}</div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  )
}
