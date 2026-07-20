ALTER TABLE "blog_edits" ADD COLUMN "active" boolean NOT NULL DEFAULT true;

CREATE TABLE "system_settings" (
  "key" text PRIMARY KEY NOT NULL,
  "value" text NOT NULL DEFAULT '',
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "admin_users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "display_name" text NOT NULL DEFAULT '',
  "role" text NOT NULL DEFAULT 'manager',
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
