const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const env = Object.assign({}, process.env, {
  WEB_PORT: process.env.WEB_PORT || "3000",
  OPEN_BROWSER: process.env.OPEN_BROWSER || "1"
});

console.log("");
console.log("Starting SmartTech local server...");
console.log("Close this window or press Ctrl+C to stop it.");
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
