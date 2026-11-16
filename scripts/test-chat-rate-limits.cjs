'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');

test('chat rate limits count repeat visitors and separate IPv4 and IPv6 networks', async () => {
  for (const file of ['.env', '.env.local', 'admin/data/settings.json']) {
    assert.ok(!fs.existsSync(path.resolve(__dirname, '..', file)), 'Run with fixture configuration only');
  }
  for (const key of Object.keys(process.env)) {
    if (/SUPABASE|POSTGRES|DATABASE_URL|OPENAI|GEMINI|SMTP|RESEND|CHATGPT/.test(key)) delete process.env[key];
  }
  process.env.OPEN_BROWSER = '0';
  process.env.PUBLIC_CONTENT_SOURCE = 'repository';

  // Capture the actual server registrations while retaining the package's IP helper.
  const modulePath = require.resolve('express-rate-limit');
  const original = require(modulePath);
  const registrations = [];
  require.cache[modulePath].exports = {
    ...original,
    rateLimit(options) {
      registrations.push(options);
      return original.rateLimit(options);
    }
  };
  try {
    require('../server');
  } finally {
    require.cache[modulePath].exports = original;
  }

  const fixture = express();
  fixture.set('trust proxy', 1);
  const stores = [];
  for (const name of ['chatUserLimiterKey', 'chatPageClientKey']) {
    const options = registrations.find(item => item.keyGenerator && item.keyGenerator.name === name);
    assert.ok(options, name + ' is registered');
    const keyFor = ip => options.keyGenerator({ ip, body: {} });
    assert.equal(typeof keyFor('192.0.2.1'), 'string');
    assert.equal(keyFor('192.0.2.1'), keyFor('192.0.2.1'));
    assert.notEqual(keyFor('192.0.2.1'), keyFor('192.0.2.2'));
    assert.equal(keyFor('2001:db8:100:1::1'), keyFor('2001:db8:100:2::2'));
    assert.notEqual(keyFor('2001:db8:100:1::1'), keyFor('2001:db8:200:1::1'));

    const store = new original.MemoryStore();
    stores.push(store);
    fixture.post('/' + name, original.rateLimit({
      ...options,
      limit: 2,
      store
    }), (request, response) => response.sendStatus(200));
  }

  const server = fixture.listen(0, '127.0.0.1');
  if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    for (const name of ['chatUserLimiterKey', 'chatPageClientKey']) {
      const cases = [
        ['192.0.2.1', 200],
        ['192.0.2.1', 200],
        ['192.0.2.1', 429],
        ['192.0.2.2', 200],
        ['2001:db8:100:1::1', 200],
        ['2001:db8:100:2::2', 200],
        ['2001:db8:100:3::3', 429],
        ['2001:db8:200:1::1', 200]
      ];
      for (const [ip, expectedStatus] of cases) {
        const response = await fetch(base + '/' + name, {
          method: 'POST',
          headers: { 'X-Forwarded-For': ip }
        });
        assert.equal(response.status, expectedStatus, name + ' ' + ip);
        await response.text();
      }
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    for (const store of stores) store.shutdown();
  }
});
