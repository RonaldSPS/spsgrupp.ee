/**
 * Generates public/llms.txt (ET), public/llms-en.txt, public/llms-ru.txt from
 * lib/pages/registry.ts + lib/pages/definitions/ (service one-liners and
 * starting prices) — single source of truth, so the files cannot drift.
 * Run: npx tsx scripts/generate-llms-txt.ts
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { publicPages } from "../lib/pages/registry"
import { serviceDetailByEtPath } from "../lib/pages/definitions"
import { parsePriceCard } from "../lib/json-ld-generator"
import { canonicalUrl } from "../lib/url-utils"
import { localizePath, type Locale } from "../lib/slug-map"

type Facts = {
  title: string
  companyHeading: string
  founded: string
  registryCode: string
  address: string
  staff: string
  clients: string
  area: string
  certsHeading: string
  servicesHeading: string
  intro: string
  quoteCta: string
  contactHeading: string
  phone: string
  email: string
  contactForm: string
  careers: string
  languagesHeading: string
  languages: string[]
  sectionNames: Record<string, string>
}

const FACTS: Record<Locale, Facts> = {
  et: {
    title: "SPS Grupp",
    companyHeading: "Firma",
    founded: "2006",
    registryCode: "11394806",
    address: "Mustamäe tee 46, Tallinn, 10621, Eesti",
    staff: "300+ töötajat",
    clients: "200+ klienti",
    area: "üle 1 000 000 m² hoolduses",
    certsHeading: "Sertifikaadid",
    servicesHeading: "Teenused",
    intro:
      "SPS Grupp OÜ (asutatud 2006) on professionaalne koristus- ja remonditeenuste ettevõte: 300+ töötajat, 200+ klienti, üle 1 000 000 m² hoolduses. Teenindame ärikliente Tallinnas ja Harjumaal. ISO 9001 ja ISO 14001 sertifitseeritud.",
    quoteCta: "Küsi tasuta hinnapakkumist kontaktivormi kaudu või telefonil — vastame ühe tööpäevaga.",
    contactHeading: "Kontakt",
    phone: "+372 662 3328",
    email: "info@spsgrupp.ee",
    contactForm: canonicalUrl("/kontakt"),
    careers: canonicalUrl("/tule-meile-toole"),
    languagesHeading: "Keeled",
    languages: ["Eesti", "Vene", "Inglise"],
    sectionNames: {
      koristusteenus: "Koristusteenused",
      valikoristus: "Välikoristus",
      puhastusteenused: "Puhastusteenused",
      remonditeenused: "Remonditeenused",
      muu: "Muu",
    },
  },
  en: {
    title: "SPS Grupp",
    companyHeading: "Company",
    founded: "2006",
    registryCode: "11394806",
    address: "Mustamäe tee 46, Tallinn, 10621, Estonia",
    staff: "300+ employees",
    clients: "200+ clients",
    area: "over 1,000,000 m² maintained",
    certsHeading: "Certifications",
    servicesHeading: "Services",
    intro:
      "SPS Grupp OÜ (founded 2006) is a professional cleaning and renovation services company: 300+ employees, 200+ clients, over 1,000,000 m² under maintenance. We serve business clients in Tallinn and Harju County, Estonia. ISO 9001 and ISO 14001 certified.",
    quoteCta: "Request a free quote via the contact form or by phone — we respond within one business day.",
    contactHeading: "Contact",
    phone: "+372 662 3328",
    email: "info@spsgrupp.ee",
    contactForm: canonicalUrl(localizePath("/kontakt", "en")),
    careers: canonicalUrl(localizePath("/tule-meile-toole", "en")),
    languagesHeading: "Languages",
    languages: ["Estonian", "Russian", "English"],
    sectionNames: {
      koristusteenus: "Cleaning services",
      valikoristus: "Outdoor cleaning and grounds care",
      puhastusteenused: "Specialist cleaning services",
      remonditeenused: "Repair and renovation services",
      muu: "Other",
    },
  },
  ru: {
    title: "SPS Grupp",
    companyHeading: "Компания",
    founded: "2006",
    registryCode: "11394806",
    address: "Mustamäe tee 46, Таллин, 10621, Эстония",
    staff: "300+ сотрудников",
    clients: "200+ клиентов",
    area: "более 1 000 000 м² на обслуживании",
    certsHeading: "Сертификаты",
    servicesHeading: "Услуги",
    intro:
      "SPS Grupp OÜ (основана в 2006 году) — компания профессиональных клининговых и ремонтных услуг: 300+ сотрудников, 200+ клиентов, более 1 000 000 м² на обслуживании. Работаем с бизнес-клиентами в Таллинне и Харьюмаа, Эстония. Сертифицированы по ISO 9001 и ISO 14001.",
    quoteCta: "Запросите бесплатное ценовое предложение через контактную форму или по телефону — отвечаем в течение одного рабочего дня.",
    contactHeading: "Контакты",
    phone: "+372 662 3328",
    email: "info@spsgrupp.ee",
    contactForm: canonicalUrl(localizePath("/kontakt", "ru")),
    careers: canonicalUrl(localizePath("/tule-meile-toole", "ru")),
    languagesHeading: "Языки",
    languages: ["Эстонский", "Русский", "Английский"],
    sectionNames: {
      koristusteenus: "Клининговые услуги",
      valikoristus: "Уборка и обслуживание территорий",
      puhastusteenused: "Специализированная уборка",
      remonditeenused: "Ремонтные работы",
      muu: "Прочее",
    },
  },
}

const PRICE_PREFIX: Record<Locale, string> = { et: "alates", en: "from", ru: "от" }

function sectionKey(etPath: string): string {
  if (etPath.startsWith("/koristusteenus/valikoristus")) return "valikoristus"
  if (etPath.startsWith("/koristusteenus")) return "koristusteenus"
  if (etPath.startsWith("/puhastusteenused")) return "puhastusteenused"
  if (etPath.startsWith("/remonditeenused-tallinnas")) return "remonditeenused"
  return "muu"
}

function priceLabel(etPath: string, locale: Locale): string | null {
  const defs = serviceDetailByEtPath[etPath]
  if (!defs) return null
  const cards = defs[locale]?.data?.priceCards
  if (!cards || cards.length === 0) return null
  const parsed = cards.map(parsePriceCard).filter((p): p is NonNullable<typeof p> => p !== null)
  if (parsed.length === 0) return null
  const highlighted = cards.find((c) => c.highlight) ?? cards[0]
  const primary = parsePriceCard(highlighted)
  const min = (primary ?? parsed.reduce((m, p) => (p.minPrice < m.minPrice ? p : m), parsed[0])).minPrice
  const unitText = (primary ?? parsed.find((p) => p.minPrice === min))?.unitText
  const unit =
    unitText === "per m²" ? { et: "€/m²", en: "EUR/m²", ru: "€/м²" }[locale]
    : unitText === "per month" ? { et: "€/kuu", en: "EUR/month", ru: "€/месяц" }[locale]
    : unitText === "per hour" ? { et: "€/h", en: "EUR/h", ru: "€/час" }[locale]
    : { et: "€", en: "EUR", ru: "€" }[locale]
  return `${PRICE_PREFIX[locale]} ${min} ${unit}`
}

function buildFile(locale: Locale): string {
  const f = FACTS[locale]
  const lines: string[] = [
    `# ${f.title}`,
    "",
    `## ${f.companyHeading}`,
    "",
    `**Nimi/Name:** SPS Grupp OÜ`,
    `**${f.companyHeading === "Firma" ? "Asutatud" : f.companyHeading === "Company" ? "Founded" : "Основана"}:** ${f.founded}`,
    `**Registrikood / Registry code:** ${f.registryCode}`,
    `**${f.companyHeading === "Компания" ? "Адрес" : "Address"}:** ${f.address}`,
    `**${f.companyHeading === "Firma" ? "Meeskond" : f.companyHeading === "Company" ? "Team" : "Команда"}:** ${f.staff}, ${f.clients}, ${f.area}`,
    "",
    `## ${f.servicesHeading}`,
    "",
    f.intro,
    "",
  ]

  const servicePages = publicPages.filter(
    (p) => p.localized && p.etPath !== "/" && serviceDetailByEtPath[p.etPath],
  )
  const bySection = new Map<string, typeof servicePages>()
  for (const page of servicePages) {
    const key = sectionKey(page.etPath)
    if (!bySection.has(key)) bySection.set(key, [])
    bySection.get(key)!.push(page)
  }

  for (const key of ["koristusteenus", "valikoristus", "puhastusteenused", "remonditeenused", "muu"]) {
    const pages = bySection.get(key)
    if (!pages) continue
    lines.push(`### ${f.sectionNames[key]}`)
    for (const page of pages) {
      const seo = serviceDetailByEtPath[page.etPath][locale].seo
      const price = priceLabel(page.etPath, locale)
      const url = canonicalUrl(localizePath(page.etPath, locale))
      const pricePart = price ? ` — **${price}**` : ""
      lines.push(`- ${seo.serviceName} — ${seo.serviceDescription}${pricePart} — ${url}`)
    }
    lines.push("")
  }

  lines.push(`## ${f.contactHeading}`)
  lines.push(`- ${f.phone}`)
  lines.push(`- ${f.email}`)
  lines.push(`- ${f.quoteCta}`)
  lines.push(`- ${f.contactForm}`)
  lines.push(`- ${f.careers}`)
  lines.push("")
  lines.push(`## ${f.certsHeading}`)
  lines.push("- ISO 9001")
  lines.push("- ISO 14001")
  lines.push("")
  lines.push(`## ${f.languagesHeading}`)
  for (const lang of f.languages) lines.push(`- ${lang}`)
  lines.push("")

  return lines.join("\n")
}

async function main() {
  const out: Array<[Locale, string]> = [
    ["et", "llms.txt"],
    ["en", "llms-en.txt"],
    ["ru", "llms-ru.txt"],
  ]
  for (const [locale, filename] of out) {
    const target = path.join(process.cwd(), "public", filename)
    await fs.writeFile(target, buildFile(locale), "utf8")
    console.log(`wrote public/${filename} (${locale})`)
  }
}

main()
