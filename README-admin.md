# Content Studio (admin) — read me first

`admin.html` is a private workspace for storing and editing the content your AI
response engine uses to give feedback on the questionnaires moms submit. It comes
pre-loaded with your two source documents:

- **The Framework: REFRAME** (7 parts + overview)
- **The Art of Layered Learning** (6 parts + overview)

You can edit those, reorder sections, and add new modules over time.

---

## Quick start

1. Open `admin.html` in a browser.
2. Password: **`bloom2025`** — change it immediately with the **Password** button.
3. Edit titles, subtitles, the "how the AI should use this" note, and sections.
   Changes save automatically (see *How saving works* below).
4. When you want to update the AI engine, click **Export** to download
   `knowledge-base.json` and hand that file to whoever maintains the AI backend.

Each module has an **"How the AI should use this content"** field. That note is
guidance for the AI itself — when to lean on the module and what tone to take —
so the feedback sounds like you, not a generic chatbot.

---

## Please read this part — about "password protected" and "not accessible to the public"

This is the honest version, because it affects how you roll this out.

A password typed into a plain web page (a static site like the current one) is a
**soft gate**. It hides the admin screen from casual visitors, but it is **not**
real protection:

- Anyone moderately technical can open the page's files and read both the password
  check and the content directly. Nothing in a static page is truly private.
- Your AI engine will need a secret API key. **That key must never live in
  page files**, or anyone can find it and run up charges on your account.

So the current `admin.html` is the right tool for **drafting and organizing**
content now, but the proprietary material and the AI keys should not live in a
public page long-term. Here's the setup that makes it genuinely private.

---

## The production setup (when you're ready to make it real)

Three pieces move off the public page and onto a small backend:

1. **Real login** — use a hosted auth provider (Auth0, Clerk, Firebase Auth, or
   Wix's own member/login system) so only you can reach the admin screen.
2. **Real storage** — keep the content in a database or hosted store (Firebase,
   Supabase, Airtable, or a Wix collection) instead of the browser. Then edits are
   shared across devices and always current for the AI.
3. **A server-side AI step** — when a mom submits the questionnaire, the form
   sends her answers to a small serverless function (Netlify/Vercel function,
   Firebase Function, or Wix Velo backend). That function holds the secret API key,
   loads your knowledge base, and calls the AI. The key and the content never reach
   the visitor's browser.

The flow looks like this:

```
Mom fills questionnaire  →  backend function (secret key lives here)
                              ├─ loads your knowledge-base.json content
                              ├─ calls the AI with that content as context
                              └─ returns the personalized feedback
```

Good news: the JSON this tool exports is already shaped to drop straight into that
function — no rework needed. Whoever builds the backend just loads it as the AI's
reference material.

---

## How saving works (current prototype)

Edits save to **this browser only** (via local storage). That means:

- Your changes survive refreshing and closing the tab **on this computer**.
- They do **not** appear on another device, and they are **not** yet what the AI
  reads. **Export** is the real hand-off.
- **Export / Import** let you back up your work, move it between computers, and
  give it to the backend. Treat `knowledge-base.json` as the source of truth and
  keep a saved copy.

When you move to the production setup above, "Save" will write to the shared
database instead, and Export/Import becomes a backup convenience rather than the
main hand-off.

---

## The JSON shape (the "contract" with the AI engine)

```json
{
  "version": 1,
  "updatedAt": "2026-... (ISO timestamp)",
  "modules": [
    {
      "id": "the-framework",
      "title": "The Framework: REFRAME",
      "subtitle": "Finding Joy in the Real-Life Homeschool",
      "aiNote": "Guidance to the AI on when/how to use this module...",
      "sections": [
        { "heading": "R — Release the Picture-Perfect Homeschool",
          "body": "Core Message... Talk About... Practical Takeaways..." }
      ]
    }
  ]
}
```

If you add modules later (e.g., a third talk, an FAQ, your tone-of-voice guide),
they'll follow the same shape automatically and the AI can use them right away.

---

## Submissions (questionnaire responses)

The site's pop-out questionnaire (the four reflection questions plus name, email,
phone, and preferred contact) saves each response so it appears under the
**Submissions** tab in the admin. There you can:

- read the full submission and contact details,
- set a **status** — New, In progress, Responded, or Archived (the tab shows a
  count of new ones),
- write and save **your response**, and
- see a reserved **Automated draft** slot — empty for now — where the AI engine's
  suggested reply will appear later for you to review, edit, and append.

**Same honest caveat as the content:** in the current static setup, a submission
saves to the **visitor's own browser**, so it only shows in your admin if it was
sent from the same browser (perfect for testing). For real submissions from anyone,
the questionnaire needs to POST to a shared backend or form service, and the admin
reads from that same place. The submission shape is already built for this — the
`responses`, `status`, `response`, and `aiDraft` fields map straight onto a database
row. Export/Import on the Submissions tab let you back up and move the data in the
meantime.

## One thing I noticed in The Framework document

The source file had a stray planning note inside it:

> "Page to add upcoming events – auto remove after 30 days, but show history if asked for."

That reads like a to-do for the **website**, not part of the coaching content, so I
left it out of the AI knowledge base. If you'd like, that auto-expiring events idea
is easy to add to the public events section — just say the word.
