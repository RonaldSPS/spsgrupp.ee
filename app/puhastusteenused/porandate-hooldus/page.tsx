"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import HeroBackgroundImage from "../../components/HeroBackgroundImage";
import Footer from "../../components/Footer";
import FAQ from "../../components/FAQ";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const customFAQ = [
  {
    q: "Kui sageli peaksin tellima põrandate süvapuhastuse?",
    a: "Kaubanduspindadel soovituslik 3–4 korda aastas, kontorites 1–2 korda aastas. Spetsiifilistel tööstusruumidel isegi igakuiselt. Täpne sagedus oleneb liikluskoormusest ja põrandatüübist.",
  },
  {
    q: "Millised on märgid, et põrand vajab kiiret professionaalset hooldust?",
    a: "Tuhm välimus, nähtavad kriimustused, raskesti eemaldatavad plekid, viimistluskihi kulumine, värvitooni muutused, plaatide liikumine või vuukide lagunemine.",
  },
  {
    q: "Kas saate hooldada kõiki põrandatüüpe?",
    a: "Jah! PVC, vinüül, parkett, laminaat, betoon, looduslik kivi, marmor, keraamika, epoksiid. Iga põrandatüüp nõuab erinevaid vahendeid ja tehnikat.",
  },
  {
    q: "Kas süvapuhastus kahjustab põrandat?",
    a: "Mitte kui seda teeb professionaalne meeskond. Kahjustusi tekitab vale meetod või vahend. Meie hindame esmalt pinda ja valime ohutu lahenduse.",
  },
  {
    q: "Kuidas talv mõjutab põrandaid?",
    a: "Talvised soolajäägid on põrandate suurim vaenlane. Sool toimib nagu liivapaber ja võib kahjustada ka kvaliteetseid põrandaid. Talvel soovitame sagedamat süvapuhastust ja porimatte sissepääsu juurde.",
  },
];

export default function PorandateHooldus() {
  return (
    <>
      <SeoJsonLd
        etPath="/puhastusteenused/porandate-hooldus"
        locale="et"
        serviceName="Põrandate hooldus Tallinnas"
        serviceDescription="Põrandate professionaalne hooldus ja süvapuhastus Tallinnas. Kõik põrandatüübid."
        breadcrumbs={[{ name: "Avaleht", etPath: "/" }, { name: "Puhastusteenused", etPath: "/puhastusteenused" }, { name: "Põrandate hooldus", etPath: "/puhastusteenused/porandate-hooldus" }]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Põrandate hooldus"
        >
          <HeroBackgroundImage src="/porandate-hooldus-1.webp" preload alt="" />
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kõik</div>
                <div className="text-[15px] text-[#1f2937]">põrandatüübid</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-green w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">ISO 9001</div>
                <div className="text-[15px] text-[#1f2937]">sertifitseeritud</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-navy w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kindlustatud</div>
                <div className="text-[15px] text-[#1f2937]">teenus</div>
              </div>
            </div>
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
                Põrandate hooldus ja süvapuhastus<br />
                <span className="text-[#3abeff]">äripindadele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                PVC, parkett, laminaat, betoon, kivi, keraamika: igale põrandatüübile õige meetod. Süvapuhastus, vahamine, poleerimine ja kaitsekihtide uuendamine. Alates 2.5€/m².
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi põrandate hoolduse pakkumist
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

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <a href="/puhastusteenused/" className="text-white/80 no-underline hover:text-white transition-colors">Puhastusteenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Põrandate hooldus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Põrand on teie ettevõtte nähtavaim investeering" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p><strong>Hästi hooldatud põrand räägib teie ettevõttest ilma sõnadeta. Läikiv, kriimustustevaba ja värske väljanägemisega põrand loob klientides koheselt usalduse ja jätab professionaalse mulje juba ukselt sisenedes.</strong></p>
                </div>
                <div>
                  <p>SPS Grupp hooldab kõikidest materjalidest põrandaid: parkett, laminaat, PVC, vinüül, betoon, looduslik kivi ja keraamika.</p>

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
                <TwoToneHeading text="Millised põrandate hooldusteenuseid teostame?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Põrandate põhjalik süvapuhastus", desc: "kõik materjalid" },
                  { bold: "PVC ja vinüülpõrandate masinpesu ja vahamine", desc: "" },
                  { bold: "Parketi ja laminaadi hooldus, kaitsekihtide uuendamine", desc: "" },
                  { bold: "Kivi ja keraamilise põranda poleerimine", desc: "" },
                  { bold: "Betoonpõrandate hooldus ja epoksiidkatete uuendamine", desc: "" },
                  { bold: "Kaubanduspindade põrandate täiendatud hooldus", desc: "" },
                  { bold: "Libedusevastaste katete paigaldus ja hooldus", desc: "" },
                  { bold: "Talvise soolajäägi eemaldamine ja parandus", desc: "" },
                ].map((item, i) => (
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
                <TwoToneHeading text="Miks on SPS Grupp põrandate hoolduses heal tasemel?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Materjalipõhine lähenemine</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Iga põrandatüüp vajab erinevaid vahendeid ja puhastustehnikat. Meie spetsialistid tunnevad kõiki materjale ja oskavad valida õige meetodi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Pikendab eluiga, säästab raha</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Hooldatud põrand kestab aastaid kauem. Süvapuhastus + kaitsekihid on kordades soodsam kui kulunud põranda väljavahetamine.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Eesti kliima kogemus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Teame, kuidas hoolitseda põrandate eest talvel, kui soolajäägid ja lörts võivad põrandat kiiresti kahjustada.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Hoolduskava ja regulaarsus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Koostame igale kliendile hoolduskava. Koostame konkreetse plaani, millal teostame süvapuhastust, millal vahamine, millal kontroll. Läbipaistev ja prognoositav.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/porandate-hooldus-2.jpg"
                    alt="SPS Grupp põrandate hooldus"
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
                    <path d="M15 4a7 7 0 0 0-7 7 7 7 0 0 0 7 7M7 10h8M7 14h8" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text="Kuidas kujuneb põrandate hoolduse hind?" />
              </div>

              <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light max-w-[720px] mx-auto text-center">
                Hind sõltub pindalast, põrandatüübist, mustuse astmest ja valitud teenusest (puhastus, vahatamine, poleerimine, kaitsekiht).
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { size: "Süvapuhastus", area: "põhjalik puhastus", price: "2.5€/m²", period: "alates", highlight: true },
                  { size: "Vahamine", area: "ja poleerimine", price: "3€/m²", period: "alates" },
                  { size: "Kristalliseerimine", area: "kivi, keraamika", price: "4€/m²", period: "alates" },
                  { size: "Kaitsekihi uuendamine", area: "PVC, parkett", price: "3.5€/m²", period: "alates" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
                      item.highlight
                        ? "bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl"
                        : "bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]"
                    }`}
                  >
                    <div className={`text-[15px] font-bold mb-1 ${item.highlight ? "text-white" : "text-[#17345a]"}`}>{item.size}</div>
                    <div className={`text-[26px] font-bold mb-1 ${item.highlight ? "text-white" : "text-[#17345a]"}`}>
                      {item.price}
                    </div>
                    <div className={`text-[15px] mb-2 ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>
                      {item.period}
                    </div>
                    <div className={`text-[15px] ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>
                      {item.area}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[15px] text-[#5a6474] max-w-[720px] mx-auto text-center">
                Kaubanduspindadel soovitame süvapuhastust <strong>3–4 korda aastas</strong>, kontorites tavaliselt <strong>1–2 korda aastas</strong>. Regulaarsele hoolduskavale kehtib soodushind.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS põrandate hoolduse teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Pinna kontroll", "Selgitame materjali ja kulumise."],
            ["Meetodi valik", "Määrame pesu, eemaldamise ja kaitse vajaduse."],
            ["Tööde teostus", "Teeme masinpesu ja hoolduse etappide kaupa."],
            ["Kuivamine", "Planeerime kasutuspausi."],
            ["Hooldusrütm", "Anname soovituse järgmise hoolduse kohta."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Pikendage oma põrandate eluiga"
            description="Tuleme kohale, hindame põrandate seisukorda ja soovitame optimaalse hoolduskava."
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={customFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
