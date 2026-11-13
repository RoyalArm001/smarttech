# Smart Tech: cPanel + Express + Supabase

Architecture: Browser -> cPanel / CloudLinux Passenger -> Node.js Express -> Supabase.
The existing Supabase database, Auth and Storage are retained. No MySQL system or
data migration is required. Earlier database/MIGRATION-STATUS.md is historical planning.

## Exact cPanel settings

| Field | Value |
|---|---|
| Node.js version | 22.23.4 |
| Application mode | Production |
| Application root | repositories/smarttech |
| Application URL | Connected domain at /; verify on staging before cutover |
| Application startup file | new-start.js (matching the provider's current configuration) |
| Passenger log file | /home/<CPANEL_USER>/logs/smarttech-passenger.log |

Create a writable private logs directory and replace the account placeholder.
Root is /home/<CPANEL_USER>/repositories/smarttech and must contain package.json,
package-lock.json, new-start.js, server.js, pages/, src/, lib/, admin/ and vendor/.
Do not choose dist/, admin/, or the Windows E: path as application root.

server.js detects PhusionPassenger, configures explicit listener selection and listens
on its socket. npm start runs the same Express app on PORT outside Passenger.
new-start.js loads this same server.js application and reuses its listener. It does not
replace the backend or start a second listener. app.js is a compatibility alias.
Upload the complete tested package, not new-start.js alone: it expects app.start()
from the corresponding server.js version.

Public image URL generation uses the existing Supabase public origin, independently
of a service-role key. This fixes missing local assets redirecting to relative URLs
such as brand/smart-tech.png. Private Auth/database operations still require credentials.

## Installation and restart

Activate the Node environment using the exact command displayed by Setup Node.js App.
From the application root run:

    node --version
    npm install
    npm run build

Node must report v22.23.4. npm ci is the lockfile-based clean-install alternative.
Install dependencies on Linux; never upload Windows node_modules.
Keep vendor/node-domexception because package.json references this local override.
Click Restart after installation/environment changes. Standard Passenger also supports
creating/touching tmp/restart.txt inside application root. Do not start a second
long-running npm start process beside Passenger.

## Public content in Git (2026-11-13)

PUBLIC_CONTENT_SOURCE=repository is the default. Public pages, /api/content and
/api/album use content/public-site.json and local public assets. Supabase Auth,
personal profiles and new user uploads remain on the existing backend.
Set PUBLIC_CONTENT_SOURCE=supabase only when intentionally using live CMS data.
Known images are served locally with a one-day cache; unknown uploads retain Storage fallback.

The snapshot contains public source content plus the previously saved project catalog,
NOT a fresh complete database export. Live content refresh returned 503 and no private
credentials were available. User accounts, passwords and contact messages are excluded.

content/public-assets.json records source URL, size and SHA-256 for 218 imported files.
One removed external decorative cover (404) uses the existing site brand image.
Rebuild from maintained src/content and lib/project-catalog.json inputs with
npm run import:public. This imports referenced public assets, not private buckets or
unseen live database edits. Review the resulting Git diff before publication.

## Environment Variables

Copy names from .env.example into cPanel Environment Variables; never put secret values
in Git or frontend code. Keep your existing Supabase project and credentials:

- SUPABASE_URL
- SUPABASE_ANON_KEY (existing publishable-key aliases in server.js remain supported)
- SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY (server only)
- NODE_ENV=production; OPEN_BROWSER=0
- SMARTTECH_WEB_ORIGIN: actual HTTPS website origin
- REQUEST_TRUSTED_HOSTS: allowed hostname(s), including staging when needed
- SMARTTECH_TRUST_PROXY: host-verified trusted proxy topology, required for correct
  secure cookies/client IP behind proxies. Do not blindly trust arbitrary forwarded headers.

Enable HTTPS in the hosting panel. Mail uses SMTP_* and REQUEST_EMAIL_FROM/TO or
RESEND_API_KEY. Chat uses OPENAI_API_KEY/OPENAI_MODEL; Google AI remains optional.
Firebase metrics remain a separate existing integration. Private Firebase auth tokens
are not emitted to browser runtime configuration. Blank SMARTTECH_CMS_API_BASE_URL
uses same-origin Express APIs. No MYSQL_* settings are used.

## Routing and retained functionality

lib/hosting-routes.js handles www-to-canonical redirects, legacy /pages and .html URLs,
our-jobs aliases, cache headers and public Supabase Storage asset redirects.
Images/brand/team retain the existing buckets. Runtime config is no-store.
Project SSR, sitemaps and profile URLs are handled by Express.
All API handlers already exist in server.js; serverless forwarding wrappers are removed.
Hosting-specific analytics/configuration and obsolete static deployment rules are removed.
SEO titles, canonical URLs, structured data and sitemap remain.

Legacy admin source is retained for audit/helper imports. /admin and /api/admin/* return
404, including encoded/case variants. Admin assets are excluded from static build.
User authentication, profile, contact, request, chat and content-read APIs remain.
Admin-role users can use their own profile without redirection to the disabled panel.
No Supabase tables, users, RLS policies, passwords or files are migrated or deleted.

## Package and verification

    npm run package:cpanel
    npm run test:cpanel
    npm run check:supabase

deploy/cpanel/ is a reproducible complete source package, Git-ignored, with startup
files at its root. It excludes .env, keys, node_modules, local runtime data and database
exports. The test suite must run only in a disposable checkout without .env/.env.local.
It exercises public HTTP routing, admin closure, encryption fixtures and a simulated
Passenger loader. Actual CloudLinux/Passenger, TLS and permissions require staging tests.

check:supabase performs read-only table/Auth-admin/bucket-list checks with configured
environment credentials. It never signs in, creates sessions, writes rows or uploads.
It cannot prove full login/password/upload workflows. Missing credentials report NOT RUN.
Use a dedicated test account/project for state-changing integration tests.

See CPANEL-VALIDATION.md for actual results. No push, hosting deployment, DNS change or
production database modification is performed automatically.

References:
- https://www.phusionpassenger.com/library/indepth/nodejs/reverse_port_binding.html
- https://docs.cpanel.net/cpanel/software/application-manager/
