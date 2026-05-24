import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import FooterCTA from "../../components/FooterCTA";
import FAQ from "../../components/FAQ";
import Hinnakalkulaator from "../../components/Hinnakalkulaator";

export type SeoIcon =
  | "shield"
  | "briefcase"
  | "users"
  | "clock"
  | "factory"
  | "store"
  | "school"
  | "sparkle"
  | "floor"
  | "window"
  | "carpet"
  | "construction"
  | "leaf"
  | "clipboard";

export type ServiceSeoData = {
  slug: string;
  serviceName: string;
  serviceType: string;
  pageUrl: string;
  category?: {
    title: string;
    href: string;
  };
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    aria: string;
    image: string;
    title: string;
    accent: string;
    description: string;
    cta: string;
    chips: { value: string; label: string; tone: "blue" | "green" | "navy"; icon: SeoIcon }[];
  };
  intro: {
    title: string;
    firstBold: string;
    firstText: string;
    secondBold: string;
    secondText: string;
  };
  strengthsIntro: string;
  strengths: { title: string; text: string; icon: SeoIcon }[];
  serviceContent: {
    title: string;
    intro: string[];
    image: string;
    imageAlt: string;
    imageCaption: string;
    groups: { title: string; kicker: string; items: string[] }[];
  };
  process: {
    title: string;
    intro: string;
    steps: [string, string][];
  };
  buyerGuide: {
    title: string;
    intro: string;
    body: string;
    goodTitle: string;
    warningTitle: string;
    questions: string[];
  };
  pricing: {
    title: string;
    intro: string;
    cards: [string, string, string, string][];
    factors: string[];
  };
  relatedServices: { title: string; href: string; text: string; icon: SeoIcon }[];
  serviceLinks?: { title: string; href: string }[];
  faqItems: { q: string; a: string }[];
  footerCta: {
    title: string;
    description: string;
  };
};

const BASE_URL = "https://spsgrupp.ee";

function Icon({ type }: { type: SeoIcon }) {
  if (type === "briefcase") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "factory") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21V9l6 4V9l6 4V5h6v16H3z" />
        <path d="M7 17h2M12 17h2M17 17h2" />
      </svg>
    );
  }

  if (type === "store") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 10h16l-1-5H5l-1 5z" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (type === "school") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10l9-5 9 5-9 5-9-5z" />
        <path d="M7 12v5c3 2 7 2 10 0v-5" />
      </svg>
    );
  }

  if (type === "sparkle") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
      </svg>
    );
  }

  if (type === "floor") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M4 10h16M4 16h16M10 4v6M14 10v6M10 16v4" />
      </svg>
    );
  }

  if (type === "window") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M12 3v18M4 11h16M7 7h2M15 15h2" />
      </svg>
    );
  }

  if (type === "carpet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h8M7 21v-2M11 21v-2M15 21v-2M19 21v-2" />
      </svg>
    );
  }

  if (type === "construction") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-7h6v7M9 10h6" />
      </svg>
    );
  }

  if (type === "leaf") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 21c8-3 13-10 14-18-8 1-15 6-18 14 4 0 7 1 10 4" />
      </svg>
    );
  }

  if (type === "clipboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4a3 3 0 0 1 6 0M9 9h6M9 13h6M9 17h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-[780px] mb-12">
      <div className="section-tag">{label}</div>
      <h2 className="section-title font-bold mb-5">{title}</h2>
      {intro ? <p className="text-[17px] leading-[1.75] text-[#2f353f] font-light">{intro}</p> : null}
    </div>
  );
}

function JsonLd({ data }: { data: ServiceSeoData }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.serviceName,
      serviceType: data.serviceType,
      provider: {
        "@type": "LocalBusiness",
        name: "SPS Grupp",
        url: BASE_URL,
        telephone: "+3726623328",
        email: "info@spsgrupp.ee",
        areaServed: ["Tallinn", "Harjumaa"],
      },
      areaServed: ["Tallinn", "Harjumaa"],
      url: data.pageUrl,
      description: data.metadata.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Avaleht", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: data.category?.title ?? "Koristusteenus", item: `${BASE_URL}${data.category?.href ?? "/koristusteenus"}` },
        { "@type": "ListItem", position: 3, name: data.serviceName, item: data.pageUrl },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  );
}

export default function ServiceSeoTemplate({ data }: { data: ServiceSeoData }) {
  return (
    <>
      <JsonLd data={data} />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={data.hero.aria}
          style={{ background: `url('${data.hero.image}') center/cover no-repeat` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 gap-[20px] z-20 hidden md:flex">
            {data.hero.chips.map((chip) => (
              <div key={`${chip.value}-${chip.label}`} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className={`chip-icon chip-icon-${chip.tone} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  <div className="w-6 h-6">
                    <Icon type={chip.icon} />
                  </div>
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
              <div className="inline-flex bg-white/15 border border-white/25 text-white rounded-full px-4 py-2 text-[15px] font-medium mb-5">
                Eraldiseisev SEO lab-versioon
              </div>
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                {data.hero.title}{" "}
                <br />
                <span className="text-[#3abeff]">{data.hero.accent}</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">{data.hero.description}</p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <Link href="#pakkumine" className="btn-primary text-[15px] py-2.5 px-4">
                  {data.hero.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  662 3328
                </Link>
              </div>
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <Link href={data.category?.href ?? "/koristusteenus"} className="text-white/80 no-underline hover:text-white transition-colors">{data.category?.title ?? "Koristusteenused"}</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{data.serviceName}</span>
              </nav>
            </div>
          </div>
        </section>

        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <h2 className="section-title font-bold mb-8">{data.intro.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
              <div>
                <strong>{data.intro.firstBold}</strong> {data.intro.firstText}
              </div>
              <div>
                <strong>{data.intro.secondBold}</strong> {data.intro.secondText}
              </div>
            </div>
          </div>
        </section>

        <section className="py-[90px] bg-[#f8fafc]">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-12 items-start">
              <div>
                <div className="section-tag">SPSi tugevused</div>
                <h2 className="section-title font-bold mb-6">Teenuse kvaliteet tuleb süsteemist, mitte juhusest</h2>
                <p className="text-[17px] leading-[1.8] text-[#2f353f] font-light">{data.strengthsIntro}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.strengths.map((item) => (
                  <article key={item.title} className="bg-white rounded-[8px] p-6 border border-[rgba(23,52,90,0.08)] shadow-sm">
                    <div className="w-12 h-12 rounded-[8px] bg-[#eef7fc] text-[#17345a] flex items-center justify-center mb-5">
                      <div className="w-6 h-6">
                        <Icon type={item.icon} />
                      </div>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#17345a] leading-[1.3] mb-3">{item.title}</h3>
                    <p className="text-[15px] leading-[1.7] text-[#2f353f] font-light">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-[90px]"
          id="teenused"
          style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}
        >
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
              <div>
                <div className="section-tag">Teenuse sisu</div>
                <h2 className="section-title font-bold mb-6">{data.serviceContent.title}</h2>
                <div className="space-y-5 text-[17px] leading-[1.8] text-[#2f353f] font-light">
                  {data.serviceContent.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[420px] rounded-[8px] overflow-hidden shadow-lg">
                <Image
                  src={data.serviceContent.image}
                  alt={data.serviceContent.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ color: "#2d3748" }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1f33]/80 to-transparent p-6">
                  <p className="text-[15px] leading-[1.65] text-white max-w-[460px]">{data.serviceContent.imageCaption}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data.serviceContent.groups.map((group, groupIndex) => (
                <article key={group.title} className="bg-white/85 backdrop-blur-[6px] border border-white/60 rounded-[8px] p-6 shadow-sm">
                  <div className="text-[15px] font-mono text-[#5a6474] mb-3">0{groupIndex + 1}</div>
                  <h3 className="text-[22px] font-bold text-[#17345a] mb-4">{group.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-[#2f353f] font-light mb-5">{group.kicker}</p>
                  <div className="space-y-2.5">
                    {group.items.map((item) => (
                      <div key={item} className="text-[15px] leading-[1.55] text-[#2f353f] border-t border-[#d7dde5] pt-2.5">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-[90px] bg-[#eceef1]">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
              <SectionHeading label="Tööprotsess" title={data.process.title} intro={data.process.intro} />
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#c8d2df] hidden md:block" />
                <div className="space-y-6">
                  {data.process.steps.map(([title, text], index) => (
                    <article key={title} className="relative md:pl-12">
                      <div className="absolute left-0 top-1 hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-[#17345a] text-white text-[15px] font-bold">
                        {index + 1}
                      </div>
                      <div className="bg-white rounded-[8px] p-5 border border-[rgba(23,52,90,0.08)] shadow-sm">
                        <h3 className="text-[20px] leading-[1.3] font-bold text-[#17345a] mb-2">{title}</h3>
                        <p className="text-[15px] leading-[1.7] text-[#2f353f] font-light">{text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[90px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
            <div>
              <SectionHeading label="Ostujuhis" title={data.buyerGuide.title} intro={data.buyerGuide.intro} />
              <p className="text-[16px] leading-[1.8] text-[#2f353f] font-light">{data.buyerGuide.body}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <article className="bg-[#17345a] rounded-[8px] p-6 text-white">
                <h3 className="text-[22px] font-bold mb-4">{data.buyerGuide.goodTitle}</h3>
                <div className="space-y-3">
                  {data.buyerGuide.questions.slice(0, 3).map((question) => (
                    <p key={question} className="text-[15px] leading-[1.6] border-t border-white/15 pt-3">
                      {question}
                    </p>
                  ))}
                </div>
              </article>
              <article className="bg-[#f8fafc] rounded-[8px] p-6 border border-[rgba(23,52,90,0.08)]">
                <h3 className="text-[22px] font-bold text-[#17345a] mb-4">{data.buyerGuide.warningTitle}</h3>
                <div className="space-y-3">
                  {data.buyerGuide.questions.slice(3).map((question) => (
                    <p key={question} className="text-[15px] leading-[1.6] border-t border-[#d7dde5] pt-3 text-[#2f353f]">
                      {question}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-[90px] bg-[#f8fafc]">
          <div className="max-w-[1280px] mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionHeading label="Hinnakujundus" title={data.pricing.title} intro={data.pricing.intro} />
              <div className="bg-white rounded-[8px] p-6 border border-[rgba(23,52,90,0.08)]">
                <h3 className="text-[22px] font-bold text-[#17345a] mb-5">Pakkumise täpsustamiseks on vaja teada</h3>
                <ul className="space-y-3">
                  {data.pricing.factors.map((factor) => (
                    <li key={factor} className="text-[15px] leading-[1.65] text-[#2f353f] flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#17345a] flex-shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Hinnakalkulaator />
          </div>
        </section>

        <section className="py-[90px] bg-white">
          <div className="max-w-[1280px] mx-auto px-[5%]">
            <SectionHeading
              label="Seotud teenused"
              title="Teenused, mida selle lahendusega sageli kombineeritakse"
              intro="Sisemine linkimine aitab külastajal leida tervikliku lahenduse ning annab otsingumootoritele parema arusaama SPS Grupi teenuste seostest."
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {data.relatedServices.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group block bg-[#f8fafc] border border-[rgba(23,52,90,0.08)] rounded-[8px] p-5 no-underline transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white"
                >
                  <div className="w-12 h-12 rounded-[8px] bg-[#eef7fc] text-[#17345a] flex items-center justify-center mb-5 transition-all group-hover:bg-[#17345a] group-hover:text-white">
                    <div className="w-6 h-6">
                      <Icon type={service.icon} />
                    </div>
                  </div>
                  <h3 className="text-[19px] font-bold text-[#17345a] mb-3">{service.title}</h3>
                  <p className="text-[15px] leading-[1.65] text-[#2f353f] font-light">{service.text}</p>
                  <span className="inline-flex items-center mt-5 text-[15px] font-medium text-[#0078b5] group-hover:text-[#17345a]">
                    Vaata teenust
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FAQ items={data.faqItems} />

        <FooterCTA title={data.footerCta.title} description={data.footerCta.description} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
