-- Cloudflare D1 schema for the Authentic Joy in the Journey site
-- Run with:  npx wrangler d1 execute cc-db --file=./schema.sql --remote

CREATE TABLE IF NOT EXISTS submissions (
  id                TEXT PRIMARY KEY,
  created_at        TEXT NOT NULL,
  type              TEXT DEFAULT 'questionnaire',   -- 'questionnaire' | 'contact'
  questionnaire     TEXT,
  name              TEXT,
  email             TEXT,
  phone             TEXT,
  preferred_contact TEXT,
  responses         TEXT,                            -- JSON array of {q,a}
  status            TEXT DEFAULT 'new',              -- new | in-progress | responded | archived
  response          TEXT DEFAULT '',                 -- Christina's reply
  ai_draft          TEXT DEFAULT '',                 -- reserved for the automated response
  responded_at      TEXT
);
CREATE INDEX IF NOT EXISTS idx_sub_created ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_status  ON submissions(status);

CREATE TABLE IF NOT EXISTS content (
  id          TEXT PRIMARY KEY,                       -- always 'knowledge-base'
  data        TEXT NOT NULL,                          -- JSON: { version, updatedAt, modules:[...] }
  updated_at  TEXT
);
