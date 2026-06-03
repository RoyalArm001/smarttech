# Smart Tech Website

## Run

On Windows, double-click:

```text
Start SmartTech.cmd
```

It stops old SmartTech local server processes, starts the site, and opens the browser automatically.

```bash
npm run dev
```

Default URL:

- `http://localhost:3000/`

If port 3000 is busy, the server will automatically try the next available port between 3000 and 3010.

`npm run web` is reserved for cloud/static builds and creates the `dist/` folder.

## Notes

This is a mostly static website served by Node.js. The AI chatbot uses the `/api/chat` backend route.
Edit website content directly in `web/src/content` and `web/pages`.

## Check

```bash
npm run check
```

This validates the main Node and client-side JavaScript files for syntax errors.

## AI Chatbot

The Gemini chatbot is server-only and requires a Node/Express runtime.

Required server env var:

- `GEMINI_API_KEY`

Optional env var:

- `GEMINI_MODEL=gemini-2.5-flash`

Never expose the Gemini key in frontend JavaScript. Static-only hosts can publish the site, but `/api/chat` needs a Node server or an equivalent serverless function.

## Visit Counter

The visit counter is read from Firebase Realtime Database during page load.

Optional cloud build env vars:

- `SMARTTECH_FIREBASE_DATABASE_URL`
- `SMARTTECH_FIREBASE_STATS_PATH`
- `SMARTTECH_FIREBASE_AUTH_TOKEN` only if your Firebase rules require it

For a static website, the safest setup is a Firebase rule that allows public read/write only for this one counter node.

Current default path:

```text
BlogID_201588890086708935/PostID_WebsiteStats
```

## Deploy

For Vercel or Cloudflare Pages, use exactly:

- Build command: `npm run web`
- Output directory: `dist`
- Node version: 20 or newer
- Start command: leave empty

After build, the hosting platform must publish `dist/`, not the project root and not `web/`.

### Automatic GitHub deployment

This repository includes GitHub Actions workflows that will automatically:

- verify the site builds on every push and pull request to `main`
- build the static site and publish `dist/` to GitHub Pages from `gh-pages`

If you create a GitHub repository for this project and push the `main` branch, the workflow will produce the `gh-pages` branch automatically.

To use GitHub Pages:

1. Create the GitHub repo and push this project.
2. In repository settings, enable GitHub Pages and select the `gh-pages` branch at the root.

### Vercel and Cloudflare Pages

For Vercel:

- Build command: `npm run web`
- Output directory: `dist`
- Start command: leave empty

For Cloudflare Pages:

- Build command: `npm run web`
- Output directory: `dist`

Once the project is pushed to GitHub, both hosts can deploy automatically from the repo.

## Google Analytics

This project now includes a placeholder GA4 loader in `web/src/main.js`.

- Replace `G-XXXXXXXXXX` with your real Google Analytics measurement ID.
- The script will load automatically and send a page view for each page render.
- If you need more advanced tracking, you can extend `trackGoogleAnalyticsPageView()` in `web/src/main.js`.

## Custom Domain

If you want a real domain:

1. Buy a domain from any registrar.
2. In Vercel or Cloudflare Pages, add the custom domain to the project.
3. Update your domain DNS records to the provider’s nameservers or CNAME/A records.
4. Wait for DNS to propagate and verify the domain inside the host dashboard.

For GitHub Pages, set the custom domain in repository Pages settings and add a `CNAME` file or DNS record as GitHub instructs.

## Single Source Rule

All editable website code is in `web/`.

- HTML pages: `web/pages/*.html`
- JS logic: `web/src/**/*.js`
- Styles: `web/src/**/*.css`
- Team assets: `web/src/assets/team/*`

If you update content/design, change files only inside `web/`.

## Quick Edit Map

- Navigation/menu: `web/src/sections/header/index.js`
- Home page blocks: `web/src/sections/home/index.js`
- Services data: `web/src/content/services/index.js`
- Projects data: `web/src/content/projects/index.js`
- Team data: `web/src/content/team/index.js`
- Contact data/social links: `web/src/content/contacts/index.js`
- Languages/texts: `web/src/content/locales/index.js`

Detailed guide: `web/docs/EDIT-GUIDE.md`
