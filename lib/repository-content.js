'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const snapshot=require('../content/public-site.json');
const manifest=require('../content/public-assets.json');
const assets=new Map(manifest.assets.map(item=>[item.url,item.local]));
for(const item of manifest.missing||[])if(item.fallback)assets.set(item.url,item.fallback);
function localAsset(value){
 if(typeof value!=='string')return value;
 const local=assets.get(value);
 return local&&fs.existsSync(path.join(root,local))?local:value;
}
function localize(value){
 if(typeof value==='string')return localAsset(value);
 if(Array.isArray(value))return value.map(localize);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,localize(v)]));
 return value;
}
function payload(){return structuredClone(snapshot);}
function album(){
 const photos=[];const seen=new Set();
 for(const project of snapshot.collections.projects){for(const [index,image] of (project.images||[]).entries()){
  if(seen.has(image))continue;seen.add(image);
  photos.push({id:project.id+'-'+index,image,title:project.title,caption:(project.works||[]).join(' · '),section:'projects'});
 }}
 return {source:'repository',photos};
}
module.exports={payload,album,localAsset,localize};
