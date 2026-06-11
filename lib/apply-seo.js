const fs = require("fs");
const path = require("path");
const seo = require("./seo-config");

const rootDir = path.resolve(__dirname, "..");
const siteDir = rootDir;

const pageRoutes = {
  "index.html": "index",
  "services.html": "services",
  "service.html": "service",
  "projects.html": "projects",
  "album.html": "album",
  "chat.html": "chat",
  "project.html": "project",
  "our-jobs.html": "our-jobs",
  "request.html": "request",
  "partners.html": "partners",
  "team.html": "team",
  "member.html": "member",
  "about.html": "about",
  "contact.html": "contact",
  "landing.html": "landing",
  "blog.html": "blog",
  "article.html": "article"
};

Object.keys(pageRoutes).forEach((fileName) => {
  const filePath = path.resolve(siteDir, "pages", fileName);
  const route = pageRoutes[fileName];
  const html = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(filePath, seo.applySeo(html, route));
});

fs.writeFileSync(path.resolve(siteDir, "sitemap.xml"), seo.sitemapXml());
fs.writeFileSync(path.resolve(siteDir, "robots.txt"), seo.robotsTxt());

console.log("SEO metadata, robots.txt and sitemap.xml updated.");
