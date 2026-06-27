# Changelog

All notable changes to the Authentic Joy in the Journey site (CC).
Versions follow `MAJOR.MINOR.PATCH` — bump PATCH for fixes, MINOR for new
features, MAJOR for big/breaking changes.

The version shows in three places: this file, the `VERSION` file, the
`<meta name="version">` tag in each page, and the label next to "Content Studio"
in the admin top bar. Update all of them together when you cut a new version.

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
