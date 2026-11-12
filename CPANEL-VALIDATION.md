# cPanel package validation — 2026-11-12

## Actual results

- Runtime: **Node.js v22.23.4**, executed using the isolated node.exe explicitly.
- `npm ci`: PASS in source checkout and independently in `deploy/cpanel/`.
- `npm run build`: PASS in both directories, 51 JavaScript files syntax-checked.
- `npm run test:cpanel`: PASS in the generated package (2 test suites).
- Express app loaded through `require('../app')`: HTTP listener started successfully.
- 48 admin path/method combinations return 404, including encoded/case variants.
- `/`, `/login`, `/profile`, `/api/status`, `/api/content`, `/api/auth/session`: 200
  with fixture/no-credential environment. Unauthenticated `/api/profile`: 401.
- Login/profile clients contain no `/api/admin` requests or admin redirects.
- `dist/admin` absent after build; legacy admin SOURCE remains available for audit.
- Native sharp: in-memory 2x2 image converted to WebP successfully on Windows/Node 22.
- Encryption fixtures: valid data authenticates; wrong keys, corrupted/truncated
  archives and overwrites are rejected. No production backup was generated.
- `git diff --check`: PASS (line-ending notices only).

## Deployment structure issue

Root package.json, package-lock.json and server.js are tracked in the existing Git
repository. app.js is added by this migration branch. No ignore rule
excludes these startup files. The generated archive places them directly at ZIP root.
The hosting account has not been accessed: its actual extraction path/application
root cannot be verified from this computer. Do not select dist as the Node app root.

## Not verified / NOT ready for production

- Actual cPanel Linux/Passenger process, proxy configuration, TLS, filesystem permissions.
- Database-backed authenticated reads/writes, live email and AI service calls.
- Source Supabase export, MySQL schema/import, file migration or production restore.
- Source/target record counts, file checksums and database relationships.

`E:\Progect\smarttech-migration.env` was still absent at inspection time.
The new package still has Supabase runtime dependencies. MySQL-compatible schema and
import/restore scripts cannot be truthfully presented as completed. PostgreSQL source
SQL is included under sql/; it must not be imported directly into MySQL.

During package validation, no Git push, cPanel deployment, production database write
or DNS change was performed. Later source publication requires separate authorization.
The pre-change ZIP is a SOURCE CODE snapshot, not an encrypted database backup.
