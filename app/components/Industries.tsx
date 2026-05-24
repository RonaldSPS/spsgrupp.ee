"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TwoToneHeading from "./TwoToneHeading";

// Fallback gradients in case images don't load
const fallbackGradients = [
  "linear-gradient(135deg, #1e4a7a 0%, #17345a 50%, #0f1f33 100%)",
  "linear-gradient(135deg, #2d5a87 0%, #1e3d5c 50%, #0f2533 100%)",
  "linear-gradient(135deg, #3d6a87 0%, #2a4a5c 50%, #1a2a33 100%)",
  "linear-gradient(135deg, #4a7a87 0%, #335a5c 50%, #1f3333 100%)",
  "linear-gradient(135deg, #5a8a87 0%, #3d5a5c 50%, #253333 100%)",
  "linear-gradient(135deg, #6a9a87 0%, #4d5a4c 50%, #2b332b 100%)",
];

const industries = [
  {
    title: "Kontorid ja äripinnad",
    subtitle: "500+ ettevõtet",
    badge: "Kontorihooldus",
    text: "Regulaarne ja usaldusväärne kontori koristus kõikidele ettevõtetele. Paindlik graafik ja kvaliteedikontroll.",
    image: "/images/industries/kontorid-1600x920.webp",
  },
  {
    title: "Kaubanduskeskused",
    subtitle: "15+ keskust",
    badge: "Kaubanduspinna hooldus",
    text: "Kõrge külastatavusega pindade hooldus. Öine teenus ja kiire reageerimine.",
    image: "/images/industries/kaubanduskeskused-1600x920.webp",
  },
  {
    title: "Tootmis- ja laopinnad",
    subtitle: "100 000+ m²",
    badge: "Tööstuspinna hooldus",
    text: "Spetsialne teenus tööstus- ja laopindadele. Väga tõhusus ja OHES vastavus.",
    image: "/images/industries/kontorid-1600x920.webp", // placeholder
  },
  {
    title: "Hotellid ja restoranid",
    subtitle: "50+ asutust",
    badge: "Hotelliteenindus",
    text: "24/7 teenus ja kõrged sanitaarnõuded. Sertifitseeritud personal.",
    image: "/images/industries/hotellid-1600x920.webp",
  },
  {
    title: "Tervishoiuasutused",
    subtitle: "20+ kliinikat",
    badge: "Meditsiiniline puhastus",
    text: "Meditsiinilise taseme desinfitseerimine ja steriliseerimine.",
    image: "/images/industries/kontorid-1600x920.webp", // placeholder
  },
  {
    title: "Haridusasutused",
    subtitle: "30+ kooli",
    badge: "Kooliteenindus",
    text: "Turvaline ja lastesõbralik puhastusteenus. Öised graafikud.",
    image: "/images/industries/kontorid-1600x920.webp", // placeholder
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSetActive = (index: number) => {
    if (index !== active && !isAnimating) {
      setPrevActive(active);
      setActive(index);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  // Auto-advance slider every 3000ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setPrevActive(active);
        setActive((prev) => (prev + 1) % industries.length);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating, active]);

  return (
    <section className="industries-section py-[100px] bg-white" id="valdkonnad">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="text-center mb-14">
          <div className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Valdkonnad
          </div>
          <TwoToneHeading text="Valdkonnad, mida teenindame" />
          <p className="section-intro mx-auto mt-0">
            Teenindame laias valikus tööstus- ja ärihooneid koos kvaliteedikontrolliga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar buttons */}
          <div className="flex flex-col gap-1">
            {industries.map((ind, i) => (
              <button
                key={i}
                onClick={() => handleSetActive(i)}
                className={`industry-btn ${active === i ? "active" : ""}`}
              >
                <span className="industry-btn-title">{ind.title}</span>
                <span className="industry-btn-sub">{ind.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Content card - slider with overlay effect */}
          <div className="col-span-1 md:col-span-3 relative rounded-[20px] overflow-hidden h-[400px] md:h-[460px]">
            {/* Previous image (stays in place) */}
            <div className="absolute inset-0">
              <Image
                src={industries[prevActive].image}
                alt={industries[prevActive].title}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                priority
                style={{ color: "#2d3748" }}
              />
            </div>
            
            {/* New image slides over */}
            <div
              key={active}
              className={`absolute inset-0 ${isAnimating ? 'animate-slide-over' : ''}`}
            >
              <Image
                src={industries[active].image}
                alt={industries[active].title}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                priority
                style={{ color: "#2d3748" }}
              />
            </div>
            
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block bg-white/20 backdrop-blur-[8px] px-3.5 py-1.5 rounded-full text-[15px] font-semibold text-white mb-3">
                {industries[active].badge}
              </span>
              <h3 className="text-[28px] font-bold text-white mb-2">{industries[active].title}</h3>
              <p className="text-[15px] text-white/80 leading-[1.6] max-w-[400px]">{industries[active].text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}