# Smart Tech Editing Guide

This project is organized for independent updates: each feature has its own file.

## 1) Main Structure

- `web/pages/*.html`  
  Page entry files (`index.html`, `services.html`, `project.html`, etc.).

- `web/src/content/*`  
  Data/content layer (texts, services list, team members, contacts, partners).

- `web/src/sections/*`  
  UI sections/components (header, hero, services grid, project cards, team, contact, footer).

- `web/src/core/*`  
  Shared utilities (`utils.js`, i18n logic, namespace).

- `web/src/styles/*`  
  Global styles.

## 2) What To Edit (Fast)

- Change menu structure/look:  
  `web/src/sections/header/index.js`  
  `web/src/sections/header/header.css`

- Change homepage content/UI blocks:  
  `web/src/sections/home/index.js`  
  `web/src/sections/home/home.css`

- Change services:  
  `web/src/content/services/index.js`

- Change projects and galleries:  
  `web/src/content/projects/index.js`

- Change team members/social/certificates:  
  `web/src/content/team/index.js`

- Change phone/email/address/social links:  
  `web/src/content/contacts/index.js`

- Change Armenian/Russian/English texts:  
  `web/src/content/locales/index.js`

## 3) Safe Update Workflow

1. Update only one target file (or one small area).
2. Run local server: `npm run web`.
3. Open site and verify only that section changed.
4. Then move to next section.

## 4) Important Rule

Do not duplicate logic in multiple places.  
If one feature changes, update only its own module file in `web/src/...`.
