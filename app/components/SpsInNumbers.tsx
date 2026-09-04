"use client"

import ScrollAnimation from "./ScrollAnimation"
import { useLocale } from "next-intl"
import type { Locale } from "@/lib/slug-map"

const copy = {
  et: {
    tag: "SPS Grupp numbrites",
    summary:
      "SPS Grupp OÜ on 2006. aastal asutatud Eesti koristus- ja remonditeenuste ettevõte, kelle 300+ töötajat hooldavad üle 1 000 000 m² rohkem kui 200 ärikliendi objektidel Tallinnas ja Harjumaal.",
    facts: [
      { value: "2006", text: "SPS Grupp OÜ asutati 2006. aastal ja tegutseb Eesti ärikinnisvara hooldusturul alates sellest aastast." },
      { value: "300+", text: "Ettevõttes töötab üle 300 inimese - puhastusteenindajad, hooldustöölised, elektrikud ja torumehed." },
      { value: "200+", text: "Meid usaldab enam kui 200 äriklienti: büroohooned, kauplused, tootmishooned ja korteriühistud." },
      { value: "1 000 000+ m²", text: "Meie hoolduses on üle 1 000 000 m² äripindu Tallinnas ja Harjumaal." },
      { value: "ISO", text: "SPS Grupp on sertifitseeritud ISO 9001 (kvaliteedijuhtimine) ja ISO 14001 (keskkonnajuhtimine) standardite kohaselt." },
    ],
  },
  en: {
    tag: "SPS Grupp in numbers",
    summary:
      "SPS Grupp OÜ is an Estonian cleaning and renovation company founded in 2006, whose 300+ employees maintain over 1,000,000 m² for more than 200 business clients in Tallinn and Harju County.",
    facts: [
      { value: "2006", text: "SPS Grupp OÜ was founded in 2006 and has served the Estonian commercial property maintenance market ever since." },
      { value: "300+", text: "The company employs more than 300 people - cleaners, maintenance workers, electricians and plumbers." },
      { value: "200+", text: "We are trusted by over 200 business clients: office buildings, retail spaces, industrial sites and housing associations." },
      { value: "1,000,000+ m²", text: "We maintain over 1,000,000 m² of commercial space in Tallinn and Harju County." },
      { value: "ISO", text: "SPS Grupp is certified to ISO 9001 (quality management) and ISO 14001 (environmental management) standards." },
    ],
  },
  ru: {
    tag: "SPS Grupp в цифрах",
    summary:
      "SPS Grupp OÜ - эстонская компания клининговых и ремонтных услуг, основанная в 2006 году; её 300+ сотрудников обслуживают более 1 000 000 м² для более чем 200 бизнес-клиентов в Таллинне и Харьюмаа.",
    facts: [
      { value: "2006", text: "SPS Grupp OÜ основана в 2006 году и с тех пор работает на рынке обслуживания коммерческой недвижимости Эстонии." },
      { value: "300+", text: "В компании работает более 300 человек - уборщики, работники по обслуживанию, электрики и сантехники." },
      { value: "200+", text: "Нам доверяют более 200 бизнес-клиентов: офисные здания, торговые помещения, производственные объекты и квартирные товарищества." },
      { value: "1 000 000+ м²", text: "На нашем обслуживании более 1 000 000 м² коммерческих площадей в Таллинне и Харьюмаа." },
      { value: "ISO", text: "SPS Grupp сертифицирована по стандартам ISO 9001 (менеджмент качества) и ISO 14001 (экологический менеджмент)." },
    ],
  },
} as const

/** Self-contained quotable facts block (AEO) - every sentence stands alone. */
export default function SpsInNumbers() {
  const locale = useLocale() as Locale
  const t = copy[locale]
  return (
    <ScrollAnimation animation="fade-up">
      <section aria-label={t.tag} className="py-[80px] bg-[#eceef1]">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <p className="uppercase tracking-[0.2em] text-[15px] text-[#5a6474] mb-4">{t.tag}</p>
          <p className="text-[18px] md:text-[22px] leading-[1.6] text-[#17345a] font-medium max-w-[900px] mb-10">
            {t.summary}
          </p>
          <dl className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {t.facts.map((fact) => (
              <div key={fact.value} className="bg-white rounded-2xl p-5 border border-[rgba(23,52,90,0.08)]">
                <dt className="text-[28px] font-bold text-[#17345a] mb-2">{fact.value}</dt>
                <dd className="text-[15px] leading-[1.6] text-[#2f353f]">{fact.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </ScrollAnimation>
  )
}
