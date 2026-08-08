# Action Items — Christina Carpenter site

A running list of what's pending. Newest requests at the top of each section.

## Email / sending
- [ ] **Send replies "as Christina" via Resend.** Wire the admin responder so
      "Send by email" actually sends the message from Christina's own address
      through Resend (instead of opening a mailto in the user's mail app). Needs:
      verify `christinacarpenter.org` in Resend (SPF/DKIM DNS records), add a
      `RESEND_API_KEY` secret, build a `functions/api/send.js` endpoint, and swap the
      mailto flow for a real send + delivery status. (Requested by Thomas — "create a
      link to send as her from Resend.")
      _Note: confirm the exact "link" intent — likely a one-click send from the admin,
      and optionally a shareable/booking or newsletter link she can send out._

## Awaiting Christina (from dinner review)
- [ ] Final **park names + eras** (current draft: Acadia/Ancient, Yosemite/Medieval,
      Yellowstone/Renaissance, Zion/1700s–1800s, Denali/Modern).
- [ ] How **Hearth** runs alongside the three child levels (Wildflower/Meadow/Ranger).
- [ ] Whether the entry becomes a real per-child **path-placement** quiz.

## Evergreen build queue
- [ ] Extend the **"For you, teacher"** guidance across all five parks (only Acadia is deep).
- [ ] **Book lists per park** wired into Resources (home-library), with an education-style
      / level filter.
- [ ] Redraw **parks-plate.svg** to match the five eras once names lock.
- [ ] Build **The Expedition** (high-school stage after the five parks).
- [ ] Regenerate the standalone **/parks/*.html** pages whenever park data changes.

## Domain migration (Wix → Cloudflare, ~2 months out) — Scenario A (same domain)
- [ ] Fill/confirm `_redirects` (pre-filled from the Wix sitemap — review the mappings).
- [ ] Decide canonical host (currently **www**) and add a Cloudflare Redirect Rule for the other.
- [ ] At cutover: add custom domain in Pages, repoint DNS, test redirects, submit sitemap in
      Search Console, request indexing on top pages.
- [ ] See `SEO-MIGRATION.md` for the full runbook.

## Nice-to-have / later
- [ ] Make the **advice snippets** and **educator descriptions** editable by Christina in the
      admin (so she owns the wording).
- [ ] **Events attendee + notes log** (Events currently stores event fields only).
- [ ] Explicit "dads welcome" note somewhere visible, if desired (copy stays mom-centered).
- [ ] Automated new-submission digest email to Christina (pairs with the Resend work above).
