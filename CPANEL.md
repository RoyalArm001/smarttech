# cPanel staging package — NOT a completed MySQL migration

This branch disables legacy Admin UI/API and prepares Node 22 startup. Authentication,
profiles, contact storage and live content still require Supabase. No production export,
MySQL schema/import or production encrypted backup exists. Do not switch production DNS.

## Fix "package.json file is required"

The application root must contain these files together:

```
package.json
package-lock.json
app.js
server.js
src/
pages/
lib/
vendor/
```

`deploy/cpanel/` is the complete generated package. Extract its CONTENTS into the
server application root, without an extra `deploy/cpanel` nesting level. Do not choose
`dist`, `admin`, `src`, or `public_html` unless that exact directory actually contains
the complete Node application. The builder keeps legacy admin sources needed by the
existing code/checks, but the HTTP application blocks them and the static build omits them.

## Panel fields

- Node.js version: **22.23.4**.
- Application mode: **Production** (`NODE_ENV=production`).
- Application root: **smarttech-mysql** IF files are extracted into
  `/home/<CPANEL_USER>/smarttech-mysql`. Otherwise use the actual extraction folder,
  relative to your account home. The account name is not known from this repository.
- Application URL: select an existing **staging subdomain**, base path `/`.
  The actual staging domain has not been supplied. `/src` and `/api` links assume root mounting.
- Application startup file: **app.js**, not `api/[...path].js`, `admin/server.js` or `dist/index.html`.
- Passenger log file: `/home/<CPANEL_USER>/logs/smarttech-passenger.log`, if the hosting
  form offers this field. Create the private writable `logs` directory first. This is
  a proposed path; replace the account placeholder with the actual cPanel account.

`app.js` explicitly calls `.listen()` on the existing Express application when loaded
as a module. This is tested without relying on `require.main === module` in `server.js`.
An actual cPanel/Passenger deployment still needs testing on the hosting provider.

## Environment

Set `NODE_ENV=production`, `OPEN_BROWSER=0`, and `PORT` if required by the host.
Set `SMARTTECH_WEB_ORIGIN` to the actual HTTPS staging origin and
`REQUEST_TRUSTED_HOSTS` to its hostname. Configure `SMARTTECH_TRUST_PROXY` only for
the host's verified proxy topology. Do not set `VERCEL` or `VERCEL_ENV`.

The CURRENT unconverted backend needs `SUPABASE_URL`, `SUPABASE_ANON_KEY` and a server-only
`SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` for live data/auth. **Do not supply
production write-capable credentials for staging tests.** Use a separate test project
if exercising these routes before migration. Without credentials, static pages still
load but authenticated/database-dependent requests cannot be validated.

Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
`REQUEST_EMAIL_FROM`, `REQUEST_EMAIL_TO` (or `RESEND_API_KEY`).
AI: `OPENAI_API_KEY`, `OPENAI_MODEL`; Google AI settings are optional.
Firebase statistics are a separate external integration, also not migrated to MySQL.
Never set a private Firebase auth token in a public static build configuration.

`MYSQL_*` values in `scripts/migration.env.example` are planning fields only; the current
server does not use them. Adding those values will NOT enable MySQL.

## Install, build, restart (instructions only)

Use the exact virtual-environment activation command shown by cPanel for this app.
Then, from the application root:

```
node --version
npm ci
npm run build
```

`node --version` must report v22.23.4. Panel "Run NPM Install" also requires the correct
Application root; `npm ci` in Terminal is preferred for lockfile-based installation.
Keep `vendor/node-domexception` with the package because package.json references it.
Install Linux dependencies on the server; never upload Windows node_modules.

Keep the Node application root after building; do not change it to dist. Click Restart
in Setup Node.js App after installation/configuration changes. For a standard Passenger
installation the documented restart mechanism is `mkdir -p tmp && touch tmp/restart.txt`
inside the app root. Confirm the mechanism offered by your hosting provider.

Run automated fixture tests only in a disposable copy WITHOUT .env/.env.local:

```
npm run test:cpanel
```

These verify startup, denied admin routes, public routes and encryption fixtures.
They do not verify production credentials, MySQL, authenticated profile writes, SMTP,
AI calls or cPanel itself. Database-dependent completion requires live export/import
validation described in `database/MIGRATION-STATUS.md`.

## Generate package locally

```
npm run package:cpanel
```

Generated `deploy/` is Git-ignored. Keep source, package manifests, app.js, scripts and
documentation in Git after review; a remote checkout cannot see uncommitted files.
The package contains source SQL under `sql/` (PostgreSQL), not an invented MySQL schema.

References:
- https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/
- https://docs.cpanel.net/cpanel/software/application-manager/
