import { json, requireAuth, rowToSub } from "./_lib.js";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// Build the system prompt from the stored knowledge base
function buildSystem(kb) {
  let kbText = "";
  if (kb && Array.isArray(kb.modules)) {
    for (const m of kb.modules) {
      kbText += `\n\n## ${m.title || "Untitled"}`;
      if (m.subtitle) kbText += `\n${m.subtitle}`;
      if (m.aiNote) kbText += `\nHow to use this: ${m.aiNote}`;
      for (const s of m.sections || []) {
        kbText += `\n\n### ${s.heading || ""}\n${s.body || ""}`;
      }
    }
  }
  return (
`You are drafting a warm, personal email reply on behalf of Christina Carpenter — a homeschool mom of four and the founder of "Authentic Joy in the Journey" and the "Bloom and Blossom" conferences. She encourages, equips, and empowers homeschool mothers, mom to mom.

Voice: warm, encouraging, faith-friendly, never clinical or preachy. Speak as Christina in the first person ("I"). Address the mother by her first name. Reflect her specific answers back to her so she feels seen.

Ground your encouragement in Christina's own materials below. Draw on the relevant ideas naturally — don't quote section labels or sound like a textbook.${kbText ? "\n\nCHRISTINA'S MATERIALS:" + kbText : ""}

Rules:
- Keep it about 150–250 words.
- Offer one or two concrete, doable encouragements or ideas tied to what she shared.
- Do NOT invent events, dates, prices, or promises, and do NOT give medical, legal, or clinical advice.
- This is a DRAFT for Christina to review and edit before sending. Close warmly as Christina.`
  );
}

function buildUserMessage(sub) {
  const lines = [
    `A mother named ${sub.name || "(unknown)"} submitted the "${sub.questionnaire || "questionnaire"}".`,
    sub.preferredContact ? `Preferred contact: ${sub.preferredContact}.` : "",
    "",
    "Her answers:",
  ];
  for (const r of sub.responses || []) {
    lines.push(`- ${r.q}: ${r.a && r.a.trim() ? r.a.trim() : "(left blank)"}`);
  }
  lines.push("", "Write Christina's heartfelt draft reply now.");
  return lines.filter((l) => l !== null).join("\n");
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!(await requireAuth(context))) return json({ ok: false, error: "auth" }, 401);
  if (!env.AI_API_KEY) return json({ ok: false, error: "Server is missing AI_API_KEY." }, 500);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const id = (body.id || "").toString();
  if (!id) return json({ ok: false, error: "Missing submission id." }, 400);

  // load the submission
  const row = await env.DB.prepare("SELECT * FROM submissions WHERE id = ?").bind(id).first();
  if (!row) return json({ ok: false, error: "Submission not found." }, 404);
  const sub = rowToSub(row);

  // load the knowledge base
  let kb = null;
  const kbRow = await env.DB.prepare("SELECT data FROM content WHERE id='knowledge-base'").first();
  if (kbRow) { try { kb = JSON.parse(kbRow.data); } catch {} }

  // call the Anthropic Messages API
  let aiText = "";
  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.AI_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.AI_MODEL || "claude-sonnet-4-6",
        max_tokens: 800,
        system: buildSystem(kb),
        messages: [{ role: "user", content: buildUserMessage(sub) }],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json({ ok: false, error: `AI request failed (${resp.status}).`, detail: detail.slice(0, 500) }, 502);
    }
    const data = await resp.json();
    aiText = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
  } catch (e) {
    return json({ ok: false, error: "Could not reach the AI service." }, 502);
  }

  if (!aiText) return json({ ok: false, error: "The AI returned an empty draft." }, 502);

  // save the draft onto the submission
  await env.DB.prepare("UPDATE submissions SET ai_draft = ? WHERE id = ?").bind(aiText, id).run();

  return json({ ok: true, aiDraft: aiText });
}
