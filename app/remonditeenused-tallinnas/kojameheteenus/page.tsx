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

const faqItems = [
  {
    q: "Mida kõike kojamehe teenus hõlmab?",
    a: "Kojamehe teenus võib hõlmata territooriumi koristust, prügikastide tühjendust, muru niitmist, lehtede koristust, lumekoristust ja väiksemaid remonditöid. Sõltuvalt teie vajadustest koostame sobiva teenusepaketi.",
  },
  {
    q: "Kui tihti kojamees teie objektil käib?",
    a: "Sagedus sõltub kokkuleppest — alates ühest korrast nädalas kuni iga päev. Enamikul klientidest on regulaarne kord nädalas või kaks korda nädalas.",
  },
  {
    q: "Kas kojamees tegeleb ka lumekoristusega talvel?",
    a: "Jah. Kojamehe teenus hõlmab tavaliselt ka talvist hooldust: lumekoristus, liivakastide täitmine ja libeduse tõrje. See on loomulik osa aastaringist tööst.",
  },
  {
    q: "Kas kojamees saab teha väiksemaid remonditöid?",
    a: "Jah, kojamees tegeleb igapäevaste väiksemate remonditöödega nagu uste reguleerimine, lukkude vahetus, lambipirnide vahetus, riiulite paigaldus jms. Suuremad remonditööd koordineerime meie meeskonnaga.",
  },
  {
    q: "Kas kojamehe teenusega kaasneb kindlustus?",
    a: "Jah, kõik SPS Grupi töötajad on kindlustatud. Teie objektile ja varale tekitatud kahju hüvitatakse.",
  },
];

const serviceItems = [
  "Territooriumi igapäevane koristus ja hooldus",
  "Prügikastide tühjendus ja hooldus",
  "Muru niitmine ja haljastuse hooldus",
  "Lehtede koristus ja äravedu",
  "Lumekoristus ja libeduse tõrje",
  "Kõnniteede ja parklate puhastus",
  "Väiksemad remonditööd ja korrashoid",
  "Hoone sissepääsude ja üldalade koristus",
  "Järelevalve ja raporteerimine",
  "Aastaringne hooldusleping",
];

const benefits = [
  {
    title: "Üks kontaktisik kogu hoolduseks",
    desc: "Kojamees on teie igapäevane kontakt, kes tunneb objekti ja teie vajadusi. Ei ole vaja iga probleemiga eraldi firmat otsida.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Paindlik teenusepakett",
    desc: "Teie vajadustest lähtuvalt koostame sobiva paketi. Kojamees võib käia üks kord nädalas või iga päev — vastavalt vajadusele.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Regulaarne ja usaldusväärne",
    desc: "Teame, et usaldusväärsus on kojamehe puhul kõige olulisem. Tuleme alati kokkulepitud ajal ja teeme tööd korralikult.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Aastaringne teenus",
    desc: "Suvel niidame muru, sügisel koristame lehti, talvel tegeleme lumega. Kojamees hoolitseb teie territooriumi eest aasta läbi.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Põhipakett (1 kord nädalas): alates 300€/kuu",
  "Standardpakett (2 korda nädalas): alates 500€/kuu",
  "Täispakett (iga päev): alates 800€/kuu",
  "Väiksemad remonditööd: alates 30€/tund",
  "Lumekoristus ja libeduse tõrje: talvehooaja lisatasu alates 200€/kuu",
];

export default function KojameheteenusLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Kojamehe teenus Tallinnas"
        serviceDescription="Kojamehe teenus ärikinnisvarale Tallinnas. Igapäevane korrashoid, hooajalised tööd."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/kojameheteenus"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Kojamehe teenus", item: "https://spsgrupp.ee/remonditeenused-tallinnas/kojameheteenus" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Kojamehe teenus Tallinnas"
          style={{ background: "url('/kojameheteenus-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Aastaringne", label: "hooldus" },
              { value: "Üks kontakt", label: "kogu hoolduseks" },
              { value: "Usaldusväärne", label: "partner" },
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
                Kojamehe teenus
                <br />
                <span className="text-[#3abeff]">Tallinna ärihoonetele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Aastaringne kojamehe teenus ärikinnisvarale. Territooriumi hooldus, koristus ja väiksemad remonditööd ühest kohast.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi kojamehe teenuse pakkumist
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
                <span className="text-white/90">Kojamehe teenus</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Teie ärihoone väärib igapäevast hoolt" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Ärihoone igapäevane hooldus on midagi enamat kui lihtsalt koristus. See on teie kinnisvara väärtuse hoidmine ja töötajatele ning klientidele meeldiva keskkonna loomine. Kui hoone ümbrus on korras, märkavad seda kõik.</p>
                  <p className="mt-4">Probleem on selles, et igapäevaseid hooldustöid on palju ja need vajavad järjepidevust. Ühel nädalal on vaja niita muru, teisel koristada lehti, kolmandal parandada ust. Iga töö jaoks eraldi tegija otsimine on aja- ja rahakulu.</p>
                </div>
                <div>
                  <p>SPS Grupi kojamehe teenus pakub lahendust. Üks inimene hoolitseb teie hoone ja territooriumi eest aasta ringi. Suvel niidab muru, sügisel koristab lehti, talvel tegeleb lumega ja hoiab silma peal kogu objektil.</p>
                  <p className="mt-4">Kojamees on teie igapäevane kontakt, kes tunneb objekti ja teie vajadusi. Väiksemad remonditööd saab ta teha kohe, suuremad koordineerib meie meeskonnaga. Üks leping, üks arve, üks vastutus.</p>
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
                <TwoToneHeading text="Mida kojamehe teenus hõlmab?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
                  <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">{String(i + 1).padStart(2, "0")}.</span>
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
                <TwoToneHeading text="Miks valida SPS Gruppi kojameheks?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {benefits.map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
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
                    src="/kojameheteenus_2.jpg"
                    alt="SPS Grupp kojamehe teenus Tallinna ärihoones"
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
                <TwoToneHeading text="Kojamehe teenuse hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub teenuse mahust, külastuste sagedusest ja objekti suurusest.
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
                  Koostame teie vajadustele vastava paketi ja kinnishinnaga lepingu.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi kojamehe teenuse pakkumist
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
          title="Kuidas SPS kojamehe teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Objekti ülevaatus", "Kaardistame väliala ja sissepääsud."],
            ["Graafik", "Lepime kokku sageduse ja hooajatööd."],
            ["Teostus", "Hooldame kinnistut kokkulepitud rütmis."],
            ["Lisatööd", "Korraldame vajadusel lehed, lumi või pesu."],
            ["Kontroll", "Anname tagasisidet probleemidest."],
          ]}
        />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Teie ärihoone väärib igapäevast hoolt"
            description="Telli kojamehe teenus ja unusta muretsemine. Üks kontakt, üks arve, üks vastutus."
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
