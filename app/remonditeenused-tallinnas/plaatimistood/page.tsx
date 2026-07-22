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
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const serviceItems = [
  "Sanitaarruumide plaatimine (seinad ja põrandad)",
  "Köögi- ja söömisalade plaatimine",
  "Kaubanduspindade põrandaplaatide paigaldus",
  "Duširuumide ja -nurkade plaatimine",
  "Keraamiliste ja klaasplaatide paigaldus",
  "Looduskivide paigaldus",
  "Mosaiikplaatimine",
  "Põranda hüdroisolatsioon plaatimiseks ettevalmistusena",
  "Vanade plaatide eemaldamine ja uute paigaldus",
  "Vuugi parandused ja restaureerimine",
];

const benefits = [
  {
    title: "Sirged vuugid ja ühtlased üleminekud",
    desc: "Detailidele tähelepanu pööramine on plaatimise puhul väga oluline. Meie plaatijad töötavad mõõteriistadega ja kontrollivad iga plaadi asendit.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    title: "Kvaliteetne hüdroisolatsioon",
    desc: "Sanitaarruumis on hüdroisolatsioon kriitiline. Kasutame professionaalseid lahendusi, mis ei lase niiskusel tungida plaatide alla.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s7-4.35 7-10a7 7 0 0 0-14 0c0 5.65 7 10 7 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Ennustatav ajakava",
    desc: "Teame, kui kaua iga pinna plaatimiseks kulub. Anname täpse ajakava ja peame sellest kinni.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Garantii töödele",
    desc: "Plaatimistöödele anname 2 aastat garantiid. Kirjalik leping ja selged tingimused annavad kindluse nii tööde ajal kui pärast üleandmist.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Põrandaplaatide paigaldus: alates 25€/m² (töö)",
  "Seinaplaatide paigaldus: alates 28€/m² (töö)",
  "Mosaiikplaatimine: alates 40€/m² (töö)",
  "Hüdroisolatsioon: alates 15€/m²",
  "Vanade plaatide eemaldamine: alates 10€/m²",
];

const faqItems = [
  {
    q: "Kui kaua võtab keskmise WC-ruumi plaatimine?",
    a: "Väike WC-ruum (kuni 5m²) tavaliselt 3-5 tööpäeva koos hüdroisolatsiooniga ja kuivamisaegadega. Suuremate ruumide puhul proportsionaalselt kauem.",
  },
  {
    q: "Kas teete ka vanade plaatide eemaldamist?",
    a: "Jah. Eemaldame vanad plaadid, ettevalmistame pinna, teeme uue hüdroisolatsiooni ja paigaldame uued plaadid. Kogu protsess ühest kohast.",
  },
  {
    q: "Millised plaaditüübid teile sobivad?",
    a: "Kõik enamlevinud: keraamika, klaas, looduslik kivi, marmor, mosaiik.",
  },
  {
    q: "Kas on vaja enne plaatimist lasta aluspind ette valmistada?",
    a: "Jah. Plaatimise aluspind peab olema tasane, kuiv ja kandev. Vajadusel teeme eelnevalt ka tasandustööd. Hindame olukorda objektile tulles.",
  },
  {
    q: "Kas annate garantii plaatimistöödele?",
    a: "Jah. Plaatimistöödele 2 aastat garantii, hüdroisolatsioonile sama või pikem. Kirjalik leping ja selged tingimused.",
  },
];

export default function PlaatimistoodLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Plaatimistööd Tallinnas"
        serviceDescription="Plaatimistööd ärikinnisvarale Tallinnas. Põranda- ja seinaplaadid, sanitaarruumid, köögid."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/plaatimistood"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Plaatimistööd", item: "https://spsgrupp.ee/remonditeenused-tallinnas/plaatimistood" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Plaatimistööd"
          style={{ background: "url('/plaatimistood-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Sirged", label: "jooned" },
              { value: "Kõik", label: "plaaditüübid" },
              { value: "2 aastat", label: "garantii" },
            ].map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                    <path d="M3 3h18v18H3z" />
                    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
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
                Plaatimistööd ärihoonetele
                <br />
                <span className="text-[#3abeff]">Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[540px] font-light">
                Sanitaarruumid, köögid, kaubanduspinnad ja üldalad. Kogenud plaatijad, sirged jooned, puhas tulemus. Kõik plaaditüübid: keraamika, klaas, kivi.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi plaatimistööde pakkumist
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
                <a href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Plaatimistööd</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Halb plaatimistöö on nähtav iga päev" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Plaatimistööd on üks neid töid, kus halb kvaliteet on kohe nähtav ja jääb nähtavaks aastateks. Kõverad vuugid ja ebaühtlased üleminekud hakkavad ruumi üldmuljet iga päev rikkuma.</p>
                  <p className="mt-4">Veelgi hullem on see, kui plaatimine tehakse ilma korraliku hüdroisolatsioonita. Sanitaarruumis tähendab see seda, et vesi tungib plaatide alla, hakkab kahjustama aluspindu ja mõne aasta pärast tuleb kogu töö uuesti teha.</p>
                </div>
                <div>
                  <p>SPS Grupi plaatijad on spetsialiseerunud just ärikinnisvarale. Me teeme tööd, mis kestab.</p>
                  <p className="mt-4">Kogenud plaatija suudab teha sirged vuugid ja korrektse hüdroisolatsiooni. Anname tulemusele garantii.</p>
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
                <TwoToneHeading text="Milliseid plaatimistöid me teostame?" />
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
                <TwoToneHeading text="Miks valida SPS Grupi plaatijad?" />
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
                    src="/plaatimistood-2.webp"
                    alt="SPS Grupp plaatimistööd Tallinna ärihoones"
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
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text="Plaatimistööde hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub plaaditüübist, pinna suurusest, keerukusest ja ettevalmistustest.
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
                  Materjalid arvestatakse eraldi. Kliendi soovi järgi pakume ka materjalide hankimise teenust.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi plaatimistööde pakkumist
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
          title="Kuidas SPS plaatimistööde teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Mõõdistus", "Hindame pinna ja materjali."],
            ["Ettevalmistus", "Teeme aluspinna valmis."],
            ["Paigaldus", "Paigaldame plaadid plaani järgi."],
            ["Vuukimine", "Viimistleme vuugid ja nurgad."],
            ["Üleandmine", "Kontrollime tulemuse ja koristame tööala."],
          ]}
        />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Küsige plaatimistööde pakkumist"
            description="Tuleme hindama, mõõdame ära ja teeme pakkumise."
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
