import { json, requireAuth } from "../_lib.js";

const clip = (v, n) => (v == null ? "" : String(v)).slice(0, n);

function rowToImage(r) {
  return { id: r.id, createdAt: r.created_at, url: r.url, caption: r.caption, sortOrder: r.sort_order };
}

// PUBLIC: list gallery images (conference page reads this), ordered.
export async function onRequestGet(context) {
  const { results } = await context.env.DB
    .prepare("SELECT * FROM gallery ORDER BY sort_order ASC, created_at ASC")
    .all();
  return json({ ok: true, images: (results || []).map(rowToImage) });
}

// ADMIN: add an image
export async function onRequestPost(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const id = "img_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const now = new Date().toISOString();
  const order = Number.isFinite(b.sortOrder) ? b.sortOrder : 0;
  try {
    await context.env.DB.prepare(
      "INSERT INTO gallery (id, created_at, url, caption, sort_order) VALUES (?,?,?,?,?)"
    ).bind(id, now, clip(b.url, 600), clip(b.caption, 300), order).run();
  } catch (e) {
    const msg = String(e && e.message || e);
    const hint = /no such table/i.test(msg)
      ? "The gallery table doesn't exist yet — run schema.sql (or create it in the D1 console)."
      : msg;
    return json({ ok: false, error: hint }, 500);
  }
  return json({ ok: true, id });
}
