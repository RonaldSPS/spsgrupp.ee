"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import HeroBackgroundImage from "../../../components/HeroBackgroundImage";
import Footer from "../../../components/Footer";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import SeoJsonLd from "../../../components/SeoJsonLd";
import Tooprotsess from "../../../components/Tooprotsess";

const floatingChips = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    chipClass: "chip-icon-blue",
    value: "24/7",
    label: "valmisolek",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    chipClass: "chip-icon-green",
    value: "Automaatne",
    label: "reageerimine",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    chipClass: "chip-icon-navy",
    value: "200+",
    label: "objekti",
  },
];

const teenuseSisuKaardid: { bold: string; desc: string }[] = [
  {
    bold: "Parklate ja sissepääsude lumekoristus",
    desc: "Parklate, juurdepääsuteede ja sissepääsude puhastus lumest koheselt peale sadu.",
  },
  {
    bold: "Kõnniteede ja jalakäijate alade koristus",
    desc: "Kõik jalakäijate liikumisteed, trepid ja kaldteed puhastatud ja turvalised.",
  },
  {
    bold: "Libedusetõrje soola ja kruusaga",
    desc: "Sool sulatab lund ja jääd, graniidikruus tagab haardumise. Kombineeritud tõrje.",
  },
  {
    bold: "Lume äravedu",
    desc: "Kui parklas ei jätku enam ruumi, korraldame lume äraveo. Lisateenus vastavalt vajadusele.",
  },
  {
    bold: "24/7 valmisolek hooaja vältel",
    desc: "Oktoobrist aprillini oleme valmis reageerima ööpäevaringselt igal ajal.",
  },
  {
    bold: "Automaatne reageerimine ilmaprognoosi järgi",
    desc: "Jälgime ilmaprognoosi pidevalt. Kui sajab lund, oleme kohal. Te ei pea meid kutsuma.",
  },
  {
    bold: "Katustelt lume koristamine",
    desc: "Ohutõrjega lumekoristus katustelt. Väldime lumevarisemise ohtu ja vee kahjustusi.",
  },
  {
    bold: "Porimattide paigaldus sissepääsule",
    desc: "Paigaldame porimatid sissepääsudele, et vältida lume ja pori sissekandumist.",
  },
  {
    bold: "Hädaolukorra kiirreageerimine",
    desc: "Erakorralise lumesaju või ohu korral reageerime prioriteetselt ja kiiresti.",
  },
];

const miksMeieKaardid = [
  {
    title: "Automaatne reageerimine",
    desc: "Te ei pea meile helistama. Jälgime ilmaprognoosi ja tuleme automaatselt. Hommikul on parkla puhas.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Fikseeritud hooajahind",
    desc: "Hoolimata sellest, kui palju lund talvel sajab, hind on fikseeritud. Ennustatav eelarve ilma üllatusteta.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Kindlustatud teenus",
    desc: "Kui meie töö tagajärjel tekib kahju, hüvitatakse see. Kui jätame koristamata ja keegi libastub, on vastutus meie.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Tallinna talvede kogemus",
    desc: "Talviseid hooldustöid teeme alates 2006. aastast. Töökorraldus ja ressursid lepitakse kokku objekti ning hooajalepingu järgi.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const hindKaardid = [
  {
    size: "Väike parkla",
    area: "kõnniteega",
    price: "150€/kuu",
    period: "alates",
    highlight: true,
  },
  {
    size: "Keskmine",
    area: "ärikinnistu",
    price: "300€/kuu",
    period: "alates",
  },
  {
    size: "Suur",
    area: "ärikompleks",
    price: "Individuaalne",
    period: "pakkumine",
  },
];

const lumekoristusFAQ = [
  {
    q: "Millal lumekoristuse leping algab?",
    a: "Tavaliselt oktoobri esimesest päevast aprilli viimase päevani. Soovitame lepingu sõlmida hiljemalt septembris, et tagada valmisolek hooaja alguseks.",
  },
  {
    q: "Kas ma pean teile helistama, kui sajab lund?",
    a: "Ei. Jälgime ilmaprognoosi ja tuleme automaatselt. Hommikul kell 7 on teie kinnistu lumest puhas. Erakorralise olukorra puhul helistage alati.",
  },
  {
    q: "Kas teete libedusetõrjet soola või kruusaga?",
    a: "Tavaliselt kombineeritult — sool sulatab lund, graniidikruus tagab haardumise. Teatud pindadel (tundlikud põrandad, rohuala) kasutame ainult kruusa.",
  },
  {
    q: "Mis juhtub, kui te ei jõua õigeks ajaks ja keegi libastub?",
    a: "Teenus on kindlustatud. Meie vastutus katab võimalikud kahjud. Siiski, tõsistel lumetormidel on meil paindlik prioriteedisüsteem.",
  },
  {
    q: "Kas korraldate ka lume äravedu suurte kuhjade korral?",
    a: "Jah, lume äravedu on lisateenus. Vajadus tekib tavaliselt suurte sajude järel, kui parklas ei jätku enam ruumi kuhjumiseks.",
  },
];

export default function Lumekoristus() {
  return (
    <>
      <SeoJsonLd
        etPath="/koristusteenus/valikoristus/lumekoristus"
        locale="et"
        serviceName="Lumekoristus Tallinnas"
        serviceDescription="Lumekoristus ja libedusetõrje Tallinnas 24/7. Parklad, kõnniteed, sissepääsud. Hooajaline leping."
        breadcrumbs={[
          { name: "Avaleht", etPath: "/" },
          { name: "Koristusteenus", etPath: "/koristusteenus" },
          { name: "Välikoristus", etPath: "/koristusteenus/valikoristus" },
          { name: "Lumekoristus", etPath: "/koristusteenus/valikoristus/lumekoristus" },
        ]}
        faq={lumekoristusFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Lumekoristus"
        >
          <HeroBackgroundImage src="/lumelykkamine-1.jpg" preload alt="" />
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className="floating-chip animate-float"
                style={{ background: "rgba(255,255,255,0.95)" }}
              >
                <div
                  className={`chip-icon ${chip.chipClass} w-11 h-11 rounded-xl flex items-center justify-center`}
                >
                  {chip.icon}
                </div>
                <div>
                  <div className="text-[18px] font-bold text-[#17345a] leading-tight">
                    {chip.value}
                  </div>
                  <div className="text-[15px] text-[#1f2937]">{chip.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[60px] items-start max-w-[1280px] mx-auto w-full relative z-10">
            <div
              className="animate-fade-up order-2 md:order-1"
              style={{
                background: "rgba(55, 54, 45, 0.62)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(3px)",
                padding: "32px",
                borderRadius: "20px",
                border: "1px solid rgba(133, 203, 233, 0.2)",
              }}
            >
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] -tracking-[1px] mb-[18px]">
                Lumekoristus ja libedusetõrje
                <br />
                <span className="text-[#3abeff]">24/7</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Automaatne reageerimine lumesajule. Parklad, kõnniteed,
                sissepääsud puhtad ja turvalised. Hooajaline leping,
                fikseeritud hinnaga.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi lumekoristuse pakkumist
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link
                  href="tel:6623328"
                  className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4"
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
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus/" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus/valikoristus/" className="text-white/80 no-underline hover:text-white transition-colors">Välikoristus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Lumekoristus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading
                text="Lumekoristus on ohutuse küsimus"
                className="mb-8"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  Eesti seaduste järgi vastutab kinnistu omanik selle juures
                  oleva kõnnitee, parkla ja sissepääsu seisukorra eest.
                  Libedusest tingitud õnnetuste korral võib kahju olla
                  märkimisväärne. Libedusest tingitud kukkumised on Eesti
                  talvede üks tavalisimaid õnnetusi.
                  <br />
                  <br />
                  Lisaks juriidilisele vastutusele on otsene ärikahju:
                  klientidel on ebamugav, parkla on kasutuskõlbmatu, sissepääs
                  on blokeeritud. Üks hommik koristamata lume tõttu võib maksta
                  rohkem kui terve talve hooldusleping.
                </div>
                <div>
                  SPS Grupp pakub hooajalist lumekoristuse lepingut, mis
                  käivitub automaatselt: kui sajab lund, oleme kohal. Te ei pea
                  meid kutsuma. Fikseeritud hooaja hind, prognoositav eelarve.
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Teenuse sisu */}
        <ScrollAnimation animation="fade-up">
          <section
            className="py-[100px]"
            id="teenused"
            style={{
              background:
                "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat",
            }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Teenuse sisu
                </div>
                <TwoToneHeading text="Mida sisaldab lumekoristuse teenus?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teenuseSisuKaardid.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80"
                  >
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                    </div>
                    <div className="text-[#2f353f] text-[15px] leading-[1.6]">
                      <strong className="text-[#17345a] block mb-1">
                        {item.bold}
                      </strong>
                      <span className="text-[#5a6474]">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Miks meie */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Miks meie
                </div>
                <TwoToneHeading text="Miks valida SPS Grupp lumekoristuse partneriks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {miksMeieKaardid.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-[18px] font-bold text-[#17345a] mb-2">
                            {item.title}
                          </h3>
                          <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/Lumelykkamine2.png"
                    alt="Lumekoristus SPS Grupp"
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                    style={{ color: "#2d3748" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Hind */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M15 4a7 7 0 0 0-7 7 7 7 0 0 0 7 7M7 10h8M7 14h8" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text="Kuidas kujuneb lumekoristuse hind?" />
              </div>

              <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light max-w-[720px] mx-auto text-center">
                Lumekoristuse hind on tavaliselt fikseeritud hooaja kaupa
                ja sõltub pindalast, raskusastmest ja teenuse ulatusest.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {hindKaardid.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
                      i === hindKaardid.length - 1 ? "col-span-2 lg:col-span-1" : ""
                    } ${
                      item.highlight
                        ? "bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl"
                        : "bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]"
                    }`}
                  >
                    <div
                      className={`text-[15px] font-bold mb-1 ${
                        item.highlight ? "text-white" : "text-[#17345a]"
                      }`}
                    >
                      {item.size}
                    </div>
                    <div
                      className={`text-[22px] font-bold mb-1 ${
                        item.highlight ? "text-white" : "text-[#17345a]"
                      }`}
                    >
                      {item.price}
                    </div>
                    <div
                      className={`text-[15px] mb-2 ${
                        item.highlight ? "text-white/70" : "text-[#5a6474]"
                      }`}
                    >
                      {item.period}
                    </div>
                    <div
                      className={`text-[15px] ${
                        item.highlight ? "text-white/70" : "text-[#5a6474]"
                      }`}
                    >
                      {item.area}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[15px] text-[#5a6474] max-w-[720px] mx-auto text-center">
                Hooajaline leping on märgatavalt soodsam kui ühekordsed
                teenused ja tagab prioriteetse reageerimise. Hooaeg kestab
                tavaliselt oktoobrist aprillini.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        {/* Sotsiaalne tõestus */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Meie numbrid
                </div>
                <TwoToneHeading text="SPS Grupp lumekoristus numbrites" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {[
                  { number: "Alates 2006", label: "kogemust" },
                  { number: "200+", label: "teenindatud objekti" },
                  { number: "Kindlustatud", label: "teenus" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50"
                  >
                    <div className="text-[clamp(22px,3vw,32px)] font-bold text-[#17345a] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-[15px] text-[#5a6474]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS lumekoristuse käivitab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Objekti kaardistus", "Märgime parklad, teed, trepid ja prioriteedid."],
            ["Hooajaleping", "Lepime kokku valmisoleku ja reageerimise."],
            ["Ilmajälgimine", "Jälgime sadu ja libedusriski."],
            ["Tööde teostus", "Puhastame ja teeme libedusetõrje."],
            ["Korduvad kontrollid", "Vajadusel naaseme suurte sadude ajal."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Sõlmige lumekoristuse leping enne talve"
            description="Ärge jätke lumekoristust viimasele hetkele. Küsige pakkumist täna ja tagage endale rahumeelne talv."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={lumekoristusFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
