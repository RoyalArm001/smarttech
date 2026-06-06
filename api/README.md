# Vercel API entry

This folder exists **only** because Vercel requires serverless functions at the repository root under `api/`.

- `api/[...path].js` — forwards all `/api/*` requests to `server.js`
- All route logic lives in **`server.js`** at the project root
- Admin UI lives in **`admin/`**; server-side CMS code stays out of **`dist/admin/`**

This project is **not Next.js**. Use script tags for Vercel Analytics/Speed Insights (see `lib/seo-config.js`), not `@vercel/*/next` imports.

Do not add business logic here unless Vercel’s folder layout forces it.
