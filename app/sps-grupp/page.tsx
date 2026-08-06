"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import HeroBackgroundImage from "../components/HeroBackgroundImage";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import FooterCTA from "../components/FooterCTA";
import ContactForm from "../components/ContactForm";
import TwoToneHeading from "../components/TwoToneHeading";
import ScrollAnimation from "../components/ScrollAnimation";
import SeoJsonLd from "../components/SeoJsonLd";
import { localizePath, type Locale } from "@/lib/slug-map";
import { et as etD, en as enD, ru as ruD, type SpsGruppPageData } from "@/lib/pages/definitions/sps-grupp";

function getText(locale: Locale): SpsGruppPageData {
  return locale === "et" ? etD : locale === "en" ? enD : ruD;
}

const chipTones = ["blue", "green", "navy"] as const;
const chipIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>,
];

export default function SPSGruppPage() {
  return <SpsGruppPageView locale="et" />;
}

export function SpsGruppPageView({ locale }: { locale: Locale }) {
  const t = getText(locale);

  return (
    <>
      <SeoJsonLd
        etPath="/sps-grupp"
        locale={locale}
        serviceName={t.serviceName}
        serviceDescription={t.serviceDescription}
        breadcrumbs={[
          { name: t.breadcrumbHome, etPath: "/" },
          { name: "SPS Grupp", etPath: "/sps-grupp" },
        ]}
        faq={t.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={t.ariaLabel}
        >
          <HeroBackgroundImage src="/FrontHeroCar.jpg" preload alt="" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[45%] flex flex-wrap gap-[20px] z-20 hidden md:flex">
            {t.heroChips.map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className={`chip-icon chip-icon-${chipTones[i % 3]} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  {chipIcons[i % 3]}
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
                {t.h1Line1}
                {t.h1Line2 ? (
                  <>
                    <br />
                    <span className="text-[#3abeff]">{t.h1Line2}</span>
                  </>
                ) : null}
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                {t.heroDescription}
              </p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  {t.ctaButton}
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
                <Link href={localizePath("/", locale)} className="text-white/80 no-underline hover:text-white transition-colors">{t.breadcrumbHome}</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">SPS Grupp</span>
              </nav>

            </div>
          </div>
        </section>

        {/* About SPS Grupp */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text={t.aboutHeading} className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <strong>{t.aboutP1Bold}</strong> {t.aboutP1}
                </div>
                <div>
                  <strong>{t.aboutP2Bold}</strong> {t.aboutP2}
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* High Standards */}
        <ScrollAnimation animation="fade-up">
          <section
            className="py-[100px]"
            style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
          >
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  {t.standardsTag}
                </div>
                <TwoToneHeading text={t.standardsHeading} />
              </div>

              <div className="text-[16px] text-[#2f353f] leading-[1.8] font-light mb-12 max-w-[900px] mx-auto text-center">
                {t.standardsIntro}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.standards.map((item, i) => (
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

        {/* Customer Satisfaction + Employees */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {t.qualityTag}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px]">
                <div className="bg-[#f8fafc] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#eef7fc] mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#17345a] mb-4">{t.qualityLeftTitle}</h3>
                  <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                    {t.qualityLeftContent}
                  </p>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#eef7fc] mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#17345a] mb-4">{t.qualityRightTitle}</h3>
                  <p className="text-[15px] text-[#5a6474] leading-[1.7]">
                    {t.qualityRightContent}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Certificates */}
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
                  {t.certificatesTag}
                </div>
                <TwoToneHeading text={t.certificatesHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light mb-6">
                    {t.certificatesP1}
                  </p>
                  <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light mb-6">
                    {t.certificatesP2}
                  </p>
                  <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light">
                    <strong>{t.certificatesP3Bold}</strong> {t.certificatesP3}
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/9001-14001-ENG.webp"
                    alt={t.certificatesImageAlt}
                    width={600}
                    height={700}
                    className="w-full h-auto object-contain"
                    style={{ color: "#2d3748" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Emergency Preparedness */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 4a7 7 0 0 0-7 7 7 7 0 0 0 7 7M7 10h8M7 14h8" />
                  </svg>
                  {t.emergencyTag}
                </div>
                <TwoToneHeading text={t.emergencyHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[1000px] mx-auto">
                <div className="bg-[#f8fafc] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                  <h3 className="text-[18px] font-bold text-[#17345a] mb-4">{t.emergencyLeftTitle}</h3>
                  <p>
                    {t.emergencyLeftContent}
                  </p>
                </div>
                <div className="bg-[#f8fafc] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                  <h3 className="text-[18px] font-bold text-[#17345a] mb-4">{t.emergencyRightTitle}</h3>
                  <p>
                    {t.emergencyRightContent}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Stats section */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {t.statsTag}
                </div>
                <TwoToneHeading text={t.statsHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {t.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50"
                  >
                    <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                    <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* CTA - Request Quote */}
        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title={t.ctaTitle}
            description={t.ctaDescription}
          />
        </ScrollAnimation>

        {/* Contact Form */}
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>

        {/* FAQ */}
        <ScrollAnimation animation="fade-up">
          <FAQ items={t.faq} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
