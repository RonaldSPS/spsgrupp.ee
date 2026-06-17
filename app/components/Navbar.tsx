"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#teenused", label: "Teenused" },
  { href: "/tule-meile-toole", label: "Tule tööle", subItems: [
    { href: "/tule-meile-toole#pakkumised", label: "Aktiivsed tööpakkumised" },
  ]},
  { href: "/sps-grupp", label: "SPS Grupp", subItems: [
    { href: "/sps-grupp/arvamused", label: "Arvamused" },
  ]},
  { href: "/blog", label: "Blogi" },
  { href: "/kontakt", label: "Kontakt" },
];

const megaMenuData = {
  title: "Teenused",
  columns: [
    {
      title: "Koristusteenused",
      href: "/koristusteenus",
      subSections: [
        {
          title: "Sisekoristus",
          href: "/koristusteenus",
          items: [
            { label: "Kontori koristus", href: "/koristusteenus/kontori-koristus" },
            { label: "Kaubanduspindade koristus", href: "/koristusteenus/kaubanduspindade-koristus" },
            { label: "Tootmishoonete koristus", href: "/koristusteenus/tootmishoonete-koristus" },
            { label: "Koolide koristus", href: "/koristusteenus/koolide-koristamine" },
          ],
        },
        {
          title: "Välikoristus",
          href: "/koristusteenus/valikoristus",
          items: [
            { label: "Muru niitmine", href: "/koristusteenus/valikoristus/muruniitmine" },
            { label: "Lehtede koristamine", href: "/koristusteenus/valikoristus/lehtedekoristamine" },
            { label: "Kojamehe teenus", href: "/koristusteenus/valikoristus/kojameheteenus" },
            { label: "Lumekoristus", href: "/koristusteenus/valikoristus/lumekoristus" },
          ],
        },
      ],
    },
    {
      title: "Puhastusteenused",
      href: "/puhastusteenused",
      subSections: [
        {
          title: "Eripuhastustööd",
          href: "/puhastusteenused",
          items: [
            { label: "Akende pesu", href: "/koristusteenus/valikoristus/akende-pesu" },
            { label: "Vaipade puhastus", href: "/puhastusteenused/vaipade-puhastus" },
            { label: "Põrandate hooldus", href: "/puhastusteenused/porandate-hooldus" },
            { label: "Ehitusprahi äravedu", href: "/ehitusprahi-aravedu" },
            { label: "Ehitusjärgne koristus", href: "/puhastusteenused/ehitusjargne-koristus" },
            { label: "Tulekahjustuste eemaldus", href: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine" },
            { label: "Eskalaatorite süvapuhastus", href: "/puhastusteenused/eskalaatorite-suvapuhastus" },
            { label: "Desinfitseerimine", href: "/puhastusteenused/desinfitseerimine" },
            { label: "Tänavakivide pesu ja hooldus", href: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus" },
            { label: "Graffiti eemaldamine", href: "/koristusteenus/valikoristus/grafiti-eemaldamine" },
            { label: "Fassaadipesu", href: "/koristusteenus/valikoristus/fassaadipesu" },
          ],
        },
      ],
    },
    {
      title: "Remonditeenused",
      href: "/remonditeenused-tallinnas",
      items: [
        { label: "Elektritööd", href: "/remonditeenused-tallinnas/elektritood/" },
        { label: "Torutööd", href: "/remonditeenused-tallinnas/torutood/" },
        { label: "Siseviimistlustööd", href: "/remonditeenused-tallinnas/siseviimistlustood/" },
        { label: "Sanitaarremont", href: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus/" },
        { label: "Ventilatsioonide ehitus", href: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus/" },
        { label: "Plaatimistööd", href: "/remonditeenused-tallinnas/plaatimistood/" },
        { label: "Katuse remont", href: "/remonditeenused-tallinnas/katuse-remont/" },
        { label: "Lammutustööd", href: "/remonditeenused-tallinnas/lammutustood/" },
      ],
    },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const isServicePage = pathname.startsWith("/koristusteenus") || pathname.startsWith("/remonditeenused-tallinnas") || pathname.startsWith("/puhastusteenused") || pathname.startsWith("/ehitusprahi-aravedu");
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [tooleDropdownOpen, setTooleDropdownOpen] = useState(false);
  const [spsDropdownOpen, setSpsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleMouseEnter = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setMegaMenuOpen(false), 200);
    setMenuTimeout(timeout);
  };

  const handleTooleEnter = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setTooleDropdownOpen(true);
  };

  const handleTooleLeave = () => {
    const timeout = setTimeout(() => setTooleDropdownOpen(false), 200);
    setMenuTimeout(timeout);
  };

  const handleSpsEnter = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setSpsDropdownOpen(true);
  };

  const handleSpsLeave = () => {
    const timeout = setTimeout(() => setSpsDropdownOpen(false), 200);
    setMenuTimeout(timeout);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
      id="navbar"
    >
      <div className="navbar-container">
        <Link href="/" className="logo flex items-center gap-2.5 no-underline">
          <Image
            src="/SPS_LOGO.svg"
            alt="SPS Grupp — koristusfirma"
            width={38}
            height={38}
            style={{ width: "auto", height: "38px", color: "#2d3748" }}
          />
</Link>

        <ul className="nav-links flex list-none items-center gap-7">
        {navLinks.map((link, index) => (
          <li key={link.href}>
            {index === 0 ? (
              <div 
                className="mega-menu-trigger relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className={`text-[#17345a] text-[15px] font-medium transition-all hover:text-[#17345a] cursor-pointer bg-transparent border-none flex items-center h-full py-0 no-underline ${isServicePage ? "font-bold" : ""}`}
                  style={isServicePage ? { borderBottom: "2px solid #3abeff" } : undefined}
                >
                  {link.label}
                </Link>
                <div 
                  className={`mega-menu max-w-[1100px] w-[95vw] bg-white rounded-b-[16px] shadow-lg border border-[rgba(23,52,90,0.08)] p-6 grid grid-cols-3 gap-8 transition-opacity duration-200 ${megaMenuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                    {megaMenuData.columns.map((col, colIdx) => (
                      <div key={colIdx}>
                        <div className="text-[15px] font-bold text-[#17345a] mb-3">
                          {col.href ? (
                            <Link href={col.href} className={`text-[#17345a] no-underline hover:text-[#1e4a7a] ${pathname === col.href ? "font-bold" : ""}`}>
                              {col.title}
                            </Link>
                          ) : (
                            col.title
                          )}
                        </div>
                        {col.subSections ? (
                          col.subSections.map((sub, subIdx) => (
                            <div key={subIdx} className={subIdx > 0 ? "mt-4" : ""}>
                              {"href" in sub ? (
                                <Link href={(sub as typeof sub & { href: string }).href} className="text-[15px] font-semibold text-[#5a6474] mb-2 block no-underline hover:text-[#17345a]">
                                  {sub.title}
                                </Link>
                              ) : (
                                <div className="text-[15px] font-semibold text-[#5a6474] mb-2">
                                  {(sub as { title: string; items: { label: string; href: string }[] }).title}
                                </div>
                              )}
                              <ul className="flex flex-col gap-1">
                                {sub.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <Link href={item.href} className={`text-[15px] no-underline rounded-lg px-2 py-0.5 -mx-2 transition-colors ${pathname === item.href ? "text-[#17345a] font-bold bg-[#eef7fc]" : "text-[#2f353f] hover:text-[#17345a] hover:bg-gray-100"}`}>
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : col.items ? (
                          <ul className="flex flex-col gap-1 pl-3">
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <Link href={item.href} className={`text-[15px] no-underline rounded-lg px-2 py-0.5 -mx-2 transition-colors ${pathname === item.href ? "text-[#17345a] font-bold bg-[#eef7fc]" : "text-[#2f353f] hover:text-[#17345a] hover:bg-gray-100"}`}>
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
              <div 
                className="relative"
                onMouseEnter={link.href === "/tule-meile-toole" ? handleTooleEnter : handleSpsEnter}
                onMouseLeave={link.href === "/tule-meile-toole" ? handleTooleLeave : handleSpsLeave}
              >
                <Link
                  href={link.href}
                  className="text-[#17345a] no-underline text-[15px] font-medium transition-all hover:text-[#17345a] relative"
                >
                  {link.label}
                </Link>
                <div 
                  className={`absolute left-0 top-full mt-2 bg-white rounded-xl shadow-md border border-[rgba(23,52,90,0.08)] py-2 min-w-[220px] transition-opacity duration-200 ${(link.href === "/tule-meile-toole" ? tooleDropdownOpen : spsDropdownOpen) ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
                  onMouseEnter={() => link.href === "/tule-meile-toole" ? setTooleDropdownOpen(true) : setSpsDropdownOpen(true)}
                  onMouseLeave={() => link.href === "/tule-meile-toole" ? setTooleDropdownOpen(false) : setSpsDropdownOpen(false)}
                >
                  {link.subItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-5 py-2.5 text-[15px] text-[#2f353f] hover:bg-[#eef7fc] hover:text-[#17345a] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={link.href}
                className="text-[#17345a] no-underline text-[15px] font-medium transition-all hover:text-[#17345a] relative"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
        <li>
          <Link
            href="tel:6623328"
            className="flex items-center gap-1.5 text-[#17345a] font-medium no-underline"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            662 3328
          </Link>
        </li>
        <li>
          <a
            href="#pakkumine"
            className="bg-[#17345a] text-white no-underline py-2 px-5 rounded-lg text-[15px] font-medium transition-all hover:bg-[#1e4a7a] hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 12px rgba(23,52,90,0.07)" }}
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Küsi pakkumist
          </a>
        </li>
      </ul>
      </div>

      {/* Mobile menu toggle button */}
      <button
        className="mobile-menu-btn flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-2"
        aria-label="Menüü"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="block w-[22px] h-0.5 bg-[#17345a] rounded"></span>
        <span className="block w-[22px] h-0.5 bg-[#17345a] rounded"></span>
        <span className="block w-[22px] h-0.5 bg-[#17345a] rounded"></span>
      </button>

      {/* Mobile mega menu (fullscreen on mobile) */}
        <div className={`fixed inset-0 bg-white z-[1001] overflow-y-auto transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          {/* Sticky header with close button */}
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/SPS_LOGO.svg"
                alt="SPS Grupp — koristusfirma"
                width={32}
                height={32}
                style={{ width: "auto", height: "32px", color: "#2d3748" }}
              />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2" aria-label="Sulge menüü">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {/* Main nav links */}
            <div className="mb-8">
              {navLinks.map((link, index) => (
                <div key={link.href} className="mb-4">
                  {index === 0 ? (
                    <div>
                      <div className="text-lg font-bold text-[#17345a] mb-4">{link.label}</div>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Koristusteenused */}
                        <div>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0"
                            onClick={() => setExpandedSections(prev => ({ ...prev, Koristusteenused: !prev.Koristusteenused }))}
                          >
                            <span className="flex-1">Koristusteenused</span>
                            <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.Koristusteenused ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections.Koristusteenused && (
                            <ul className="flex flex-col gap-1 pl-3">
                              {megaMenuData.columns[0].subSections?.[0].items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={item.href} className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${pathname === item.href ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Puhastusteenused */}
                        <div>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0"
                            onClick={() => setExpandedSections(prev => ({ ...prev, Puhastusteenused: !prev.Puhastusteenused }))}
                          >
                            <span className="flex-1">Puhastusteenused</span>
                            <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.Puhastusteenused ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections.Puhastusteenused && (
                            <ul className="flex flex-col gap-1 pl-3">
                              {megaMenuData.columns[1].subSections?.[0].items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={item.href} className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${pathname === item.href ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Välikoristus */}
                        <div>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0"
                            onClick={() => setExpandedSections(prev => ({ ...prev, Välikoristus: !prev.Välikoristus }))}
                          >
                            <span className="flex-1">Välikoristus</span>
                            <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.Välikoristus ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections.Välikoristus && (
                            <ul className="flex flex-col gap-1 pl-3">
                              {megaMenuData.columns[0].subSections?.[1].items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={item.href} className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${pathname === item.href ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Remonditeenused */}
                        <div>
                          <button
                            className="text-base font-bold text-[#17345a] mb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer w-full text-left px-0"
                            onClick={() => setExpandedSections(prev => ({ ...prev, Remonditeenused: !prev.Remonditeenused }))}
                          >
                            <span className="flex-1">Remonditeenused</span>
                            <svg className={`w-3.5 h-3.5 transition-transform ${expandedSections.Remonditeenused ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 5l3 3 3-3" />
                            </svg>
                          </button>
                          {expandedSections.Remonditeenused && (
                            <ul className="flex flex-col gap-1 pl-3">
                              {megaMenuData.columns[2].items?.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link href={item.href} className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${pathname === item.href ? "bg-[#eef7fc] text-[#17345a] font-bold" : "text-[#2f353f]"}`} onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : "subItems" in link && link.subItems ? (
                    <div className="mb-4">
                      <Link 
                        href={link.href} 
                        className="block py-3 text-lg font-medium text-[#2f353f] border-b border-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <div className="pl-4 pt-1">
                        {link.subItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block py-2.5 text-[15px] text-[#5a6474] hover:text-[#17345a] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="block py-3 text-lg font-medium text-[#2f353f] border-b border-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA and contact */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <a 
                href="#pakkumine"
                className="block w-full text-center bg-[#17345a] text-white py-3 px-5 rounded-lg font-medium mb-4"
                onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
              >
                Küsi pakkumist
              </a>
              <a href="tel:6623328" className="block text-center text-[#2f353f] py-2">
                662 3328
              </a>
            </div>
          </div>
        </div>
    </nav>
  );
}
