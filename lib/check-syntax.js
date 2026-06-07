const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const files = [
  "server.js",
  "admin/cms-store.js",
  "lib/seo-config.js",
  "lib/build-static.js",
  "lib/apply-seo.js",
  "lib/check-syntax.js",
  "api/[...path].js",
  "admin/panel.js",
  "admin/cms-editor.js",
  "src/main.js",
  "src/core/namespace.js",
  "src/core/i18n.js",
  "src/core/utils.js",
  "src/core/cms-merge.js",
  "src/core/runtime-config.js",
  "src/sections/header/index.js",
  "src/sections/hero/index.js",
  "src/sections/services/index.js",
  "src/sections/projects/index.js",
  "src/sections/album/index.js",
  "src/sections/chatpage/index.js",
  "src/sections/team/index.js",
  "src/sections/about/index.js",
  "src/sections/contact/index.js",
  "src/sections/request/index.js",
  "src/sections/footer/index.js",
  "src/content/company/index.js",
  "src/content/services/index.js",
  "src/content/projects/index.js",
  "src/content/team/index.js",
  "src/content/locales/index.js",
  "src/content/navigation/index.js"
];

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
