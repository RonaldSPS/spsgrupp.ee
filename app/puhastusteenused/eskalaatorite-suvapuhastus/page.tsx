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
import Tooprotsess from "../../components/Tooprotsess";

const customFAQ = [
  {
    q: "Kui kaua võtab eskalaatori süvapuhastus aega?",
    a: "Keskmiselt 2–4 tundi seadme kohta, sõltuvalt suurusest ja määrdumisastmest. Kaubanduskeskustes, kus on mitu eskalaatorit, planeerime töö ühele ööle.",
  },
  {
    q: "Kas puhastus segab äritegevust?",
    a: "Ei. Töötame siis, kui kaubanduskeskus on suletud — öösel või enne avamist. Hommikul on eskalaator jälle töökorras.",
  },
  {
    q: "Kui sageli peaks eskalaatorit süvapuhastama?",
    a: "Keskmiselt 2–4 korda aastas, sõltuvalt kasutussagedusest ja asukohast. Suure liiklusega kaubanduskeskustes sagedamini.",
  },
  {
    q: "Kas puhastusvahendid on ohutud seadmetele?",
    a: "Jah, kasutame ainult sertifitseeritud vahendeid, mis on ohutud nii mehhanismidele kui inimestele. Eskalaatorile mitte kunagi survepesu.",
  },
  {
    q: "Kas regulaarne süvapuhastus aitab vähendada kulumist?",
    a: "Jah, selgelt. Regulaarne süvapuhastus vähendab mustusest tingitud kulumist ja pikendab eskalaatorite eluiga aastate võrra. Säästab suuri remondikulusid.",
  },
];

export default function EskalaatoriteSuvapuhastus() {
  return (
    <>
      <SeoJsonLd
        serviceName="Eskalaatorite süvapuhastus Tallinnas"
        serviceDescription="Eskalaatorite ja liikuvate treppide professionaalne süvapuhastus Tallinnas."
        serviceUrl="https://spsgrupp.ee/puhastusteenused/eskalaatorite-suvapuhastus"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Puhastusteenused", item: "https://spsgrupp.ee/puhastusteenused" }, { position: 3, name: "Eskalaatorite süvapuhastus", item: "https://spsgrupp.ee/puhastusteenused/eskalaatorite-suvapuhastus" }]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Eskalaatorite süvapuhastus"
          style={{ background: "url('/eskalaatorite-suvapuhastus-1.jpg') center/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Eriväljaõppega</div>
                <div className="text-[15px] text-[#1f2937]">meeskond</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-green w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Öine</div>
                <div className="text-[15px] text-[#1f2937]">töö</div>
              </div>
            </div>
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-navy w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Sertifitseeritud</div>
                <div className="text-[15px] text-[#1f2937]">vahendid</div>
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
                Eskalaatorite süvapuhastus<br />
                <span className="text-[#3abeff]">ja hooldus</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Pikendab eskalaatori eluiga ja vähendab ootamatute rikete riski. Spetsiaalne tehnika ja eriväljaõppega meeskond. Töötame siis, kui seade seisab.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi eskalaatori hoolduse pakkumist
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
                <a href="/puhastusteenused" className="text-white/80 no-underline hover:text-white transition-colors">Puhastusteenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Eskalaatorite süvapuhastus</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Eskalaatori hooldamata jätmine on kallis otsus" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Eskalaatorite hooldamata jätmine on kui autoga sõitmine ilma õlivahetuseta — varem või hiljem tekivad kulukad probleemid. Kaubanduskeskustes määrduvad eskalaatorid kiiresti: inimeste jäljed, õli, tolm ja pudenenud toidu jäägid kogunevad raskesti ligipääsetavatesse kohtadesse.</p>
                  <p className="mt-4">Eskalaatorite puhastamine on märgatavalt keerulisem kui tavaline põrandapesu. Seal on palju detaile, kuhu koguneb mustus ja hakkab seadet lõhkuma.</p>
                </div>
                <div>
                  <p>Regulaarne süvapuhastus pikendab eskalaatorite eluiga oluliselt ja vähendab ootamatuid rikkeid. See on investeering, mis tasub end ära nii töökindluse kui ka kaubanduskeskuse maine mõttes.</p>
                  <p className="mt-4">SPS Grupp teostab eskalaatorite süvapuhastust spetsiaalse tehnika ja eriväljaõppega meeskonnaga, kes teab, kuidas seadmeid õigesti käsitleda.</p>
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
                <TwoToneHeading text="Mida sisaldab eskalaatori süvapuhastus?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Kogu eskalaatori astmete küljepindade puhastus", desc: "" },
                  { bold: "Käsipuude sügavpuhastus ja desinfitseerimine", desc: "" },
                  { bold: "Rööbaste ja hammasrataste ümbruse puhastus", desc: "" },
                  { bold: "Rasva, õli ja tolmu eemaldamine", desc: "spetsiaalsete vahenditega" },
                  { bold: "Eskalaatori aluste ja külgede puhastus", desc: "" },
                  { bold: "Lõppkontroll ja puhta tööseisundi tagamine", desc: "" },
                  { bold: "Öine või varahommikune töö", desc: "seade kasutatav avamisel" },
                  { bold: "Regulaarne hoolduslepingul põhinev teenindus", desc: "" },
                ].map((item, i) => (
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
                <TwoToneHeading text="Miks valida SPS Grupp eskalaatori hooldusele?" />
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Eriväljaõppega meeskond</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Eskalaatorite puhastamine nõuab spetsiaalset koolitust. Meie tehnikud teavad, kuidas seadet käsitleda ohutult ja kuidas mitte kahjustada mehhanisme.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Öine töö</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Teeme tööd siis, kui kaubanduskeskus on suletud. Hommikul on eskalaator jälle valmis kasutamiseks. Ei mingit äritegevuse häirimist.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Õiged vahendid</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kasutame puhastusvahendeid, mis eemaldavad rasva ja õli tõhusalt, aga ei kahjusta mehhanisme.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Kaubanduskeskuste kogemus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Oleme puhastanud Tallinna kaubanduskeskusi aastaid. Teame, mida kliendid märkavad ja kuidas eskalaatori välimus mõjutab kaubanduskeskuse muljet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/eskalaatorite-suvapuhastus-2.jpg"
                    alt="SPS Grupp eskalaatorite süvapuhastus"
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
                <TwoToneHeading text="Kuidas kujuneb eskalaatori hoolduse hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Hind sõltub eskalaatorite arvust, suurusest, mustuse astmest ja tööde sagedusest.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { size: "Üksiku eskalaatori", area: "süvapuhastus", price: "250€", period: "alates", highlight: true },
                      { size: "Mitmiksüvapuhastus", area: "3+ eskalaatorit", price: "soodushind", period: "eripakkumine" },
                      { size: "Regulaarne hooldus", area: "2–4x aastas", price: "eelishind", period: "hoolduskava" },
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
                    Süvapuhastus võtab keskmiselt 2–4 tundi seadme kohta. Soovitame hooldust 2–4 korda aastas sõltuvalt kasutussagedusest.
                  </p>
                </div>

                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS eskalaatorite süvapuhastuse teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Ajakava", "Lepime kokku sobiva tööaja."],
            ["Ettevalmistus", "Piirame tööala ja valmistame pinnad ette."],
            ["Puhastus", "Puhastame astmed, sooned ja külgpinnad."],
            ["Kuivatus", "Jälgime, et pind jääks kasutuskõlblik."],
            ["Üleandmine", "Kontrollime tulemuse objektijuhiga."],
          ]}
        />
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Küsi eskalaatorite hoolduse pakkumist"
            description="Helistage ja koostame teile hoolduskava. Tuleme objektile hindama ja teeme pakkumise."
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
