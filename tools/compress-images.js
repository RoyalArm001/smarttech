// One-off image optimizer for img/.
// Resizes very large images down to a sane max width and re-encodes them
// in place, keeping the same filename and format so no code references change.
// Originals remain available on the remote hosting if a re-download is needed.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMG_ROOT = path.resolve(__dirname, "..", "img");
const MAX_WIDTH = 1600;          // cap longest edge for full-bleed photos
const MIN_BYTES = 150 * 1024;    // skip files already under ~150 KB
const JPEG_Q = 80;
const WEBP_Q = 80;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return null;

  const before = fs.statSync(file).size;
  const meta = await sharp(file).metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;

  // Skip small files that don't need resizing.
  if (before < MIN_BYTES && !needsResize) return null;

  let pipeline = sharp(file, { failOn: "none" }).rotate();
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 82, effort: 8 });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_Q });
  }

  const buffer = await pipeline.toBuffer();

  // Only overwrite if we actually saved space.
  if (buffer.length < before) {
    fs.writeFileSync(file, buffer);
    return { file, before, after: buffer.length, resized: needsResize };
  }
  return { file, before, after: before, skipped: true };
}

(async function main() {
  if (!fs.existsSync(IMG_ROOT)) {
    console.error("img not found:", IMG_ROOT);
    process.exit(1);
  }

  const files = walk(IMG_ROOT, []);
  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;

  for (const file of files) {
    try {
      const r = await processFile(file);
      if (!r) continue;
      totalBefore += r.before;
      totalAfter += r.after;
      const rel = path.relative(IMG_ROOT, file).replace(/\\/g, "/");
      if (r.skipped) {
        console.log(`=  ${rel}  (no gain, kept ${fmt(r.before)})`);
      } else {
        changed++;
        const pct = Math.round((1 - r.after / r.before) * 100);
        console.log(`↓  ${rel}  ${fmt(r.before)} → ${fmt(r.after)}  (-${pct}%${r.resized ? ", resized" : ""})`);
      }
    } catch (e) {
      console.log(`!  ${file}  ERROR: ${e.message}`);
    }
  }

  console.log("\n──────────────────────────────");
  console.log(`Files optimized: ${changed}`);
  console.log(`Total (processed): ${fmt(totalBefore)} → ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)})`);
})();
