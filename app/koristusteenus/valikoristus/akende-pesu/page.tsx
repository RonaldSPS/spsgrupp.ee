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
    value: "Sertifitseeritud",
    label: "kõrgtööd",
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
    value: "20+",
    label: "aastat",
  },
];

const teenuseSisuKaardid: { bold: string; desc: string }[] = [
  {
    bold: "Kontori- ja bürooaknade regulaarne pesu",
    desc: "Pesu seest ja väljast professionaalsete vahenditega.",
  },
  {
    bold: "Kõrghoonete aknapesu",
    desc: "Tõstukite ja ronimisvarustusega, sertifitseeritud tehnikud.",
  },
  {
    bold: "Klaasfassaadide ja klaasseinte puhastus",
    desc: "Professionaalne puhastus triipude vabalt, igat tüüpi klaaspinnad.",
  },
  {
    bold: "Kaubanduskeskuste vitriinid ja sissepääsud",
    desc: "Regulaarne vitriinide ja sissepääsude hooldus esindusliku ilme tagamiseks.",
  },
  {
    bold: "Aknaraamide, tihendite ja aknalaudade puhastus",
    desc: "Täispuhastus koos raamide, tihendite ja aknalaudadega.",
  },
  {
    bold: "Hooajalised eripesud",
    desc: "Õietolm kevadel, soolajäägid talvel – vastavalt hooajalisele vajadusele.",
  },
  {
    bold: "Ehitusjärgne akende puhastus",
    desc: "Tolm, mört, kleebised – eemaldame kõik ehitusjäägid.",
  },
  {
    bold: "Regulaarne hooldusleping",
    desc: "Kord kvartalis või sagedamini – fikseeritud hind, alati selged aknad.",
  },
];

const miksMeieKaardid = [
  {
    title: "Kõrghoonete spetsialistid",
    desc: "Kasutame Euroopa ohutusstandarditele vastavat varustust. Kõik tehnikud on läbinud kõrgtööde ohutuskoolituse.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Professionaalsed vahendid ja tehnika",
    desc: "Survepesuseadmed, teleskoopvarred, puhastusvee süsteemid. Investeerime parimatesse tööriistadesse, et tagada parim triipude vaba tulemus.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Hoolduslepingu lahendused",
    desc: "Regulaarne aknapesu (kord kvartalis või sagedamini) hoiab klaasipinnad alati selged. Fikseeritud hind, sama meeskond, ennustatav tulemus.",
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
    title: "Kindlustatud teenus",
    desc: "Kõrgtöödel juhtub harva midagi, aga kogu meie tegevus on kindlustatud ja Teie vara ja ehitis on kaitstud.",
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
    size: "Kontori aknapesu",
    area: "Madala kõrgusega",
    price: "2€/m²",
    period: "alates",
    highlight: true,
  },
  {
    size: "Klaasfassaadid",
    area: "Teleskoopvarrega",
    price: "3€/m²",
    period: "alates",
  },
  {
    size: "Kõrghooned",
    area: "Ronimisvarustusega",
    price: "5€/m²",
    period: "alates",
  },
];

const akendePesuFAQ = [
  {
    q: "Kui sageli peaksid Tallinna ärihoonete aknad saama professionaalset pesu?",
    a: "Kesklinnas ja tiheda liiklusega piirkondades soovitame pesu kord kvartalis. Ülemiste City äripiirkonnas iga 3–4 kuu tagant. Klaashoonetele on optimaalne 4 korda aastas. Kevadel soovitame lisa pesukorda õietolmu eemaldamiseks.",
  },
  {
    q: "Kuidas saab aknapesu toimuda ilma tööd katkestamata?",
    a: "Kohandume teie tööajaga. Teeme tööd kas enne kontorite avamist, peale sulgemist või nädalavahetustel. Kõrghoonete puhul töötame väljastpoolt, mis ei sega sisemist tööd üldse.",
  },
  {
    q: "Kas teete ka kõrghoonete aknapesu?",
    a: "Jah, see on üks meie põhispetsialiseerumistest. Kasutame tõstukeid, ronimisvarustust ja teleskoopvarrega süsteeme. Kõik tehnikud on sertifitseeritud kõrgtöödeks.",
  },
  {
    q: "Mis juhtub, kui aknapesu järel tekivad triibud?",
    a: "Anname tulemustele garantii. Kui triipud või puudused tekivad meie töö tagajärjel, tuleme tagasi ja parandame tasuta.",
  },
  {
    q: "Millal on parim aeg klaashoone aknapesu tellida?",
    a: "Kevad (aprill–mai) pärast õietolmu perioodi ja sügis (oktoober–november) enne talve on kõige sobivamad. Lisaks regulaarne kvartaalne hooldus.",
  },
];

export default function AkendePesu() {
  return (
    <>
      <SeoJsonLd
        serviceName="Akende pesu Tallinnas"
        serviceDescription="Akende pesu ärihoonetel Tallinnas. Kõrghoonete aknapesu, klaasfassaadid, regulaarne hooldus."
        serviceUrl="https://spsgrupp.ee/koristusteenus/valikoristus/akende-pesu"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Välikoristus", item: "https://spsgrupp.ee/koristusteenus/valikoristus" },
          { position: 4, name: "Akende pesu", item: "https://spsgrupp.ee/koristusteenus/valikoristus/akende-pesu" },
        ]}
        faq={akendePesuFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Akende pesu"
          style={{
            background: "url('/akende-pesu-1.jpg') center/cover no-repeat",
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
                Akende pesu Tallinnas ja Harjumaal
                <br />
                <span className="text-[#3abeff]">ärihoonetele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Professionaalne aknapesu kõrghoonetele, kontoritele ja
                kaubandushoonetele. Kõrgtööde sertifikaadid, spetsiaalne
                tehnika, kristallselge tulemus.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi akende pesu pakkumist
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
                <a href="/koristusteenus" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus/valikoristus" className="text-white/80 no-underline hover:text-white transition-colors">Välikoristus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Akende pesu</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading
                text="Kas teie kontori valgus on viimasel ajal tuhmunud?"
                className="mb-8"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  Aknad määrduvad nii aeglaselt, et seda ei märka. Tolm,
                  saaste, õietolm kevadel, talvised soolajäägid kogunevad
                  tasapisi. Alles siis, kui aknad puhtaks pestakse, märkate
                  muutust kontrastselt.
                </div>
                <div>
                  SPS Grupp toob selle muutuse teie hoonesse. Juba üle
                  15 aasta toome selge vaate Tallinna ärihoonetele. Oleme spetsialiseerunud suurte klaaspindade
                  puhastusele, sealhulgas Ülemiste City äripiirkonnas.
                  <br />
                  <br />
                  Meie meeskond tegeleb kõige sellega, mida aeg tasapisi
                  akendele jätab. Tolm, saaste, kevadine õietolm ja talvised
                  soolajäägid kaovad ning teie hoone särab taas parimal viisil.
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
                <TwoToneHeading text="Millist akende pesu SPS Grupp pakub?" />
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
                <TwoToneHeading text="Miks valida SPS Grupp akende pesu partneriks?" />
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
                    src="/akende-pesu-2.jpg"
                    alt="Akende pesu SPS Grupp"
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
                <TwoToneHeading text="Kuidas kujuneb akende pesu hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Akende pesu hind sõltub pinna suurusest, aknatüübist,
                    juurdepääsu keerukusest ja töö sagedusest.
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
                    Regulaarse hoolduse puhul on optimaalne soovitus
                    klaashoonetele 4 korda aastas. Ülemiste City tüüpi
                    äripiirkondades sageli kord kvartalis. Regulaarse
                    hoolduslepingu korral kehtib soodushind.
                  </p>
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
                <TwoToneHeading text="SPS Grupp akende pesu numbrites" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {[
                  { number: "15+", label: "aastat kogemust" },
                  { number: "Triibuvaba", label: "tulemus" },
                  { number: "200+", label: "teenindatud hoonet" },
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
          title="Kuidas SPS aknapesu korraldab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Pindade ülevaatus", "Hindame klaaspindade mahu ja ligipääsu."],
            ["Meetodi valik", "Valime tõstuki, teleskoopvarre või muu lahenduse."],
            ["Tööaja kokkulepe", "Planeerime töö nii, et see ei segaks kliente ega töötajaid."],
            ["Pesu ja kontroll", "Teeme töö ning kontrollime triipudevaba tulemust."],
            ["Hooldusgraafik", "Soovi korral lepime kokku korduva pesurütmi."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Toome valguse tagasi teie kontorisse"
            description="Saadame eksperdi teie hoonesse hindama ja koostame personaalse pesuplaani."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={akendePesuFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
