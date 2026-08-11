"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import HeroBackgroundImage from "../../components/HeroBackgroundImage";
import Footer from "../../components/Footer";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import CareerForm from "../../components/CareerForm";
import SeoJsonLd from "../../components/SeoJsonLd";
import TooleAnnouncements from "../../components/TooleAnnouncements";
import { localizePath, type Locale } from "@/lib/slug-map";
import { getLocalizedContent } from "@/lib/localized-content";

type ContentRecord = Record<string, unknown>;

interface CareersText {
  serviceName: string;
  serviceDescription: string;
  ariaLabel: string;
  heroChips: { value: string; label: string }[];
  h1Line1: string;
  h1Line2: string;
  heroDescription: string;
  ctaButton: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  problemHeading: string;
  problemP1Strong: string;
  problemP1Text: string;
  problemP2Strong: string;
  problemP2Text: string;
  benefitsTag: string;
  benefitsHeading: string;
  benefits: { title: string; desc: string }[];
  statsTag: string;
  statsHeading: string;
  stats: { number: string; label: string }[];
  statsImageAlt: string;
}

const etText: CareersText = {
  serviceName: "Tööpakkumised SPS Grupis",
  serviceDescription: "Liitu SPS Grupi meeskonnaga! Otsime koristajaid Tallinnas ja Harjumaal. Varasem kogemus pole oluline.",
  ariaLabel: "Tule meile tööle",
  heroChips: [
    { value: "300+", label: "töötajat" },
    { value: "Väljaõpe", label: "kohapeal" },
    { value: "Paindlik", label: "tööaeg" },
  ],
  h1Line1: "Tule meile tööle",
  h1Line2: "Liitu meie meeskonnaga",
  heroDescription: "Meil töötab üle 300 inimese. Varasem töökogemus pole oluline, juhendame oma töötajaid kohapeal.",
  ctaButton: "Kandideeri",
  breadcrumbHome: "Avaleht",
  breadcrumbCurrent: "Tule meile tööle",
  problemHeading: "Kuidas toimub värbamine?",
  problemP1Strong: "Sobivate kandidaatidega lepime kokku järgmised sammud ning vajadusel praktilise tööoskuste hindamise.",
  problemP1Text: "Kõik etapid ja tingimused lepime sinuga eelnevalt kokku.",
  problemP2Strong: "Kui osutud valituks, sõlmitakse sinuga leping.",
  problemP2Text: "Hakkad saama kokkulepitud tasu alates esimesest tööpäevast.",
  benefitsTag: "Hüved",
  benefitsHeading: "Pakume sulle",
  benefits: [
    { title: "Õigeaegselt makstav töötasu", desc: "Regulaarne ja täpne väljamakse" },
    { title: "Väljaõpe ja täiendkoolitused", desc: "Pidev enesetäiendamise võimalus" },
    { title: "Kvaliteetsed ja mugavad tööriided", desc: "Professionaalne varustus" },
    { title: "Kaasaegsed ja ergonoomilised töövahendid", desc: "Tõhusad ja ohutud seadmed" },
    { title: "Ametlik töösuhe ja sotsiaalsed garantiid", desc: "Selged kokkulepped ja turvatunne" },
    { title: "Töötervishoiu tervisekontroll", desc: "" },
    { title: "Tunnustus pikaajalise töö eest", desc: "Staaži hindamine ja premeerimine" },
    { title: "Rahaline toetus erijuhtudel", desc: "Toetus ootamatutes olukordades" },
  ],
  statsTag: "SPS Grupp",
  statsHeading: "Liitu enam kui 300-liikmelise meeskonnaga",
  stats: [
    { number: "300+", label: "töötajat" },
    { number: "Alates", label: "2006. aastast" },
    { number: "ISO 9001", label: "kvaliteedijuhtimine" },
    { number: "ISO 14001", label: "keskkonnajuhtimine" },
  ],
  statsImageAlt: "SPS Grupp meeskond",
};

function asRecord(value: unknown): ContentRecord | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as ContentRecord;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function localizedText(locale: Exclude<Locale, "et">): CareersText {
  const content = asRecord(getLocalizedContent(locale, "careers")) ?? {};
  const seo = asRecord(content.seo) ?? {};
  const hero = asRecord(content.hero) ?? {};
  const problem = asRecord(content.problem) ?? {};
  const services = asRecord(content.services) ?? {};
  const stats = asRecord(content.stats) ?? {};

  return {
    serviceName: str(seo.serviceName) || etText.serviceName,
    serviceDescription: str(seo.serviceDescription) || etText.serviceDescription,
    ariaLabel: str(hero.ariaLabel) || etText.ariaLabel,
    heroChips: [
      { value: str(hero.chip1Badge) || etText.heroChips[0].value, label: str(hero.chip1Label) || etText.heroChips[0].label },
      { value: str(hero.chip2Badge) || etText.heroChips[1].value, label: str(hero.chip2Label) || etText.heroChips[1].label },
      { value: str(hero.chip3Badge) || etText.heroChips[2].value, label: str(hero.chip3Label) || etText.heroChips[2].label },
    ],
    h1Line1: str(hero.h1Line1) || etText.h1Line1,
    h1Line2: str(hero.h1Line2),
    heroDescription: str(hero.description) || etText.heroDescription,
    ctaButton: str(hero.ctaButton) || etText.ctaButton,
    breadcrumbHome: str(hero.breadcrumbHome) || etText.breadcrumbHome,
    breadcrumbCurrent: str(hero.breadcrumbCurrent) || etText.breadcrumbCurrent,
    problemHeading: str(problem.heading) || etText.problemHeading,
    problemP1Strong: str(problem.para1Strong) || etText.problemP1Strong,
    problemP1Text: str(problem.para1Text) || etText.problemP1Text,
    problemP2Strong: str(problem.para2Strong) || etText.problemP2Strong,
    problemP2Text: str(problem.para2Text) || etText.problemP2Text,
    benefitsTag: str(services.tag) || etText.benefitsTag,
    benefitsHeading: str(services.heading) || etText.benefitsHeading,
    benefits: Array.from({ length: 8 }, (_, index) => ({
      title: str(services[`item${index}Title`]) || etText.benefits[index].title,
      desc: str(services[`item${index}Desc`]),
    })).filter((item) => item.title),
    statsTag: str(stats.tag) || etText.statsTag,
    statsHeading: str(stats.heading) || etText.statsHeading,
    stats: [1, 2, 3, 4].map((index) => ({
      number: str(stats[`stat${index}Number`]) || etText.stats[index - 1].number,
      label: str(stats[`stat${index}Label`]) || etText.stats[index - 1].label,
    })),
    statsImageAlt: str(stats.imageAlt) || etText.statsImageAlt,
  };
}

function getText(locale: Locale): CareersText {
  if (locale === "et") return etText;
  return localizedText(locale);
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

export default function TuleMeileToolePage() {
  return <TuleMeileToolePageView locale="et" />;
}

export function TuleMeileToolePageView({ locale }: { locale: Locale }) {
  const t = getText(locale);

  return (
    <>
      <SeoJsonLd
        etPath="/tule-meile-toole"
        locale={locale}
        serviceName={t.serviceName}
        serviceDescription={t.serviceDescription}
        breadcrumbs={[
          { name: t.breadcrumbHome, etPath: "/" },
          { name: t.breadcrumbCurrent, etPath: "/tule-meile-toole" },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section relative min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={t.ariaLabel}
        >
          <HeroBackgroundImage src="/tuletoole-1.jpg" preload alt="" />
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
                <span className="text-white/90">{t.breadcrumbCurrent}</span>
              </nav>

            </div>
          </div>
        </section>

        {/* How recruitment works */}
        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text={t.problemHeading} className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <strong>{t.problemP1Strong}</strong> {t.problemP1Text}
                </div>
                <div>
                  <strong>{t.problemP2Strong}</strong> {t.problemP2Text}
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
                  {t.benefitsTag}
                </div>
                <TwoToneHeading text={t.benefitsHeading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.benefits.map((item, i) => (
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
                        {item.desc ? <p className="text-[15px] text-[#5a6474] leading-[1.6]">{item.desc}</p> : null}
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
                    {t.statsTag}
                  </div>
                  <TwoToneHeading text={t.statsHeading} className="mb-8" />

                  <div className="flex flex-wrap gap-4">
                    {t.stats.map((stat, i) => (
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
                    alt={t.statsImageAlt}
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
        <TooleAnnouncements locale={locale} />

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
