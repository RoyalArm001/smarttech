/**
 * Remove generated copies and unused assets from the SmartTech project.
 *
 * Usage:
 *   node scripts/cleanup-project.js          # dry-run (default)
 *   node scripts/cleanup-project.js --apply    # delete files
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const webDir = path.join(rootDir, "web");
const imgDir = path.join(webDir, "img");

const apply = process.argv.includes("--apply");

const STATIC_REMOVALS = [
  "dist",
  "replace-images.js",
  path.join("web", "img", "logos"),
  path.join("web", "src", "assets", "team", "certificates", "cert-agile.svg"),
  path.join("web", "src", "assets", "team", "certificates", "cert-cloud.svg"),
  path.join("web", "src", "assets", "team", "certificates", "cert-cyber.svg"),
  path.join("web", "src", "assets", "team", "certificates", "cert-pmp.svg")
];

const SCAN_EXTENSIONS = new Set([".js", ".html", ".css", ".json", ".md", ".webmanifest"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  ".cursor"
]);

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function walkFiles(dir, onFile) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkFiles(fullPath, onFile);
      continue;
    }
    if (entry.isFile()) onFile(fullPath);
  }
}

function collectReferences() {
  const references = new Set();
  const basenames = new Set();
  const assetPattern = /["'`]([^"'`]*?\.(?:jpg|jpeg|png|webp|avif|gif|svg))["'`]/gi;

  walkFiles(webDir, function (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_EXTENSIONS.has(ext)) return;

    const text = fs.readFileSync(filePath, "utf8");
    const patterns = [
      /\/img\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|avif|gif|svg)/gi,
      /\/src\/assets\/[A-Za-z0-9_./-]+\.(?:svg|jpg|jpeg|png|webp|avif|gif)/gi
    ];

    patterns.forEach(function (pattern) {
      let match;
      while ((match = pattern.exec(text))) {
        references.add(match[0].replace(/[),.;'"]+$/, ""));
      }
    });

    let assetMatch;
    while ((assetMatch = assetPattern.exec(text))) {
      const value = assetMatch[1].replace(/^[./]+/, "");
      if (value.indexOf("/") >= 0) {
        references.add(value.startsWith("/") ? value : "/" + value);
      }
      basenames.add(path.basename(value));
    }
  });

  return { references, basenames };
}

function isReferenced(filePath, refs) {
  const webRelative = "/" + path.relative(webDir, filePath).split(path.sep).join("/");
  const basename = path.basename(filePath);

  if (refs.references.has(webRelative)) return true;
  if (refs.basenames.has(basename)) return true;

  for (const ref of refs.references) {
    if (ref.endsWith("/" + basename) || ref === basename) return true;
  }

  return false;
}

function findUnreferencedImages(references) {
  const orphans = [];

  if (!fs.existsSync(imgDir)) return orphans;

  walkFiles(imgDir, function (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"].includes(ext)) return;
    if (isReferenced(filePath, references)) return;
    orphans.push(filePath);
  });

  return orphans;
}

function pathSize(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    let total = 0;
    walkFiles(targetPath, function (file) {
      total += fs.statSync(file).size;
    });
    return total;
  }
  return stat.size;
}

function removeTarget(targetPath) {
  const absolute = path.isAbsolute(targetPath) ? targetPath : path.join(rootDir, targetPath);
  if (!fs.existsSync(absolute)) return 0;

  const bytes = pathSize(absolute);
  if (apply) {
    fs.rmSync(absolute, { recursive: true, force: true });
  }
  return bytes;
}

function main() {
  const planned = [];
  let totalBytes = 0;

  STATIC_REMOVALS.forEach(function (relativePath) {
    const absolute = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolute)) return;
    const bytes = pathSize(absolute);
    planned.push({ path: relativePath.replace(/\\/g, "/"), bytes, reason: "generated or legacy asset" });
    totalBytes += bytes;
  });

  const refs = collectReferences();
  const orphanImages = findUnreferencedImages(refs);
  orphanImages.forEach(function (filePath) {
    const relative = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const bytes = fs.statSync(filePath).size;
    planned.push({ path: relative, bytes, reason: "image not referenced in web source" });
    totalBytes += bytes;
  });

  if (!planned.length) {
    console.log("Nothing to clean. Project folders look tidy.");
    return;
  }

  console.log(apply ? "Applying cleanup...\n" : "Dry run — pass --apply to delete:\n");
  planned.forEach(function (item) {
    console.log("- " + item.path + " (" + formatBytes(item.bytes) + ") — " + item.reason);
  });
  console.log("\nTotal: " + formatBytes(totalBytes) + " across " + planned.length + " item(s).");

  if (apply) {
    planned.forEach(function (item) {
      removeTarget(item.path);
    });
    console.log("\nCleanup finished. Run `npm run build` if you need a fresh dist/ folder.");
  } else {
    console.log("\nRun: node scripts/cleanup-project.js --apply");
  }
}

main();
