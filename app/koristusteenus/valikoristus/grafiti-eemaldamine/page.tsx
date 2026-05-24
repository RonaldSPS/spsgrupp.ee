"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import Hinnakalkulaator from "../../../components/Hinnakalkulaator";

const floatingChips = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
    chipClass: "chip-icon-blue",
    value: "Kõik",
    label: "pinnatüübid",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    chipClass: "chip-icon-green",
    value: "Kaitse",
    label: "kihid",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    chipClass: "chip-icon-navy",
    value: "24h",
    label: "reageerimine",
  },
];

const teenuseSisuKaardid: { bold: string; desc: string }[] = [
  {
    bold: "Kiire hindamine ja meetodi valik pinna järgi",
    desc: "Hindame graffiti tüüpi, pinda ja vanust, et valida kõige efektiivsem ja pinnasäästlikum meetod.",
  },
  {
    bold: "Graffiti eemaldamine spetsiaalsete lahustega",
    desc: "Professionaalsed graffitilahustid, mis eemaldavad värvi ilma aluspinda kahjustamata.",
  },
  {
    bold: "Kõrgsurvepesu sobivatel pindadel",
    desc: "Betoon, klinker ja metallpinnad puhastatakse kuuma vee ja kõrgsurvega. Tulemus kohe nähtav.",
  },
  {
    bold: "Delikaatne käsitöö tundlikel pindadel",
    desc: "Krohv, puit ja ajaloolised pinnad nõuavad erilist hoolt. Kasutame madalsurve meetodeid ja õrnu lahuseid.",
  },
  {
    bold: "Korduva pesu vajadusel kuni täielik tulemus",
    desc: "Sügavale imbunud graffitid võivad vajada mitut pesukorda. Töötame seni, kuni tulemus rahuldab.",
  },
  {
    bold: "Anti-graffiti kaitsekihtide paigaldus",
    desc: "Valikuline teenus: paigaldame läbipaistva kaitsekihi, mis hoiab ära järgmise sodimise püsiva kahju.",
  },
  {
    bold: "Kogu töötsooni puhastus ja korrastamine",
    desc: "Peale töö lõppu puhastame ja korrastame kogu tööpiirkonna.",
  },
  {
    bold: "Abistamine politsei kaebuse koostamisel",
    desc: "Soovi korral teeme enne tööd fotod ja aitame koostada politseile esitatava kaebuse.",
  },
];

const miksMeieKaardid = [
  {
    title: "Kiire reageerimine 24h jooksul",
    desc: "Helistage hommikul, oleme kohal pärastlõunal. Mida kiiremini alustame, seda parem on tulemus. Värsked graffitid on oluliselt lihtsamini eemaldatavad.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Sobiv meetod igale pinnale",
    desc: "Krohv, klinker, betoon, klaas, metall, puit: iga pind vajab erinevat lahendust. Kasutame alati kõige õrnemat efektiivset meetodit.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Graffiti kaitsekate",
    desc: "Paigaldame läbipaistva kaitsekihi, mille järel järgmine graffiti on eemaldatav lihtsa veesurvega. Kate kestab 3–5 aastat.",
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
    size: "Väike graffiti",
    area: "kuni 1m²",
    price: "150€",
    period: "alates",
    highlight: true,
  },
  {
    size: "Keskmine graffiti",
    area: "1–5m²",
    price: "250€",
    period: "alates",
  },
  {
    size: "Suur graffiti",
    area: "5–15m²",
    price: "450€",
    period: "alates",
  },
  {
    size: "Väga suur pind",
    area: "15m²+",
    price: "Individuaalne",
    period: "pakkumine",
  },
];

const grafitiFAQ = [
  {
    q: "Kui kiiresti saate graffiti eemaldada?",
    a: "Enamikul juhtudel 24 tunni jooksul peale tellimust. Kiireloomuliste juhtumite puhul saame tulla ka samal päeval. Töö ise võtab 30 minutit kuni 2 tundi.",
  },
  {
    q: "Kas kõik graffitid on eemaldatavad?",
    a: "Enamik jah. Värsked graffitid on eemaldatavad peaaegu täielikult. Vanad ja päikese käes pleekinud võivad jätta ghost-efekti, sellisel juhul soovitame fassaadi uuesti viimistlemist vastava ala ulatuses.",
  },
  {
    q: "Mis on graffiti kaitsekate?",
    a: "Läbipaistev kaitsekiht, mis paigaldatakse pinnale. Järgmine graffiti ei imendu pinda ja on eemaldatav lihtsa veesurvega. Kate kestab tavaliselt 3–5 aastat.",
  },
  {
    q: "Kas graffiti eemaldamine kahjustab fassaadi?",
    a: "Mitte kui seda teeb professionaalne meeskond. Valime alati pinnasäästlikud meetodid. Vale meetod võib aga pinda kahjustada.",
  },
  {
    q: "Kas aitate koostada politsei kaebust?",
    a: "Jah, kui soovite. Teeme enne tööd fotod, mida saate kaebusele lisada. Graffiti on Eestis karistatav kuritegu.",
  },
];

const beforeAfterImages = [
  {
    before: "/prygikast2.jpg",
    after: "/prygikast1.jpg",
    alt: "Prügikasti graffiti eemaldamine",
  },
  {
    before: "/prygikast222.jpg",
    after: "/prygikast23.jpg",
    alt: "Prügikasti graffiti eemaldamine enne ja pärast",
  },
  {
    before: "/trepp2.jpg",
    after: "/Trepp1.jpg",
    alt: "Trepi graffiti eemaldamine enne ja pärast",
  },
];

export default function GrafitiEemaldamine() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Graffiti eemaldamine"
          style={{
            background: "url('/grafiti-eemaldamine-1.jpg') center/cover no-repeat",
          }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
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
                Graffiti eemaldamine
                <br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Kiire reageerimine, kõik pinnatüübid, kaitsekihtide paigaldus.
                Mida kiiremini tegutseda, seda lihtsam on eemaldada.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <Link
                  href="#pakkumine"
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Helistage kohe
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
                </Link>
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

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-white/80 font-light mb-[24px]">
                <span>Kõik pinnatüübid</span>
                <span className="text-white/40">|</span>
                <span>Kaitsekihid</span>
                <span className="text-white/40">|</span>
                <span>24h reageerimine</span>
              </div>

              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-white/80 text-[15px]"
              >
                <a
                  href="/"
                  className="text-white/80 no-underline hover:text-white transition-colors"
                >
                  Avaleht
                </a>
                <span className="text-white/50">/</span>
                <a
                  href="/#teenused"
                  className="text-white/80 no-underline hover:text-white transition-colors"
                >
                  Koristusteenused
                </a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Graffiti eemaldamine</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading
                text="Graffiti ei ole ainult esteetiline probleem"
                className="mb-8"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  Tallinnas on graffiti ärihoonetel üha sagedasem probleem.
                  Esmane reaktsioon on sageli: &quot;Oodake, äkki keegi ei
                  märka.&quot; Aga tegelikult graffiti kahjustab hoone välisilmet
                  ja ettevõtte mainet, annab signaali &quot;siin on
                  lubatud&quot; ja toob juurde uusi maalinguid, võib aja jooksul
                  fassaadi kahjustada ning mõjutab kinnisvara väärtust.
                </div>
                <div>
                  Mida kiiremini tegutseda, seda lihtsam ja odavam on graffiti
                  eemaldada. Värsked graffitid (esimese nädala jooksul) on
                  sagely lihtsalt eemaldatavad. Vanad ja ilmastiku käes
                  pleekinud graffitid nõuavad juba põhjalikumat tööd.
                  <br />
                  <br />
                  SPS Grupp reageerib 24 tunni jooksul ja enamikul juhtudel saab
                  graffiti eemaldatud 30 minuti kuni 2 tunniga.
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
                <TwoToneHeading text="Mida sisaldab graffiti eemaldamise teenus?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teenuseSisuKaardid.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer"
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

        {/* Tööde näited — Enne ja pärast */}
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Tööde näited
                </div>
                <TwoToneHeading text="Graffiti eemaldamine enne ja pärast" />
                <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                  Iga pind ja iga graffiti on erinev. Valime alati sobivaima
                  meetodi, et tagada parim tulemus ilma pinda kahjustamata.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {beforeAfterImages.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#f8fafc] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]"
                  >
                    <div className="grid grid-cols-2 gap-0">
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-[#dc2626] text-white text-[15px] font-bold px-2.5 py-0.5 rounded-full z-10">
                          Enne
                        </div>
                        <Image
                          src={item.before}
                          alt={`${item.alt} — enne`}
                          width={300}
                          height={350}
                          className="w-full h-[250px] object-cover"
                          style={{ color: "#2d3748" }}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-[#16a34a] text-white text-[15px] font-bold px-2.5 py-0.5 rounded-full z-10">
                          Pärast
                        </div>
                        <Image
                          src={item.after}
                          alt={`${item.alt} — pärast`}
                          width={300}
                          height={350}
                          className="w-full h-[250px] object-cover"
                          style={{ color: "#2d3748" }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[15px] text-[#17345a] font-medium text-center">
                        {item.alt}
                      </p>
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
                <TwoToneHeading text="Miks valida SPS Grupp graffiti eemaldamiseks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {miksMeieKaardid.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer"
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
                    src="/grafiti-eemaldamine-2.jpg"
                    alt="SPS Grupp graffiti eemaldamine"
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
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text="Mis maksab graffiti eemaldamine?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Hind sõltub graffiti suurusest, vanusest, pinnatüübist ja
                    ligipääsu keerukusest.
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

                  <p className="text-[15px] text-[#5a6474] mb-4">
                    Anti-graffiti kaitsekate: <strong>alates 8€/m²</strong>.
                  </p>
                  <p className="text-[15px] text-[#5a6474] mb-6">
                    Värsked graffitid on alati kiiremini ja odavamini
                    eemaldatavad. Helistage kohe, kui märkate!
                  </p>

                  <div>
                    <Link
                      href="tel:6623328"
                      className="btn-outline text-[#17345a] border-[#17345a] hover:bg-[#17345a] hover:text-white text-[15px] py-2.5 px-4"
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
                <TwoToneHeading text="SPS Grupp graffiti eemaldamise numbrites" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {[
                  { number: "24h", label: "reageerimisaeg" },
                  { number: "100%", label: "tulemuse garantii" },
                  { number: "150+", label: "eemaldatud graffitit" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9] cursor-pointer"
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

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Ärge oodake, helistage kohe"
            description="Mida värskem graffiti, seda parem tulemus. Helistage täna ja vabanege probleemist."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={grafitiFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
