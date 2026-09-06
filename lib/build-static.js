const fs = require("fs");
const path = require("path");
const seo = require("./seo-config");
const landings = require("./seo-landings");
const articles = require("./seo-articles");

const rootDir = path.resolve(__dirname, "..");
const siteDir = rootDir;
const outputDir = path.resolve(rootDir, "dist");
const pageTemplateDir = path.resolve(rootDir, "lib", "page-templates");
const siteCopyEntries = ["pages", "src", "img", "manifest.json", "_redirects", "llms.txt"];

function resolvePagesDir() {
  if (resolvePagesDir.cached) {
    return resolvePagesDir.cached;
  }

  const primary = path.resolve(siteDir, "pages");
  if (fs.existsSync(primary)) {
    resolvePagesDir.cached = primary;
    return primary;
  }
  if (fs.existsSync(pageTemplateDir)) {
    console.warn("pages/ not found — using lib/page-templates/ for build");
    resolvePagesDir.cached = pageTemplateDir;
    return pageTemplateDir;
  }

  resolvePagesDir.cached = primary;
  return primary;
}

function resolvePageFile(pageName) {
  const pagesDir = resolvePagesDir();
  return path.resolve(pagesDir, pageName + ".html");
}

function parseEnvLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex <= 0) return null;

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return null;

  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnvFile(fileName) {
  const filePath = path.resolve(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;

  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach((line) => {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key]) return;
    process.env[parsed.key] = parsed.value;
  });
}

loadEnvFile(".env");
loadEnvFile(".env.local");

function assertInsideRoot(target) {
  const relative = path.relative(rootDir, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to write outside project root: " + target);
  }
}

assertInsideRoot(outputDir);

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

function copyDirRecursive(fromDir, toDir) {
  const entries = fs.readdirSync(fromDir, { withFileTypes: true });
  fs.mkdirSync(toDir, { recursive: true });

  for (const entry of entries) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(from, to);
      continue;
    }

    if (entry.isSymbolicLink()) {
      const realPath = fs.realpathSync(from);
      const stat = fs.statSync(realPath);
      if (stat.isDirectory()) {
        copyDirRecursive(realPath, to);
      } else {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(realPath, to);
      }
      continue;
    }

    if (entry.isFile()) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

siteCopyEntries.forEach((entry) => {
  let from = path.resolve(siteDir, entry);
  if (entry === "pages" && !fs.existsSync(from) && fs.existsSync(pageTemplateDir)) {
    from = pageTemplateDir;
  }
  const to = path.resolve(outputDir, entry === "pages" && from === pageTemplateDir ? "pages" : entry);
  if (!fs.existsSync(from)) return;
  if (fs.statSync(from).isDirectory()) {
    copyDirRecursive(from, to);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
});

const adminPublicFiles = ["index.html", "panel.css", "panel.js", "cms-editor.js"];
const adminOutputDir = path.resolve(outputDir, "admin");
fs.mkdirSync(adminOutputDir, { recursive: true });
adminPublicFiles.forEach((fileName) => {
  fs.copyFileSync(
    path.resolve(siteDir, "admin", fileName),
    path.resolve(adminOutputDir, fileName)
  );
});
fs.writeFileSync(path.resolve(adminOutputDir, "runtime.js"), [
  "(function (window) {",
  "  window.SMARTTECH_WEB_ORIGIN = \"\";",
  "})(window);",
  ""
].join("\n"));

function envValue(names, fallback) {
  for (const name of names) {
    const value = process.env[name];
    if (value && String(value).trim()) {
      return String(value).trim();
    }
  }
  return fallback;
}

function jsString(value) {
  return "\"" + String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029") + "\"";
}

function writeRuntimeConfig() {
  const databaseUrl = envValue([
    "SMARTTECH_FIREBASE_DATABASE_URL",
    "FIREBASE_DATABASE_URL",
    "VITE_FIREBASE_DATABASE_URL",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL"
  ], "https://jermukguide-f64ef-default-rtdb.firebaseio.com");

  const statsPath = envValue([
    "SMARTTECH_FIREBASE_STATS_PATH",
    "FIREBASE_STATS_PATH",
    "VITE_FIREBASE_STATS_PATH",
    "NEXT_PUBLIC_FIREBASE_STATS_PATH"
  ], "BlogID_201588890086708935/PostID_WebsiteStats");

  const apiKey = envValue([
    "SMARTTECH_FIREBASE_API_KEY",
    "FIREBASE_API_KEY",
    "VITE_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_API_KEY"
  ], "");

  const authToken = envValue([
    "SMARTTECH_FIREBASE_AUTH_TOKEN",
    "FIREBASE_AUTH_TOKEN",
    "VITE_FIREBASE_AUTH_TOKEN",
    "NEXT_PUBLIC_FIREBASE_AUTH_TOKEN"
  ], "");

  const cmsApiBaseUrl = envValue([
    "SMARTTECH_CMS_API_BASE_URL",
    "CMS_API_BASE_URL",
    "VITE_SMARTTECH_CMS_API_BASE_URL",
    "NEXT_PUBLIC_SMARTTECH_CMS_API_BASE_URL"
  ], "");

  const configFile = path.resolve(outputDir, "src", "core", "runtime-config.js");
  fs.writeFileSync(configFile, [
    "(function (window) {",
    "  window.SmartTechRuntimeConfig = Object.assign({}, window.SmartTechRuntimeConfig, {",
    "    firebaseDatabaseUrl: " + jsString(databaseUrl) + ",",
    "    firebaseStatsPath: " + jsString(statsPath) + ",",
    "    firebaseApiKey: " + jsString(apiKey) + ",",
    "    firebaseAuthToken: " + jsString(authToken) + ",",
    "    cmsApiBaseUrl: " + jsString(cmsApiBaseUrl),
    "  });",
    "})(window);",
    ""
  ].join("\n"));
}

writeRuntimeConfig();

function writeSeoBundles() {
  const bundle = [
    "(function (window) {",
    "  window.SmartTechSeoLandings = " + JSON.stringify(landings.landingPages) + ";",
    "  window.SmartTechSeoArticles = " + JSON.stringify(articles.articles) + ";",
    "  window.SmartTechSeoDistricts = " + JSON.stringify(landings.yerevanDistricts) + ";",
    "})(window);",
    ""
  ].join("\n");
  const targets = [
    path.resolve(rootDir, "src/content/seo-bundles.js"),
    path.resolve(outputDir, "src/content/seo-bundles.js")
  ];
  targets.forEach(function (target) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bundle);
  });
}

writeSeoBundles();

const routeAliases = {
  "index": "index",
  "home": "index",
  "services": "services",
  "service": "service",
  "projects": "projects",
  "album": "album",
  "chat": "chat",
  "project": "project",
  "our-jobs": "our-jobs",
  "request": "request",
  "partners": "partners",
  "team": "team",
  "member": "member",
  "licenses": "about",
  "about": "about",
  "contact": "contact",
  "login": "login",
  "profile": "profile",
  "help": "about",
  "faq": "about",
  "terms": "about",
  "privacy": "about",
  "disclaimer": "about",
  "landing": "landing",
  "blog": "blog",
  "article": "article"
};

landings.landingPages.forEach(function (landing) {
  routeAliases[landing.slug] = "landing";
});

function toRootRelative(html) {
  // `pages/*.html` files use `../` paths because they live under `/pages`.
  // When we publish one of them as `/index.html`, those paths must become `./`.
  return html.replace(/(href|src)=(["'])\.\.\//g, "$1=$2./");
}

function publishRoute(route, pageName, seoRoute) {
  const sourceFile = resolvePageFile(pageName);
  if (!fs.existsSync(sourceFile)) {
    const missing = path.resolve(siteDir, "pages", pageName + ".html");
    throw new Error(
      "Missing page file: " + missing +
      ". Commit pages/ (or lib/page-templates/) to Git and redeploy."
    );
  }

  const seoKey = seoRoute || route;
  const sourceHtml = fs.readFileSync(sourceFile, "utf8");
  // The standalone login page has its own head and must not be indexed.
  const html = route === "login" ? sourceHtml : seo.applySeo(sourceHtml, seoKey);

  if (route === "index") {
    fs.writeFileSync(path.resolve(outputDir, "index.html"), toRootRelative(html));
    return;
  }

  const routeParts = String(route).split("/").filter(Boolean);
  const routeDir = path.resolve(outputDir, ...routeParts);
  assertInsideRoot(routeDir);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.resolve(routeDir, "index.html"), html);
}

Object.keys(routeAliases).forEach((route) => {
  publishRoute(route, routeAliases[route], route);
});

articles.articles.forEach(function (article) {
  const route = path.join("blog", article.slug).replace(/\\/g, "/");
  publishRoute(route, "article", "blog-" + article.slug);
});

fs.writeFileSync(path.resolve(outputDir, "sitemap.xml"), seo.sitemapXml());
fs.writeFileSync(path.resolve(outputDir, "robots.txt"), seo.robotsTxt());

function assertOutputReady(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error("Build failed: output directory is missing or invalid: " + dir);
  }
  if (!fs.existsSync(path.join(dir, "index.html"))) {
    throw new Error("Build failed: index.html was not generated in " + dir);
  }
  if (!fs.readdirSync(dir).length) {
    throw new Error("Build failed: output directory is empty: " + dir);
  }
}

assertOutputReady(outputDir);

console.log("Static site prepared in dist/");
