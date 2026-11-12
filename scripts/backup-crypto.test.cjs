const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { keygen, encrypt, verify } = require('./backup-crypto.cjs');
test('authenticated streaming backups reject tampering, wrong keys and overwrites', { timeout: 15000 }, async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'smarttech-crypto-test-'));
  try {
    const key = path.join(dir, 'backup.key'), wrong = path.join(dir, 'wrong.key');
    await keygen(key); await keygen(wrong);
    await assert.rejects(keygen(key));
    await assert.rejects(keygen(path.resolve(__dirname, '../unsafe.key')));
    for (const length of [0, 1, 1048576]) {
      const data = crypto.randomBytes(length), input = path.join(dir, 'input'), archive = path.join(dir, length + '.enc');
      await fs.writeFile(input, data);
      await encrypt(input, archive, key);
      assert.deepEqual(await verify(archive, key), { bytes: length, sha256: crypto.createHash('sha256').update(data).digest('hex') });
      await assert.rejects(encrypt(input, archive, key));
      await assert.rejects(verify(archive, wrong));
      const bytes = await fs.readFile(archive);
      bytes[bytes.length - 1] ^= 1;
      const corrupted = path.join(dir, 'corrupted.enc');
      await fs.writeFile(corrupted, bytes);
      await assert.rejects(verify(corrupted, key));
      await fs.writeFile(corrupted, bytes.subarray(0, 10));
      await assert.rejects(verify(corrupted, key));
    }
  } finally {
    // Only remove the fresh temporary directory created by this test.
    if (path.dirname(dir) !== os.tmpdir() || !path.basename(dir).startsWith('smarttech-crypto-test-')) throw new Error('Unexpected cleanup path');
    await fs.rm(dir, { recursive: true, force: true });
  }
});
