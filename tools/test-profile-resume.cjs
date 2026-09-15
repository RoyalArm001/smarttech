const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { normalizeResume } = require('../lib/profile-resume');

(async () => {
  const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
  const response = await fetch(base + '/api/profile/public/it-network-engineer');
  assert.equal(response.status, 200);
  const { profile } = await response.json();
  assert.equal(profile.email, 'it@smarttechllc.am');
  assert.equal(profile.resume.hy.length, 7);
  assert.equal(profile.resume.en.length, 7);
  assert.throws(() => normalizeResume({ hy: [{ key: 'skills', items: [{ url: 'javascript:alert(1)' }] }] }));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 950 } });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/profile/it-network-engineer', { waitUntil: 'domcontentloaded' });
      await page.locator('.profile-resume-card').first().waitFor();
      assert.equal(await page.locator('.profile-resume-card').count(), 7);
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await page.getByRole('heading', { name: 'Work experience', exact: true }).waitFor();
      assert.equal(await page.locator('.profile-resume-card a[href="https://patch.ditaknet.com/"]').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: path.join(os.tmpdir(), 'smarttech-profile-' + width + '.png'), fullPage: true });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('.profile-resume-card').first().waitFor();
      assert.equal(await page.locator('.profile-resume-card').count(), 7);
      assert.deepEqual(errors, []);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    let saved;
    await page.route('**/api/admin/session', route => route.fulfill({ json: { authenticated: false } }));
    await page.route('**/api/auth/session', route => route.fulfill({ json: { authenticated: true, user: { role: 'member', email: profile.email } } }));
    await page.route('**/api/profile', route => {
      if (route.request().method() === 'PUT') {
        saved = route.request().postDataJSON();
        return route.fulfill({ json: { profile: { ...profile, resume: normalizeResume(saved.resume), social_links: saved.social_links } } });
      }
      return route.fulfill({ json: { profile } });
    });
    await page.goto(base + '/profile', { waitUntil: 'domcontentloaded' });
    await page.locator('#edit-profile-resume summary').first().waitFor();
    await page.locator('#edit-profile-resume summary').first().click();
    const description = page.locator('.profile-resume-edit-section').first().locator('textarea').first();
    await description.fill('Test update');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.getByRole('button', { name: 'Հայերեն', exact: true }).click();
    await page.locator('#edit-profile-resume summary').first().click();
    assert.equal(await description.inputValue(), 'Test update');
    await page.locator('#profile-edit-form button[type="submit"]').click();
    await page.waitForFunction(() => document.getElementById('edit-status').textContent.includes('պահպանված'));
    assert.equal(saved.resume.hy.find(s => s.key === 'experience').items[0].description, 'Test update');
    assert.deepEqual(saved.resume.en, profile.resume.en);
    assert.equal(saved.social_links.github, profile.social_links.github);
    console.log('PASS: live public profile, HY/EN, desktop/mobile, reload; mocked edit/save preserves other language and links. No live profile changes made by tests.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
