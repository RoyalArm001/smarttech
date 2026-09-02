import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const name of ['.env', '.env.local']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const url = env.SUPABASE_URL;
const secret = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
const email = process.env.ADMIN_USER_EMAIL || 'admin@smarttechllc.am';
const suppliedPassword = process.env.ADMIN_USER_PASSWORD || '';
const password = suppliedPassword || `St!${crypto.randomBytes(12).toString('base64url')}9a`;
if (!url || !secret || !publicKey) throw new Error('Supabase server and public keys are required');

const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const publicClient = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listed.error) throw listed.error;
let user = listed.data.users.find(item => String(item.email).toLowerCase() === email.toLowerCase());
if (user) {
  if (!suppliedPassword) throw new Error('Admin already exists. Set ADMIN_USER_PASSWORD explicitly to rotate its password.');
  const updated = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true, user_metadata: { full_name: 'Smart Tech Admin' } });
  if (updated.error) throw updated.error;
  user = updated.data.user;
} else {
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: 'Smart Tech Admin' } });
  if (created.error) throw created.error;
  user = created.data.user;
}
const profile = await admin.from('profiles').upsert({ id:user.id, email, full_name:'Smart Tech Admin', role:'admin', updated_at:new Date().toISOString() }, { onConflict:'id' });
if (profile.error) throw profile.error;
const login = await publicClient.auth.signInWithPassword({ email, password });
if (login.error || !login.data.session) throw login.error || new Error('Login test failed');
await publicClient.auth.signOut();
console.log(JSON.stringify({ email, temporaryPassword:password, userId:user.id, role:'admin', loginTest:'passed', logoutTest:'passed' }, null, 2));
