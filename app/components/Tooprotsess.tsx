"use client";

interface Props {
  title: string;
  intro: string;
  steps: [string, string][];
}

export default function Tooprotsess({ title, intro, steps }: Props) {
  return (
    <section className="py-[90px] bg-[#eceef1]">
      <div className="max-w-[1280px] mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <div className="max-w-[780px]">
            <div className="section-tag">Tööprotsess</div>
            <h2 className="section-title font-bold mb-5">{title}</h2>
            <p className="text-[17px] leading-[1.75] text-[#2f353f] font-light">{intro}</p>
          </div>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#c8d2df] hidden md:block" />
            <div className="space-y-6">
              {steps.map(([stepTitle, stepText], index) => (
                <article key={stepTitle} className="relative md:pl-12">
                  <div className="absolute left-0 top-1 hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-[#17345a] text-white text-[15px] font-bold">
                    {index + 1}
                  </div>
                  <div className="bg-white rounded-[8px] p-5 border border-[rgba(23,52,90,0.08)] shadow-sm">
                    <h3 className="text-[20px] leading-[1.3] font-bold text-[#17345a] mb-2">{stepTitle}</h3>
                    <p className="text-[15px] leading-[1.7] text-[#2f353f] font-light">{stepText}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
