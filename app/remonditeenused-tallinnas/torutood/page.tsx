"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FooterCTA from "../../components/FooterCTA";
import ContactForm from "../../components/ContactForm";
import TwoToneHeading from "../../components/TwoToneHeading";
import ScrollAnimation from "../../components/ScrollAnimation";
import SeoJsonLd from "../../components/SeoJsonLd";
import Tooprotsess from "../../components/Tooprotsess";

const torutoodFAQ = [
  {
    q: "Kui kiiresti reageerite veelekke hädaolukorras?",
    a: "Tavaliselt 1-2 tunni jooksul Tallinnas ja Harjumaal. Öisel ajal sama - reageerime 24/7.",
  },
  {
    q: "Kas teete ka uute torustike paigaldust?",
    a: "Jah, tegeleme nii uutel ehitustel kui ka renoveerimistel. Oskused hõlmavad vee-, kanalisatsiooni- ja küttesüsteeme kõikides tavalistes materjalides.",
  },
  {
    q: "Kuidas leiate peidetud veelekke?",
    a: "Kasutame termokaameraid, kuulmismeetodit ja rõhu testimist. Enamikul juhtudel leiame lekke kohe ilma suuri lõhkumistöid tegemata.",
  },
  {
    q: "Kas annate garantii torutöödele?",
    a: "Jah. Töödele 2 aastat, materjalidele tootja garantii. Kõik dokumenteeritud kirjalikult.",
  },
  {
    q: "Kas tegelete ka küttesüsteemide probleemidega?",
    a: "Jah. Keskkütte, radiaatorite, põrandakütte ja boilerite paigaldus, hooldus ning remont. Talvel hoiame teie hoone soojas.",
  },
];

export default function TorutoodLeht() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const teenuseSisuKaardid = [
    { bold: "Veetorustiku paigaldus ja remont", desc: "Kõik tavalised materjalid ja äripindade vajadused." },
    { bold: "Kanalisatsioonisüsteemide ehitus ja hooldus", desc: "Rajamine, kontroll, hooldus ja remonditööd." },
    { bold: "Küttesüsteemide paigaldus ja remont", desc: "Keskküte, radiaatorid, põrandaküte ja ühendused." },
    { bold: "Boilerite ja soojaveesüsteemide paigaldus", desc: "Paigaldus, ühendamine, hooldus ja remont." },
    { bold: "Ummistuste kõrvaldamine", desc: "Mehaaniline ja keemiline ummistuste eemaldamine." },
    { bold: "Veelekete diagnoosimine ja kiirparandus", desc: "Probleemikoha isoleerimine ja kiire töökindel parandus." },
    { bold: "Sanitaartehnika paigaldus", desc: "WC-d, kraanid, dušid ja muu sanitaartehnika." },
    { bold: "Avariireageerimine 24/7", desc: "Kiire reageerimine veeavarii ja torustiku rikete korral." },
    { bold: "Süsteemide dokumentatsioon ja garantii", desc: "Korrektsed dokumendid ja garantii teostatud töödele." },
  ];

  const miksMeieKaardid = [
    {
      title: "24h avariireageerimine",
      desc: "Helistage hädaolukorras ja oleme kohal 1-2 tunni jooksul. Isoleerime lekke, hindame kahjud, alustame remonti.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M12 8v5l3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    {
      title: "Ärikinnisvarale spetsialiseerumine",
      desc: "Töötame ainult ärihoonetes: kontorid, kaubandus, tootmine. Teame suurte süsteemide eripärasid.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
          <path d="M9 9h1M9 13h1M9 17h1M15 13h1M15 17h1" />
        </svg>
      ),
    },
    {
      title: "Kindlustatud tööd",
      desc: "Võimalikud kahjud kaetud. Kogu dokumentatsioon korras kindlustuse jaoks.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Garantii kõigile töödele",
      desc: "Meie töödele garantii 2 aastat, materjalidele tootja garantii. Kirjalik leping ja selge dokumentatsioon.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <SeoJsonLd
        serviceName="Torutööd Tallinnas"
        serviceDescription="Torutööd ja veevärgi remont ärikinnisvarale Tallinnas. Veeavarii, torustikud, kanalisatsioon."
        serviceUrl="https://spsgrupp.ee/remonditeenused-tallinnas/torutood"
        breadcrumbs={[{ position: 1, name: "Avaleht", item: "https://spsgrupp.ee" }, { position: 2, name: "Remonditeenused Tallinnas", item: "https://spsgrupp.ee/remonditeenused-tallinnas" }, { position: 3, name: "Torutööd", item: "https://spsgrupp.ee/remonditeenused-tallinnas/torutood" }]}
        faq={torutoodFAQ.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <Navbar />
      <main>
        <section
          className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
          id="avaleht"
          aria-label="Torutööd"
          style={{ background: "url('/torutood-1.jpg') center/cover no-repeat" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 flex gap-[20px] z-20 hidden md:flex">
            {[
              { value: "24h", label: "avariireageerimine" },
              { value: "2 aastat", label: "garantii" },
              { value: "Ärihooned", label: "spetsialiseerumine" },
            ].map((chip, i) => (
              <div key={i} className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className="chip-icon chip-icon-blue w-11 h-11 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
                    <path d="M4 14a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4" />
                    <path d="M8 18v-4a4 4 0 0 1 8 0v4" />
                    <path d="M12 2v6" />
                  </svg>
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
                Torutööd ärihoonetes
                <br />
                <span className="text-[#3abeff]">Tallinnas ja Harjumaal</span>
              </h1>
              <p className="text-[15px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
                Vee-, kanalisatsiooni- ja küttesüsteemide paigaldus, hooldus ja avariiremont. Kogenud torulukksepad, kindlustatud tööd, 24h reageerimine.
              </p>
              <div className="flex flex-wrap gap-[10px] mb-[24px] animate-fade-up">
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi torutööde pakkumist
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
                <a href="/remonditeenused-tallinnas" className="text-white/80 no-underline hover:text-white transition-colors">Remonditeenused</a>
                <span className="text-white/50">/</span>
                <span className="text-white/90">Torutööd</span>
              </nav>

            </div>
          </div>
        </section>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <TwoToneHeading text="Veeleke ärihoones, iga tund maksab" className="mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] text-[16px] text-[#2f353f] leading-[1.8] font-light">
                <div>
                  <p>Leke kontoris, poes või tootmishoones ei ole ainult vee-probleem. See on kriisiolukord: elektroonika saab vett, põrandad ja seinad kahjustuvad, laovarud riknevad, kliendid ei saa teenust, töötajad ei saa töötada. Sellises olukorras on iga hetk kallis.</p>
                  <p className="mt-4">Tavaline santehnik saab hakkama kodupiirkonna torustikuga, kuid ärihoone torustik on keerulisem. Seal on suuremad läbimõõdud, erinevad materjalid, komplekssed süsteemid ja rangemad ohutusnõuded.</p>
                </div>
                <div>
                  <p>SPS Grupi torulukksepad töötavad ainult ärikinnisvaras. Me teame, kuidas kiiresti isoleerida probleemikoht, minimaliseerida kahjud ja taastada süsteemi toimimine.</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

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
                <TwoToneHeading text="Milliseid torutöid me teostame?" />
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
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Miks meie
                </div>
                <TwoToneHeading text="Miks valida SPS Grupp torutöödeks?" />
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
                    src="/torutood-2.webp"
                    alt="SPS Grupp torutööd ärihoonetes"
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

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <div className="section-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Hind
                </div>
                <TwoToneHeading text="Torutööde hinnad" />
              </div>

              <div className="max-w-[900px] mx-auto">
                <p className="text-[16px] text-[#2f353f] leading-[1.75] mb-8 font-light">
                  Orienteeruvad hinnad:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {[
                    "Tunnihind (diagnostika, väiksemad tööd): alates 55€/h",
                    "Avariireageerimine: alates 90€ (saabumine) + tunnihind",
                    "Ummistuse kõrvaldamine: alates 120€",
                    "WC paigaldus: alates 250€",
                    "Suuremad projektid (torustiku rajamine): individuaalne",
                  ].map((item, i) => (
                    <div key={i} className="bg-[#f8fafc] rounded-2xl p-4 text-[15px] text-[#2f353f] leading-[1.7]">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[15px] text-[#5a6474] leading-[1.7] mb-8">
                  Suuremate projektide puhul anname alati kinnishinna. Tasuta kohapealne hindamine.
                </p>
                <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                  Küsi torutööde pakkumist
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="py-[100px] bg-white">
            <div className="max-w-[1280px] mx-auto px-[5%]">
              <div className="text-center mb-14">
                <TwoToneHeading text="Korduma kippuvad küsimused" />
              </div>
              <div className="max-w-[900px] mx-auto flex flex-col gap-2.5">
                {torutoodFAQ.map((item, i) => (
                  <div key={i} className={`faq-item ${openFaqIndex === i ? "open" : ""}`}>
                    <button
                      className="faq-question w-full text-left"
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      aria-expanded={openFaqIndex === i}
                    >
                      <span className="text-[15px] font-medium text-[#17345a] flex-1">{item.q}</span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-transform ${openFaqIndex === i ? "rotate-45" : ""}`}
                        style={{ background: openFaqIndex === i ? "#85cbe9" : "#eef7fc" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </button>
                    <div
                      className="overflow-hidden transition-all"
                      style={{
                        maxHeight: openFaqIndex === i ? "300px" : "0",
                        padding: openFaqIndex === i ? "0 22px 20px" : "0 22px",
                      }}
                    >
                      <p className="text-[15px] text-[#2f353f] leading-[1.8] font-light">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
        <Tooprotsess
          title="Kuidas SPS torutööde teenust korraldab?"
          intro="Selge protsess teeb teenuse tellimise lihtsamaks ja annab mõlemale poolele ühise arusaama kvaliteedist, ajakavast ja vastutusest."
          steps={[
            ["Probleemi kirjeldus", "Täpsustame rikke või töö ulatuse."],
            ["Kohapealne kontroll", "Hindame ligipääsu ja vajalikke materjale."],
            ["Lahendus", "Teeme paranduse või paigalduse."],
            ["Test", "Kontrollime toimivust."],
            ["Järelkorraldus", "Vajadusel planeerime koristuse või taastamise."],
          ]}
        />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <FooterCTA
            title="Helistage kohe, kui torustikuga on probleem"
            description="Avariiolukorrad 24/7. Plaanilised tööd — tuleme hindama ja koostame pakkumise."
          />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <section className="bg-white pb-[40px]">
            <div className="max-w-[1280px] mx-auto px-[5%] flex flex-wrap justify-center gap-3">
              <a href="#pakkumine" onClick={(e) => { e.preventDefault(); const el = document.getElementById('pakkumine'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary text-[15px] py-2.5 px-4">
                Küsi pakkumist
              </a>
              <Link href="tel:6623328" className="btn-outline text-[15px] py-2.5 px-4">
                662 3328 — 24/7
              </Link>
              <Link href="mailto:info@spsgrupp.ee" className="btn-outline text-[15px] py-2.5 px-4">
                info@spsgrupp.ee
              </Link>
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up">
          <ContactForm />
        </ScrollAnimation>
      </main>
      <ScrollAnimation animation="fade-up" delay={800}>
        <Footer />
      </ScrollAnimation>
    </>
  );
}
