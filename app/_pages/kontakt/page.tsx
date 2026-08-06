"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import HeroBackgroundImage from "../../components/HeroBackgroundImage";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import Testimonials from "../../components/Testimonials";
import FAQ from "../../components/FAQ";
import FooterCTA from "../../components/FooterCTA";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import { generateBreadcrumbSchema, renderLdJson } from "@/lib/json-ld-generator";
import { absoluteUrl, canonicalUrl } from "@/lib/url-utils";
import { localizePath, type Locale } from "@/lib/slug-map";
import { et as etD, en as enD, ru as ruD, type KontaktPageData } from "@/lib/pages/definitions/kontakt";

interface KontaktChip {
  href: string;
  bigText: string;
  smallText: string;
  iconClass: string;
  icon: React.ReactNode;
  target?: string;
}

function getText(locale: Locale): KontaktPageData {
  return locale === "et" ? etD : locale === "en" ? enD : ruD;
}

const whyUsIcons = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>,
];

export default function KontaktLeht() {
  return <KontaktPageView locale="et" />;
}

export function KontaktPageView({ locale }: { locale: Locale }) {
  const t = getText(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SPS Grupp OÜ",
    description:
      "Professionaalne koristus- ja remonditeenuste partner Tallinnas ja Harjumaal",
    url: canonicalUrl("/kontakt"),
    telephone: "+372 662 3328",
    email: "info@spsgrupp.ee",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mustamäe tee 46",
      addressLocality: "Tallinn",
      postalCode: "10621",
      addressCountry: "EE",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: ["Tallinn", "Harjumaa"],
    sameAs: ["https://www.facebook.com/Puhastusteenused"],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.4042,
      longitude: 24.6843,
    },
    priceRange: "€€",
    image: absoluteUrl("/FrontHeroCar.jpg"),
  };

  const contactChips: KontaktChip[] = [
    {
      href: "tel:6623328",
      bigText: "(+372) 662 3328",
      smallText: t.chipLabels[0],
      iconClass: "chip-icon-blue",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    },
    {
      href: "tel:55605147",
      bigText: "(+372) 5560 5147",
      smallText: t.chipLabels[1],
      iconClass: "chip-icon-navy",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>,
    },
    {
      href: "mailto:info@spsgrupp.ee",
      bigText: "info@spsgrupp.ee",
      smallText: t.chipLabels[2],
      iconClass: "chip-icon-green",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
    {
      href: "https://www.google.com/maps/place/Tetris+B%C3%BCroohoone,+Mustam%C3%A4e+tee+46,+10621+Tallinn/@59.4162971,24.6890432,17z/data=!3m1!4b1!4m6!3m5!1s0x469294f5fec8e2fd:0xc2b28e6f780f9897!8m2!3d59.4162944!4d24.6916181!16s%2Fg%2F1q6jyqwpb?entry=tts&g_ep=EgoyMDI1MDIyMy4xIPu8ASoASAFQAw%3D%3D",
      bigText: "Mustamäe tee 46, 10621 Tallinn",
      smallText: t.chipLabels[3],
      iconClass: "chip-icon-blue",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
      target: "_blank",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderLdJson(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderLdJson(generateBreadcrumbSchema([
            { name: t.breadcrumbHome, etPath: "/" },
            { name: t.breadcrumbCurrent, etPath: "/kontakt" },
          ], locale))
        }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          aria-label={t.ariaLabel}
        >
          <HeroBackgroundImage src="/FrontHeroCar.jpg" preload alt="" />
          <div className="max-w-[1280px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[60px] items-start">
              {/* Left column - frosted glass */}
              <div
                className="animate-fade-up"
                style={{
                  background: "rgba(38, 42, 45, 0.62)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  padding: "32px",
                  borderRadius: "20px",
                  border: "1px solid rgba(133, 203, 233, 0.2)"
                }}
              >
                <h1 className="text-[clamp(28px,4.2vw,56px)] leading-[1.12] -tracking-[1px] mb-[18px]" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, color: 'white' }}>
                  {t.h1Line1}
                  {t.h1Line2 ? (
                    <>
                      <br />
                      <span className="text-[#3abeff]" style={{ fontWeight: 600 }}>{t.h1Line2}</span>
                    </>
                  ) : null}
                </h1>
                <p className="text-[15px] text-white/90 leading-[1.75] mb-[30px] max-w-[500px] font-light">
                  {t.heroDescription}
                </p>
                <div className="flex gap-[10px] mb-[24px]">
                  <Link
                    href="#pakkumine"
                    className="btn-primary text-[15px] py-2.5 px-4"
                  >
                    {t.ctaButton}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link
                    href="tel:6623328"
                    className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    662 3328
                  </Link>
                </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px]">
                <Link href={localizePath("/", locale)} className="text-white/80 no-underline hover:text-white transition-colors">{t.breadcrumbHome}</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{t.breadcrumbCurrent}</span>
              </nav>

              </div>

              {/* Right column - floating contact chips */}
              <div className="animate-fade-up grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <h2 className="text-[20px] font-bold text-white sm:col-span-2 mb-0" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>{t.companyName}</h2>
                {contactChips.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.target || undefined}
                    rel={item.target ? "noopener noreferrer" : undefined}
                    className="floating-chip animate-float no-underline cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.95)", padding: "10px 14px", gap: "8px" }}
                  >
                    <div className={`chip-icon ${item.iconClass} w-8 h-8 rounded-[10px] flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-[#17345a] leading-tight">{item.bigText}</div>
                      <div className="text-[15px] text-[#1f2937] leading-tight">{item.smallText}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Miks valida SPS Grupp */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.whyUsTag}
                </div>
                <TwoToneHeading text={t.whyUsHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
                {t.whyUs.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#f8fafc] p-5 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        {whyUsIcons[i % whyUsIcons.length]}
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-[#17345a] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Milliste teenustega meie poole pöörduda */}
        <ScrollAnimation animation="fade-up">
          <section
            className="py-[100px]"
            style={{
              background:
                "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat",
            }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  {t.servicesTag}
                </div>
                <TwoToneHeading text={t.servicesHeading} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 max-w-[1100px] mx-auto">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {t.services.map((item, i) => (
                      <div
                        key={i}
                        className="bg-[#ffffff78] backdrop-blur-[5px] p-4 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80 flex items-center gap-3"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#17345a"
                          strokeWidth="2.5"
                          className="flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-[15px] text-[#2f353f]">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[15px] text-[#2f353f] leading-[1.7] font-light">
                    {t.servicesDesc}
                  </p>
                </div>
                <div className="relative hidden lg:block">
                  <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[380px] relative">
                    <Image
                      src="/SPSGrupp4.jpg"
                      alt={t.servicesImageAlt}
                      fill
                      sizes="380px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Teeninduspiirkond */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {t.areasTag}
                </div>
                <TwoToneHeading text={t.areasHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[65fr_35fr] gap-[60px] items-start max-w-[1000px] mx-auto">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light mb-6">
                    {t.areasDesc1}
                  </p>
                  <p className="text-[15px] text-[#17345a] font-medium mb-4">
                    {t.areasSubheading}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {t.areas.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2 text-[15px] text-[#2f353f]"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#85cbe9"
                          strokeWidth="2.5"
                          className="flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[rgba(133,203,233,0.15)]">
                  <div className="w-full relative mb-5 rounded-2xl overflow-hidden">
                    <Image
                      src="/Eesti.svg"
                      alt={t.areasMapAlt}
                      width={320}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#17345a"
                    strokeWidth="1.5"
                    className="mb-4"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="text-[15px] text-[#2f353f] leading-[1.7] font-light">
                    {t.areasDesc2}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Klientide arvamused */}
        <ScrollAnimation animation="fade-up">
          <Testimonials />
        </ScrollAnimation>

        {/* Küsige personaalset pakkumist */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* Korduma kippuvad küsimused */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={t.faq} />
        </ScrollAnimation>

        {/* Final CTA */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title={t.footerTitle}
            description={t.footerDescription}
          />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
