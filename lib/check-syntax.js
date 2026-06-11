const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const CORE_BOOTSTRAP = {
  "src/core/namespace.js": [
    "(function () {",
    "  window.SmartTech = window.SmartTech || {};",
    "  window.SmartTech.content = window.SmartTech.content || {};",
    "  window.SmartTech.sections = window.SmartTech.sections || {};",
    "  window.SmartTech.utils = window.SmartTech.utils || {};",
    "})();",
    ""
  ].join("\n")
};

const ROOT_FILES = [
  "server.js",
  "admin/cms-store.js",
  "lib/seo-config.js",
  "lib/seo-landings.js",
  "lib/seo-articles.js",
  "lib/build-static.js",
  "lib/apply-seo.js",
  "lib/check-syntax.js",
  "api/[...path].js",
  "admin/panel.js",
  "admin/cms-editor.js",
  "src/main.js"
];

const SCAN_DIRS = [
  "src/core",
  "src/sections",
  "src/content"
];

function ensureCoreBootstrap() {
  Object.keys(CORE_BOOTSTRAP).forEach((relativePath) => {
    const filePath = path.join(rootDir, relativePath);
    if (fs.existsSync(filePath)) return;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, CORE_BOOTSTRAP[relativePath], "utf8");
    console.warn("Restored missing core file:", relativePath);
  });
}

function collectJsFiles(dir, results) {
  const absoluteDir = path.join(rootDir, dir);
  if (!fs.existsSync(absoluteDir)) return;

  fs.readdirSync(absoluteDir, { withFileTypes: true }).forEach((entry) => {
    const relativePath = path.join(dir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      collectJsFiles(relativePath, results);
      return;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      results.push(relativePath);
    }
  });
}

function collectFiles() {
  const files = ROOT_FILES.slice();
  SCAN_DIRS.forEach((dir) => collectJsFiles(dir, files));
  return Array.from(new Set(files)).sort();
}

ensureCoreBootstrap();

const files = collectFiles();

files.forEach((file) => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    throw new Error("Syntax check failed: missing file " + file);
  }
  try {
    execFileSync(process.execPath, ["--check", filePath], {
      stdio: ["ignore", "pipe", "pipe"]
    });
    console.log("Syntax OK:", file);
  } catch (error) {
    const details = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error("Syntax check failed in " + file + (details ? "\n" + details : ""));
  }
});

console.log("Syntax check OK (" + files.length + " files)");
