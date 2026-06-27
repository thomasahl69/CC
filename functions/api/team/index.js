import { json, requireAuth } from "../_lib.js";

const ID = "conference-team";
const clip = (v) => (v == null ? "" : String(v)).slice(0, 600);

// PUBLIC: read the team photo URLs
export async function onRequestGet(context) {
  let team = {};
  try {
    const row = await context.env.DB.prepare("SELECT data FROM content WHERE id=?").bind(ID).first();
    if (row && row.data) team = JSON.parse(row.data) || {};
  } catch {}
  return json({ ok: true, team: { christina: team.christina || "", kelly: team.kelly || "" } });
}

// ADMIN: save the team photo URLs
export async function onRequestPut(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const team = { christina: clip(b.christina), kelly: clip(b.kelly) };
  const now = new Date().toISOString();
  try {
    await context.env.DB.prepare(
      `INSERT INTO content (id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`
    ).bind(ID, JSON.stringify(team), now).run();
  } catch (e) {
    return json({ ok: false, error: String(e && e.message || e) }, 500);
  }
  return json({ ok: true });
}
