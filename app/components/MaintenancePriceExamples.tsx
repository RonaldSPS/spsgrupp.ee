import type { Locale } from "@/lib/slug-map"
import {
  calculateMaintenancePrice,
  MAINTENANCE_MIN_AREA,
  MAINTENANCE_PRICE_EXAMPLES,
} from "@/lib/maintenance-pricing"

const copy = {
  et: {
    area: "Pindala",
    from: "alates",
    period: "kuus",
    note: `Teenindame äripindu alates ${MAINTENANCE_MIN_AREA} m². Näidishind on 1,20 €/m² kuus.`,
    locale: "et-EE",
  },
  en: {
    area: "Floor area",
    from: "from",
    period: "per month",
    note: `We serve commercial properties from ${MAINTENANCE_MIN_AREA} m². The indicative price is €1.20/m² per month.`,
    locale: "en-GB",
  },
  ru: {
    area: "Площадь",
    from: "от",
    period: "в месяц",
    note: `Мы обслуживаем коммерческие объекты площадью от ${MAINTENANCE_MIN_AREA} м². Ориентировочная цена — 1,20 €/м² в месяц.`,
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
