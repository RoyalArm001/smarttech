const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.resolve(rootDir, "web");
const outputDir = path.resolve(rootDir, "dist");

function assertInsideRoot(target) {
  const relative = path.relative(rootDir, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to write outside project root: " + target);
  }
}

assertInsideRoot(outputDir);

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.cpSync(sourceDir, outputDir, { recursive: true });

const routeAliases = {
  "index": "index",
  "home": "index",
  "services": "services",
  "service": "service",
  "projects": "projects",
  "project": "project",
  "our-jobs": "our-jobs",
  "request": "request",
  "partners": "partners",
  "team": "team",
  "member": "member",
  "about": "about",
  "contact": "contact"
};

function toRootRelative(html) {
  // `web/pages/*.html` files use `../` paths because they live under `/pages`.
  // When we publish one of them as `/index.html`, those paths must become `./`.
  return html.replace(/(href|src)=(["'])\.\.\//g, "$1=$2./");
}

Object.keys(routeAliases).forEach((route) => {
  const pageName = routeAliases[route];
  const sourceFile = path.resolve(sourceDir, "pages", pageName + ".html");
  if (!fs.existsSync(sourceFile)) {
    throw new Error("Missing page file: " + sourceFile);
  }

  if (route === "index") {
    const rootHtml = fs.readFileSync(sourceFile, "utf8");
    fs.writeFileSync(path.resolve(outputDir, "index.html"), toRootRelative(rootHtml));
    return;
  }

  const routeDir = path.resolve(outputDir, route);
  assertInsideRoot(routeDir);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(sourceFile, path.resolve(routeDir, "index.html"));
});

console.log("Static site prepared in dist/");
