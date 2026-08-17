ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "fee" numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "profit" numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "notes" text DEFAULT '' NOT NULL;
