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

const koolideFAQ = [
  {
    q: "Kui kiiresti tervishoiukeskne koristus haiguspuhanguid vähendab?",
    a: "Esimesed tulemused on märgatavad 2–3 nädala jooksul. Märkimisväärne haigestumiste vähenemine ilmneb tavaliselt 6–8 nädalaga, kui süsteem on täielikult rakendatud.",
  },
  {
    q: "Millised alad koolis vajavad erilist tähelepanu?",
    a: "Kriitilised alad on käepidemed, lauad ja toolid, WC-ruumid, söökla, spordirajatised ja ventilatsioonisisendid. Need 6 ala moodustavad umbes 80% nakkuste levikuteedest koolis.",
  },
  {
    q: "Kas puhastusvahendid on lastele ohutud?",
    a: "Jah, kasutame ainult haridusasutustes sertifitseeritud, EL standarditele vastavaid vahendeid. Ei kasuta ärritavaid lõhnaaineid ega ohtlikke kemikaale.",
  },
  {
    q: "Kas koristus segab õppetööd?",
    a: "Ei. Põhiline koristus toimub hommikul enne õppetundide algust ja õhtul pärast tundide lõppu. Päevane töö piirdub avalike alade kiirreageerimisega.",
  },
  {
    q: "Kas osalete ka riigihangetel?",
    a: "Jah, osaleme aktiivselt koolide koristuse riigihangetel. Omame vajalikku kvalifikatsiooni, ISO sertifikaate ja kogemust.",
  },
];

export default function KoolideKoristamine() {
  return (
    <>
      <SeoJsonLd
        serviceName="Koolide koristamine Tallinnas"
        serviceDescription="Koolide ja haridusasutuste professionaalne koristamine Tallinnas."
        serviceUrl="https://spsgrupp.ee/koristusteenus/koolide-koristamine"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Koristusteenus", item: "https://spsgrupp.ee/koristusteenus" },
          { position: 3, name: "Koolide koristamine", item: "https://spsgrupp.ee/koristusteenus/koolide-koristamine" },
        ]}
        faq={koolideFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Koolide koristamine"
          style={{ background: "url('/koolide-koristamine4.jpg') center/cover no-repeat" }}
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Lastele ohutud</div>
                <div className="text-[15px] text-[#1f2937]">vahendid</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Hommikune</div>
                <div className="text-[15px] text-[#1f2937]">desinfitseerimine</div>
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
                border: "1px solid rgba(133, 203, 233, 0.2)"
              }}
            >
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] -tracking-[1px] mb-[18px]">
                Koolide ja lasteaedade<br />
                <span className="text-[#3abeff]">koristamine</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                <strong className="text-white font-medium">Tervishoiukeskne koristus</strong>, mis aitab vähendada õpilaste haigestumisi. Sertifitseeritud vahendid, mis on lastele ohutud.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi kooli koristuse pakkumist
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
                <a href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</a>
                <span className="text-white/50">/</span>
                <a href="/koristusteenus" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Koolide koristamine</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Koolikoristus on rohkem kui lihtsalt puhtus. See on ka laste tervis" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>Koolides ja lasteaedades on puhtus õppimise alus.</strong> Ukselingid, käsipuud, söökla tasapinnad, WC-d ja spordisaalid vajavad süsteemset lähenemist, mitte tavalist igapäevakoristust.
              </div>
              <div>
                <strong>SPS Grupp on koristanud Tallinna koole ja lasteaedasid aastaid.</strong> Me teame, millised alad vajavad erilist tähelepanu ja millised puhastusvahendid on laste ümbruses ohutud. Meie tervishoiukeskne koristusprotokoll tagab, et kõige rohkem käidavad pinnad saavad põhjaliku ja regulaarse puhastuse.<br /><br />
                Tulemuseks on keskkond, kus lapsed saavad keskenduda õppimisele ja õpetajad õpetamisele.
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
              <TwoToneHeading text="Mida sisaldab koolide koristusteenus?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { bold: "Hommikune desinfitseerimine enne laste saabumist", desc: "" },
                { bold: "Klassiruumide ja ühisalade igapäevane hooldus", desc: "" },
                { bold: "WC-ruumide põhjalik desinfitseerimine ja tarvikute täiendamine", desc: "" },
                { bold: "Söökla ja köögi sanitaarhooldus", desc: "toitlustusnormide järgi" },
                { bold: "Spordisaali ja riietusruumide puhastus", desc: "" },
                { bold: "Käsipuude, ukselinkide ja lülitite regulaarne desinfitseerimine", desc: "" },
                { bold: "Akende pesu, põrandate hooldus, vaipade puhastus", desc: "" },
                { bold: "Kiirreageerimine", desc: "viirushaiguste puhangud, ürituste järel" },
                { bold: "Igakuine terviseaudit ja raport koolijuhtkonnale", desc: "" },
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
              <TwoToneHeading text="Miks Tallinna koolid valivad SPS Grupi?" />
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Lastele ohutud vahendid</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Kasutame ainult EL-i standarditele vastavaid, laste ümbruses sertifitseeritud puhastusvahendeid.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Tervishoiukeskne lähenemine</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Meie protokoll keskendub 6 kriitilisele alale, kus levib 80% nakkustest. Tulemuseks haigestumiste vähenemine 2–3 nädala jooksul.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Hommikune ja õhtune režiim</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Desinfitseerimine enne laste saabumist ja pärast lahkumist. Me ei sega õppetööd.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Igakuine terviseaudit</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Saadame igakuise raporti töödest, mida tuvastasime, mida soovitame parandada. See on läbipaistev partnerlus kooliga.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/koolide-koristamine2.jpg"
                  alt="Koolide koristamine SPS Grupp"
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
              <TwoToneHeading text="Millest sõltub kooli koristuse hind?" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Kooli koristuse hind sõltub hoone suurusest, õpilaste arvust ja koristusrežiimist.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { size: "Lasteaed", area: "kuni 500m²", price: "500€", period: "kuu", highlight: true },
                    { size: "Väike kool", area: "kuni 2000m²", price: "1200€", period: "kuu" },
                    { size: "Keskmine kool", area: "2000–5000m²", price: "2500€", period: "kuu" },
                    { size: "Suur kool / gümnaasium", area: "5000m²+", price: "Personaalne", period: "pakkumine" },
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
                  Küsige personaalset pakkumist teie kooli või lasteaia koristamiseks
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
              <TwoToneHeading text="Mida ütlevad meie koolikliendid" />
            </div>

            <TestimonialCards testimonials={[
              {
                quote: "Soovime avaldada tunnustust koolimaja koristusega tegelevale meeskonnale väga hea töö eest. Koolimaja on olnud puhas, korras ja hooldatud ning on näha, et koristustöid tehakse järjepidevalt ja kohusetundlikult.",
                shortQuote: "Koolimaja on olnud puhas, korras ja hooldatud. Puhtus ja korrashoid mõjutavad igapäevaselt nii õpilaste, õpetajate kui ka kogu personali heaolu.",
                author: "Kalev", initials: "K", logo: "/arvamused-logod/kalev.png",
              },
              {
                quote: "Soovin jagada positiivset tagasisidet koolimaja koristuse kohta. Koolimaja on puhas, korras ja hästi hooldatud. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna nii õpilastele kui ka personalile.",
                shortQuote: "Koolimaja on puhas, korras ja hästi hooldatud. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna.",
                author: "Pille", initials: "P", logo: "/arvamused-logod/pille.png",
              },
              {
                quote: "Pidev koristuskvaliteedi jälgimine tagab ka tervislikuma õpikeskkonna ja tervemad lapsed.",
                shortQuote: "Pidev koristuskvaliteedi jälgimine tagab tervislikuma õpikeskkonna ja tervemad lapsed.",
                author: "Tehnikakõrgkooli arendusprorektor Tarmo", initials: "T",
              },
            ]} />

            {/* Case study + video */}
            <div className="mt-12 max-w-[900px] mx-auto">
              <div className="bg-white rounded-2xl p-10 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light">
                  <strong className="text-[#17345a]">Tehnikakõrgkooli lahendus:</strong> 2800 õpilasega kooli kaardistasime kriitilised alad (peakoridorid, söökla, WC-ruumid, spordisaal). Rakendasime hommikuse desinfitseerimisprotokolli ja õhtuse sügava sanitaarhoolduse. 6 nädala jooksul vähenesid haiguspäevad oluliselt.
                </p>
              </div>
              <div className="mt-8 w-full md:w-3/4 mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <video
                    src="/SPS-TarmoSildberg.mp4"
                    controls
                    poster="/TarmoHero.jpg"
                    className="w-full h-auto"
                    style={{ borderRadius: "24px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Tööprotsess */}
        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS koolikoristuse käivitab?"
          intro="Haridusasutuse koristus algab päevakava, liikumisteede ja hügieeniriskide kaardistamisest."
          steps={[
            ["Ruumide ja päevakava ülevaatus", "Kaardistame klassid, sööklad, spordisaalid, sanitaarruumid, sissepääsud ja õppetöö ajad."],
            ["Hügieenipunktide määramine", "Märgime pinnad ja alad, mis vajavad sagedasemat puhastust või desinfitseerimist."],
            ["Tööplaani koostamine", "Kirjeldame hommikused, päevased, õhtused ja perioodilised tööd ning vastutuse."],
            ["Meeskonna juhendamine", "Teenindajad saavad juhised lastega keskkonnas liikumiseks, vahendite kasutamiseks ja suhtluseks."],
            ["Kontroll ja tagasiside", "Objektijuht jälgib tööde täitmist ja kohandab sagedust vastavalt kooli tegelikule kasutusele."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title="Tellige kooli tasuta koristusauditi"
          description="Tuleme kohale, hindame teie kooli või lasteaia hetkeolukorda ja koostame tervishoiukeskse plaani. Auditi käigus analüüsime hoolduskulusid, tuvastame probleemkohad ja esitame 3 erinevat hinnapakkumist."
        />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
        <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
        <FAQ items={koolideFAQ} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
