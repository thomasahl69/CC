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

From this folder (the one containing `wrangler.toml` and `functions/`):

```bash
npx wrangler pages deploy
```

It's **`pages deploy`**, not `deploy`. `wrangler deploy` is the *Workers* command
and will fail with "Missing entry-point to Worker script or to assets directory" —
this project is a *Pages* project (it uses the `functions/` folder). You don't pass
a directory because `wrangler.toml` already sets `pages_build_output_dir = "."`.

The first run will ask to create a project (give it a name, e.g. `cc`). It uploads
the static pages **and** the `functions/` API together.

> Prefer the dashboard / GitHub? Create the project under **Workers & Pages →
> Create → Pages** (not Workers). Build command: none. Output directory: `/` (root).

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

Edit files, run `npx wrangler pages deploy` again. Database contents (submissions,
events, and your edited knowledge base) stay put — deploys don't touch the data.

**If a new version adds a table** (e.g. v1.1.0 added `events`), re-run the schema
once — it uses `CREATE TABLE IF NOT EXISTS`, so it only adds what's missing and
leaves your existing data alone:

```bash
npx wrangler d1 execute cc-db --remote --file=./schema.sql
```

## Troubleshooting

**"Missing entry-point to Worker script or to assets directory"**
You ran `wrangler deploy` (the Workers command). Use `npx wrangler pages deploy`
instead, from the folder that contains `wrangler.toml` and `functions/`. If a stray
empty Workers project got created, you can ignore or delete it — attach your D1
binding and secrets to the **Pages** project, not the Worker.

**Changes don't show up after deploy**
Hard-refresh (Ctrl/Cmd+Shift+R) or open an incognito window — browsers cache pages.
The version in the footer / admin login screen tells you which build is live.

**The site serves your docs publicly**
Because the output directory is the whole folder, files like `README*.md`,
`schema.sql`, and `wrangler.toml` are uploaded too. They're not security-critical
(real secrets live in Cloudflare, never in files), but if you'd rather not expose
them, keep only `index.html`, `admin.html`, the favicons, and `functions/` in the
deploy folder and move the docs elsewhere — or ask and I'll restructure the bundle.

## The automated AI response (now built)

The function `functions/api/respond.js` is live as `POST /api/respond`. When you
open a submission in the admin and click **Generate draft**, it:

1. loads that submission and your knowledge base from D1,
2. asks Claude (Anthropic API) to write a warm, on-brand reply grounded in your
   Framework + Layered Learning materials, and
3. saves the result into the submission's `ai_draft` column and shows it in the
   **Automated draft** slot, where you can read it and click **Append to reply**.

To turn it on, add your Anthropic API key as a secret:

```bash
npx wrangler pages secret put AI_API_KEY
# (paste your Anthropic API key from console.anthropic.com)
```

Optional — choose the model (defaults to `claude-sonnet-4-6`):

```bash
# Pages → Settings → Variables and Secrets → add a plain variable
AI_MODEL = claude-sonnet-4-6
```

Notes:
- The key lives only on the server; it is never sent to the browser.
- Only a logged-in admin can trigger a draft, so visitors can't spend your tokens.
- Drafts are suggestions for you to review and edit — nothing is sent automatically.
- For the current list of model names, see https://docs.claude.com/en/docs/about-claude/models.

## Security notes (still true, now improved)

- With this setup the admin password and the data live on the server, not in the
  page — a real improvement over the prototype. Keep `ADMIN_PASSWORD` and
  `SESSION_SECRET` private.
- The login uses an HttpOnly, Secure, signed cookie that expires after 12 hours.
- D1 access happens only inside the Functions, which require that cookie for all
  admin actions. The public can only **create** a submission, never read them.
