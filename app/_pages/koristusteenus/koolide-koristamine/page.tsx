"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import HeroBackgroundImage from "../../../components/HeroBackgroundImage";
import Footer from "../../../components/Footer";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import Hinnakalkulaator from "../../../components/Hinnakalkulaator";
import SeoJsonLd from "../../../components/SeoJsonLd";
import TestimonialSlider from "../../../components/TestimonialSlider";
import Tooprotsess from "../../../components/Tooprotsess";
import { localizePath, type Locale } from "@/lib/slug-map";
import { getLocalizedContent } from "@/lib/localized-content";

type ContentRecord = Record<string, unknown>;

interface SchoolCleaningText {
  serviceName: string;
  serviceDescription: string;
  ariaLabel: string;
  heroChips: { value: string; label: string }[];
  h1Line1: string;
  h1Line2: string;
  heroDescription: string;
  ctaButton: string;
  breadcrumbHome: string;
  breadcrumbService: string;
  breadcrumbCurrent: string;
  problemHeading: string;
  problemP1Strong: string;
  problemP1Text: string;
  problemP2Strong1: string;
  problemP2Text1: string;
  problemP2After: string;
  servicesTag: string;
  servicesHeading: string;
  services: { bold: string; desc: string }[];
  whyUsTag: string;
  whyUsHeading: string;
  whyUsImage: string;
  whyUsImageAlt: string;
  whyUs: { title: string; desc: string }[];
  pricingTag: string;
  pricingHeading: string;
  pricingDescription: string;
  pricingNote: string;
  testimonialsTag: string;
  testimonialsHeading: string;
  testimonials: { quote: string; shortQuote: string }[];
  tarmoAuthor: string;
  caseStudyText: string;
  processTitle: string;
  processIntro: string;
  processSteps: [string, string][];
  footerTitle: string;
  footerDescription: string;
  faq: { q: string; a: string }[];
}

const etText: SchoolCleaningText = {
  serviceName: "Koolide koristamine Tallinnas",
  serviceDescription: "Koolide ja haridusasutuste professionaalne koristamine Tallinnas.",
  ariaLabel: "Koolide koristamine",
  heroChips: [
    { value: "Lastele ohutud", label: "vahendid" },
    { value: "ISO 9001", label: "sertifitseeritud" },
    { value: "Hommikune", label: "desinfitseerimine" },
  ],
  h1Line1: "Koolide ja lasteaedade",
  h1Line2: "koristamine",
  heroDescription: '<strong class="text-white font-medium">Tervishoiukeskne koristus</strong>, mis aitab vähendada õpilaste haigestumisi. Sertifitseeritud vahendid, mis on lastele ohutud.',
  ctaButton: "Küsi kooli koristuse pakkumist",
  breadcrumbHome: "Avaleht",
  breadcrumbService: "Koristusteenus",
  breadcrumbCurrent: "Koolide koristamine",
  problemHeading: "Koolikoristus on rohkem kui lihtsalt puhtus. See on ka laste tervis",
  problemP1Strong: "Koolides ja lasteaedades on puhtus õppimise alus.",
  problemP1Text: "Ukselingid, käsipuud, söökla tasapinnad, WC-d ja spordisaalid vajavad süsteemset lähenemist, mitte tavalist igapäevakoristust.",
  problemP2Strong1: "SPS Grupp on koristanud Tallinna koole ja lasteaedasid aastaid.",
  problemP2Text1: "Me teame, millised alad vajavad erilist tähelepanu ja millised puhastusvahendid on laste ümbruses ohutud. Meie tervishoiukeskne koristusprotokoll tagab, et kõige rohkem käidavad pinnad saavad põhjaliku ja regulaarse puhastuse.",
  problemP2After: "Tulemuseks on keskkond, kus lapsed saavad keskenduda õppimisele ja õpetajad õpetamisele.",
  servicesTag: "Teenuse sisu",
  servicesHeading: "Mida sisaldab koolide koristusteenus?",
  services: [
    { bold: "Hommikune desinfitseerimine enne laste saabumist", desc: "" },
    { bold: "Klassiruumide ja ühisalade igapäevane hooldus", desc: "" },
    { bold: "WC-ruumide põhjalik desinfitseerimine ja tarvikute täiendamine", desc: "" },
    { bold: "Söökla ja köögi sanitaarhooldus", desc: "toitlustusnormide järgi" },
    { bold: "Spordisaali ja riietusruumide puhastus", desc: "" },
    { bold: "Käsipuude, ukselinkide ja lülitite regulaarne desinfitseerimine", desc: "" },
    { bold: "Akende pesu, põrandate hooldus, vaipade puhastus", desc: "" },
    { bold: "Kiirreageerimine", desc: "viirushaiguste puhangud, ürituste järel" },
    { bold: "Igakuine terviseaudit ja raport koolijuhtkonnale", desc: "" },
  ],
  whyUsTag: "Miks meie",
  whyUsHeading: "Miks Tallinna koolid valivad SPS Grupi?",
  whyUsImage: "/koolide-koristamine2.jpg",
  whyUsImageAlt: "Koolide koristamine SPS Grupp",
  whyUs: [
    { title: "Lastele ohutud vahendid", desc: "Kasutame EL-i standarditele vastavaid puhastusvahendeid, mis on kasutamiseks lastele mõeldud keskkondades." },
    { title: "Tervishoiukeskne lähenemine", desc: "Meie tööplaan pöörab erilist tähelepanu sageli puudutatavatele pindadele ja suure kasutuskoormusega ruumidele. Süsteemne koristus aitab hoida koolikeskkonna puhtamana ja toetab üldist hügieeni." },
    { title: "Hommikune ja õhtune režiim", desc: "Desinfitseerimine enne laste saabumist ja pärast lahkumist. Me ei sega õppetööd." },
    { title: "Igakuine terviseaudit", desc: "Saadame igakuise raporti töödest, mida tuvastasime, mida soovitame parandada. See on läbipaistev partnerlus kooliga." },
  ],
  pricingTag: "Hind",
  pricingHeading: "Millest sõltub kooli koristuse hind?",
  pricingDescription: "Kooli koristuse hind sõltub hoone suurusest, õpilaste arvust ja koristusrežiimist.",
  pricingNote: "Regulaarne puhastamine ja desinfitseerimine aitab vähendada viiruste ja bakterite levikut eriti talvel, kui liiguvad ringi viirushaigused. Ka õpetajad ei jää nii tihti haigeks ning pole vaja leida asendajaid.",
  testimonialsTag: "Klientide tagasiside",
  testimonialsHeading: "Mida ütlevad meie koolikliendid",
  testimonials: [
    { quote: "Soovime avaldada tunnustust koolimaja koristusega tegelevale meeskonnale väga hea töö eest. Koolimaja on olnud puhas, korras ja hooldatud ning on näha, et koristustöid tehakse järjepidevalt ja kohusetundlikult.", shortQuote: "Koolimaja on olnud puhas, korras ja hooldatud. Puhtus ja korrashoid mõjutavad igapäevaselt nii õpilaste, õpetajate kui ka kogu personali heaolu." },
    { quote: "Soovin jagada positiivset tagasisidet koolimaja koristuse kohta. Koolimaja on puhas, korras ja hästi hooldatud. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna nii õpilastele kui ka personalile.", shortQuote: "Koolimaja on puhas, korras ja hästi hooldatud. Puhtus ja kord loovad meeldiva õpi- ja töökeskkonna." },
    { quote: "Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna.", shortQuote: "Pidev koristuskvaliteedi jälgimine aitab hoida puhta ja meeldiva õpikeskkonna." },
  ],
  tarmoAuthor: "Tehnikakõrgkooli arendusprorektor Tarmo",
  caseStudyText: "<strong>Tehnikakõrgkooli lahendus:</strong> ligi 2800 õppijaga kõrgkooli puhul kaardistasime kriitilised alad (peakoridorid, söökla, WC-ruumid, spordisaal). Rakendasime hommikuse desinfitseerimisprotokolli ja õhtuse sügava sanitaarhoolduse. 6 nädala jooksul vähenesid haiguspäevad oluliselt.",
  processTitle: "Kuidas SPS koolikoristuse käivitab?",
  processIntro: "Haridusasutuse koristus algab päevakava, liikumisteede ja hügieeniriskide kaardistamisest.",
  processSteps: [
    ["Ruumide ja päevakava ülevaatus", "Kaardistame klassid, sööklad, spordisaalid, sanitaarruumid, sissepääsud ja õppetöö ajad."],
    ["Hügieenipunktide määramine", "Märgime pinnad ja alad, mis vajavad sagedasemat puhastust või desinfitseerimist."],
    ["Tööplaani koostamine", "Kirjeldame hommikused, päevased, õhtused ja perioodilised tööd ning vastutuse."],
    ["Meeskonna juhendamine", "Teenindajad saavad juhised lastega keskkonnas liikumiseks, vahendite kasutamiseks ja suhtluseks."],
    ["Kontroll ja tagasiside", "Objektijuht jälgib tööde täitmist ja kohandab sagedust vastavalt kooli tegelikule kasutusele."],
  ],
  footerTitle: "Tellige kooli tasuta koristusauditi",
  footerDescription: "Tuleme kohale, hindame teie kooli või lasteaia hetkeolukorda ja koostame tervishoiukeskse plaani. Auditi käigus analüüsime hoolduskulusid, tuvastame probleemkohad ja esitame 3 erinevat hinnapakkumist.",
  faq: [
    { q: "Kuidas aitab süsteemne koristus haiguste levikut vähendada?", a: "Regulaarne koristus ja sageli puudutatavate pindade nõuetekohane puhastamine aitavad vähendada saastet ning toetavad kooli üldist hügieeni. Tegelik mõju sõltub koristuskorraldusest, ruumide kasutusest ja teiste ennetusmeetmete järgimisest." },
    { q: "Millised alad koolis vajavad erilist tähelepanu?", a: "Erilist tähelepanu vajavad sageli puudutatavad pinnad, nagu käepidemed, lauad, toolid ja lülitid, samuti WC-ruumid, söökla, spordiruumid ning teised suure kasutuskoormusega alad." },
    { q: "Kas puhastusvahendid on lastele ohutud?", a: "Kasutame tööks sobivaid ja EL-i nõuetele vastavaid puhastusvahendeid ning järgime tootja kasutus- ja ohutusjuhiseid. Vahendid valime ruumi, pinna ja kooli eritingimuste järgi." },
    { q: "Kas koristus segab õppetööd?", a: "Ei. Põhiline koristus toimub hommikul enne õppetundide algust ja õhtul pärast tundide lõppu. Päevane töö piirdub avalike alade kiirreageerimisega." },
    { q: "Kas osalete ka riigihangetel?", a: "Jah, osaleme aktiivselt koolide koristuse riigihangetel. Omame vajalikku kvalifikatsiooni, ISO sertifikaate ja kogemust." },
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

const tarmoAuthorByLocale: Record<Locale, string> = {
  et: etText.tarmoAuthor,
  en: "Tarmo, Development Prorector at Tallinn University of Applied Sciences",
  ru: "Тармо, проректор по развитию Таллиннского технического колледжа",
};

function localizedText(locale: Exclude<Locale, "et">): SchoolCleaningText {
  const content = asRecord(getLocalizedContent(locale, "koolideKoristamine")) ?? {};
  const seo = asRecord(content.seo) ?? {};
  const hero = asRecord(content.hero) ?? {};
  const problem = asRecord(content.problem) ?? {};
  const services = asRecord(content.services) ?? {};
  const whyUs = asRecord(content.whyUs) ?? {};
  const pricing = asRecord(content.pricing) ?? {};
  const testimonials = asRecord(content.testimonials) ?? {};
  const caseStudy = asRecord(content.caseStudy) ?? {};
  const process = asRecord(content.tooprotsess) ?? {};
  const footerCta = asRecord(content.footerCta) ?? {};
  const faq = asRecord(content.faq) ?? {};

  return {
    serviceName: str(seo.serviceName) || etText.serviceName,
    serviceDescription: str(seo.serviceDescription) || etText.serviceDescription,
    ariaLabel: str(hero.ariaLabel) || etText.ariaLabel,
    heroChips: [
      { value: str(hero.chip1Badge) || etText.heroChips[0].value, label: str(hero.chip1Label) || etText.heroChips[0].label },
      { value: str(hero.chip2Badge) || "ISO 9001", label: str(hero.chip2Label) || etText.heroChips[1].label },
      { value: str(hero.chip3Badge) || etText.heroChips[2].value, label: str(hero.chip3Label) || etText.heroChips[2].label },
    ],
    h1Line1: str(hero.h1Line1) || etText.h1Line1,
    h1Line2: str(hero.h1Line2),
    heroDescription: heroStrong(str(hero.description) || etText.heroDescription),
    ctaButton: str(hero.ctaButton) || etText.ctaButton,
    breadcrumbHome: str(hero.breadcrumbHome) || etText.breadcrumbHome,
    breadcrumbService: str(hero.breadcrumbService) || etText.breadcrumbService,
    breadcrumbCurrent: str(hero.breadcrumbCurrent) || etText.breadcrumbCurrent,
    problemHeading: str(problem.heading) || etText.problemHeading,
    problemP1Strong: str(problem.para1Strong) || etText.problemP1Strong,
    problemP1Text: str(problem.para1Text),
    problemP2Strong1: str(problem.para2Strong1) || etText.problemP2Strong1,
    problemP2Text1: str(problem.para2Text1) || etText.problemP2Text1,
    problemP2After: str(problem.para2After) || etText.problemP2After,
    servicesTag: str(services.tag) || etText.servicesTag,
    servicesHeading: str(services.heading) || etText.servicesHeading,
    services: Array.from({ length: 9 }, (_, index) => ({
      bold: str(services[`item${index}Title`]) || etText.services[index].bold,
      desc: str(services[`item${index}Desc`]),
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
    pricingNote: str(pricing.note) || etText.pricingNote,
    testimonialsTag: str(testimonials.tag) || etText.testimonialsTag,
    testimonialsHeading: str(testimonials.heading) || etText.testimonialsHeading,
    testimonials: [0, 1, 2].map((index) => ({
      quote: str(testimonials[`item${index}Quote`]) || etText.testimonials[index].quote,
      shortQuote: str(testimonials[`item${index}Short`]) || etText.testimonials[index].shortQuote,
    })),
    tarmoAuthor: tarmoAuthorByLocale[locale],
    caseStudyText: str(caseStudy.text) || etText.caseStudyText,
    processTitle: str(process.title) || etText.processTitle,
    processIntro: str(process.intro) || etText.processIntro,
    processSteps: [0, 1, 2, 3, 4].map((index) => [
      str(process[`step${index}Title`]) || etText.processSteps[index][0],
      str(process[`step${index}Desc`]) || etText.processSteps[index][1],
    ] as [string, string]),
    footerTitle: str(footerCta.title) || etText.footerTitle,
    footerDescription: str(footerCta.description) || etText.footerDescription,
    faq: [0, 1, 2, 3, 4].map((index) => ({
      q: str(faq[`q${index}`]) || etText.faq[index].q,
      a: str(faq[`a${index}`]) || etText.faq[index].a,
    })),
  };
}

function getText(locale: Locale): SchoolCleaningText {
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

export default function KoolideKoristamine() {
  return <KoolideKoristaminePageView locale="et" />;
}

export function KoolideKoristaminePageView({ locale }: { locale: Locale }) {
  const t = getText(locale);
  const pricingCtaLabel = { et: "Küsi hinnapakkumist", en: "Request a quote", ru: "Запросить ценовое предложение" }[locale];
  const testimonialMeta = [
    { author: "Kalev", initials: "K", logo: "/arvamused-logod/kalev.png" as string | undefined },
    { author: "Pille", initials: "P", logo: "/arvamused-logod/pille.png" as string | undefined },
    { author: t.tarmoAuthor, initials: "T", logo: undefined },
  ];

  return (
    <>
      <SeoJsonLd
        etPath="/koolide-koristamine"
        locale={locale}
        serviceName={t.serviceName}
        serviceDescription={t.serviceDescription}
        breadcrumbs={[
          { name: t.breadcrumbHome, etPath: "/" },
          { name: t.breadcrumbService, etPath: "/koristusteenus" },
          { name: t.breadcrumbCurrent, etPath: "/koolide-koristamine" },
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
          <HeroBackgroundImage src="/koolide-koristamine4.jpg" preload alt="" />
          {/* Floating chips */}
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
                border: "1px solid rgba(133, 203, 233, 0.2)"
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
                  onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4"
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
                <Link href={localizePath("/koristusteenus", locale)} className="text-white/80 no-underline hover:text-white transition-colors">{t.breadcrumbService}</Link>
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
                <strong>{t.problemP1Strong}</strong>{t.problemP1Text ? ` ${t.problemP1Text}` : ""}
              </div>
              <div>
                <strong>{t.problemP2Strong1}</strong> {t.problemP2Text1}<br /><br />
                {t.problemP2After}
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
              {t.services.map((item, i) => (
                <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                  <div className="text-[#5a6474] text-[15px] mb-2">
                    <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">
                      {String(i + 1).padStart(2, '0')}.
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
                <div
                  className="mb-8 text-[16px] text-[#2f353f] leading-[1.75] font-light [&_strong]:text-[#17345a] [&_strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: t.pricingNote }}
                />
              </div>

              <Hinnakalkulaator locale={locale} />
            </div>

            <div className="text-center mt-12">
              <a
                href="#pakkumine"
                onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer"
              >
                {pricingCtaLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
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
                {t.testimonialsTag}
              </div>
              <TwoToneHeading text={t.testimonialsHeading} />
            </div>

            <TestimonialSlider testimonials={t.testimonials.map((item, i) => ({
              quote: item.quote,
              shortQuote: item.shortQuote,
              author: testimonialMeta[i].author,
              initials: testimonialMeta[i].initials,
              logo: testimonialMeta[i].logo,
            }))} />

            {/* Case study + video */}
            <div className="mt-12 max-w-[900px] mx-auto">
              <div className="bg-white rounded-2xl p-10 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]">
                <p
                  className="text-[16px] text-[#2f353f] leading-[1.8] font-light [&_strong]:text-[#17345a]"
                  dangerouslySetInnerHTML={{ __html: t.caseStudyText }}
                />
              </div>
              <div className="mt-8 w-full md:w-3/4 mx-auto">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <video
                    src="/SPS-TarmoSildberg.mp4"
                    controls
                    preload="none"
                    poster="/TarmoHero.jpg"
                    className="w-full h-auto"
                    style={{ borderRadius: "24px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Tööprotsess */}
        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title={t.processTitle}
          intro={t.processIntro}
          steps={t.processSteps}
          locale={locale}
        />
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
