'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
test('Git public content and every imported asset work without Supabase credentials',async()=>{
 assert.ok(!fs.existsSync(path.join(root,'.env'))&&!fs.existsSync(path.join(root,'.env.local')));
 for(const key of Object.keys(process.env))if(/SUPABASE|POSTGRES|DATABASE_URL/.test(key))delete process.env[key];
 process.env.PUBLIC_CONTENT_SOURCE='repository';
 const server=require('../server').start(0);if(!server.listening)await new Promise(r=>server.once('listening',r));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const content=await(await fetch(base+'/api/content?refresh=1')).json();
  assert.equal(content.source,'repository');assert.equal(content.collections.projects.length,19);assert.equal(content.collections.services.length,14);
  assert.ok(!('profiles' in content.collections)&&!('users' in content.collections)&&!('contact_messages' in content.collections));
  const album=await(await fetch(base+'/api/album')).json();assert.equal(album.source,'repository');assert.ok(album.photos.length>19);
  const manifest=require('../content/public-assets.json');
  for(const asset of manifest.assets){
   const disk=fs.readFileSync(path.join(root,asset.local));assert.equal(crypto.createHash('sha256').update(disk).digest('hex'),asset.sha256,asset.local);
   const route=asset.local.split('/').map(encodeURIComponent).join('/');
   const response=await fetch(base+route,{redirect:'manual'});assert.equal(response.status,200,route);assert.equal(response.headers.get('location'),null,route);
   const bytes=Buffer.from(await response.arrayBuffer());assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256,route);
  }
  for(const project of content.collections.projects){for(const image of project.images||[])assert.ok(image.startsWith('/'),project.id+' has remote image');}
  console.log('Verified '+manifest.assets.length+' local assets and public content; no Supabase credentials used.');
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
