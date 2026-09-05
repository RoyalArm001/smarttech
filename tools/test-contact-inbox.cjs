// Opt-in integration test: creates and removes one message and one temporary Auth account.
// Run: node tools/test-contact-inbox.cjs --live
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createClient } = require('@supabase/supabase-js');
const { chromium } = require('playwright');

if (!process.argv.includes('--live')) {
  console.log('Pass --live to test against the configured Supabase database (temporary test data is removed).');
  process.exit(0);
}
process.env.SMARTTECH_APP_MODE = 'all';
const app = require('../server'); // Loads the existing server environment, without logging credentials.
const client = createClient(process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } });
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const anonymous = createClient(process.env.SUPABASE_URL, anonKey, { auth: { persistSession: false } });
const marker = 'Inbox integration ' + crypto.randomUUID();
let server, browser, userId;
async function main() {
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = 'http://127.0.0.1:' + server.address().port;
  const request = async (path, options = {}) => {
    const response = await fetch(base + path, options);
    return { status: response.status, data: await response.json() };
  };
  assert.equal((await request('/api/admin/messages')).status, 401);
  const denied = await anonymous.from('contact_messages').select('id').limit(1);
  assert.ok(denied.error, 'Anonymous database reads must be denied');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const publicContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await publicContext.newPage();
  await page.goto(base + '/contact', { waitUntil: 'domcontentloaded' });
  const form = page.locator('#contact-form');
  await form.locator('[name=name]').fill(marker);
  await form.locator('[name=phone]').fill('+37499000000');
  await form.locator('[name=email]').fill('contact-test@example.com');
  await form.locator('[name=message]').fill('Temporary integration message. <img src=x onerror=alert(1)>');
  const submitted = page.waitForResponse(r => r.url() === base + '/api/contact' && r.request().method() === 'POST');
  await form.locator('button[type=submit]').click();
  const response = await submitted;
  assert.equal(response.status(), 201);
  const saved = await response.json();
  assert.equal(saved.saved, true);
  await page.waitForFunction(() => document.querySelector('#form-status').classList.contains('is-success'));
  const stored = await client.from('contact_messages').select('*').eq('id', saved.id).single();
  assert.ifError(stored.error);
  assert.equal(stored.data.name, marker);
  assert.equal(stored.data.status, 'new');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#contact-form button[type=submit]')?.disabled === true);
  console.log('PASS: mobile contact form, persistence, success feedback and refresh cooldown');
  const jsonPost = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify(body) });
  assert.equal((await request('/api/contact', jsonPost({ name: 'x' }))).status, 400);
  assert.equal((await request('/api/contact', jsonPost({ website: 'spam' }))).status, 400);
  assert.equal((await request('/api/contact', jsonPost({}))).status, 429);
  console.log('PASS: validation, honeypot, rate limiting and anonymous access protection');

  const email = 'inbox-test-' + crypto.randomUUID() + '@example.com';
  const password = crypto.randomBytes(30).toString('base64url') + 'aA1!';
  const created = await client.auth.admin.createUser({ email, password, email_confirm: true });
  assert.ifError(created.error);
  userId = created.data.user.id;
  const profile = await client.from('profiles').upsert({ id: userId, email, full_name: marker, role: 'admin' });
  assert.ifError(profile.error);
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const admin = await context.newPage();
  await admin.goto(base + '/admin', { waitUntil: 'domcontentloaded' });
  await admin.locator('#admin-email').fill(email);
  await admin.locator('#admin-password').fill(password);
  await admin.locator('#admin-login-form button[type=submit]').click();
  await admin.locator('#admin-tab-messages').click();
  let card = admin.locator('.admin-message').filter({ hasText: marker });
  await card.waitFor();
  assert.equal(await card.locator('img').count(), 0, 'Message markup must not be interpreted as HTML');
  const updated = admin.waitForResponse(r => r.url().endsWith('/api/admin/messages/' + saved.id) && r.request().method() === 'PATCH');
  await card.locator('select').selectOption('read');
  assert.equal((await updated).status(), 200);
  await admin.reload({ waitUntil: 'domcontentloaded' });
  await admin.locator('#admin-tab-messages').click();
  card = admin.locator('.admin-message').filter({ hasText: marker });
  await card.waitFor();
  assert.equal(await card.locator('select').inputValue(), 'read');
  await admin.setViewportSize({ width: 390, height: 844 });
  assert.ok(await admin.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Mobile inbox must not overflow');
  const csrfDenied = await context.request.patch(base + '/api/admin/messages/' + saved.id, { data: { status: 'resolved' } });
  assert.equal(csrfDenied.status(), 403);
  const changed = await client.from('profiles').update({ role: 'member' }).eq('id', userId);
  assert.ifError(changed.error);
  assert.equal((await context.request.get(base + '/api/admin/messages')).status(), 401);
  assert.equal((await context.request.patch(base + '/api/admin/messages/' + saved.id, { data: { status: 'resolved' } })).status(), 401);
  console.log('PASS: real admin login, inbox display, XSS safety, status update, refresh, mobile layout, CSRF and member denial');
}
main().catch(error => { console.error('FAIL:', error.message); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  const removed = await client.from('contact_messages').delete().eq('name', marker);
  if (removed.error) { console.error('Test message cleanup failed:', removed.error.code); process.exitCode = 1; }
  if (userId) {
    const removedUser = await client.auth.admin.deleteUser(userId);
    if (removedUser.error) { console.error('Temporary account cleanup failed'); process.exitCode = 1; }
  }
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  console.log('Temporary test data cleanup finished.');
});
