'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
test('server.js starts once when loaded by a simulated Passenger loader', async () => {
  assert.ok(!fs.existsSync(path.resolve(__dirname,'../.env')) && !fs.existsSync(path.resolve(__dirname,'../.env.local')));
  for (const key of Object.keys(process.env)) if (/SUPABASE|POSTGRES|OPENAI|GEMINI|SMTP|RESEND/.test(key)) delete process.env[key];
  let calls=0, configuration;
  global.PhusionPassenger = { configure(value) { configuration=value; } };
  const original = http.Server.prototype.listen;
  http.Server.prototype.listen = function (target, ...args) {
    calls++; assert.equal(target,'passenger');
    return original.call(this,0,...args); // Emulates binding; no actual Passenger daemon.
  };
  let server;
  try {
    const app = require('../server'); server=app.httpServer;
    assert.ok(server); if(!server.listening) await new Promise(resolve=>server.once('listening',resolve));
    assert.deepEqual(configuration,{autoInstall:false});
    assert.equal(app.start(),server); assert.equal(require('../app'),server);
    assert.equal(require('../new-start'),server); assert.equal(calls,1);
    const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/status');
    assert.equal((await response.json()).runtime,'passenger');
  } finally {
    http.Server.prototype.listen=original; delete global.PhusionPassenger;
    if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
  }
});
