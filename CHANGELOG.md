# Changelog

All notable changes to the Authentic Joy in the Journey site (CC).
Versions follow `MAJOR.MINOR.PATCH` — bump PATCH for fixes, MINOR for new
features, MAJOR for big/breaking changes.

The version shows in three places: this file, the `VERSION` file, the
`<meta name="version">` tag in each page, and the label next to "Content Studio"
in the admin top bar. Update all of them together when you cut a new version.

## v1.30.0 — 2026-06-27

SEO, findability, and standalone URLs.

- **A crawlable page for every park.** Each of the five parks now has its own real,
  shareable URL (/parks/acadia.html … denali.html) with full static content — era, both
  years, study stops, the four paths, the nine subjects — generated from the live park data
  so it never drifts. The park tiles are now real links (crawlers follow them; visitors still
  get the smooth in-page experience) and each page links to the next/previous era and back to
  the Compass Guide.
- **robots.txt + sitemap.xml** (admin and API excluded; nine URLs listed).
- **Structured data (JSON-LD):** WebSite + Organization + WebApplication on the homepage,
  WebApplication on Journeys, a Course block on every park page, CollectionPage on Resources,
  and EducationEvent on the Conference page.
- **Full head SEO on every page:** canonical URLs, Twitter cards, theme-color, and keyword
  meta. The Journeys page meta was updated from the old "national-park" pitch to Evergreen.
- **Keyword-rich static hero** on the homepage (Christian homeschool, Evergreen, multi-age
  family curriculum) — real HTML, not JS-rendered.
- **The "What's this?" explainer is now a "Learn more…" link to the right** of each option,
  saving vertical space, and it collapses to below on narrow phones.
- Admin is marked noindex. Every page (including the five new ones) carries the viewport meta
  and responsive layout for phones, tablets, and desktops.

## v1.29.0 — 2026-06-27

- **Plain-language "What's this?" explainers in the questionnaire.** The educator-type
  question no longer assumes you already know the jargon — each option (Charlotte Mason,
  Classical, Montessori, Interest-led, Eclectic, Still figuring it out) now has a tap-to-open,
  jargon-free description, so a newcomer can choose honestly. The toggle is reusable on any
  question option going forward.
- **Four Paths spelled out in the result.** Wildflower / Meadow / Ranger / Hearth now each
  carry a one-line plain description where the plan lists them, so those invented terms are
  clear the first time a family meets them.

## v1.28.0 — 2026-06-27

- **The Compass Guide now ends with personalized encouragement, tips, and advice** — no AI
  call required. A new "What would help most this season?" question captures where a family
  wants to go, and the result composes a tailored word for their journey from where they
  are (stage), who they are (educator + family), and where they’re headed (goal).
- Built as **composable snippets**, not pre-baked combinations: ~20 short, editable pieces
  assemble into thousands of personal results instantly and for free. AI stays reserved for
  the human-reviewed reply Christina sends.
- The goal answer is saved with the submission (and feeds the persona), giving Christina one
  more read on each family.

## v1.27.0 — 2026-06-27

- **Optional first name in the Compass Guide.** A friendly, skippable first question —
  "What should we call you?" — lets the guide greet families personally ("Here's where
  your family begins, Sarah.") and pre-fills the save-your-welcome form. Skipping it changes
  nothing else.
- **Welcoming to dads, not just moms.** The brand's heart stays with homeschool moms, but
  the AI reply engine and the parent persona no longer assume the reader is a mother — they
  address people by their first name (or warmly without one) and never guess gender. A dad
  on the journey — solo or supporting a partner — now gets a reply that fits him. The
  questionnaire and journey copy were already gender-neutral.

## v1.26.0 — 2026-06-27

- **Every submission now gets a PII-free "coach brief" — an answer summary + a parent
  persona.** Generated automatically in the background the moment a form is submitted (of
  any type), so the visitor's submit stays instant. It captures what they're asking and a
  short, anonymized profile of the parent — their likely style, family stage, what they may
  be feeling, and how best to encourage them — with names, emails, and contact details
  strictly excluded.
- The brief appears at the top of each submission in Content Studio to help Christina shape
  her pace, direction, and tone — with a **Generate / Refresh** button (for older
  submissions or a re-run).
- The persona is also fed into the **AI draft engine**, so generated replies are tuned to
  that parent from the start.
- Uses the same AI engine (AI_API_KEY); if the key isn't set, submissions still save
  normally and the brief simply stays empty.

## v1.25.0 — 2026-06-27

- **Compass Guide questionnaire is back — repurposed as an Evergreen family profile.**
  Four quick questions now collect the data worth having: **what kind of educator you
  are**, **how many children** you teach, **their ages**, and where you are on the
  journey. Reachable from the hero and the intro card.
- Instead of routing to a park by age, it produces a warm **Evergreen plan**: everyone
  begins in the Ancient World (Acadia), and each child is matched to a suggested **path**
  (Wildflower / Meadow / Ranger) by age, with Hearth for the whole family — plus a
  save-your-profile capture so Christina collects every family's profile as a submission
  (type "Compass Guide"). Groundwork for dynamic, per-child placement later.

## v1.24.0 — 2026-06-27

**Journeys rebuilt as Evergreen (draft across all five parks) — for dinner review.**

- Parks are now the **five historical eras** Christina named: Acadia (Ancient),
  Yosemite (Medieval), Yellowstone (Renaissance & Exploration), Zion (1700s–1800s),
  Denali (Modern) — each with a themed map and a full draft of content.
- Each park is **two years**: Year 1 Explore and Year 2 Deep Trail (the old two-path
  toggle, re-cut). Four **study stops** per year, drafted for every era.
- The style selector is replaced by the **Four Paths / levels** — Wildflower, Meadow,
  Ranger, and Hearth (the whole-family layer) — each re-tailoring how the stops are
  walked.
- A **nine-subjects** panel per park shows how Bible, History, Science, Geography,
  Literature, Poetry, Art, Writing, and Nature weave into that era.
- The **"For you, teacher"** parent-teacher guidance carries over (full depth on
  Acadia; ready to extend).
- Hero, the five-parks grid, and the entry flow reframed to Evergreen. The old
  age-based Compass quiz is parked (kept in code) behind a simple "begin at the
  beginning" placement — the per-child path-placement quiz is the next step once
  Christina confirms the mechanics.

_Draft notes: park names/eras are Christina's current draft (to be tweaked); the
field-plate artwork still shows the old park set and will be redrawn once names lock;
the Compass quiz reframe and the per-park book lists are the next build steps._

## v1.23.1 — 2026-06-27

- Renamed the **Media** tab to **Image Library** and rewrote the Gallery + Image Library notices so the difference is obvious: Gallery = curated photos shown on the site (conference highlights + team); Image Library = your private shelf of every uploaded file, for reuse and cleanup.

## v1.23.0 — 2026-06-27

- **The journey now serves the parent-teacher, not just the student.** Every education
  point can carry a "For you, teacher" note — how to actually guide the child through it,
  when they're ready to move on, and a word of courage — because the hard part is usually
  guiding the child, not the learning.
- **Deeper proof-of-concept on Yellowstone:** all six education points (both paths) now
  include full parent-teacher guidance, shown as an expandable panel on each card, plus a
  banner explaining the journey is for the parent as much as the child. The other parks
  keep the lighter treatment for now.
- Attribution: the bravery quote is now credited to **Christina Carpenter** (home band and
  Conference page).

## v1.22.0 — 2026-06-27

- **Encouragement woven through the site.** A new rotating **encouragement band** on the
  home page cycles gentle, brave, "you can do this" quotes (auto-advancing, with dots,
  and still when reduced-motion is on). Anchored by Louisa May Alcott's *"I'm not afraid
  of storms…"* and Thomas Ahl's *"Bravery is not the absence of fear…"*, plus a few
  original encouragements.
- The Alcott line also headlines the **Journeys** hero and closes the **Resources** page;
  the bravery quote closes the **Conference** page — so encouragement greets and sends off
  visitors everywhere.
- Note: the "courage is not the absence of fear" line often credited to FDR is actually
  Ambrose Redmoon's, so we used Thomas's own version instead of a misattribution.

## v1.21.0 — 2026-06-27

Reworked the journey model around clearer intent:

- **Markers are now education points** — the real learning destinations for each
  stage (e.g. Letters & Sounds, Fluent Reading, Core Credits), rewritten for all five
  parks across two paths.
- **Rest · Review · Reset are pauses, not destinations** — they now sit *between* the
  education points on the map and in the list (a dotted "rest-stop" between each), with
  their own quiet styling. ("Reset" replaces the earlier "Relationship" so all three
  read as pause actions.)
- **Two paths, both = the full journey** — the Foundations Path (core skills) and the
  Wonder Path (exploration & interests). Copy now says completing both makes the whole
  journey, and how you navigate is yours.
- **Your homeschool style is your route** — a style selector (Classical, Charlotte
  Mason, Montessori, Interest-led, Eclectic, or your own blend) on every park result,
  pre-set from the Compass Guide, showing how that style walks the same education points.
- **Age is surfaced** — the child's age band shows on the result, and the park is matched
  to it. The Compass submission now records the chosen style, path, and age.

## v1.20.0 — 2026-06-27

- **Automatic database setup — no console, ever.** An API middleware now creates and
  updates every table on the first request after each deploy (`CREATE TABLE IF NOT
  EXISTS` for all tables plus any additive columns). You never need to open the D1
  console or run SQL by hand — just deploy. Existing data is never touched.
- **Feedback form** on the home page (a "Share your feedback" section with a 1–5 star
  rating, message, and optional name/email; linked in the footer). Submissions post as
  `type:'feedback'`.
- **Read feedback in Content Studio:** Submissions now has a **Type** filter
  (Feedback / Questionnaires / Compass Guide / Notify / Contact) so you can pull up all
  feedback at a glance, and feedback carries its star rating in the detail view.

## v1.19.0 — 2026-06-27

Bug-fix and integration pass from live feedback:

- **Fixed the disappearing menu in Content Studio.** A malformed notice block (from the
  Media Library addition) left `resourcesNotice` without its opening tag, so switching
  tabs threw a JS error and a stray `</div>` collapsed the layout. Repaired — all tabs
  switch cleanly again, which also makes the **Media** (image) tab reachable.
- **Journeys & Resources are now part of the overall site**, not standalone: both pages
  carry the same site header, full navigation menu, brand wordmark, Register button, and
  mobile hamburger as the home page.
- **Both journey trails are now for the student:** *The Learner's Trail* (skills &
  knowledge) and *The Wonder Trail* (heart & curiosity) — the earlier "Mother's Trail"
  framing is gone. Both still walk Rest · Review · Relationship, rewritten per park.
- **Image management** is clearer: the Media tab (now reachable) is the one place to see,
  copy links to, and delete every uploaded image; uploading still lives in Events,
  Gallery, and Resources.
- **Resources rebuilt as a store layout** (GrowthPath-style): a sticky category bar, a
  "shop for a trail" filter, and products grouped into **aisles** with headings and
  counts (Must-Haves first). Shows a labeled sample layout until real products are added.

## v1.18.0 — 2026-06-27

- **Media Library** (new Content Studio tab): every image you've uploaded, in one
  place. Copy an image's link to reuse it anywhere, or delete images you no longer
  need to keep R2 storage tidy. Backed by `GET /api/media` (lists R2 uploads) and
  `DELETE /api/media/:key`.
- **Respond & send in one place:** the Submissions responder now has **Send by
  email** (opens your mail app with the reply pre-filled to the person and marks the
  submission "responded"), plus **Copy reply** and **Mark responded**. Works
  alongside the existing "Generate draft / Append to reply" AI helper.
- No database migration needed (Media uses R2; Send uses your mail app).

## v1.17.1 — 2026-06-27

- Made the **Adolphe Millot field plate** easy to find: the Journeys page nav now has
  a "The Plate" link (to the `#plate` section), the home page's Guided Journeys image
  links straight to it with a "View the field plate →" caption, and the home footer
  lists "The Field Plate."

## v1.17.0 — 2026-06-27

- **Two trails per park**, both built on the same gentle rhythm — **Rest · Review ·
  Relationship**. Each park offers *The Mother's Trail* (for you, mama) and *The
  Learner's Trail* (for your child); a toggle switches between them and re-draws the
  trail map's pins.
- Removed the **"Not for us"** option — viewing points are now marked simply *On my
  path* or *Maybe later*, keeping the tone encouraging. Legend, painted-trail
  summary, and the Compass submission updated to match, and the chosen trail is
  recorded in the submission Christina receives.

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
