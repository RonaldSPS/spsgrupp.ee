"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import Hinnakalkulaator from "../../../components/Hinnakalkulaator";

/**
 * TEENUSE LEHE TEMPLATE
 * ======================
 * Asenda kõik {PLACEHOLDER} väärtused vastava teenuse andmetega.
 * Kohusta linke, pilte, tekste ja hinnakirja vastavalt teenusele.
 *
 * Väljad, mida tuleb täita:
 *   {TEENUSE_NIMETUS}           — nt "Kontori koristus"
 *   {TEENUSE_SLUG}              — nt "kontori-koristus" (URL-friendly)
 *   {TAGASISUNNATUSLINK}        — nt "/koristusteenus/kontori-koristus" (täis URL)
 *   {HERO_PILT}                 — hero taustapilt (nt "/kontorikoristus1.jpg")
 *   {HERO_PEALKIRI}             — hero H1 pealkiri
 *   {HERO_PEALKIRI_VÄRVILINE}   — H1 värviline osa (nt "Tallinnas ja Harjumaal")
 *   {HERO_KIRJELDUS}            — lühike tutvustav tekst (1-2 lauset)
 *   {HERO_HIND}                 — alghinna fraas (nt "1,2 €/m²")
 *   {HERO_CTA_TEKST}            — CTA nupu tekst (nt "Küsi kontori koristuse pakkumist")
 *   {PROBLEEM_PEALKIRI}         — TwoToneHeading probleemisektsioonis
 *   {PROBLEEM_TEKST_VASAK}      — veerg 1: mure kirjeldus
 *   {PROBLEEM_TEKST_PAREM}      — veerg 2: miks see on oluline + lahendus
 *   {TEENUSE_SISU_PEALKIRI}     — TwoToneHeading teenuse sisu sektsioonis ("Mida sisaldab X teenus?")
 *   {TEENUSE_SISU_KAARDID}      — massiiv {bold, desc} objektidega (9 kaarti)
 *   {MIKS_MEIE_PEALKIRI}        — TwoToneHeading miks-meie sektsioonis
 *   {MIKS_MEIE_KAARDID}         — massiiv {title, desc} objektidega (4 kaarti)
 *   {MIKS_MEIE_PILT}            — pildi src (nt "/kontorikoristus2.jpg")
 *   {MIKS_MEIE_PILT_ALT}        — pildi alt tekst
 *   {HIND_PEALKIRI}             — TwoToneHeading hinna sektsioonis
 *   {HIND_KIRJELDUS}            — sissejuhatav tekst hinna sektsioonis
 *   {HIND_KAARDID}              — massiiv {size, area, price, period, highlight?} objektidega (3 kaarti)
 *   {HIND_ALGHINNAD}            — alghindade tekst (nt "Regulaarse hoolduskoristuse hind algab 1,2 €/m²...")
 *   {FOOTER_CTA_TITLE}          — FooterCTA pealkiri
 *   {FOOTER_CTA_DESCRIPTION}    — FooterCTA kirjeldus
 *   {BREADCRUMB_TEENUS}         — leivapuru viimane tase (nt "Kontori koristus")
 *   {SOTSIAALNE_TÕESTUS_SECTION_TAG} — section-tag silt (nt "Klientide tagasiside")
 *   {SOTSIAALNE_TÕESTUS_PEALKIRI}    — TwoToneHeading (nt "Tallinna ja Harjumaa objektid")
 *   {SOTSIAALNE_TÕESTUS_KIRJELDUS}   — lühike kirjeldustekst
 *   {STAT1_NUMBER}, {STAT1_LABEL} ... — 3 statistikakaarti
 *
 * HOOLEPINGU BLOKI PLACEHOLDERID (valikuline, kommenteeritud välja):
 *   {HOOLDUSLEPING_SECTION_TAG}  — section-tag silt (nt "Hooldusleping")
 *   {HOOLDUSLEPING_PEALKIRI}     — TwoToneHeading
 *   {HOOLDUSLEPING_TEKST}        — 2-3 lõiku teksti
 *   {HOOLDUSLEPING_PILT}         — pildi src
 *   {HOOLDUSLEPING_PILT_ALT}     — pildi alt tekst
 */

export default function TeenuseLeht() {
  // ====================================================================
  // ANDMED — Asenda kõik allolevad väärtused vastava teenuse andmetega
  // ====================================================================

  /* ---------- HERO ---------- */
  const heroPilt = "{HERO_PILT}";
  const heroPealkiri = "{HERO_PEALKIRI}";
  const heroPealkiriVarviline = "{HERO_PEALKIRI_VÄRVILINE}";
  const heroKirjeldus = "{HERO_KIRJELDUS}";
  const heroHind = "{HERO_HIND}";
  const heroCtaTekst = "{HERO_CTA_TEKST}";

  /* ---------- FLOATING CHIPS (hero) ---------- */
  const floatingChips = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
      chipClass: "chip-icon-blue",
      value: "{CHIP1_VÄÄRTUS}",
      label: "{CHIP1_SILT}",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      chipClass: "chip-icon-green",
      value: "{CHIP2_VÄÄRTUS}",
      label: "{CHIP2_SILT}",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      chipClass: "chip-icon-navy",
      value: "{CHIP3_VÄÄRTUS}",
      label: "{CHIP3_SILT}",
    },
  ];

  /* ---------- PROBLEEM ---------- */
  const probleemPealkiri = "{PROBLEEM_PEALKIRI}";
  const probleemTekstVasak = "{PROBLEEM_TEKST_VASAK}";
  const probleemTekstParem = "{PROBLEEM_TEKST_PAREM}";

  /* ---------- TEENUSE SISU ---------- */
  const teenuseSisuPealkiri = "{TEENUSE_SISU_PEALKIRI}";
  const teenuseSisuKaardid: { bold: string; desc: string }[] = [
    // TODO: Asenda allolevad 9 kaarti teenuse sisu kirjeldustega
    { bold: "{KAART1_BOLD}", desc: "{KAART1_DESC}" },
    { bold: "{KAART2_BOLD}", desc: "{KAART2_DESC}" },
    { bold: "{KAART3_BOLD}", desc: "{KAART3_DESC}" },
    { bold: "{KAART4_BOLD}", desc: "{KAART4_DESC}" },
    { bold: "{KAART5_BOLD}", desc: "{KAART5_DESC}" },
    { bold: "{KAART6_BOLD}", desc: "{KAART6_DESC}" },
    { bold: "{KAART7_BOLD}", desc: "{KAART7_DESC}" },
    { bold: "{KAART8_BOLD}", desc: "{KAART8_DESC}" },
    { bold: "{KAART9_BOLD}", desc: "{KAART9_DESC}" },
  ];

  /* ---------- MIKS MEIE ---------- */
  const miksMeiePealkiri = "{MIKS_MEIE_PEALKIRI}";
  const miksMeieKaardid: { title: string; desc: string; icon: React.ReactNode }[] = [
    // TODO: Asenda allolevad 4 kaarti põhjuste kirjeldustega
    {
      title: "{MIKS_MEIE1_TITLE}",
      desc: "{MIKS_MEIE1_DESC}",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      title: "{MIKS_MEIE2_TITLE}",
      desc: "{MIKS_MEIE2_DESC}",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: "{MIKS_MEIE3_TITLE}",
      desc: "{MIKS_MEIE3_DESC}",
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
      title: "{MIKS_MEIE4_TITLE}",
      desc: "{MIKS_MEIE4_DESC}",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];
  const miksMeiePilt = "{MIKS_MEIE_PILT}";
  const miksMeiePiltAlt = "{MIKS_MEIE_PILT_ALT}";

  /* ---------- HIND ---------- */
  const hindPealkiri = "{HIND_PEALKIRI}";
  const hindKirjeldus = "{HIND_KIRJELDUS}";
  const hindKaardid: { size: string; area: string; price: string; period: string; highlight?: boolean }[] = [
    // TODO: Asenda allolevad 3 kaarti teenuse hinnakirjaga
    { size: "{HIND_KAART1_SIZE}", area: "{HIND_KAART1_AREA}", price: "{HIND_KAART1_PRICE}", period: "{HIND_KAART1_PERIOD}", highlight: true },
    { size: "{HIND_KAART2_SIZE}", area: "{HIND_KAART2_AREA}", price: "{HIND_KAART2_PRICE}", period: "{HIND_KAART2_PERIOD}" },
    { size: "{HIND_KAART3_SIZE}", area: "{HIND_KAART3_AREA}", price: "{HIND_KAART3_PRICE}", period: "{HIND_KAART3_PERIOD}" },
  ];
  const hindAlghinnad = "{HIND_ALGHINNAD}";

  /* ---------- FOOTER CTA ---------- */
  const footerCtaTitle = "{FOOTER_CTA_TITLE}";
  const footerCtaDescription = "{FOOTER_CTA_DESCRIPTION}";

  /* ---------- LEIVAPURU ---------- */
  const breadcrumbTeenus = "{BREADCRUMB_TEENUS}";

  // ====================================================================
  // RENDER — Allolevat HTML-struktuuri tavaliselt muutma ei pea
  // ====================================================================

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative overflow-hidden min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={breadcrumbTeenus}
        >
          <Image src={heroPilt} alt="" fill preload sizes="100vw" className="object-cover z-0" />
          {/* Floating chips */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className="floating-chip animate-float"
                style={{ background: "rgba(255,255,255,0.95)" }}
              >
                <div className={`chip-icon ${chip.chipClass} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  {chip.icon}
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
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] -tracking-[1px] mb-[18px]">
                {heroPealkiri}
                <br />
                <span className="text-[#3abeff]">{heroPealkiriVarviline}</span>
              </h1>
              <p
                className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light"
                dangerouslySetInnerHTML={{
                  __html: heroKirjeldus.replace(
                    heroHind,
                    `<strong class="text-white font-medium">${heroHind}</strong>`
                  ),
                }}
              />
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  {heroCtaTekst}
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
            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text={probleemPealkiri} className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div dangerouslySetInnerHTML={{ __html: probleemTekstVasak }} />
                <div dangerouslySetInnerHTML={{ __html: probleemTekstParem }} />
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
                <TwoToneHeading text={teenuseSisuPealkiri} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teenuseSisuKaardid.map((item, i) => (
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

        {/* Hoolduslepingu eelised (valikuline — sobib väli- ja hooldusteenuste lehtedele) */}
        {/* TODO: Lisa see sektsioon vaid siis, kui teenusel on aastahoolduslepingu loogika */}
        {/* <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <div className="section-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                {HOOLDUSLEPING_SECTION_TAG}
              </div>
              <TwoToneHeading text="{HOOLDUSLEPING_PEALKIRI}" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
              <div className="text-[16px] text-[#2f353f] leading-[1.8] font-light">
                {HOOLDUSLEPING_TEKST — 2-3 lõiku hoolduslepingu eelistest}
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="{HOOLDUSLEPING_PILT}"
                  alt="{HOOLDUSLEPING_PILT_ALT}"
                  width={600}
                  height={700}
                  className="w-full h-auto object-cover"
                  style={{ color: "#2d3748" }}
                />
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimation> */}

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
                <TwoToneHeading text={miksMeiePealkiri} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {miksMeieKaardid.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
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
                    src={miksMeiePilt}
                    alt={miksMeiePiltAlt}
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
                    <path d="M15 4a7 7 0 0 0-7 7 7 7 0 0 0 7 7M7 10h8M7 14h8" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text={hindPealkiri} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                    {hindKirjeldus}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {hindKaardid.map((item, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
                          item.highlight
                            ? "bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl"
                            : "bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]"
                        }`}
                      >
                        <div
                          className={`text-[15px] font-bold mb-1 ${
                            item.highlight ? "text-white" : "text-[#17345a]"
                          }`}
                        >
                          {item.size}
                        </div>
                        <div
                          className={`text-[26px] font-bold mb-1 ${
                            item.highlight ? "text-white" : "text-[#17345a]"
                          }`}
                        >
                          {item.price}
                        </div>
                        <div
                          className={`text-[15px] mb-2 ${
                            item.highlight ? "text-white/70" : "text-[#5a6474]"
                          }`}
                        >
                          {item.period}
                        </div>
                        <div
                          className={`text-[15px] ${
                            item.highlight ? "text-white/70" : "text-[#5a6474]"
                          }`}
                        >
                          {item.area}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    className="text-[15px] text-[#5a6474]"
                    dangerouslySetInnerHTML={{ __html: hindAlghinnad }}
                  />
                </div>

                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Sotsiaalne tõestus — kohandatud sektsioon */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="text-center mb-14">
              <div className="section-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {"{SOTSIAALNE_TÕESTUS_SECTION_TAG}"}
              </div>
              <TwoToneHeading text="{SOTSIAALNE_TÕESTUS_PEALKIRI}" />
              <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">
                {"{SOTSIAALNE_TÕESTUS_KIRJELDUS}"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
              {[
                { number: "{STAT1_NUMBER}", label: "{STAT1_LABEL}" },
                { number: "{STAT2_NUMBER}", label: "{STAT2_LABEL}" },
                { number: "{STAT3_NUMBER}", label: "{STAT3_LABEL}" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50">
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
          <FooterCTA title={footerCtaTitle} description={footerCtaDescription} />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
