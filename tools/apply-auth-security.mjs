import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const env = {};
for (const name of ['.env', '.env.local']) {
  if (!fs.existsSync(name)) continue;
  for (const line of fs.readFileSync(name, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL;
if (!connectionString) throw new Error('POSTGRES_URL_NON_POOLING is required');
const normalized = connectionString.replace(/[?&]sslmode=[^&]*/i, '').replace(/[?&]$/, '');
const client = new pg.Client({ connectionString: normalized, ssl: { rejectUnauthorized: false } });

await client.connect();
try {
  await client.query(fs.readFileSync(path.join('sql', '002_supabase_auth_only.sql'), 'utf8'));
  const verified = await client.query(`
    select
      count(*) filter (where p.role = 'admin')::int as admin_profiles,
      count(*) filter (where p.role = 'admin' and u.id is not null)::int as linked_admin_accounts
    from public.profiles p
    left join auth.users u on u.id = p.id
  `);
  console.log('Supabase profile role protection applied');
  console.log(JSON.stringify(verified.rows[0]));
} finally {
  await client.end();
}
