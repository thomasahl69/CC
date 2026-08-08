# SEO Migration Runbook — moving the domain onto this site

The goal: when you point the domain at this new Cloudflare Pages site, keep the
rankings the old site already earned and recover fast from the temporary dip that
always follows a move. Do the "Before" steps in the next two months so cutover day
is boring.

---

## First, which move is this? (it changes the playbook)

**Scenario A — Same domain, new site.** `christinacarpenter.org` already belongs to
you and currently shows an old site (Wix/Squarespace/etc.); you'll just repoint it at
this Cloudflare site.
→ Google keeps the same domain, so there is **no** Change-of-Address step. You just need
clean 301s from every old *path* to the matching new path, then let Google recrawl.

**Scenario B — Different old domain → this domain.** The live audience/traffic is on a
*different* domain that you're consolidating onto `christinacarpenter.org`.
→ This is a true cross-domain move. You additionally use the Search Console
**Change of Address** tool and keep the old domain alive (301-ing) for 6–12 months.

Most of the checklist is the same either way; the Change-of-Address + keep-old-domain
steps are Scenario B only.

---

## Before the move (do this now → over the next 2 months)

1. **Inventory the old URLs.** Export every real URL the old site has, from its
   `sitemap.xml`, from Search Console → Indexing → Pages, or a free Screaming Frog crawl.
   Note which ones have traffic or backlinks — those are the ones that must redirect well.

2. **Build the redirect map.** In `_redirects` (already scaffolded in this project), add
   one `301` line per old URL → the closest new page. Rules:
   - Map to the *closest equivalent* page, never blanket-redirect everything to `/`.
   - One hop only (old → new). No chains, no loops.
   - Keep new slugs close to the old ones where you can.

3. **Pick one canonical host** (www **or** apex) and enforce the other with a Cloudflare
   **Redirect Rule** (Dashboard → Rules → Redirect Rules), 301-ing the non-canonical host.
   The site's canonical tags currently say `https://www.christinacarpenter.org` — match that
   or change the tags. Pick one and never split traffic between the two.

4. **Verify the property in Google Search Console now** if you can (domain property is best).
   Also verify the *old* site's property so you have before/after data and the Change-of-Address
   option (Scenario B).

5. **Don't let the preview URL compete.** While the site lives on a `*.pages.dev` URL, your
   canonical tags already point at the final domain, which consolidates the signal. If you want
   to be extra safe, keep the `*.pages.dev` production URL out of the index until launch
   (Cloudflare marks preview builds noindex; confirm the production preview URL isn't being
   indexed with content that competes with the future domain).

6. **Lower the DNS TTL** on the domain's records a few days before cutover (e.g. 300s) so the
   switch propagates fast.

---

## Cutover day

1. Add `christinacarpenter.org` as a **custom domain** in the Cloudflare Pages project and
   deploy the latest build (with `_redirects` live).
2. Point DNS at the Pages project. Confirm HTTPS is issued.
3. **Spot-check redirects:** hit 8–10 of the busiest old URLs and confirm each returns a single
   301 straight to the right new page (use browser dev tools or `curl -I`).
4. Confirm the canonical-host redirect works (www ↔ apex resolves to your chosen one).
5. In Search Console: submit `https://www.christinacarpenter.org/sitemap.xml`, and use
   **URL Inspection → Request Indexing** on the homepage and your top 5–10 pages.
6. **Scenario B only:** run the **Change of Address** tool (old property → new), and keep the
   old domain live and 301-ing for as long as possible (6–12 months minimum).

---

## The first few weeks after (riding out "the hit")

- Expect a **temporary dip** in rankings/traffic. With clean 1-hop 301s it usually recovers in
  a few weeks; sloppy or missing redirects are what turn a dip into a lasting loss.
- Watch Search Console → **Pages** for a spike in 404/Not-found and **Crawled – not indexed**.
  Every 404 that used to rank = add a redirect for it.
- Check **Performance** for old top queries; make sure each old top page 301s to a strong,
  relevant equivalent (not a weaker page).
- Don't change URLs again for a while — let it settle before any further restructuring.

---

## Guardrails that prevent a *bigger* hit

- No redirect chains or loops; always a single hop.
- Don't dump everything on the homepage — map to the closest real page.
- Don't launch with `noindex` or a `Disallow: /` in robots.txt by accident. (This site's
  `robots.txt` allows crawling and only blocks `/admin` and `/api/`.)
- Keep the sitemap current — it already lists the five park pages; regenerate it if pages change.
- Keep content substantially the same on moved pages; big content changes + a domain move at the
  same time compounds the dip.

---

## Already done for you (SEO readiness, v1.30.0)

- Crawlable standalone URL for every park (`/parks/*.html`), listed in `sitemap.xml`.
- `robots.txt` (+ admin/API disallowed, admin `noindex`).
- Structured data: WebSite + Organization + WebApplication (home), WebApplication (journeys),
  Course (each park), CollectionPage (resources), EducationEvent (conference).
- Canonical URLs, Open Graph, Twitter cards, theme-color, keyword meta on every page.
- Keyword-rich static homepage hero.
- This `_redirects` scaffold, a branded `404.html`, and this runbook.
