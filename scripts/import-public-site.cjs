'use strict';
// Imports only already-published website content and referenced public assets.
// This is NOT an export of database users, messages, private buckets or secrets.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const origin='https://aoeqjlvtncxblkhvqmeu.supabase.co';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const context=vm.createContext({window:{SmartTech:{content:{},sections:{},utils:{}}}});
for(const name of ['company','navigation','services','projects','partners','team','contacts','locales']){
  new vm.Script(fs.readFileSync(path.join(root,'src/content',name,'index.js'),'utf8')).runInContext(context);
}
const c=JSON.parse(JSON.stringify(context.window.SmartTech.content));
const catalog=require('../lib/project-catalog.json');
const byId=new Map(c.projects.map(p=>[p.id,p]));
for(const project of catalog)byId.set(project.id,{...byId.get(project.id),...project});
c.projects=[...byId.values()];
c.projectSettings={featuredProjectId:c.featuredProjectId,activeProjectIds:c.projects.filter(p=>p.status==='current').map(p=>p.id),completedGallery:c.completedGallery};
const keys=['company','navigation','services','projects','team','contacts','locales','technologyPartners','partners','projectSettings'];
const payload={version:1,source:'repository',updatedAt:null,provenance:{generatedAt:new Date().toISOString(),content:'Existing public source files and previously saved public project catalog; not a fresh database export.'},collections:Object.fromEntries(keys.filter(k=>c[k]!==undefined).map(k=>[k,c[k]]))};
const queue=new Map(),aliases=new Map();
function reference(value){
 if(typeof value!=='string')return;
 let url,local;
 try{
  if(value.startsWith('/img/')){local=value;url=origin+'/storage/v1/object/public/project-images/'+value.slice(5);}
  else if(value.startsWith('/src/assets/team/')){local=value;url=origin+'/storage/v1/object/public/avatars/team/'+value.slice(17);}
  else if(value.startsWith('/src/assets/brand/')){local=value;url=origin+'/storage/v1/object/public/project-images/brand/'+value.slice(18);}
  else if(value.startsWith(origin+'/storage/v1/object/public/')){
   const u=new URL(value),rest=decodeURIComponent(u.pathname.slice('/storage/v1/object/public/'.length));
   if(rest.startsWith('project-images/brand/'))local='/src/assets/brand/'+rest.slice(21);
   else if(rest.startsWith('project-images/'))local='/img/'+rest.slice(15);
   else if(rest.startsWith('avatars/team/'))local='/src/assets/team/'+rest.slice(13);
   else return;
   url=value;
  }else if(value.startsWith('https://images.unsplash.com/')){url=value;local='/img/external/'+hash(Buffer.from(value)).slice(0,20)+'.jpg';}
  else return;
  if(!/\.(png|jpe?g|webp|svg|avif|gif|pdf)$/i.test(local))return;
  const parts=local.split('/');if(parts.some(p=>p==='..'||p==='.'||/[\\\x00-\x1f]/.test(p)))throw Error('Unsafe public asset path');
  url=new URL(url).href;
  if(queue.has(local)&&queue.get(local).url!==url)throw Error('Conflicting public asset sources');
  queue.set(local,{local,url});aliases.set(value,local);
 }catch(e){throw new Error('Invalid public asset reference: '+e.message);}
}
function walk(v){if(typeof v==='string')reference(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);}
walk(payload.collections);
// HTML icon/manifest resources are public website assets too.
for(const file of ['manifest.json',...fs.readdirSync(path.join(root,'pages')).filter(n=>n.endsWith('.html')).map(n=>'pages/'+n)]){
 const text=fs.readFileSync(path.join(root,file),'utf8');for(const m of text.matchAll(/(?:\.\.\/|\/)(img\/[^"'<>\s]+|src\/assets\/(?:brand|team)\/[^"'<>\s]+)/g))reference('/'+m[1]);
}
async function main(){
 const records=[],failed=[];let index=0;const items=[...queue.values()];
 async function worker(){while(index<items.length){const item=items[index++],dest=path.resolve(root,'.'+item.local);if(!dest.startsWith(root+path.sep))throw Error('Unsafe destination');
  try{
   let bytes;if(fs.existsSync(dest))bytes=fs.readFileSync(dest);else{
    let response;for(let attempt=0;attempt<3;attempt++){try{response=await fetch(item.url,{signal:AbortSignal.timeout(30000)});if(response.ok)break;if(response.status<500)break;}catch(e){if(attempt===2)throw e;}}
    if(!response?.ok)throw Error('HTTP '+response?.status);
    if(!/image\/|application\/pdf|octet-stream/.test(response.headers.get('content-type')||''))throw Error('Unexpected content type');
    bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>45*1024*1024)throw Error('Asset exceeds Git size budget');
    fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});
   }
   records.push({...item,bytes:bytes.length,sha256:hash(bytes)});
  }catch(e){failed.push({...item,error:e.message});}
  if((records.length+failed.length)%25===0)console.log('Assets processed: '+(records.length+failed.length)+'/'+items.length);
 }}
 await Promise.all([worker(),worker(),worker(),worker()]);
 const success=new Set(records.map(r=>r.local));
 // This existing decorative cover is gone upstream (404); use the site's own brand
 // image, never invent a replacement photo or hide a failed project photo import.
 for(const item of failed){if(item.url.startsWith('https://images.unsplash.com/photo-1581092921461-7d65ca45b2c8?') && success.has('/img/smart-tech.png')){aliases.set(item.url,'/img/smart-tech.png');item.fallback='/img/smart-tech.png';}}
 function localize(v){if(typeof v==='string'){const local=aliases.get(v);return local&&success.has(local)?local:v;}if(Array.isArray(v))return v.map(localize);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,localize(x)]));return v;}
 payload.collections=localize(payload.collections);
 fs.mkdirSync(path.join(root,'content'),{recursive:true});
 fs.writeFileSync(path.join(root,'content/public-site.json'),JSON.stringify(payload,null,2)+'\n');
 fs.writeFileSync(path.join(root,'content/public-assets.json'),JSON.stringify({version:1,assets:records.sort((a,b)=>a.local.localeCompare(b.local)),missing:failed},null,2)+'\n');
 console.log(JSON.stringify({projects:c.projects.length,services:c.services.length,assets:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0),missing:failed}));
 if(failed.some(item=>!item.fallback))process.exitCode=2;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
