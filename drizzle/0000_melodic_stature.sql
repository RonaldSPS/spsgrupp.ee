CREATE TABLE "blog_edits" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text,
	"slug" text,
	"content_html" text,
	"featured_image" text,
	"excerpt" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"language" text NOT NULL,
	"title" text,
	"slug" text,
	"excerpt" text,
	"content_html" text,
	"status" text DEFAULT 'auto' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"published_date" text DEFAULT '' NOT NULL,
	"offer_number" text DEFAULT '' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"registry_code" text DEFAULT '' NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"company_description" text DEFAULT '' NOT NULL,
	"tasks" text DEFAULT '' NOT NULL,
	"requirements" text DEFAULT '' NOT NULL,
	"benefits" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"vacancies" integer DEFAULT 1 NOT NULL,
	"salary" real DEFAULT 0 NOT NULL,
	"salary_unit" text DEFAULT 'EUR' NOT NULL,
	"salary_details" text DEFAULT '' NOT NULL,
	"work_time" text DEFAULT '' NOT NULL,
	"work_time_details" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"application_deadline" text DEFAULT '' NOT NULL,
	"contact_name" text DEFAULT '' NOT NULL,
	"contact_role" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_phone2" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"slug" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blog_trans_blog_lang_idx" ON "blog_translations" USING btree ("blog_id","language");