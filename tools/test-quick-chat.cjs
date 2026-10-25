// Local fixtures only: no AI requests, contact submissions or production writes.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');let requests=0;
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/chat'){requests++;req.resume();setTimeout(()=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply:'Test reply '+('long-word'.repeat(100))}));},250);return;}
  if(url.pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({version:1,collections:{}}));return;}
  const file=path.join(root,url.pathname==='/home'?'pages/index.html':url.pathname.slice(1));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(fs.readFileSync(file));
});
async function contained(page){
  const g=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};};return {panel:rect('.auto-chat-panel'),form:rect('.auto-chat-form'),messages:rect('.auto-chat-messages'),width:innerWidth,height:innerHeight,overflow:document.querySelector('.auto-chat-panel').scrollWidth>document.querySelector('.auto-chat-panel').clientWidth};});
  assert.ok(g.panel.y>=0&&g.panel.bottom<=g.height+1,JSON.stringify(g));assert.ok(g.form.y>=g.panel.y&&g.form.bottom<=g.panel.bottom,JSON.stringify(g));assert.ok(g.messages.height>45,JSON.stringify(g));assert.equal(g.overflow,false);
}
async function openChat(page){const trigger=page.locator('.auto-chat-trigger');if(await trigger.isVisible())await trigger.click({force:true});else await page.locator('[data-bottom-action="chat"]').click();await page.waitForTimeout(350);}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['hy','en','ru']){
   if(page.url()!=='about:blank')await page.evaluate(()=>sessionStorage.clear());
   await page.goto('http://127.0.0.1:'+server.address().port+'/home?lang='+lang);await page.waitForSelector('.auto-chat-shell',{state:'attached'});await openChat(page);
   for(const [width,height] of [[1440,900],[462,750],[390,844],[320,568],[844,390]]){await page.setViewportSize({width,height});await page.waitForTimeout(80);await contained(page);}
   await page.setViewportSize({width:462,height:750});
   assert.equal(await page.locator('[data-intent="services"]').evaluate(el=>{el.click();document.querySelector('[data-intent="cctv"]').click();return document.querySelector('.auto-chat-input').disabled;}),true);
   await page.waitForFunction(()=>!document.querySelector('.auto-chat-input').disabled);assert.equal(await page.locator('.auto-chat-message-user').count(),1);assert.equal(await page.locator('.is-typing').count(),0);
   await page.locator('.auto-chat-input').fill('xyz123 unknown question');await page.locator('.auto-chat-form').evaluate(el=>el.requestSubmit());
   await page.waitForFunction(()=>!document.querySelector('.auto-chat-input').disabled);assert.ok((await page.locator('.auto-chat-messages').innerText()).includes('Test reply'));await contained(page);
   await page.locator('[data-intent="survey"]').click();await page.waitForSelector('.auto-chat-survey-options:not([hidden])');await contained(page);
   await page.locator('.auto-chat-input').focus();await page.keyboard.press('Escape');await page.waitForTimeout(300);assert.equal(await page.locator('.auto-chat-panel').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement.matches('.auto-chat-trigger,[data-bottom-action="chat"]')),true);
   await openChat(page);assert.equal(await page.locator('.auto-chat-controls').isVisible(),false);
   if(lang==='hy'){fs.mkdirSync(path.join(root,'build'),{recursive:true});await page.screenshot({path:path.join(root,'build/quick-chat-fixed.png')});}
  }
  assert.equal(requests,3);assert.deepEqual(errors,[]);console.log('PASS: HY/EN/RU; desktop, mobile, short and landscape viewports; contained composer, long replies, busy guard, survey, Escape/focus and reopen.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
