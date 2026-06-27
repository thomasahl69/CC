import { json, requireAuth } from "./_lib.js";

// Read the knowledge base
export async function onRequestGet(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  const row = await context.env.DB
    .prepare("SELECT data, updated_at FROM content WHERE id='knowledge-base'")
    .first();
  if (!row) return json({ ok: true, data: null });
  let data = null;
  try { data = JSON.parse(row.data); } catch {}
  return json({ ok: true, data, updatedAt: row.updated_at });
}

// Replace the knowledge base
export async function onRequestPut(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let body;
  try { body = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  if (!body || !Array.isArray(body.modules)) return json({ ok: false, error: "expected { modules: [...] }" }, 400);

  const now = new Date().toISOString();
  await context.env.DB.prepare(
    `INSERT INTO content (id, data, updated_at) VALUES ('knowledge-base', ?, ?)
     ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`
  ).bind(JSON.stringify(body), now).run();

  return json({ ok: true, updatedAt: now });
}
