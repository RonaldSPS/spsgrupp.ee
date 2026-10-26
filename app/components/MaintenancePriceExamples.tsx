import type { Locale } from "@/lib/slug-map"
import {
  calculateMaintenancePrice,
  MAINTENANCE_PRICE_EXAMPLES,
} from "@/lib/maintenance-pricing"

const copy = {
  et: {
    area: "Pindala",
    from: "alates",
    period: "kuus",
    note: "Näidishind on 1,20 €/m² kuus. Teenindame nii väikeseid kui suuri äripindu — iga objekti täpne hind kinnitatakse tasuta objekti ülevaatusel.",
    locale: "et-EE",
  },
  en: {
    area: "Floor area",
    from: "from",
    period: "per month",
    note: "The indicative price is €1.20/m² per month. We serve both smaller and larger commercial properties — the exact price is confirmed after a free site assessment.",
    locale: "en-GB",
  },
  ru: {
    area: "Площадь",
    from: "от",
    period: "в месяц",
    note: "Ориентировочная цена — 1,20 €/м² в месяц. Обслуживаем как небольшие, так и крупные коммерческие площади — точная цена подтверждается после бесплатного осмотра объекта.",
    locale: "ru-RU",
  },
} as const

export default function MaintenancePriceExamples({ locale = "et" }: { locale?: Locale }) {
  const text = copy[locale]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {MAINTENANCE_PRICE_EXAMPLES.map((area, index) => {
          const price = calculateMaintenancePrice(area)
          const highlight = index === 0

          return (
            <article
              key={area}
              className={`p-4 rounded-2xl text-center border-2 ${
                highlight
                  ? "bg-[#17345a] text-white border-[#17345a]"
                  : "bg-[#f8fafc] text-[#17345a] border-transparent"
              }`}
            >
              <h3 className={`text-[15px] font-bold mb-1 ${highlight ? "text-white" : "text-[#17345a]"}`}>
                {text.area}
              </h3>
              <p className={`text-[15px] mb-2 ${highlight ? "text-white/75" : "text-[#5a6474]"}`}>
                {area.toLocaleString(text.locale)} m²
              </p>
              <p className={`text-[26px] font-bold mb-1 ${highlight ? "text-white" : "text-[#17345a]"}`}>
                {text.from} {price.toLocaleString(text.locale)} €
              </p>
              <p className={`text-[15px] ${highlight ? "text-white/75" : "text-[#5a6474]"}`}>
                {text.period}
              </p>
            </article>
          )
        })}
      </div>
      <p className="text-[15px] leading-[1.75] text-[#5a6474]">{text.note}</p>
    </>
  )
}
