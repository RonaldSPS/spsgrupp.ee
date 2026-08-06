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
import Hinnakalkulaator from "../components/Hinnakalkulaator";
import MaintenancePriceExamples from "../components/MaintenancePriceExamples";
import SeoJsonLd from "../components/SeoJsonLd";
import { localizePath, type Locale } from "@/lib/slug-map";
import { getLocalizedContent } from "@/lib/localized-content";

type ContentRecord = Record<string, unknown>;

interface CleaningHubText {
  serviceName: string;
  serviceDescription: string;
  ariaLabel: string;
  heroChips: { value: string; label: string }[];
  h1Line1: string;
  h1Line2: string;
  heroDescription: string;
  ctaButton: string;
  breadcrumbHome: string;
  breadcrumbServices: string;
  breadcrumbCurrent: string;
  problemHeading: string;
  problemP1: string;
  problemP2Strong1: string;
  problemP2After1: string;
  problemP2Strong2: string;
  problemP2After2: string;
  servicesTag: string;
  servicesHeading: string;
  services: { bold: string; desc: string; href?: string }[];
  whyUsTag: string;
  whyUsHeading: string;
  whyUsImage: string;
  whyUsImageAlt: string;
  whyUs: { title: string; desc: string }[];
  pricingTag: string;
  pricingHeading: string;
  pricingDescription: string;
  footerTitle: string;
  footerDescription: string;
  faq: { q: string; a: string }[];
}

const etText: CleaningHubText = {
  serviceName: "Koristusteenus Tallinnas",
  serviceDescription: "Regulaarne koristusteenus kontoritele, kaubanduspindadele ja tootmishoonetele Tallinnas. ISO 9001, paindlik graafik.",
  ariaLabel: "Koristusteenus",
  heroChips: [
    { value: "Üle 1 000 000 m²", label: "meie hoolduses" },
    { value: "ISO 9001 & 14001", label: "sertifitseeritud" },
    { value: "300+ koolitatud", label: "töötajat" },
  ],
  h1Line1: "Regulaarne koristusteenus äripindadele",
  h1Line2: "Tallinnas ja Harjumaal",
  heroDescription: 'Kontorite, kaubanduspindade ja tootmishoonete igapäevane hooldus. Paindlik graafik, koolitatud personal ja regulaarne kvaliteedikontroll. Hind alates <strong class="text-white font-medium">1,20 €/m²</strong>.',
  ctaButton: "Küsi tasuta koristusteenuse pakkumist",
  breadcrumbHome: "Avaleht",
  breadcrumbServices: "Koristusteenused",
  breadcrumbCurrent: "Koristusteenus",
  problemHeading: "Kas teie praegune koristaja hoolib päriselt teie ärist?",
  problemP1: "Üks probleem, mida kuuleme päris tihti: &quot;Koristaja küll käib, aga midagi on ikkagi valesti.&quot; Tolm koguneb kappide peale. Prügikastid on õhtul täis. WC-s lõppevad tarvikud. Serveriruumi ei puudutata, sest keegi ei julge.",
  problemP2Strong1: "Äripindade koristus ei ole lihtsalt kiire töö, vaid läbimõeldud süsteem, mis peab arvestama hoone kasutuse ja ettevõtte töökorraldusega.",
  problemP2After1: "Kontoris on kaableid ja tehnikat, mida ei tohi märjalt käsitleda. Kaubanduspinnal on kõrge liiklus ja tootmishoonetes kehtivad ranged ohutusnõuded.",
  problemP2Strong2: "Oleme alates 2006. aastast kujundanud välja toimiva teenindus- ja kvaliteedijuhtimise süsteemi.",
  problemP2After2: "",
  servicesTag: "Teenuse sisu",
  servicesHeading: "Millistele äripindadele SPS Grupp koristusteenust pakub?",
  services: [
    { bold: "Kontorikoristus", desc: "büroode igapäevane hooldus, kohandatud IT-keskkonnale", href: "/koristusteenus/kontori-koristus" },
    { bold: "Kaubanduspindade koristus", desc: "poed, kaubanduskeskused, esindused", href: "/koristusteenus/kaubanduspindade-koristus" },
    { bold: "Tootmishoonete koristus", desc: "tööstuspinnad, laod, tootmiskeskkond", href: "/koristusteenus/tootmishoonete-koristus" },
    { bold: "Koolide ja lasteaedade koristamine", desc: "tervishoiukeskne lähenemine", href: "/koolide-koristamine" },
    { bold: "Esindus- ja vastuvõtupindade erihooldus", desc: "" },
    { bold: "Ühiskasutatavate alade hooldus", desc: "koridorid, trepikojad, liftid" },
    { bold: "Sanitaarruumide desinfitseerimine", desc: "tarvikutega varustamine" },
    { bold: "Paindlik graafik", desc: "iga päev, 2–5 korda nädalas või soovitud sagedusega" },
  ],
  whyUsTag: "Miks meie",
  whyUsHeading: "Mis eristab SPS Grupi koristusteenust turul?",
  whyUsImage: "/Koristusteenus2.jpg",
  whyUsImageAlt: "SPS Grupp koristusteenus",
  whyUs: [
    { title: "Digitaalne kvaliteedikontroll", desc: "Objektijuht jälgib regulaarselt töö kvaliteeti ning aitab puudused kiiresti lahendada." },
    { title: "Kontrollitud personal", desc: "Iga töötaja allkirjastab konfidentsiaalsuslepingu. Teie vara ja dokumentatsioon on turvalistes kätes." },
    { title: "ISO 14001 keskkonnajuhtimine", desc: "Eelistame sertifitseeritud ja väiksema keskkonnamõjuga puhastusvahendeid kõikjal, kus pind ja ohutusnõuded seda võimaldavad. Järgime ISO 14001 standardit." },
    { title: "Paindlikkus ja kiire reageerimine", desc: "Ürituste järgne koristus, hädaolukorrad, muutuv graafik — kohandame end teie äri tempoga, mitte vastupidi." },
  ],
  pricingTag: "Hind",
  pricingHeading: "Kuidas kujuneb koristusteenuse hind?",
  pricingDescription: "Koristusteenuse hind sõltub neljast tegurist: pindala (€/m²), koristuse sagedus (2–5 korda nädalas), eritööde vajadus ja objekti tüüp.",
  footerTitle: "Tellige tasuta koristusteenuse analüüs",
  footerDescription: "Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust. Pakkumise tähtaeg sõltub töö iseloomust ja objekti ülevaatuse vajadusest.",
  faq: [
    { q: "Kui sageli peaks äripindu koristama?", a: "Enamikule kontoritele soovitame 3–5 korda nädalas. Kaubanduspinnad vajavad päevakoristust, tootmishooned sõltuvad tootmisprotsessist. Avalikud alad ja sanitaarruumid vajavad igapäevast hooldust. Täpne graafik koostatakse tasuta konsultatsiooni käigus." },
    { q: "Kui kiiresti saab regulaarse koristusteenusega alustada?", a: "Tööde algusaeg lepitakse kokku pärast mahu ja meeskonna saadavuse hindamist." },
    { q: "Kas koristusteenus toimub tööajal või väljaspool seda?", a: "Enamik ettevõtteid eelistab koristust töövälisel ajal. Tavaliselt toimub koristus varahommikul enne kella 8.00 või õhtuti pärast kella 18.00. Kohandame graafiku teie tööajaga, et koristus ei segaks igapäevatööd." },
    { q: "Mis juhtub, kui koristuskvaliteet ei vasta ootustele?", a: "Objektijuht jälgib regulaarselt töö kvaliteeti ning aitab puudused kiiresti lahendada. Meie tegevus on kaetud vastutuskindlustusega vastavalt kindlustuslepingu tingimustele." },
    { q: "Kas kasutate keskkonnasõbralikke puhastusvahendeid?", a: "Eelistame sertifitseeritud ja väiksema keskkonnamõjuga puhastusvahendeid kõikjal, kus puhastatav pind ja ohutusnõuded seda võimaldavad. Järgime ISO 14001 keskkonnajuhtimissüsteemi nõudeid." },
  ],
};

function asRecord(value: unknown): ContentRecord | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as ContentRecord;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function heroStrong(html: string): string {
  return html.replaceAll("<strong>", '<strong class="text-white font-medium">');
}

function localizedText(locale: Exclude<Locale, "et">): CleaningHubText {
  const content = asRecord(getLocalizedContent(locale, "koristusteenus")) ?? {};
  const seo = asRecord(content.seo) ?? {};
  const hero = asRecord(content.hero) ?? {};
  const problem = asRecord(content.problem) ?? {};
  const services = asRecord(content.services) ?? {};
  const whyUs = asRecord(content.whyUs) ?? {};
  const pricing = asRecord(content.pricing) ?? {};
  const footerCta = asRecord(content.footerCta) ?? {};
  const faq = asRecord(content.faq) ?? {};

  return {
    serviceName: str(seo.serviceName) || etText.serviceName,
    serviceDescription: str(seo.serviceDescription) || etText.serviceDescription,
    ariaLabel: str(hero.ariaLabel) || etText.ariaLabel,
    heroChips: [
      { value: str(hero.chip1Title) || etText.heroChips[0].value, label: str(hero.chip1Sub) || etText.heroChips[0].label },
      { value: str(hero.chip2Title) || etText.heroChips[1].value, label: str(hero.chip2Sub) || etText.heroChips[1].label },
      { value: str(hero.chip3Title) || etText.heroChips[2].value, label: str(hero.chip3Sub) || etText.heroChips[2].label },
    ],
    h1Line1: str(hero.h1Line1) || etText.h1Line1,
    h1Line2: str(hero.h1Line2),
    heroDescription: heroStrong(str(hero.description) || etText.heroDescription),
    ctaButton: str(hero.ctaButton) || etText.ctaButton,
    breadcrumbHome: str(hero.breadcrumbHome) || etText.breadcrumbHome,
    breadcrumbServices: str(hero.breadcrumbServices) || etText.breadcrumbServices,
    breadcrumbCurrent: str(hero.breadcrumbCurrent) || etText.breadcrumbCurrent,
    problemHeading: str(problem.heading) || etText.problemHeading,
    problemP1: str(problem.paragraph1) || etText.problemP1,
    problemP2Strong1: str(problem.paragraph2Strong1) || etText.problemP2Strong1,
    problemP2After1: str(problem.paragraph2After1) || etText.problemP2After1,
    problemP2Strong2: str(problem.paragraph2Strong2) || etText.problemP2Strong2,
    problemP2After2: str(problem.paragraph2After2),
    servicesTag: str(services.tag) || etText.servicesTag,
    servicesHeading: str(services.heading) || etText.servicesHeading,
    services: Array.from({ length: 8 }, (_, index) => ({
      bold: str(services[`item${index}Title`]) || etText.services[index].bold,
      desc: str(services[`item${index}Desc`]),
      href: etText.services[index].href,
    })).filter((item) => item.bold),
    whyUsTag: str(whyUs.tag) || etText.whyUsTag,
    whyUsHeading: str(whyUs.heading) || etText.whyUsHeading,
    whyUsImage: str(whyUs.image) || etText.whyUsImage,
    whyUsImageAlt: str(whyUs.imageAlt) || etText.whyUsImageAlt,
    whyUs: [0, 1, 2, 3].map((index) => ({
      title: str(whyUs[`reason${index}Title`]) || etText.whyUs[index].title,
      desc: str(whyUs[`reason${index}Desc`]) || etText.whyUs[index].desc,
    })),
    pricingTag: str(pricing.tag) || etText.pricingTag,
    pricingHeading: str(pricing.heading) || etText.pricingHeading,
    pricingDescription: str(pricing.description) || etText.pricingDescription,
    footerTitle: str(footerCta.title) || etText.footerTitle,
    footerDescription: str(footerCta.description) || etText.footerDescription,
    faq: [0, 1, 2, 3, 4].map((index) => ({
      q: str(faq[`q${index}`]) || etText.faq[index].q,
      a: str(faq[`a${index}`]) || etText.faq[index].a,
    })),
  };
}

function getText(locale: Locale): CleaningHubText {
  if (locale === "et") return etText;
  return localizedText(locale);
}

const whyUsIcons = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

const chipTones = ["blue", "green", "navy"] as const;
const chipIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
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

export default function Koristusteenus() {
  return <KoristusteenusPageView locale="et" />;
}

export function KoristusteenusPageView({ locale }: { locale: Locale }) {
  const t = getText(locale);

  return (
    <>
      <SeoJsonLd
        etPath="/koristusteenus"
        locale={locale}
        serviceName={t.serviceName}
        serviceDescription={t.serviceDescription}
        breadcrumbs={[
          { name: t.breadcrumbHome, etPath: "/" },
          { name: t.breadcrumbCurrent, etPath: "/koristusteenus" },
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
          <HeroBackgroundImage src="/Koristusteenused-HERO.jpg" preload alt="" />
          {/* Floating chips */}
          <div className="absolute bottom-[120px] right-[5%] flex gap-[20px] z-20 hidden md:flex">
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
                {t.h1Line1}<br />
                <span className="text-[#3abeff]">{t.h1Line2}</span>
              </h1>
              <p
                className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light"
                dangerouslySetInnerHTML={{ __html: t.heroDescription }}
              />
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a
                  href="#pakkumine"
                  className="btn-primary text-[15px] py-2.5 px-4"
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  {t.ctaButton}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  662 3328
                </Link>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href={localizePath("/", locale)} className="text-white/80 no-underline hover:text-white transition-colors">{t.breadcrumbHome}</Link>
                <span className="text-white/50">/</span>
                <Link href={localizePath("/koristusteenus", locale)} className="text-white/80 no-underline hover:text-white transition-colors">{t.breadcrumbServices}</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{t.breadcrumbCurrent}</span>
              </nav>

            </div>
          </div>
        </section>

        {/* Problem Block */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text={t.problemHeading} className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>{t.problemP1}</strong>
              </div>
              <div>
                <strong>{t.problemP2Strong1}</strong> {t.problemP2After1}
                <br /><br />
                <strong>{t.problemP2Strong2}</strong>{t.problemP2After2 ? ` ${t.problemP2After2}` : ""}
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
                {t.servicesTag}
              </div>
              <TwoToneHeading text={t.servicesHeading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.services.map((item, i) => {
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
                    href={localizePath(item.href, locale)}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-all duration-300 border border-transparent hover:scale-105 hover:shadow-lg hover:border-[#85cbe9] hover:bg-white/60 cursor-pointer no-underline"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div
                    key={i}
                    className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80"
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
                {t.whyUsTag}
              </div>
              <TwoToneHeading text={t.whyUsHeading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
              <div className="grid grid-cols-1 gap-2">
                {t.whyUs.map((item, i) => (
                  <div key={i} className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        {whyUsIcons[i % whyUsIcons.length]}
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
                  src={t.whyUsImage}
                  alt={t.whyUsImageAlt}
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
                {t.pricingTag}
              </div>
              <TwoToneHeading text={t.pricingHeading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
              <div>
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  {t.pricingDescription}
                </p>

                <MaintenancePriceExamples locale={locale} />
              </div>

              <Hinnakalkulaator locale={locale} />
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Lõpu CTA */}
        <ScrollAnimation animation="fade-up">
        <FooterCTA
          title={t.footerTitle}
          description={t.footerDescription}
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
