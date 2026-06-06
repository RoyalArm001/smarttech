const fs = require("fs");
const path = require("path");
const http = require("http");

const root = path.resolve(__dirname, "..");

const routes = [
  "/", "/home", "/services", "/service", "/projects", "/project", "/album", "/chat",
  "/our-jobs", "/request", "/partners", "/team", "/member", "/about", "/contact",
  "/admin", "/robots.txt", "/sitemap.xml", "/manifest.json", "/api/content"
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function collectImagePaths() {
  const paths = new Set();
  const re = /["'](\/img\/[^"']+)["']/g;
  for (const file of walk(path.join(root, "src"))) {
    if (!/\.js$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    let m;
    while ((m = re.exec(text))) paths.add(m[1]);
  }
  for (const file of walk(path.join(root, "pages"))) {
    if (!/\.html$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const attrRe = /(?:src|href)=["']((?:\.\.\/)?img\/[^"']+)["']/g;
    let m;
    while ((m = attrRe.exec(text))) {
      const ref = m[1].replace(/^\.\.\//, "");
      paths.add("/" + ref);
    }
  }
  return [...paths];
}

function get(port, urlPath) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: "127.0.0.1", port, path: urlPath, timeout: 8000 }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
    }).on("error", reject);
  });
}

async function main() {
  const issues = [];

  for (const entry of ["index.html", "src", "img", "admin", "robots.txt", "sitemap.xml"]) {
    if (!fs.existsSync(path.join(root, "dist", entry))) issues.push("dist missing: " + entry);
  }

  const images = collectImagePaths();
  const missingImages = images.filter((p) => !fs.existsSync(path.join(root, p.slice(1).replace(/\//g, path.sep))));
  if (missingImages.length) {
    issues.push("missing images (" + missingImages.length + "):");
    missingImages.forEach((p) => issues.push("  " + p));
  }

  const app = require(path.join(root, "server.js"));
  const port = 3099;
  const server = await new Promise((resolve, reject) => {
    const s = app.listen(port, "127.0.0.1", () => resolve(s));
    s.on("error", reject);
  });

  try {
    for (const route of routes) {
      const res = await get(port, route);
      if (res.status >= 400) issues.push("HTTP " + res.status + " → " + route);
      if (["/", "/admin", "/services", "/projects"].includes(route) && res.body.length < 200) {
        issues.push("short response for " + route);
      }
    }
    if ((await get(port, "/img/smart-tech.png")).status !== 200) issues.push("/img/smart-tech.png failed");
    if ((await get(port, "/admin/panel.js")).status !== 200) issues.push("/admin/panel.js failed");
    if ((await get(port, "/src/main.js")).status !== 200) issues.push("/src/main.js failed");

    const cms = await get(port, "/api/content");
    if (cms.status !== 200) issues.push("/api/content status " + cms.status);
    else {
      try { JSON.parse(cms.body); } catch { issues.push("/api/content invalid JSON"); }
    }
  } finally {
    server.close();
  }

  if (issues.length) {
    console.error("FAILED:\n" + issues.join("\n"));
    process.exit(1);
  }

  console.log("OK: " + routes.length + " routes, " + images.length + " image refs, dist structure");
}

main().catch((e) => { console.error(e); process.exit(1); });
