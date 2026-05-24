"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import FAQ from "../components/FAQ";
import FooterCTA from "../components/FooterCTA";
import ContactForm from "../components/ContactForm";
import TwoToneHeading from "../components/TwoToneHeading";
import ScrollAnimation from "../components/ScrollAnimation";
import Hinnakalkulaator from "../components/Hinnakalkulaator";

const customFaqItems = [
  {
    q: "Kui sageli peaks äripindu koristama?",
    a: "Enamikule kontoritele soovitame 3–5 korda nädalas. Kaubanduspinnad vajavad päevakoristust, tootmishooned sõltuvad tootmisprotsessist. Avalikud alad ja sanitaarruumid vajavad igapäevast hooldust. Täpne graafik koostatakse tasuta konsultatsiooni käigus.",
  },
  {
    q: "Kui kiiresti saab regulaarse koristusteenusega alustada?",
    a: "Tavaliselt 3–5 tööpäeva jooksul pärast lepingu sõlmimist. Kiireloomuliste tellimuste puhul saame alustada ka kiiremini. Ürituste järgne operatiivne koristus on võimalik sageli isegi samal päeval.",
  },
  {
    q: "Kas koristusteenus toimub tööajal või väljaspool seda?",
    a: "Enamik ettevõtteid eelistab koristust töövälisel ajal — kas varahommikul enne 8:00 või õhtuti peale 18:00. Kohandame graafiku teie tööajaga, et koristus ei segaks igapäevatööd. Kaubanduspindadel teeme ka päevakoristust madala liiklusega aegadel.",
  },
  {
    q: "Mis juhtub, kui koristuskvaliteet ei vasta ootustele?",
    a: "Iga objekti juures on objektijuht, kes vastutab kvaliteedi eest. Kui midagi ei vasta standardile, reageerime 24h jooksul ja parandame olukorra. Teenused on kindlustatud — võimalikud kahjud hüvitatakse.",
  },
  {
    q: "Kas kasutate keskkonnasõbralikke puhastusvahendeid?",
    a: "Jah, kasutame ainult ökomärgisega sertifitseeritud tooteid, mis on ohutud inimestele, elektroonikaseadmetele ja keskkonnale. Järgime ISO 14001 keskkonnajuhtimissüsteemi nõudeid.",
  },
];

export default function Koristusteenus() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Koristusteenus"
          style={{ background: "url('/Koristusteenused-HERO.jpg') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute bottom-[120px] right-[5%] flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Üle miljoni m²</div>
                <div className="text-[15px] text-[#1f2937]">igakuiselt</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">ISO 9001 & 14001</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">200+ koolitatud</div>
                <div className="text-[15px] text-[#1f2937]">töötajat</div>
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
                Regulaarne koristusteenus äripindadele<br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Kontorite, kaubanduspindade ja tootmishoonete igapäevane hooldus. Paindlik graafik, koolitatud personal ja kvaliteedikontrol. Hind alates <strong className="text-white font-medium">1.2€/m²</strong>.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi tasuta koristusteenuse pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
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
                <a href="/#teenused" className="text-white/80 no-underline hover:text-white transition-colors">Koristusteenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Koristusteenus</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text="Kas teie praegune koristaja hoolib päriselt teie ärist?" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>Üks probleem, mida kuuleme päris tihti: &quot;Koristaja küll käib, aga midagi on ikkagi valesti.&quot; Tolm koguneb kappide peale. Prügikastid on õhtul täis. WC-s lõppevad tarvikud. Serveriruumi ei puudutata, sest keegi ei julge.</strong>
              </div>
              <div>
                <strong>Äripindade koristus ei ole sirgjooneline kiirteenus. See on süsteem, mis peab sobima teie hoone, tööajate ja äri eripäraga.</strong> Kontoris on kaableid ja tehnikat, mida ei tohi märjalt käsitleda. Kaubanduspinnal on kõrge liiklus ja kliendid peavad alati puhast ruumi nägema. Tootmishoonetes on õlid, rasvad ja ranged ohutusnõuded.
                <br /><br />
                <strong>SPS Grupp on 20+ aastat ehitanud just sellist süsteemi,</strong> mis suudaks toime tulla kõikvõimalike olukordadega. Me teame, mida iga äripinna tüüp vajab ja mida kunagi teha ei tohi.
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
              <TwoToneHeading text="Millistele äripindadele SPS Grupp koristusteenust pakub?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { bold: "Kontorikoristus", desc: "büroode igapäevane hooldus, kohandatud IT-keskkonnale" },
                { bold: "Kaubanduspindade koristus", desc: "poed, kaubanduskeskused, esindused" },
                { bold: "Tootmishoonete koristus", desc: "tööstuspinnad, laod, tootmiskeskkond" },
                { bold: "Koolide ja lasteaedade koristamine", desc: "tervishoiukeskne lähenemine" },
                { bold: "Esindus- ja vastuvõtupindade erihooldus", desc: "" },
                { bold: "Ühiskasutatavate alade hooldus", desc: "koridorid, trepikojad, liftid" },
                { bold: "Sanitaarruumide desinfitseerimine", desc: "tarvikutega varustamine" },
                { bold: "Paindlik graafik", desc: "iga päev, 2–5x nädalas või soovitud sagedusega" },
              ].map((item, i) => (
                <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer">
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
              <TwoToneHeading text="Mis eristab SPS Grupi koristusteenust turul?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Digitaalne kvaliteedikontroll</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Igal objektil on oma objektijuht, kes kontrollib kvaliteeti ja esitab kliendile raportid. Probleemid lahendatakse enne kui te neid märkate.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Taustakontrollitud personal</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Iga töötaja läbib taustakontrolli ja allkirjastab konfidentsiaalsuslepingu. Teie vara ja dokumentatsioon on turvalistes kätes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer">
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">ISO 14001 keskkonnajuhtimine</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Kasutame ainult ökomärgisega puhastusvahendeid. Säästlikud meetodid, mis ei kahjusta teie tehnikat ega keskkonda.
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
                      <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Paindlikkus ja kiire reageerimine</h3>
                      <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                        Ürituste järgne koristus, hädaolukorrad, muutuv graafik — kohandame end teie äri tempoga, mitte vastupidi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/Koristusteenus2.jpg"
                  alt="SPS Grupp koristusteenus"
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
              <TwoToneHeading text="Kuidas kujuneb koristusteenuse hind?" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Koristusteenuse hind sõltub neljast tegurist: pindala (€/m²), koristuse sagedus (2–5x nädalas), eritööde vajadus ja objekti tüüp.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { size: "Väike kontor", area: "100–200m²", price: "250€", period: "kuu", highlight: true },
                    { size: "Keskmine kontor", area: "200–500m²", price: "450€", period: "kuu" },
                    { size: "Suur pind", area: "500m²+", price: "Individuaalne", period: "pakkumine" },
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
                  Regulaarne hoolduskoristus algab <strong>1.2€/m²</strong>, suurpuhastus <strong>1.5€/m²</strong>
                </p>
              </div>

              <Hinnakalkulaator />
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title="Tellige tasuta koristusteenuse analüüs"
          description="Tuleme kohale, vaatame üle teie äripinna ja koostame personaalse koristusplaani koos hinnaga. Saate vastuse 24 tunni jooksul. Pindade üle vaatamine on tasuta ja ei kohusta millekski."
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
