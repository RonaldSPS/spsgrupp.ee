import Link from "next/link";

export default function FooterCTA({ title, description }: { title?: string; description?: string }) {
  return (
    <section className="footer-cta-section py-[100px] bg-[#17345a] relative overflow-hidden text-center">
      {/* Background glow */}
      <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(133,203,233,0.1)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-[1280px] mx-auto px-[5%]">
        <h2 className="text-[clamp(28px,3.5vw,46px)] font-bold text-white -tracking-[0.5px] mb-3.5">
          {title || "Kas olete valmis koristuse korda panema?"}
        </h2>
        <p className="text-[17px] text-white/70 max-w-[560px] mx-auto mb-9 leading-[1.7] font-light">
          {description || "Võtke meiega ühendust ja saage tasuta pakkumine 24 tunni jooksul. Meie spetsialistid aitavad teil leida parima lahenduse."}
        </p>
        
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            href="#pakkumine"
            className="btn-primary bg-[#85cbe9] text-[#17345a] hover:bg-[#5ab5da]"
          >
            Küsi tasuta pakkumist
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="tel:6623328"
            className="btn-outline bg-transparent border border-white/25 text-white hover:bg-white/8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            662 3328
          </Link>
          <Link
            href="mailto:info@spsgrupp.ee"
            className="btn-outline bg-transparent border border-white/25 text-white hover:bg-white/8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            info@spsgrupp.ee
          </Link>
        </div>
      </div>
    </section>
  );
}