'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');

test('public-only Express app, redirects, caching and protected routes', { timeout: 20000 }, async () => {
  // No source credentials, production sessions or external service requests.
  for (const key of Object.keys(process.env)) {
    if (/SUPABASE|POSTGRES|DATABASE_URL|OPENAI|GEMINI|SMTP|RESEND|CHATGPT/.test(key)) delete process.env[key];
  }
  assert.ok(!fs.existsSync(path.resolve(__dirname, '../.env')), 'Run fixture tests without a project .env');
  assert.ok(!fs.existsSync(path.resolve(__dirname, '../.env.local')), 'Run fixture tests without a project .env.local');
  process.env.SMARTTECH_APP_MODE = 'all'; // Must not reactivate legacy admin.
  process.env.OPEN_BROWSER = '0';
  const reservation = net.createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  process.env.PORT = String(reservation.address().port);
  await new Promise(resolve => reservation.close(resolve));
  const app = require('../server');
  const server = app.start();
  if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    for (const method of ['GET','POST','PUT','PATCH','DELETE','OPTIONS']) {
      for (const route of ['/admin','/admin/panel.js','/api/admin','/api/admin/users','/API/ADMIN/session','/%61dmin','/api/%61dmin/settings','//api//admin/cms']) {
        const response = await fetch(base + route, { method, redirect: 'manual' });
        assert.equal(response.status, 404, method + ' ' + route);
      }
    }
    for (const route of ['/','/login','/profile','/api/status','/api/content','/api/auth/session']) {
      const response = await fetch(base + route, { redirect: 'manual' });
      assert.equal(response.status, 200, route);
      if (['/login','/profile'].includes(route)) assert.ok(!(await response.text()).includes('/api/admin'));
    }
    const privateProfile = await fetch(base + '/api/profile');
    assert.equal(privateProfile.status, 401);
    for (const [route, location] of [['/index.html?lang=en','/home?lang=en'], ['/pages/contact.html','/contact'], ['/pages/our-jobs','/projects'], ['/project?id=reset-wellness-club&lang=ru','/project/reset-wellness-club?lang=ru']]) {
      const response = await fetch(base+route,{redirect:'manual'});
      assert.equal(response.status,301); assert.equal(response.headers.get('location'),location);
    }
    const canonical = await new Promise((resolve,reject)=>{
      require('node:http').get(base+'/contact?lang=en',{headers:{Host:'www.smarttechllc.am'}},response=>{response.resume();resolve(response);}).on('error',reject);
    });
    assert.equal(canonical.headers.location,'https://smarttechllc.am/contact?lang=en');
    const css = await fetch(base+'/src/styles/base.css');
    assert.match(css.headers.get('content-type'),/text\/css/);
    assert.equal(css.headers.get('cache-control'),'public, max-age=86400');
    const js = await fetch(base+'/src/main.js');
    assert.equal(js.status,200); assert.match(js.headers.get('content-type'),/javascript/);
    const config = await fetch(base+'/src/core/runtime-config.js');
    assert.equal(config.headers.get('cache-control'),'no-store');
    for (const [route, suffix] of [['/img/services/fire-security.jpg','project-images/services/fire-security.jpg'],['/src/assets/team/avatar.png','avatars/team/avatar.png'],['/src/assets/brand/logo.png','project-images/brand/logo.png']]) {
      const response = await fetch(base+route,{redirect:'manual'});
      assert.equal(response.status,302); assert.ok(response.headers.get('location').endsWith('/storage/v1/object/public/'+suffix));
      assert.match(response.headers.get('cache-control'),/immutable/);
    }
    const project = await fetch(base+'/project/reset-wellness-club?lang=en');
    assert.equal(project.status,200); const html=await project.text();
    assert.ok(html.includes('Reset Wellness Club')); assert.ok(html.includes('rel="canonical"'));
    assert.ok(!html.includes('/_vercel/'));
    assert.match((await fetch(base+'/robots.txt')).headers.get('content-type'),/text\/plain/);
    assert.match((await fetch(base+'/sitemap.xml')).headers.get('content-type'),/xml/);
    const mode = require('../lib/app-mode');
    assert.equal(mode.isAdminEnabled(), false);
    assert.equal(mode.isWebEnabled(), true);
    for (const file of ['pages/login.html','lib/page-templates/login.html','src/sections/profile/index.js']) {
      const text = fs.readFileSync(path.resolve(__dirname,'..',file),'utf8');
      assert.ok(!text.includes('/api/admin') && !/location\.(assign|replace)\(["']\/admin/.test(text));
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
