import { json, requireAuth, rowToSub } from "../_lib.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, n) => (v == null ? "" : String(v)).slice(0, n);

// PUBLIC: a visitor submits the questionnaire or contact form
export async function onRequestPost(context) {
  const { request, env } = context;
  let b;
  try { b = await request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const name = clip(b.name, 200).trim();
  const email = clip(b.email, 200).trim();
  if (!name || !EMAIL.test(email)) {
    return json({ ok: false, error: "A name and a valid email are required." }, 400);
  }

  const responses = Array.isArray(b.responses)
    ? b.responses.slice(0, 50).map((r) => ({ q: clip(r.q, 500), a: clip(r.a, 5000) }))
    : [];

  const rec = {
    id: "sub_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    created_at: new Date().toISOString(),
    type: clip(b.type || "questionnaire", 40),
    questionnaire: clip(b.questionnaire, 200),
    name, email,
    phone: clip(b.phone, 60),
    preferred_contact: clip(b.preferredContact, 60),
    responses: JSON.stringify(responses),
  };

  await env.DB.prepare(
    `INSERT INTO submissions
     (id, created_at, type, questionnaire, name, email, phone, preferred_contact, responses, status, response, ai_draft, responded_at)
     VALUES (?,?,?,?,?,?,?,?,?, 'new', '', '', NULL)`
  ).bind(
    rec.id, rec.created_at, rec.type, rec.questionnaire, rec.name,
    rec.email, rec.phone, rec.preferred_contact, rec.responses
  ).run();

  return json({ ok: true, id: rec.id });
}

// ADMIN: list all submissions
export async function onRequestGet(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  const { results } = await context.env.DB
    .prepare("SELECT * FROM submissions ORDER BY created_at DESC")
    .all();
  return json({ ok: true, submissions: (results || []).map(rowToSub) });
}
