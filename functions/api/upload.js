import { json, requireAuth } from "./_lib.js";

const MAX = 10 * 1024 * 1024; // 10 MB

// ADMIN: upload an image file to R2, returns a URL to use as event/gallery image
export async function onRequestPost(context) {
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  if (!context.env.BUCKET) return json({ ok: false, error: "No image storage bound (BUCKET). Create the R2 bucket and bind it." }, 500);

  let data, type, filename;
  const ct = context.request.headers.get("content-type") || "";
  try {
    if (ct.includes("multipart/form-data")) {
      const form = await context.request.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") return json({ ok: false, error: "No file in the request." }, 400);
      type = file.type || "application/octet-stream";
      filename = file.name || "image";
      data = await file.arrayBuffer();
    } else {
      type = ct || "application/octet-stream";
      filename = context.request.headers.get("x-filename") || "image";
      data = await context.request.arrayBuffer();
    }
  } catch {
    return json({ ok: false, error: "Could not read the uploaded file." }, 400);
  }

  if (!/^image\//i.test(type)) return json({ ok: false, error: "Only image files are allowed." }, 400);
  if (data.byteLength > MAX) return json({ ok: false, error: "Image is larger than 10 MB." }, 400);

  const ext = ((filename.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5)) || (type.split("/")[1] || "img");
  const key = "up_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + "." + ext;

  await context.env.BUCKET.put(key, data, {
    httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" },
  });

  return json({ ok: true, url: "/api/file/" + key, key });
}
