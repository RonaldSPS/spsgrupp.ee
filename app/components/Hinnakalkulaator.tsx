"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/slug-map";
import {
  calculateMaintenancePrice,
  MAINTENANCE_AREA_STEP,
  MAINTENANCE_MAX_AREA,
  MAINTENANCE_MIN_AREA,
} from "@/lib/maintenance-pricing";

const copy = {
  et: {
    calculator: "Hinnakalkulaator",
    month: "/kuu",
    description: "Näidishind alates 1,20 €/m² kuus. Täpne hind sõltub koristussagedusest, töömahust ja objekti eripärast.",
    area: "Pindala",
    calculation: "Arvutus",
    cta: "Küsi täpset pakkumist",
    locale: "et-EE",
  },
  en: {
    calculator: "Price calculator",
    month: "/month",
    description: "Indicative price from €1.20/m² per month. The exact price depends on cleaning frequency, workload and property characteristics.",
    area: "Floor area",
    calculation: "Calculation",
    cta: "Request an exact quote",
    locale: "en-GB",
  },
  ru: {
    calculator: "Калькулятор цены",
    month: "/месяц",
    description: "Ориентировочная цена от 1,20 €/м² в месяц. Точная цена зависит от частоты уборки, объёма работ и особенностей объекта.",
    area: "Площадь",
    calculation: "Расчёт",
    cta: "Запросить точное предложение",
    locale: "ru-RU",
  },
} as const

export default function Hinnakalkulaator({ locale = "et" }: { locale?: Locale }) {
  const [area, setArea] = useState(MAINTENANCE_MIN_AREA);
  const text = copy[locale];

  const price = useMemo(() => {
    return calculateMaintenancePrice(area);
  }, [area]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[32px] bg-[#fafafa] p-8 md:p-10 text-[#2f353f] border border-[#eceef1]"
    >
      <p className="uppercase tracking-[0.25em] text-[15px] text-[#5a6474] mb-6">
        {text.calculator}
      </p>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-6xl md:text-7xl leading-none font-semibold text-[#17345a]">{price.toLocaleString(text.locale)} €</span>
        <span className="text-xl text-[#5a6474] pb-2">{text.month}</span>
      </div>

      <p className="text-[15px] text-[#5a6474] mb-10">
        {text.description}
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <label htmlFor="area-slider" className="uppercase tracking-[0.15em] text-[15px] text-[#5a6474]">{text.area}</label>
          <strong className="text-xl text-[#17345a]">{area.toLocaleString(text.locale)} m²</strong>
        </div>

        <input
          id="area-slider"
          type="range"
          min={MAINTENANCE_MIN_AREA}
          max={MAINTENANCE_MAX_AREA}
          step={MAINTENANCE_AREA_STEP}
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          className="w-full accent-[#85cbe9] cursor-pointer"
        />
        <div className="flex justify-between mt-3 font-mono text-[15px] text-[#5a6474]">
          <span>800</span>
          <span>5 000</span>
          <span>10 000</span>
        </div>
      </div>

      <div className="mb-12 rounded-xl bg-[#eef7fc] p-4 text-[15px] leading-[1.6] text-[#17345a]">
        {text.calculation}: {area.toLocaleString(text.locale)} m² × 1,20 €/m² = {price.toLocaleString(text.locale)} €{text.month}.
      </div>

      <a
        href="#pakkumine"
        className="block w-full text-center rounded-full bg-[#17345a] hover:bg-[#1e4a7a] transition py-5 text-xl font-bold text-white no-underline shadow-lg"
      >
        {text.cta} <span className="ml-2">→</span>
      </a>
    </motion.div>
  );
}
