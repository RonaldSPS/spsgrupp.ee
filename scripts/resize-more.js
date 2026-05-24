const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '..', 'public');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'industries');

fs.mkdirSync(outputDir, { recursive: true });

const images = [
  'kaubanduskeskused.jpg',
  'hotellid.jpg'
];

async function processImages() {
  for (const img of images) {
    const name = img.replace('.jpg', '');
    const inputPath = path.join(inputDir, img);
    
    // 800x460
    await sharp(inputPath)
      .resize(800, 460, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${name}-800x460.webp`));
    console.log(`Created ${name}-800x460.webp`);
    
    // 1600x920
    await sharp(inputPath)
      .resize(1600, 920, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${name}-1600x920.webp`));
    console.log(`Created ${name}-1600x920.webp`);
  }
  console.log('All done!');
}

processImages().catch(console.error);