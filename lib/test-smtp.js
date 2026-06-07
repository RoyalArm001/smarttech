"use strict";

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

function parseEnvLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex <= 0) return null;
  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach(function (line) {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key]) return;
    process.env[parsed.key] = parsed.value;
  });
}

const rootDir = path.resolve(__dirname, "..");
loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const host = process.env.SMTP_HOST || "";
const port = Number(process.env.SMTP_PORT || 465);
const secure = String(process.env.SMTP_SECURE || "true") !== "false";
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";
const to = process.env.REQUEST_EMAIL_TO || "support@smarttechllc.am";
const from = process.env.REQUEST_EMAIL_FROM || ("Smart Tech <" + user + ">");

if (!host || !user || !pass) {
  console.error("Missing SMTP_HOST, SMTP_USER or SMTP_PASS in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: host,
  port: Number.isNaN(port) ? 465 : port,
  secure: secure,
  auth: { user: user, pass: pass }
});

async function main() {
  await transporter.verify();
  console.log("SMTP verify OK:", user, "->", to);

  const info = await transporter.sendMail({
    from: from,
    to: to,
    subject: "Smart Tech SMTP test",
    text: [
      "Smart Tech website SMTP test",
      "From: " + user,
      "To: " + to,
      "Time: " + new Date().toISOString()
    ].join("\n")
  });

  console.log("Test email sent:", info.messageId || "ok");
}

main().catch(function (error) {
  console.error("SMTP test failed:", error && error.message ? error.message : error);
  process.exit(1);
});
