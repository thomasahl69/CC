import { json, requireAuth } from "../_lib.js";

const ID = "store-settings";
const DEFAULT_DISCLOSURE = "As an Amazon Associate, Christina earns from qualifying purchases.";
const clip = (v, n) => (v == null ? "" : String(v)).slice(0, n);

// PUBLIC: read store settings
export async function onRequestGet(context) {
  let s = {};
  try {
    const row = await context.env.DB.prepare("SELECT data FROM content WHERE id=?").bind(ID).first();
    if (row && row.data) s = JSON.parse(row.data) || {};
  } catch {}
  return json({ ok: true, store: { storefrontUrl: s.storefrontUrl || "", disclosure: s.disclosure || DEFAULT_DISCLOSURE } });
}

// ADMIN: save store settings
export async function onRequestPut(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  let b;
  try { b = await context.request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const s = { storefrontUrl: clip(b.storefrontUrl, 1000), disclosure: clip(b.disclosure, 400) || DEFAULT_DISCLOSURE };
  const now = new Date().toISOString();
  try {
    await context.env.DB.prepare(
      `INSERT INTO content (id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`
    ).bind(ID, JSON.stringify(s), now).run();
  } catch (e) {
    return json({ ok: false, error: String(e && e.message || e) }, 500);
  }
  return json({ ok: true });
}
