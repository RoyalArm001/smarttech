/**
 * Creates the project_files table in Supabase via REST API.
 * Run: node tools/supabase-create-table.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
CREATE TABLE IF NOT EXISTS project_files (
  id            SERIAL PRIMARY KEY,
  local_path    TEXT NOT NULL UNIQUE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  bucket        TEXT NOT NULL DEFAULT 'project-files',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_files' AND policyname = 'Public read'
  ) THEN
    CREATE POLICY "Public read" ON project_files FOR SELECT TO anon USING (true);
  END IF;
END $$;
`;

console.log("Creating project_files table via Supabase SQL API...");

const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  },
  body: JSON.stringify({ query: sql })
});

const body = await resp.text();

if (!resp.ok) {
  // Try alternative endpoint
  console.log("REST RPC failed, trying direct SQL endpoint...");
  const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query: sql })
  });
  console.log("Status:", resp2.status, await resp2.text());
  console.log("\n⚠️  Please run tools/create_project_files.sql manually in Supabase Dashboard → SQL Editor.");
} else {
  console.log("✅ Table created! Response:", body || "(empty = success)");
}
