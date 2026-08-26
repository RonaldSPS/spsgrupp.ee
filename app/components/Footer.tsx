"use client"

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import ScrollAnimation from "./ScrollAnimation";
import { localizePath, type Locale } from "@/lib/slug-map";

export default function Footer({ animDelay }: { animDelay?: number }) {
  const t = useTranslations("footer")
  const m = useTranslations("megaMenu")
  const n = useTranslations("nav")
  const pathname = usePathname()
  const locale: Locale = pathname === "/en" || pathname.startsWith("/en/")
    ? "en"
    : pathname === "/ru" || pathname.startsWith("/ru/")
      ? "ru"
      : "et"
  const currentYear = new Date().getFullYear();

  function localeHref(href: string): string {
    const [pathPart, hashPart] = href.split("#")
    const localized = localizePath((pathPart || "/").replace(/\/$/, "") || "/", locale)
    return hashPart ? `${localized}#${hashPart}` : localized
  }

  const footerColumnIcons = [
    <svg key="0" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /><path d="M5 8h14" /><path d="M9 2v5" /><path d="M15 2v5" /><rect x="6" y="8" width="12" height="3" rx="1" /></svg>,
    <svg key="1" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="6" height="10" rx="1" /><rect x="10" y="14" width="4" height="2" rx="0.5" /><path d="M14 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" /><path d="M17 8V6a2 2 0 0 0-2-2h-1" /><line x1="6" y1="11" x2="8" y2="11" /></svg>,
    <svg key="2" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><rect x="9" y="13" width="6" height="8" /><path d="M10 9h4" /><circle cx="16" cy="4" r="1" fill="#85cbe9" stroke="none" /><path d="M16 7v1" /></svg>,
    <svg key="3" viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  ]

  const footerColumns = [
    { items: [
      { label: m("officeCleaning"), href: "/koristusteenus/kontori-koristus/" },
      { label: m("maintenanceCleaning"), href: "/koristusteenus/hoolduskoristus/" },
      { label: m("commercialCleaning"), href: "/koristusteenus/kaubanduspindade-koristus/" },
      { label: m("industrialCleaning"), href: "/koristusteenus/tootmishoonete-koristus/" },
    ]},
    { items: [
      { label: m("windowCleaning"), href: "/koristusteenus/valikoristus/akende-pesu/" },
      { label: m("carpetCleaning"), href: "/puhastusteenused/vaipade-puhastus/" },
      { label: m("deepCleaning"), href: "/puhastusteenused/suurpuhastus/" },
      { label: m("floorMaintenance"), href: "/puhastusteenused/porandate-hooldus/" },
      { label: m("constructionWaste"), href: "/ehitusprahi-aravedu/" },
      { label: m("postConstructionCleaning"), href: "/puhastusteenused/ehitusjargne-koristus/" },
      { label: m("fireDamageCleaning"), href: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/" },
      { label: m("escalatorDeepCleaning"), href: "/puhastusteenused/eskalaatorite-suvapuhastus/" },
      { label: m("disinfection"), href: "/puhastusteenused/koroonaviiruse-jargne-puhastus/" },
      { label: m("pavingCleaning"), href: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/" },
      { label: m("graffitiRemoval"), href: "/koristusteenus/valikoristus/grafiti-eemaldamine/" },
      { label: m("facadeCleaning"), href: "/koristusteenus/valikoristus/fassaadipesu/" },
    ]},
    { items: [
      { label: m("outdoorCleaning"), href: "/koristusteenus/valikoristus/" },
      { label: m("facadeCleaning"), href: "/koristusteenus/valikoristus/fassaadipesu/" },
      { label: m("windowCleaning"), href: "/koristusteenus/valikoristus/akende-pesu/" },
      { label: m("graffitiRemoval"), href: "/koristusteenus/valikoristus/grafiti-eemaldamine/" },
      { label: m("snowRemoval"), href: "/koristusteenus/valikoristus/lumekoristus/" },
    ]},
    { items: [
      { label: m("electricalWork"), href: "/remonditeenused-tallinnas/elektritood/" },
      { label: m("plumbing"), href: "/remonditeenused-tallinnas/torutood/" },
      { label: m("interiorFinishing"), href: "/remonditeenused-tallinnas/siseviimistlustood/" },
      { label: m("bathroomRenovation"), href: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/" },
      { label: m("ventilation"), href: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/" },
      { label: m("roofRepair"), href: "/remonditeenused-tallinnas/katuse-remont/" },
      { label: m("tiling"), href: "/remonditeenused-tallinnas/plaatimistood/" },
      { label: m("demolition"), href: "/remonditeenused-tallinnas/lammutustood/" },
    ]},
  ]

  const content = (
      <div className="max-w-[1440px] mx-auto px-[25px]">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 pb-9 border-b border-[rgba(133,203,233,0.06)]">
          <div className="lg:col-span-2">
            <Link href={localeHref("/")} className="flex items-center gap-2.5 no-underline mb-4">
              <Image
                src="/SPS_LOGO.svg"
                alt={t("logoAlt")}
                width={288}
                height={50}
                className="w-[288px] max-w-full h-auto"
                unoptimized
              />
            </Link>

            <div className="mt-4 space-y-1">
              <a
                href={"https://www.google.com/maps/place/Tetris+B%C3%BCroohoone,+Mustam%C3%A4e+tee+46,+10621+Tallinn/@59.4162971,24.6890432,17z/data=!3m1!4b1!4m6!3m5!1s0x469294f5fec8e2fd:0xc2b28e6f780f9897!8m2!3d59.4162944!4d24.6916181!16s%2Fg%2F1q6jyqwpb?entry=tts&g_ep=EgoyMDI1MDIyMy4xIPu8ASoASAFQAw%3D%3D"}
                className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9] block"
                rel="nofollow"
              >
                {t("address")}
              </a>
              <a
                href={`tel:${["+", "3", "7", "2", " ", "5", "5", "6", "0", " ", "5", "1", "4", "7"].join("")}`}
                className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9] block"
                rel="nofollow"
              >
                {["+372", " ", "5560", " ", "5147"].join("")}
              </a>
              <a
                href={`tel:${["+", "3", "7", "2", " ", "6", "6", "2", " ", "3", "3", "2", "8"].join("")}`}
                className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9] block"
                rel="nofollow"
              >
                {["+372", " ", "662", " ", "3328"].join("")}
              </a>
              <a
                href={`mailto:${["i", "n", "f", "o", "@", "s", "p", "s", "g", "r", "u", "p", "p", ".", "e", "e"].join("")}`}
                className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9] block"
                rel="nofollow"
              >
                {["info", "@", "spsgrupp", ".ee"].join("")}
              </a>
            </div>

            <ul className="flex flex-col gap-1 list-none mt-4 mb-6">
              {(["comeToWork", "spsGrupp", "blog", "contact"] as const).filter((key) => key !== "blog" || locale === "et").map((key) => {
                const hrefMap: Record<string, string> = {
                  comeToWork: "/tule-meile-toole",
                  spsGrupp: "/sps-grupp",
                  blog: "/blog",
                  contact: "/kontakt",
                }
                return (
                  <li key={key}>
                    <Link href={localeHref(hrefMap[key])} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                      {n(key === "comeToWork" ? "comeToWork" : key === "spsGrupp" ? "spsGrupp" : key === "blog" ? "blog" : "contact")}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <a
              href="https://www.facebook.com/Puhastusteenused"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#85cbe9] transition-colors no-underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SPS Grupp Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#85cbe9]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {footerColumns.map((col, idx) => (
            <div key={idx}>
              <h2 className="text-white text-[15px] font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 text-[#85cbe9]">{footerColumnIcons[idx]}</span>
                {idx === 0 ? t("indoorCleaning") : idx === 1 ? t("specialCleaning") : idx === 2 ? t("outdoorCleaning") : t("renovationServices")}
              </h2>
              <ul className="flex flex-col gap-1 list-none">
                {col.items.map((item: { label: string; href: string }, itemIdx: number) => (
                  <li key={itemIdx}>
                    <Link href={localeHref(item.href)} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {idx === 0 && (
                <a href="https://taust.ee/app/report/sps-grupp-ou-11394806" className="block mt-4 no-underline" rel="nofollow">
                  <Image
                    src="/Hasti-juhitud-ettevote.webp"
                    alt={t("wellManagedCompanyAlt")}
                    width={120}
                    height={120}
                    style={{ width: "auto", height: "auto" }}
                  />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-5 flex-wrap gap-2.5 text-[15px] text-white/70 font-light">
          <span>© {currentYear} SPS Grupp. {t("disclaimer")}</span>
          <div className="flex gap-5">
            <Link href={localeHref("/andmekaitsetingimused")} className="text-white/70 no-underline hover:text-[#85cbe9]">{t("privacy")}</Link>
          </div>
        </div>
      </div>
  )

  return (
    <footer className="bg-[#0f1f33] py-12 border-t border-[rgba(133,203,233,0.08)]">
      {animDelay === undefined ? content : (
        <ScrollAnimation animation="fade-up" delay={animDelay}>
          {content}
        </ScrollAnimation>
      )}
    </footer>
  );
}
