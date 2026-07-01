"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TwoToneHeading from "./TwoToneHeading";

const industries = [
  {
    title: "Kontorid ja äripinnad",
    subtitle: "Igapäevane töörahu",
    badge: "Kontorihooldus",
    text: "Kontoris peab puhtus olema märkamatu osa tööpäevast. SPS seab graafiku nii, et lauad, köögid, koosolekuruumid ja sanitaarruumid püsivad korras ilma pideva meeldetuletamiseta.",
    image: "/images/industries/kontorid-1600x920.webp",
  },
  {
    title: "Kaubanduspinnad",
    subtitle: "Esinduslik kliendiala",
    badge: "Kaubandus",
    text: "Kaubanduspinnal muutub mustus kiiresti nähtavaks. Seetõttu vaatame koos läbi sissepääsud, põrandad, klaaspinnad, sanitaarruumid ja tööde ajastuse.",
    image: "/images/industries/kaubanduskeskused-1600x920.webp",
  },
  {
    title: "Tootmis- ja laohooned",
    subtitle: "Tööohutus ja kord",
    badge: "Tööstuspinnad",
    text: "Tootmishoones ei piisa kodusest loogikast. SPS arvestab masinate, tolmu, liikumisteede, ladude ja eri tsoonidega, et koristus toetaks töökorraldust.",
    image: "/tootmishoonete-koristus.webp",
  },
  {
    title: "Hotellid ja restoranid",
    subtitle: "Kõrge ootusega külalised",
    badge: "Teenindus",
    text: "Külaline hindab puhtust hetkega. Hooldus peab olema täpne, diskreetne ja ajastatud nii, et teenindus ei katkeks.",
    image: "/images/industries/hotellid-1600x920.webp",
  },
  {
    title: "Tervishoiu- ja hooldusasutused",
    subtitle: "Hügieen on usaldus",
    badge: "Desinfitseerimine",
    text: "Tundlikes ruumides on oluline meetod, sagedus ja dokumenteeritud vastutus. SPS aitab luua rütmi, mis toetab töötajate ja külastajate turvatunnet.",
    image: "/desinfitseerimine-1.jpg",
  },
  {
    title: "Koolid ja lasteaiad",
    subtitle: "Palju liikumist iga päev",
    badge: "Haridusasutused",
    text: "Haridusasutuses muutub päevane koormus kiiresti. SPS vaatab eraldi klassid, rühmaruumid, saalid, garderoobid ja sanitaarruumid, et hooldus oleks realistlik.",
    image: "/koolide-koristamine4.jpg",
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setPrevActive(active);
        setActive((prev) => (prev + 1) % industries.length);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAnimating, active]);

  return (
    <section className="industries-section py-[100px] bg-white" id="valdkonnad">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-12 items-end mb-12">
          <div>
            <div className="section-tag">Valdkonnad</div>
            <TwoToneHeading text="Valdkonnad, mida teenindame" />
          </div>
          <p className="text-[17px] text-[#2f353f] leading-[1.8] font-light lg:pb-2">
            Igal pinnal on oma rütm. Kontoris on oluline diskreetsus, kaubanduses kiirus, tootmises tööohutus ja koolis päevane koormus. SPSi väärtus on see, et sama meeskond suudab tööplaani kohandada ruumi järgi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {industries.map((ind, i) => (
              <button
                key={ind.title}
                type="button"
                onClick={() => handleSetActive(i)}
                className={`industry-btn min-w-[240px] md:min-w-0 ${active === i ? "active" : ""}`}
              >
                <span className="industry-btn-title">{ind.title}</span>
                <span className="industry-btn-sub">{ind.subtitle}</span>
              </button>
            ))}
          </div>

          <div className="relative rounded-[8px] overflow-hidden min-h-[470px] bg-[#17345a]">
            <div className="absolute inset-0">
              <Image
                src={industries[prevActive].image}
                alt={industries[prevActive].title}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                style={{  }}
              />
            </div>

            <div key={active} className={`absolute inset-0 ${isAnimating ? "animate-slide-over" : ""}`}>
              <Image
                src={industries[active].image}
                alt={industries[active].title}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                style={{  }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f33]/88 via-[#0f1f33]/22 to-transparent pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 p-6 md:p-9">
              <span className="inline-flex bg-white/18 backdrop-blur-[8px] px-3.5 py-1.5 rounded-full text-[15px] font-semibold text-white mb-4">
                {industries[active].badge}
              </span>
              <h3 className="text-[30px] md:text-[38px] leading-[1.12] font-bold text-white mb-4">
                {industries[active].title}
              </h3>
              <p className="text-[17px] text-white/88 leading-[1.7] max-w-[620px]">
                {industries[active].text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
