const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3002/');
  const toggle = await page.$('.nav-toggle');
  console.log('TITLE:', await page.title());
  console.log('HAS NAV TOGGLE:', Boolean(toggle));
  console.log('BACKGROUND:', await page.evaluate(() => {
    const panel = document.querySelector('.nav-panel');
    return panel ? {
      className: panel.className,
      ariaHidden: panel.getAttribute('aria-hidden'),
      visibility: window.getComputedStyle(panel).visibility,
      opacity: window.getComputedStyle(panel).opacity,
      pointerEvents: window.getComputedStyle(panel).pointerEvents
    } : 'missing';
  }));
  if (toggle) {
    await toggle.click();
    await page.waitForTimeout(500);
    console.log('AFTER CLICK:', await page.evaluate(() => {
      const panel = document.querySelector('.nav-panel');
      const body = document.body;
      const toggle = document.querySelector('.nav-toggle');
      return {
        panelClass: panel ? panel.className : null,
        bodyOpen: body.classList.contains('is-menu-open'),
        toggleExpanded: toggle ? toggle.getAttribute('aria-expanded') : null,
        panelHidden: panel ? panel.getAttribute('aria-hidden') : null,
        panelVisibility: panel ? window.getComputedStyle(panel).visibility : null,
        panelOpacity: panel ? window.getComputedStyle(panel).opacity : null,
        panelPointerEvents: panel ? window.getComputedStyle(panel).pointerEvents : null,
        backdrop: (() => {
          const backdrop = document.querySelector('.nav-backdrop');
          return backdrop ? {
            className: backdrop.className,
            visibility: window.getComputedStyle(backdrop).visibility,
            opacity: window.getComputedStyle(backdrop).opacity,
            pointerEvents: window.getComputedStyle(backdrop).pointerEvents,
            zIndex: window.getComputedStyle(backdrop).zIndex
          } : null;
        })()
      };
    }));
  }
  await browser.close();
})();