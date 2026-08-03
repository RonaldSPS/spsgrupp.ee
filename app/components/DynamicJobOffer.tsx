import Link from "next/link"
import Navbar from "./Navbar"
import Footer from "./Footer"
import ScrollAnimation from "./ScrollAnimation"
import { sanitizeHtmlSafe } from "@/lib/sanitize-server"
import type { Announcement } from "@/lib/types"
import type { Locale } from "@/lib/slug-map"
import { renderLdJson } from "@/lib/json-ld-generator"
import { canonicalUrl } from "@/lib/url-utils"

const copy = {
  en: {
    home: "Home",
    careers: "Come work for us",
    published: "Published",
    offerNo: "Offer no.",
    company: "About the company",
    tasks: "Tasks",
    requirements: "Requirements",
    benefits: "We offer",
    applying: "Applying",
    deadline: "Application deadline",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    apply: "Apply",
    allOffers: "All offers",
    details: "Job details",
    location: "Location",
    vacancies: "Vacancies",
    salary: "Salary",
    from: "from",
    workTime: "Working hours",
    workTimeDetails: "Working time details",
    start: "Start",
    subject: "Application:",
  },
  ru: {
    home: "Главная",
    careers: "Вакансии",
    published: "Опубликовано",
    offerNo: "Номер предложения",
    company: "О компании",
    tasks: "Обязанности",
    requirements: "Требования к кандидату",
    benefits: "Мы предлагаем",
    applying: "Отклик на вакансию",
    deadline: "Срок подачи заявки",
    contact: "Контакт",
    phone: "Телефон",
    email: "Э-почта",
    apply: "Откликнуться",
    allOffers: "Все вакансии",
    details: "Данные вакансии",
    location: "Местоположение",
    vacancies: "Свободные места",
    salary: "Зарплата",
    from: "от",
    workTime: "Рабочее время",
    workTimeDetails: "Уточнение рабочего времени",
    start: "Начало",
    subject: "Отклик на вакансию:",
  },
} as const

export default async function DynamicJobOffer({ announcement, locale }: { announcement: Announcement; locale: Exclude<Locale, "et"> }) {
  const labels = copy[locale]
  const parentPath = locale === "en" ? "/en/come-work-for-us" : "/ru/приходите-работать-к-нам"
  const a: Announcement = {
    ...announcement,
    tasks: sanitizeHtmlSafe(announcement.tasks || ""),
    requirements: sanitizeHtmlSafe(announcement.requirements || ""),
    benefits: sanitizeHtmlSafe(announcement.benefits || ""),
    companyDescription: sanitizeHtmlSafe(announcement.companyDescription || ""),
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${canonicalUrl(`${parentPath}/${a.slug}`)}#jobposting`,
    title: a.title,
    description: a.subtitle || a.title,
    datePosted: a.publishedDate,
    validThrough: a.applicationDeadline || undefined,
    identifier: {
      "@type": "PropertyValue",
      name: a.company,
      value: a.id,
    },
    employmentType: a.workTime || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: a.company,
      sameAs: a.website || canonicalUrl("/"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: a.location || "Tallinn",
        addressCountry: "EE",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderLdJson(jsonLd) }} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-[130px] pb-[80px]">
        <div className="max-w-[900px] mx-auto px-[25px]">
          <nav className="mb-6 text-[15px] text-[#5a6474]">
            <Link href={`/${locale}`} className="text-[#5a6474] no-underline hover:text-[#17345a]">{labels.home}</Link>
            <span className="mx-2">/</span>
            <Link href={parentPath} className="text-[#5a6474] no-underline hover:text-[#17345a]">{labels.careers}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17345a]">{a.title}</span>
          </nav>

          <h1 className="text-[36px] md:text-[42px] font-bold text-[#17345a] leading-[1.15] mb-4">
            {a.title}
          </h1>
          {a.subtitle ? <p className="text-[18px] text-[#3abeff] font-medium mb-6">{a.subtitle}</p> : null}

          <div className="flex flex-wrap items-center gap-4 text-[15px] text-[#5a6474] mb-8 pb-8 border-b border-[rgba(23,52,90,0.08)]">
            <span>{labels.published}: {formatDate(a.publishedDate, locale)}</span>
            {a.offerNumber ? <span>| {labels.offerNo}: {a.offerNumber}</span> : null}
          </div>

          <div className="grid md:grid-cols-[1fr_280px] gap-10">
            <div className="space-y-8">
              {a.companyDescription ? <TextBlock title={labels.company} html={a.companyDescription} /> : null}
              {a.tasks ? <TextBlock title={labels.tasks} html={a.tasks} /> : null}
              {a.requirements ? <TextBlock title={labels.requirements} html={a.requirements} /> : null}
              {a.benefits ? <TextBlock title={labels.benefits} html={a.benefits} /> : null}

              <div className="bg-[#eef7fc] rounded-[16px] p-6">
                <h2 className="text-[18px] font-bold text-[#17345a] mb-4">{labels.applying}</h2>
                <div className="space-y-2 text-[15px] text-[#2f353f]">
                  {a.applicationDeadline ? <p><strong>{labels.deadline}:</strong> {formatDate(a.applicationDeadline, locale)}</p> : null}
                  {a.contactName ? <p><strong>{labels.contact}:</strong> {a.contactName}, {a.contactRole}</p> : null}
                  {a.contactPhone ? (
                    <p>
                      <strong>{labels.phone}:</strong>{" "}
                      <a href={`tel:${a.contactPhone.replace(/\s/g, "")}`} className="text-[#17345a] font-medium">{a.contactPhone}</a>
                      {a.contactPhone2 ? <>, <a href={`tel:${a.contactPhone2.replace(/\s/g, "")}`} className="text-[#17345a] font-medium">{a.contactPhone2}</a></> : null}
                    </p>
                  ) : null}
                  {a.contactEmail ? (
                    <p>
                      <strong>{labels.email}:</strong>{" "}
                      <a href={`mailto:${a.contactEmail}`} className="text-[#3abeff] font-medium">{a.contactEmail}</a>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-3">
                <a href={`mailto:${a.contactEmail}?subject=${encodeURIComponent(`${labels.subject} ${a.title}`)}`} className="btn-primary text-[15px]">
                  {labels.apply}
                </a>
                <Link href={`${parentPath}#pakkumised`} className="btn-outline text-[15px]">
                  {labels.allOffers}
                </Link>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded-[16px] border border-[rgba(23,52,90,0.08)] p-5 sticky top-[100px]">
                <h3 className="text-[16px] font-bold text-[#17345a] mb-4">{labels.details}</h3>
                <div className="space-y-3 text-[15px]">
                  <Detail label={labels.location} value={a.location} />
                  {a.vacancies > 0 ? <Detail label={labels.vacancies} value={String(a.vacancies)} /> : null}
                  {a.salary > 0 ? (
                    <div>
                      <div className="text-[#5a6474] mb-0.5">{labels.salary}</div>
                      <div className="text-[#3abeff] font-bold text-[18px]">{labels.from} {a.salary} {a.salaryUnit}</div>
                      {a.salaryDetails ? <div className="text-[#5a6474]">{a.salaryDetails}</div> : null}
                    </div>
                  ) : null}
                  <Detail label={labels.workTime} value={a.workTime} />
                  <Detail label={labels.workTimeDetails} value={a.workTimeDetails} />
                  <Detail label={labels.start} value={a.startDate} />
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

function TextBlock({ title, html }: { title: string; html: string }) {
  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#17345a] mb-3">{title}</h2>
      <div className="text-[15px] text-[#2f353f] leading-[1.8] article-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <div className="text-[#5a6474] mb-0.5">{label}</div>
      <div className="text-[#17345a] font-medium">{value}</div>
    </div>
  )
}

function formatDate(date: string, locale: Locale): string {
  const intlLocale = locale === "ru" ? "ru-RU" : "en-GB"
  return new Date(date).toLocaleDateString(intlLocale)
}
