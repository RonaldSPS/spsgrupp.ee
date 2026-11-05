-- Kliendilugude admin-muudatuste overlay (baas-sisu elab app/(et)/kliendilood/stories.ts).
-- Sama muster nagu blog_edits: partial-veljed; NULL = kasuta baasväärtust.

CREATE TABLE IF NOT EXISTS case_study_edits (
  id text PRIMARY KEY,
  title text,
  slug text,
  excerpt text,
  hero_image text,
  meta_title text,
  meta_description text,
  tldr_html text,
  body_html text,
  quote_text text,
  quote_author text,
  quote_role text,
  facts_text text,
  faq_text text,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
