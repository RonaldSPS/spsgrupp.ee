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

const faqItems = [
  {
    q: "Kui kaua võtab kontori seinte värvimine aega?",
    a: "Väikse kontori (50-100 m²) värvimine võtab tavaliselt 2-3 tööpäeva: pahteldus, krunt ja 2 kihti värvi. Suurema pinna puhul proportsionaalselt kauem. Tähtaeg sõltub ka kuivamise ajast.",
  },
  {
    q: "Kas saate teha tööd öösel või nädalavahetusel?",
    a: "Jah, kui teie äritegevus nõuab seda. Öised ja nädalavahetuse tööd võivad olla pisut kallimad, aga väldivad katkestusi teie töös.",
  },
  {
    q: "Milliseid materjale kasutate?",
    a: "Kasutame professionaalseid vesilahustuvaid värve nagu Tikkurila, Sadolin ja Caparol, samuti kvaliteetseid pahtleid ja krunte. Kliendi soovi järgi kasutame ka ökomärgisega tooteid.",
  },
  {
    q: "Kas värvimise ajal saab kontoris töötada?",
    a: "Osaliselt jah. Saame töötada tsooni kaupa ning kaitseme tehnikat ja mööblit. Vesilahustuvad värvid ei eralda tugevaid ebameeldivaid lõhnu. Suuremate värvimistööde puhul on siiski efektiivsem planeerida ruum mõneks ajaks tühjaks.",
  },
  {
    q: "Kas annate garantii?",
    a: "Jah. Siseviimistlustöödele anname 2 aastat garantiid. Materjalidele kehtib tootja garantii.",
  },
];

const serviceItems = [
  "Seinte pahteldamine ja tasandamine",
  "Värvimistööd",
  "Lagede viimistlus ja värvimine",
  "Põrandakatete paigaldus (laminaat, vinüül, parkett)",
  "Liistude paigaldus ja värvimine",
  "Tapeetimine",
  "Kips konstruktsioonide ehitus",
  "Plaatimiseelne tasandus",
  "Väiksemad kipsi- ja krohvitööd",
];

const benefits = [
  {
    title: "Kiire töö ilma kvaliteeti kaotamata",
    desc: "Meie meeskond tunneb ärikinnisvara tempot. Teeme tööd efektiivselt, kuid hoolikalt.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Puhas töökoht",
    desc: "Kaitseme teie mööblit ja tehnikat, katame põrandad, töö lõppedes koristame ning anname objekti üle puhtana. Te ei pea muretsema tolmu pärast.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M6 21V9l6-4 6 4v12" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    title: "Kvaliteetsed materjalid",
    desc: "Kasutame värve ja materjale, mis kestavad. Me ei säästa materjalidelt, sest parimad materjalid aitavad saavutada parima tulemuse.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M19 11H5a2 2 0 0 1 0-4h14a2 2 0 0 1 0 4Z" />
        <path d="M7 11v5a2 2 0 0 0 2 2h1" />
        <path d="M14 11v9" />
        <path d="M12 20h4" />
      </svg>
    ),
  },
  {
    title: "Projektijuhtimine",
    desc: "Üks ajakava, üks kontaktisik. Teie projekt on meie käes algusest lõpuni.",
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
  "Seinte värvimine (2 kihti): alates 5€/m²",
  "Pahteldus + värvimine: alates 10€/m²",
  "Lae värvimine: alates 6€/m²",
  "Laminaadi paigaldus: alates 10€/m²",
  "Tapeetimine: alates 8€/m² + materjalid",
];

export default function SiseviimistlustoodLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Siseviimistlustööd Tallinnas"
        serviceDescription="Siseviimistlustööd ärikinnisvarale Tallinnas. Värvimine, tapeetimine, pahteldamine, lae- ja põrandaviimistlus."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/siseviimistlustood"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Siseviimistlustööd", item: "https://spsgrupp.ee/remonditeenused-tallinnas/siseviimistlustood" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Siseviimistlustööd"
          style={{ background: "url('/siseviimistlus-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Kiire", label: "töö" },
              { value: "2 aastat", label: "garantii" },
              { value: "Puhas", label: "töökoht" },
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
                Siseviimistlustööd
                <br />
                <span className="text-[#3abeff]">Tallinna ärihoonetele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Pahteldus, värvimine, seinte ja lagede viimistlus, põrandakatete paigaldus. Kiire ja kvaliteetne tulemus, mis jätab kontorist hea mulje.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi siseviimistluse pakkumist
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
                <a href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Siseviimistlustööd</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Kulunud kontor mõjutab teie äri rohkem kui arvate" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Vanad seinad, koorunud värv ja kulunud põrandad ei ole lihtsalt esteetiline probleem. Need saadavad klientidele ja tulevastele töötajatele sõnumi: &quot;See ettevõte ei hooli detailidest.&quot; Töökeskkonna välimus mõjutab otseselt tööviljakust, töötajate rahulolu ja klientide usaldust.</p>
                  <p className="mt-4">Kulunud viimistlus hakkab mõjutama alusmaterjale, niiskus tungib sisse ja kahjustused laienevad. Seda, mida saaks täna lahendada mõnesaja euroga, võib hiljem maksta tuhandeid.</p>
                </div>
                <div>
                  <p>SPS Grupi siseviimistluse meeskond teeb tööd kiiresti ja puhtalt. Planeerime nii, et teie äritegevus ei katkeks.</p>
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
                <TwoToneHeading text="Milliseid siseviimistlustöid teostame?" />
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
                <TwoToneHeading text="Miks valida SPS Grupp siseviimistluseks?" />
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
                    src="/siseviimistlus-2.webp"
                    alt="SPS Grupp siseviimistlustööd Tallinna ärihoones"
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
                <TwoToneHeading text="Siseviimistluse hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub pinnast, tööde mahust, materjalidest ja ettevalmistustest.
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
                  Suuremate tööde puhul anname alati projektipõhise pakkumise koos kinnishinnaga.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi siseviimistluse pakkumist
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
          <FooterCTA
            title="Tellige tasuta siseviimistluse hindamine"
            description="Tuleme kohale, vaatame olukorra üle, pakume lahendused ja hinna. Kohustuseta ja tasuta."
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
