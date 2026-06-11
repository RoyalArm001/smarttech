process.env.SMARTTECH_APP_MODE = "admin";
process.env.ADMIN_PORT = process.env.ADMIN_PORT || "3001";
process.env.OPEN_BROWSER = process.env.OPEN_ADMIN_BROWSER || process.env.OPEN_BROWSER || "1";

console.log("");
console.log("Starting SmartTech CMS admin (isolated from public web)...");
console.log("Public site (separate): " + (process.env.SMARTTECH_WEB_ORIGIN || "http://localhost:3000"));
console.log("");

require("../server.js");
