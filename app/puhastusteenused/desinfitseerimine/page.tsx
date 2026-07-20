"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FAQ from "../../components/FAQ";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import Hinnakalkulaator from "../../components/Hinnakalkulaator";
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const customFAQ = [
  {
    q: "Kui tihti peaks kontoriruume professionaalselt desinfitseerima?",
    a: "Viiruste kõrghooajal (oktoobrist märtsini) soovitame täielikku desinfitseerimist vähemalt kord kuus, lisaks igapäevastele puutepunktide puhastustele. Madala riskiga perioodidel kvartaalne hooldus.",
  },
  {
    q: "Kas desinfitseerimine kahjustab mööblit või elektroonikat?",
    a: "Ei, kui kasutatakse õigeid vahendeid. Professionaalne desinfitseerija valib meetodi pinna järgi. Tundliku elektroonika jaoks on eraldi lahendused. Enne teenust mainige alati eritingimusi.",
  },
  {
    q: "Kui kaua võtab desinfitseerimine aega?",
    a: "Keskmise kontori (200–500m²) desinfitseerimine võtab 1–3 tundi sõltuvalt meetodist. Ruumid on sageli kasutatavad kohe pärast töö lõppu.",
  },
  {
    q: "Millised on tõhusad puutepunktid, mida sageli puhastada?",
    a: "Telefonid (kuni 25 000 mikroobi/cm²), ukselingid, kohvimasina nupud, koosolekuruumide lauad ja toolid, lülitid ning käsipuud. Need on kontoris kõige suurema nakkusriskiga.",
  },
  {
    q: "Kas teenus on efektiivne COVID-19 ja gripi vastu?",
    a: "Jah, meie kasutatavad vahendid on testitud ja tõestatud efektiivsusega nii COVID-19 kui ka gripi, noroviiruse ja teiste hingamisteede viiruste vastu.",
  },
];

export default function Desinfitseerimine() {
  return (
    <>
      <SeoJsonLd
        serviceName="Desinfitseerimine Tallinnas"
        serviceDescription="Ruumide professionaalne desinfitseerimine Tallinnas. Sertifitseeritud vahendid, ohutu inimestele ja tehnikale."
        serviceUrl="https://spsgrupp.ee/puhastusteenused/desinfitseerimine"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Puhastusteenused", item: "https://spsgrupp.ee/puhastusteenused" },
          { position: 3, name: "Desinfitseerimine", item: "https://spsgrupp.ee/puhastusteenused/desinfitseerimine" },
        ]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Desinfitseerimine"
          style={{ background: "#d4d8e3 url('/desinfitseerimine-1.jpg') calc(100% + 100px) center / cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kuni</div>
                <div className="text-[15px] text-[#1f2937]">-30% haiguspäevi</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">EL</div>
                <div className="text-[15px] text-[#1f2937]">sertifitseeritud</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-navy w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Ohutu</div>
                <div className="text-[15px] text-[#1f2937]">inimestele</div>
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
                Professionaalne desinfitseerimine<br />
                <span className="text-[#3abeff]">äriruumides</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Vähendab haiguspäevi kuni 30%. Sertifitseeritud vahendid, õhuionisaator. Ohutu inimestele ja tehnikale.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi desinfitseerimise pakkumist
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
                <a href="/puhastusteenused" className="text-white/80 no-underline hover:text-white transition-colors">Puhastusteenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Desinfitseerimine</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Haiguspäevad maksavad rohkem kui arvate" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Haiguspäevad moodustavad keskmiselt 4–6% ettevõtte aastasest palgafondist ning see ei sisalda kaudseid kulusid nagu ületunnitöö, projektide edasilükkumine ja klientide kaotus. Ettevõtete juhid on avastanud, et investeering professionaalsesse desinfitseerimisse pole kulu, vaid kasulik investeering, mis tasub end kiiresti ära.</p>
                  <p className="mt-4">Tavaline koristus ei kaitse teie töötajaid viiruste eest. Mikroobid levivad kontorites ja käidavates kohtades erinevate puutepindade kaudu: telefonid, ukselingid, kohvimasinad, koosolekulauad. Tavaline puhastusvahend neid ei hävita, vaid lihtsalt ajab laiali.</p>
                </div>
                <div>
                  <p>SPS Grupp pakub professionaalset desinfitseerimist spetsiaalsete desovahendite ja õhuionisaatoriga. Hävitab patogeene tõhusalt ja on ohutu inimestele.</p>
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
                <TwoToneHeading text="Mida sisaldab professionaalne desinfitseerimine?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Esmane hindamine", desc: "Kriitiliste piirkondade kaardistamine" },
                  { bold: "Desovahenditega pihustamine", desc: "Katab ka raskesti ligipääsetavad kohad" },
                  { bold: "Kontaktpindade erihooldus", desc: "Ukselingid, lülitid, klaviatuurid" },
                  { bold: "Sanitaarruumide ja söögialade põhjalik desinfitseerimine", desc: "" },
                  { bold: "Ventilatsioonisüsteemide töötlus", desc: "" },
                  { bold: "Järelraport ja soovitused", desc: "Edaspidiseks hoolduseks" },
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
                <TwoToneHeading text="Miks valida professionaalne desinfitseerimine?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Tõestatud efektiivsus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Meie kasutatavad vahendid on testitud ja tõestatud efektiivsusega COVID-19, gripi ja teiste hingamisteede viiruste vastu.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kaasaegsed meetodid</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Spetsiaalsed desovahendid ja õhuionisaator. Iga olukorra jaoks sobiv tehniline lahendus.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Ohutu ja jäägivaba</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Vahendid on ohutud inimestele, elektroonikaseadmetele ja pindadele. Ei jäta kahjulikke jääke ega ebameeldivat lõhna.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Mõõdetav tulemus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Haiguspäevad vähenevad, töötajate rahulolu tõuseb, klientide usaldus suureneb. Investeering, mis tasub end ära.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/desinfitseerimine-2.webp"
                    alt="SPS Grupp desinfitseerimine"
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
                <TwoToneHeading text="Kuidas kujuneb desinfitseerimise hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Hind sõltub pindalast, kasutatavast meetodist ja tööde sagedusest.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl">
                      <div className="text-[15px] font-bold mb-1 text-white">Pindade desinfitseerimine</div>
                      <div className="text-[26px] font-bold mb-1 text-white">1.5€/m²</div>
                      <div className="text-[15px] mb-2 text-white/70">alates</div>
                      <div className="text-[15px] text-white/70">pindade töötlus</div>
                    </div>
                    <div className="p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                      <div className="text-[15px] font-bold mb-1 text-[#17345a]">Õhu desinfitseerimine</div>
                      <div className="text-[26px] font-bold mb-1 text-[#17345a]">2€/m²</div>
                      <div className="text-[15px] mb-2 text-[#5a6474]">alates</div>
                      <div className="text-[15px] text-[#5a6474]">õhuionisaatoriga</div>
                    </div>
                  </div>

                  <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light mb-4">
                    <strong className="text-[#17345a]">Kiireloomuline viirusejärgne puhastus:</strong> individuaalne pakkumine
                  </p>

                  <p className="text-[15px] text-[#5a6474] mb-6">
                    Regulaarne desinfitseerimine (kord kuus või kvartalis) on soodsam kui ühekordsed teenused.
                  </p>

                  <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4 inline-flex">
                    Küsi desinfitseerimise pakkumist
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>

                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS desinfitseerimise teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Riskide kaardistus", "Täpsustame pinnad ja kasutuskoormuse."],
            ["Puhastus", "Vajadusel puhastame pinna enne desinfitseerimist."],
            ["Desinfitseerimine", "Kasutame kokkulepitud vahendeid ja meetodit."],
            ["Mõjuaeg", "Arvestame vahendi toimimiseks vajalikku aega."],
            ["Graafik", "Soovitame sobiva korduse vajadusel."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]">
            <div className="max-w-[1280px] mx-auto px-[5%] text-center">
              <TwoToneHeading text="Kaitske meeskonda ja äritegevust" className="mb-6" />
              <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mb-10">
                Tuleme kohale, hindame vajadusi ja koostame desinfitseerimisplaani. Kiire reageerimine viirusepuhangute puhul.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-3 px-6">
                  Küsi pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link
                  href="tel:6623328"
                  className="btn-outline bg-white border-[#17345a] text-[#17345a] hover:bg-[#17345a] hover:text-white text-[15px] py-3 px-6"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  662 3328
                </Link>
                <a
                  href="mailto:info@spsgrupp.ee"
                  className="btn-outline bg-white border-[#17345a] text-[#17345a] hover:bg-[#17345a] hover:text-white text-[15px] py-3 px-6"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  info@spsgrupp.ee
                </a>
              </div>
            </div>
          </section>
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
