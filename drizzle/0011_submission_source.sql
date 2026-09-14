ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "source" text DEFAULT '' NOT NULL;
