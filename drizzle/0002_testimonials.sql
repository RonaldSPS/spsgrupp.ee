CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"category_title" text DEFAULT '' NOT NULL,
	"category_href" text DEFAULT '' NOT NULL,
	"quote" text DEFAULT '' NOT NULL,
	"short_quote" text DEFAULT '' NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"initials" text DEFAULT '' NOT NULL,
	"logo" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonial_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"testimonial_id" text NOT NULL,
	"language" text NOT NULL,
	"category_title" text,
	"quote" text,
	"short_quote" text,
	"source_hash" text,
	"status" text DEFAULT 'auto' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "testimonial_trans_testimonial_lang_idx" ON "testimonial_translations" USING btree ("testimonial_id","language");
