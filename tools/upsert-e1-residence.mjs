import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createClient } = require("@supabase/supabase-js");

const env = {};
for (const name of [".env", ".env.local"]) {
  if (!fs.existsSync(name)) continue;
  for (const line of fs.readFileSync(name, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase configuration is missing");

const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});
const storagePath = "projects/e1-residence.webp";
const publicUrl = client.storage.from("project-images").getPublicUrl(storagePath).data.publicUrl;
const project = {
  id: "e1-residence",
  title: "E1 Residence",
  status: "completed",
  progress: 100,
  phase: "Էլեկտրամոնտաժային աշխատանքներն ավարտված են",
  order: 14,
  featured: false,
  works: ["Էլեկտրամոնտաժային աշխատանքներ"],
  images: [publicUrl],
  systemImages: [],
  translations: {
    en: {
      title: "E1 Residence",
      works: ["Electrical installation works"],
      phase: "Electrical installation works completed"
    },
    ru: {
      title: "E1 Residence",
      works: ["Электромонтажные работы"],
      phase: "Электромонтажные работы завершены"
    }
  }
};

const saved = await client.from("projects").upsert({
  id: project.id,
  title: project.title,
  status: project.status,
  progress: project.progress,
  phase: project.phase,
  display_order: project.order,
  featured: project.featured,
  works: project.works,
  images: project.images,
  system_images: project.systemImages,
  sector: null,
  translations: project.translations,
  source_data: project,
  updated_at: new Date().toISOString()
}, { onConflict: "id" }).select("id,title,status,source_data").single();

if (saved.error) throw saved.error;
console.log(JSON.stringify({
  id: saved.data.id,
  title: saved.data.title,
  status: saved.data.status,
  progress: saved.data.source_data.progress,
  phase: saved.data.source_data.phase,
  image: publicUrl
}, null, 2));
