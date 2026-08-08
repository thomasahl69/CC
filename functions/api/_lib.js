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
    summary: r.summary || "", persona: r.persona || "",
  };
}

// Generate a PII-free answer summary + parent persona from a submission's answers.
// Returns { summary, persona } or null (no key / failure). Never includes name/email.
export async function aiPersona(env, sub) {
  if (!env || !env.AI_API_KEY) return null;
  const answers = (sub.responses || [])
    .map((r) => `- ${r.q}: ${r.a && String(r.a).trim() ? String(r.a).trim() : "(blank)"}`)
    .join("\n");
  const system =
`You analyze homeschool-website form submissions for a homeschool coach (Christina). From ONLY the answers provided, produce a short answer summary and an anonymized parent persona that helps the coach shape the pace, direction, and tone of her reply.

STRICT PRIVACY: never include names, emails, phone numbers, locations, or any identifying detail. Describe the parent in general terms only.

Respond with ONLY valid JSON (no markdown fences) of the form:
{"summary":"1-2 sentences on what they submitted or are asking","persona":"3-4 sentences: their likely homeschool style, family stage/size if implied, what they may be feeling or needing, and how best to encourage them"}`;
  const user = `Form type: ${sub.type || "submission"} (${sub.questionnaire || ""}).\nAnswers:\n${answers || "(none)"}`;
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": env.AI_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: env.AI_MODEL || "claude-sonnet-4-6", max_tokens: 450, system, messages: [{ role: "user", content: user }] }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    let txt = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    txt = txt.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const obj = JSON.parse(txt);
    return { summary: String(obj.summary || "").slice(0, 600), persona: String(obj.persona || "").slice(0, 1400) };
  } catch (e) { return null; }
}

// ---- Auto-migration: creates/updates all tables on first request per isolate.
// This removes the need to ever run SQL by hand in the D1 console.
let SCHEMA_READY = false;
const CREATE = [
  `CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, type TEXT DEFAULT 'questionnaire', questionnaire TEXT, name TEXT, email TEXT, phone TEXT, preferred_contact TEXT, responses TEXT, status TEXT DEFAULT 'new', response TEXT DEFAULT '', ai_draft TEXT DEFAULT '', responded_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_sub_created ON submissions(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_sub_status ON submissions(status)`,
  `CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, title TEXT, date TEXT, location TEXT, description TEXT, cost TEXT, image TEXT, ticket_url TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`,
  `CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, url TEXT, caption TEXT, sort_order INTEGER DEFAULT 0)`,
  `CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(sort_order)`,
  `CREATE TABLE IF NOT EXISTS resources (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, title TEXT, author TEXT, note TEXT, image TEXT, url TEXT, category TEXT, park TEXT, sort_order INTEGER DEFAULT 0)`,
  `CREATE INDEX IF NOT EXISTS idx_resources_order ON resources(sort_order)`,
];
// Additive columns for databases created with an older schema. Errors (e.g. the
// column already exists) are expected and ignored.
const ALTER = [
  `ALTER TABLE events ADD COLUMN image TEXT`,
  `ALTER TABLE events ADD COLUMN ticket_url TEXT`,
  `ALTER TABLE events ADD COLUMN cost TEXT`,
  `ALTER TABLE submissions ADD COLUMN response TEXT DEFAULT ''`,
  `ALTER TABLE submissions ADD COLUMN ai_draft TEXT DEFAULT ''`,
  `ALTER TABLE submissions ADD COLUMN responded_at TEXT`,
  `ALTER TABLE submissions ADD COLUMN type TEXT DEFAULT 'questionnaire'`,
  `ALTER TABLE submissions ADD COLUMN summary TEXT DEFAULT ''`,
  `ALTER TABLE submissions ADD COLUMN persona TEXT DEFAULT ''`,
];
export async function ensureSchema(db) {
  if (SCHEMA_READY || !db) return;
  for (const sql of CREATE) { try { await db.prepare(sql).run(); } catch (e) {} }
  for (const sql of ALTER) { try { await db.prepare(sql).run(); } catch (e) {} }
  SCHEMA_READY = true;
}
