import Link from "next/link";
import { localizePath, type Locale } from "@/lib/slug-map";

/**
 * „Vaata ka" siselingiriba tuumik-teenuselehtede vahel (kontori, hooldus,
 * kaubandus, tootmine). SEO: hoiab lepinguteenuste lehed omavahel lingitud
 * (26.10.2026 tegevuskava punkt 6 — siselingid tuumiklehtede vahel).
 */

const PAGES = [
  {
    key: "kontori",
    etPath: "/koristusteenus/kontori-koristus",
    label: { et: "Kontori koristus", en: "Office cleaning", ru: "Уборка офисов" },
  },
  {
    key: "hooldus",
    etPath: "/koristusteenus/hoolduskoristus",
    label: { et: "Hoolduskoristus", en: "Regular contract cleaning", ru: "Регулярная уборка" },
  },
  {
    key: "kaubandus",
    etPath: "/koristusteenus/kaubanduspindade-koristus",
    label: { et: "Kaubanduspindade koristus", en: "Retail space cleaning", ru: "Уборка торговых помещений" },
  },
  {
    key: "tootmine",
    etPath: "/koristusteenus/tootmishoonete-koristus",
    label: { et: "Tootmishoonete koristus", en: "Industrial building cleaning", ru: "Уборка производственных зданий" },
  },
] as const

const HEADING = { et: "Vaata ka", en: "See also", ru: "Смотрите также" } as const

export default function RelatedServices({
  locale = "et",
  current,
}: {
  locale?: Locale
  current: (typeof PAGES)[number]["key"]
}) {
  const links = PAGES.filter((p) => p.key !== current)
  return (
    <section className="py-12 bg-[#f8fafc] border-t border-[#eceef1]">
      <div className="max-w-[1280px] mx-auto px-[5%] flex flex-wrap items-center gap-3">
        <span className="uppercase tracking-[0.15em] text-[15px] text-[#5a6474] mr-2">{HEADING[locale]}:</span>
        {links.map((p) => (
          <Link
            key={p.key}
            href={localizePath(p.etPath, locale)}
            className="inline-block rounded-full border border-[#17345a]/15 bg-white px-4 py-2 text-[15px] font-medium text-[#17345a] no-underline transition-colors hover:bg-[#17345a] hover:text-white"
          >
            {p.label[locale]}
          </Link>
        ))}
        {locale === "et" && (
          <Link
            href="/kliendilood/"
            className="inline-block rounded-full border border-[#17345a]/15 bg-white px-4 py-2 text-[15px] font-medium text-[#17345a] no-underline transition-colors hover:bg-[#17345a] hover:text-white"
          >
            Kliendilood
          </Link>
        )}
      </div>
    </section>
  )
}
