import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#teenused", label: "Teenused" },
  { href: "/tule-meile-toole", label: "Tule tööle" },
  { href: "/sps-grupp", label: "SPS Grupp" },
  { href: "/blog", label: "Blogi" },
  { href: "/kontakt", label: "Kontakt" },
];

const megaMenuData = {
  title: "Koristusteenused",
  columns: [
    {
      title: "Sisekoristus",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
          <path d="M5 8h14" />
          <path d="M9 2v5" />
          <path d="M15 2v5" />
          <rect x="6" y="8" width="12" height="3" rx="1" />
        </svg>
      ),
      items: [
        { label: "Kontori koristus", href: "/koristusteenus/kontori-koristus-seo-naidis" },
        { label: "Kaubanduspindade koristus", href: "/koristusteenus/kaubanduspindade-koristus-seo-naidis" },
        { label: "Tootmishoonete koristus", href: "/koristusteenus/tootmishoonete-koristus-seo-naidis" },
        { label: "Koolide koristus", href: "/koristusteenus/koolide-koristamine-seo-naidis" },
      ],
    },
    {
      title: "Eripuhastustööd",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="6" height="10" rx="1" />
          <rect x="10" y="14" width="4" height="2" rx="0.5" />
          <path d="M14 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" />
          <path d="M17 8V6a2 2 0 0 0-2-2h-1" />
          <line x1="6" y1="11" x2="8" y2="11" />
        </svg>
      ),
      items: [
        { label: "Akende pesu", href: "/koristusteenus/valikoristus/akende-pesu-seo-naidis" },
        { label: "Vaipade puhastus", href: "/puhastusteenused/vaipade-puhastus" },
        { label: "Põrandate hooldus", href: "/puhastusteenused/porandate-hooldus" },
        { label: "Ehitusprahi äravedu", href: "/ehitusprahi-aravedu" },
        { label: "Ehitusjärgne koristus", href: "/puhastusteenused/ehitusjargne-koristus" },
        { label: "Tulekahjustuste eemaldus", href: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine" },
        { label: "Eskalaatorite süvapuhastus", href: "/puhastusteenused/eskalaatorite-suvapuhastus" },
        { label: "Desinfitseerimine", href: "/puhastusteenused/desinfitseerimine" },
        { label: "Tänavakivide pesu ja hooldus", href: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus-seo-naidis" },
        { label: "Graffiti eemaldamine", href: "/koristusteenus/valikoristus/grafiti-eemaldamine-seo-naidis" },
        { label: "Fassaadipesu", href: "/koristusteenus/valikoristus/fassaadipesu-seo-naidis" },
      ],
    },
    {
      title: "Välikoristus",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <rect x="9" y="13" width="6" height="8" />
          <path d="M10 9h4" />
          <circle cx="16" cy="4" r="1" fill="#85cbe9" stroke="none" />
          <path d="M16 7v1" />
        </svg>
      ),
      items: [
        { label: "Välikoristus", href: "/koristusteenus/valikoristus-seo-naidis" },
        { label: "Fassaadipesu", href: "/koristusteenus/valikoristus/fassaadipesu-seo-naidis" },
        { label: "Akende pesu", href: "/koristusteenus/valikoristus/akende-pesu-seo-naidis" },
        { label: "Graffiti eemaldamine", href: "/koristusteenus/valikoristus/grafiti-eemaldamine-seo-naidis" },
        { label: "24/7 lumekoristus", href: "/koristusteenus/valikoristus/lumekoristus-seo-naidis" },
      ],
    },
    {
      title: "Remonditeenused",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#85cbe9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      items: [
        { label: "Elektritööd", href: "/remonditeenused-tallinnas/elektritood" },
        { label: "Torutööd", href: "/remonditeenused-tallinnas/torutood" },
        { label: "Siseviimistlus", href: "/remonditeenused-tallinnas/siseviimistlustood" },
        { label: "Sanitaarremont", href: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus" },
        { label: "Ventilatsioonide ehitus", href: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus" },
        { label: "Katuse remont", href: "/remonditeenused-tallinnas/katuse-remont" },
        { label: "Plaatimistööd", href: "/remonditeenused-tallinnas/plaatimistood" },
        { label: "Lammutustööd", href: "/remonditeenused-tallinnas/lammutustood" },
      ],
    },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1f33] py-12 border-t border-[rgba(133,203,233,0.08)]">
      <div className="max-w-[1440px] mx-auto px-[25px]">
        {/* Top section - menu system like navbar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-9 border-b border-[rgba(133,203,233,0.06)]">
          {/* Column 1: Logo + Nav links + Kontakt */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <Image
                src="/SPS_LOGO.svg"
                alt="SPS Grupp — koristusfirma"
                width={38}
                height={38}
                style={{ width: "auto", height: "38px", color: "#2d3748" }}
              />
            </Link>

            {/* Anti-bot protected contact info */}
            <div className="mt-4 space-y-1">
              <a
                href={"https://www.google.com/maps/place/Tetris+B%C3%BCroohoone,+Mustam%C3%A4e+tee+46,+10621+Tallinn/@59.4162971,24.6890432,17z/data=!3m1!4b1!4m6!3m5!1s0x469294f5fec8e2fd:0xc2b28e6f780f9897!8m2!3d59.4162944!4d24.6916181!16s%2Fg%2F1q6jyqwpb?entry=tts&g_ep=EgoyMDI1MDIyMy4xIPu8ASoASAFQAw%3D%3D"}
                className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9] block"
                rel="nofollow"
              >
                {"MUSTAMÄE TEE 46, 10621 TALLINN"}
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
              {navLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Facebook link */}
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

          {/* Column 2: Teenused with mega menu */}
          <div>
            <h2 className="text-white text-[15px] font-bold mb-3 flex items-center gap-2">
              {megaMenuData.columns[0].icon && (
                <span className="w-5 h-5 text-[#85cbe9]">
                  {megaMenuData.columns[0].icon}
                </span>
              )}
              {megaMenuData.columns[0].title}
            </h2>
            <ul className="flex flex-col gap-1 list-none">
              {megaMenuData.columns[0].items.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a href="https://taust.ee/app/report/sps-grupp-ou-11394806" className="block mt-4 no-underline" rel="nofollow">
              <Image
                src="/Hasti-juhitud-ettevote.webp"
                alt="Hästi juhitud ettevõte"
                width={120}
                height={120}
                style={{ width: "auto", height: "auto", color: "#2d3748" }}
              />
            </a>
          </div>

          {/* Column 3: Eripuhastustööd */}
          <div>
            <Link href="/puhastusteenused" className="text-white text-[15px] font-bold mb-3 flex items-center gap-2 no-underline hover:text-[#85cbe9]">
              {megaMenuData.columns[1].icon && (
                <span className="w-5 h-5 text-[#85cbe9]">
                  {megaMenuData.columns[1].icon}
                </span>
              )}
              {megaMenuData.columns[1].title}
            </Link>
            <ul className="flex flex-col gap-1 list-none">
              {megaMenuData.columns[1].items.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Välikoristus */}
          <div>
            <h2 className="text-white text-[15px] font-bold mb-3 flex items-center gap-2">
              {megaMenuData.columns[2].icon && (
                <span className="w-5 h-5 text-[#85cbe9]">
                  {megaMenuData.columns[2].icon}
                </span>
              )}
              {megaMenuData.columns[2].title}
            </h2>
            <ul className="flex flex-col gap-1 list-none">
              {megaMenuData.columns[2].items.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Remonditeenused */}
          <div>
            <h2 className="text-white text-[15px] font-bold mb-3 flex items-center gap-2">
              {megaMenuData.columns[3].icon && (
                <span className="w-5 h-5 text-[#85cbe9]">
                  {megaMenuData.columns[3].icon}
                </span>
              )}
              {megaMenuData.columns[3].title}
            </h2>
            <ul className="flex flex-col gap-1 list-none">
              {megaMenuData.columns[3].items.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-white/65 text-[15px] no-underline hover:text-[#85cbe9]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center mt-5 flex-wrap gap-2.5 text-[15px] text-white/70 font-light">
          <span>© {currentYear} SPS Grupp. Kõik õigused kaitstud.</span>
          <div className="flex gap-5">
            <Link href="/privaatsus" className="text-white/70 no-underline hover:text-[#85cbe9]">Privaatsus</Link>
            <Link href="/kasutustingimused" className="text-white/70 no-underline hover:text-[#85cbe9]">Kasutustingimused</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
