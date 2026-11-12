'use strict';
// Read-only diagnostics. Never signs in, creates sessions, uploads, or writes records.
const { createClient } = require('@supabase/supabase-js');
(async () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) { console.log('NOT RUN: Supabase URL and server key are not configured.'); process.exitCode=2; return; }
  const client = createClient(url, secret, { auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(15000)})} });
  let failed = false;
  for (const table of ['profiles','team_members','projects','content_collections','media_assets','contact_messages']) {
    const { error } = await client.from(table).select('*',{head:true,count:'exact'});
    console.log(table+': '+(error?'FAIL':'readable')); if(error) failed=true;
  }
  const users = await client.auth.admin.listUsers({page:1,perPage:1});
  console.log('Auth admin read: '+(users.error?'FAIL':'OK (login/password flow not tested)'));
  const buckets = await client.storage.listBuckets();
  console.log('Storage metadata read: '+(buckets.error?'FAIL':'OK'));
  for (const bucket of ['avatars','project-images']) {
    if (!(buckets.data||[]).some(b=>b.id===bucket)) { console.log(bucket+': unavailable'); failed=true; continue; }
    const objects = await client.storage.from(bucket).list('',{limit:1});
    console.log(bucket+' object listing: '+(objects.error?'FAIL':'OK')); if(objects.error)failed=true;
  }
  if(failed || users.error || buckets.error) process.exitCode=1;
})().catch(()=>{console.error('Supabase diagnostic failed; credentials and response bodies withheld.');process.exitCode=1;});
