// PUBLIC: serve an uploaded image from R2 by key.
export async function onRequestGet(context) {
  if (!context.env.BUCKET) return new Response("No storage", { status: 500 });
  const key = context.params.key;
  const obj = await context.env.BUCKET.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}
