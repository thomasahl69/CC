import { json, clearCookie, requireAuth } from "./_lib.js";

export async function onRequestPost() {
  return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
}

export async function onRequestGet(context) {
  return json({ authenticated: await requireAuth(context) });
}
