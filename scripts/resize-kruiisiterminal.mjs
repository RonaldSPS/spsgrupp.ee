// Pre-scale cruise-terminal photos into public/images/kruiisiterminal/ as
// static WebP files at every size the site needs, so pages can reference
// sized assets directly instead of relying on Vercel's on-the-fly image
// optimization.
//
// Usage: node scripts/resize-kruiisiterminal.mjs
//
// Slot → sizes (from admin image-resize presets + template markup):
//   service hero (fill, sizes=100vw, max-h 800px) : 1920x1080 / 1280x720 / 640x360
//   service why-us (<Image width=600 height=700>) : 600x700 + 1200x1400 (DPR 2)
//   homepage industries carousel                  : 800x460 + 1600x920
//   portrait / testimonial                        : 400x400

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "D:\\WORKS\\SPS\\Kruiisiterminali Pildistamine\\JPG";
const OUT_DIR = path.join(process.cwd(), "public", "images", "kruiisiterminal");

const HERO_SIZES = [
  [1920, 1080],
  [1280, 720],
  [640, 360],
];
const WHY_US_SIZES = [
  [600, 700],
  [1200, 1400],
];
const INDUSTRY_SIZES = [
  [800, 460],
  [1600, 920],
];

const JOBS = [
  // kaubanduspindade-koristus — ride-on scrubber in the terminal atrium
  { src: "_DSC1017.jpg", name: "terminal-swingo-atrium", sizes: HERO_SIZES },
  { src: "_DSC1049.jpg", name: "terminal-dusting", sizes: WHY_US_SIZES },
  // porandate-hooldus — walk-behind scrubber in the corridor
  { src: "_DSC0998.jpg", name: "terminal-scrubber-corridor", sizes: HERO_SIZES },
  { src: "_DSC1000.jpg", name: "terminal-scrubber-close", sizes: WHY_US_SIZES },
  // hoolduskoristus — café/table area maintenance (hero flipped so the
  // person sits on the right) + duster portrait as why-us (0955 dropped:
  // same table-wiping action as the hero, can't share a page)
  { src: "_DSC0950.jpg", name: "terminal-tables-wide", sizes: HERO_SIZES, flop: true },
  { src: "_DSC1050.jpg", name: "terminal-duster-portrait", sizes: WHY_US_SIZES },
  // homepage industries carousel — atrium overview
  { src: "_DSC1021.jpg", name: "terminal-atrium-wide", sizes: INDUSTRY_SIZES },
  // portrait — cleaner thumbs-up
  { src: "_DSC1051.jpg", name: "terminal-worker-thumbsup", sizes: [[400, 400]] },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let count = 0;
  for (const job of JOBS) {
    const input = path.join(SRC_DIR, job.src);
    for (const [w, h] of job.sizes) {
      const out = path.join(OUT_DIR, `${job.name}-${w}x${h}.webp`);
      let pipeline = sharp(input);
      if (job.flop) pipeline = pipeline.flop(); // horizontal mirror
      await pipeline
        .resize(w, h, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(out);
      count++;
      console.log(`${job.src} -> images/kruiisiterminal/${job.name}-${w}x${h}.webp`);
    }
  }
  console.log(`Done: ${count} files written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
