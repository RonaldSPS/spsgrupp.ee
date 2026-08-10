"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import HeroBackgroundImage from "../../../components/HeroBackgroundImage";
import Footer from "../../../components/Footer";
import TestimonialSlider from "../../../components/TestimonialSlider";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import Tooprotsess from "../../../components/Tooprotsess";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import Hinnakalkulaator from "../../../components/Hinnakalkulaator";
import SeoJsonLd from "../../../components/SeoJsonLd";
import { localizePath, type Locale } from "@/lib/slug-map";
import { getLocalizedContent } from "@/lib/localized-content";

type ContentRecord = Record<string, unknown>;

interface OfficeCleaningText {
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
  problemP2Strong2: string;
  problemP2Text2: string;
  servicesTag: string;
  servicesHeading: string;
  services: { bold: string; desc: string }[];
  servicesLinksLabel: string;
  servicesLinks: string[];
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
  processTitle: string;
  processIntro: string;
  processSteps: [string, string][];
  footerTitle: string;
  footerDescription: string;
  faq: { q: string; a: string }[];
}

const etText: OfficeCleaningText = {
  serviceName: "Kontori koristus Tallinnas",
  serviceDescription: "Regulaarne kontorikoristus vähemalt 800 m² büroodele Tallinnas ja Harjumaal, alates 1,20 €/m² kuus. Paindlik graafik, koolitatud personal, ISO 9001 ja ISO 14001.",
  ariaLabel: "Kontori koristus",
  heroChips: [
    { value: "50+", label: "kontorit" },
    { value: "ISO 9001", label: "sertifitseeritud" },
    { value: "Kontrollitud", label: "personal" },
  ],
  h1Line1: "Kontori koristus",
  h1Line2: "Tallinnas ja Harjumaal",
  heroDescription: 'Regulaarne kontorikoristus vähemalt 800 m² büroodele Tallinnas ja Harjumaal, alates <strong class="text-white font-medium">1,20 €/m² kuus</strong>. Paindlik graafik, koolitatud personal ja regulaarne kvaliteedikontroll.',
  ctaButton: "Küsi kontori koristuse pakkumist",
  breadcrumbHome: "Avaleht",
  breadcrumbService: "Koristusteenus",
  breadcrumbCurrent: "Kontori koristus",
  problemHeading: "Kas teie praegune koristusteenus vastab ettevõtte ootustele?",
  problemP1Strong: "Paljud ettevõtted on olukorras, kus koristaja küll käib, aga tulemus ei rahulda.",
  problemP1Text: "Tolm koguneb kappide peale, prügikastid on hommikul endiselt täis ja WC-s lõpevad tarvikud kõige ebasobivamal hetkel. Töötajad märkavad ja kliendid samuti.",
  problemP2Strong1: "Kontori puhtus mõjutab töötajate heaolu ja klientide esmamuljet.",
  problemP2Text1: "Puhas ja hügieeniline töökeskkond aitab toetada töötajate heaolu ja vähendada nakkuste leviku riski.",
  problemP2Strong2: "SPS Grupis läbib iga koristaja koolituse just kontorikeskkonna jaoks.",
  problemP2Text2: "Me teame, kuidas käsitleda IT-tehnikat, tundlikke dokumente ja esinduspindu nii, et te ei pea enam muretsema.",
  servicesTag: "Teenuse sisu",
  servicesHeading: "Mida sisaldab kontori koristusteenus?",
  services: [
    { bold: "Põrandate igapäevane puhastus ja hooldus", desc: "kõik põrandatüübid" },
    { bold: "Tööpindade ja mööbli tolmutamine ning desinfitseerimine", desc: "" },
    { bold: "Sanitaarruumide põhjalik puhastus", desc: "tarvikute täiendamine" },
    { bold: "Prügi koristamine", desc: "kogumine, sorteerimine ja uute kilekottide paigaldus" },
    { bold: "Kööginurga ja puhkeruumi hooldus", desc: "tasapinnad, mikrolaineahi, kohvimasin" },
    { bold: "Klaaspindade puhastus", desc: "peeglid, klaasseinad" },
    { bold: "IT-tehnika ümbruse antistaatiline puhastus", desc: "" },
    { bold: "Sissepääsu ja esinduspinna erihooldus", desc: "" },
    { bold: "Sageli puudutatavate pindade desinfitseerimine", desc: "ukselingid, lülitid" },
  ],
  servicesLinksLabel: "Vaata lisaks:",
  servicesLinks: ["Akende pesu", "Vaipade puhastus", "Põrandate hooldus", "Desinfitseerimine", "Kontorikoristuse kontrollnimekiri"],
  whyUsTag: "Miks meie",
  whyUsHeading: "Miks üle 50 kontori usaldab koristuse SPS Grupile?",
  whyUsImage: "/kontorikoristus2.jpg",
  whyUsImageAlt: "Koristusfirma kontori koristus",
  whyUs: [
    { title: "Kontorihoolduse kogemus alates 2006. aastast", desc: "Oleme koristanud kõiki kontoritüüpe — väikestest IT-büroodest suurte peakontorite ja ministeeriumideni. Teame, mis töötab ja mis mitte." },
    { title: "Vastutuskindlustusega teenus", desc: "SPS Grupil on kehtiv vastutuskindlustus, mis annab kliendile täiendava kaitse võimalike varakahjude korral." },
    { title: "Konfidentsiaalsus ja andmekaitse", desc: "Iga töötaja allkirjastab konfidentsiaalsuslepingu. Teie dokumentatsioon ja tehnika on turvalistes kätes." },
    { title: "ISO 9001 kvaliteedijuhtimine", desc: "Objektijuhi korraldatud regulaarne kvaliteedikontroll aitab puudused kiiresti tuvastada ja lahendada." },
    { title: "Öko puhastusvahendid", desc: "Vajadusel valime tundlikule töökeskkonnale sobivad vähese lõhna ja väiksema allergeeniohuga puhastusvahendid." },
  ],
  pricingTag: "Hind",
  pricingHeading: "Millest sõltub kontori koristuse hind?",
  pricingDescription: "Kontori koristuse hind kujuneb nelja teguri põhjal: pindala, koristuse sagedus, töötajate arv ja eritööde vajadus.",
  pricingNote: "<strong>TASUTA AUDIT enne lepingu algust</strong><br />Kaardistame teie kontori eripärad ja vajadused<br /><br /><b>Personaalne kliendihaldur</b> on teie kontaktisik, kes tunneb teie ettevõtet ning teostab regulaarseid kontrollkäike.",
  testimonialsTag: "Klientide tagasiside",
  testimonialsHeading: "Mida ütlevad meie kontorikliendid",
  testimonials: [
    { quote: "Soovin edastada tänusõnad ja kiituse väga hea kontorikoristuse eest. Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud. On näha, et tööd tehakse hoolikalt ning kvaliteedile pööratakse tähelepanu.", shortQuote: "Üldine tagasiside on väga positiivne, kontor on puhas, korras ja hästi hooldatud." },
    { quote: "Soovin edastada erakordselt positiivse tagasiside kontorikoristuse kohta. Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel ning see on leidnud positiivset tähelepanu ka meie töötajate seas.", shortQuote: "Kontor on puhas, korras ja hooldatud. Tehtud töö kvaliteet on järjepidevalt kõrgel tasemel." },
    { quote: "Soovin jagada positiivset tagasisidet kontori koristuse kohta. Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea. Oleme puhastusteenuse kvaliteedi ja töö tulemusega väga rahul.", shortQuote: "Kontoriruumid on olnud puhtad ja korras ning üldine mulje on väga hea." },
    { quote: "Puhas ja korrastatud kontor loob parema töökeskkonna nii töötajatele kui ka külastajatele. SPS Grupp on aidanud meil seda taset järjepidevalt hoida. Teenus on professionaalne, kvaliteetne ja hästi korraldatud.", shortQuote: "Puhas ja korrastatud kontor loob parema töökeskkonna. SPS Grupp on aidanud meil seda taset järjepidevalt hoida." },
    { quote: "Suur aitäh koristajale, et ta pani eilsest üritusest jäänud mustad nõud nõudepesumasinasse. Hommikul tuli vastu puhas ja korras kööginurk. Sellised väikesed, kuid väga tähelepanelikud teod jäävad silma ning näitavad hoolivust ja professionaalset suhtumist.", shortQuote: "Suur aitäh koristajale — hommikul tuli vastu puhas ja korras kööginurk. Sellised tähelepanelikud teod jäävad silma." },
  ],
  processTitle: "Kuidas SPS kontorikoristuse käivitab?",
  processIntro: "Parem teenus algab enne esimest koristuskorda. SPS kaardistab kõigepealt, kuidas teie kontor päriselt töötab, ja ehitab tööplaani selle põhjal.",
  processSteps: [
    ["Objekti ülevaatus", "Vaatame üle ruumide suuruse, kasutuskoormuse, põrandatüübid, sanitaarruumid, ligipääsu ja tööajad."],
    ["Tööplaani koostamine", "Kirjeldame alad, sageduse, igapäevased ja perioodilised tööd ning vastutava kontaktisiku."],
    ["Meeskonna ettevalmistus", "Määrame objektile sobiva väljaõppega teenindajad, puhastusvahendid ja vajalikud seadmed."],
    ["Teenuse käivitamine", "Alustame kokkulepitud graafiku järgi ja täpsustame esimestel nädalatel töömahtu tegeliku kasutuse põhjal."],
    ["Kvaliteedikontroll", "Objektijuht kontrollib tulemust, kogub tagasisidet ja lahendab puudused enne, kui neist saab korduv probleem."],
  ],
  footerTitle: "Tellige tasuta kontorikoristuse analüüs",
  footerDescription: "Võtame teiega üldjuhul ühe tööpäeva jooksul ühendust. Pakkumise tähtaeg sõltub töö iseloomust ja objekti ülevaatuse vajadusest.",
  faq: [
    { q: "Kui tihti tuleks kontorit koristada?", a: "Enamikule kontoritest soovitame koristust 3–5 korda nädalas. Tiheda liiklusega alad vajavad igapäevast koristust, väiksemad kontorid saavad hakkama 2–3 korraga nädalas." },
    { q: "Kas kontorikoristus toimub tööajal või väljaspool?", a: "Tavaliselt koristame töövälisel ajal — varahommikul enne tööpäeva algust või õhtul pärast tööaega. Soovi korral saame korraldada ka päevase koristuse madala liiklusega aegadel." },
    { q: "Mida kontori koristus sisaldab?", a: "Tolmuimejaga puhastus, pindade pühkimine, prügi väljaviimine, sanitaarruumide puhastus, köögi ja puhkeala koristus. Lisateenustena pakume akende pesu, vaipade süvapuhastust ja desinfitseerimist." },
    { q: "Kas kasutate keskkonnasõbralikke puhastusvahendeid?", a: "Eelistame sertifitseeritud ja väiksema keskkonnamõjuga puhastusvahendeid kõikjal, kus puhastatav pind ja ohutusnõuded seda võimaldavad. Eritööde puhul valitakse vahendid konkreetse ülesande järgi." },
    { q: "Kui kiiresti saab kontorikoristusega alustada?", a: "Tööde algusaeg lepitakse kokku pärast mahu ja meeskonna saadavuse hindamist." },
  ],
};

const testimonialMeta = [
  { author: "Paul", initials: "P", logo: "/arvamused-logod/paul.png" },
  { author: "Elis", initials: "E", logo: "/arvamused-logod/elis.png" },
  { author: "Ingrid", initials: "I", logo: "/arvamused-logod/ingrid.png" },
  { author: "Kaiti", initials: "K", logo: "/arvamused-logod/kaiti.png" },
  { author: "Käthlin", initials: "K", logo: "/arvamused-logod/kathlin.png" },
];

function asRecord(value: unknown): ContentRecord | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as ContentRecord;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberedItems(section: ContentRecord | undefined, prefix: string, count: number): { bold: string; desc: string }[] {
  const fallback = etText.services;
  return Array.from({ length: count }, (_, index) => ({
    bold: str(section?.[`${prefix}${index}Title`]) || fallback[index]?.bold || "",
    desc: str(section?.[`${prefix}${index}Desc`]),
  })).filter((item) => item.bold);
}

function heroStrong(html: string): string {
  return html.replaceAll("<strong>", '<strong class="text-white font-medium">');
}

function localizedText(locale: Exclude<Locale, "et">): OfficeCleaningText {
  const content = asRecord(getLocalizedContent(locale, "kontoriKoristus")) ?? {};
  const seo = asRecord(content.seo) ?? {};
  const hero = asRecord(content.hero) ?? {};
  const problem = asRecord(content.problem) ?? {};
  const services = asRecord(content.services) ?? {};
  const whyUs = asRecord(content.whyUs) ?? {};
  const pricing = asRecord(content.pricing) ?? {};
  const testimonials = asRecord(content.testimonials) ?? {};
  const process = asRecord(content.tooprotsess) ?? {};
  const footerCta = asRecord(content.footerCta) ?? {};
  const faq = asRecord(content.faq) ?? {};

  return {
    serviceName: str(seo.serviceName) || etText.serviceName,
    serviceDescription: str(seo.serviceDescription) || etText.serviceDescription,
    ariaLabel: str(hero.ariaLabel) || etText.ariaLabel,
    heroChips: [
      { value: "50+", label: str(hero.chip1Label) || etText.heroChips[0].label },
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
    problemP1Text: str(problem.para1Text) || etText.problemP1Text,
    problemP2Strong1: str(problem.para2Strong1) || etText.problemP2Strong1,
    problemP2Text1: str(problem.para2Text1) || etText.problemP2Text1,
    problemP2Strong2: str(problem.para2Strong2) || etText.problemP2Strong2,
    problemP2Text2: str(problem.para2Text2) || etText.problemP2Text2,
    servicesTag: str(services.tag) || etText.servicesTag,
    servicesHeading: str(services.heading) || etText.servicesHeading,
    services: numberedItems(services, "item", 9),
    servicesLinksLabel: str(services.linksLabel) || etText.servicesLinksLabel,
    servicesLinks: [1, 2, 3, 4, 5].map((index) => str(services[`link${index}`]) || etText.servicesLinks[index - 1]),
    whyUsTag: str(whyUs.tag) || etText.whyUsTag,
    whyUsHeading: str(whyUs.heading) || etText.whyUsHeading,
    whyUsImage: str(whyUs.image) || etText.whyUsImage,
    whyUsImageAlt: str(whyUs.imageAlt) || etText.whyUsImageAlt,
    whyUs: [0, 1, 2, 3, 4].map((index) => ({
      title: str(whyUs[`reason${index}Title`]) || etText.whyUs[index].title,
      desc: str(whyUs[`reason${index}Desc`]) || etText.whyUs[index].desc,
    })),
    pricingTag: str(pricing.tag) || etText.pricingTag,
    pricingHeading: str(pricing.heading) || etText.pricingHeading,
    pricingDescription: str(pricing.description) || etText.pricingDescription,
    pricingNote: str(pricing.note) || etText.pricingNote,
    testimonialsTag: str(testimonials.tag) || etText.testimonialsTag,
    testimonialsHeading: str(testimonials.heading) || etText.testimonialsHeading,
    testimonials: [0, 1, 2, 3, 4].map((index) => ({
      quote: str(testimonials[`item${index}Quote`]) || etText.testimonials[index].quote,
      shortQuote: str(testimonials[`item${index}Short`]) || etText.testimonials[index].shortQuote,
    })),
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

function getText(locale: Locale): OfficeCleaningText {
  if (locale === "et") return etText;
  return localizedText(locale);
}

const whyUsIcons = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>,
  <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
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

const servicesLinkHrefs = [
  "/koristusteenus/valikoristus/akende-pesu/",
  "/puhastusteenused/vaipade-puhastus/",
  "/puhastusteenused/porandate-hooldus/",
  "/puhastusteenused/koroonaviiruse-jargne-puhastus/",
  "/blog/kontori-koristusteenuse-kontrollnimekiri/",
];

export default function KontoriKoristus() {
  return <KontoriKoristusPageView locale="et" />;
}

export function KontoriKoristusPageView({ locale }: { locale: Locale }) {
  const t = getText(locale);
  const localizedServiceLinks = servicesLinkHrefs.map((etPath) => {
    const trimmed = etPath.replace(/\/+$/, "");
    const localized = localizePath(trimmed, locale);
    return localized === trimmed ? etPath : localized;
  });

  return (
    <>
      <SeoJsonLd
        etPath="/koristusteenus/kontori-koristus"
        locale={locale}
        serviceName={t.serviceName}
        serviceDescription={t.serviceDescription}
        breadcrumbs={[
          { name: t.breadcrumbHome, etPath: "/" },
          { name: t.breadcrumbService, etPath: "/koristusteenus" },
          { name: t.breadcrumbCurrent, etPath: "/koristusteenus/kontori-koristus" },
        ]}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px] relative"
          id="avaleht"
          aria-label={t.ariaLabel}
        >
          <HeroBackgroundImage src="/kontorikoristus1.jpg" preload alt="" />
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
                  onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer"
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

        {/* Problem Block - H2 */}
        <ScrollAnimation animation="fade-up">
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <TwoToneHeading text={t.problemHeading} className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>{t.problemP1Strong}</strong> {t.problemP1Text}
              </div>
              <div>
                <strong>{t.problemP2Strong1}</strong> {t.problemP2Text1}<br /><br />
                <strong>{t.problemP2Strong2}</strong> {t.problemP2Text2}
              </div>
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Teenuse sisu - Mida sisaldab kontori koristusteenus */}
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

            <div className="text-center mt-10">
              <p className="text-[15px] text-[#5a6474] leading-[1.8]">
                {t.servicesLinksLabel}{' '}
                {t.servicesLinks.map((linkText, i) => (
                  <span key={i}>
                    {i > 0 ? ' · ' : ''}
                    <Link href={localizedServiceLinks[i]} className="text-[#17345a] underline font-medium hover:text-[#1e4a7a]">{linkText}</Link>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>
        </ScrollAnimation>

        {/* Miks meie - H2 */}
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

        {/* Hind - H2 */}
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
                  className="mb-8 space-y-4 text-[16px] text-[#2f353f] leading-[1.75] font-light [&_strong]:text-[#17345a] [&_strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: t.pricingNote }}
                />
              </div>

              <Hinnakalkulaator locale={locale} />
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

        {/* FAQ - KKK at the bottom */}
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
