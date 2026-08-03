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
import Hinnakalkulaator from "../../components/Hinnakalkulaator";
import SeoJsonLd from "../../components/SeoJsonLd";
import TestimonialSlider from "../../components/TestimonialSlider";
import Tooprotsess from "../../components/Tooprotsess";

export default function KaubanduspindadeKoristus() {
  const faqItems = [
    {
      q: "Kui sageli tuleks kaubanduspinda koristada?",
      a: "Enamik kaubanduspindu vajab päevakoristust (1–3x tööpäeva jooksul) ja öist süvapuhastust. Sagedus sõltub liikluskoormusest ja sortimendist. Aitame koostada optimaalse graafiku.",
    },
    {
      q: "Kas koristus segab kaubanduspinna igapäevatööd?",
      a: "Ei. Planeerime töö nii, et oleksime nähtamatud kaubanduskeskuse klientidele. Tõsisemad puhastustööd toimuvad öösel või enne avamist, päevakoristus madala liiklusega aegadel ja diskreetselt.",
    },
    {
      q: "Kas pakute kiirreageerimist hädaolukordades?",
      a: "Kiireloomuliste olukordade puhul reageerime koheselt või esimesel võimalusel. Täpne aeg sõltub objekti asukohast, töömahust ja meeskonna saadavusest.",
    },
    {
      q: "Kas eskalaatorite puhastus sisaldub teenuses?",
      a: "Igapäevane pinnapuhastus jah. Eskalaatorite perioodiline süvapuhastus on eraldi teenus, mida soovitame 2–4 korda aastas sõltuvalt kasutussagedusest.",
    },
    {
      q: "Kuidas toimub kvaliteedikontroll?",
      a: "Igal objektil on objektijuht, kes kontrollib tööd regulaarselt. Esitame kliendile digitaalseid raporteid ja viime läbi kliendi rahulolu-uuringuid.",
    },
  ];

  return (
    <>
      <SeoJsonLd
        etPath="/koristusteenus/kaubanduspindade-koristus"
        locale="et"
        serviceName="Kaubanduspindade koristus Tallinnas"
        serviceDescription="Kaubanduspindade professionaalne koristus ja hooldus Tallinnas. Puhtad ja esinduslikud pinnad iga päev."
        breadcrumbs={[
          { name: "Avaleht", etPath: "/" },
          { name: "Koristusteenus", etPath: "/koristusteenus" },
          { name: "Kaubanduspindade koristus", etPath: "/koristusteenus/kaubanduspindade-koristus" },
        ]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Kaubanduspindade koristus"
        >
          <HeroBackgroundImage src="/kaubanduspindade-koristus.jpg" preload alt="" />
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Pikaajaline</div>
                <div className="text-[15px] text-[#1f2937]">kogemus</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Paindlik</div>
                <div className="text-[15px] text-[#1f2937]">reageerimine</div>
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
                Kaubanduspindade koristus<br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Päevakoristus, süvapuhastus ja eritööd kaubanduskeskustele, poodidele ja esindustele. Puhtad pinnad ka kõrge liiklusega tundidel.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
                >
                  Küsi kaubanduspindade koristuse pakkumist
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
                <a href="/koristusteenus/" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenus</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Kaubanduspindade koristus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Kas teie kaubanduspind jätab õhtul sama hea mulje nagu hommikul?" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>Kaubanduspinnal liigub iga päev sadu, sageli tuhandeid inimesi ja SPS Grupp tagab, et iga külastus jätab puhta, meeldiva mulje.</strong>
              </div>
              <div>
                <strong>Puhas pind müüb.</strong> Kliendid märkavad korrastatud põrandaid, tühjendatud prügikaste ja värske õhuga ruume ning tulevad tagasi. Hoiame kaubanduspinnad esinduslikena just siis, kui see on kõige olulisem. Hommikusel tipptunnil, nädalavahetuse kiiretel ostupäevadel ja kampaaniate ajal, kui liiklus on kõige tihedam.<br /><br />
                <strong>Meie integreeritud lähenemine tähendab, et teie pind on alati valmis.</strong> Päevakoristus hoiab ruumid korras madala liiklusega ajavahemikel, öine süvapuhastus tagab igal hommikul värske alguse ning suudame reageerida kiirelt ootamatutele olukordadele enne, kui kliendid märkavad.
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
              <TwoToneHeading text="Mida sisaldab kaubanduspinna koristusteenus?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { bold: "Päevakoristus madala liikluse aegadel", desc: "põrandad, klaasid, WC-d" },
                { bold: "Öine süvapuhastus", desc: "masinpesu, vahatamine, põhjalik desinfitseerimine" },
                { bold: "Eskalaatorite ja liftide puhastus ning hooldus", desc: "" },
                { bold: "Sanitaarruumide regulaarne kontroll", desc: "tarvikute täiendamine" },
                { bold: "Klaaspindade, vitriinide ja sissepääsude poleerimine", desc: "" },
                { bold: "Välisterritooriumi ja sissepääsude hooldus", desc: "prügikastid, porimatid" },
                { bold: "Kiirreageerimine hädaolukordadele", desc: "lekked, mahapillatud tooted" },
                { bold: "Perioodilised eritööd", desc: "akende pesu, põrandate süvapesu, fassaadipesu" },
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
              <TwoToneHeading text="Miks kaubanduskeskused valivad SPS Grupi?" />
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Suur kogemus kaubanduskeskuste koristamisel</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Oleme aastaid teenindanud suuri kaubanduskeskusi ja jaekette Tallinnas. Teame, mida kliendid märkavad ja mida mitte.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Operatiivne suhtlus</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Kiireloomuliste olukordade puhul reageerime koheselt või esimesel võimalusel. Täpne aeg sõltub objekti asukohast, töömahust ja meeskonna saadavusest.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Digitaalne aruandlus</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Näete reaalajas, mis on tehtud ja millal. Igakuised raportid annavad selge ülevaate koristuskuludest ja töömahtudest.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Koolitatud ja kontrollitud personal</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Meie töötajad töötavad klientide juuresolekul. Nad teavad, kuidas käituda, kuidas riietuda ja kuidas mitte segada müügitegevust.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/kaubanduspindade-koristus-2.jpg"
                  alt="Kaubanduspinna koristus"
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
              <TwoToneHeading text="Millest sõltub kaubanduspinna koristuse hind?" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Kaubanduspinna koristuse hind sõltub pindalast, liikluskoormusest, lahtiolekuaegadest ja eritööde vajadusest.
                </p>

                <div className="mb-8">
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] font-light">
                    Eesti kliima nõuab läbimõeldud ja hooajalist lähenemist koristusteenustele. Koristusfirma SPS Grupp pakub terviklikku aastaringset plaani, mis lähtub just Eesti tingimustest.
                  </p>
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
              <TwoToneHeading text="Mida ütlevad meie äripindade kliendid" />
            </div>
            <TestimonialSlider testimonials={[
              {
                quote: "Soovin anda tunnustavat tagasisidet puhastusteenuse kohta. Kontori ja logistika ning üldpindade koristus jätavad väga hea ja korrastatud mulje. Pinnad on puhtad, ruumid korras ning on näha, et koristustöid tehakse hoolikalt.",
                shortQuote: "Kontori ja logistika ning üldpindade koristus jätavad väga hea ja korrastatud mulje. Pinnad on puhtad, ruumid korras.",
                author: "Mati", initials: "M", logo: "/arvamused-logod/mati.png",
              },
              {
                quote: "Soovin anda positiivset tagasisidet koristusteenuse kohta. Ruumid on korras, puhtad ja hästi hoitud ning teenus toimib stabiilselt. Hindame seda, et koristuse kvaliteet on püsinud ühtlane.",
                shortQuote: "Ruumid on korras, puhtad ja hästi hoitud ning teenus toimib stabiilselt. Koristuse kvaliteet on püsinud ühtlane.",
                author: "Kersti", initials: "K", logo: "/arvamused-logod/kersti.png",
              },
              {
                quote: "Palun edastage meie tänusõnad koristajale. Selline hoolikas ja kvaliteetne töö jääb klientidele silma ning väärib tunnustust.",
                shortQuote: "Selline hoolikas ja kvaliteetne töö jääb klientidele silma ning väärib tunnustust.",
                author: "Kätlin", initials: "K", logo: "/arvamused-logod/katlin.png",
              },
            ]} />
          </div>
        </section>
        </ScrollAnimation>

        {/* Tööprotsess */}
        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS kaubanduspinna koristuse käivitab?"
          intro="Alustame sellest, millal pind on kõige koormatum, millised alad on kliendile nähtavad ja millal saab teha põhjalikumaid töid."
          steps={[
            ["Külastuskoormuse hindamine", "Vaatame üle tipptunnid, sissepääsud, sanitaarruumid, klaaspinnad ja müügiala liikumisrajad."],
            ["Päeva- ja öögraafik", "Jagame tööd nähtava päevakoristuse, sulgemisjärgse hoolduse ja perioodiliste eritööde vahel."],
            ["Teenindusstandard", "Lepime kokku vormi, käitumise, reageerimise ja suhtluse, sest koristaja võib töötada klientide vahetus läheduses."],
            ["Käivitamine", "Alustame graafikuga ja jälgime esimestel nädalatel, kas sagedus vastab tegelikule külastuskoormusele."],
            ["Kvaliteedikontroll", "Objektijuht kontrollib nähtavaid alasid, tööde täitmist ja korduvate probleemide lahendamist."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title="Küsige kaubanduspinna koristuse pakkumist"
          description="Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust. Pakkumise tähtaeg sõltub töö iseloomust ja objekti ülevaatuse vajadusest."
        />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
        <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
        <FAQ items={faqItems} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
