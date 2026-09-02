import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
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

const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase server environment variables are required');

const uploadMissing = process.argv.includes('--upload-missing');
const roots = process.argv.slice(2).filter(value => value !== '--upload-missing');
if (!roots.length) throw new Error('Pass one or more tracked asset directories');
const files = execFileSync('git', ['ls-files', '--', ...roots], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean)
  .filter(file => /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(file));
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

function target(file) {
  const normalized = file.replace(/\\/g, '/');
  if (normalized.startsWith('src/assets/team/')) {
    return { bucket: 'avatars', objectPath: normalized.slice('src/assets/'.length) };
  }
  if (normalized.startsWith('src/assets/')) {
    return { bucket: 'project-images', objectPath: normalized.slice('src/assets/'.length) };
  }
  if (normalized.startsWith('img/')) {
    return { bucket: 'project-images', objectPath: normalized.slice('img/'.length) };
  }
  throw new Error(`Unsupported asset path: ${file}`);
}

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < files.length) {
    const file = files[cursor++];
    const destination = target(file);
    const downloaded = await client.storage.from(destination.bucket).download(destination.objectPath);
    if (downloaded.error || !downloaded.data) {
      if (uploadMissing) {
        const body = fs.readFileSync(path.join(root, file));
        const extension = path.extname(file).toLowerCase();
        const contentType = {
          '.avif': 'image/avif', '.gif': 'image/gif', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
          '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp'
        }[extension] || 'application/octet-stream';
        const uploaded = await client.storage.from(destination.bucket).upload(destination.objectPath, body, {
          upsert: true,
          contentType
        });
        if (!uploaded.error) {
          await client.from('media_assets').upsert({
            bucket_id: destination.bucket,
            storage_path: destination.objectPath,
            original_name: path.basename(file),
            mime_type: contentType,
            size_bytes: body.length,
            metadata: { source_path: file }
          }, { onConflict: 'bucket_id,storage_path' });
          results.push({ file, status: 'uploaded' });
          continue;
        }
      }
      results.push({ file, status: 'missing', error: downloaded.error?.message || 'empty object' });
      continue;
    }
    const localHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
    const remoteHash = crypto.createHash('sha256').update(Buffer.from(await downloaded.data.arrayBuffer())).digest('hex');
    results.push({ file, status: localHash === remoteHash ? 'match' : 'different' });
  }
}

await Promise.all(Array.from({ length: Math.min(10, files.length) }, worker));
const counts = results.reduce((output, item) => {
  output[item.status] = (output[item.status] || 0) + 1;
  return output;
}, {});
console.log(JSON.stringify({ checked: files.length, ...counts }));
for (const item of results.filter(item => item.status === 'missing')) {
  console.log(`MISSING ${item.file}: ${item.error}`);
}
process.exitCode = results.some(item => item.status === 'missing') ? 1 : 0;
