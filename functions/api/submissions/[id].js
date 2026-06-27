import { json, requireAuth } from "../_lib.js";

const COLS = { status: "status", response: "response", aiDraft: "ai_draft", respondedAt: "responded_at" };
const STATUSES = ["new", "in-progress", "responded", "archived"];

// ADMIN: update status / response / ai draft
export async function onRequestPatch(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  const id = context.params.id;
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  if (b.status && !STATUSES.includes(b.status)) return json({ ok: false, error: "bad status" }, 400);

  const sets = [], vals = [];
  for (const k in COLS) {
    if (k in b) { sets.push(`${COLS[k]} = ?`); vals.push(b[k] == null ? null : String(b[k])); }
  }
  if (!sets.length) return json({ ok: false, error: "nothing to update" }, 400);
  vals.push(id);

  const res = await context.env.DB
    .prepare(`UPDATE submissions SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();

  return json({ ok: true, changed: res.meta?.changes ?? 0 });
}

// ADMIN: delete a submission
export async function onRequestDelete(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  await context.env.DB
    .prepare("DELETE FROM submissions WHERE id = ?")
    .bind(context.params.id)
    .run();
  return json({ ok: true });
}
