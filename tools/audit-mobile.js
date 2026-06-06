const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.resolve(rootDir, "tmp");
const reportPath = path.resolve(outputDir, "mobile-audit-report.json");
const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const widths = (process.env.AUDIT_WIDTHS || "320,375,390,414,768")
  .split(",")
  .map((width) => Number(width.trim()))
  .filter(Boolean);
const heights = { 320: 700, 375: 812, 390: 844, 414: 896, 768: 1024 };
const seedPaths = [
  "/",
  "/home",
  "/services",
  "/projects",
  "/request",
  "/partners",
  "/team",
  "/about",
  "/contact",
  "/help",
  "/faq",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/licenses"
];
const coreInteractionRoutes = new Set(["/", "/home", "/services", "/request", "/team", "/contact"]);

function normalizePath(href) {
  try {
    const url = new URL(href, baseUrl);
    if (url.origin !== baseUrl) return null;
    return url.pathname + url.search;
  } catch (error) {
    return null;
  }
}

function routeKey(routePath) {
  return routePath.replace(/\/?$/, "") || "/";
}

async function discoverRoutes(browser) {
  const discovered = new Set(seedPaths.map(routeKey));
  const queue = Array.from(discovered);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();

  while (queue.length && discovered.size < 120) {
    const route = queue.shift();
    try {
      await page.goto(baseUrl + route, { waitUntil: "domcontentloaded", timeout: 12000 });
      await page.waitForTimeout(650);
      const links = await page.$$eval("a[href]", (nodes) => nodes.map((anchor) => anchor.href));

      links.forEach((href) => {
        const next = normalizePath(href);
        if (!next || /\.(png|jpe?g|webp|svg|pdf)$/i.test(next)) return;
        const key = routeKey(next);
        if (!discovered.has(key)) {
          discovered.add(key);
          queue.push(key);
        }
      });
    } catch (error) {
      // The per-route audit records navigation problems later.
    }
  }

  await context.close();
  return Array.from(discovered).sort((left, right) => left.localeCompare(right));
}

async function inspectPage(page) {
  return page.evaluate(() => {
    function selectorFor(element) {
      if (!element || !element.tagName) return "";
      const id = element.id ? "#" + element.id : "";
      const classes = String(element.className || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((className) => "." + className)
        .join("");
      return element.tagName.toLowerCase() + id + classes;
    }

    function isVisible(element) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity || 1) > 0.01 &&
        rect.width > 1 &&
        rect.height > 1;
    }

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

    const overflowing = Array.from(document.body.querySelectorAll("*"))
      .filter(isVisible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: selectorFor(element),
          text: (element.innerText || element.getAttribute("aria-label") || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          top: Math.round(rect.top)
        };
      })
      .filter((item) => item.width > 4 && (item.left < -2 || item.right > viewportWidth + 2))
      .slice(0, 16);

    const smallTargets = Array.from(document.querySelectorAll([
      "a[href]",
      "button",
      "input:not([type='hidden'])",
      "select",
      "textarea",
      "[role='button']",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",")))
      .filter((element) => !element.disabled && isVisible(element))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: selectorFor(element),
          label: (element.innerText || element.value || element.getAttribute("aria-label") || element.getAttribute("placeholder") || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 90),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top)
        };
      })
      .filter((item) => item.width < 44 || item.height < 44)
      .slice(0, 20);

    const blockedTargets = Array.from(document.querySelectorAll([
      "a[href]",
      "button",
      "input:not([type='hidden'])",
      "select",
      "textarea",
      "[role='button']"
    ].join(",")))
      .filter((element) => !element.disabled && isVisible(element))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const x = Math.min(Math.max(rect.left + rect.width / 2, 1), viewportWidth - 1);
        const y = Math.min(Math.max(rect.top + rect.height / 2, 1), viewportHeight - 1);
        const topElement = document.elementFromPoint(x, y);
        const blocked = topElement &&
          topElement !== element &&
          !element.contains(topElement) &&
          !topElement.contains(element);

        return blocked ? {
          selector: selectorFor(element),
          topSelector: selectorFor(topElement),
          label: (element.innerText || element.getAttribute("aria-label") || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 90)
        } : null;
      })
      .filter(Boolean)
      .slice(0, 16);

    const missingNames = Array.from(document.querySelectorAll("button,a[href],input:not([type='hidden']),select,textarea"))
      .filter(isVisible)
      .filter((element) => {
        const name = (element.innerText ||
          element.value ||
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.getAttribute("placeholder") ||
          "").trim();

        if (element.matches("input, textarea, select")) {
          const id = element.getAttribute("id");
          const parentLabel = element.closest("label");
          const labelledBy = element.getAttribute("aria-labelledby");
          return !parentLabel &&
            !element.getAttribute("aria-label") &&
            !(id && document.querySelector("label[for='" + CSS.escape(id) + "']")) &&
            !labelledBy;
        }

        return !name && !element.querySelector("svg[aria-label], img[alt]");
      })
      .map(selectorFor)
      .slice(0, 16);

    return {
      scrollWidth,
      clientWidth: viewportWidth,
      overflowing,
      smallTargets,
      blockedTargets,
      missingNames
    };
  });
}

async function testMenu(page, width) {
  if (width > 768 || await page.locator(".nav-toggle").count() === 0) return null;

  try {
    await page.locator(".nav-toggle").click({ timeout: 3000 });
    await page.waitForTimeout(180);
    const openState = await page.evaluate(() => ({
      bodyOpen: document.body.classList.contains("is-menu-open"),
      expanded: document.querySelector(".nav-toggle")?.getAttribute("aria-expanded"),
      hidden: document.querySelector(".nav-panel")?.getAttribute("aria-hidden"),
      visibleLinks: Array.from(document.querySelectorAll(".mobile-nav-grid a")).filter((anchor) => {
        const rect = anchor.getBoundingClientRect();
        const style = getComputedStyle(anchor);
        return rect.width > 1 && rect.height > 1 && style.visibility !== "hidden" && style.display !== "none";
      }).length
    }));

    await page.keyboard.press("Escape");
    await page.waitForTimeout(160);
    const closeState = await page.evaluate(() => ({
      bodyOpen: document.body.classList.contains("is-menu-open"),
      expanded: document.querySelector(".nav-toggle")?.getAttribute("aria-expanded"),
      hidden: document.querySelector(".nav-panel")?.getAttribute("aria-hidden")
    }));

    return { openState, closeState };
  } catch (error) {
    return { error: String(error.message || error).slice(0, 260) };
  }
}

async function testLanguage(page) {
  try {
    const toggle = page.locator("[data-language-toggle]").first();
    if (await toggle.count() === 0) return null;

    await toggle.click({ timeout: 3000 });
    await page.waitForTimeout(160);
    const open = await page.evaluate(() => document.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded"));
    const buttonCount = await page.locator("[data-online-lang]").count();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(120);
    const closed = await page.evaluate(() => document.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded"));
    return { open, closed, buttonCount };
  } catch (error) {
    return { error: String(error.message || error).slice(0, 260) };
  }
}

async function testRequestBuilder(page, route) {
  if (!route.startsWith("/request")) return null;

  try {
    await page.locator("[data-request-next]").first().click({ timeout: 3000 });
    await page.waitForTimeout(140);
    const activeStepAfterNext = await page.evaluate(() => document.querySelector(".request-step.is-active")?.getAttribute("data-request-step"));
    await page.locator("[data-request-system]").first().click({ timeout: 3000 });
    await page.waitForTimeout(140);
    const menuToggle = page.locator("[data-request-menu-toggle]").first();
    await menuToggle.click({ timeout: 3000 });
    await page.waitForTimeout(140);
    const menuExpanded = await menuToggle.getAttribute("aria-expanded");
    const panelVisible = await page.evaluate(() => !document.querySelector("[data-request-menu-panel]")?.hidden);
    await page.locator("[data-request-menu-confirm]").first().click({ timeout: 3000 });
    return { activeStepAfterNext, menuExpanded, panelVisible };
  } catch (error) {
    return { error: String(error.message || error).slice(0, 260) };
  }
}

async function testChat(page) {
  try {
    const trigger = page.locator(".auto-chat-trigger");
    if (await trigger.count() === 0) return null;

    await trigger.click({ timeout: 3000 });
    await page.waitForTimeout(220);
    const open = await page.evaluate(() => ({
      open: document.querySelector(".auto-chat-shell")?.classList.contains("is-open"),
      inputFocused: document.activeElement?.classList.contains("auto-chat-input")
    }));
    const quick = page.locator(".auto-chat-quick").first();
    if (await quick.count()) await quick.click({ timeout: 3000 });
    await page.waitForTimeout(180);
    const messages = await page.locator(".auto-chat-message").count();
    await page.locator(".auto-chat-close").click({ timeout: 3000 });
    return { open, messages };
  } catch (error) {
    return { error: String(error.message || error).slice(0, 260) };
  }
}

async function auditRoute(context, route, width) {
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const networkFailures = [];

  page.on("console", (message) => {
    const type = message.type();
    if (type === "error" || type === "warning") {
      consoleMessages.push({ type, text: message.text().slice(0, 260) });
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(String(error && error.message || error).slice(0, 260));
  });
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.includes("firebase") || url.includes("googletagmanager") || url.includes("google-analytics")) {
      networkFailures.push({ url, failure: request.failure()?.errorText || "failed" });
    }
  });

  let navigationError = null;
  try {
    await page.goto(baseUrl + route, { waitUntil: "domcontentloaded", timeout: 12000 });
    await page.waitForTimeout(650);
  } catch (error) {
    navigationError = String(error.message || error).slice(0, 260);
  }

  const pageData = await inspectPage(page);
  const shouldRunSharedInteractions = coreInteractionRoutes.has(route);
  const menuInteraction = shouldRunSharedInteractions ? await testMenu(page, width) : null;
  const languageInteraction = shouldRunSharedInteractions ? await testLanguage(page) : null;
  const requestInteraction = await testRequestBuilder(page, route);
  const chatInteraction = shouldRunSharedInteractions ? await testChat(page) : null;

  await page.close();

  return {
    width,
    route,
    navigationError,
    consoleMessages,
    pageErrors,
    networkFailures,
    ...pageData,
    menuInteraction,
    languageInteraction,
    requestInteraction,
    chatInteraction
  };
}

function summarize(routes, results) {
  return {
    routeCount: routes.length,
    routes,
    totalChecks: results.length,
    navigationErrors: results
      .filter((result) => result.navigationError)
      .map((result) => ({ width: result.width, route: result.route, error: result.navigationError })),
    consoleErrors: results
      .filter((result) => result.consoleMessages.length || result.pageErrors.length)
      .map((result) => ({ width: result.width, route: result.route, console: result.consoleMessages, pageErrors: result.pageErrors }))
      .slice(0, 80),
    networkFailures: results
      .filter((result) => result.networkFailures.length)
      .map((result) => ({ width: result.width, route: result.route, failures: result.networkFailures }))
      .slice(0, 80),
    overflow: results
      .filter((result) => result.scrollWidth > result.clientWidth + 1 || result.overflowing.length)
      .map((result) => ({
        width: result.width,
        route: result.route,
        scrollWidth: result.scrollWidth,
        clientWidth: result.clientWidth,
        elements: result.overflowing.slice(0, 8)
      }))
      .slice(0, 120),
    smallTargets: results
      .filter((result) => result.smallTargets.length)
      .map((result) => ({ width: result.width, route: result.route, targets: result.smallTargets.slice(0, 10) }))
      .slice(0, 120),
    blockedTargets: results
      .filter((result) => result.blockedTargets.length)
      .map((result) => ({ width: result.width, route: result.route, targets: result.blockedTargets }))
      .slice(0, 120),
    missingNames: results
      .filter((result) => result.missingNames.length)
      .map((result) => ({ width: result.width, route: result.route, missing: result.missingNames }))
      .slice(0, 120),
    menuFailures: results
      .filter((result) => coreInteractionRoutes.has(result.route) && result.width <= 768 && (!result.menuInteraction ||
        result.menuInteraction.error ||
        result.menuInteraction.openState?.expanded !== "true" ||
        result.menuInteraction.closeState?.expanded !== "false"))
      .map((result) => ({ width: result.width, route: result.route, menu: result.menuInteraction }))
      .slice(0, 120),
    languageFailures: results
      .filter((result) => coreInteractionRoutes.has(result.route) && (!result.languageInteraction ||
        result.languageInteraction.error ||
        result.languageInteraction.open !== "true" ||
        result.languageInteraction.closed !== "false")
      )
      .map((result) => ({ width: result.width, route: result.route, language: result.languageInteraction }))
      .slice(0, 80),
    requestFailuresUi: results
      .filter((result) => result.route.startsWith("/request") && (!result.requestInteraction ||
        result.requestInteraction.error ||
        result.requestInteraction.activeStepAfterNext !== "1" ||
        result.requestInteraction.menuExpanded !== "true" ||
        !result.requestInteraction.panelVisible))
      .map((result) => ({ width: result.width, route: result.route, request: result.requestInteraction })),
    chatFailures: results
      .filter((result) => coreInteractionRoutes.has(result.route) && (!result.chatInteraction || result.chatInteraction.error || !result.chatInteraction.open?.open))
      .map((result) => ({ width: result.width, route: result.route, chat: result.chatInteraction }))
      .slice(0, 80)
  };
}

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const routes = await discoverRoutes(browser);
  const results = [];

  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: heights[width] || 844 },
      deviceScaleFactor: width >= 768 ? 1 : 2,
      hasTouch: true,
      isMobile: width < 768,
      userAgent: width < 768
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : undefined
    });

    for (const route of routes) {
      results.push(await auditRoute(context, route, width));
    }

    await context.close();
  }

  await browser.close();

  fs.mkdirSync(outputDir, { recursive: true });
  const report = summarize(routes, results);
  fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), report, results }, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
