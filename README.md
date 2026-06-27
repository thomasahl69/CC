# Authentic Joy in the Journey — website bundle (CC)

Christina Carpenter's site, now with a real server backend (Cloudflare Pages + D1)
so forms and admin data are stored on the server, not in a single browser.

## Folder layout

```
CC/
├── index.html              Public website (responsive)
├── admin.html              Private admin (login, content + submissions)
├── schema.sql              D1 database tables
├── wrangler.toml           Cloudflare config (paste your D1 id here)
├── functions/              The server API (Cloudflare Pages Functions)
│   └── api/
│       ├── _lib.js         shared helpers (auth, json)
│       ├── login.js        POST /api/login
│       ├── logout.js       POST /api/logout · GET session check
│       ├── content.js      GET/PUT /api/content   (knowledge base)
│       └── submissions/
│           ├── index.js    POST (public submit) · GET (admin list)
│           └── [id].js      PATCH/DELETE (admin update/remove)
├── favicon.ico, favicon-*.png, favicon.avif, apple-touch-icon.png
├── README.md               this file
├── README-admin.md         how the admin works + the JSON the AI uses
└── DEPLOY-cloudflare.md     step-by-step: create the D1 and go live
```

Keep every file together and keep the `functions/` folder exactly where it is —
Cloudflare turns it into the API automatically.

## Two ways it runs

- **Deployed on Cloudflare Pages with D1** → forms and admin read/write the
  database. Submissions from any visitor land in the admin. Content is shared
  across devices and available to the AI engine. This is the real setup.
- **Opened directly / before deploy / in a preview** → it falls back to the
  browser's local storage so you can still click around. Nothing breaks; it just
  isn't shared. No code change needed to switch — it detects the server.

## Go live

Follow **DEPLOY-cloudflare.md**. Short version:

1. `npx wrangler d1 create cc-db` → paste the id into `wrangler.toml`
2. `npx wrangler d1 execute cc-db --remote --file=./schema.sql`
3. `npx wrangler pages deploy`
4. Set secrets `ADMIN_PASSWORD` and `SESSION_SECRET`
5. Confirm the `DB` binding → redeploy → log in at `/admin.html`

## Default admin password (local-fallback only)

`bloom2025` is the local fallback password used when there's no server. Once
deployed, the real password is the `ADMIN_PASSWORD` secret you set in step 4.

## What's next

- Connect the AI response engine so the **Automated draft** slot fills in
  (outline at the end of DEPLOY-cloudflare.md).
- Optional: auto-expiring events section (the note found in The Framework doc).
