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
    value: "Kõrgtööde",
    label: "kogemus",
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
    bold: "Krohvfassaadide pesu keskmise surve ja öko-vahenditega",
    desc: "Õrn, kuid tõhus pesu, mis ei kahjusta krohvi struktuuri.",
  },
  {
    bold: "Klinkertellise fassaadi pesu ja hooldus",
    desc: "Spetsiaalsed vahendid tellise pooridesse kogunenud mustuse eemaldamiseks.",
  },
  {
    bold: "Klaasfassaadide professionaalne puhastus",
    desc: "Triipude vaba tulemus ka suurimatel klaaspindadel.",
  },
  {
    bold: "Metallfassaadide ja komposiitkatete pesu",
    desc: "Õige surve ja vahendid, et vältida metallpinna oksüdeerumist.",
  },
  {
    bold: "Puidust fassaadide hoolduspesu",
    desc: "Õrn pesu, mis säilitab puidu loomuliku ilme ja kaitseomadused.",
  },
  {
    bold: "Soolakihi ja taimede eemaldamine",
    desc: "Talvised soolajäägid, samblikud ja vetikad – eemaldame kõik.",
  },
  {
    bold: "Õietolmu ja saastumise likvideerimine",
    desc: "Kevadine õietolm ja linnasaaste – fassaad taas puhas.",
  },
  {
    bold: "Kaitsekihtide paigaldus peale pesu",
    desc: "Hüdrofoob, anti-graffiti – pikendab pesu tulemust 2–3 korda.",
  },
  {
    bold: "Kõrghoonete fassaadipesu tõstukite ja ronimisvarustusega",
    desc: "Ohutu ja professionaalne ligipääs kuni 20+ korrustele hoonetele.",
  },
];

const miksMeieKaardid = [
  {
    title: "Pinnapõhine lähenemine",
    desc: "Krohv vajab õrna kätt, klinker talub suuremat survet, klaas vajab spetsiaalseid vahendeid. Me ei kasuta sama meetodit kõigile.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Kõrghoonete spetsialistid",
    desc: "Tõstukid, ronimisvarustus, teleskoopvardad. Töötame ka Ülemiste City mastaabis hoonetel.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Ökoloogilised vahendid",
    desc: "Kasutame biolagunevaid puhastusvahendeid, mis ei kahjusta taimestikku ega keskkonda. ISO 14001 sertifikaat.",
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
    desc: "Kõik tööd on kindlustatud. Võimalike kahjude korral hüvitatakse kulud.",
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
    size: "Krohvfassaadi pesu",
    area: "Keskmise survega",
    price: "3€/m²",
    period: "alates",
    highlight: true,
  },
  {
    size: "Klinkertellise pesu",
    area: "Spetsiaalsed vahendid",
    price: "3,5€/m²",
    period: "alates",
  },
  {
    size: "Klaasfassaadi pesu",
    area: "Triipude vabalt",
    price: "4€/m²",
    period: "alates",
  },
  {
    size: "Metallfassaadi pesu",
    area: "Komposiitkatted",
    price: "3,5€/m²",
    period: "alates",
  },
];

const fassaadipesuFAQ = [
  {
    q: "Kui sageli peaks ärihoone fassaadi pesema?",
    a: "Soovituslik sagedus on iga 2–3 aasta tagant. Kesklinnas ja liiklusrohketes piirkondades sagedamini, iga 1–2 aasta tagant. Klaasfassaadid ja heledad pinnad vajavad puhastust sagedamini, sest mustus on kiiremini nähtav.",
  },
  {
    q: "Kas fassaadipesu kahjustab hoone viimistlust?",
    a: "Mitte kui seda teeb professionaalne meeskond, kes valib õige meetodi ja vahendid iga pinna jaoks. Kahjustusi tekitab vale surve, vale kemikaal või vale meetod. Meie hindame alati esmalt pinna seisundit.",
  },
  {
    q: "Mis ajal aastast on parim fassaadipesu tellida?",
    a: "Kevadel (aprill–mai) pärast talve ja õietolmu perioodi või sügisel (september–oktoober) enne külma. Temperatuur peaks olema vähemalt +5°C.",
  },
  {
    q: "Kas teete fassaadipesu ka kõrghoonetel?",
    a: "Jah. Omame vastavat varustust ja kogemust kõrgtöödeks. Oleme teinud fassaadipesu kuni 20+ korrustel hoonetel.",
  },
  {
    q: "Kas kaitsekihi lisamine on vajalik?",
    a: "Kaitsekiht (hüdrofoob, anti-graffiti) pikendab pesu tulemust 2–3 korda ja kaitseb pinda saaste eest. Eriti soovituslik kesklinnas ja kõrge liiklusega piirkondades.",
  },
];

export default function Fassaadipesu() {
  return (
    <>
      <SeoJsonLd
        serviceName="Fassaadipesu Tallinnas"
        serviceDescription="Fassaadide professionaalne puhastus Tallinnas. Kõik pinnatüübid — krohv, klinker, klaas, metall."
        serviceUrl="https://spsgrupp.ee/koristusteenus/valikoristus/fassaadipesu"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Välikoristus", item: "https://spsgrupp.ee/koristusteenus/valikoristus" },
          { position: 4, name: "Fassaadipesu", item: "https://spsgrupp.ee/koristusteenus/valikoristus/fassaadipesu" },
        ]}
        faq={fassaadipesuFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Fassaadipesu"
          style={{ background: "url('/fassaadipesu1.jpg') center/cover no-repeat" }}
        >
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
                Fassaadipesu
                <br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Taastame teie hoone välisilme olgu selle katteks krohv, klinker,
                klaas või metall. Õige meetod iga pinnatüübi jaoks. Ökoloogilised
                lahendused ja kõrghoonete spetsialistid.
              </p>
              <div className="flex gap-[10px] mb-[18px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi fassaadipesu pakkumist
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
                <span className="text-white/90">Fassaadipesu</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading
                text="Aastatega muutub iga fassaad vaikselt määrdunuks"
                className="mb-8"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  Tallinna kliima on fassaadidele karm. Talvised soolajäägid,
                  kevadine õietolm, suvine saaste, sügisesed lehed ja pidev
                  niiskus. Kõik see koguneb fassaadipindadele aja jooksul.
                  Muutus on nii aeglane, et hoone omanikud seda tavaliselt ei
                  märka.
                </div>
                <div>
                  Määrdunud fassaad mõjutab mitte ainult välimust, vaid ka
                  hoone kestvust. Soolad, saaste ja taimed söövitavad pinda
                  aeglaselt, kiirendades materjali kulumist. Õigeaegne pesu on
                  odavam kui hilisem renoveerimine.
                  <br />
                  <br />
                  SPS Grupp on 20+ aastat teinud professionaalset fassaadipesu
                  Tallinna ärihoonetele. Teame, milline meetod sobib erinevatele
                  pinnatüüpidele.
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
                <TwoToneHeading text="Milliseid fassaadipesu teenuseid pakume?" />
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
                <TwoToneHeading text="Miks valida SPS Grupp fassaadipesu partneriks?" />
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
                    src="/fassaadipesu1.jpg"
                    alt="Fassaadipesu SPS Grupp"
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
                <TwoToneHeading text="Kuidas kujuneb fassaadipesu hind?" />
              </div>

              <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light max-w-[720px] mx-auto text-center">
                Hind sõltub pinna suurusest, fassaaditüübist,
                määrdumisastmest ja ligipääsu keerukusest.
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
                Kõige soodsam on teha pesu keskmiselt iga 2–3 aasta tagant,
                et säilitada pinna seisund ja vältida suurimaid mustusekihte.
                Kõrghoonete pesu (ronimisvarustusega): lisatasu.
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
                <TwoToneHeading text="SPS Grupp fassaadipesu numbrites" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {[
                  { number: "20+", label: "aastat kogemust" },
                  { number: "Kõik", label: "pinnatüübid" },
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
          title="Kuidas SPS fassaadipesu ette valmistab?"
          intro="SPS alustab objekti ülevaatusest, et töömeetod, sagedus ja tehnika vastaksid tegelikule vajadusele."
          steps={[
            ["Materjali hindamine", "Selgitame välja fassaadi tüübi ja seisundi."],
            ["Mustuse hindamine", "Vaatame üle sool, samblik, saaste ja üldmäärdumine."],
            ["Meetodi valik", "Valime surve, vahendi ja ligipääsu."],
            ["Töö teostus", "Puhastame pinna kokkulepitud ulatuses."],
            ["Kaitse soovitus", "Vajadusel soovitame kaitsekihti pikema tulemuse jaoks."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Uuendage oma hoone ilmet"
            description="Tuleme kohale, hindame fassaadi seisundit ja koostame personaalse pakkumise. Tasuta ja kohustuseta."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={fassaadipesuFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
