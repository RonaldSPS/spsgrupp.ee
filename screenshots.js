const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // Variant A - Minimalist
  console.log('Taking screenshot of Variant A...');
  await page.goto('http://localhost:3001/variant-a', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: './public/variant-a.png',
    fullPage: true,
    type: 'png'
  });
  console.log('✓ Variant A saved to public/variant-a.png');

  // Variant B - Modern/Energetic
  console.log('Taking screenshot of Variant B...');
  await page.goto('http://localhost:3001/variant-b', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: './public/variant-b.png',
    fullPage: true,
    type: 'png'
  });
  console.log('✓ Variant B saved to public/variant-b.png');

  // Variant C - Dark/Premium
  console.log('Taking screenshot of Variant C...');
  await page.goto('http://localhost:3001/variant-c', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: './public/variant-c.png',
    fullPage: true,
    type: 'png'
  });
  console.log('✓ Variant C saved to public/variant-c.png');

  await browser.close();
  console.log('\n✅ All screenshots completed!');
})();
