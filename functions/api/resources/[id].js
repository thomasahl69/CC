import { json, requireAuth } from "../_lib.js";

const COLS = { title: "title", author: "author", note: "note", image: "image", url: "url", category: "category", park: "park", sortOrder: "sort_order" };

export async function onRequestPatch(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  const id = context.params.id;
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const sets = [], vals = [];
  for (const k in COLS) {
    if (k in b) { sets.push(`${COLS[k]} = ?`); vals.push(k === "sortOrder" ? (Number(b[k]) || 0) : (b[k] == null ? "" : String(b[k]))); }
  }
  if (!sets.length) return json({ ok: false, error: "nothing to update" }, 400);
  vals.push(id);
  await context.env.DB.prepare(`UPDATE resources SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  await context.env.DB.prepare("DELETE FROM resources WHERE id = ?").bind(context.params.id).run();
  return json({ ok: true });
}
