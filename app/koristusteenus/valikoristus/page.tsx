"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FAQ from "../../components/FAQ";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import Hinnakalkulaator from "../../components/Hinnakalkulaator";
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const floatingChips = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    chipClass: "chip-icon-blue",
    value: "24/7",
    label: "talvine valmisolek",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    chipClass: "chip-icon-green",
    value: "Kindlustatud",
    label: "tegevus",
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
    label: "objekti igakuiselt",
  },
];

const teenuseSisuKaardid = [
  { bold: "Fassaadipesu", desc: "Kõik pinnatüübid — krohv, klinker, klaas, metall. Ohutu ja efektiivne puhastus kõrg- ja madalhoonetele." },
  { bold: "Akende ja klaasfassaadide pesu", desc: "Professionaalne aknapesu kuni 20+ korrustel hoonetel, kasutades spetsiaalset kõrgtööde varustust." },
  { bold: "Graffiti eemaldamine", desc: "Kiire eemaldus ja kaitsekihtide paigaldus, mis hoiab ära uue sodimise. Reageerime 24h jooksul." },
  { bold: "Tänavakivide pesu ja hooldus", desc: "Survepesu, vuukide puhastus ja kaitseimmutus, mis pikendab tänavakivide eluiga aastaid." },
  { bold: "24/7 lumekoristus ja libedusetõrje", desc: "Automaatne teenus talveperioodil. Ilmaprognoosi jälgimine, traktorid ja minilaadurid kohe valmis." },
  { bold: "Parklate ja kõnniteede hooldus", desc: "Regulaarne pühkimine, prahi koristus ja hooajaline erihooldus (lehed, lumi, jää)." },
  { bold: "Sissepääsude erihooldus", desc: "Esinduspindade igapäevane korrashoid — puhtad klaasuksed, korras mattid, puhas esine." },
  { bold: "Prügikastide pesu ja hooldus", desc: "Regulaarne pesu ja desinfitseerimine. Väldime lõhnu ja kahjurite levikut teie territooriumil." },
  { bold: "Territooriumi üldhooldus", desc: "Kõik ülejäänud välitööd ühest kohast — haljastus, lehekoristus, väikeparandused." },
];

const miksMeieKaardid = [
  {
    title: "24/7 talvine valmisolek",
    desc: "Lumekoristus ja libedusetõrje algab automaatselt. Te ei pea meid eraldi kutsuma. Leping katab kogu hooaja.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Kõrghoonete kogemus",
    desc: "Kõrgtöödeks sertifitseeritud personal ja varustus. Teeme fassaadipesu ja aknapesu kuni 20+ korrustel hoonetel.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Ökoloogilised meetodid",
    desc: "Kasutame biolagunevaid puhastusvahendeid ja veekäsitlussüsteeme. ISO 14001 sertifikaat.",
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
    title: "Üks partner, kõik teenused",
    desc: "Fassaadid, aknad, lumekoristus, kõik ühe lepingu alt. Üks kontaktisik, üks arve, ennustatavad kulud.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const hindKaardid = [
  { size: "Fassaadipesu", area: "Kõik pinnatüübid", price: "3€/m²", period: "alates", highlight: true },
  { size: "Akende pesu", area: "Kõrghooned, äripinnad", price: "2€/m²", period: "alates" },
  { size: "Tänavakivide pesu", area: "Survepesu + immutus", price: "2.5€/m²", period: "alates" },
  { size: "Graffiti eemaldus", area: "Kiire reageerimine", price: "150€", period: "alates" },
];

const valikoristusFAQ = [
  {
    q: "Kui sageli peaks fassaadi pesema?",
    a: "Tallinna tingimustes soovitame fassaadipesu vähemalt kord aastas, tiheda liiklusega piirkondades sagedamini. Klaas- ja heledatel fassaadidel on mustus kiiremini nähtav.",
  },
  {
    q: "Kas lumekoristuse leping algab automaatselt?",
    a: "Jah, hooajalise lepingu puhul tuleme automaatselt, kui sajab lund või on libeduseoht. Te ei pea meid kutsuma. Leping katab tavaliselt oktoobrist aprillini.",
  },
  {
    q: "Kui kiiresti saate graffiti eemaldada?",
    a: "Graffiti eemaldame tavaliselt 30 minutit kuni 2 tundi sõltuvalt suurusest ja pinnast. Kiireloomuliste juhtumite puhul reageerime 24h jooksul.",
  },
  {
    q: "Kas teete välitöid ka talvel?",
    a: "Jah. Lumekoristus ja libedusetõrje on talvel meie põhitegevus. Teatud välitöid (fassaadipesu, akende pesu) tehakse eelistatult soojema ilmaga.",
  },
  {
    q: "Millised on hoolduslepingu eelised ühekordse teenuse ees?",
    a: "Soodsam hind, fikseeritud eelarve, prioriteetne reageerimine ja ennustatav kvaliteet. Pikaajalistele klientidele pakume ka lisasoodustusi.",
  },
];

export default function Valikoristus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Välikoristus Tallinnas"
        serviceDescription="Välikoristus ja territooriumi hooldus Tallinnas: fassaadipesu, aknad, graffiti, 24/7 lumekoristus."
        serviceUrl="https://spsgrupp.ee/koristusteenus/valikoristus"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Välikoristus", item: "https://spsgrupp.ee/koristusteenus/valikoristus" },
        ]}
        faq={valikoristusFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Välikoristus"
          style={{ background: "url('/Valikoristus-1.jpg') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className="floating-chip animate-float"
                style={{ background: "rgba(255,255,255,0.95)" }}
              >
                <div className={`chip-icon ${chip.chipClass} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  {chip.icon}
                </div>
                <div>
                  <div className="text-[18px] font-bold text-[#17345a] leading-tight">{chip.value}</div>
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
                Välikoristus ja territooriumi hooldus<br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Fassaadipesu, aknapesu, graffiti eemaldamine, tänavakivide hooldus ja 24/7 lumekoristus. Teie hoone välimus loob esimese mulje. Tagame, et see oleks alati laitmatu.
              </p>
              <div className="flex gap-[10px] mb-[18px] animate-fade-up">
                <a
                  onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer"
                >
                  Küsi välikoristuse pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link
                  href="tel:6623328"
                  className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  662 3328
                </Link>
              </div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px]">
                <a href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</a>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Välikoristus</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Teie hoone välisilme jätab esmamulje" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                Enne kui klient või külaline teie ukse avab, on ta teie ettevõtte kohta juba otsuse teinud. Räpane fassaad, määrdunud aknad, graffiti seintel, rohtunud sissepääs või lumega kaetud parkla on signaalid, mida inimesed tõlgendavad alateadlikult kui hooletust.
              </div>
              <div>
                Eriti kriitiline on talv. Lund täis parkla on otsene õnnetuseoht ja võib kaasa tuua tõsiseid tagajärgi. Libedad kõnniteed, ligipääsmatud sissepääsud, lume alla mattunud autod. Iga hommik võib tähendada probleeme.<br /><br />
                SPS Grupp pakub välikoristuse täislahendust ärikinnistutele: regulaarne hooldus, hooajalised eritööd ja 24/7 valmisolek talveperioodil. Üks partner, kõik välitööd ühest kohast.
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
            style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Teenuse sisu
                </div>
                <TwoToneHeading text="Millised välikoristuse teenused on saadaval?" />
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
                      <strong className="text-[#17345a] block mb-1">{item.bold}</strong>
                      {item.desc ? <span className="text-[#5a6474]">{item.desc}</span> : null}
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Miks meie
              </div>
              <TwoToneHeading text="Miks valida SPS Grupp välikoristuse partneriks?" />
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">{item.title}</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/valikoristus-2.jpg"
                  alt="SPS Grupp välikoristus — Miks valida meid"
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Hind
              </div>
              <TwoToneHeading text="Välikoristuse hinnakujundus" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Iga ärikinnistu on erinev, seega hinnastame vastavalt konkreetse objekti vajadustele.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {hindKaardid.map((item, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
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
                        className={`text-[26px] font-bold mb-1 ${
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

                <p className="text-[15px] text-[#5a6474]">
                  Lumekoristuse leping: <strong>hooaja kaupa, fikseeritud hinnaga</strong>.<br /><br />
                  Kombineeritud hoolduslepingud (mitu teenust koos) toovad olulist kokkuhoidu.
                </p>

                <div className="mt-6">
                  <a
                    onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer"
                  >
                    Küsi välikoristuse personaalset pakkumist
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>

              <Hinnakalkulaator />
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Sotsiaalne tõestus */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <div className="section-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Klientide tagasiside
              </div>
              <TwoToneHeading text="Tallinna ärikinnistute välihooldus" />
              <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                Hooldame regulaarselt üle 200 ärikinnistu territooriumi Tallinnas ja Harjumaal — alates kesklinnast kuni tööstusparkideni.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
              {[
                { number: "200+", label: "objekti igakuiselt" },
                { number: "24/7", label: "valmisolek talvel" },
                { number: "15+", label: "aastat kogemust" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50">
                  <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                  <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS välikoristuse hooldusplaani koostab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Objekti ülevaatus", "Vaatame üle sissepääsud, parklad, fassaadid, kõnniteed ja hooajalised riskid."],
            ["Tööde jaotus", "Eristame regulaarsed, hooajalised ja vajaduspõhised tööd."],
            ["Graafiku kokkulepe", "Määrame sageduse ja reageerimise tingimused."],
            ["Teenuse käivitamine", "Meeskond alustab tööplaani järgi."],
            ["Järelkontroll", "Objektijuht jälgib tööde täitmist ja vajadusel korrigeerib graafikut."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title="Tellige välikoristuse tasuta audit"
          description="Tuleme kohale, vaatame üle teie ärikinnistu ja koostame personaalse hoolduskava. 24h vastus, tasuta ja kohustuseta."
        />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
        <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
        <FAQ items={valikoristusFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
