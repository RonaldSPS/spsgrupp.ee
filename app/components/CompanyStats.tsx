"use client";

import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";

type CompanyStat = { value: string; label: string };

export default function CompanyStats({
  tag,
  title,
  intro,
  stats,
}: {
  tag: string;
  title: string;
  intro?: string;
  stats: CompanyStat[];
}) {
  return (
    <ScrollAnimation animation="fade-up">
      <section className="py-[100px] bg-[#eceef1]" data-section="stats">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="text-center mb-14">
            <div className="section-tag">{tag}</div>
            <TwoToneHeading text={title} />
            {intro ? (
              <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">{intro}</p>
            ) : null}
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(stats.length, 4)} gap-6 max-w-[900px] mx-auto`}>
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50">
                <div className="text-[clamp(32px,4vw,48px)] font-bold text-[#17345a] mb-2">{stat.value}</div>
                <div className="text-[15px] text-[#5a6474]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
}
