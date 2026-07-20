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
import TestimonialCards from "../../components/TestimonialCards";
import Tooprotsess from "../../components/Tooprotsess";

const customFaqItems = [
  {
    q: "Kui sageli peaks tootmishoonet koristama?",
    a: "Sõltub tootmise intensiivsusest. Tavaliselt vähemalt kord nädalas, tolmurohketes või õlirohketes tingimustes tihedamini, sageli igapäevaselt. Sanitaarruumid ja puhkeruumid vajavad igapäevast hooldust.",
  },
  {
    q: "Kas koristus saab toimuda väljaspool tootmisaega?",
    a: "Jah. Enamus meie tootmishoonete koristustöid toimub öösiti, nädalavahetustel või tootmispausides. Me ei sega teie tootmisprotsessi.",
  },
  {
    q: "Kas kasutate keskkonnasõbralikke vahendeid?",
    a: "Eelistame väiksema keskkonnamõjuga puhastusvahendeid kõikjal, kus pinnad ja ohutusnõuded seda võimaldavad. Õlieemalduseks kasutame spetsiaalseid biolagunevaid aineid. Järgime ISO 14001 standardit.",
  },
  {
    q: "Kas SPS Grupp koristab ka õli- või suitsukahjustusi?",
    a: "Jah, meil on kogemus suitsu-, vee- ja õlikahjustuste puhastamisel tööstuskeskkonnas. Pakume ka hädaolukorra reageerimist.",
  },
  {
    q: "Kas teil on tööohutuskoolitused?",
    a: "Jah, kõik meie tootmishoonete koristajad läbivad tööohutuskoolituse, kasutavad isikukaitsevahendeid ja järgivad kliendi kehtestatud ohutusreegleid.",
  },
];

export default function TootmishooneteKoristus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Tootmishoonete koristus Tallinnas"
        serviceDescription="Tootmishoonete ja tööstuspindade professionaalne koristus Tallinnas."
        serviceUrl="https://spsgrupp.ee/koristusteenus/tootmishoonete-koristus"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Tootmishoonete koristus", item: "https://spsgrupp.ee/koristusteenus/tootmishoonete-koristus" },
        ]}
        faq={customFaqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Tootmishoonete koristus"
          style={{ background: "url('/tootmishoonete-koristus.webp') center/cover no-repeat" }}
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">20+ aastat</div>
                <div className="text-[15px] text-[#1f2937]">tööstuskogemust</div>
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
                Tootmishoonete ja<br />
                <span className="text-[#3abeff]">tööstuspindade koristus</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Ohutu ja põhjalik tootmispindade hooldus. Õli, rasva ja tolmuga toime tulev meeskond. Töötame ka öösel ja nädalavahetustel, et mitte segada tootmist.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi tootmishoone koristuspakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                <span className="text-white/90">Tootmishoonete koristus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Tootmishoone koristus ei ole tavaline koristus" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>Tootmiskeskkonnas on puhtus tootlikkuse alus.</strong> Õliplekkideta põrandad, puhtad masinate ümbrused ja korrastatud tasapinnad loovad keskkonna, kus töö käib sujuvalt ja ohutult. SPS Grupp on spetsialiseerunud just sellistele nõudlikele töökeskkondadele.
              </div>
              <div>
                <strong>Meie meeskond tunneb tööstuslikke puhastusprotsesse läbi ja lõhki.</strong> Kasutame õigeid vahendeid, arvestame tootmisrütmiga ja hoiame ohutust prioriteedina.<br /><br />
                <strong>20 aasta jooksul oleme töötanud tootmishoonetes üle kogu Harjumaa.</strong> See kogemus tähendab, et tuleme toime raskesti eemaldatavate tööstuslike jääkide, õli, rasva ja metalliosakestega ning teeme seda viisil, mis hoiab teie tootmise käimas.
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
              <TwoToneHeading text="Mida sisaldab tootmishoonete koristusteenus?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { bold: "Tootmispindade põhjalik puhastus", desc: "põrandad, seinad, masinate ümbrus" },
                { bold: "Õli, rasva ja tööstuslike jääkide eemaldamine", desc: "" },
                { bold: "Kõrgel asuvate pindade puhastus", desc: "torustikud, valgustid, ventilatsioon" },
                { bold: "Laopindade ja logistikakeskuste hooldus", desc: "" },
                { bold: "Sanitaarruumide ja riietusruumide puhastus", desc: "" },
                { bold: "Söökla- ja puhkeruumide hooldus", desc: "" },
                { bold: "Kontoriosa regulaarne koristus", desc: "" },
                { bold: "Põrandate süvapuhastus ja kaitsekatete hooldus", desc: "" },
                { bold: "Eritööd: suitsu- ja õlikahjustuste puhastamine", desc: "" },
              ].map((item, i) => (
                <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                  <div className="text-[#5a6474] text-[15px] mb-2">
                    <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                      {String(i + 1).padStart(2, '0')}.
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
              <TwoToneHeading text="Miks tööstusettevõtted usaldavad SPS Grupi?" />
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Tööstuskogemus ja vastav väljaõpe</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Meie meeskond on läbinud tööohutuskoolituse ja teab, kuidas liikuda tootmiskeskkonnas. Me ei sega tootmist.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Töötame siis, kui tootmine seisab</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Öine, varahommikune või nädalavahetuse töö. Kohandame graafiku teie tootmisrütmiga.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Spetsialiseeritud vahendid</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Kasutame õlieemaldusaineid, rasvaeemaldusaineid ja professionaalseid survepesuseadmeid. Meil on ISO 14001 keskkonnasertifikaat.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Dokumentatsioon ja ohutusnormid</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Järgime kõiki tööohutuse nõudeid, peame logisid ja esitame regulaarseid raporteid.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/Tootmishoonete-koristus-2.webp"
                  alt="Tootmishoone koristus SPS Grupp"
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
              <TwoToneHeading text="Kuidas kujuneb tootmishoone koristuse hind?" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Tootmishoone koristuse hind sõltub pindalast, mustuse iseloomust, koristuse sagedusest ja töögraafikust.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { size: "Väike tootmishoone", area: "kuni 500m²", price: "400€", period: "kuu", highlight: true },
                    { size: "Keskmine tootmishoone", area: "500–2000m²", price: "900€", period: "kuu" },
                    { size: "Suur tootmiskompleks", area: "2000m²+", price: "Individuaalne", period: "pakkumine" },
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
                  Eritööd (õlieemaldus, süvapesu, kõrgtööd) arvestatakse eraldi. Anname alati läbipaistva pakkumise, kus iga komponent on selgelt välja toodud.
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Klientide tagasiside
              </div>
              <TwoToneHeading text="Mida ütlevad meie tootmis- ja laokliendid" />
            </div>
            <TestimonialCards testimonials={[
              {
                quote: "Täname tehtud töö ja panustatud pingutuse eest. Lao ja tootmiskoristuse tööd said korrektselt tehtud, koostöö sujus hästi ning jäime lõpptulemusega rahule.",
                shortQuote: "Lao ja tootmiskoristuse tööd said korrektselt tehtud, koostöö sujus hästi ning jäime lõpptulemusega rahule.",
                author: "Heigar", initials: "H", logo: "/arvamused-logod/heigar.png",
              },
              {
                quote: "Soovin avaldada tunnustust väga hea koristusteenuse eest. Nii ladu kui ka kontoriruumid on puhtad, korras ja hästi hooldatud. Tehtud töö kvaliteet on olnud järjepidevalt kõrgel tasemel.",
                shortQuote: "Nii ladu kui ka kontoriruumid on puhtad, korras ja hästi hooldatud. Tehtud töö kvaliteet on olnud järjepidevalt kõrgel tasemel.",
                author: "Katri", initials: "K", logo: "/arvamused-logod/katri.png",
              },
              {
                quote: "SPS Grupp on olnud meie jaoks usaldusväärne koostööpartner. Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel.",
                shortQuote: "Nii tootmis-, lao- kui ka kontoriruumide korrashoid on olnud järjepidevalt kõrgel tasemel.",
                author: "Heido", initials: "H", logo: "/arvamused-logod/heido.png",
              },
            ]} />
          </div>
        </section>
        </ScrollAnimation>

        {/* Tööprotsess */}
        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS tööstushoone koristuse käivitab?"
          intro="Tootmispinna puhul algab teenus riskide ja töövoo mõistmisest. Alles siis saab valida inimesed, seadmed ja graafiku."
          steps={[
            ["Tootmisrütmi kaardistus", "Selgitame välja tööajad, seisakud, ohualad, liikumisteed ja alad, kuhu ligipääs on piiratud."],
            ["Mustuse ja pindade hindamine", "Hindame põrandakatteid, õli- või tolmukoormust, seadmete ümbrust ja vajalikke puhastusmeetodeid."],
            ["Ohutu tööplaani koostamine", "Kirjeldame alad, sageduse, seadmed, isikukaitsevahendid ja tööohutuse nõuded."],
            ["Meeskonna juhendamine", "Teenindajad saavad objekti eripära, liikumise, vahendite ja kliendi sisereeglite juhised."],
            ["Kontroll ja täpsustamine", "Objektijuht hindab esimesi tulemusi ning korrigeerib sagedust või meetodit vastavalt tegelikule töömahule."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title="Küsige tootmishoone koristuse pakkumist"
          description="Tuleme kohale, hindame olukorda ja koostame personaalse pakkumise. Anname vastuse 24 tunni jooksul. See ei kohusta teenust tellima."
        />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
        <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
        <FAQ items={customFaqItems} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
