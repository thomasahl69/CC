import { json, requireAuth } from "../_lib.js";

const clip = (v, n) => (v == null ? "" : String(v)).slice(0, n);

function rowToEvent(r) {
  return {
    id: r.id, createdAt: r.created_at, title: r.title, date: r.date,
    location: r.location, description: r.description, cost: r.cost, image: r.image, ticketUrl: r.ticket_url,
  };
}

// PUBLIC: list events (the main site reads this). Sorted by date ascending.
export async function onRequestGet(context) {
  const { results } = await context.env.DB
    .prepare("SELECT * FROM events ORDER BY date ASC")
    .all();
  return json({ ok: true, events: (results || []).map(rowToEvent) });
}

// ADMIN: create an event
export async function onRequestPost(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const id = "evt_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const now = new Date().toISOString();
  try {
    await context.env.DB.prepare(
      "INSERT INTO events (id, created_at, title, date, location, description, cost, image, ticket_url) VALUES (?,?,?,?,?,?,?,?,?)"
    ).bind(
      id, now, clip(b.title, 200), clip(b.date, 40),
      clip(b.location, 300), clip(b.description, 4000), clip(b.cost, 80), clip(b.image, 600), clip(b.ticketUrl, 600)
    ).run();
  } catch (e) {
    const msg = String(e && e.message || e);
    const hint = /no such table/i.test(msg)
      ? "The events table doesn't exist yet — run schema.sql (or create it in the D1 console)."
      : msg;
    return json({ ok: false, error: hint }, 500);
  }

  return json({ ok: true, id });
}
