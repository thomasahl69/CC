import { ensureSchema } from "./_lib.js";

// Runs before every /api/* request. On the first request after a deploy it
// creates or updates all database tables automatically, so no SQL ever needs
// to be run by hand in the Cloudflare D1 console.
export async function onRequest(context) {
  try { await ensureSchema(context.env.DB); } catch (e) {}
  return context.next();
}
