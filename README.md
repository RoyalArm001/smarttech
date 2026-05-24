# Smart Tech Website

## Run

```bash
npm run dev
```

Default URL:

- `http://localhost:3000/`

If port 3000 is busy, the server will automatically try the next available port between 3000 and 3010.

`npm run web` is reserved for cloud/static builds and creates the `dist/` folder.

## Notes

The local admin interface has been removed. Edit website content directly in `web/src/content` and `web/pages`.

## Check

```bash
npm run check
```

This validates the main Node and client-side JavaScript files for syntax errors.

## Deploy

For Node.js cloud hosting, deploy the whole project root and run:

```bash
npm start
```

For a purely static host, deploy the `web/` folder.

For Vercel or Cloudflare Pages, use exactly:

- Build command: `npm run web`
- Output directory: `dist`
- Node version: 18 or newer
- Start command: leave empty

After build, the hosting platform must publish `dist/`, not the project root and not `web/`.

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
