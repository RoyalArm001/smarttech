'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('public sessions use one user lookup and never issue an admin cookie', async () => {
  for (const file of ['.env', '.env.local', 'admin/data/settings.json']) {
    assert.ok(!fs.existsSync(path.resolve(__dirname, '..', file)), 'Run with fixture configuration only');
  }
  for (const key of Object.keys(process.env)) {
    if (/SUPABASE|POSTGRES|DATABASE_URL|OPENAI|GEMINI|SMTP|RESEND|CHATGPT/.test(key)) delete process.env[key];
  }
  process.env.SUPABASE_URL = 'http://127.0.0.1:1';
  process.env.SUPABASE_ANON_KEY = 'fixture-public';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-server';
  process.env.PUBLIC_CONTENT_SOURCE = 'repository';
  process.env.OPEN_BROWSER = '0';

  let role = 'member';
  let active = true;
  let userReads = 0;
  let profileReads = 0;
  const user = { id: 'fixture-user', email: 'fixture@example.test', user_metadata: {} };
  const client = {
    auth: {
      async getUser() {
        userReads++;
        return { data: { user } };
      },
      async signInWithPassword() {
        return { data: { user, session: { access_token: 'fixture-token', expires_at: Math.floor(Date.now() / 1000) + 3600 } } };
      }
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() { return this; },
        eq() { return this; },
        update() { return this; },
        async maybeSingle() {
          profileReads++;
          return { data: { id: user.id, role, username: 'fixture', is_active: active } };
        }
      };
    }
  };
  const modulePath = require.resolve('@supabase/supabase-js');
  require(modulePath);
  const original = require.cache[modulePath].exports;
  require.cache[modulePath].exports = { ...original, createClient: () => client };
  const app = require('../server');
  const server = app.start(0);
  if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    for (role of ['member', 'admin']) {
      userReads = 0;
      profileReads = 0;
      const session = await fetch(base + '/api/auth/session', { headers: { Cookie: 'smarttech_user=fixture-token' } });
      const payload = await session.json();
      assert.equal(payload.authenticated, true);
      assert.equal(payload.user.role, role);
      assert.equal(userReads, 1);
      assert.equal(profileReads, 1);
      const login = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: base },
        body: JSON.stringify({ email: user.email, password: 'fixture-password' })
      });
      assert.equal(login.status, 200);
      assert.match(login.headers.get('set-cookie'), /smarttech_user=/);
      assert.ok(!login.headers.get('set-cookie').includes('smarttech_admin='));
    }
    active = false;
    const inactive = await fetch(base + '/api/auth/session', { headers: { Cookie: 'smarttech_user=fixture-token' } });
    assert.equal((await inactive.json()).authenticated, false);
    userReads = 0;
    const legacy = await fetch(base + '/api/auth/session', { headers: { Cookie: 'smarttech_admin=fixture-token' } });
    assert.equal((await legacy.json()).authenticated, false);
    assert.equal(userReads, 0);
  } finally {
    require.cache[modulePath].exports = original;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
