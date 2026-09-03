"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { localizePath, getCurrentEtPath, type Locale } from "@/lib/slug-map"

export default function Navbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale: Locale = pathname === '/en' || pathname.startsWith('/en/')
    ? 'en'
    : pathname === '/ru' || pathname.startsWith('/ru/')
      ? 'ru'
      : 'et'

  function switchLanguage(newLocale: Locale) {
    if (currentEtPath === "/blog" || currentEtPath.startsWith("/blog/")) {
      window.location.assign(localizePath("/", newLocale))
      return
    }
    window.location.assign(localizePath(currentEtPath, newLocale))
  }

  const currentEtPath = getCurrentEtPath(pathname, locale)

  function localeHref(href: string): string {
    if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || /^https?:\/\//.test(href)) {
      return href
    }
    const [pathPart, hashPart] = href.split("#")
    const localized = localizePath(pathPart || "/", locale)
    return hashPart ? `${localized}#${hashPart}` : localized
  }

  const navLinks = [
    { href: "#teenused", label: t('nav.services') },
    { href: "/tule-meile-toole/", label: t('nav.comeToWork'), dropdownKey: "toole" as const, subItems: [
      { href: "/tule-meile-toole/#pakkumised", label: t('nav.activeJobs') },
    ]},
    { href: "/sps-grupp/", label: t('nav.spsGrupp'), dropdownKey: "sps" as const, subItems: [
      { href: "/sps-grupp/arvamused/", label: t('nav.opinions') },
    ]},
    ...(locale === 'et' ? [{ href: "/blog/", label: t('nav.blog') }] : []),
    { href: "/kontakt/", label: t('nav.contact') },
  ]

  const megaMenuData = {
    title: t('megaMenu.services'),
    columns: [
      {
        title: t('megaMenu.cleaningServices'),
        href: "/koristusteenus/",
        subSections: [
          {
            title: t('megaMenu.indoorCleaning'),
            href: "/koristusteenus/",
            items: [
              { label: t('megaMenu.officeCleaning'), href: "/koristusteenus/kontori-koristus/" },
              { label: t('megaMenu.maintenanceCleaning'), href: "/koristusteenus/hoolduskoristus/" },
              { label: t('megaMenu.commercialCleaning'), href: "/koristusteenus/kaubanduspindade-koristus/" },
              { label: t('megaMenu.industrialCleaning'), href: "/koristusteenus/tootmishoonete-koristus/" },
              { label: t('megaMenu.schoolCleaning'), href: "/koolide-koristamine/" },
            ],
          },
          {
            title: t('megaMenu.outdoorCleaning'),
            href: "/koristusteenus/valikoristus/",
            items: [
              { label: t('megaMenu.lawnMowing'), href: "/koristusteenus/valikoristus/muruniitmine/" },
              { label: t('megaMenu.leafRemoval'), href: "/koristusteenus/valikoristus/lehtedekoristamine/" },
              { label: t('megaMenu.janitorService'), href: "/koristusteenus/valikoristus/kojameheteenus/" },
              { label: t('megaMenu.snowRemoval'), href: "/koristusteenus/valikoristus/lumekoristus/" },
            ],
          },
        ],
      },
      {
        title: t('megaMenu.cleaningServices2'),
        href: "/puhastusteenused/",
        subSections: [
          {
            title: t('megaMenu.specialCleaning'),
            href: "/puhastusteenused/",
            items: [
              { label: t('megaMenu.windowCleaning'), href: "/koristusteenus/valikoristus/akende-pesu/" },
              { label: t('megaMenu.carpetCleaning'), href: "/puhastusteenused/vaipade-puhastus/" },
              { label: t('megaMenu.deepCleaning'), href: "/puhastusteenused/suurpuhastus/" },
              { label: t('megaMenu.floorMaintenance'), href: "/puhastusteenused/porandate-hooldus/" },
              { label: t('megaMenu.constructionWaste'), href: "/ehitusprahi-aravedu/" },
              { label: t('megaMenu.postConstructionCleaning'), href: "/puhastusteenused/ehitusjargne-koristus/" },
              { label: t('megaMenu.fireDamageCleaning'), href: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/" },
              { label: t('megaMenu.escalatorDeepCleaning'), href: "/puhastusteenused/eskalaatorite-suvapuhastus/" },
              { label: t('megaMenu.pavingCleaning'), href: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/" },
              { label: t('megaMenu.graffitiRemoval'), href: "/koristusteenus/valikoristus/grafiti-eemaldamine/" },
              { label: t('megaMenu.facadeCleaning'), href: "/koristusteenus/valikoristus/fassaadipesu/" },
            ],
          },
        ],
      },
      {
        title: t('megaMenu.renovationServices'),
        href: "/remonditeenused-tallinnas/",
        items: [
          { label: t('megaMenu.electricalWork'), href: "/remonditeenused-tallinnas/elektritood/" },
          { label: t('megaMenu.plumbing'), href: "/remonditeenused-tallinnas/torutood/" },
          { label: t('megaMenu.interiorFinishing'), href: "/remonditeenused-tallinnas/siseviimistlustood/" },
          { label: t('megaMenu.bathroomRenovation'), href: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/" },
          { label: t('megaMenu.ventilation'), href: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/" },
          { label: t('megaMenu.tiling'), href: "/remonditeenused-tallinnas/plaatimistood/" },
          { label: t('megaMenu.roofRepair'), href: "/remonditeenused-tallinnas/katuse-remont/" },
          { label: t('megaMenu.demolition'), href: "/remonditeenused-tallinnas/lammutustood/" },
        ],
      },
    ],
  }

  const isServicePage = currentEtPath.startsWith("/koristusteenus") || currentEtPath.startsWith("/remonditeenused-tallinnas") || currentEtPath.startsWith("/puhastusteenused") || currentEtPath.startsWith("/ehitusprahi-aravedu")
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [tooleDropdownOpen, setTooleDropdownOpen] = useState(false)
  const [spsDropdownOpen, setSpsDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const tooleDropdownRef = useRef<HTMLDivElement>(null)
  const spsDropdownRef = useRef<HTMLDivElement>(null)

  const closeAllDesktop = useCallback(() => {
    setMegaMenuOpen(false)
    setTooleDropdownOpen(false)
    setSpsDropdownOpen(false)
  }, [])

  const openMobile = useCallback(() => {
    setMobileMenuOpen(true)
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => closeBtnRef.current?.focus())
  }, [])

  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false)
    document.body.style.overflow = ""
    requestAnimationFrame(() => menuBtnRef.current?.focus())
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMobile(); return }
      if (e.key !== "Tab") return
      const menu = mobileMenuRef.current
      if (!menu) return
      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen, closeMobile])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuOpen && megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [megaMenuOpen])

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} id="navbar" aria-label={t('nav.ariaMainMenu')}>
      <div className="navbar-container">
          <Link href={localeHref("/")} className="logo flex items-center gap-2.5 no-underline">
          <Image src="/SPS_LOGO.svg" alt="SPS Grupp" width={288} height={50} preload className="h-[38px] w-auto" />
        </Link>

        <ul className="nav-links flex list-none items-center gap-7" role="menubar">
          {navLinks.map((link, index) => (
            <li key={link.href} role="none">
              {index === 0 ? (
                <div className="mega-menu-trigger" ref={megaMenuRef}>
                  <Link
                    href={localeHref(link.href)}
                    role="menuitem"
                    aria-expanded={megaMenuOpen}
                    aria-controls="mega-menu"
                    aria-haspopup="true"
                    className={`text-[#17345a] text-[15px] font-medium transition-all hover:text-[#17345a] cursor-pointer bg-transparent border-none flex items-center h-full py-0 no-underline ${isServicePage ? "font-bold" : ""}`}
                    style={isServicePage ? { borderBottom: "2px solid #3abeff" } : undefined}
                    onClick={() => { setMegaMenuOpen(!megaMenuOpen); setTooleDropdownOpen(false); setSpsDropdownOpen(false) }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMegaMenuOpen(!megaMenuOpen); setTooleDropdownOpen(false); setSpsDropdownOpen(false) } if (e.key === "Escape") closeAllDesktop() }}
                    onMouseEnter={() => { setTooleDropdownOpen(false); setSpsDropdownOpen(false); setMegaMenuOpen(true) }}
                  >
                    {link.label}
                  </Link>
                  <div
                    id="mega-menu"
                    role="menu"
                    aria-label={t('nav.ariaMegaMenu')}
                    className={`mega-menu bg-white rounded-b-[16px] shadow-lg border border-[rgba(23,52,90,0.08)] p-6 grid grid-cols-3 gap-8 transition-opacity duration-200 ${megaMenuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                  >
                    {megaMenuData.columns.map((col, colIdx) => (
                      <div key={colIdx}>
                        <div className="text-[15px] font-bold text-[#17345a] mb-3">
                          {col.href ? (
                            <Link href={localeHref(col.href)} className="text-[#17345a] no-underline hover:text-[#1e4a7a]">
                              {col.title}
                            </Link>
                          ) : col.title}
                        </div>
                        {col.subSections ? col.subSections.map((sub, subIdx) => (
                          <div key={subIdx} className={subIdx > 0 ? "mt-4" : ""}>
                            <Link href={localeHref(sub.href)} className="text-[15px] font-semibold text-[#5a6474] mb-2 block no-underline hover:text-[#17345a]">{sub.title}</Link>
                            <ul className="flex flex-col gap-1">
                              {sub.items.map((item, itemIdx) => (
                                <li key={itemIdx} role="none">
                                  <Link href={localeHref(item.href)} role="menuitem" className={`text-[15px] no-underline rounded-lg px-2 py-0.5 -mx-2 transition-colors ${currentEtPath === item.href.replace(/\/+$/, "") ? "text-[#17345a] font-bold bg-[#eef7fc]" : "text-[#2f353f] hover:text-[#17345a] hover:bg-gray-100"}`}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )) : col.items ? (
                          <ul className="flex flex-col gap-1 pl-3">
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx} role="none">
                                <Link href={localeHref(item.href)} role="menuitem" className={`text-[15px] no-underline rounded-lg px-2 py-0.5 -mx-2 transition-colors ${currentEtPath === item.href.replace(/\/+$/, "") ? "text-[#17345a] font-bold bg-[#eef7fc]" : "text-[#2f353f] hover:text-[#17345a] hover:bg-gray-100"}`}>
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : "subItems" in link && link.subItems ? (
                <div className="relative" ref={link.dropdownKey === "toole" ? tooleDropdownRef : spsDropdownRef}>
                  <Link
                    href={localeHref(link.href)}
                    role="menuitem"
                    aria-expanded={link.dropdownKey === "toole" ? tooleDropdownOpen : spsDropdownOpen}
                    aria-controls={link.dropdownKey === "toole" ? "toole-dropdown" : "sps-dropdown"}
                    aria-haspopup="true"
                    className="text-[#17345a] no-underline text-[15px] font-medium transition-all hover:text-[#17345a] relative"
                    onClick={() => { const isToole = link.dropdownKey === "toole"; setMegaMenuOpen(false); if (isToole) { setSpsDropdownOpen(false); setTooleDropdownOpen(!tooleDropdownOpen) } else { setTooleDropdownOpen(false); setSpsDropdownOpen(!spsDropdownOpen) } }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const isToole = link.dropdownKey === "toole"; setMegaMenuOpen(false); if (isToole) { setSpsDropdownOpen(false); setTooleDropdownOpen(!tooleDropdownOpen) } else { setTooleDropdownOpen(false); setSpsDropdownOpen(!spsDropdownOpen) } } if (e.key === "Escape") closeAllDesktop() }}
                    onMouseEnter={() => { setMegaMenuOpen(false); if (link.dropdownKey === "toole") { setSpsDropdownOpen(false); setTooleDropdownOpen(true) } else { setTooleDropdownOpen(false); setSpsDropdownOpen(true) } }}
                  >
                    {link.label}
                  </Link>
                  <div
                    id={link.dropdownKey === "toole" ? "toole-dropdown" : "sps-dropdown"}
                    role="menu"
                    className={`absolute left-0 top-full mt-2 bg-white rounded-xl shadow-md border border-[rgba(23,52,90,0.08)] py-2 min-w-[220px] transition-opacity duration-200 ${(link.dropdownKey === "toole" ? tooleDropdownOpen : spsDropdownOpen) ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                    onMouseEnter={() => link.dropdownKey === "toole" ? setTooleDropdownOpen(true) : setSpsDropdownOpen(true)}
                    onMouseLeave={() => link.dropdownKey === "toole" ? setTooleDropdownOpen(false) : setSpsDropdownOpen(false)}
                  >
                    {link.subItems.map((item) => (
                      <Link key={item.href} href={localeHref(item.href)} role="menuitem" className="block px-5 py-2.5 text-[15px] text-[#2f353f] hover:bg-[#eef7fc] hover:text-[#17345a] transition-colors whitespace-nowrap" onClick={closeAllDesktop}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link href={localeHref(link.href)} role="menuitem" className="text-[#17345a] no-underline text-[15px] font-medium transition-all hover:text-[#17345a] relative">
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li role="none">
            <Link href="tel:6623328" className="flex items-center gap-1.5 text-[#17345a] font-medium no-underline min-h-[44px] min-w-[44px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t('nav.phoneShort')}
            </Link>
          </li>
          <li role="none" className="flex items-center gap-1.5">
            {(['et', 'en', 'ru'] as Locale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => switchLanguage(loc)}
                aria-label={`${t('nav.ariaLanguage')} ${loc.toUpperCase()}`}
                className={`flex items-center justify-center min-w-[32px] min-h-[32px] px-1.5 py-0.5 rounded text-[15px] font-semibold border-none cursor-pointer transition-colors ${locale === loc ? "bg-[#17345a] text-white" : "bg-[#f0f4f8] text-[#17345a] hover:bg-[#dde5ee]"}`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </li>
          <li role="none">
            <a href="#pakkumine" className="bg-[#17345a] text-white no-underline py-2.5 px-5 rounded-lg text-[15px] font-medium transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5 min-h-[44px] flex items-center" style={{ boxShadow: "0 2px 12px rgba(23,52,90,0.07)" }} onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}>
              {t('nav.requestQuote')}
            </a>
          </li>
        </ul>
      </div>

      <button
        ref={menuBtnRef}
        className="mobile-menu-btn flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-3 min-w-[44px] min-h-[44px] items-center justify-center"
        aria-label={mobileMenuOpen ? t('nav.ariaCloseMenu') : t('nav.ariaOpenMenu')}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => mobileMenuOpen ? closeMobile() : openMobile()}
      >
        <span className={`block w-[22px] h-0.5 bg-[#17345a] rounded transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
        <span className={`block w-[22px] h-0.5 bg-[#17345a] rounded transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-[22px] h-0.5 bg-[#17345a] rounded transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
      </button>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.ariaMainMenu')}
        className={`fixed inset-0 bg-white z-[1001] overflow-y-auto transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b border-gray-100">
            <Link href={localeHref("/")} className="flex items-center gap-2.5 min-h-[44px]" onClick={closeMobile}>
            <Image src="/SPS_LOGO.svg" alt="SPS Grupp" width={288} height={50} className="h-[32px] w-auto" />
          </Link>
          <button ref={closeBtnRef} onClick={closeMobile} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={t('nav.ariaCloseMenu')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            {navLinks.map((link, index) => (
              <div key={link.href} className="mb-4">
                {index === 0 ? (
                  <div>
                    <div className="text-lg font-bold text-[#17345a] mb-4">{link.label}</div>
                    <div className="grid grid-cols-1 gap-4">
                      {megaMenuData.columns.slice(0, 1).flatMap(col => col.subSections || []).map(sub => (
                        <div key={sub.title}>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0 py-2 min-h-[44px]"
                            aria-expanded={!!expandedSections[sub.title]}
                            aria-controls={`mobile-section-${sub.title.replace(/\s+/g, "-")}`}
                            onClick={() => setExpandedSections(prev => ({ ...prev, [sub.title]: !prev[sub.title] }))}
                          >
                            <span className="flex-1">{sub.title}</span>
                            <svg className={`w-4 h-4 transition-transform ${expandedSections[sub.title] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections[sub.title] && (
                            <ul id={`mobile-section-${sub.title.replace(/\s+/g, "-")}`} className="flex flex-col gap-1 pl-3">
                              {sub.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={localeHref(item.href)} className={`block py-2.5 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center ${currentEtPath === item.href.replace(/\/+$/, "") ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={closeMobile}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {megaMenuData.columns.slice(1, 2).flatMap(col => col.subSections || []).map(sub => (
                        <div key={sub.title}>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0 py-2 min-h-[44px]"
                            aria-expanded={!!expandedSections[sub.title]}
                            aria-controls={`mobile-section-${sub.title.replace(/\s+/g, "-")}`}
                            onClick={() => setExpandedSections(prev => ({ ...prev, [sub.title]: !prev[sub.title] }))}
                          >
                            <span className="flex-1">{sub.title}</span>
                            <svg className={`w-4 h-4 transition-transform ${expandedSections[sub.title] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections[sub.title] && (
                            <ul id={`mobile-section-${sub.title.replace(/\s+/g, "-")}`} className="flex flex-col gap-1 pl-3">
                              {sub.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={localeHref(item.href)} className={`block py-2.5 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center ${currentEtPath === item.href.replace(/\/+$/, "") ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={closeMobile}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {(() => {
                        const renovationItems = megaMenuData.columns[2].items
                        const sections: { label: string; items: { label: string; href: string }[] }[] = []
                        if (renovationItems) {
                          sections.push({ label: t('megaMenu.renovationServices'), items: renovationItems } as typeof sections[number])
                        }
                        return sections.map(section => (
                          <div key={section.label}>
                            <button
                              className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0 py-2 min-h-[44px]"
                              aria-expanded={!!expandedSections[section.label]}
                              aria-controls={`mobile-section-${section.label}`}
                              onClick={() => setExpandedSections(prev => ({ ...prev, [section.label]: !prev[section.label] }))}
                            >
                              <span className="flex-1">{section.label}</span>
                              <svg className={`w-4 h-4 transition-transform ${expandedSections[section.label] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M3 5l3 3 3-3" />
                              </svg>
                            </button>
                            {expandedSections[section.label] && (
                              <ul id={`mobile-section-${section.label}`} className="flex flex-col gap-1 pl-3">
                                {(section.items || []).map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <Link href={localeHref(item.href)} className={`block py-2.5 px-3 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center ${currentEtPath === item.href.replace(/\/+$/, "") ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={closeMobile}>
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                ) : "subItems" in link && link.subItems ? (
                  <div className="mb-4">
                    <Link href={localeHref(link.href)} className="block py-3 text-lg font-medium text-[#2f353f] border-b border-gray-100 min-h-[44px] flex items-center" onClick={closeMobile}>
                      {link.label}
                    </Link>
                    <div className="pl-4 pt-1">
                      {link.subItems.map((item) => (
                        <Link key={item.href} href={localeHref(item.href)} className="block py-2.5 text-[15px] text-[#5a6474] hover:text-[#17345a] transition-colors min-h-[44px] flex items-center" onClick={closeMobile}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={localeHref(link.href)} className="block py-3 text-lg font-medium text-[#2f353f] border-b border-gray-100 min-h-[44px] flex items-center" onClick={closeMobile}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-5" aria-label={t('nav.ariaLanguage')}>
              {(['et', 'en', 'ru'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLanguage(loc)}
                  aria-label={`${t('nav.ariaLanguage')} ${loc.toUpperCase()}`}
                  className={`flex items-center justify-center min-w-[48px] min-h-[44px] px-3 py-2 rounded-lg text-[15px] font-semibold border-none cursor-pointer transition-colors ${locale === loc ? "bg-[#17345a] text-white" : "bg-[#f0f4f8] text-[#17345a] hover:bg-[#dde5ee]"}`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#pakkumine" className="block w-full text-center bg-[#17345a] text-white py-3.5 px-5 rounded-lg font-medium mb-4 min-h-[48px] flex items-center justify-center text-[15px]" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); closeMobile() }}>
              {t('nav.requestQuote')}
            </a>
            <a href="tel:6623328" className="block text-center text-[#2f353f] py-3 min-h-[44px] flex items-center justify-center text-[15px]">
              {t('nav.phoneShort')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
