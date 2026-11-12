# Smart Tech: PostgreSQL/Supabase → MySQL/cPanel

Status on 2026-11-12: **deployment preparation in progress; production export/import NOT performed.**

Update: public-only Admin closure and Node.js 22.23.4 module startup have passed local
HTTP smoke tests. A reproducible cPanel staging package is available; see
`../CPANEL-VALIDATION.md`. Supabase runtime dependencies are still present. This is
NOT a completed MySQL migration, and actual cPanel hosting has not been tested.

Source checkout: `597d976`, isolated branch `codex/mysql-cpanel-migration`.
Target: Node.js **22**, MySQL (exact server version/collation to be verified), cPanel.
Existing production site, Supabase and DNS remain unchanged. Source publication on
the migration branch does not constitute a verified database migration or cutover.

## Confirmed blockers

- Previous `E:\smarttech-main` checkout and its private `.env` are unavailable.
- No source service-role/database credentials or target MySQL credentials in the process environment.
- Host Node is 24.19.0. The encryption fixture suite passed on an isolated Node 22
  runtime via `npx --yes --package=node@22 node --test scripts/backup-crypto.test.cjs`.
  Node 22.23.4 dependency installation, build and public HTTP smoke tests subsequently
  passed on 2026-11-12. Live database/authenticated workflows are still unverified.
- No `pg_dump`/`mysql` CLI found; Docker is installed but its engine is unavailable.
- Repository SQL files disagree: project/member IDs are text in one schema, UUID in
  another; `services`, `project_files`, and `user_profiles` also appear in alternate
  schemas. The LIVE PostgreSQL catalog must decide the MySQL schema, not a guessed SQL conversion.

## Source audit from application code (not live database confirmation)

- Main server accesses `profiles`, `team_members`, `projects`, `content_collections`,
  `media_assets`, and `contact_messages`; SQL additionally defines membership/file tables.
- Auth uses password login, token verification, user profile ownership, active-account
  and admin role checks, password changes, employee linking and admin user CRUD.
- PostgreSQL role-protection triggers/RLS enforce ownership and prevent self-promotion.
  MySQL has no equivalent Supabase auth.uid()/RLS mechanism; explicit API authorization
  and deny-by-default tests are required on every route, including file downloads.
- Storage uploads, deletes, public URLs and image transformations must move to local
  storage. Public bucket files and private documents require different access handling.
- Runtime configuration, stored absolute Supabase URLs, image redirects, auth session
  formats, content cache and Vercel serverless routes must all be migrated.
- SMTP and AI services remain separate external integrations unless separately replaced.

## Work sequence and acceptance gates

1. Read-only live inventory: every non-system schema, table (including auth/storage),
   column/type, sequence, key, index, constraint, function, trigger, RLS policy, role,
   grant, extension, view/materialized view, publication and scheduled job.
2. Consistent PostgreSQL dump with roles/grants and snapshot row counts. Enumerate ALL
   buckets and object pages, including private files; stream bytes into authenticated
   encrypted archives. Record sizes and SHA-256 hashes in the encrypted manifest.
   List objects again to detect concurrent changes; do not label a changing capture
   consistent. Plan a final user-coordinated write freeze/delta pass at cutover.
3. Audit auth.users hashes/identities, MFA/OAuth providers, email verification and
   recovery workflows. Preserve IDs and compatible password hashes; explicitly report
   unsupported factors. Never reuse Supabase signing secrets or blindly trust its old
   JWTs in the new backend. Decide session invalidation/relogin before cutover.
4. Generate reviewed MySQL schema from the LIVE catalog. Preserve UTF-8, IDs, numeric
   precision, JSON/array semantics, timestamp instants and source precision. Document
   explicit replacements for PostgreSQL-only functions, extensions and policies.
5. Split the application into frontend/ and backend/{routes,controllers,middleware,config};
   add database/{schema.sql,migrations,seed,import.js,restore.js}, storage/ and scripts/.
   Preserve existing frontend behavior and API contracts. Migration export tools may
   use PostgreSQL; the running app must have no Supabase client or endpoint dependency.
6. Restore into a verified EMPTY MySQL schema and isolated storage directory. Validate
   normalized row hashes, counts, foreign keys, uniqueness and every file hash/reference.
   Do not use disabled constraints as a substitute for relationship validation.
7. Exercise auth/session lifecycle, cross-account access denials, inactive accounts,
   admin CRUD, content, uploads/downloads/deletes, MIME/path checks and public pages.
   Repeat a clean restore using only Git/LFS artifacts plus the external key/env.
8. Deploy Node 22 to cPanel staging: configure application root/startup file/environment,
   private storage outside document root, MySQL permissions, TLS and restart procedure.
   Verify health and logs before DNS cutover. Keep Supabase and the Vercel deployment
   available for rollback; define reconciliation for writes made after cutover.

## Evidence required before marking complete

Encrypted export inventory, verified archive authentication, live source and restored
counts/hashes, file inventories/hashes, relationship validation, permission test matrix,
Node 22 test output, clean-clone restoration results and cPanel staging checks.
None of these production migration results exists yet. Local encryption fixture tests
are not a database export and do not establish successful migration.

## Work completed locally

- AES-256-GCM streaming archive encryption and authentication, external key generation,
  refusal to overwrite files, and Git ignore rules for plaintext backup material.
- Fixture verification on Node 22: empty, one-byte and 1 MiB files; wrong key,
  corrupted authentication tag, truncated archive and overwrite rejection.
- Removed the legacy `test-openai.mjs` from this migration checkout because it contains
  a hardcoded credential. This does not revoke the credential or remove it from old
  Git commits. Credential revocation/history remediation is still outstanding; no
  history rewrite or force-push has been performed.

## References

- https://supabase.com/docs/guides/self-hosting/restore-from-platform
- https://docs.cpanel.net/cpanel/software/application-manager/
- https://docs.cpanel.net/knowledge-base/web-services/using-passenger-applications/
