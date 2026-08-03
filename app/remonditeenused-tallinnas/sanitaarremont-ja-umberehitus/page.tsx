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

const serviceItems = [
  "Olemasoleva sanitaarruumi lammutus ja jäätmete äravedu",
  "Torutööd: veesüsteem, kanalisatsioon",
  "Elektritööd: valgustus, pistikupesad, ventilatsioon",
  "Põranda ja seinte hüdroisolatsioon",
  "Plaatimistööd seintele ja põrandatele",
  "WC-pottide, pissuaaride ja valamute paigaldus",
  "Kraanide, dušikomplektide ja segistite paigaldus",
  "Peeglite, tarvikute ja konksude paigaldus",
  "Ventilatsioonisüsteemi ehitus või uuendus",
  "Lõpukoristus ja üleandmine",
];

const benefits = [
  {
    title: "Täislahendus ühest kohast",
    desc: "Korraldame kokkulepitud tööd oma meeskonna ja vajadusel koostööpartnerite abil. Kliendile jääb tööde koordineerimiseks üks kontaktisik.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h1M9 13h1M9 17h1M15 13h1M15 17h1" />
      </svg>
    ),
  },
  {
    title: "Ennustatav ajakava",
    desc: "Sanitaarruumide remont tähendab töötajatele ebamugavusi. Lepime täpse ajakava kokku enne tööde algust.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Hüdroisolatsioon, mis kestab",
    desc: "Paljud sanitaarremondi probleemid tekivad halvast hüdroisolatsioonist. Meie meetodid kaitsevad alusmaterjale niiskuse eest.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s7-4.35 7-10a7 7 0 0 0-14 0c0 5.65 7 10 7 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Kokkulepped ja dokumentatsioon",
    desc: "Tööde maht, kasutatavad lahendused ja üleandmise tingimused kirjeldatakse kirjalikult.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Väike WC-ruum kuni 5 m²: alates 3 000€",
  "Keskmine sanitaarruum 5-15 m²: alates 6 000€",
  "Suur sanitaarruum või mitu WC-d: individuaalne",
  "Kogu korruse sanitaarsüsteemi ümberehitus: eraldi pakkumine",
];

const faqItems = [
  {
    q: "Kui kaua võtab sanitaarruumi täielik remont?",
    a: "Väike WC-ruum tavaliselt 1-2 nädalat, keskmine 2-3 nädalat, suurem 3-5 nädalat. Täpne aeg sõltub töö mahust ja materjalide saabumisest.",
  },
  {
    q: "Kas saate teha osalist remonti, näiteks ainult plaatimist?",
    a: "Jah, saame teha osalisi töid. Samas võib täielik remont olla sageli kulutõhusam, sest paljud tööd on omavahel seotud.",
  },
  {
    q: "Kas tegelete ka jäätmete äraveoga?",
    a: "Jah, lammutusjäätmete sorteerimine ja nõuetekohane äravedu on meie teenuses sees.",
  },
  {
    q: "Kas saate pakkuda ka sanitaartehnikat?",
    a: "Jah, vajadusel pakume välja sobivaid lahendusi ja soetame need tootjatelt. Võite ka ise osta ja meile paigaldamiseks anda.",
  },
  {
    q: "Kuidas hüdroisolatsioonitööd dokumenteeritakse?",
    a: "Hüdroisolatsiooni lahendus, kasutatavad materjalid ja tööde üleandmise tingimused lepitakse enne alustamist kirjalikult kokku.",
  },
];

export default function SanitaarremontJaUmberehitusLeht() {
  return (
    <>
      <SeoJsonLd
        etPath="/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus"
        locale="et"
        serviceName="Sanitaarremont ja ümberehitus Tallinnas"
        serviceDescription="Sanitaarremont ja ruumide ümberehitus ärikinnisvarale Tallinnas. Vannitoad, köögid, duširuumid."
        breadcrumbs={[{ name: "Avaleht", etPath: "/" }, { name: "Remonditeenused Tallinnas", etPath: "/remonditeenused-tallinnas" }, { name: "Sanitaarremont ja ümberehitus", etPath: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Sanitaarremont ja ümberehitus"
        >
          <HeroBackgroundImage src="/sanitaarremont-1.jpg" preload alt="" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Üks", label: "objektijuht" },
              { value: "Täis", label: "lahendus" },
              { value: "Kirjalik", label: "tööde kirjeldus" },
            ].map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="text-[18px] font-bold text-[#17345a] leading-tight">{chip.value}</div>
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
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                Sanitaarremont ja ruumide ümberehitus
                <br />
                <span className="text-[#3abeff]">ärihoonetes</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[540px] font-light">
                WC-d, dušid ja sanitaarruumid, lammutus, toru- ja elektritööd, plaatimine ja paigaldus ühest kohast. Kiire, puhas ja kvaliteetne teostus.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi sanitaarremondi pakkumist
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
                <a href="/remonditeenused-tallinnas/" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Sanitaarremont ja ümberehitus</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Sanitaarremont on kontori kõige kriitilisem remont" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Töötajad ja kliendid hindavad ettevõtte professionaalsust sageli just sanitaarruumide põhjal. Vana, halvasti hooldatud WC jätab ettevõttest halva mulje.</p>
                  <p className="mt-4">Sanitaarremont on nõudlik töö. See nõuab koordineerimist toru-, elektri-, lammutus-, plaatimis- ja viimistlustöödega. Kui üks etapp ei klapi teisega, tekib viivitus ja kulud kasvavad.</p>
                </div>
                <div>
                  <p>Kui kasutate erinevaid alltöövõtjaid, tähendab see lõputuid telefonikõnesid ja vastutuse jagamist.</p>
                  <p className="mt-4">Korraldame sanitaarremondi kokkulepitud etapid oma meeskonna ja vajadusel koostööpartnerite abil. Kliendile jääb tööde koordineerimiseks üks kontaktisik ning tööde maht ja ajakava lepitakse enne alustamist kokku.</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

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
                <TwoToneHeading text="Mida sisaldab sanitaarremondi teenus?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
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
                      <strong className="text-[#17345a] block mb-1">{item}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

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
                <TwoToneHeading text="Miks valida SPS Grupp sanitaarremondiks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {benefits.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                        <div>
                          <h3 className="text-[18px] font-bold text-[#17345a] mb-2">{item.title}</h3>
                          <p className="text-[15px] text-[#5a6474] leading-[1.7]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/sanitaarremont-2.webp"
                    alt="SPS Grupp sanitaarremont ja ruumide ümberehitus"
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
                <TwoToneHeading text="Sanitaarremondi hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Sanitaarremondi hind sõltub ruumi suurusest, töö mahust, kasutatavatest materjalidest ja viimistlustasemest.
                </p>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-4 font-light">Orienteeruvad hinnad:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {prices.map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] rounded-2xl p-4 text-[15px] text-[#2f353f] leading-[1.7]">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[15px] text-[#5a6474] leading-[1.7] mb-8">
                  Hinnad sisaldavad tavaliselt nii tööd kui ka materjale. Kinnisvara omanikele pakume läbipaistvat hinnakujundust koos detailse eelarvega.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi sanitaarremondi pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FAQ items={faqItems} />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS sanitaarremondi teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Ülevaatus", "Hindame ruumi seisukorda ja tehnilist vajadust."],
            ["Tööplaan", "Koostame etapid ja materjalid."],
            ["Lammutus ja ettevalmistus", "Eemaldame vana lahenduse vajadusel."],
            ["Remont", "Teeme tehnilised ja viimistlustööd."],
            ["Üleandmine", "Kontrollime toimivust ja puhtust."],
          ]}
        />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Alustage sanitaarremondi kavandamist"
            description="Tuleme kohale, hindame olemasolevat olukorda, kuulame ära vajadused ja koostame pakkumise koos ajakavaga."
          />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
