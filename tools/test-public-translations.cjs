const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const articles = require('../lib/seo-articles').articles;
const landings = require('../lib/seo-landings').landingPages;

(async () => {
  assert.ok(!fs.existsSync('.env') && !fs.existsSync('.env.local'), 'Use fixture configuration');
  process.env.PUBLIC_CONTENT_SOURCE = 'repository';
  const server = require('../server').start(0);
  if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const base = 'http://127.0.0.1:' + server.address().port;
  const errors = [];
  const leaks = [];
  const publications = ['/blog', ...articles.map(article => '/blog/' + article.slug), ...landings.map(landing => '/' + landing.slug)];
  const pages = ['/home', '/services', '/projects', '/album', '/team', '/about', '/contact', '/request', '/partners', ...publications];
  let checked = 0;
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const request = route.request();
      if (request.method() !== 'GET' || new URL(request.url()).hostname !== '127.0.0.1') return route.abort();
      return route.continue();
    });
    for (const language of ['hy', 'en', 'ru']) {
      for (const pathname of pages) {
        const response = await page.goto(base + pathname + '?lang=' + language, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, pathname);
        await page.waitForFunction(() => document.querySelector('#site-main h1'));
        const text = await page.locator('#site-main').innerText();
        assert.ok(text.length > 40, pathname);
        if (language !== 'hy' && /[\u0531-\u058f]/.test(text)) {
          leaks.push({ pathname, language, lines: text.split('\n').filter(line => /[\u0531-\u058f]/.test(line)).slice(0, 3) });
        }
        if (publications.includes(pathname)) {
          assert.equal(await page.locator('html').getAttribute('lang'), language);
          const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
          assert.equal(canonical, 'https://smarttechllc.am' + pathname + (language === 'hy' ? '' : '?lang=' + language));
          if (language !== 'hy') assert.ok(!/[\u0531-\u058f]/.test(await page.title()), pathname + ' title');
        }
        if (pathname === '/blog') assert.equal(await page.locator('.seo-blog-card').count(), articles.length);
        checked++;
      }
    }
    console.log(JSON.stringify({ checked, errors, untranslated: leaks }));
    assert.deepEqual(errors, []);
    assert.deepEqual(leaks, []);
  } finally {
    await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
