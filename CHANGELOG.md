# Changelog

All notable changes to the Authentic Joy in the Journey site (CC).
Versions follow `MAJOR.MINOR.PATCH` — bump PATCH for fixes, MINOR for new
features, MAJOR for big/breaking changes.

The version shows in three places: this file, the `VERSION` file, the
`<meta name="version">` tag in each page, and the label next to "Content Studio"
in the admin top bar. Update all of them together when you cut a new version.

## v1.16.0 — 2026-06-27

- **Site-wide update tying the new pages and concepts together.**
  - Home page now features a **Guided Journeys** section (the Compass Guide, the five
    parks, rabbit trails, and the field-plate artwork) with calls to action into the
    journey and the resources shelf.
  - **Consistent navigation** across the whole site: Home, Journeys, Resources, and
    Conference now cross-link from every page's header, and the home footer gained a
    "Journeys" column (Guided Journeys, Rabbit Trails, Resources, Bloom & Blossom).

## v1.15.0 — 2026-06-27

- **Field plate illustration** (`parks-plate.svg`) — an original artwork in the style
  of Adolphe Millot's vintage natural-history plates: the five parks drawn as
  labeled "specimens" on aged parchment, with botanical accents (fern, feather,
  pinecone, oak, songbird) and a title cartouche. Featured on the Guided Journeys
  page as "A Field Plate," with a download button.

## v1.14.0 — 2026-06-27

- **Amazon store + media list, tied into the journey.**
  - New **Resources** manager in Content Studio: curate books/read-alouds/supplies
    with title, author, category, image (upload or link), Amazon affiliate link, a
    note, and a **park tag**. Plus store settings for your Amazon **storefront URL**
    and the affiliate **disclosure** text.
  - New public **Resources page** (`resources.html`) — Christina's shelf, filterable
    by category and park, with a "Visit Christina's Amazon store" button and the
    required Associates disclosure. Affiliate links use `rel="sponsored nofollow"`.
  - **Journey tie-in:** each park result now shows "Provisions for the trail" —
    resources tagged to that park (or to everyone) — with a link to the full shelf.
  - Linked from the home nav as "Resources."

### Migration for this version
Run once in the D1 console:
```
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
  title TEXT, author TEXT, note TEXT, image TEXT, url TEXT,
  category TEXT, park TEXT, sort_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_resources_order ON resources(sort_order);
```
(Store settings reuse the existing content table — no other change.)

## v1.13.0 — 2026-06-27

- **Rabbit Trails** added to Guided Journeys — short, delightful detours off the main
  trail that honor curiosity-led learning. First one built: **Bible Weekly**, with
  eight weekly topics (God is Creator, Good, Faithful, Love, Provider, Refuge, Light,
  Keeps His Promises). Pick a week to see an anchor verse plus a supporting verse
  reference and short prompt for each day; the current calendar week is flagged
  "This week." References only (read in your own translation) — framework is ready
  for more rabbit trails (nature study, artist study, hymn a week).

## v1.12.0 — 2026-06-27

- **Illustrated trail map** on the Guided Journeys result. Each park now renders as
  a themed map (mountains, coast, or canyon terrain tinted to the park, with a
  winding trail and compass rose) and the viewing points appear as **numbered pins
  plotted along the trail**. Tapping a pin jumps to that stop; pins recolor live to
  match how each stop is painted (on path / maybe later / set aside), with a legend.

## v1.11.0 — 2026-06-27

- **Guided Journeys — "paint your own masterpiece."** The trail is now something
  each parent shapes rather than follows:
  - New Compass Guide question — "how do you like to travel?" (a clear path / wander
    and veer / a bit of both) — that tunes the tone of the result.
  - Each viewing point can be marked **On my path / Maybe later / Not for us**, so
    parents curate their own version of the trail; a running "your painted trail"
    summary reflects it.
  - Permission-to-wander language throughout, plus a nudge to borrow viewing points
    from other parks. Travel style and painted choices are included in the compass
    submission Christina receives.

## v1.10.0 — 2026-06-27

- **New page: Guided Journeys** (`journeys.html`) — a national-park-themed
  onboarding experience. A **Compass Guide** intake (journey stage, child age,
  crew size, longings, values, and philosophy) matches each parent to a **park**
  built for where they are, shown as a **trail with viewing points** they can enter
  or exit at any stage.
  - Two parks fully built per the concept — **Yellowstone** (wonder & foundations,
    ages 4–10) and **Acadia** (curiosity & independence, ages 8–12) — plus three
    proposed to cover the whole journey: **Zion** (rhythm for many ages),
    **Denali** (teens & launching), and **Great Smoky Mountains** (the seasoned
    trail). Names, ages, and content are all easy to adjust.
  - Optional "send me my trail" capture posts to Submissions (type **compass**)
    with the recommended park and all answers — no database migration.
- Linked from the home navigation as "Journeys."

## v1.9.0 — 2026-06-27

- **"Notify me" capture** for events that aren't on sale yet. Events without a
  ticket link now show a **Notify me** button that opens a short name + email form
  tied to that specific event. Requests land in the Submissions tab tagged
  **Notify**, with the event name shown, and they're included in the Newsletter CSV.
- No database change — reuses the existing submissions store.

## v1.8.0 — 2026-06-27

- **Event ticket links.** Each event now has a "Ticket / registration link" field
  in the admin. Paste your Eventbrite or Stripe checkout link and the event's
  button becomes "Buy Tickets" (opens in a new tab); leave it blank and it stays
  the "Register" interest form. Applies on the home page and conference page.
- Payments and the paid attendee list are handled by your ticketing provider
  (Route A). Adds a `ticket_url` column to the `events` table.

### Migration for this version
Run once in the D1 console:
```
ALTER TABLE events ADD COLUMN ticket_url TEXT;
```

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
