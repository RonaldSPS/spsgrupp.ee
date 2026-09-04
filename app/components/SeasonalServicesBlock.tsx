"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import TwoToneHeading from "./TwoToneHeading";

/* ──────────── Andmed ──────────── */

interface Hooaeg {
  id: string;
  nimi: string;
  kuud: string;
  varv: string;        // aktsentvärv (border, ikoon)
  bg: string;           // taustavärv
  text: string;         // teksti värv (pealkiri)
  ikoon: React.ReactNode;
  teenused: string[];
  pildiPlaceholder: string; // fallback kui päris pilti pole
}

const hooajad: Hooaeg[] = [
  {
    id: "kevad",
    nimi: "Kevad",
    kuud: "märts – mai",
    varv: "#2d9e6b",
    bg: "#ecfdf5",
    text: "#065f46",
    ikoon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    teenused: [
      "Kevadine lehe- ja prahikoristus",
      "Haljasalade korrastamine",
      "Muruhooaja ettevalmistus",
      "Kõnniteede ja parklaalade puhastus",
      "Fassaadipesu, tänavakivide pesu",
    ],
    pildiPlaceholder: "/valikoristus.jpg",
  },
  {
    id: "suvi",
    nimi: "Suvi",
    kuud: "juuni – august",
    varv: "#d97706",
    bg: "#fffbeb",
    text: "#92400e",
    ikoon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    teenused: [
      "Regulaarne muru niitmine",
      "Territooriumi korrashoid",
      "Kojamehe teenus",
      "Prügikoristus ja väliala hooldus",
      "Umbrohu eemaldamine",
    ],
    pildiPlaceholder: "/valikoristus.jpg",
  },
  {
    id: "sugis",
    nimi: "Sügis",
    kuud: "september – november",
    varv: "#ea580c",
    bg: "#fff7ed",
    text: "#9a3412",
    ikoon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12z" />
        <path d="M16 7h5l-4 4 4 4h-5" />
      </svg>
    ),
    teenused: [
      "Regulaarne lehekoristus",
      "Kõnniteede ja parklaalade puhastus",
      "Haljasalade hooajaline hooldus",
      "Talveks ettevalmistavad hooldustööd",
      "Kojamehe teenus vastavalt vajadusele",
    ],
    pildiPlaceholder: "/valikoristus.jpg",
  },
  {
    id: "talv",
    nimi: "Talv",
    kuud: "detsember – veebruar",
    varv: "#3b82f6",
    bg: "#eff6ff",
    text: "#1e40af",
    ikoon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="16" x2="8.01" y2="16" />
        <line x1="8" y1="20" x2="8.01" y2="20" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="12" y1="22" x2="12.01" y2="22" />
        <line x1="16" y1="16" x2="16.01" y2="16" />
        <line x1="16" y1="20" x2="16.01" y2="20" />
      </svg>
    ),
    teenused: [
      "Lumekoristus",
      "Libedusetõrje",
      "Kõnniteede ja parklate puhastus",
      "Sissepääsude korrashoid",
      "Ööpäevaringne valmisolek",
    ],
    pildiPlaceholder: "/Lumelükkamine3.png",
  },
];

/* ──────────── Alamkomponent: hooaja kaart ──────────── */

function HooajaKaart({ hooaeg, isLast }: { hooaeg: Hooaeg; isLast: boolean }) {
  return (
    <div
      className={`season-card group relative pl-5 pr-4 py-4 transition-all duration-300 cursor-pointer ${
        isLast ? "" : "border-b border-[#e2e8f0]"
      }`}
      style={{
        borderLeft: `4px solid ${hooaeg.varv}`,
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hooaeg.bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Päis: ikoon + nimi + kuud */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ color: hooaeg.varv, background: hooaeg.bg }}
        >
          {hooaeg.ikoon}
        </div>
        <div>
          <h3
            className="text-[18px] font-bold leading-tight"
            style={{ color: hooaeg.text }}
          >
            {hooaeg.nimi}
          </h3>
          <p className="text-[15px] text-[#5a6474] leading-tight">
            {hooaeg.kuud}
          </p>
        </div>
      </div>

      {/* Teenuste loend */}
      <ul className="space-y-1.5 ml-[52px]">
        {hooaeg.teenused.map((teenus, idx) => (
          <li
            key={idx}
            className="text-[15px] text-[#2f353f] leading-[1.6] flex items-start gap-2"
          >
            <span
              className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: hooaeg.varv }}
            />
            <span>{teenus}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────── Põhikomponent ──────────── */

export default function SeasonalServicesBlock() {
  const locale = useLocale();
  const seasonalImageAlt = locale === "ru"
    ? "Круглогодичное обслуживание территории - SPS Grupp"
    : locale === "en"
      ? "Year-round grounds maintenance - SPS Grupp"
      : "Välihooldus aastaringselt - SPS Grupp";

  return (
    <section
      className="py-[100px]"
      style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
    >
      <div className="max-w-[1280px] mx-auto px-[5%]">
        {/* Pealkiri + intro */}
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            Teenuse sisu
          </div>
          <TwoToneHeading text="Välihooldus läbi aastaaegade" />
          <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
            Eesti kliima tähendab, et iga aastaaeg toob kaasa erinevad hooldusvajadused.
            Hästi toimiv välihooldus ei ole ainult üksik teenus, vaid aastaringne süsteem,
            mis hoiab territooriumi korras, turvalise ja esinduslikuna igal hooajal.
          </p>
        </div>

        {/* Kahe tulbaga sisu */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[50px] items-start">
          {/* VASAK TULP - 4 hooaja kaarti */}
          <div className="bg-[#ffffffa0] backdrop-blur-[5px] rounded-2xl border border-[#85cbe9]/20 overflow-hidden">
            {hooajad.map((hooaeg, idx) => (
              <HooajaKaart
                key={hooaeg.id}
                hooaeg={hooaeg}
                isLast={idx === hooajad.length - 1}
              />
            ))}
          </div>

          {/* PAREM TULP - pilt + hoolduslepingu lühijutt */}
          <div className="flex flex-col gap-6">
            {/* Pildi placeholder */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#e2e8f0]">
              <Image
                src="/Lumelükkamine3.png"
                alt={seasonalImageAlt}
                width={400}
                height={533}
                className="w-full h-full object-cover"
                style={{ }}
              />
              {/* Värviline overlay riba pildi all servas */}
              <div className="absolute bottom-0 left-0 right-0 flex h-2">
                <div className="flex-1" style={{ background: "#2d9e6b" }} />
                <div className="flex-1" style={{ background: "#d97706" }} />
                <div className="flex-1" style={{ background: "#ea580c" }} />
                <div className="flex-1" style={{ background: "#3b82f6" }} />
              </div>
            </div>

            {/* Aastase hoolduslepingu CTA kast */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#17345a" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3abeff" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-white text-[15px] font-bold">Aastane hooldusleping</span>
              </div>
              <p className="text-white/80 text-[15px] leading-[1.7] mb-4">
                Kõik hooajalised teenused ühes paketis - muru niitmisest lumekoristuseni.
                Fikseeritud kuumakse, kindel graafik ja kiire reageerimine.
              </p>
              <a
                href="#pakkumine"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-[#3abeff] hover:text-white transition-colors"
              >
                Küsi pakkumist
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
