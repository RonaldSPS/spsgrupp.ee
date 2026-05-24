import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const svgPath = "D:\\WORKS\\SPS\\2026AprillWeb\\SPS_Sign.svg";
const svgBuffer = readFileSync(svgPath);

// Ensure public dir exists
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

// Keep transparent background from SVG
const compositedSvg = sharp(svgBuffer);

const sizes = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "favicon-48x48.png": 48,
  "favicon-96x96.png": 96,
  "apple-touch-icon-57x57.png": 57,
  "apple-touch-icon-60x60.png": 60,
  "apple-touch-icon-72x72.png": 72,
  "apple-touch-icon-76x76.png": 76,
  "apple-touch-icon-114x114.png": 114,
  "apple-touch-icon-120x120.png": 120,
  "apple-touch-icon-144x144.png": 144,
  "apple-touch-icon-152x152.png": 152,
  "apple-touch-icon-167x167.png": 167,
  "apple-touch-icon-180x180.png": 180,
  "apple-touch-icon.png": 180,
  "android-chrome-192x192.png": 192,
  "android-chrome-256x256.png": 256,
  "android-chrome-384x384.png": 384,
  "android-chrome-512x512.png": 512,
  "mstile-70x70.png": 70,
  "mstile-144x144.png": 144,
  "mstile-150x150.png": 150,
  "mstile-310x150.png": 310, // wide tile (width only — we'll handle aspect ratio)
  "mstile-310x310.png": 310,
};

console.log("Generating PNG favicons...");

// Generate all PNGs in parallel
await Promise.all(
  Object.entries(sizes).map(async ([filename, size]) => {
    const filePath = join(publicDir, filename);
    const width = size;
    const height = filename === "mstile-310x150.png" ? 150 : size;
    await compositedSvg
      .clone()
      .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(filePath);
    console.log(`  ${filename} (${width}x${height})`);
  })
);

console.log("\nGenerating favicon.ico (16+32+48)...");
const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((size) =>
    compositedSvg
      .clone()
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);

// Build ICO manually — ICO format is: header (6 bytes) + icon directory (16 bytes each) + image data
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);   // reserved
icoHeader.writeUInt16LE(1, 2);   // type: ICO
icoHeader.writeUInt16LE(3, 4);   // count

let imageDataOffset = 6 + 3 * 16; // header + directory entries
const dirEntries = [];
const imageDatas = [];

for (let i = 0; i < 3; i++) {
  const size = icoSizes[i];
  const buf = icoBuffers[i];
  // For ICO, max size is 256 (0=256)
  const icoSize = size === 256 ? 0 : size;

  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSize, 0);                  // width (0 = 256)
  entry.writeUInt8(icoSize, 1);                   // height (0 = 256) — ICO uses same for square
  entry.writeUInt8(0, 2);                         // color palette (0 = no palette for 32-bit PNG)
  entry.writeUInt8(0, 3);                         // reserved
  entry.writeUInt16LE(1, 4);                     // color planes
  entry.writeUInt16LE(32, 6);                    // bits per pixel
  entry.writeUInt32LE(buf.length, 8);            // image size
  entry.writeUInt32LE(imageDataOffset, 12);       // image offset

  dirEntries.push(entry);
  imageDatas.push(buf);
  imageDataOffset += buf.length;
}

const icoBuffer = Buffer.concat([icoHeader, ...dirEntries, ...imageDatas]);
writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);
console.log("  favicon.ico (16+32+48)");

// Generate Safari pinned tab SVG (monochrome, just the shape)
console.log("\nGenerating safari-pinned-tab.svg...");
// For pinned tab we use the base SVG but can simplify - just copy as-is with a note
// Safari expects black-only. We'll copy the original but it has multiple colors.
// Let's create a simplified monochrome version.
const pinnedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 334.85">
  <defs>
    <linearGradient id="pg" x1="0" y1="0" x2="512" y2="334.85" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#171c36"/>
      <stop offset="1" stop-color="#1a3358"/>
    </linearGradient>
  </defs>
  <path fill="url(#pg)" d="M13.28,159.29C31.02,83.72,364.14-30.8,450.56,29.19c86.49,60.06,12.36,232.62-88,278.59C262.2,353.76-4.47,234.87,13.28,159.29Z"/>
  <path fill="url(#pg)" d="M50.85,250.17C67.8,188.6,332.46,2.32,397.55,20.78c65.09,18.46.14,169.33-80.1,233.98-80.17,64.66-283.48,57.04-266.52-4.6h-.07Z"/>
  <path fill="url(#pg)" d="M80.73,28.69C139.35,3.18,429.51,121.36,449.05,193.13c19.54,71.77-136.49,112.72-231.04,82.33C123.48,245.14,22.11,54.19,80.73,28.69Z"/>
  <path fill="#000" d="M327.57,82.35c1.58,0,3.02.72,3.95,1.94l2.01-1.51c-1.44-1.87-3.59-2.95-5.96-2.95-4.09,0-7.47,3.3-7.47,7.4s3.3,7.47,7.4,7.47c2.37,0,4.53-1.08,5.96-2.95l-2.01-1.51c-.93,1.22-2.37,1.94-3.95,1.94-2.73,0-4.89-2.23-4.89-4.96s2.23-4.96,4.96-4.96v.07Z"/>
</svg>`;
writeFileSync(join(publicDir, "safari-pinned-tab.svg"), pinnedSvg);
console.log("  safari-pinned-tab.svg");

console.log("\nDone! All favicon assets generated.");
