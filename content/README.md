# Public website snapshot

These are PUBLIC website data and assets intentionally versioned in Git, not a
database backup. No Auth users, password hashes, contact messages or private storage
are included. Supabase remains responsible for authentication and private profiles.

- public-site.json: public source modules plus the existing 19-project catalog.
- public-assets.json: 218 referenced public files, original URLs, bytes and SHA-256.
- Files live in img/ and src/assets/ at the same paths used by the website.
- Imported public bytes total 26,743,434; individual files are below 2 MB.
- One external decorative background returned 404 and uses the existing brand image;
  the manifest records the original failure and fallback.

Snapshot assembled on 2026-11-13. Project updated_at values are preserved. Live content
refresh returned 503: this is NOT fresh Supabase database extraction. Latest/unpublished
database edits require authorized source access.

Edit public inputs in src/content/ and lib/project-catalog.json, then run
`npm run import:public`. Existing local assets are preserved rather than overwritten.

Validation: `npm run test:cpanel` checks all asset hashes and local HTTP responses.
A separate browser check blocked every external request: 178 homepage image elements
loaded, zero broken images, 14 service images, zero JavaScript errors. No live deployment
is implied by this local test.
