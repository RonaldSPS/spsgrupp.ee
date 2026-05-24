import Link from "next/link";
import TwoToneHeading from "./TwoToneHeading";

const testimonials = [
  {
    quote: "Oleme väga rahul, kuidas meil toimetab tänane koristaja SPS'ist ja loodame, et ta jätkab oma tööd sama hästi.",
    author: "Teledyne Flir",
    location: "Tallinn",
    initials: "TF",
  },
  {
    quote: "Tahame kiita puhastusteenindajat. Võrreldes eelmiste teenusepakkujatega nagu öö ja päev! Viisakad & positiivsed. Ning WC-s on ka nüüd alati kõik tarvikud olemas.",
    author: "Maiki Nautras",
    location: "General Services Specialist, AS Norma",
    initials: "M",
  },
  {
    quote: "Võrreldes eelmise teenusepakkujaga on SPS Grupi koristusteenus tunduvalt parem — põrandad on alati läikivad ja kontoripind hästi hoolitsetud.",
    author: "Norma",
    location: "",
    initials: "N",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section py-[100px] bg-[#eceef1]" id="kliendid-arvustused">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Klientide tagasiside
          </div>
          <TwoToneHeading text="Mida ütlevad meie kliendid" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="flex gap-[3px] mb-4 text-[#f59e0b]">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-[15px]">★</span>
                ))}
              </div>
              <p className="text-[15px] leading-[1.8] text-[#2d3748] mb-[22px] font-light italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10.5 h-10.5 rounded-full bg-[#eef7fc] flex items-center justify-center text-[15px] font-bold text-[#17345a]">
                  {t.initials}
                </div>
                <div>
                  <div className="text-[15px] font-medium text-[#17345a]">{t.author}</div>
                  <div className="text-[15px] text-[#5a6474]">{t.location}</div>
                </div>
              </div>
              <Link href="#pakkumine" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline mt-4 transition-all hover:text-[#17345a] hover:gap-2.5">
                Soovid sama tulemust? Küsi pakkumist <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Video section */}
        <div className="mt-16 w-full md:w-3/4 mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <video
              src="/SPS-TarmoSildberg.mp4"
              controls
              poster="/TarmoHero.jpg"
              className="w-full h-auto"
              style={{ borderRadius: "24px" }}
            >
              <track kind="captions" src="" label="Eesti" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}