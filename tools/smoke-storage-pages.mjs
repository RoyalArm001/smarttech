import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = process.argv[2] || 'http://127.0.0.1:3000';
const systemBrowser = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(file => fs.existsSync(file));
const browser = await chromium.launch({ headless: true, executablePath: systemBrowser });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const failures = [];
page.on('requestfailed', request => {
  if (!request.url().includes('google-analytics.com')) failures.push(request.url());
});

try {
  for (const pathname of ['/home', '/projects', '/partners', '/team']) {
    await page.goto(baseUrl + pathname, { waitUntil: 'networkidle' });
    const cms = await page.evaluate(() => ({
      loaded: Boolean(window.SmartTech?.cms?.loaded),
      serviceImage: window.SmartTech?.content?.services?.[0]?.image || '',
      projectImage: window.SmartTech?.content?.projects?.[0]?.images?.[0] || '',
      partnerLogo: window.SmartTech?.content?.partners?.[0]?.logo || '',
      teamImage: window.SmartTech?.content?.team?.[0]?.image || ''
    }));
    const images = await page.locator('img').evaluateAll(elements => elements.map(element => ({
      src: element.currentSrc || element.src,
      broken: element.complete && element.naturalWidth === 0
    })));
    const storage = images.filter(image => image.src.includes('.supabase.co/storage/'));
    const broken = images.filter(image => image.broken);
    console.log(`${pathname} cms=${cms.loaded} images=${images.length} storage=${storage.length} broken=${broken.length}`);
    console.log(JSON.stringify(cms));
    for (const image of broken.slice(0, 5)) console.log(`BROKEN ${image.src}`);
  }
  console.log(`requestFailures=${failures.length}`);
  for (const url of failures.slice(0, 10)) console.log(`FAILED ${url}`);
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
