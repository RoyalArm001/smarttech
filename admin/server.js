const { spawn } = require("child_process");
const path = require("path");

process.env.SMARTTECH_APP_MODE = "admin";
process.env.ADMIN_PORT = process.env.ADMIN_PORT || "3001";
process.env.OPEN_BROWSER = process.env.OPEN_ADMIN_BROWSER || process.env.OPEN_BROWSER || "1";

const rootDir = path.resolve(__dirname, "..");
const env = Object.assign({}, process.env, {
  SMARTTECH_APP_MODE: "admin",
  ADMIN_PORT: process.env.ADMIN_PORT || "3001",
  OPEN_BROWSER: process.env.OPEN_ADMIN_BROWSER || process.env.OPEN_BROWSER || "1"
});

console.log("");
console.log("Starting SmartTech CMS admin (isolated from public web)...");
console.log("Public site (separate): " + (process.env.SMARTTECH_WEB_ORIGIN || "http://localhost:3000"));
console.log("");

const server = spawn(process.execPath, ["server.js"], {
  cwd: rootDir,
  env,
  stdio: "inherit"
});

server.on("exit", (code, signal) => {
  if (signal) process.exit(0);
  process.exit(code || 0);
});
