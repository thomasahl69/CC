import { json, requireAuth } from "../_lib.js";

const clip = (v, n) => (v == null ? "" : String(v)).slice(0, n);

function rowToRes(r) {
  return {
    id: r.id, createdAt: r.created_at, title: r.title, author: r.author, note: r.note,
    image: r.image, url: r.url, category: r.category, park: r.park, sortOrder: r.sort_order,
  };
}

// PUBLIC: list resources (media list), ordered.
export async function onRequestGet(context) {
  const { results } = await context.env.DB
    .prepare("SELECT * FROM resources ORDER BY sort_order ASC, created_at ASC")
    .all();
  return json({ ok: true, resources: (results || []).map(rowToRes) });
}

// ADMIN: add a resource
export async function onRequestPost(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const id = "res_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const now = new Date().toISOString();
  const order = Number.isFinite(b.sortOrder) ? b.sortOrder : 0;
  try {
    await context.env.DB.prepare(
      "INSERT INTO resources (id, created_at, title, author, note, image, url, category, park, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)"
    ).bind(
      id, now, clip(b.title, 200), clip(b.author, 200), clip(b.note, 2000),
      clip(b.image, 600), clip(b.url, 1000), clip(b.category, 80), clip(b.park, 60), order
    ).run();
  } catch (e) {
    const msg = String(e && e.message || e);
    const hint = /no such table/i.test(msg)
      ? "The resources table doesn't exist yet — run schema.sql (or create it in the D1 console)."
      : msg;
    return json({ ok: false, error: hint }, 500);
  }
  return json({ ok: true, id });
}
