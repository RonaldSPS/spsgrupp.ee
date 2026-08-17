ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "page_url" text DEFAULT '' NOT NULL;
