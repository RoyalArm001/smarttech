import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const file of ['.env', '.env.local']) {
  const p = path.join(root, file); if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (!m || env[m[1]]) continue;
    env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const pgUrl = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL;
if (!url || !key || !pgUrl) throw new Error('SUPABASE_URL, SUPABASE_SECRET_KEY (or service role), and POSTGRES_URL_NON_POOLING are required');
const dryRun = process.argv.includes('--dry-run');
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

function localContent() {
  const window = { SmartTech: { content: {}, utils: { pageUrl: x => x }, i18n: {} } };
  const context = vm.createContext({ window, console });
  const files = ['src/content/company/index.js','src/content/services/index.js','src/content/projects/index.js','src/content/team/index.js','src/content/partners/index.js','src/content/navigation/index.js','src/content/contacts/index.js','src/content/locales/index.js'];
  for (const f of files) { const p = path.join(root, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), context, { filename: f }); }
  return window.SmartTech.content;
}
function normTeam(x, i) { return { id: String(x.id || x.slug || `member-${i+1}`), display_order: Number(x.order ?? i), department:x.department||null, role_level:x.roleLevel||null, manager_id:x.managerId||null, title:x.title||null, text:x.text||null, accent:x.accent||null, color:x.color||null, email:x.email||null, image_path:x.image||null, cover_image_path:x.coverImage||null, focus:x.focus||[], socials:x.socials||[], certificates:x.certificates||[], source_data:x }; }
function normProject(x, i) { return { id:String(x.id || x.slug || `project-${i+1}`), title:x.title||String(x.id||''), status:x.status||null, display_order:Number(x.order??i), featured:Boolean(x.featured), works:x.works||[], images:x.images||[], system_images:x.systemImages||[], sector:x.sector||null, translations:x.translations||null, source_data:x }; }
async function main() {
  const normalizedPgUrl = pgUrl.replace(/[?&]sslmode=[^&]*/i, '').replace(/[?&]$/, '');
  const pool = new pg.Pool({ connectionString: normalizedPgUrl, ssl: { rejectUnauthorized: false } });
  await pool.query(fs.readFileSync(path.join(root, 'sql/001_supabase_core.sql'), 'utf8'));
  const content = localContent(); const team = (content.team || []).map(normTeam); const projects = (content.projects || []).map(normProject);
  console.log(`Migrating ${team.length} team members and ${projects.length} projects${dryRun ? ' (dry run)' : ''}`);
  if (!dryRun) {
    for (let i=0;i<team.length;i+=100) await admin.from('team_members').upsert(team.slice(i,i+100), { onConflict:'id' });
    for (let i=0;i<projects.length;i+=100) await admin.from('projects').upsert(projects.slice(i,i+100), { onConflict:'id' });
    for (const [id, payload] of Object.entries(content)) if (Array.isArray(payload) || (payload && typeof payload === 'object')) await admin.from('content_collections').upsert({ id, payload, is_public:true }, { onConflict:'id' });
    for (const bucket of [{name:'avatars',public:true},{name:'project-images',public:true},{name:'project-files',public:false}]) { const r=await admin.storage.createBucket(bucket.name,{public:bucket.public,fileSizeLimit:52428800}); if (r.error && !/already exists/i.test(r.error.message)) console.warn(r.error.message); }
    const roots = [path.join(root,'src/assets'), path.join(root,'img')]; const exts = new Set(['.png','.jpg','.jpeg','.webp','.avif','.svg','.gif','.pdf']);
    for (const base of roots) if (fs.existsSync(base)) { const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)]); for (const file of walk(base)) { if (!exts.has(path.extname(file).toLowerCase())) continue; const rel=path.relative(root,file).replace(/\\/g,'/'); const isDoc=path.extname(file).toLowerCase()==='.pdf'; const bucket=isDoc?'project-files':(rel.includes('/team/')?'avatars':'project-images'); const objectPath=rel.replace(/^src\/assets\//,'').replace(/^img\//,''); const body=fs.readFileSync(file); const up=await admin.storage.from(bucket).upload(objectPath,body,{upsert:true,contentType: ({'.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.gif':'image/gif','.pdf':'application/pdf'})[path.extname(file).toLowerCase()]||'application/octet-stream'}); if(up.error) console.warn(`asset ${rel}: ${up.error.message}`); else await admin.from('media_assets').upsert({bucket_id:bucket,storage_path:objectPath,original_name:path.basename(file),mime_type:up.data?.contentType||null,size_bytes:body.length,metadata:{source_path:rel}},{onConflict:'bucket_id,storage_path'}); } }
  }
  await pool.end();
}
main().catch(e=>{ console.error(e.message); process.exitCode=1; });
