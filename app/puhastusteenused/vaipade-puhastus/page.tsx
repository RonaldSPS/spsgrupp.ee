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

const customFAQ = [
  {
    q: "Millal on õige aeg tellida professionaalne vaipade puhastus?",
    a: "Tavaliselt soovitame puhastust iga kvartal või poolaasta tagant. Märgid, et aeg on käes: nähtavad plekid, ebameeldiv lõhn, vaip tundub tuhm, töötajad kaebavad sagenevate allergiate üle.",
  },
  {
    q: "Kuidas minimeerida vaipade puhastuse mõju igapäevatööle?",
    a: "Planeerime tööd õhtuti või nädalavahetusel. Suuremas kontoris saame teha tsoonidena, et kõike korraga ei segataks. Teavitame alati eelnevalt, millal tuleme ja kui kaua kulub.",
  },
  {
    q: "Milline vaibapuhastuse meetod on kõige tõhusam?",
    a: "Tavaliselt kasutame aurupuhastust. See eemaldab sügava mustuse ja bakterid hästi. Kõrge liiklusega kohtadele ja eriti määrdunud vaipadele keemilist süvapuhastust. Vaibatüüp määrab meetodi.",
  },
  {
    q: "Kui kaua võtab vaibapuhastus aega ja kuivamine?",
    a: "Keskmise kontori puhastamine võtab 2–3 tundi sõltuvalt pindalast ja mööblist. Kuivpuhastusega saab kohe peale käia, aurupuhastusega kulub 6–12 tundi kuivamiseks.",
  },
  {
    q: "Kas saate eemaldada vanu, sissekuivanud plekke?",
    a: "Enamikul juhtudel jah. Vanad plekid (kohv, vein, tint) vajavad mõnikord mitut töötluskorda. Hindame alati esmalt ja ütleme ausalt, mida on võimalik teha.",
  },
];

export default function VaipadePuhastus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Vaipade puhastus Tallinnas"
        serviceDescription="Vaipade professionaalne puhastus ja keemiline pesu Tallinna kontorites. Allergeenide eemaldamine."
        serviceUrl="https://spsgrupp.ee/puhastusteenused/vaipade-puhastus"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Puhastusteenused", item: "https://spsgrupp.ee/puhastusteenused" },
          { position: 3, name: "Vaipade puhastus", item: "https://spsgrupp.ee/puhastusteenused/vaipade-puhastus" },
        ]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Vaipade puhastus"
          style={{ background: "url('/vaipade-puhastus-1.png') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kõik</div>
                <div className="text-[15px] text-[#1f2937]">vaibatüübid</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">ISO 14001</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Allergiavabad</div>
                <div className="text-[15px] text-[#1f2937]">meetodid</div>
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
                Professionaalne vaipade puhastus<br />
                <span className="text-[#3abeff]">kontoritele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Eemaldame allergeenid, plekid, tolmulestad ja bakterid. Aurupuhastus, keemiline pesu ja kuivpuhastus. Igale vaibale sobiv meetod. Kuivamine 6–12 tundi. Alates <strong className="text-white font-medium">3€/m²</strong>.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi vaibapesu pakkumist
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
                <a href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</a>
                <span className="text-white/50">/</span>
                <a href="/puhastusteenused" className="text-white/80 no-underline hover:text-white transition-colors">Puhastusteenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Vaipade puhastus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Teie kontorivaip võib olla haigem kui arvate" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Pealtnäha puhas vaip võib varjata tolmulestasid, sadu tuhandeid baktereid, hallitusseente eoseid, õietolmu ja inimestelt pärinevaid osakesi.</p>
                  <p className="mt-4">Puhastamata vaibad võivad töötajatel põhjustada allergiaid ja hingamisteede probleeme, ilma et keegi kahtlustaks vaipa. Uuringud näitavad, et ettevõtetes, kus vaipu puhastatakse regulaarselt (vähemalt kord kvartalis), on haiguspäevi märgatavalt vähem.</p>
                </div>
                <div>
                  <p>SPS Grupp teostab vaipade professionaalset süvapuhastust kontorites, mis eemaldab mitte ainult nähtavad plekid, vaid ka peidetud terviseriskid.</p>
                  <p className="mt-4">Kasutame vaibatüübile sobivat meetodit — aurupuhastus, keemiline pesu või kuivpuhastus — et tagada maksimaalne tulemus ilma vaipa kahjustamata.</p>
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
                <TwoToneHeading text="Mida sisaldab professionaalne vaipade puhastus?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Vaibatüübi hindamine ja sobiva meetodi valik", desc: "" },
                  { bold: "Eelpuhastus", desc: "suure mustuse ja tolmu eemaldamine" },
                  { bold: "Plekkide eeltöötlus spetsiaalsete ainetega", desc: "" },
                  { bold: "Sügavpuhastus", desc: "aurupuhastus, keemiline pesu või kuivpuhastus" },
                  { bold: "Allergeenide ja tolmulestade neutraliseerimine", desc: "" },
                  { bold: "Staatilise elektri vähendamine", desc: "" },
                  { bold: "Kiire kuivamine", desc: "kontor kasutatav hommikul" },
                  { bold: "Vaipplaatide ja liimitud vaipade erikäsitlemine", desc: "" },
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
                <TwoToneHeading text="Miks valida SPS Grupp vaipade puhastuseks?" />
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kõik lahendused ühest kohast</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Aurupuhastus, keemiline pesu, kuivpuhastus. Valime meetodi vaibatüübi järgi. Sünteetilised vaibad, villased vaibad, vaipplaadid on meile kõik tuttavad.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kiire kuivamine</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Aurupuhastusega kulub kuivamisele tavaliselt 6–12 tundi. Kuivpuhastusega saab kohe peal käia. Planeerime tööd nii, et hommikul on kõik kasutatav.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Allergiavabad vahendid</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kasutame tundlikele inimestele sobivaid puhastusvahendeid. Vahendid on ökomärgisega, sertifitseeritud, ohutud ja ilma ärritavate lõhnadeta.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Regulaarse hoolduse plaan</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Koostame hoolduskava, et saavutada ja hoida parimat tulemust ning toimida säästlikult.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/vaipade-puhastus-2.jpg"
                    alt="SPS Grupp vaipade puhastus"
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
                <TwoToneHeading text="Kuidas kujuneb vaibapesu hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Vaipade puhastuse hind sõltub pindalast, vaibatüübist, mustuse astmest ja valitud meetodist.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { size: "Aurupuhastus", area: "süvapuhastus + kiire kuivamine", price: "3€/m²", period: "alates", highlight: true },
                      { size: "Keemiline pesu", area: "sügavpuhastuseks", price: "4€/m²", period: "alates" },
                      { size: "Kuivpuhastus", area: "kohe kasutatav", price: "3.5€/m²", period: "alates" },
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

                  <p className="text-[15px] text-[#5a6474]">
                    Plekkide lisatöötlus: alates <strong>15€/plekk</strong>. Keskmise kontori (200–300m²) vaipade puhastus võtab 2–3 tundi. Kohapealne hindamine on tasuta.
                  </p>
                </div>

                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>


        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS vaipade puhastuse teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Ülevaatus", "Hindame vaiba tüüpi ja mustuse taset."],
            ["Eeltöötlus", "Töötleme plekid ja käigurajad."],
            ["Põhipuhastus", "Teeme süvapuhastuse sobiva meetodiga."],
            ["Kuivamine", "Planeerime kasutuspausi."],
            ["Järelkontroll", "Vaatame tulemuse üle ja anname hooldussoovituse."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Küsige tasuta vaipade hindamist"
            description="Tuleme kohale, hindame vaipade seisukorda ja pakume optimaalse lahenduse. Kohustuseta ja tasuta."
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
