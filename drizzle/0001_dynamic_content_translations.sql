CREATE TABLE IF NOT EXISTS "job_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"language" text NOT NULL,
	"title" text,
	"subtitle" text,
	"company_description" text,
	"tasks" text,
	"requirements" text,
	"benefits" text,
	"location" text,
	"salary_details" text,
	"work_time" text,
	"work_time_details" text,
	"contact_role" text,
	"slug" text,
	"source_hash" text,
	"status" text DEFAULT 'auto' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_translations" ADD COLUMN IF NOT EXISTS "source_hash" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_trans_job_lang_idx" ON "job_translations" USING btree ("job_id","language");
