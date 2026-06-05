const fs = require("fs");
const path = require("path");
const seo = require("./seo-config");

const rootDir = path.resolve(__dirname, "..");
const webDir = path.resolve(rootDir, "web");

const pageRoutes = {
  "index.html": "index",
  "services.html": "services",
  "service.html": "service",
  "projects.html": "projects",
  "album.html": "album",
  "project.html": "project",
  "our-jobs.html": "our-jobs",
  "request.html": "request",
  "partners.html": "partners",
  "team.html": "team",
  "member.html": "member",
  "about.html": "about",
  "contact.html": "contact"
};

Object.keys(pageRoutes).forEach((fileName) => {
  const filePath = path.resolve(webDir, "pages", fileName);
  const route = pageRoutes[fileName];
  const html = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(filePath, seo.applySeo(html, route));
});

fs.writeFileSync(path.resolve(webDir, "sitemap.xml"), seo.sitemapXml());
fs.writeFileSync(path.resolve(webDir, "robots.txt"), seo.robotsTxt());

console.log("SEO metadata, robots.txt and sitemap.xml updated.");
