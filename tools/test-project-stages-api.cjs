// Offline API integration: replace Supabase with an in-memory test double.
const assert = require('node:assert/strict');
const Module = require('node:module');
const crypto = require('node:crypto');
process.env.SMARTTECH_APP_MODE = process.argv.includes('--admin') ? 'admin' : 'all';
process.env.SUPABASE_URL = 'https://test.example';
process.env.SUPABASE_SECRET_KEY = 'test-only-secret';
process.env.SUPABASE_ANON_KEY = 'test-only-anon';
const rows = new Map();
const originalLoad = Module._load;
Module._load = function (name, ...args) {
  if (name === '@supabase/supabase-js') return { createClient: () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'test-admin', email: 'test@example.com' } } }) },
    from: table => {
      let result = { data: [], error: null };
      const query = {
        select() { result.data = table === 'projects' ? Array.from(rows.values()) : []; return query; },
        eq() { return query; }, order() { return query; },
        maybeSingle: async () => ({ data: { id: 'test-admin', role: 'admin' }, error: null }),
        upsert(values) { if (table === 'projects') for (const row of values) rows.set(row.id, structuredClone(row)); return query; },
        then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); }
      };
      return query;
    }
  }) };
  return originalLoad.call(this, name, ...args);
};
const app = require('../server');
Module._load = originalLoad;
const stageConfig = require('../src/core/namespace');
const token = 'test-session';
const headers = { 'Content-Type': 'application/json', Cookie: 'smarttech_admin=' + token,
  'X-CSRF-Token': crypto.createHmac('sha256', process.env.SUPABASE_SECRET_KEY).update(token).digest('base64url') };
let server;
(async () => {
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = 'http://127.0.0.1:' + server.address().port;
  for (const stage of stageConfig.all) {
    const item = { id: 'test-project', title: 'Test project', status: 'current', stage: stage.id, translations: { en: { phase: 'Details' } } };
    const saved = await fetch(base + '/api/admin/cms/projects', { method: 'PUT', headers, body: JSON.stringify([item]) });
    assert.equal(saved.status, 200);
    assert.equal((await saved.json()).data[0].stage, stage.id);
    assert.equal(rows.get(item.id).source_data.stage, stage.id);
    const reloaded = await fetch(base + '/api/admin/cms/projects', { headers });
    assert.equal((await reloaded.json()).data[0].stage, stage.id);
  }
  const invalid = await fetch(base + '/api/admin/cms/projects', { method: 'PUT', headers, body: JSON.stringify([{ id: 'test-project', title: 'Test', stage: 'invalid-stage' }]) });
  assert.equal(invalid.status, 400);
  assert.equal(rows.get('test-project').source_data.stage, 'handover');
  const finished = await fetch(base + '/api/admin/cms/projects', { method: 'PUT', headers, body: JSON.stringify([{ id: 'test-project', title: 'Test', status: 'completed', stage: 'survey' }]) });
  assert.equal((await finished.json()).data[0].stage, 'handover');
  const anonymous = await fetch(base + '/api/admin/cms/projects');
  assert.equal(anonymous.status, 401);
  const noCsrf = await fetch(base + '/api/admin/cms/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: headers.Cookie }, body: '[]' });
  assert.equal(noCsrf.status, 403);
  assert.equal((await fetch(base + '/src/core/namespace.js')).status, 200);
  console.log('PASS: five stages save/read through API, source_data round trip, invalid-stage rejection, completion, authorization and CSRF (mock database)');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
