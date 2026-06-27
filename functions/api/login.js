import { json, makeToken, sessionCookie } from "./_lib.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ADMIN_PASSWORD) {
    return json({ ok: false, error: "Server is missing ADMIN_PASSWORD." }, 500);
  }
  let body = {};
  try { body = await request.json(); } catch {}
  // trim to forgive accidental trailing newlines/spaces (common when setting secrets)
  const pw = (body.password || "").toString().trim();
  const expected = env.ADMIN_PASSWORD.trim();

  // length-independent comparison
  let ok = pw.length === expected.length;
  for (let i = 0; i < pw.length; i++) {
    if (pw.charCodeAt(i) !== expected.charCodeAt(i)) ok = false;
  }
  if (!ok) return json({ ok: false, error: "Incorrect password." }, 401);

  const hours = parseInt(env.SESSION_HOURS, 10) || 720; // default 30 days
  const token = await makeToken(env, hours);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token, hours) });
}
