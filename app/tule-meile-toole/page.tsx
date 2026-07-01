"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TwoToneHeading from "../components/TwoToneHeading";
import ScrollAnimation from "../components/ScrollAnimation";
import CareerForm from "../components/CareerForm";
import SeoJsonLd from "../components/SeoJsonLd";
import TooleAnnouncements from "../components/TooleAnnouncements";

export default function TuleMeileToolePage() {
  return (
    <>
      <SeoJsonLd
        serviceName="Tööpakkumised SPS Grupis"
        serviceDescription="Liitu SPS Grupi meeskonnaga! Otsime koristajaid Tallinnas ja Harjumaal. Varasem kogemus pole oluline."
        serviceUrl="https://spsgrupp.ee/tule-meile-toole"
        breadcrumbs={[
          { position: 1, name: "Avaleht", item: "https://spsgrupp.ee" },
          { position: 2, name: "Tule meile tööle", item: "https://spsgrupp.ee/tule-meile-toole" },
        ]}
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Tule meile tööle"
          style={{ background: "url('/tuletoole-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">200+</div>
                <div className="text-[15px] text-[#1f2937]">töötajat</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Väljaõpe</div>
                <div className="text-[15px] text-[#1f2937]">kohapeal</div>
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
                <div className="text-[18px] font-bold text-[#17345a] leading-tight">Paindlik</div>
                <div className="text-[15px] text-[#1f2937]">tööaeg</div>
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
                Tule meile tööle
                <br />
                <span className="text-[#3abeff]">Liitu meie meeskonnaga</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Meil töötab ligi 200 aktiivset inimest. Varasem töökogemus pole oluline, juhendame oma töötajaid kohapeal.
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  Registreeru proovipäevale
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
                <span className="text-white/90">Tule meile tööle</span>
              </nav>

            </div>
          </div>
        </section>

        {/* How recruitment works */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Kuidas toimub värbamine?" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <strong>Kõik kandidaadid peavad läbima proovipäeva.</strong> Päeva jooksul hinnatakse teie puhastusoskusi ning töösse suhtumist.
                </div>
                <div>
                  <strong>Kui proovipäev on läbitud, annab töödejuhataja teada, kas oled sobilik tööle asumiseks.</strong> Kui osutud valituks, sõlmitakse sinuga leping ning hakkad saama kokkulepitud tasu.
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* What we offer */}
        <ScrollAnimation animation="fade-up">
          <section
            className="py-[100px]"
            style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Hüved
                </div>
                <TwoToneHeading text="Pakume sulle" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Õigeaegselt makstav töötasu", desc: "Regulaarne ja täpne väljamakse" },
                  { title: "Väljaõpe ja täiendkoolitused", desc: "Pidev enesetäiendamise võimalus" },
                  { title: "Kvaliteetsed ja mugavad tööriided", desc: "Professionaalne varustus" },
                  { title: "Kaasaegsed ja ergonoomilised töövahendid", desc: "Tõhusad ja ohutud seadmed" },
                  { title: "Sotsiaalne garantii", desc: "Turvatunne ja kindlustus" },
                  { title: "Tervisekontroll", desc: "Regulaarne tervise jälgimine" },
                  { title: "Tunnustus pikaajalise töö eest", desc: "Staaži hindamine ja premeerimine" },
                  { title: "Rahaline toetus erijuhtudel", desc: "Toetus ootamatutes olukordades" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-4 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#eef7fc]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-[#17345a] mb-1">{item.title}</h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.6]">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Stats + Image */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div>
                  <div className="section-tag mb-4">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    SPS Grupp
                  </div>
                  <TwoToneHeading text="Liitu 200+ liikmelise meeskonnaga" className="mb-8" />

                  <div className="flex flex-wrap gap-4">
                    {[
                      { number: "200+", label: "töötajat" },
                      { number: "20+", label: "aastat kogemust" },
                      { number: "ISO 9001", label: "sertifitseeritud keskkond" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-6 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50"
                      >
                        <div className="text-[clamp(28px,3.5vw,40px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                        <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/tuletoole-2.jpg"
                    alt="SPS Grupp meeskond"
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

        {/* Active Job Announcements */}
        <TooleAnnouncements />

        {/* Career Form */}
        <ScrollAnimation animation="fade-up">
          <CareerForm />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
