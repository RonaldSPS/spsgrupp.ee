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
    q: "Kas SPS Grupp teeb kõiki remonditöid ise või kasutab alltöövõtjaid?",
    a: "Enamik töid (elekter, toru, viimistlus, plaatimine, lammutus) teeme ise oma sertifitseeritud meeskonnaga. Eriti spetsiifilistel töödel võime kaasata usaldusväärseid partnereid — kuid teie ees vastutame alati meie.",
  },
  {
    q: "Kas saate teha remonditöid tööajal segamata?",
    a: "Jah. Planeerime töö nii, et teie äritegevus ei katkeks. Teeme tööd õhtuti, nädalavahetustel või tsooniti. Mürarohked tööd planeerime tööaja välisele ajale.",
  },
  {
    q: "Kui kiiresti saab remonditööde pakkumist?",
    a: "Tavaliselt 2–5 tööpäeva pärast kohapealset ülevaatust. Väiksemate tööde puhul ka kiiremini. Kiireloomulistes olukordades reageerime samal päeval.",
  },
  {
    q: "Kas annate remonditöödele garantii?",
    a: "Jah. Kõigile teostatud töödele kehtib garantii vastavalt kokkuleppele — tavaliselt 1–5 aastat sõltuvalt töö iseloomust. Materjalidele kehtib tootja garantii.",
  },
  {
    q: "Kas tegelete ka kiireloomuliste hädaolukordadega?",
    a: "Jah — veeavarii, elektririke, kanalisatsiooniummistus. Reageerime 24/7, kohapeal tavaliselt 1–2 tunni jooksul.",
  },
];

export default function RemonditeenusedTallinnas() {
  return (
    <>
      <SeoJsonLd
        serviceName="Remonditeenused Tallinnas"
        serviceDescription="Remonditeenused ärikinnisvarale Tallinnas. Elektri-, toru-, plaatimis- ja ventilatsioonitööd ühest kohast."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" },
        ]}
        faq={customFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Remonditeenused Tallinnas"
          style={{ background: "url('/remonditeenused-1.jpg') right top/cover no-repeat" }}
        >
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Litsentseeritud</div>
                <div className="text-[15px] text-[#1f2937]">meeskond</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Kindlustatud</div>
                <div className="text-[15px] text-[#1f2937]">tööd</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">20+ aastat</div>
                <div className="text-[15px] text-[#1f2937]">kogemust</div>
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
                Remonditeenused ärikinnisvarale<br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Kogu remondiprojekt ühest kohast. Elekter, torud, siseviimistlus, ventilatsioon, plaatimine ja betoonitööd. Üks partner, üks vastutus, ennustatav tulemus.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer">
                  Küsi remondipakkumist
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
                <span className="text-white/90">Remonditeenused Tallinnas</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Kas teie remondiprojekti koordineerib liiga palju inimesi?" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Klassikaline ärikinnisvara remondi probleem: üks firma teeb elektritöid, teine torutöid, kolmas plaatimist, neljas viimistlust. Keegi ei vastuta tervikliku tulemuse eest. Kui midagi läheb valesti, osutatakse üksteisele.</p>
                  <p className="mt-4">Tähtajad libisevad, kulud kasvavad, kvaliteet kannatab. Eriti valulik on see kontorites ja kaubanduspindadel, kus iga lisapäev remondis tähendab kaotatud äritulu.</p>
                </div>
                <div>
                  <p>SPS Grupp pakub ärikinnisvarale täislahendust. Kogu remondilahendus ühest kohast. Meie meeskonnas on elektrikud, torulukksepad, viimistlejad, plaatijad ja ventilatsioonispetsialistid. Üks objektijuht, üks leping, üks vastutus.</p>
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
                <TwoToneHeading text="Milliseid remonditeenuseid SPS Grupp pakub?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { bold: "Elektritööd", desc: "paigaldus, hooldus, rikete kõrvaldamine", href: "/remonditeenused-tallinnas/elektritood" },
                  { bold: "Torutööd", desc: "vee-, kanalisatsiooni- ja küttesüsteemid", href: "/remonditeenused-tallinnas/torutood" },
                  { bold: "Siseviimistlustööd", desc: "seinad, laed, põrandad", href: "/remonditeenused-tallinnas/siseviimistlustood" },
                  { bold: "Plaatimistööd", desc: "sanitaarruumid, köögid, üldkasutatavad alad", href: "/remonditeenused-tallinnas/plaatimistood" },
                  { bold: "Sanitaarremont ja ümberehitus", desc: "WC-d, dušid, toru- ja elektritööd", href: "/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus" },
                  { bold: "Ventilatsioonisüsteemide ehitus ja hooldus", desc: "projekteerimine, paigaldus, hooldus", href: "/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus" },
                  { bold: "Katuse remont ja hooldus", desc: "lamekatused, lekked, hüdroisolatsioon", href: "/remonditeenused-tallinnas/katuse-remont" },
                  { bold: "Lammutustööd", desc: "kontrollitud, dokumenteeritud, jäätmekäitlusega", href: "/remonditeenused-tallinnas/lammutustood" },
                  { bold: "Betoonitööd", desc: "valamine, parandus, tasandus" },
                ].map((item, i) => {
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
                <TwoToneHeading text="Miks valida SPS Grupp remondipartneriks?" />
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Täislahendus ühest kohast</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kogu projekt, elektrist viimistluseni, meie meeskonnaga. Üks leping, üks objektijuht, üks arve, üks vastutus.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Litsentseeritud ja kindlustatud</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Kõigil aladel vastavad litsentsid ja tunnistused. Kõik tööd on kindlustatud.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Planeerimine äritegevust arvestades</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Teeme tööd nädalavahetustel või öösel, kui vaja. Koordineerime nii, et teie äritegevus ei katkeks.
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
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">Läbipaistev hinnakujundus</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          Täpne pakkumine enne töid. Ei mingeid üllatusi ega lisatasusid. Kui tuleb muudatus, leppime kokku enne tööd.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/remonditood-2.webp"
                    alt="SPS Grupp remonditeenused ärikinnisvarale"
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
                <TwoToneHeading text="Kuidas kujuneb remonditööde hind?" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    Iga remondiprojekt on unikaalne. Hind sõltub tööde mahust, materjalidest, ajakavast ja objekti eripärast.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { size: "Väikesed tööd", area: "elekter, toru, parandus", price: "al. 150€", period: "ühekordne", highlight: true },
                      { size: "Keskmine remont", area: "üksik ruum, sanitaar", price: "al. 800€", period: "projektipõhine" },
                      { size: "Täislahendus", area: "kontor, äripind", price: "Individuaalne", period: "pakkumine" },
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
                    Meie lähenemine: tasuta kohapealne hindamine, detailne pakkumine koos ajakava ja eelarvega, kindla hinnaga leping. Materjalid ja tööjõud selgelt eristatud, vajadusel etapiviisiline teostamine.
                  </p>
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
                SPS Grupp numbrites
              </div>
              <TwoToneHeading text="Usaldusväärne remondipartner" />
              <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                Aastakümnete pikkune kogemus ja tuhanded teostatud objektid kinnitavad meie usaldusväärsust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
              {[
                { number: "20+ aastat", label: "kogemust ehitusturul" },
                { number: "1000+ objekti", label: "teostatud üle Eesti" },
                { number: "ISO 9001", label: "sertifitseeritud kvaliteet" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9] cursor-pointer">
                  <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                  <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Alustage tasuta konsultatsiooniga"
            description="Tuleme kohale, kuulame ära teie vajadused, koostame pakkumise. Tasuta ja ei kohusta ostma."
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
