import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); const env={};
for(const name of ['.env','.env.local']){const file=path.join(root,name);if(!fs.existsSync(file))continue;for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!env[m[1]])env[m[1]]=m[2].replace(/^['"]|['"]$/g,'')}}
const client=createClient(env.SUPABASE_URL,env.SUPABASE_SECRET_KEY||env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const definitions=[
  {id:'atlantis-yerevan',title:'Atlantis Yerevan',page:'https://armconstruct.am/en/projects/atlantis-yerevan',works:['Էլեկտրամոնտաժային աշխատանքներ','Հրդեհային ազդարարման համակարգ'],translations:{en:{title:'Atlantis Yerevan',works:['Electrical installation works','Fire alarm system']},ru:{title:'Atlantis Yerevan',works:['Электромонтажные работы','Система пожарной сигнализации']}}},
  {id:'sunday-towers',title:'Sunday Towers',page:'https://sundaytowers.am/',image:'https://api.sundaytowers.am/storage/webp/2-min-671a1ec50bd85.webp',works:['Էլեկտրամոնտաժային աշխատանքներ'],translations:{en:{title:'Sunday Towers',works:['Electrical installation works']},ru:{title:'Sunday Towers',works:['Электромонтажные работы']}}}
];
function metaImage(html,base){const patterns=[/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i];for(const pattern of patterns){const m=html.match(pattern);if(m)return new URL(m[1].replace(/&amp;/g,'&'),base).href}return null}
for(let index=0;index<definitions.length;index++){
  const p=definitions[index]; const html=await fetch(p.page).then(r=>{if(!r.ok)throw new Error(`${p.id} page ${r.status}`);return r.text()}); const source=p.image||metaImage(html,p.page); if(!source)throw new Error(`${p.id}: official image not found`);
  const imageResponse=await fetch(source); if(!imageResponse.ok)throw new Error(`${p.id} image ${imageResponse.status}`); const optimized=await sharp(Buffer.from(await imageResponse.arrayBuffer())).resize({width:1600,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
  const storagePath=`our-jobs/${p.id}.webp`; const relativePath=`/img/${storagePath}`; const localPath=path.join(root,'img',storagePath); fs.mkdirSync(path.dirname(localPath),{recursive:true}); fs.writeFileSync(localPath,optimized); const uploaded=await client.storage.from('project-images').upload(storagePath,optimized,{upsert:true,contentType:'image/webp',cacheControl:'3600'}); if(uploaded.error)throw uploaded.error;
  const sourceData={id:p.id,title:p.title,works:p.works,images:[relativePath],systemImages:[],translations:p.translations,status:'current',sourceUrl:p.page};
  const saved=await client.from('projects').upsert({id:p.id,title:p.title,status:'current',display_order:index-2,featured:index===0,works:p.works,images:[relativePath],system_images:[],translations:p.translations,source_data:sourceData,updated_at:new Date().toISOString()},{onConflict:'id'}); if(saved.error)throw saved.error;
  const media=await client.from('media_assets').upsert({bucket_id:'project-images',storage_path:storagePath,original_name:`${p.id}.webp`,mime_type:'image/webp',size_bytes:optimized.length,metadata:{project_id:p.id,source_url:source}},{onConflict:'bucket_id,storage_path'});if(media.error)throw media.error;
  console.log(`${p.title}: ${Math.round(optimized.length/1024)} KB`);
}
