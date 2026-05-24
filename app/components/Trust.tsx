import Image from "next/image";
import Link from "next/link";
import TwoToneHeading from "./TwoToneHeading";

const services = [
  {
    title: "Regulaarne koristusteenus",
    image: "/regulaarnekoristusteenus.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    title: "Puhastusteenused ja eritööd",
    image: "/puhastusteenused.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 2.76 5 9 5 9s5-6.24 5-9a5 5 0 0 0-5-5z" />
        <circle cx="12" cy="7" r="1.5" />
        <path d="M5 21h14" />
        <path d="M7 21v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
      </svg>
    ),
  },
  {
    title: "Välikoristus ja territooriumi hooldus",
    image: "/valikoristus.jpg",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4 8 4v14" />
        <rect x="9" y="13" width="6" height="8" />
        <path d="M10 9h4" />
      </svg>
    ),
  },
];

const trustBadges = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "ISO 9001 + ISO 14001",
    subtitle: "Sertifitseeritud",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "20+ aastat",
    subtitle: "Kogemust",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "200+ töötajat",
    subtitle: "Koolitatud",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    title: "Üle miljoni m²",
    subtitle: "Igapäevast pinda",
  },
];

const certChips = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Kvaliteedi garantii",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Kindlustatud teenused",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "24/7 tugi",
  },
];

export default function Trust() {
  return (
    <section className="trust-section py-[100px] bg-white" id="garantii">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Left - Text */}
          <div>
            <TwoToneHeading text="Miks usaldavad meid 500+ ettevõtet?" />
            <p className="text-[16px] text-[#2f353f] leading-[1.8] mb-7 font-light">
              Koristusfirma SPS Grupp on pakkunud puhastusteenuseid Eesti ettevõttetele üle 20 aasta. Meie 
              eesmärk on pakkuda koristusteenust, mis lähtub iga ettevõtte vajadustest personaalselt. 
              Igas kuus hooldame üle poole miljoni ruutmeetri äripindu. Meil töötab üle 200 töötaja 
              ning suudame leida optimaalse lahenduse nii suurtele, kui ka väga suurtele ettevõtetele.
            </p>
            
            <div className="grid grid-cols-2 gap-3.5">
              {trustBadges.map((badge, i) => (
                <div key={i} className="trust-badge-card hover:-translate-y-0.5">
                  <div className="w-[46px] h-[46px] bg-[#17345a] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="w-[22px] h-[22px] text-white">{badge.icon}</span>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#17345a] mb-0.5">{badge.title}</div>
                    <div className="text-[15px] text-[#5a6474]">{badge.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div 
              className="rounded-[20px] overflow-hidden shadow-lg"
              style={{ height: "460px" }}
            >
              {/* Certification image */}
              <Image
                src="/9001-14001-ENG.webp"
                alt="Koristusfirma SPS Grupp ISO 9001 ja ISO 14001 sertifikaadid"
                width={640}
                height={460}
                className="w-full h-auto"
                style={{ color: "#2d3748" }}
              />
            </div>

            {/* Overlay certifications */}
            <div 
              className="absolute -bottom-6 -left-6 right-6 bg-white rounded-4xl p-6 flex gap-4 shadow-md border border-[rgba(23,52,90,0.06)]"
              style={{ boxShadow: "0 8px 30px rgba(23,52,90,0.10)" }}
            >
              {certChips.map((cert, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-[#eef7fc] border border-[rgba(133,203,233,0.25)] rounded-[10px] px-3.5 py-2.5 flex-1 min-w-[140px]">
                  <div className="w-9 h-9 bg-[#17345a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="w-[18px] h-[18px] text-white">{cert.icon}</span>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#17345a]">{cert.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Three service columns */}
        <div className="text-center mb-14 mt-20">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            Meie teenused
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src={services[0].image}
                alt="Koristusfirma — regulaarne koristusteenus"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ color: "#2d3748" }}
              />
            </div>
            <div className="mb-4">
              <span className="w-[26px] h-[26px] inline-flex items-center justify-center text-[#17345a]">{services[0].icon}</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">
              {services[0].title}
            </h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Igapäevane ja perioodiline hooldus, mis hoiab teie tööruumid pidevalt puhtad ja esinduslikud.
            </p>
            <ul className="text-[15px] text-[#2f353f] leading-[1.8] mb-5 space-y-1">
              <li>• kontorite, kaubanduspindade ja tootmishoonete hooldus</li>
              <li>• põrandate ja tööpindade puhastus</li>
              <li>• sanitaarruumide korrashoid</li>
              <li>• köögid, prügikäitlus ja tarvikute haldus</li>
              <li>• klaaspinnad ja IT-seadmete puhastus</li>
            </ul>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">
              Kõik vahendid ja tarvikud on hinna sees.
            </p>
            <Link href="#pakkumine" aria-label="Vaata lähemalt regulaarse koristusteenuse kohta" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Column 2 */}
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src={services[1].image}
                alt="Koristusfirma — puhastusteenused ja eritööd"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ color: "#2d3748" }}
              />
            </div>
            <div className="mb-4">
              <span className="w-[26px] h-[26px] inline-flex items-center justify-center text-[#17345a]">{services[1].icon}</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">
              {services[1].title}
            </h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Perioodilised ja spetsiifilised tööd, mis taastavad pindade seisukorra ja pikendavad nende eluiga.
            </p>
            <ul className="text-[15px] text-[#2f353f] leading-[1.8] mb-5 space-y-1">
              <li>• akende pesu (seest ja väljast)</li>
              <li>• vaipade ja tekstiilide keemiline puhastus</li>
              <li>• põrandate süvahooldus ja vahatamine</li>
              <li>• ehitusjärgne koristus</li>
              <li>• desinfitseerimine ja eripuhastused</li>
            </ul>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">
              Kiirreageerimine 24/7 ootamatute olukordade jaoks.
            </p>
            <Link href="#pakkumine" aria-label="Vaata lähemalt puhastusteenuste ja eritööde kohta" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Column 3 */}
          <div className="service-column-card">
            <div className="w-full h-[180px] relative overflow-hidden rounded-xl mb-6">
              <Image
                src={services[2].image}
                alt="Koristusfirma — välikoristus ja territooriumi hooldus"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                style={{ color: "#2d3748" }}
              />
            </div>
            <div className="mb-4">
              <span className="w-[26px] h-[26px] inline-flex items-center justify-center text-[#17345a]">{services[2].icon}</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#17345a] mb-3">
              {services[2].title}
            </h3>
            <p className="text-[15px] text-[#333a46] leading-[1.7] mb-5 font-light">
              Hooldame teie hoone ümbrust aastaringselt, igal hooajal oma plaaniga.
            </p>
            <ul className="text-[15px] text-[#2f353f] leading-[1.8] mb-5 space-y-1">
              <li>• fassaadi- ja aknapesu (sh kõrghooned)</li>
              <li>• tänavakivide pesu ja hooldus</li>
              <li>• graffiti eemaldamine</li>
              <li>• lume- ja jäätõrje</li>
              <li>• lehekoristus ja hooajalised tööd</li>
            </ul>
            <p className="text-[15px] text-[#2d7a4f] font-medium mb-4">
              Üks leping, mis katab kõik hooajad ja vajadused.
            </p>
            <Link href="#pakkumine" aria-label="Vaata lähemalt välikoristuse ja territooriumi hoolduse kohta" className="inline-flex items-center gap-1.5 text-[#0078b5] text-[15px] font-medium no-underline">
              Vaata lähemalt <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}