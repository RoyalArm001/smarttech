const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [1440, 900, 390]) {
      for (const route of ['/home', '/team', '/member?id=it-network-engineer', '/profile/it-network-engineer']) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.SmartTech?.cms?.signature);
        const toggle = page.locator('.nav-toggle');
        const opener = await toggle.isVisible() ? toggle : page.locator('[data-bottom-action="menu"]');
        await opener.click();
        await page.waitForFunction(() => {
          const panel = document.querySelector('.nav-panel');
          const rect = panel.getBoundingClientRect();
          return panel.classList.contains('is-open') && getComputedStyle(panel).opacity === '1' &&
            rect.top >= 0 && rect.bottom <= innerHeight &&
            panel.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + 40));
        });
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await opener.click();
        const link = page.locator('.nav-panel a[href]').filter({ visible: true }).first();
        await link.click();
        await page.waitForFunction(() => !document.body.classList.contains('is-menu-open'));
        await page.close();
      }
    }
    console.log('PASS: desktop, tablet and mobile menu visible/hit-testable on four routes; Escape and navigation close it.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
