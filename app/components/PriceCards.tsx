"use client";

interface PriceCard {
  title: string;
  price?: string;
  subtitle?: string;
  note?: string;
  highlight?: boolean;
}

interface PriceCardsProps {
  items: PriceCard[];
  cols?: number;
}

const DESKTOP_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function PriceCards({ items, cols: colsOverride }: PriceCardsProps) {
  const cols = Math.min(colsOverride ?? items.length, 5);
  const desktopClass = DESKTOP_COLS[cols] || "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-2 ${cols >= 3 ? "md:grid-cols-3" : desktopClass} ${cols >= 4 ? desktopClass : ""} gap-2 max-w-[1100px] mx-auto`}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`p-2 sm:p-3 md:p-5 rounded-2xl text-center ${
            item.highlight
              ? "bg-[#17345a] text-white shadow-lg"
              : "bg-[#f8fafc] border border-[#e2e8f0]"
          }`}
        >
          <div className={`text-[15px] font-bold leading-[1.25] mb-1 tracking-[-0.015em] [text-wrap:balance] ${item.highlight ? "text-[#85cbe9]" : "text-[#17345a]"}`}>
            {item.title}
          </div>
          {item.subtitle && (
            <div className={`text-[15px] leading-[1.25] mb-1 font-normal [text-wrap:balance] ${item.highlight ? "text-white/80" : "text-[#5a6474]"}`}>
              {item.subtitle}
            </div>
          )}
          {item.price && (
            <div className={`text-[17px] sm:text-[20px] md:text-[26px] font-bold leading-[1.15] mb-1 ${item.highlight ? "text-white" : "text-[#17345a]"}`}>
              {item.price}
            </div>
          )}
          {item.note && (
            <div className={`text-[15px] leading-[1.25] font-normal ${item.highlight ? "text-white/70" : "text-[#5a6474]"}`}>
              {item.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
