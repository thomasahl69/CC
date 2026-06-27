# Changelog

All notable changes to the Authentic Joy in the Journey site (CC).
Versions follow `MAJOR.MINOR.PATCH` — bump PATCH for fixes, MINOR for new
features, MAJOR for big/breaking changes.

The version shows in three places: this file, the `VERSION` file, the
`<meta name="version">` tag in each page, and the label next to "Content Studio"
in the admin top bar. Update all of them together when you cut a new version.

## v1.7.0 — 2026-06-27

- **Team photos** for the conference page (Christina & Kelly) can now be uploaded
  or replaced from Content Studio → Gallery tab → "Team photos." Each has Upload
  and "Use monogram" options; the conference page shows the photo or a tasteful
  monogram fallback.
- Stored in the existing `content` table via `GET/PUT /api/team` — no database
  migration needed.

## v1.6.0 — 2026-06-27

- **Image uploads (drag-and-drop).** Event images and gallery images can now be
  uploaded straight from your computer instead of only pasting links.
  - Event editor: an **Upload** button next to the image field.
  - Gallery: an **Upload images** button (pick several at once) and **drag-and-drop**
    files onto the gallery area.
- Uploaded files are stored in Cloudflare **R2** and served back through the site
  at `/api/file/<key>`, so the bucket doesn't need to be public.
- New functions: `POST /api/upload` (admin) and `GET /api/file/:key` (public).

### Setup for this version
Create an R2 bucket named `cc-media` and bind it as `BUCKET` (see
DEPLOY-cloudflare.md §4b). Pasting image links still works without R2; only the
Upload buttons need it.

## v1.5.0 — 2026-06-27

- New **Gallery** manager in Content Studio: add, caption, reorder (arrows), and
  remove the highlight photos that appear on the Bloom & Blossom Conference page.
  Each image has a live preview. Includes an "Import the original highlight photos"
  button to start from the six that were on the page.
- The conference page gallery now loads from this manager (`/api/gallery`), falling
  back to the originals if the backend isn't reachable.
- Adds a `gallery` table to the database.

### Migration for this version
Run once in the D1 console:
```
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  url TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(sort_order);
```

## v1.4.1 — 2026-06-27

- Fixed the conference page highlights gallery: a quote-escaping bug in the image
  fallback was leaking stray `">` characters between photos. Rebuilt it to render
  cleanly.

## v1.4.0 — 2026-06-27

- Version number moved to the **top-left** (next to the logo) on the home and
  conference pages, instead of the footer.
- New **Newsletter CSV** export in the admin (Submissions tab): downloads a
  de-duplicated list of names and emails from all signups (questionnaire and
  contact form), with source and date. Opens in Excel/Google Sheets.
- Renamed the submissions JSON buttons to **Backup** / **Restore** for clarity
  (the CSV is the one for your newsletter tool).

## v1.3.0 — 2026-06-27

- New **Bloom & Blossom Conference** page (`bloom-and-blossom.html`): about/heart,
  "is this you" checklist, FAQ accordion, highlights gallery, meet-the-team bios,
  and upcoming dates pulled from the events API. Linked from the home nav.
- **Event images**: events now have an image (managed in the admin Events editor
  with a live preview). Images show on the home events list and the conference
  page. Adds an `image` column to the `events` table.
- Home page social links: real Facebook profile added, plus an X/Twitter share
  link. (There's no standalone Twitter/X account — only a share link existed on the
  original site — so the X icon shares the page rather than linking a profile.)

### Migration for this version
Existing databases need the new column (run once in the D1 console):
```
ALTER TABLE events ADD COLUMN image TEXT;
```

## v1.2.1 — 2026-06-27

- Saving an event now reports the real reason if it fails (e.g. a missing `events`
  table) instead of a generic "could not create" message.

## v1.2.0 — 2026-06-27

- The admin now **stays logged in**: on load it checks for a valid session and
  skips the password screen instead of prompting every time.
- Session length is now **30 days by default** (was 12 hours) and configurable via
  an optional `SESSION_HOURS` variable.
- Added a `GET /api/session` endpoint used for the auto-resume check.
- "Lock" still ends the session immediately when you want to sign out.

## v1.1.2 — 2026-06-27

- Admin login now trims surrounding whitespace from the password and the stored
  `ADMIN_PASSWORD` secret before comparing, so an accidental trailing newline or
  space (a common secret-setting mistake) no longer blocks login.

## v1.1.1 — 2026-06-27

- Admin login now shows the *real* reason a login fails (e.g. "Server is missing
  ADMIN_PASSWORD" vs "Incorrect password") instead of always saying "Incorrect
  password" — makes setup problems obvious.

## v1.1.0 — 2026-06-27

- New **Events** manager in the admin: add/edit/delete upcoming events with
  topic, date & time, location, cost, and description.
- Events are stored in a new D1 `events` table (`functions/api/events/`).
- The public site's "Upcoming Gatherings" section now loads from the database:
  events dated today or later show automatically and are sorted by date; past
  events drop off the public site but remain in the admin as history.
- Requires running the updated `schema.sql` once to create the `events` table.

## v1.0.0 — 2026-06-27

First tracked release. Everything built so far:

- Rebuilt public site (`index.html`): responsive, botanical brand, hero, story,
  the two spaces, events, offerings, testimonials, newsletter/contact, footer.
- Real photos and brand favicon set.
- Pop-out reflection questionnaire (4 questions + name, email, phone, preferred
  contact).
- Private admin (`admin.html`): password gate, **Content** tab (the AI knowledge
  base — The Framework + The Art of Layered Learning) and **Submissions** tab
  (read, set status, respond).
- Cloudflare backend (`functions/`) + D1 database (`schema.sql`): forms and admin
  data store on the server. Public can create submissions; admin actions require
  login (signed, HttpOnly cookie).
- Automated AI draft responses (`functions/api/respond.js`) via the Anthropic API,
  grounded in the knowledge base, shown in the admin's "Automated draft" slot with
  Generate / Append actions.
- Fixed the invisible "Register" button (contrast).

## How to bump the version next time

1. Edit `VERSION`, the `<meta name="version">` in `index.html` and `admin.html`,
   and `APP_VERSION` in `admin.html`'s script.
2. Add a new dated section at the top of this file describing what changed.
