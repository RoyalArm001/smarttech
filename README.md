# Smart Tech Website

**Smart Tech LLC** — պաշտոնական վեբկայք  
**Domain:** [smarttechllc.am](https://smarttechllc.am)

---

## Նպատակ

Այս նախագիծը նախատեսված է **Smart Tech LLC**-ի պաշտոնական ընկերության կայքի համար՝ ընկերության ծառայությունները, նախագծերը, թիմը և կոնտակտային տվյալները ներկայացնելու, հաճախորդներին խորհրդատվություն տրամադրելու և ընկերության բրենդը առցանց արտահայտելու համար։

## Հեղինակային իրավւնք և գաղտնիություն

© **Smart Tech LLC**. Բոլոր իրավւնքները պաշտպանված են։

- Այս կայքի **կոդը**, **վիզուալ տեսքը**, **տեքստերը**, **նկարները**, **լոգոները** և **բրենդային տարրերը** պատկանում են Smart Tech LLC-ին։
- **Արգելվում է** կայքը, դրա մասերը կամ կոդը **պատճենել**, **գողանալ**, **վերաօգտագործել**, **վերհրապարակել**, **վաճառել** կամ **տարածել** առանց Smart Tech LLC-ի **գրավոր թույլտվության**։
- Այս repository-ն **գաղտնի** է և նախատեսված է միայն Smart Tech LLC-ի ներքին օգտագործման և պաշտոնական deploy-ի համար։
- Չթույլատրվող օգտագործման դեպքում Smart Tech LLC-ն իրավւնք է պահպանելու իրավական պաշտպանության բոլոր միջոցներով։

## Օգտագործված գործիքներ և տեխնոլոգիաներ

| Ոլորտ | Գործիք / տեխնոլոգիա |
|---|---|
| Frontend | Vanilla JavaScript, HTML, CSS |
| Backend | Node.js, Express |
| Build | `npm run web` → `dist/` |
| Deploy | Vercel, Cloudflare Pages, GitHub Pages |
| Dev | `npm run dev`, `Start SmartTech.cmd` |

---

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

This is a mostly static website served by Node.js.  
Edit website content directly in `src/content` and `pages`.  
Կայքի ներքին ինտեգրացիաները և backend-ի մանրամասները README-ում **չեն հրապարակվում** (տես Deploy → «Կարգավորում»)։

## Check

```bash
npm run check
```

This validates the main Node and client-side JavaScript files for syntax errors.

## CMS (Content Management)

Admin/CMS-ը նախատեսված է **միայն Smart Tech LLC-ի լիազոր աշխատակիցների** համար։
Կազմակերպության, API-ների և պահեսպանքի մանրամասները public README-ում **չեն հրապարակվում**։

### Open admin (ներքին օգտագործում)

1. Run the site with Node: `npm run dev`
2. Open admin panel on local server
3. Log in with the server admin password (see `.env.example`, not for public disclosure)

Default content remains in `src/content/` as the safe fallback.

## Internal services

Կայքում կարող են գործել լրացուցիչ ներքին գործիքներ։
Դրանց կարգավորումը, API key-երը, environment variable-երը և իրականացման մանրամասները **գաղտնի** են և կարգավորվում են միայն `.env` / host panel-ում՝ Smart Tech LLC-ի ներքին deploy-ի ժամանակ։

## Deploy

For Vercel or Cloudflare Pages, use exactly:

- Build command: `npm run web`
- Output directory: `dist`
- Node version: 20 or newer
- Start command: leave empty

After build, the hosting platform must publish `dist/`, not the project root.

### Automatic GitHub deployment

This repository includes GitHub Actions workflows that will automatically:

- verify the site builds on every push and pull request to `main`
- build the static site and publish `dist/` to GitHub Pages from `gh-pages`

If you create a GitHub repository for this project and push the `main` branch, the workflow will produce the `gh-pages` branch automatically.

To use GitHub Pages:

1. Create the GitHub repo and push this project.
2. In repository settings, enable GitHub Pages and select the `gh-pages` branch at the root.

### Vercel (recommended)

This repo includes `vercel.json` — connect GitHub to Vercel and deploy with defaults:

| Setting | Value |
|---|---|
| Framework | Other |
| Build command | `npm run web` |
| Output directory | `dist` |
| Install command | `npm install` |
| Node.js | 20.x |

**Domains in Vercel**

1. Add `smarttechllc.am` as primary domain
2. Add `www.smarttechllc.am` as alias (redirect to apex is configured in `vercel.json`)

**Կարգավորում**

Կայքի ներքին կառուցվածքը, ինտեգրացիաները, API-ները, environment variable-ները և այլ գաղտնի մանրամասները **չեն բացահայտվում** այս README-ում։
**Արգելվում է** հրապարակել, թե ինչ ծառայություններ, գործիքներ կամ server-side գործառույթ է աշխատում կայքի ներսում։

Deploy-ի համար բավարար է հետևել հիմնական կարգավորմանը։

| Setting | Value |
|---|---|
| Build command | `npm run web` |
| Output directory | `dist` |

Environment variable-ները, host-ի լրացուց կարգավորումը և ներքին deploy-ի քայլերը կարելի են `.env.example`-ում և Smart Tech LLC-ի **ներքին** documentation-ում։ Public repository-ում այդ տվյալները **չեն թողարկվում**։

### Cloudflare Pages

- Build command: `npm run web`
- Output directory: `dist`

GitHub-ին push-ից հետո host-երը կարող են ավտոմատ deploy անել, առանց կայքի ներքին մանրամասները public փաստաթղթավորելու։

## Custom Domain

If you want a real domain:

1. Buy a domain from any registrar.
2. In Vercel or Cloudflare Pages, add the custom domain to the project.
3. Update your domain DNS records to the provider’s nameservers or CNAME/A records.
4. Wait for DNS to propagate and verify the domain inside the host dashboard.

For GitHub Pages, set the custom domain in repository Pages settings and add a `CNAME` file or DNS record as GitHub instructs.

## Single Source Rule

All editable website code lives at the project root:

- HTML pages: `pages/*.html`
- JS logic: `src/**/*.js`
- Styles: `src/**/*.css`
- Images: `img/**`
- Team assets: `src/assets/team/*`

Do not edit files inside `dist/` — that folder is generated by `npm run web`.

## Quick Edit Map

- Navigation/menu: `src/sections/header/index.js`
- Home page blocks: `src/sections/home/index.js`
- Services data: `src/content/services/index.js`
- Projects data: `src/content/projects/index.js`
- Team data: `src/content/team/index.js`
- Contact data/social links: `src/content/contacts/index.js`
- Languages/texts: `src/content/locales/index.js`

**Safe workflow:** edit one file → `npm run dev` → verify that section → continue. Do not duplicate logic across modules.

## Project layout

```
SmartTech/
├── pages/          # HTML entry files (index, services, project, …)
├── src/            # Frontend: sections, content, styles, core
├── img/            # Public images
├── admin/          # Admin panel + CMS (everything admin-related)
│   ├── index.html, panel.js, cms-editor.js, panel.css
│   ├── cms-store.js
│   └── data/       # Runtime storage (local server only)
│       ├── cms/    # CMS content overrides
│       └── album.json
├── lib/            # Build & SEO (build-static, apply-seo, seo-config)
├── tools/          # Dev helpers (start-local.js)
├── api/            # Vercel serverless entry only (see api/README.md)
├── server.js       # Node server + all /api/* routes
├── dist/           # Generated by npm run web — do not edit
├── robots.txt, sitemap.xml, manifest.json, _redirects
└── vercel.json
```

## CMS / Admin / API

| Area | Path | Role |
|---|---|---|
| Admin (all-in-one) | `admin/` | UI (`/admin`), CMS store, album/settings data |
| CMS overrides | `admin/data/cms/` | JSON overrides merged into site content |
| Public CMS merge | `src/core/cms-merge.js` | Applies `GET /api/content` on the client |
| HTTP API logic | `server.js` | `/api/content`, `/api/admin/*`, chat, forms |
| Vercel bridge | `api/[...path].js` | Required at repo root by Vercel — forwards to `server.js` |

**Removed / not part of the site:** `docs/` (merged into this README), `functions/` (legacy Cloudflare translate), root `data/` (moved into `admin/data/`).
