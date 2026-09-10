CREATE TABLE IF NOT EXISTS "weekly_reports" (
  "id" serial PRIMARY KEY,
  "week_start" date NOT NULL,
  "week_end" date NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "snapshot" jsonb NOT NULL,
  "insights" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "narrative" text NOT NULL DEFAULT '',
  "email_sent_at" timestamp with time zone,
  "email_error" text NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX IF NOT EXISTS "weekly_reports_week_idx" ON "weekly_reports" ("week_start", "week_end");
