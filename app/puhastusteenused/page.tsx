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
import SeoJsonLd from "../components/SeoJsonLd";

const customFAQ = [
  {
    q: "Kui kiiresti saate puhastusteenusega alustada?",
    a: "Hädaolukordades (veeavarii, tulekahju, viiruspuhang) oleme kohal 30 minuti jooksul. Plaaniliste tööde puhul alustame 1–3 tööpäeva jooksul peale kohapealset hindamist.",
  },
  {
    q: "Kuidas tellida puhastusteenust Tallinnas ja Harjumaal?",
    a: "Helistage 662 3328 või täitke kontaktvorm. Meie spetsialist tuleb objektile, hindab vajadusi ja koostab personaalse pakkumise. Hindamine on tasuta ja kohustuseta.",
  },
  {
    q: "Kas kasutate ohutuid puhastusvahendeid?",
    a: "Jah, kasutame ökomärgisega sertifitseeritud tooteid. Eritööde puhul valime vahendi pinna järgi, et vältida kahjustusi. Kõik vahendid vastavad EL standarditele.",
  },
  {
    q: "Kas pakute tulemustele garantiid?",
    a: "Jah. Kui tulemus ei vasta kokkulepitud standardile, tuleme tagasi ja teeme töö ümber tasuta. Teenused on ka kindlustatud võimalike kahjude vastu.",
  },
  {
    q: "Kas saate tulla ka nädalavahetusel või öösel?",
    a: "Jah. Paljud puhastusteenused (süvapuhastus, vaipade pesu, eskalaatorite hooldus) toimuvad õhtusel ajal või nädalavahetusel, et mitte segada teie äritegevust.",
  },
];

const miksMeieKaardid = [
  {
    title: "Spetsiaalne tehnika ja vahendid",
    desc: "Aurupuhastid, kõrgsurvepesurid, elektrostaatilised pihustid, UV-C desinfitseerimine. Meie vahendid on tipptasemel.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Väljaõppega spetsialistid",
    desc: "Eritööde meeskond on koolitatud igaks olukorraks: tulekahjustused, ehitusjärgne koristus, vaibad, eskalaatorid.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Kvaliteedigarantii",
    desc: "Anname teenustele garantii. Kui tulemus ei rahulda, tuleme tagasi ja parandame tasuta.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Kiire reageerimine",
    desc: "Hädaolukordades (tulekahju, veeavarii, viiruspuhang) oleme Harjumaal kohal 30 minuti jooksul.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const teenuseSisuKaardid = [
  { bold: "Vaipade keemiline puhastus, allergeenide ja plekkide eemaldamine", desc: "", href: "/puhastusteenused/vaipade-puhastus" },
  { bold: "Põrandate süvapuhastus ja poleerimine", desc: "", href: "/puhastusteenused/porandate-hooldus" },
  { bold: "Ehitusjärgne koristus. Tolm, ehituspraht, valmistame pinnad üleandmiseks ette", desc: "", href: "/puhastusteenused/ehitusjargne-koristus" },
  { bold: "Suitsu- ja tulekahjustuste puhastamine, tahma- ja lõhnaeemaldus", desc: "", href: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine" },
  { bold: "Eskalaatorite süvapuhastus, kaubanduskeskused", desc: "", href: "/puhastusteenused/eskalaatorite-suvapuhastus" },
  { bold: "Desinfitseerimine, viiruste- ja bakteriaalne kaitse", desc: "", href: "/puhastusteenused/desinfitseerimine" },
  { bold: "Akende ja klaasfassaadide professionaalne pesu", desc: "", href: "/koristusteenus/valikoristus/akende-pesu" },
  { bold: "Fassaadipesu ja välispindade puhastus", desc: "", href: "/koristusteenus/valikoristus/fassaadipesu" },
];

export default function Puhastusteenused() {
  return (
    <>
      <SeoJsonLd
        serviceName="Puhastusteenused Tallinnas"
        serviceDescription="Professionaalsed puhastusteenused äriklientidele Tallinnas. Põrandate süvapuhastus, vaibad, ehitusjärgne koristus, desinfitseerimine."
        serviceUrl="https://spsgrupp.ee/puhastusteenused"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Puhastusteenused", item: "https://spsgrupp.ee/puhastusteenused" },
        ]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Puhastusteenused"
          style={{ background: "url('/puhastusteenused1.jpg') center/cover no-repeat" }}
        >
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
                Professionaalsed puhastusteenused<br />
                <span className="text-[#3abeff]">äriklientidele Tallinnas</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Kui tavaline koristus ei piisa. Põrandate süvapuhastus, vaipade keemiline pesu, ehitusjärgne koristus, tulekahjustuste taastamine ja professionaalne desinfitseerimine.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  className="btn-primary text-[15px] py-2.5 px-4"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Küsi puhastusteenuse pakkumist
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
                <span className="text-white/90">Puhastusteenused</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Kas mõni puhastusülesanne on teie jaoks üle jõu käiv?" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>On olukordi, kui tavaline koristus ei ole piisav. Vaipkate on kogunud aastate jooksul nähtamatut mustust. Põrandad on kaotanud sära ja kulumine on näha. Peale ehitust on tolm kõikjal, ka kohtades, kuhu silm ei jõua. Juhuslik tulekahju jättis tahma, mida tavalised vahendid ei eemalda. Või vajate kogu ruumi kiiret desinfitseerimist pärast haiguspuhangut.</p>
                </div>
                <div>
                  <p>Need olukorrad vajavad spetsiaalseid vahendeid, erivarustust ja väljaõppega personali.</p>
                  <p className="mt-4">SPS Grupp on 20+ aastat teinud just seda. Lahendanud raskeid ülesandeid, mida tavaline koristaja ei suuda. Anname tulemustele garantii.</p>
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
                <TwoToneHeading text="Millistele puhastustöödele oleme spetsialiseerunud?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teenuseSisuKaardid.map((item, i) => {
                  const cardContent = (
                    <>
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                    </div>
                    <div className="text-[#2f353f] text-[15px] leading-[1.6]">
                      <strong className="text-[#17345a] block mb-1">{item.bold}</strong>
                      {item.desc ? <span className="text-[#5a6474]">{item.desc}</span> : null}
                    </div>
                    </>
                  );

                  return item.href ? (
                    <Link
                      key={i}
                      href={item.href}
                      className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer no-underline"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={i}
                      className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer"
                    >
                      {cardContent}
                    </div>
                  );
                })}
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
                <TwoToneHeading text="Miks on SPS Grupp puhastusteenuste valdkonnas usaldusväärne partner?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {miksMeieKaardid.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-[#eef7fc] cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
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
                    src="/puhastusteenused2.jpg"
                    alt="SPS Grupp puhastusteenused"
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
                <TwoToneHeading text="Puhastusteenuste hinnad" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Iga puhastusteenus on erinev, seega hinnastame individuaalselt.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl">
                      <div className="text-[15px] font-bold mb-1 text-white">Vaipade puhastus</div>
                      <div className="text-[26px] font-bold mb-1 text-white">3€/m²</div>
                      <div className="text-[15px] mb-2 text-white/70">alates</div>
                      <div className="text-[15px] text-white/70">süvapuhastus</div>
                    </div>
                    <div className="p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                      <div className="text-[15px] font-bold mb-1 text-[#17345a]">Põrandate hooldus</div>
                      <div className="text-[26px] font-bold mb-1 text-[#17345a]">2.5€/m²</div>
                      <div className="text-[15px] mb-2 text-[#5a6474]">alates</div>
                      <div className="text-[15px] text-[#5a6474]">süvapuhastus</div>
                    </div>
                    <div className="p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                      <div className="text-[15px] font-bold mb-1 text-[#17345a]">Desinfitseerimine</div>
                      <div className="text-[26px] font-bold mb-1 text-[#17345a]">1.5€/m²</div>
                      <div className="text-[15px] mb-2 text-[#5a6474]">alates</div>
                      <div className="text-[15px] text-[#5a6474]">pindade töötlus</div>
                    </div>
                  </div>

                  <div className="text-[16px] text-[#2f353f] leading-[2] font-light mb-4">
                    <p><strong className="text-[#17345a]">Ehitusjärgne koristus:</strong> alates 250€ (sõltub objekti suurusest)</p>
                    <p><strong className="text-[#17345a]">Suitsukahjustuste puhastamine:</strong> individuaalne pakkumine</p>
                  </div>

                  <p className="text-[15px] text-[#5a6474]">
                    Kohapealne hindamine on alati tasuta ja ei kohusta ostma.
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
            title="Tellige tasuta puhastusteenuste analüüs"
            description="Kirjeldage oma olukorda või tuleme kohapeale olukorraga tutvuma. Koostame pakkumise 24h jooksul."
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
