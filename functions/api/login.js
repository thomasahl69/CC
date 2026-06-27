import { json, makeToken, sessionCookie } from "./_lib.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ADMIN_PASSWORD) {
    return json({ ok: false, error: "Server is missing ADMIN_PASSWORD." }, 500);
  }
  let body = {};
  try { body = await request.json(); } catch {}
  const pw = (body.password || "").toString();

  // length-independent comparison
  let ok = pw.length === env.ADMIN_PASSWORD.length;
  for (let i = 0; i < pw.length; i++) {
    if (pw.charCodeAt(i) !== env.ADMIN_PASSWORD.charCodeAt(i)) ok = false;
  }
  if (!ok) return json({ ok: false, error: "Incorrect password." }, 401);

  const token = await makeToken(env);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}
