// Isolated public fixtures: no database, admin or production writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { chromium } = require('playwright');
const seo = require('../lib/project-seo');
const root = path.resolve(__dirname, '..');
const app = express();
let projects = structuredClone(seo.catalog);
require('../lib/project-seo-routes')(app, async () => projects);
app.get('/api/content', (req, res) => res.json({ collections: { projects } }));
app.get('/api/{*path}', (req, res) => res.json({}));
app.get('/', (req, res) => res.sendFile(path.join(root, 'pages/index.html')));
app.use(express.static(root));

(async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.on('listening', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  try {
    const parser = await browser.newPage();
    const canonicals = new Set();
    for (const project of projects) {
      for (const lang of ['hy', 'en', 'ru']) {
        const html = seo.render(project, lang);
        const parsed = await parser.evaluate(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          return {
            lang: doc.documentElement.lang,
            title: doc.title,
            canonical: doc.querySelector('link[rel="canonical"]').getAttribute('href'),
            robots: doc.querySelector('meta[name="robots"]').content,
            alternates: doc.querySelectorAll('link[hreflang]').length,
            heading: doc.querySelector('main h1')?.textContent,
            text: doc.querySelector('main').textContent,
            graphs: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
            payload: JSON.parse(doc.querySelector('#project-seo-data').textContent),
            relativeAssets: [...doc.querySelectorAll('script[src],link[href]')].filter(el => (el.getAttribute('src') || el.getAttribute('href')).startsWith('../')).length
          };
        }, html);
        assert.equal(parsed.lang, lang);
        assert.equal(parsed.canonical, seo.projectUrl(project.id, lang));
        assert.match(parsed.robots, /^index, follow(?:,|$)/);
        assert.equal(parsed.alternates, 3);
        assert.ok(parsed.heading && parsed.text.length > 100);
        assert.ok(parsed.title.includes(parsed.heading.trim()), project.id + ': title and heading must agree');
        assert.ok(parsed.graphs.some(g => g['@graph'].some(n => n['@type'] === 'CreativeWork')));
        assert.equal(parsed.payload.id, project.id);
        assert.equal(parsed.relativeAssets, 0);
        canonicals.add(parsed.canonical);
      }
    }
    assert.equal(canonicals.size, projects.length * 3);
    const xml = await (await fetch(origin + '/sitemap-projects.xml')).text();
    const xmlInfo = await parser.evaluate(xml => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      return { errors: doc.querySelectorAll('parsererror').length, urls: doc.querySelectorAll('url').length };
    }, xml);
    assert.deepEqual(xmlInfo, { errors: 0, urls: projects.length * 3 });
    const old = await fetch(origin + '/project?id=reset-wellness-club&lang=en', { redirect: 'manual' });
    assert.equal(old.status, 301);
    assert.equal(old.headers.get('location'), '/project/reset-wellness-club?lang=en');
    const missing = await fetch(origin + '/project/unknown-project');
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get('x-robots-tag'), 'noindex');
    assert.equal((await fetch(origin + '/api/project-seo?id=reset-wellness-club')).status, 200);
    projects.push({ ...projects[0], id: 'future-project', title: 'Future public project', privateNotes: 'PRIVATE_MARKER' });
    const future = await (await fetch(origin + '/project/future-project')).text();
    assert.ok(future.includes('Future public project'));
    assert.ok(!future.includes('PRIVATE_MARKER'));
    assert.ok((await (await fetch(origin + '/sitemap-projects.xml')).text()).includes('/project/future-project'));
    projects.pop();
    assert.equal((await fetch(origin + '/project/future-project')).status, 404);
    const injected = seo.render({ ...projects[0], title: '</script><script>alert(1)</script>', images: [] }, 'hy');
    assert.ok(!injected.includes('<script>alert(1)</script>'));
    assert.ok(!injected.includes('smarttechllc.am/undefined'));
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJs.newPage();
    await staticPage.goto(origin + '/project/reset-wellness-club', { waitUntil: 'domcontentloaded' });
    assert.ok(await staticPage.locator('main h1').isVisible());
    assert.equal(await staticPage.locator('.detail-gallery-item img').count(), 6);
    await noJs.close();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [lang, badge] of [['hy', 'Հանձնում'], ['en', 'Handover'], ['ru', 'Сдача']]) {
      await page.goto(origin + '/?lang=' + lang, { waitUntil: 'domcontentloaded' });
      const card = page.locator('.home-bottom-project-card[href="/project/reset-wellness-club"]');
      await card.waitFor();
      assert.equal(await card.locator('.project-status-badge').textContent(), badge);
      assert.equal(await card.locator('.project-phase-note').count(), 0);
      assert.equal(await page.locator('.home-bottom-project-card').count(), projects.length);
      for (const width of [1920, 1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const size = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, title: parseFloat(getComputedStyle(document.querySelector('.hero-title')).fontSize), heading: parseFloat(getComputedStyle(document.querySelector('.section-title')).fontSize) }));
        assert.equal(size.overflow, false, lang + ' width ' + width);
        assert.ok(size.title <= 60 && size.heading <= 28);
      }
      await page.goto(origin + '/project/reset-wellness-club?lang=' + lang, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#site-header .brand');
      assert.equal(await page.locator('.current-project-badge').textContent(), badge);
      assert.equal(await page.locator('.detail-gallery-item img').count(), 6);
      assert.equal(await page.locator('body').evaluate(el => el.classList.contains('is-home-page')), false);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: ' + projects.length + ' projects / ' + canonicals.size + ' localized canonical pages, JSON-LD, XML, no-JS content, live catalog changes, redirects, 404s, data escaping, handover badge, 5 home viewport widths and detail hydration.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
