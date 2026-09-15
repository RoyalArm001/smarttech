// Usage: node --env-file=.env tools/import-profile-resume.cjs <private-payload.json>
// The payload and backups must remain outside the repository; no credentials are changed.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Client } = require('pg');
const { normalizeResume } = require('../lib/profile-resume');

async function main() {
  const payload = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const resume = normalizeResume(payload.resume);
  const url = new URL(process.env.POSTGRES_URL_NON_POOLING);
  url.searchParams.delete('sslmode');
  const db = new Client({ connectionString: url.href, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
  await db.connect();
  try {
    await db.query('begin');
    const found = await db.query('select p.*, u.raw_app_meta_data from public.profiles p join auth.users u on u.id=p.id where lower(p.email)=lower($1) for update of p', [payload.email]);
    if (found.rows.length !== 1) throw new Error('Expected exactly one existing profile');
    const profile = found.rows[0];
    if (profile.raw_app_meta_data.employee_id !== payload.memberId) throw new Error('Auth team link mismatch');
    const members = await db.query('select * from public.team_members where id=$1 for update', [payload.memberId]);
    if (members.rows.length !== 1) throw new Error('Expected existing team member');
    const member = members.rows[0];
    const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smarttech-profile-backup-'));
    fs.writeFileSync(path.join(backupDir, 'before.json'), JSON.stringify({ profile, member }, null, 2));
    const migration = fs.readFileSync(path.join(__dirname, '../sql/008_profile_resume.sql'), 'utf8').replace(/^begin;\s*/i, '').replace(/commit;\s*$/i, '');
    await db.query(migration);
    await db.query('update public.profiles set full_name=$2,bio=$3,phone=$4,website=$5,social_links=coalesce(social_links,\'{}\'::jsonb)||$6::jsonb,resume=$7::jsonb,updated_at=now() where id=$1', [profile.id, payload.fullName, payload.bio, payload.phone, payload.website, JSON.stringify(payload.socialLinks), JSON.stringify(resume)]);
    const source = Object.assign({}, member.source_data, payload.team, { fullName: payload.fullName, username: profile.username, phone: payload.phone, text: payload.bio });
    await db.query('update public.team_members set text=$2,source_data=$3::jsonb,socials=$4::jsonb,certificates=$5::jsonb,updated_at=now() where id=$1', [member.id, payload.bio, JSON.stringify(source), JSON.stringify(payload.team.socials), JSON.stringify(payload.team.certificates)]);
    await db.query("update auth.users set raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)||jsonb_build_object('full_name',$2::text),updated_at=now() where id=$1", [profile.id, payload.fullName]);
    await db.query('commit');
    console.log(JSON.stringify({ updated: payload.email, id: profile.id, memberId: member.id, languages: Object.keys(resume), backup: path.join(backupDir, 'before.json') }));
  } catch (error) { await db.query('rollback'); throw error; }
  finally { await db.end(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
