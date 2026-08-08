import { json, requireAuth, rowToSub, aiPersona } from "../_lib.js";

// ADMIN: (re)generate the PII-free summary + persona for a submission.
export async function onRequestPost(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  if (!context.env.AI_API_KEY) return json({ ok: false, error: "Server is missing AI_API_KEY." }, 500);

  const row = await context.env.DB.prepare("SELECT * FROM submissions WHERE id = ?").bind(context.params.id).first();
  if (!row) return json({ ok: false, error: "Submission not found." }, 404);

  const p = await aiPersona(context.env, rowToSub(row));
  if (!p) return json({ ok: false, error: "Could not generate a persona right now." }, 502);

  await context.env.DB.prepare("UPDATE submissions SET summary = ?, persona = ? WHERE id = ?")
    .bind(p.summary, p.persona, context.params.id).run();
  return json({ ok: true, summary: p.summary, persona: p.persona });
}
