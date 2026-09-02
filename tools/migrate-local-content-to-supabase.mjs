import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(target) {
  if (!fs.existsSync(target)) return;
  const content = fs.readFileSync(target, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(ROOT, ".env.local"));

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function withWindowShim(file) {
  globalThis.window = globalThis.window || {};
  globalThis.window.SmartTech = globalThis.window.SmartTech || { content: {}, sections: {}, utils: {} };
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) return;
  const source = fs.readFileSync(fullPath, "utf8");
  const wrapped = `(function(){${source};})()`;
  const fn = new Function("window", wrapped);
  fn(globalThis.window);
}

withWindowShim("src/core/namespace.js");
withWindowShim("src/core/utils.js");
withWindowShim("src/content/company/index.js");
withWindowShim("src/content/services/index.js");
withWindowShim("src/content/projects/index.js");
withWindowShim("src/content/team/index.js");

const site = globalThis.window.SmartTech;
const company = site.content.company || {};
const services = Array.isArray(site.content.services) ? site.content.services : [];
const projects = Array.isArray(site.content.projects) ? site.content.projects : [];
const team = Array.isArray(site.content.team) ? site.content.team : [];

async function upsertTable(table, rows, idField) {
  if (!rows.length) return [];
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict: idField || "id" }).select();
  if (error) {
    console.error(`Failed to upsert ${table}`, error.message);
    throw error;
  }
  return data || [];
}

async function migrateTeam() {
  const rows = team.map((member, index) => ({
    id: member.id || crypto.randomUUID(),
    full_name: member.name || member.fullName || `${member.firstName || ""} ${member.lastName || ""}`.trim(),
    title: member.position || member.title || member.role || null,
    email: member.email || null,
    phone: member.phone || null,
    avatar_url: member.image || member.avatar || member.photo || null,
    bio: member.bio || member.description || null,
    status: member.active === false ? "inactive" : "active",
    sort_order: member.order ?? index,
    metadata: {
      raw: member,
      socials: Array.isArray(member.socials) ? member.socials : [],
      certifications: Array.isArray(member.certificates) ? member.certificates : []
    }
  }));
  return upsertTable("team_members", rows, "id");
}

async function migrateProjects() {
  const rows = projects.map((project, index) => ({
    id: project.id || crypto.randomUUID(),
    slug: project.slug || project.id || `project-${index + 1}`,
    title: project.title || "Untitled project",
    summary: project.summary || project.description || null,
    status: project.status === "completed" ? "completed" : "current",
    featured: Boolean(project.featured),
    cover_image: Array.isArray(project.images) && project.images[0] ? project.images[0] : null,
    metadata: {
      works: Array.isArray(project.works) ? project.works : [],
      images: Array.isArray(project.images) ? project.images : [],
      sector: project.sector || null,
      systemImages: Array.isArray(project.systemImages) ? project.systemImages : [],
      raw: project
    }
  }));
  return upsertTable("projects", rows, "id");
}

async function migrateServices() {
  const rows = services.map((service, index) => ({
    id: service.id || `service-${index + 1}`,
    slug: service.slug || service.id || `service-${index + 1}`,
    title: service.title || service.name || `Service ${index + 1}`,
    summary: service.lead || service.summary || null,
    image: service.image || null,
    metadata: { raw: service }
  }));
  return upsertTable("services", rows, "id");
}

async function main() {
  console.log("Migrating Smart Tech local content into Supabase...");
  const teamRows = await migrateTeam();
  const projectRows = await migrateProjects();
  const serviceRows = await migrateServices();
  console.log(`Migrated ${teamRows.length} team members, ${projectRows.length} projects, ${serviceRows.length} services.`);
  console.log("Next: run the Supabase SQL migration in sql/supabase-smarttech-core.sql and configure the environment variables.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
