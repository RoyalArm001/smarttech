/**
 * Generates unique SVG certificates for each team member certificate entry.
 * Run: node web/scripts/generate-member-certificates.js
 */
const fs = require("fs");
const path = require("path");

const team = [
  { id: "director", department: "Management", color: "#0aa896", certificates: ["Business Management", "Quality Control Leadership"] },
  { id: "it-network-engineer", department: "IT", color: "#345f74", certificates: ["Cisco Network Engineering", "Network Security Basics"] },
  { id: "it-project-manager", department: "IT", color: "#38aab8", certificates: ["Project Management", "Agile Delivery"] },
  { id: "alarm-system-engineer", department: "Security", color: "#d8a63a", certificates: ["Fire Safety Systems", "Security Systems Compliance"] },
  { id: "automation-specialist", department: "Automation", color: "#9a7a30", certificates: ["Automation Systems", "Control Panel Engineering"] },
  { id: "bms-design-specialist", department: "BMS", color: "#4e7890", certificates: ["Building Management Systems", "Systems Design"] },
  { id: "video-access-control-engineer", department: "Security", color: "#3d8f9f", certificates: ["Video Surveillance Systems", "Access Control Integration"] },
  { id: "audio-systems-specialist", department: "Audio", color: "#38aab8", certificates: ["Audio System Installation", "Public Address Systems"] },
  { id: "electrical-installation-engineer", department: "Electrical", color: "#b46f5f", certificates: ["Electrical Installation", "Low Voltage Systems"] },
  { id: "it-installation-engineer", department: "IT", color: "#4f8ea0", certificates: ["Structured Cabling", "Field Installation Standards"] },
  { id: "it-support-engineer", department: "IT", color: "#5a93a8", certificates: ["Network Operations", "IT Service Management"] },
  { id: "fire-alarm-specialist", department: "Security", color: "#c9872f", certificates: ["Fire Alarm Systems", "Evacuation Safety"] },
  { id: "electrical-works-specialist", department: "Electrical", color: "#c26f5d", certificates: ["Electrical Installation", "Panel Assembly"] },
  { id: "automation-installation-specialist", department: "Automation", color: "#b08b38", certificates: ["Automation Systems", "PLC Installation"] },
  { id: "bms-integration-engineer", department: "BMS", color: "#5f7f96", certificates: ["Building Management Systems", "HVAC Integration"] },
  { id: "audio-installation-specialist", department: "Audio", color: "#4f9eae", certificates: ["Public Address Systems", "Sound Engineering"] }
];

const outDir = path.join(__dirname, "..", "src", "assets", "team", "certificates", "members");

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function shade(hex, amount) {
  const raw = hex.replace("#", "");
  const num = parseInt(raw.length === 3 ? raw.split("").map(function (c) { return c + c; }).join("") : raw, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (num & 255) + amount));
  return "#" + [r, g, b].map(function (v) { return v.toString(16).padStart(2, "0"); }).join("");
}

function splitTitle(title) {
  if (title.length <= 34) return [title];
  const words = title.split(" ");
  const lines = [];
  let line = "";
  words.forEach(function (word) {
    const next = line ? line + " " + word : word;
    if (next.length > 34 && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function badgeText(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 3).toUpperCase();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(member, title, index) {
  const uid = member.id.replace(/[^a-z0-9]/gi, "") + index;
  const color = member.color;
  const colorDark = shade(color, -42);
  const colorLight = shade(color, 36);
  const lines = splitTitle(title);
  const lineY = lines.length > 1 ? [292, 336] : [310];
  const titleNodes = lines.map(function (line, i) {
    return '<text x="332" y="' + lineY[i] + '" fill="#ffffff" font-size="' + (lines.length > 1 ? 30 : 34) + '" font-family="Segoe UI, Arial, sans-serif" font-weight="700">' + escapeXml(line) + "</text>";
  }).join("\n  ");

  return '' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" role="img" aria-label="' + escapeXml(title) + ' certificate">\n' +
    "  <defs>\n" +
    '    <linearGradient id="bg-' + uid + '" x1="0" y1="0" x2="1" y2="1">\n' +
    '      <stop offset="0%" stop-color="' + color + '"/>\n' +
    '      <stop offset="100%" stop-color="' + colorDark + '"/>\n' +
    "    </linearGradient>\n" +
    '    <linearGradient id="ring-' + uid + '" x1="0" y1="0" x2="0" y2="1">\n' +
    '      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>\n' +
    '      <stop offset="100%" stop-color="' + colorLight + '" stop-opacity="0.55"/>\n' +
    "    </linearGradient>\n" +
    '    <filter id="shadow-' + uid + '" x="-20%" y="-20%" width="140%" height="140%">\n' +
    '      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.22"/>\n' +
    "    </filter>\n" +
    "  </defs>\n" +
    '  <rect width="960" height="640" rx="28" fill="url(#bg-' + uid + ')"/>\n' +
    '  <rect x="40" y="40" width="880" height="560" rx="22" fill="none" stroke="#ffffff" stroke-opacity="0.34" stroke-width="3"/>\n' +
    '  <rect x="56" y="56" width="280" height="528" rx="20" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2"/>\n' +
    '  <circle cx="196" cy="210" r="98" fill="url(#ring-' + uid + ')" filter="url(#shadow-' + uid + ')"/>\n' +
    '  <circle cx="196" cy="210" r="86" fill="' + colorDark + '" fill-opacity="0.35"/>\n' +
    '  <path d="M196 132c-28 0-50 22-50 50 0 20 11 37 28 46-22 9-38 30-38 56v18h120v-18c0-26-16-47-38-56 17-9 28-26 28-46 0-28-22-50-50-50z" fill="#ffffff" fill-opacity="0.92"/>\n' +
    '  <path d="M156 430h80c6 0 10 4 10 10v52H146v-52c0-6 4-10 10-10z" fill="#ffffff" fill-opacity="0.88"/>\n' +
    '  <text x="196" y="518" text-anchor="middle" fill="#ffffff" fill-opacity="0.9" font-size="18" font-family="Segoe UI, Arial, sans-serif" font-weight="600">' + escapeXml(member.department) + "</text>\n" +
    '  <text x="332" y="118" fill="#ffffff" font-size="22" font-family="Segoe UI, Arial, sans-serif" letter-spacing="3" font-weight="700">SMART TECH</text>\n' +
    '  <text x="332" y="156" fill="#ffffff" fill-opacity="0.82" font-size="20" font-family="Segoe UI, Arial, sans-serif">PROFESSIONAL CERTIFICATE</text>\n' +
    '  <line x1="332" y1="176" x2="884" y2="176" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>\n' +
    '  <text x="332" y="228" fill="#ffffff" fill-opacity="0.88" font-size="24" font-family="Segoe UI, Arial, sans-serif">' + escapeXml(member.department + " Division") + "</text>\n" +
    titleNodes + "\n" +
    '  <text x="332" y="392" fill="#ffffff" fill-opacity="0.78" font-size="20" font-family="Segoe UI, Arial, sans-serif">Validated competency for engineering delivery</text>\n' +
    '  <rect x="732" y="432" width="152" height="108" rx="16" fill="#ffffff" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>\n' +
    '  <text x="808" y="498" text-anchor="middle" fill="#ffffff" font-size="34" font-family="Segoe UI, Arial, sans-serif" font-weight="700">' + escapeXml(badgeText(title)) + "</text>\n" +
    '  <text x="332" y="568" fill="#ffffff" fill-opacity="0.75" font-size="18" font-family="Segoe UI, Arial, sans-serif">Issued for Smart Tech engineering team</text>\n' +
    "</svg>\n";
}

const manifest = {};

fs.mkdirSync(outDir, { recursive: true });

team.forEach(function (member) {
  manifest[member.id] = [];
  member.certificates.forEach(function (title, index) {
    const fileName = member.id + "-" + slugify(title) + ".svg";
    const filePath = path.join(outDir, fileName);
    const publicPath = "/src/assets/team/certificates/members/" + fileName;
    fs.writeFileSync(filePath, buildSvg(member, title, index), "utf8");
    manifest[member.id].push({ title: title, image: publicPath });
  });
});

const manifestPath = path.join(outDir, "manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
console.log("Generated " + Object.keys(manifest).reduce(function (n, id) { return n + manifest[id].length; }, 0) + " certificates in " + outDir);
