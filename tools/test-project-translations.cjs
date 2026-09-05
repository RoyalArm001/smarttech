// Offline regression tests. CMS saves are intercepted; no production data is changed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const os = require('node:os');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const project = {
  id: 'translation-test', title: 'Հայերեն նախագիծ', status: 'current', phase: 'Մոնտաժ',
  works: ['Էլեկտրամոնտաժ'], images: [], systemImages: [],
  translations: { en: { title: 'English project', works: ['Electrical works'], phase: 'Installation', extra: 'Keep me' }, ru: { title: 'Русский проект', works: ['Электромонтаж'], phase: 'Монтаж' } }
};
function unitTests() {
  const context = vm.createContext({ window: { location: { search: '' }, localStorage: { getItem: () => 'hy', setItem: () => {} } } });
  for (const file of ['src/core/namespace.js', 'src/content/locales/index.js', 'src/content/services/index.js', 'src/core/i18n.js', 'src/core/cms-merge.js', 'src/core/utils.js', 'src/sections/detail/index.js']) vm.runInContext(read(file), context);
  const site = context.window.SmartTech;
  const sample = structuredClone(project);
  for (const language of ['hy', 'en', 'ru']) {
    site.i18n.setLanguage(language);
    for (const status of ['current', 'partial', 'completed']) {
      for (const [index, stage] of site.projectStages.all.entries()) {
        const staged = { ...sample, status, stage: stage.id };
        site.content.projects = [staged];
        const html = site.sections.projectDetail(staged.id);
        assert.equal((html.match(/class="project-stage-item/g) || []).length, 5);
        assert.equal((html.match(/aria-current="step"/g) || []).length, status === 'completed' ? 0 : 1);
        assert.equal((html.match(/project-stage-item[^\"]*is-done/g) || []).length, status === 'completed' ? 5 : index);
        assert.ok(html.includes(stage.labels[language]), 'Each stage has a translated label');
        if (status !== 'completed') assert.ok(html.includes('<strong>' + stage.labels[language] + '</strong><em>'), 'Actual saved stage must be active');
      }
    }
    site.content.projects = [{ ...sample, stage: '' }];
    assert.ok(!site.sections.projectDetail(sample.id).includes('aria-current="step"'), 'Unknown stage must not be guessed');
  }
  console.log('PASS: all five stages across three statuses and HY/EN/RU, completed and unknown-stage timelines');
  for (const lang of ['hy', 'en', 'ru']) {
    site.i18n.setLanguage(lang);
    const localized = site.i18n.project(sample);
    assert.equal(localized.phase, lang === 'hy' ? sample.phase : sample.translations[lang].phase);
    assert.equal(localized.status, 'current');
    assert.equal(localized.title, lang === 'hy' ? sample.title : sample.translations[lang].title);
    site.content.projects = [sample];
    const html = site.sections.projectDetail(sample.id);
    assert.ok(html.includes('project-phase-note">' + localized.phase), 'Detail phase must use selected language');
  }
  site.i18n.setLanguage('en');
  site.content.locales.en.projects[sample.id] = { title: 'Dictionary title', works: ['Dictionary work'], phase: 'Dictionary phase' };
  sample.translations.en = { title: '', works: [], phase: 'Custom phase', status: 'completed', id: 'wrong-id' };
  assert.equal(site.i18n.project(sample).title, 'Dictionary title');
  assert.equal(site.i18n.project(sample).works[0], 'Dictionary work');
  assert.equal(site.i18n.project(sample).phase, 'Custom phase');
  assert.equal(site.i18n.project(sample).status, 'current');
  assert.equal(site.i18n.project(sample).id, sample.id);
  site.cms.apply({ collections: { projects: [{ id: sample.id, translations: {} }] } });
  assert.equal(Object.keys(site.content.projects[0].translations).length, 0, 'Cleared translations must not reappear from bundled data');
  assert.equal(site.i18n.project(site.content.projects[0]).phase, 'Dictionary phase');
  site.i18n.setLanguage('ru');
  assert.equal(site.i18n.project(site.content.projects[0]).title, sample.title, 'Missing locale falls back to base');
  console.log('PASS: HY/EN/RU project/detail text, partial and empty translations, protected metadata, cleared CMS translations');
}
async function browserTests() {
  const html = read('admin/index.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const server = http.createServer((req, res) => {
    if (req.url === '/admin/panel.css') { res.setHeader('Content-Type', 'text/css'); res.end(read('admin/panel.css')); }
    else if (req.url === '/admin') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); }
    else { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port + '/admin');
    await page.evaluate(initial => {
      window.testData = [initial, { ...initial, id: 'second-project', title: 'Երկրորդ նախագիծ', translations: {} }];
      window.testSaves = [];
      document.getElementById('admin-login').hidden = true;
      document.getElementById('admin-panel').hidden = false;
      window.adminSetStatus = text => { document.getElementById('admin-status').textContent = text; };
      window.adminRequestJson = async (url, options = {}) => {
        if (url === '/api/admin/cms') return { collections: [{ id: 'projects', label: 'Նախագծեր' }] };
        if (url === '/api/admin/cms/locales') return { data: { en: { projects: { 'translation-test': { title: 'Dictionary title' } } } } };
        if (options.method === 'PUT') {
          window.testData = structuredClone(options.body);
          window.testSaves.push(structuredClone(options.body));
        }
        return { data: structuredClone(window.testData), meta: { label: 'Նախագծեր' } };
      };
    }, project);
    await page.addScriptTag({ path: path.join(root, 'src/core/namespace.js') });
    await page.addScriptTag({ path: path.join(root, 'admin/cms-editor.js') });
    await page.evaluate(() => window.SmartTechAdminCms.reload());
    assert.equal(await page.locator('[data-field-type=json]').count(), 0);
    const hyTitle = page.locator('[data-entity-field=title]');
    await hyTitle.click();
    await hyTitle.press('End');
    await hyTitle.pressSequentially(' TEST');
    assert.ok((await hyTitle.inputValue()).endsWith(' TEST'), 'Clicking form controls must not rerender/reset focus');
    await page.locator('[data-cms-language=en]').click();
    const enPhase = page.locator('[data-translation-language=en][data-translation-key=phase]');
    await enPhase.fill('Testing phase');
    await page.locator('[data-translation-language=en][data-translation-key=works]').fill('Work one\nWork two');
    await page.locator('[data-cms-language=ru]').click();
    await page.locator('[data-translation-language=ru][data-translation-key=title]').fill('Обновлённый проект');
    await page.locator('[data-cms-language=ru]').press('ArrowLeft');
    assert.equal(await page.locator('[data-cms-language=en]').getAttribute('aria-selected'), 'true');
    assert.equal(await enPhase.inputValue(), 'Testing phase');
    await page.locator('button[data-entity-index="1"]').click();
    await page.locator('button[data-entity-index="0"]').click();
    assert.equal(await enPhase.inputValue(), 'Testing phase', 'Switching projects preserves drafts');
    await page.locator('[data-entity-field=status]').selectOption('partial');
    assert.deepEqual(await page.locator('[data-entity-field=stage] option').evaluateAll(options => options.map(option => option.value)), ['', 'survey', 'supply', 'installation', 'programming', 'handover']);
    await page.locator('[data-entity-field=stage]').selectOption('supply');
    await page.locator('#cms-entity-form button[type=submit]').click();
    await page.waitForFunction(() => window.testSaves.length === 1);
    const saved = await page.evaluate(() => window.testSaves[0][0]);
    assert.equal(saved.title, project.title + ' TEST');
    assert.equal(saved.phase, project.phase);
    assert.equal(saved.status, 'partial');
    assert.equal(saved.stage, 'supply');
    assert.equal(saved.translations.en.phase, 'Testing phase');
    assert.deepEqual(saved.translations.en.works, ['Work one', 'Work two']);
    assert.equal(saved.translations.en.extra, 'Keep me');
    assert.equal(saved.translations.ru.title, 'Обновлённый проект');
    await page.evaluate(() => window.SmartTechAdminCms.reload());
    assert.equal(await page.locator('[data-entity-field=stage]').inputValue(), 'supply');
    assert.equal(await enPhase.inputValue(), 'Testing phase');
    await page.locator('[data-translation-language=en][data-translation-key=title]').fill('');
    await page.locator('#cms-entity-form button[type=submit]').click();
    await page.waitForFunction(() => window.testSaves.length === 2);
    assert.equal(await page.evaluate(() => Object.hasOwn(window.testSaves[1][0].translations.en, 'title')), false);
    assert.equal(await page.locator('[data-translation-language=en][data-translation-key=title]').getAttribute('placeholder'), 'Dictionary title');
    await page.locator('[data-cms-language=hy]').click();
    await hyTitle.fill('');
    await page.locator('[data-cms-language=en]').click();
    await page.locator('#cms-entity-form button[type=submit]').click();
    assert.equal(await page.locator('[data-cms-language=hy]').getAttribute('aria-selected'), 'true', 'Validation reveals invalid base-language field');
    assert.equal(await page.evaluate(() => window.testSaves.length), 2);
    await hyTitle.fill(project.title);
    await page.locator('[data-entity-field=status]').selectOption('completed');
    assert.equal(await page.locator('[data-entity-field=stage]').isDisabled(), true);
    assert.equal(await page.locator('[data-entity-field=stage]').inputValue(), 'handover');
    await page.locator('#cms-entity-form button[type=submit]').click();
    await page.waitForFunction(() => window.testSaves.length === 3);
    assert.equal(await page.evaluate(() => window.testSaves[2][0].stage), 'handover');
    await page.locator('[data-entity-field=status]').selectOption('current');
    assert.equal(await page.locator('[data-entity-field=stage]').isDisabled(), false);
    const screenshots = fs.mkdtempSync(path.join(os.tmpdir(), 'smarttech-translations-'));
    await page.locator('.cms-entity-editor').screenshot({ path: path.join(screenshots, 'stages-desktop.png') });
    await page.locator('.cms-translations').screenshot({ path: path.join(screenshots, 'desktop.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-cms-language=ru]').click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile editor must not overflow');
    await page.locator('.cms-translations').screenshot({ path: path.join(screenshots, 'mobile.png') });
    await page.locator('[data-entity-field=stage]').locator('..').screenshot({ path: path.join(screenshots, 'stages-mobile.png') });
    assert.deepEqual(errors, []);
    console.log('PASS: editor focus, language tabs/keyboard, draft retention, save/reload, clearing, required fields, mobile width');
    console.log('Screenshots:', screenshots);
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
Promise.resolve().then(unitTests).then(browserTests).catch(error => { console.error(error); process.exitCode = 1; });
