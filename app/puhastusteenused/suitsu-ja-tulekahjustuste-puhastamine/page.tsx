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

const customFAQ = [
  {
    q: "Kui kiiresti tuleb alustada puhastusprotsessiga?",
    a: "Esimese 24-48 tunni jooksul on kriitiline kutsuda professionaalne meeskond. Iga viivitatud tund voib suurendada loplikke kulusid kuni 25% ja raskendada taastamist.",
  },
  {
    q: "Kas kindlustus katab koik kulud?",
    a: "Professionaalne dokumentatsioon suurendab margatavalt huvitise saamise toenaosust. Teeme alati pohjaliku kahjustuste kirjelduse koos fotodega, mille saab kindlustusseltsile esitada.",
  },
  {
    q: "Kui ohtlikud on tulekahjujargsed mikroosakesed?",
    a: "Voivad pohjustada tosiseid hingamisteede probleeme, kui neid oigeaegselt ei eemaldata. Samuti suuivad nad materjalidesse ja on hiljem vaga raskesti eemaldatavad.",
  },
  {
    q: "Kas lohn jaab alles ka parast puhastust?",
    a: "Ei. Kasutame professionaalseid ohupuhastusseadmeid ja neutralisaatoreid, mis eemaldavad lohna molekulaarsel tasandil. Lohn ei tule tagasi.",
  },
  {
    q: "Kui kaua puhastusprotsess kestab?",
    a: "Keskmiselt 1-3 toopaeva soltuvalt kahjustuste ulatusest ja ruumi suurusest. Suuremate juhtumite puhul voib votta nadala voi rohkem.",
  },
];

export default function SuitsuJaTulekahjustustePuhastamine() {
  return (
    <>
      <SeoJsonLd
        serviceName="Suitsu- ja tulekahjustuste puhastamine Tallinnas"
        serviceDescription="Suitsu- ja tulekahjustuste professionaalne puhastamine Tallinnas 24/7. Tahm, lõhnad, jäägid."
        serviceUrl="https://spsgrupp.ee/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Puhastusteenused", item: "https://spsgrupp.ee/puhastusteenused" }, { position: 3, name: "Suitsu- ja tulekahjustuste puhastamine", item: "https://spsgrupp.ee/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine" }]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Suitsu- ja tulekahjustuste puhastamine"
          style={{ background: "url('/tulekahjustus1.jpg') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">24h</div>
                <div className="text-[15px] text-[#1f2937]">reageerimine</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kindlustus</div>
                <div className="text-[15px] text-[#1f2937]">koostoo</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-navy w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Eri-</div>
                <div className="text-[15px] text-[#1f2937]">varustus</div>
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
                Suitsu- ja tulekahjustuste<br />
                <span className="text-[#3abeff]">puhastamine</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Kiire taastamine ilma ariseisakuta. Eemaldame tahma, neutraliseerime lohna ja dokumenteerime kahjustused kindlustuse jaoks.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Kusi pakkumist
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
                <span className="text-white/90">Suitsu- ja tulekahjustuste puhastamine</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Parast tulekahju on igal tunnil hind" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Mida kauem tahm ja lohn ruumis pusivad, seda keerulisem ja kulukam on hilisem puhastustoo. Tahm soovitab pindu, lohn imbub materjalidesse, mikroosakesed tungivad ventilatsioonisusteemidesse. Iga viivitatud tund voib kulu suurendada.</p>
                  <p className="mt-4">Lisaks finantskahjule on tervislikud riskid: tahma mikroosakesed ja tulekahjust jaanud kemikaalid voivad pohjustada tosiseid terviseprobleeme, kui neid oigeaegselt ei eemaldata.</p>
                </div>
                <div>
                  <p>SPS Grupp reageerib suitsu- ja tulekahjustuste olukordades 24 tunni jooksul. Meie spetsialistid dokumenteerivad kahjustused kindlustuse jaoks, eemaldavad tahma, puhastavad ventilatsiooni ja neutraliseerivad lohna.</p>
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
                <TwoToneHeading text="Mida sisaldab tulekahjustuste taastamine?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Esmane hindamine ja kahjustuste dokumenteerimine kindlustuse jaoks", desc: "" },
                  { bold: "Turvalise juurdepaasu tagamine ja riskide kaardistamine", desc: "" },
                  { bold: "Tahma eemaldamine koikidelt pindadelt spetsiaalsete vahenditega", desc: "" },
                  { bold: "Porandate, seinte ja lagede pohjalik puhastus", desc: "" },
                  { bold: "Ventilatsioonisusteemide puhastus ja saasteallikate neutraliseerimine", desc: "" },
                  { bold: "Ohupuhastus ja lohna eemaldamine", desc: "" },
                  { bold: "Tekstiilide, vaipade ja pehme moobli puhastus", desc: "" },
                  { bold: "Desinfitseerimine ja sanitaartootlus", desc: "" },
                  { bold: "Koostoo kindlustusseltsidega kogu protsessi valtel", desc: "" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer"
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
                <TwoToneHeading text="Miks valida SPS Grupp kriisiolukorras?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">24h reageerimine</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Helistage ja oleme objektil 24 tunni jooksul. Kriitiline esimene oopaev maarab sageli taastamise edukuse ja kulude suuruse.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kindlustusega koostoo</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Dokumenteerime koik kahjustused pohjalikult — koos fotodega ja kahjustuste kirjeldusega. See suurendab oluliselt huvitise toenaosust.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Erivarustus ja -vahendid</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kuiv aurupuhastus (ule 170°C), elektrostaatilised pihustid, professionaalsed ohupuhastid, UV-C desinfitseerimine. Seadmed, mida tavalistel koristusfirmadel ei ole.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Lohna eemaldamine molekulaartasandil</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kasutame neutralisaatoreid, mis ei varja lohna, vaid havitavad selle molekulid. Lohn ei tule tagasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/tulekahjustus2.jpg"
                    alt="SPS Grupp suitsu- ja tulekahjustuste puhastamine"
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
                <TwoToneHeading text="Kuidas kujuneb tulekahjustuste puhastamise hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Iga tulekahjustuse olukord on unikaalne. Hind soltub kahjustuste ulatusest, pindalast, materjalidest ja vajalikest toodest.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { size: "Esmane hindamine", area: "tasuta (kindlustusjuhtumi puhul)", price: "Tasuta", period: "", highlight: true },
                      { size: "Vaikesed suitsukahjustused", area: "", price: "500€", period: "alates" },
                      { size: "Keskmised kahjustused", area: "tuba–korrus", price: "1500€", period: "alates" },
                      { size: "Suured kahjustused", area: "", price: "Individuaalne", period: "" },
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
                        {item.period && (
                          <div className={`text-[15px] mb-2 ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>
                            {item.period}
                          </div>
                        )}
                        <div className={`text-[15px] ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>
                          {item.area}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[15px] text-[#5a6474]">
                    Kuna teenus on sageli kindlustuse kaetud, aitame koostada ka dokumentatsiooni huvitise jaoks.
                  </p>
                  <p className="text-[15px] text-[#17345a] font-bold mt-4">
                    Helistage kohe: ☎ 662 3328
                  </p>
                </div>

                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Lopu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Vajate kiiret abi suitsu- voi tulekahjustusega?"
            description="Helistage oopaevaringselt 662 3328 voi kirjutage info@spsgrupp.ee. Oleme objektil 24 tunni jooksul."
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
