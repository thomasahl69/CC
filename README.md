# Authentic Joy in the Journey — website bundle

Everything for Christina Carpenter's site, ready to upload. Keep **all files in
the same folder** — the pages link to the icons with simple relative paths
(e.g. `favicon.ico`), so they need to sit next to `index.html`.

## What's inside

| File | What it is |
|------|------------|
| `index.html` | The public website (hero, story, the two spaces, events, offerings, testimonials, the pop-out reflection questionnaire, newsletter/contact, footer). Fully mobile-responsive. |
| `admin.html` | **Private** workspace. Password-gated. Two tabs: **Content** (the AI knowledge base — The Framework + The Art of Layered Learning) and **Submissions** (questionnaire responses you can read, status, and respond to). Do not link to this from the public site. |
| `README-admin.md` | How the admin works, the JSON the AI engine consumes, and — important — the security/production notes. Read this one. |
| `favicon.ico` | Browser-tab icon (16/32/48 px). |
| `favicon-16.png`, `favicon-32.png`, `favicon-192.png` | PNG icons for modern browsers / sharing. |
| `favicon.avif` | Your original icon image, for browsers that support AVIF. |
| `apple-touch-icon.png` | Home-screen icon for iPhone/iPad. |

## How to put it online

1. Upload **every file in this folder** to your web host, all in the same place.
2. Make sure the public homepage is served as `index.html`.
3. The admin lives at `admin.html` (e.g. `yoursite.com/admin.html`). Open it,
   then change the default password right away (button is in the top bar).
4. Favicons cache hard — do a hard refresh if the old icon lingers.

## Default admin password

`bloom2025` — **change it immediately** inside the admin (Password button).

## Honest reminders (details in README-admin.md)

- A password on a static page is a soft gate, not real security. For genuine
  protection of the private content and the AI key, the admin/login/AI step move
  to a small backend. The exported JSON is already shaped for that.
- Right now, edits and questionnaire submissions save to **one browser**. For
  real submissions from any visitor (and content that's shared across devices and
  live to the AI), the forms post to a shared backend/form service and the admin
  reads from the same place.

## Things you can ask for next

- Wire the questionnaire to a real backend so submissions arrive for anyone.
- Connect the AI response engine so the reserved "Automated draft" slot fills in.
- Add the auto-expiring events feature (the note found in The Framework doc).
- Hook the newsletter/contact form to a mail service.
