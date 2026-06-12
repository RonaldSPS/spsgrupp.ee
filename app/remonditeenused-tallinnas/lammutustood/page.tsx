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
    q: "Kui kiiresti saab alustada lammutustöödega?",
    a: "Tavaliselt 3-7 tööpäeva pärast pakkumise kinnitamist ja lepingu sõlmimist. Kiireloomuliste projektide puhul võimalik ka kiiremini.",
  },
  {
    q: "Kas tegelete ka jäätmete äraveoga?",
    a: "Jah, see on meie lammutustööde loomulik osa. Sorteerime kohapeal, korraldame transporti ja haldame dokumentatsiooni.",
  },
  {
    q: "Kuidas kaitsete ümberkaudseid ruume lammutustolmu eest?",
    a: "Kasutame tolmukatteid, tihendame uste avad, niisutame lammutatavaid pindu ja kasutame tolmuimejaid. Suuremate tööde puhul kasutame ka õhupuhasteid.",
  },
  {
    q: "Kas saate lammutada ainult osa ruumist?",
    a: "Jah. Enamik meie lammutustöid on tegelikult osaline demontaaž, näiteks vaheseinte eemaldamine või sanitaarruumi sisemuse lammutus. Hindame täpselt, mis tuleb eemaldada.",
  },
  {
    q: "Kas saate käsitseda ka ohtlikke jäätmeid nagu asbest?",
    a: "Asbestitöö on spetsialiseeritud valdkond, millele on vajalik eriluba. Kui leiame asbesti olemasolevast konstruktsioonist, koordineerime vastava sertifikaadiga partneriga.",
  },
];

const serviceItems = [
  { bold: "Sisedemontaaž", desc: "Kontorite ja äripindade lammutus." },
  { bold: "Vaheseinade eemaldamine", desc: "Kipsplaat, tellised ja betoon." },
  { bold: "Vanade viimistluste eemaldamine", desc: "Seinad, laed ja põrandad." },
  { bold: "Põrandakatete eemaldamine", desc: "Vanad plaadid, parkett ja laminaat." },
  { bold: "Sanitaartehnika ja köögiseadmete demontaaž", desc: "Eemaldus enne remonti või ümberehitust." },
  { bold: "Lagede ja ripplagede eemaldamine", desc: "Kontrollitud demontaaž koos prahi kogumisega." },
  { bold: "Tolmutõrje ja müratõkestamine", desc: "Kõrvalolevate ruumide kaitsmine tööde ajal." },
  { bold: "Jäätmete sorteerimine kohapeal", desc: "Metall, betoon, puit, kips ja muud ehitusjäätmed." },
  { bold: "Jäätmete seaduslik äravedu", desc: "Korraldatud transport koos dokumentatsiooniga." },
  { bold: "Ohtlike jäätmete käitlus", desc: "Koordineerime sertifitseeritud partneriga, kui see on vajalik." },
];

const benefits = [
  {
    title: "Läbimõeldud lammutustööd",
    desc: "Planeerime tööd vastavalt hoone eripärale, tehnosüsteemidele ja kasutuses olevatele ruumidele. Vajadusel säilitame töötavad süsteemid ja kaitseme kõrvalolevad alad kahjustuste eest.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Kontrollitud tööprotsess",
    desc: "Piirame tolmu, müra ja ehitusprahi levikut, et vähendada häiringuid hoones töötavatele inimestele ja kõrvalolevatele äripindadele.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M6 21V9l6-4 6 4v12" />
        <path d="M9 14h6" />
      </svg>
    ),
  },
  {
    title: "Korraldatud jäätmekäitlus",
    desc: "Sorteerime ehitusjäätmed objektil ning korraldame nende nõuetekohase äraveo ja käitluse vastavalt kehtivatele nõuetele.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M7 21h10" />
        <path d="M5 7h14" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M18 7l-1 14H7L6 7" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  {
    title: "Ohutus ja selge töökorraldus",
    desc: "Töötame vastavalt ohutusnõuetele, viime läbi vajalikud ettevalmistused ning tagame dokumenteeritud ja kontrollitud tööprotsessi kogu objekti vältel.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const prices = [
  "Kerge sisedemontaaž (kipsplaat, viimistlus): alates 15€/m²",
  "Tellisseinte lammutus: alates 30€/m²",
  "Vanade põrandakatete eemaldamine: alates 8€/m²",
  "Sanitaartehnika demontaaž: alates 200€",
  "Jäätmekäitlus: vastavalt mahule ja tüübile",
];

export default function LammutustoodLeht() {
  return (
    <>
      <SeoJsonLd
        serviceName="Lammutustööd Tallinnas"
        serviceDescription="Lammutustööd ja konstruktsioonide demonteerimine Tallinnas. Sise- ja välislammutus."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/lammutustood"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Lammutustööd", item: "https://spsgrupp.ee/remonditeenused-tallinnas/lammutustood" }]}
        faq={faqItems.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Lammutustööd"
          style={{ background: "url('/lammutustood-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {[
              { value: "Kontrollitud", label: "lammutus" },
              { value: "Jäätmed", label: "käideldud" },
              { value: "Kiire", label: "teostus" },
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
                Lammutustööd Tallinnas
                <br />
                <span className="text-[#3abeff]">ärihoonetele</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Vaheseinte lammutus, vana viimistluste eemaldamine. Kontrollitud töö, jäätmete sorteerimine ja seaduslik äravedu ühest kohast.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi lammutustööde pakkumist
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
                <span className="text-white/90">Lammutustööd</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Lammutustöö on midagi enamat kui lihtsalt haamriga löömine" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Ärihoone lammutustöö peab olema täpselt planeeritud ja kontrollitud protsess. Enne tööde algust tuleb hinnata olemasolevaid tehnosüsteeme, kandvaid konstruktsioone ja ohutusnõudeid, et vältida katkestusi hoone igapäevases töös. Kontorites, kaubanduspindadel ja tootmishoonetes on oluline piirata tolmu, müra ja vibratsiooni ning tagada, et kõrvalolevad ruumid saaksid samal ajal tavapäraselt toimida.</p>
                  <p className="mt-4">Lammutustööde käigus tekivad erinevad jäätmed: metall, betoon, puit, kips, elektrimaterjalid ja muud ehitusjäätmed, mis tuleb korrektselt sorteerida ja nõuetekohaselt käidelda. Samuti vajavad erilist tähelepanu vanad tehnosüsteemid, ventilatsioonilahendused ning võimalikud ohtlikud materjalid.</p>
                </div>
                <div>
                  <p>SPS Grupp teostab ärikinnisvara lammutustöid süsteemselt ja ohutult. Korraldame tööde planeerimise, objekti kaitse, tolmutõrje, jäätmete käitluse ning tööde läbiviimise nii, et mõju hoone igapäevasele kasutusele oleks võimalikult väike.</p>
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
                <TwoToneHeading text="Milliseid lammutustöid me teostame?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((item, i) => (
                  <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">{String(i + 1).padStart(2, "0")}.</span>
                    </div>
                    <div className="text-[#2f353f] text-[15px] leading-[1.6]">
                      <strong className="text-[#17345a] block mb-1">{item.bold}</strong>
                      <span className="text-[#5a6474]">{item.desc}</span>
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
                <TwoToneHeading text="Miks valida SPS Grupp lammutustöödeks?" />
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
                    src="/lammutustood-2.webp"
                    alt="SPS Grupp lammutustööd Tallinna ärihoones"
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
                <TwoToneHeading text="Lammutustööde hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-6 font-light">
                  Hind sõltub lammutustöö mahust, keerukusest ja jäätmete käitluskuludest.
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
                  Kompleksne projekt, kus lammutus, jäätmed ja koristus tellitakse ühest kohast, tuleb alati soodsam kui eraldi tellimine.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi lammutustööde pakkumist
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
            title="Tellige lammutustööde pakkumine"
            description="Tuleme kohale, hindame objekti ja pakume lahenduse. Lammutus, jäätmed ja koristus ühest kohast."
          />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="bg-white pb-[40px]">
            <div className="max-w-[1280px] mx-auto px-[5%] flex flex-wrap justify-center gap-3">
              <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                Küsi pakkumist
              </a>
              <Link href="tel:6623328" className="btn-outline text-[15px] py-2.5 px-4">
                662 3328
              </Link>
              <Link href="mailto:info@spsgrupp.ee" className="btn-outline text-[15px] py-2.5 px-4">
                info@spsgrupp.ee
              </Link>
            </div>
          </section>
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
