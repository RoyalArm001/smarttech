'use strict';
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { pipeline } = require('node:stream/promises');
const { Writable } = require('node:stream');
const ROOT = path.resolve(__dirname, '..');
const MAGIC = Buffer.from('STBK0001');
const HEADER_BYTES = MAGIC.length + 12;

function outsideRepository(file) {
  if (!path.isAbsolute(file)) throw new Error('Key path must be absolute.');
  const actual = path.join(fs.realpathSync(path.dirname(file)), path.basename(file));
  const relative = path.relative(fs.realpathSync(ROOT), actual);
  if (!relative || (!relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))) {
    throw new Error('Encryption keys must be outside the repository.');
  }
  if (fs.existsSync(actual) && fs.lstatSync(actual).isSymbolicLink()) throw new Error('Key symlinks are not allowed.');
  return actual;
}

async function keygen(file) {
  await fsp.writeFile(outsideRepository(file), crypto.randomBytes(32), { flag: 'wx', mode: 0o600 });
}
async function loadKey(file) {
  if (!file) throw new Error('Set BACKUP_KEY_FILE to an external 32-byte key file.');
  const key = await fsp.readFile(outsideRepository(file));
  if (key.length !== 32) throw new Error('Invalid encryption key length.');
  return key;
}
async function encrypt(source, destination, keyFile = process.env.BACKUP_KEY_FILE) {
  if (!destination.endsWith('.enc')) throw new Error('Encrypted archives must use .enc.');
  const key = await loadKey(keyFile);
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  const header = Buffer.concat([MAGIC, nonce]);
  cipher.setAAD(header);
  const handle = await fsp.open(destination, 'wx', 0o600);
  try {
    await handle.write(header);
    await handle.close();
    await pipeline(fs.createReadStream(source), cipher, fs.createWriteStream(destination, { flags: 'a' }));
    await fsp.appendFile(destination, cipher.getAuthTag());
  } catch (error) {
    await handle.close();
    await fsp.unlink(destination);
    throw error;
  } finally { await handle.close(); key.fill(0); }
}
async function verify(file, keyFile = process.env.BACKUP_KEY_FILE) {
  const key = await loadKey(keyFile);
  const handle = await fsp.open(file, 'r');
  try {
    const size = (await handle.stat()).size;
    if (size < HEADER_BYTES + 16) throw new Error('Truncated encrypted archive.');
    const header = Buffer.alloc(HEADER_BYTES), tag = Buffer.alloc(16);
    await handle.read(header, 0, header.length, 0);
    await handle.read(tag, 0, tag.length, size - tag.length);
    await handle.close();
    if (!header.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error('Unsupported backup format.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, header.subarray(MAGIC.length));
    decipher.setAAD(header);
    decipher.setAuthTag(tag);
    let bytes = 0;
    const hash = crypto.createHash('sha256');
    const sink = new Writable({ write(chunk, encoding, done) { bytes += chunk.length; hash.update(chunk); done(); } });
    if (size === HEADER_BYTES + 16) {
      decipher.end();
      await pipeline(decipher, sink);
    } else {
      await pipeline(fs.createReadStream(file, { start: HEADER_BYTES, end: size - 17 }), decipher, sink);
    }
    return { bytes, sha256: hash.digest('hex') };
  } finally { await handle.close(); key.fill(0); }
}
module.exports = { keygen, encrypt, verify };
if (require.main === module) {
  (async () => {
    const [command, source, destination] = process.argv.slice(2);
    if (command === 'keygen' && source) { await keygen(source); console.log('External key created.'); }
    else if (command === 'encrypt' && source && destination) { await encrypt(source, destination); await verify(destination); console.log('Archive encrypted and authenticated.'); }
    else if (command === 'verify' && source) { const result = await verify(source); console.log('Archive authenticated; plaintext bytes:', result.bytes); }
    else throw new Error('Usage: backup-crypto.cjs keygen <key> | encrypt <source> <archive.enc> | verify <archive.enc>');
  })().catch(error => { console.error(error.code || 'Backup operation failed. Check arguments, key, and archive integrity.'); process.exitCode = 1; });
}
