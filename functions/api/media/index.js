import { json, requireAuth } from "../_lib.js";

// ADMIN: list uploaded images in R2
export async function onRequestGet(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  if (!context.env.BUCKET) return json({ ok: false, error: "No image storage bound (BUCKET). Create the R2 bucket and bind it." }, 500);

  const list = await context.env.BUCKET.list({ prefix: "up_", limit: 1000 });
  const items = (list.objects || []).map((o) => ({
    key: o.key,
    url: "/api/file/" + o.key,
    size: o.size,
    uploaded: o.uploaded,
  }));
  items.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
  return json({ ok: true, items });
}
