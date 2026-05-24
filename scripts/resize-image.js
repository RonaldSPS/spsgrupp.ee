const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '..', 'public', 'kontoridjaaripinnad.jpg');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'industries');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

async function process() {
  // Resize to 800x460
  await sharp(inputPath)
    .resize(800, 460, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, 'kontorid-800x460.webp'));
  console.log('Created 800x460');

  // Resize to 1600x920
  await sharp(inputPath)
    .resize(1600, 920, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, 'kontorid-1600x920.webp'));
  console.log('Created 1600x920');

  console.log('Done!');
}

process().catch(console.error);