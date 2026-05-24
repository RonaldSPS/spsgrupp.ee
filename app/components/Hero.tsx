"use client";

import Link from "next/link";

const FloatingChip = ({
  iconClass,
  icon,
  bigText,
  smallText,
}: {
  iconClass: string;
  icon: React.ReactNode;
  bigText: string;
  smallText: string;
}) => (
  <div className="floating-chip animate-float" style={{ background: "rgba(255,255,255,0.95)" }}>
    <div className={`chip-icon ${iconClass} w-11 h-11 rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <div className="text-[18px] font-bold text-[#17345a] leading-tight">{bigText}</div>
      <div className="text-[15px] text-[#1f2937]">{smallText}</div>
    </div>
  </div>
);

export default function Hero() {
  return (
    <section
      className="hero-section min-h-[75vh] max-h-[800px] flex items-center px-[5%] pt-[100px] pb-[60px]"
      id="avaleht"
      aria-label="Avaleht"
      style={{ background: "url('/FrontHeroCar.jpg') center/cover no-repeat" }}
    >
      {/* Floating chips - absolute positioned to align with frosted glass top */}
      <div className="absolute top-[200px] right-[5%] flex gap-[20px] z-20 hidden md:flex">
        <FloatingChip
          iconClass="chip-icon-blue"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#5ab5da" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          bigText="20+"
          smallText="aastat kogemust"
        />
        <FloatingChip
          iconClass="chip-icon-green"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          }
          bigText="ISO 9001"
          smallText="sertifitseeritud"
        />
        <FloatingChip
          iconClass="chip-icon-navy"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          }
          bigText="Üle miljoni m²"
          smallText="igapäevaselt"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[60px] items-start max-w-[1280px] mx-auto w-full relative z-10">
        {/* Left column - Hero content */}
        <div 
          className="animate-fade-up order-2 md:order-1"
          style={{ 
            background: "rgba(38, 42, 45, 0.62)", 
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            padding: "32px",
            borderRadius: "20px",
            border: "1px solid rgba(133, 203, 233, 0.2)"
          }}
        >
          <h1 className="text-[clamp(28px,4.2vw,56px)] leading-[1.12] -tracking-[1px] mb-[18px]" style={{ fontFamily: 'Ubuntu', fontWeight: 400, color: 'white' }}>
            Koristusfirma<br />
            <span className="text-[#3abeff]" style={{ fontWeight: 600 }}>ärikliendile</span>
          </h1>
          <p className="text-[16px] md:text-[17px] text-white leading-[1.75] mb-[30px] max-w-[500px] font-light">
            Koristusfirma SPS Grupp hooldab iga päev üle{" "}
            <strong className="text-white font-medium">miljoni m²</strong>{" "}
            kontori-, kaubandus- ja tootmispindu Harjumaal.
          </p>
          <div className="flex gap-[10px] mb-[24px] animate-fade-up">
            <Link
              href="#pakkumine"
              className="btn-primary text-[15px] py-2.5 px-4"
            >
              Küsi pakkumist
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="tel:6623328" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20 text-[15px] py-2.5 px-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              662 3328
            </Link>
          </div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[15px]">
            <a href="/" className="text-white/80 no-underline hover:text-white transition-colors">Avaleht</a>
            <span className="text-white/50">/</span>
            <span className="text-white/90">Koristusfirma</span>
          </nav>
        </div>
      </div>
    </section>
  );
}