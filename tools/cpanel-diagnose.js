#!/usr/bin/env node
/**
 * SmartTech cPanel & Node.js Diagnostic Tool
 * Securely verifies environment, Passenger setup, Supabase connectivity,
 * and endpoint health WITHOUT exposing any credentials or secrets.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const rootDir = path.resolve(__dirname, "..");

// 1. Helper to safely mask secrets
function maskSecret(val) {
  if (!val || typeof val !== "string") return "(not set)";
  const trimmed = val.trim();
  if (trimmed.length <= 8) return `[set, length: ${trimmed.length}]`;
  return `[set: ${trimmed.slice(0, 4)}...${trimmed.slice(-3)}, length: ${trimmed.length}]`;
}

// 2. Load .env if present
function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) return false;
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
  return true;
}

const envLoaded = loadEnv();

console.log("=================================================");
console.log("  SmartTech cPanel / Passenger Diagnostic Tool  ");
console.log("=================================================\n");

// System check
const nodeVersion = process.version;
const major = parseInt(nodeVersion.slice(1).split(".")[0], 10);
const isNodeCompatible = major >= 22;

console.log("[1] Node.js & Runtime Environment");
console.log(`    Node Version:     ${nodeVersion} ${isNodeCompatible ? "✔ (>= 22.0.0 Compatible)" : "✖ (Requires >= 22.0.0)"}`);
console.log(`    Platform / Arch:  ${process.platform} / ${process.arch}`);
console.log(`    Application Root: ${rootDir}`);
console.log(`    Local .env file:  ${envLoaded ? "Found & Loaded" : "Not found (using system / cPanel env vars)"}`);

// Passenger check
const isPassenger = typeof PhusionPassenger !== "undefined" || !!process.env.PASSENGER_APP_ENV;
console.log(`    Phusion Passenger:${isPassenger ? " Detected ✔" : " Not active (standalone / CLI mode)"}`);
if (process.env.PASSENGER_APP_ENV) {
  console.log(`    PASSENGER_APP_ENV:${process.env.PASSENGER_APP_ENV}`);
}
console.log(`    PORT env var:     ${process.env.PORT || "(not set - will use default 3000)"}`);

// Essential Files
console.log("\n[2] Essential File Integrity");
const filesToCheck = [
  "server.js",
  "package.json",
  "pages/index.html",
  "pages/projects.html",
  "pages/services.html",
  "pages/contact.html",
  "src/main.js"
];
let missingFiles = 0;
filesToCheck.forEach((rel) => {
  const full = path.join(rootDir, rel);
  const exists = fs.existsSync(full);
  if (!exists) missingFiles++;
  console.log(`    ${rel.padEnd(22)}: ${exists ? "Found ✔" : "MISSING ✖"}`);
});

// Environment Variables Check (Masked)
console.log("\n[3] Configuration & Credentials Status");
const varsToCheck = [
  { key: "SUPABASE_URL", isSecret: false },
  { key: "SUPABASE_ANON_KEY", isSecret: true },
  { key: "SUPABASE_SECRET_KEY", alias: "SUPABASE_SERVICE_ROLE_KEY", isSecret: true },
  { key: "SMTP_HOST", isSecret: false },
  { key: "SMTP_PORT", isSecret: false },
  { key: "SMTP_USER", isSecret: false },
  { key: "SMTP_PASS", isSecret: true },
  { key: "REQUEST_EMAIL_TO", isSecret: false },
  { key: "GEMINI_API_KEY", isSecret: true },
  { key: "OPENAI_API_KEY", isSecret: true }
];

varsToCheck.forEach((v) => {
  const val = process.env[v.key] || (v.alias ? process.env[v.alias] : "");
  if (!val) {
    console.log(`    ${v.key.padEnd(25)}: (not configured) ⚠`);
  } else if (v.isSecret) {
    console.log(`    ${v.key.padEnd(25)}: ${maskSecret(val)} ✔`);
  } else {
    console.log(`    ${v.key.padEnd(25)}: ${val} ✔`);
  }
});

// Supabase Connection Test
async function testSupabase() {
  console.log("\n[4] Supabase Database & Storage Check");
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!sbUrl || !sbKey) {
    console.log("    Supabase URL or Key not set. Skipping live DB test.");
    return false;
  }

  try {
    const { createClient } = require("@supabase/supabase-js");
    const client = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

    const startTime = Date.now();
    const { count, error } = await client.from("content_collections").select("*", { count: "exact", head: true });
    const latency = Date.now() - startTime;

    if (error) {
      console.log(`    Supabase Connection: FAILED ✖ (${error.message})`);
      return false;
    }
    console.log(`    Supabase Connection: SUCCESS ✔ (${latency}ms latency)`);
    console.log(`    content_collections: Found (${count} records)`);

    const { count: projCount } = await client.from("projects").select("*", { count: "exact", head: true });
    console.log(`    projects table:      Found (${projCount} records)`);

    const { data: buckets } = await client.storage.listBuckets();
    if (buckets && Array.isArray(buckets)) {
      console.log(`    Storage buckets:     Available (${buckets.map(b => b.name).join(", ")})`);
    }
    return true;
  } catch (err) {
    console.log(`    Supabase Exception:  ${err && err.message ? err.message : err}`);
    return false;
  }
}

// Endpoint Probe Test
async function testEndpoints() {
  console.log("\n[5] Local HTTP Endpoint Probe");
  process.env.SMARTTECH_NO_LISTEN = "1";
  let app;
  try {
    app = require(path.join(rootDir, "server.js"));
  } catch (e) {
    console.log(`    Failed to require server.js: ${e && e.stack ? e.stack : e}`);
    return false;
  }

  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", async () => {
      const port = server.address().port;
      const baseUrl = `http://127.0.0.1:${port}`;

      async function probe(path) {
        return new Promise((res) => {
          http.get(`${baseUrl}${path}`, (resp) => {
            let data = "";
            resp.on("data", (chunk) => (data += chunk));
            resp.on("end", () => res({ status: resp.statusCode, body: data }));
          }).on("error", (err) => res({ status: 500, error: err.message }));
        });
      }

      try {
        const r1 = await probe("/api/status");
        console.log(`    GET /api/status       -> HTTP ${r1.status} ${r1.status === 200 ? "✔" : "✖"}`);

        const r2 = await probe("/api/content");
        console.log(`    GET /api/content      -> HTTP ${r2.status} ${r2.status === 200 ? "✔" : "✖"}`);

        const r3 = await probe("/api/auth/session");
        console.log(`    GET /api/auth/session -> HTTP ${r3.status} ${r3.status === 200 ? "✔" : "✖"}`);

        const r4 = await probe("/");
        console.log(`    GET / (Homepage)      -> HTTP ${r4.status} ${r4.status === 200 ? "✔" : "✖"}`);

        const r5 = await probe("/admin");
        console.log(`    GET /admin            -> HTTP ${r5.status} ${r5.status === 404 ? "✔ (Admin disabled)" : "(unexpected status)"}`);

        resolve(true);
      } catch (err) {
        console.log(`    Endpoint probe error: ${err.message}`);
        resolve(false);
      } finally {
        server.close();
      }
    });
  });
}

async function run() {
  await testSupabase();
  await testEndpoints();
  console.log("\n=================================================");
  console.log("  Diagnostic Run Completed Successfully!        ");
  console.log("=================================================\n");
}

run();

