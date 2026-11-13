# cPanel + Express + Supabase verification — updated 2026-11-13

## Public Git content update

- 19 public projects, 14 services and existing public collections load from Git by
  default. /api/content and /api/album have real public fallback content without credentials.
- 218 public assets imported (26.7 MB); disk and local HTTP SHA-256 verified for all.
- Node 22 build passed (54 syntax checks); all four test:cpanel suites passed.
- Browser with every external request blocked: 178 image elements loaded, zero broken
  images, 14 service images, zero JavaScript errors.
- No new Auth/private database records imported. Live content refresh returned 503;
  source is existing public code plus the prior public project catalog.
- One unavailable decorative cover uses the existing brand image (recorded in manifest).

The following records describe earlier deployment preparation.

## Confirmed locally

- Runtime: Node.js 22.23.4.
- npm install: PASS. npm run build: PASS (53 source files syntax checked).
- Generated deploy/cpanel package independently passed npm ci, npm run build and
  all three test:cpanel suites on Node 22.23.4 before packaging for transfer.
- test:cpanel: PASS (public routing/cache/SEO, Admin denial, simulated Passenger and encryption fixtures).
- new-start.js, server.js and compatibility app.js reuse ONE listener under the simulated Passenger loader.
- 48 Admin path/method combinations return 404. Admin source is preserved.
- Public pages/content/status and unauthenticated session responses work; private profile returns 401 without login.
- www canonical, legacy .html/pages/our-jobs and project-id redirects checked.
- CSS/JS content types/cache headers checked; runtime configuration remains no-store.
- Public image redirects use full Supabase URLs without requiring the server secret.
- Local Chromium/Edge home-page check: 176 image elements loaded, including 14 service
  images; zero failed image HTTP responses and zero JavaScript errors after eager loading.
  External telemetry writes were blocked during this check; only public images were read.

## Observed hosting issue

The existing live site returned a relative Location header for a missing local brand
asset (brand/smart-tech.png). That URL is resolved on the website rather than in
Supabase Storage, leading to wrong-path requests. The public URL helper used to depend
on an available server-only Supabase client. The replacement constructs public URLs
independently while leaving private Auth/database/upload clients unchanged.

The hosting provider reports Startup File new-start.js under repositories/smarttech.
The local wrapper and package now match this configuration and delegate to server.js.

## Not yet verified

- Actual CloudLinux/Passenger, server filesystem permissions, TLS/proxy settings.
- Credentialed Supabase table/Auth-admin checks: diagnostic reports NOT RUN because
  SUPABASE_URL/server key are not configured locally.
- Real end-user login, password changes, private files and uploads: no production writes
  or sessions were created. Local public routes and public Storage reads are not a substitute.
- SMTP and AI upstream services were not called.

The architecture is now cPanel -> Express -> EXISTING Supabase. MySQL migration is
cancelled, not an outstanding requirement for this hosting change. No database data,
Auth records, policies or Storage files were modified. No push/deployment was performed
by this work; local tests and package generation do not update the hosted website.

Consult CPANEL.md for repositories/smarttech, Node 22.23.4, Production and new-start.js.
