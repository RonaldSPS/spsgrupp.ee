"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Hinnakalkulaator() {
  const [area, setArea] = useState(5000);

  const price = useMemo(() => {
    return Math.round(area * 1.5);
  }, [area]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[32px] bg-[#fafafa] p-8 md:p-10 text-[#2f353f] border border-[#eceef1]"
    >
      <p className="uppercase tracking-[0.25em] text-[15px] text-[#5a6474] mb-6">
        Hinnakalkulaator
      </p>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-6xl md:text-7xl leading-none font-semibold text-[#17345a]">{price}€</span>
        <span className="text-xl text-[#5a6474] pb-2">/ kuu</span>
      </div>

      <p className="text-[15px] text-[#5a6474] mb-10">
        Hinnanguline kuumaksumus — täpne pakkumine 24 h jooksul.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <label htmlFor="area-slider" className="uppercase tracking-[0.15em] text-[15px] text-[#5a6474]">Pindala</label>
          <strong className="text-xl text-[#17345a]">{area} m²</strong>
        </div>

        <input
          id="area-slider"
          type="range"
          min="1000"
          max="10000"
          step="100"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          className="w-full accent-[#85cbe9] cursor-pointer"
        />
        <div className="flex justify-between mt-3 font-mono text-[15px] text-[#5a6474]">
          <span>1 000</span>
          <span>5 000</span>
          <span>10 000</span>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <label className="uppercase tracking-[0.15em] text-[15px] text-[#5a6474]">Sagedus</label>
          <strong className="text-xl text-[#17345a]">5× nädalas</strong>
        </div>
      </div>

      <a
        href="#pakkumine"
        className="block w-full text-center rounded-full bg-[#17345a] hover:bg-[#1e4a7a] transition py-5 text-xl font-bold text-white no-underline shadow-lg"
      >
        Küsi täpset pakkumist <span className="ml-2">→</span>
      </a>
    </motion.div>
  );
}
