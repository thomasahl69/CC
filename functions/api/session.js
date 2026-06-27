import { json, requireAuth } from "./_lib.js";

// Returns whether the current cookie is a valid, unexpired session.
export async function onRequestGet(context) {
  return json({ ok: true, authenticated: await requireAuth(context) });
}
