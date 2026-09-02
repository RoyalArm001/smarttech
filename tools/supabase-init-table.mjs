/**
 * Creates project_files table in Supabase Postgres and inserts the pilot records.
 * Run: node tools/supabase-init-table.mjs
 */

import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Read .env
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

const connectionString = (process.env.POSTGRES_URL_NON_POOLING || "").replace(/[?&]sslmode=[^&]*/g, "");
if (!connectionString) {
  console.error("Missing POSTGRES_URL_NON_POOLING");
  process.exit(1);
}

const BUCKET = "project-files";
const SUPABASE_URL = process.env.SUPABASE_URL;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

const PILOT_RECORDS = [
  {
    local_path: "/img/cctv/indoor-dome.jpg",
    storage_path: "img/cctv/indoor-dome.jpg",
    public_url: `${STORAGE_BASE}/img/cctv/indoor-dome.jpg`,
    bucket: BUCKET,
    description: "CCTV indoor dome camera photo"
  },
  {
    local_path: "/img/cctv/monitoring-room.jpg",
    storage_path: "img/cctv/monitoring-room.jpg",
    public_url: `${STORAGE_BASE}/img/cctv/monitoring-room.jpg`,
    bucket: BUCKET,
    description: "Monitoring room hero image"
  }
];

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function main() {
  console.log("Connecting to Supabase Postgres...");
  await client.connect();
  console.log("✅ Connected.");

  // Create table
  await client.query(`
    CREATE TABLE IF NOT EXISTS project_files (
      id            SERIAL PRIMARY KEY,
      local_path    TEXT NOT NULL UNIQUE,
      storage_path  TEXT NOT NULL,
      public_url    TEXT NOT NULL,
      bucket        TEXT NOT NULL DEFAULT 'project-files',
      description   TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("✅ Table project_files created (or already exists).");

  // Enable RLS
  await client.query(`ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;`);

  // Policy
  try {
    await client.query(`CREATE POLICY "Public read" ON project_files FOR SELECT TO anon USING (true);`);
    console.log("✅ RLS policy created.");
  } catch (e) {
    if (e.message.includes("already exists")) {
      console.log("ℹ️  RLS policy already exists.");
    } else {
      console.warn("⚠️  Policy:", e.message);
    }
  }

  // Insert pilot records
  for (const rec of PILOT_RECORDS) {
    await client.query(`
      INSERT INTO project_files (local_path, storage_path, public_url, bucket, description)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (local_path) DO UPDATE SET
        storage_path = EXCLUDED.storage_path,
        public_url = EXCLUDED.public_url,
        bucket = EXCLUDED.bucket,
        description = EXCLUDED.description;
    `, [rec.local_path, rec.storage_path, rec.public_url, rec.bucket, rec.description]);
    console.log(`✅ Record inserted/updated for: ${rec.local_path}`);
  }

  // Verify
  const result = await client.query("SELECT id, local_path, public_url, created_at FROM project_files ORDER BY id;");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋  Records in project_files table:");
  for (const row of result.rows) {
    console.log(`  [${row.id}] ${row.local_path}`);
    console.log(`       → ${row.public_url}`);
  }

  await client.end();
  console.log("\n✅ Done!");
}

main().catch(async (err) => {
  console.error("Error:", err.message);
  await client.end().catch(() => {});
  process.exit(1);
});
