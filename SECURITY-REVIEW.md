# Security and CMS review — 2026-09-06

## Fixed

- Public static-file routing previously allowed files outside the intended public assets, including server/config paths. Public and admin asset paths now use allowlists; dot paths, server code, package manifests, and admin data are rejected.
- Account checks now reject missing/inactive profiles, including existing sessions; login is rate-limited. Removed the Vercel hostname exception that could accept an unrelated Origin.
- Team-member linkage now uses server-controlled Auth `app_metadata`, not user-editable `user_metadata`. Migration `sql/007_account_security.sql` preserves existing valid links and protects profile roles/activation against direct client writes. Client deletion/recreation of profiles is no longer allowed.
- Firebase administrative auth tokens are no longer included in browser runtime configuration. Only `.env.example` is tracked; `.env.*` is ignored.
- Invalid uploads fail closed, require successful raster decoding and WebP conversion, and have a 40-million-pixel decoder limit.
- Nodemailer upgraded to a patched 9.x release; Sharp upgraded to 0.35.x. Production dependency audit reports zero known vulnerabilities at review time.
- CMS merges ignore prototype-related keys. Project deletions no longer resurrect bundled records.
- Project stage changes refresh on tab focus, CMS save notification, and every 30 seconds on visible project/home pages. Refresh bypasses stale server snapshots and preserves scroll position. Translation processing no longer references an out-of-scope variable.

## Verification

- Build and syntax checks.
- Offline integration tests: all five stage save/read/public round trips, invalid stage rejection, completion, anonymous/member/inactive access denial, CSRF and foreign-Origin denial, private-file denial.
- Browser tests: project stage changes from 03 to 04 without reloading; translations editor and HY/EN/RU stage rendering.
- Chat submission with mocked transport: correct older brief is submitted, existing contacts are reused, failed delivery allows retry, success requires delivery confirmation. No real test email sent.
- Live PostgreSQL: RLS enabled on profiles, team_members, projects, project_members, content_collections, media_assets and contact_messages. Direct authenticated role/activation modifications rejected; verification transaction rolled back. Account-security migration applied.

## Limits and follow-up

This is a targeted code, dependency and integration review, not a guarantee of complete security or an independent production penetration test. Historical access logs, all Git history, hosting dashboards, DNS and external provider configurations were not audited. Previous private-file exposure means server-held credentials should be rotated if an affected server was reachable by untrusted users; this review does not establish whether anyone accessed them. Dependency reports change over time.

Dependency advisories: [Nodemailer](https://github.com/advisories/GHSA-p6gq-j5cr-w38f), [Sharp/libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj).
