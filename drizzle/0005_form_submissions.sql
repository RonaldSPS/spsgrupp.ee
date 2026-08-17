CREATE TABLE IF NOT EXISTS "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form" text NOT NULL,
	"locale" text DEFAULT '' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"workload" text DEFAULT '' NOT NULL,
	"work_time" text DEFAULT '' NOT NULL,
	"attachment_name" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "form_submissions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP POLICY IF EXISTS "auth_all_form_submissions" ON "form_submissions";
--> statement-breakpoint
CREATE POLICY "auth_all_form_submissions" ON "form_submissions" FOR ALL TO authenticated USING (true) WITH CHECK (true);
