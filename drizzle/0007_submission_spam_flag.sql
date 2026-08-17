ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "is_spam" boolean DEFAULT false NOT NULL;
