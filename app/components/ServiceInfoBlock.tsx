"use client";

import TwoToneHeading from "./TwoToneHeading";
import ScrollAnimation from "./ScrollAnimation";
import type { ServiceInfoBlockData } from "@/app/components/templates/ServiceDetailTemplate";

export default function ServiceInfoBlock({ data }: { data: ServiceInfoBlockData }) {
  return (
    <ScrollAnimation animation="fade-up">
      <section className="py-[100px] bg-[#eceef1]" data-section="planning">
        <div className="max-w-[1280px] mx-auto px-[5%]">
          <div className="text-center mb-14">
            <div className="section-tag">{data.tag}</div>
            <TwoToneHeading text={data.title} />
            <p className="text-[16px] text-[#2f353f] leading-[1.8] font-light max-w-[700px] mx-auto mt-6">{data.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {data.items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center transition-colors duration-300 border-2 border-transparent hover:bg-gray-50">
                <div className="text-[22px] leading-[1.25] font-bold text-[#17345a] mb-3">{item.title}</div>
                <div className="text-[15px] leading-[1.7] text-[#5a6474]">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
}
