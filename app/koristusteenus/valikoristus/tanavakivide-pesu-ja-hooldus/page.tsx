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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
    chipClass: "chip-icon-blue",
    value: "Kõrgsurve",
    label: "pesurid",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    chipClass: "chip-icon-green",
    value: "Öko",
    label: "vahendid",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    chipClass: "chip-icon-navy",
    value: "Alates 2006",
    label: "aastat kogemust",
  },
];

const teenuseSisuKaardid: { bold: string; desc: string }[] = [
  {
    bold: "Umbrohu ja sambla eemaldamine",
    desc: "Eemaldame umbrohu koos juurtega, mitte ainult pinnapealselt. Nii väldime kiiret tagasikasvamist.",
  },
  {
    bold: "Kõrgsurvepesu spetsiaalse tehnikaga",
    desc: "Pöörlevad otsikud ja veevoolu kontrollsüsteemid tagavad tõhusa pesu kive kahjustamata.",
  },
  {
    bold: "Õli- ja rasvaplekkide eemaldamine",
    desc: "Spetsiaalsed lahused õli, rasva ja muude keemiliste plekkide eemaldamiseks tänavakividelt.",
  },
  {
    bold: "Vuukide põhjalik puhastus",
    desc: "Eemaldame vuukidesse kogunenud tolmu, muda ja orgaanilise materjali.",
  },
  {
    bold: "Vuukide liivaga taastäitmine",
    desc: "Peale pesu täidame vuugid uue kivipuru või liivaga, mis stabiliseerib kivide asetust.",
  },
  {
    bold: "Kaitsekihtide paigaldus (valikuline)",
    desc: "Hüdrofoobsed katted kaitsevad kive mustuse, õli ja niiskuse eest, pikendades pesu tulemust.",
  },
  {
    bold: "Suuremate kahjustuste lokaalne parandus",
    desc: "Vajunud või katkised kivid? Teeme lokaalse paranduse ilma kogu platsi ümber laotamata.",
  },
  {
    bold: "Regulaarne hoolduslepingul põhinev teenindus",
    desc: "Korraline hooldus 1–2 korda aastas. Soodushind püsikliendile.",
  },
];

const miksMeieKaardid = [
  {
    title: "Professionaalne tehnika",
    desc: "Kõrgsurvepesurid, pöörlevad otsikud, veevoolu kontrollsüsteemid. Investeerime tööriistadesse, mis annavad maksimaalse tulemuse kive kahjustamata.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Umbrohu eemaldamine",
    desc: "Eemaldame umbrohu koos juurtega, mis pikendab puhastustulemust. Pinnapealne eemaldus ilma juurteta annab ajutise tulemuse.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Vuukide täitmine",
    desc: "Peale pesu täidame vuugid uue kivipuru või liivaga. See stabiliseerib kivide asetust ja vähendab umbrohu tagasituleku riski.",
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
    title: "Keskkonnasõbralikud lahendused",
    desc: "Kasutame biolagunevaid puhastusvahendeid, mis ei kahjusta ümbritsevat keskkonda ega haljastust.",
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
    size: "Tänavakivide pesu",
    area: "Kõrgsurvepesu",
    price: "2.5€/m²",
    period: "alates",
    highlight: true,
  },
  {
    size: "Umbrohu eemaldamine",
    area: "Lisa",
    price: "1€/m²",
    period: "alates",
  },
  {
    size: "Vuukide täitmine",
    area: "Liivaga",
    price: "1.5€/m²",
    period: "alates",
  },
  {
    size: "Kaitsekihi paigaldus",
    area: "Kaitse mustuse eest",
    price: "3€/m²",
    period: "alates",
  },
];

const tanavakivideFAQ = [
  {
    q: "Kui sageli peaks tänavakive pesema?",
    a: "Keskmiselt 1–2 korda aastas, sõltuvalt liikluskoormusest. Parklas ja sissepääsu alas sagedamini, terrassil ja tagahoovis harvemini.",
  },
  {
    q: "Kas kõrgsurvepesu kahjustab kive?",
    a: "Õiges käes kasutatuna ei. Vale surve või vale nurk võib aga kivide pinda kahjustada või vuukide liiva välja lennutada. Meie spetsialistid teavad täpselt, millist survet ja otsikut iga pinnatüübi puhul kasutada.",
  },
  {
    q: "Kas peate vuuke pärast pesu taastäitma?",
    a: "Enamasti jah. Kõrgsurvepesu eemaldab paratamatult osa vuukide liivast. Taastäitmine stabiliseerib kive ja vähendab umbrohu tagasituleku riski.",
  },
  {
    q: "Kas saate eemaldada õli- ja rasvaplekke?",
    a: "Jah, kasutame spetsiaalseid lahuseid. Värsked plekid on palju lihtsamad — kui märkate õlilaigu, helistage kohe.",
  },
  {
    q: "Millal on parim aeg tänavakivide pesuks?",
    a: "Kevadel (mai) pärast talve või sügisel (september–oktoober) enne talve. Temperatuur peaks olema vähemalt +5°C.",
  },
];

export default function TanavakividePesu() {
  return (
    <>
      <SeoJsonLd
        etPath="/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus"
        locale="et"
        serviceName="Tänavakivide pesu ja hooldus Tallinnas"
        serviceDescription="Tänavakivide professionaalne pesu ja hooldus Tallinnas. Kõrgsurvepesu, umbrohutõrje, tihendamine."
        breadcrumbs={[
          { name: "Avaleht", etPath: "/" },
          { name: "Koristusteenus", etPath: "/koristusteenus" },
          { name: "Välikoristus", etPath: "/koristusteenus/valikoristus" },
          { name: "Tänavakivide pesu ja hooldus", etPath: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus" },
        ]}
        faq={tanavakivideFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Tänavakivide pesu ja hooldus"
        >
          <HeroBackgroundImage src="/tanavakividepesu-1.jpg" preload alt="" />
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
                Tänavakivide pesu ja hooldus
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Tagastame teie parkimisala, kõnnitee või terrassi esialgse
                välimuse. Umbrohu eemaldamine, põhjalik pesu, vuukide liivaga
                täitmine. Kestev tulemus.
              </p>
              <div className="flex gap-[10px] mb-[18px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi tänavakivide pesu pakkumist
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
                <span className="text-white/90">Tänavakivide pesu ja hooldus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading
                text="Tänavakivid muutuvad aastatega vaikselt mustaks"
                className="mb-8"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  Tänavakivid ja sillutuskivid on püsivad, aga määrduvad aja
                  jooksul. Aastatega kogunevad vuukidesse tolm, muld, õli,
                  rasv ja kasvab umbrohi. Värv muutub tuhmiks, pind libedaks,
                  umbrohu juured lõhuvad vuuke.
                </div>
                <div>
                  Ärikinnistutel on tänavakivid nähtavad kõigile, parklas,
                  sissepääsul, terrassil. Määrdunud tänavakivid annavad
                  samasuguse mulje kui hooldamata hoone fassaad.
                  <br />
                  <br />
                  Professionaalne pesu tagastab tänavakividele algse välimuse
                  ja pikendab nende eluiga. Õigeaegselt tehtud hooldus on
                  palju odavam kui kivide väljavahetamine.
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
                <TwoToneHeading text="Mida sisaldab tänavakivide hooldusteenus?" />
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
                <TwoToneHeading text="Miks valida SPS Grupp tänavakivide hoolduseks?" />
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
                    src="/tanavakividepesu-2.jpg"
                    alt="Tänavakivide pesu SPS Grupp"
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
                <TwoToneHeading text="Kuidas kujuneb tänavakivide pesu hind?" />
              </div>

              <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light max-w-[720px] mx-auto text-center">
                Hind sõltub pindalast, mustuse astmest ja vajalikest
                lisateenustest.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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

              <p className="text-[15px] text-[#5a6474] max-w-[720px] mx-auto text-center">
                Soovituslik hooldussagedus on 1–2 korda aastas, sõltuvalt
                liikluskoormusest. Komplektpakett (pesu + umbrohi + vuugid)
                soodushinnaga.
              </p>

              <div className="mt-6 text-center">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4 inline-flex items-center gap-2"
                >
                  Küsi tänavakivide pesu pakkumist
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
                <TwoToneHeading text="SPS Grupp tänavakivide hoolduse numbrites" />
                <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                  Oleme aidanud kümnetel äriklientidel taastada parklate ja
                  kõnniteede esialgse ilme.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {[
                  { number: "Alates 2006", label: "kogemust" },
                  { number: "5000+", label: "m² pestud pinda" },
                  { number: "Kindlustatud", label: "teenus" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50"
                  >
                    <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">
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
          title="Kuidas SPS tänavakivide pesu teeb?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Pinna hindamine", "Vaatame üle kivide tüübi, vuugid, umbrohu ja määrdumise."],
            ["Meetodi valik", "Valime surve, harjad ja puhastusvahendid."],
            ["Pesu ja umbrohutõrje", "Puhastame pinnad ja töötleme vuugid."],
            ["Vuukide täitmine", "Vajadusel täidame vuugid uuesti."],
            ["Kaitse soovitus", "Soovitame kaitsekihti pikema tulemuse jaoks."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Uuendage oma ärikinnistu välimust"
            description="Tuleme kohale, hindame ja teeme pakkumise."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={tanavakivideFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
