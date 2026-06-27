# Deploying to Cloudflare Pages + D1

This is the answer to "do I need to create a D1?" — **yes.** D1 is Cloudflare's
serverless database, and it's what makes the forms and admin store on the server
instead of in one browser. Below is the whole setup, start to finish.

You only do steps 1–7 once. After that, updates are just "upload again."

## What stores where

- **Questionnaire + contact form** → `submissions` table in D1.
- **Admin knowledge base** (The Framework, Layered Learning, anything you add) →
  `content` table in D1.
- **Admin login** → checked against a secret called `ADMIN_PASSWORD`.
- The site keeps a **local fallback**: if it can't reach the server (e.g. you open
  the file directly, or before deploy), it uses the browser like before. Once
  deployed on Cloudflare, it uses D1 automatically — no code change needed.

## Prerequisites

- A free Cloudflare account.
- Node.js installed. You'll use `npx wrangler ...` (no global install needed).
- All the files in this folder kept together, including `functions/`,
  `wrangler.toml`, and `schema.sql`.

## 1. Create the D1 database

> **Already done for you.** Your database `cc-db`
> (`07f3d742-77a0-4918-b5a1-eeb6fe0652d1`) is already filled into `wrangler.toml`.
> If you ever recreate it, run the command below and paste the new id.

```bash
npx wrangler d1 create cc-db
```

It prints a `database_id`. Open `wrangler.toml` and paste it in place of the id
that's there.

## 2. Create the tables

```bash
npx wrangler d1 execute cc-db --remote --file=./schema.sql
```

## 3. Create the Pages project and deploy

From this folder:

```bash
npx wrangler pages deploy .
```

The first run will ask to create a project (give it a name, e.g. `cc`). It uploads
the static pages **and** the `functions/` API together.

> Prefer the dashboard / GitHub? You can instead connect this folder as a repo in
> **Cloudflare Pages → Create application → Pages**. Build command: none. Output
> directory: `/` (root).

## 4. Bind the D1 database to the site

If you deployed with `wrangler pages deploy` and the `[[d1_databases]]` block in
`wrangler.toml` is filled in, this is already done. To set/confirm it in the
dashboard: **Pages project → Settings → Functions → D1 database bindings** →
add binding **Variable name: `DB`**, **Database: `cc-db`**.

## 5. Set the secrets

```bash
npx wrangler pages secret put ADMIN_PASSWORD
# (type the admin password when prompted)

npx wrangler pages secret put SESSION_SECRET
# (paste any long random string — used to sign the login cookie)
```

Dashboard alternative: **Settings → Variables and Secrets → add**, and mark them
**Encrypted**.

## 6. Redeploy if needed

Secrets/bindings apply on the next deploy:

```bash
npx wrangler pages deploy .
```

## 7. Try it

- Visit your site, open the questionnaire, submit it.
- Go to `/admin.html`, log in with your `ADMIN_PASSWORD`.
- Open the **Submissions** tab — your test entry is there, served from D1.
- The top banner now reads "Connected to your database."
- The first admin login seeds The Framework + Layered Learning into the `content`
  table automatically.

## Updating later

Edit files, run `npx wrangler pages deploy .` again. Database contents (submissions
and your edited knowledge base) stay put — deploys don't touch the data.

## How the AI engine will plug in (next step)

When you're ready for the automated response:

1. Add one function, e.g. `functions/api/respond.js`, that runs after a submission
   (or on a button in the admin).
2. It reads the `content` table (your knowledge base), sends it plus the mom's
   answers to the AI model, and writes the result into that submission's
   `ai_draft` column.
3. The admin already has the **Automated draft** slot waiting to show it.

The model's API key would be another secret (e.g. `AI_API_KEY`) set the same way in
step 5 — so it lives only on the server, never in the page.

## Security notes (still true, now improved)

- With this setup the admin password and the data live on the server, not in the
  page — a real improvement over the prototype. Keep `ADMIN_PASSWORD` and
  `SESSION_SECRET` private.
- The login uses an HttpOnly, Secure, signed cookie that expires after 12 hours.
- D1 access happens only inside the Functions, which require that cookie for all
  admin actions. The public can only **create** a submission, never read them.
