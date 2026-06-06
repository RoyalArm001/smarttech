# Vercel API entry

This folder exists **only** because Vercel requires serverless functions at the repository root under `api/`.

- `api/[...path].js` — forwards all `/api/*` requests to `server.js`
- All route logic lives in **`server.js`** at the project root
- Admin/CMS code and data live in **`admin/`**

Do not add business logic here unless Vercel’s folder layout forces it.
