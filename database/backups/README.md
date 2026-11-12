# Encrypted migration backups

No production export has been performed yet. This directory contains no database backup.

Only final `.enc` archives may be committed. Encryption keys must live outside this
checkout and be supplied as `BACKUP_KEY_FILE`. Keep a second protected copy of the
key: losing it makes restoration impossible. Windows administrators should restrict
the key directory ACL; POSIX key files are created with mode 0600.

`node scripts/backup-crypto.cjs keygen <absolute-key-path-outside-checkout>`

`node scripts/backup-crypto.cjs encrypt <source-file> database/backups/<name>.enc`

`node scripts/backup-crypto.cjs verify database/backups/<name>.enc`

The utility streams data through AES-256-GCM, uses a fresh nonce for every archive,
and refuses to overwrite existing files. Verification decrypts to a discard sink
and checks authentication; it does not write plaintext or prove database completeness.
The final export must additionally contain database schema/data/roles, storage bytes,
metadata, inventories, and validation manifests. Encryption alone is not a migration.

Before committing large archives, configure Git LFS for `database/backups/*.enc` and
verify LFS upload/download from a clean checkout. Archive ciphertext and its required
external key must both be available in the disaster-recovery procedure.
