const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const base = 'http://localhost:3000';
  const data = await (await fetch(base + '/api/content?refresh=1')).json();
  const member = data.collections.team.find(item => item.id === 'it-network-engineer');
  assert.equal(member.resume.hy.find(s => s.key === 'experience').items.length, 4);
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const language of ['hy', 'en', 'ru']) {
      const page = await browser.newPage({ viewport: { width: language === 'hy' ? 390 : 1440, height: 900 } });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(lang => localStorage.setItem('smarttech.language.v3', lang), language);
      await page.goto(base + '/member?id=it-network-engineer', { waitUntil: 'domcontentloaded' });
      await page.locator('.member-resume-section').first().waitFor();
      assert.equal(await page.locator('[data-resume-section="experience"] .member-resume-entry').count(), 4);
      assert.equal(await page.locator('[data-resume-section="certifications"] .member-resume-entry').count(), 3);
      assert.equal(await page.locator('[data-resume-section="portfolio"] a').count(), 6);
      assert.equal(await page.locator('.member-story-card').count(), 0);
      assert.equal(await page.locator('.member-personal-socials a[href="https://www.facebook.com/royalarm001/"] svg').count(), 1);
      assert.equal(await page.locator('.member-personal-socials a[href="https://www.youtube.com/@RoyalArm001"] svg').count(), 1);
      const content = await page.locator('.member-content').innerText();
      for (const removed of ['Drone Flight', 'Jermuk Educational Complex', 'Jermuk Ashkhar Health Center']) assert.ok(!content.includes(removed));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.waitForFunction(() => { const el = document.querySelector('.member-profile-card'); return el && getComputedStyle(el).opacity === '1'; });
      await page.locator('.member-profile-card').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(os.tmpdir(), 'smarttech-member-' + language + '.png'), fullPage: false });
      // Verify profile changes refresh this route without navigation. No database writes.
      const changed = structuredClone(data);
      changed.collections.team.find(item => item.id === member.id).fullName = 'Refresh test';
      await page.route('**/api/content?refresh=1', route => route.fulfill({ json: changed }));
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await page.waitForFunction(() => document.querySelector('.member-person-name')?.textContent === 'Refresh test');
      assert.deepEqual(errors, []);
      await page.close();
    }
    const page = await browser.newPage();
    await page.goto(base + '/team', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.team-person-card[href*="it-network-engineer"]');
    await card.waitFor();
    assert.ok((await card.innerText()).includes(member.fullName));
    console.log('PASS: member HY/EN/RU, mobile width, correct CV sections, deleted jobs absent, personal SVG links, live refresh and team name. No DB writes.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
