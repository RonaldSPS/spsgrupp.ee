import Image from "next/image";

const logos = [
  "21kool.png",
  "abakhan.png",
  "bestair.png",
  "city-motors.png",
  "decora.png",
  "draudimas.png",
  "eften.png",
  "elering.png",
  "ericsson.png",
  "infoauto.png",
  "leibur.png",
  "maxima.png",
  "mustikas.png",
  "mustikas2.png",
  "myfitness.png",
  "Nordichotels.png",
  "norma.png",
  "prike.png",
  "proekspert.png",
  "puumarket.png",
  "ra.png",
  "rimi.png",
  "sokos.png",
  "storz.png",
  "talleks.png",
  "taltech.png",
  "teledyne.png",
  "uponor.png",
  "veho.png",
  "zoo.png"
];

export default function Logos() {
  return (
    <section className="logos-section bg-white border-t border-b border-[rgba(23,52,90,0.05)]" id="kliendid" aria-label="Meie kliendid">
      <div className="overflow-hidden relative" aria-hidden="true">
        <div 
          className="flex items-center gap-0"
          style={{ width: "max-content", animation: "logoScroll 160s linear infinite" }}
        >
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center py-2.5 px-10 opacity-40 transition-all hover:opacity-80 min-w-[160px]"
            >
              <Image
                src={`/logod/${logo}`}
                alt=""
                width={90}
                height={50}
                className="object-contain"
                style={{ color: "#2d3748" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
