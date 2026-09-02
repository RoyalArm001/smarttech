/**
 * Supabase Storage Migration Script (Pilot)
 * - Creates "project-files" bucket (if it doesn't exist)
 * - Uploads 2 pilot images from /img/cctv/
 * - Records storage paths in the "project_files" table
 *
 * Run:  node tools/supabase-upload-pilot.mjs
 *
 * Requires env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (service role - server only, never in frontend)
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Read env from .env if not already set ──────────────────────────────────
const envFile = path.join(ROOT, ".env");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const BUCKET = "project-files";

// Pilot files to upload (2 images)
const PILOT_FILES = [
  {
    localPath: path.join(ROOT, "img/cctv/indoor-dome.jpg"),
    storagePath: "img/cctv/indoor-dome.jpg",
    mimeType: "image/jpeg",
    description: "CCTV indoor dome camera photo"
  },
  {
    localPath: path.join(ROOT, "img/cctv/monitoring-room.jpg"),
    storagePath: "img/cctv/monitoring-room.jpg",
    mimeType: "image/jpeg",
    description: "Monitoring room hero image"
  }
];

// ── 1. Create bucket ──────────────────────────────────────────────────────
async function ensureBucket() {
  console.log(`\n📦  Checking bucket "${BUCKET}"...`);
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw new Error(`Failed to list buckets: ${listErr.message}`);

  const existing = (buckets || []).find((b) => b.name === BUCKET);
  if (existing) {
    console.log(`   ✅  Bucket "${BUCKET}" already exists.`);
    return;
  }

  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,           // Public read - images served directly to website
    fileSizeLimit: 52428800 // 50 MB limit
  });
  if (createErr) throw new Error(`Failed to create bucket: ${createErr.message}`);
  console.log(`   ✅  Bucket "${BUCKET}" created (public).`);
}

// ── 2. Create tracking table ───────────────────────────────────────────────
async function ensureTable() {
  console.log(`\n🗄️   Ensuring "project_files" table...`);

  // Probe the table
  const { error: probeErr } = await supabase.from("project_files").select("id").limit(1);

  if (probeErr && probeErr.code === "42P01") {
    console.log("   ⚠️   Table doesn't exist. Please run tools/create_project_files.sql in Supabase Dashboard → SQL Editor.");
    console.log("   ℹ️   Continuing with upload; DB record insert will be skipped if table is missing.");
  } else if (probeErr) {
    console.warn(`   ⚠️   Table probe warning: ${probeErr.message} (code: ${probeErr.code})`);
  } else {
    console.log("   ✅  Table 'project_files' exists.");
  }
}

// ── 3. Upload a file ──────────────────────────────────────────────────────
async function uploadFile(file) {
  console.log(`\n📤  Uploading: ${file.storagePath}`);

  if (!fs.existsSync(file.localPath)) {
    console.error(`   ❌  Local file not found: ${file.localPath}`);
    return null;
  }

  const buffer = fs.readFileSync(file.localPath);

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(file.storagePath, buffer, {
      contentType: file.mimeType,
      upsert: true
    });

  if (upErr) {
    console.error(`   ❌  Upload failed: ${upErr.message}`);
    return null;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(file.storagePath);
  const publicUrl = urlData.publicUrl;

  console.log(`   ✅  Uploaded → ${publicUrl}`);
  return publicUrl;
}

// ── 4. Save record to DB ──────────────────────────────────────────────────
async function saveRecord(file, publicUrl) {
  // Upsert by local_path so re-runs don't duplicate
  const { data, error } = await supabase
    .from("project_files")
    .upsert(
      {
        local_path: file.localPath.replace(ROOT, "").replace(/\\/g, "/"),
        storage_path: file.storagePath,
        public_url: publicUrl,
        bucket: BUCKET,
        description: file.description
      },
      { onConflict: "local_path" }
    )
    .select();

  if (error) {
    console.warn(`   ⚠️   DB upsert failed (table may not exist yet): ${error.message}`);
    return null;
  }
  console.log(`   🗃️   Record saved. id=${data[0]?.id}`);
  return data[0];
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀  Supabase Storage Pilot Migration");
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Bucket: ${BUCKET}`);
  console.log(`   Files: ${PILOT_FILES.length}`);

  await ensureBucket();
  await ensureTable();

  const results = [];
  for (const file of PILOT_FILES) {
    const publicUrl = await uploadFile(file);
    if (publicUrl) {
      const record = await saveRecord(file, publicUrl);
      results.push({ file, publicUrl, record });
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋  RESULTS SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const r of results) {
    console.log(`\n  File:       ${r.file.storagePath}`);
    console.log(`  Public URL: ${r.publicUrl}`);
    console.log(`  DB saved:   ${r.record ? "✅ yes" : "⚠️ skipped"}`);
  }

  if (results.length === PILOT_FILES.length) {
    console.log("\n✅  Pilot migration complete! All files uploaded successfully.");
  } else {
    console.log(`\n⚠️  ${PILOT_FILES.length - results.length} file(s) failed to upload.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
