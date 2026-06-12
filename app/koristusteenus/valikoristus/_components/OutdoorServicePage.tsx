"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FAQ from "../../../components/FAQ";
import FooterCTA from "../../../components/FooterCTA";
import ContactForm from "../../../components/ContactForm";
import TwoToneHeading from "../../../components/TwoToneHeading";
import ScrollAnimation from "../../../components/ScrollAnimation";
import Hinnakalkulaator from "../../../components/Hinnakalkulaator";

type ServiceCard = {
  bold: string;
  desc: string;
};

type ReasonCard = {
  title: string;
  desc: string;
};

type PriceCard = {
  size: string;
  area: string;
  price: string;
  period: string;
  highlight?: boolean;
};

type FAQItem = {
  q: string;
  a: string;
};

export type OutdoorServicePageData = {
  ariaLabel: string;
  heroImage: string;
  image: string;
  imageAlt: string;
  title: string;
  titleAccent: string;
  intro: string;
  cta: string;
  breadcrumb: string;
  chips: { value: string; label: string; tone: "blue" | "green" | "navy" }[];
  problemTitle: string;
  problemLeft: string;
  problemRight: string;
  serviceTitle: string;
  serviceCards: ServiceCard[];
  reasonsTitle: string;
  reasons: ReasonCard[];
  priceTitle: string;
  priceIntro: string;
  priceCards: PriceCard[];
  priceNote: string;
  statsTitle: string;
  statsIntro: string;
  stats: { number: string; label: string }[];
  footerTitle: string;
  footerDescription: string;
  faq: FAQItem[];
};

function ChipIcon({ tone }: { tone: "blue" | "green" | "navy" }) {
  const stroke = tone === "blue" ? "#5ab5da" : tone === "green" ? "#2d9e6b" : "#17345a";

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ReasonIcon({ index }: { index: number }) {
  const icons = [
    (
      <svg key="shield" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    (
      <svg key="clock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    (
      <svg key="file" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    (
      <svg key="users" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  ];

  return icons[index % icons.length];
}

export default function OutdoorServicePage({ data }: { data: OutdoorServicePageData }) {
  return (
    <>
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label={data.ariaLabel}
          style={{ background: `url('${data.heroImage}') center/cover no-repeat` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {data.chips.map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className={`chip-icon chip-icon-${chip.tone} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  <ChipIcon tone={chip.tone} />
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
              <h1 className="text-[clamp(28px,4.2vw,56px)] font-bold text-white leading-[1.12] mb-[18px]">
                {data.title}
                <br />
                <span className="text-[#3abeff]">{data.titleAccent}</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">{data.intro}</p>
              <div className="flex gap-[10px] mb-[24px] animate-fade-up">
                <a onClick={(e) => { e.preventDefault(); document.getElementById('pakkumine')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4 cursor-pointer">
                  {data.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
                  662 3328
                </Link>
              </div>

              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px] mt-2">
                <Link href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</Link>
                <span className="text-white/50">/</span>
                <Link href="/koristusteenus/valikoristus" className="text-white/80 no-underline hover:text-white transition-colors">Välikoristus</Link>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{data.breadcrumb}</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text={data.problemTitle} className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>{data.problemLeft}</div>
                <div>{data.problemRight}</div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px]" id="teenused" style={{ background: "#d4d8e3 url('/swirl_back.svg') calc(100% + 100px) center / cover no-repeat" }}>
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">Teenuse sisu</div>
                <TwoToneHeading text={data.serviceTitle} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.serviceCards.map((item, i) => (
                  <div key={i} className="bg-[#ffffff78] backdrop-blur-[5px] p-5 rounded-xl transition-colors duration-300 border border-transparent hover:bg-white/80">
                    <div className="text-[#5a6474] text-[15px] mb-2">
                      <span className="font-mono inline-block border-b border-[#5a6474] pb-px pr-5">{String(i + 1).padStart(2, "0")}.</span>
                    </div>
                    <div className="text-[#2f353f] text-[15px] leading-[1.6]">
                      <strong className="text-[#17345a] block mb-1">{item.bold}</strong>
                      <span className="text-[#5a6474]">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">Miks meie</div>
                <TwoToneHeading text={data.reasonsTitle} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
                <div className="grid grid-cols-1 gap-2">
                  {data.reasons.map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] p-4 rounded-2xl transition-colors duration-300 border-2 border-transparent hover:bg-[#eef7fc]">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <ReasonIcon index={i} />
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
                  <Image src={data.image} alt={data.imageAlt} width={600} height={700} className="w-full h-auto object-cover" style={{ color: "#2d3748" }} />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">Hind</div>
                <TwoToneHeading text={data.priceTitle} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
                <div>
                  <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">{data.priceIntro}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {data.priceCards.map((item, i) => (
                      <div key={i} className={`p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer ${item.highlight ? "bg-[#17345a] text-white hover:bg-[#1e4a7a] hover:scale-105 hover:shadow-xl" : "bg-[#f8fafc] hover:bg-[#eef7fc] hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#85cbe9]"}`}>
                        <div className={`text-[15px] font-bold mb-1 ${item.highlight ? "text-white" : "text-[#17345a]"}`}>{item.size}</div>
                        <div className={`text-[26px] font-bold mb-1 ${item.highlight ? "text-white" : "text-[#17345a]"}`}>{item.price}</div>
                        <div className={`text-[15px] mb-2 ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>{item.period}</div>
                        <div className={`text-[15px] ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>{item.area}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[15px] text-[#5a6474]">{data.priceNote}</p>
                </div>
                <Hinnakalkulaator />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">Meie numbrid</div>
                <TwoToneHeading text={data.statsTitle} />
                <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">{data.statsIntro}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
                {data.stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50">
                    <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.number}</div>
                    <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA title={data.footerTitle} description={data.footerDescription} />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up">
          <FAQ items={data.faq} />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
