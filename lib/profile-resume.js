"use strict";

// Only text and http(s) links are accepted; account permissions never enter this data.
const sectionKeys = new Set(["experience", "education", "skills", "certifications", "languages", "portfolio", "about"]);
function normalizeResume(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid professional profile");
  const result = {};
  const text = (value, limit) => String(value || "").replace(/\u0000/g, "").trim().slice(0, limit);
  for (const language of ["hy", "en", "ru"]) {
    if (!value[language]) continue;
    if (!Array.isArray(value[language]) || value[language].length > 7) throw new Error("Invalid profile sections");
    const seen = new Set();
    result[language] = value[language].map(section => {
      if (!section || !sectionKeys.has(section.key) || seen.has(section.key) || !Array.isArray(section.items) || section.items.length > 30) throw new Error("Invalid profile section");
      seen.add(section.key);
      return { key: section.key, title: text(section.title, 100), items: section.items.map(item => {
        if (!item || typeof item !== "object") throw new Error("Invalid profile entry");
        let url = text(item.url, 600);
        if (url) {
          const parsed = new URL(url);
          if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) throw new Error("Profile links must use https or http");
          url = parsed.href;
        }
        return { title: text(item.title, 200), subtitle: text(item.subtitle, 300), description: text(item.description, 1500), url };
      }) };
    });
  }
  return result;
}
module.exports = { normalizeResume };
