const fs = require("fs");
const path = require("path");
const seo = require("./seo-config");

const rootDir = path.resolve(__dirname, "..");
const siteDir = rootDir;
const outputDir = path.resolve(rootDir, "dist");
const siteCopyEntries = ["pages", "src", "img", "manifest.json", "_redirects"];
const adminUiFiles = ["index.html", "panel.js", "cms-editor.js", "panel.css"];

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
  const from = path.resolve(siteDir, entry);
  const to = path.resolve(outputDir, entry);
  if (!fs.existsSync(from)) return;
  if (fs.statSync(from).isDirectory()) {
    copyDirRecursive(from, to);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
});

function copyAdminUi(fromDir, toDir) {
  fs.mkdirSync(toDir, { recursive: true });
  adminUiFiles.forEach((fileName) => {
    const from = path.resolve(fromDir, fileName);
    if (!fs.existsSync(from)) return;
    fs.copyFileSync(from, path.resolve(toDir, fileName));
  });
}

copyAdminUi(path.resolve(siteDir, "admin"), path.resolve(outputDir, "admin"));

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

  const configFile = path.resolve(outputDir, "src", "core", "runtime-config.js");
  fs.writeFileSync(configFile, [
    "(function (window) {",
    "  window.SmartTechRuntimeConfig = Object.assign({}, window.SmartTechRuntimeConfig, {",
    "    firebaseDatabaseUrl: " + jsString(databaseUrl) + ",",
    "    firebaseStatsPath: " + jsString(statsPath) + ",",
    "    firebaseApiKey: " + jsString(apiKey) + ",",
    "    firebaseAuthToken: " + jsString(authToken),
    "  });",
    "})(window);",
    ""
  ].join("\n"));
}

writeRuntimeConfig();

const routeAliases = {
  "index": "index",
  "home": "index",
  "services": "services",
  "service": "service",
  "projects": "projects",
  "album": "album",
  "admin": "admin",
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
  "help": "about",
  "faq": "about",
  "terms": "about",
  "privacy": "about",
  "disclaimer": "about"
};

function toRootRelative(html) {
  // `pages/*.html` files use `../` paths because they live under `/pages`.
  // When we publish one of them as `/index.html`, those paths must become `./`.
  return html.replace(/(href|src)=(["'])\.\.\//g, "$1=$2./");
}

Object.keys(routeAliases).forEach((route) => {
  const pageName = routeAliases[route];
  const sourceFile = pageName === "admin"
    ? path.resolve(siteDir, "admin", "index.html")
    : path.resolve(siteDir, "pages", pageName + ".html");
  if (!fs.existsSync(sourceFile)) {
    throw new Error("Missing page file: " + sourceFile);
  }

  if (route === "index") {
    const rootHtml = seo.applySeo(fs.readFileSync(sourceFile, "utf8"), route);
    fs.writeFileSync(path.resolve(outputDir, "index.html"), toRootRelative(rootHtml));
    return;
  }

  const routeDir = path.resolve(outputDir, route);
  assertInsideRoot(routeDir);
  fs.mkdirSync(routeDir, { recursive: true });
  const routeHtml = seo.applySeo(fs.readFileSync(sourceFile, "utf8"), route);
  fs.writeFileSync(path.resolve(routeDir, "index.html"), routeHtml);
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

const publicDir = path.resolve(rootDir, "public");
fs.rmSync(publicDir, { recursive: true, force: true });
copyDirRecursive(outputDir, publicDir);
assertOutputReady(publicDir);

console.log("Static site prepared in dist/ and public/");
