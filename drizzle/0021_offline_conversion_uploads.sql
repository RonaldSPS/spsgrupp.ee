-- 25.11.2026: store each automated offline-conversion upload run so the weekly
-- report can show whether Google actually processed the events (not just HTTP 200).
CREATE TABLE IF NOT EXISTS "offline_conversion_uploads" (
  "id" serial PRIMARY KEY,
  "run_at" timestamp with time zone NOT NULL DEFAULT now(),
  "candidates" integer NOT NULL DEFAULT 0,
  "uploaded" integer NOT NULL DEFAULT 0,
  "skipped_no_value" integer NOT NULL DEFAULT 0,
  "action_resource_name" text NOT NULL DEFAULT '',
  "action_created" boolean NOT NULL DEFAULT false,
  "won_candidates" integer NOT NULL DEFAULT 0,
  "won_uploaded" integer NOT NULL DEFAULT 0,
  "won_skipped_no_value" integer NOT NULL DEFAULT 0,
  "won_action_resource_name" text NOT NULL DEFAULT '',
  "won_action_created" boolean NOT NULL DEFAULT false,
  "dry_run" boolean NOT NULL DEFAULT false,
  "request_id" text NOT NULL DEFAULT '',
  "errors" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "form_results" jsonb,
  "won_results" jsonb
);

CREATE INDEX IF NOT EXISTS "offline_conv_uploads_run_at_idx" ON "offline_conversion_uploads" ("run_at" DESC);
