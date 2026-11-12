'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');

test('public-only Express app and Passenger module entry', { timeout: 20000 }, async () => {
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
  const server = require('../app'); // Passenger-style require, not node server.js.
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
