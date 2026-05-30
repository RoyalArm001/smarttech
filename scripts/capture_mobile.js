const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on('console', msg => {
    try { console.log('PAGE_CONSOLE', msg.type(), msg.text()); } catch (e) {}
  });
  page.on('pageerror', err => console.log('PAGE_ERROR', err.toString()));

  try {
    console.log('Navigating to http://localhost:3000/ ...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    console.log('Page loaded. Taking screenshots...');
    await page.screenshot({ path: '/tmp/home_mobile.png', fullPage: true });
    console.log('Saved /tmp/home_mobile.png');

    // Try opening mobile menu
    try {
      await page.click('.nav-toggle', { timeout: 2000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: '/tmp/home_mobile_menu.png' });
      console.log('Saved /tmp/home_mobile_menu.png');
    } catch (e) {
      console.log('nav-toggle click failed:', e.message);
    }

    // Try clicking first nav link inside mobile menu
    try {
      const link = await page.$('.mobile-nav-list .nav-link');
      if (link) {
        await link.click({ timeout: 2000 });
        await page.waitForTimeout(600);
        await page.screenshot({ path: '/tmp/home_mobile_after_click.png', fullPage: true });
        console.log('Saved /tmp/home_mobile_after_click.png');
      } else {
        console.log('No mobile nav link found to click.');
      }
    } catch (e) {
      console.log('nav-link click failed:', e.message);
    }

  } catch (err) {
    console.log('Script error', err && err.stack ? err.stack : err);
  } finally {
    await browser.close();
  }
})();
