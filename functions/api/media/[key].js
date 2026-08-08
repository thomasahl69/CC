import { json, requireAuth } from "../_lib.js";

// ADMIN: delete an uploaded image from R2
export async function onRequestDelete(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  if (!context.env.BUCKET) return json({ ok: false, error: "No image storage bound (BUCKET)." }, 500);
  await context.env.BUCKET.delete(context.params.key);
  return json({ ok: true });
}
