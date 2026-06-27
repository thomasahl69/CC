// Shared helpers for the API functions. Files prefixed with "_" are not routes.

const enc = new TextEncoder();

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function b64url(bytes) {
  let s = btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToStr(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  return atob(s);
}

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return b64url(new Uint8Array(sig));
}

function secretOf(env) {
  return env.SESSION_SECRET || env.ADMIN_PASSWORD || "change-me-please";
}

export async function makeToken(env, hours = 12) {
  const payload = b64url(enc.encode(JSON.stringify({ exp: Date.now() + hours * 3600e3 })));
  const sig = await hmac(secretOf(env), payload);
  return `${payload}.${sig}`;
}

export async function verifyToken(env, token) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if ((await hmac(secretOf(env), payload)) !== sig) return false;
  try {
    const { exp } = JSON.parse(b64urlToStr(payload));
    return Date.now() < exp;
  } catch { return false; }
}

export function getCookie(request, name) {
  const c = request.headers.get("Cookie") || "";
  const m = c.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export async function requireAuth(context) {
  return verifyToken(context.env, getCookie(context.request, "cc_session"));
}

export function sessionCookie(token, hours = 12) {
  return `cc_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${hours * 3600}`;
}
export function clearCookie() {
  return `cc_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function rowToSub(r) {
  let responses = [];
  try { responses = JSON.parse(r.responses) || []; } catch {}
  return {
    id: r.id, createdAt: r.created_at, type: r.type, questionnaire: r.questionnaire,
    name: r.name, email: r.email, phone: r.phone, preferredContact: r.preferred_contact,
    responses, status: r.status, response: r.response || "",
    aiDraft: r.ai_draft || "", respondedAt: r.responded_at,
  };
}
