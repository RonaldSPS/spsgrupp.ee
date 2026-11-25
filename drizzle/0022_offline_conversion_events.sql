-- 25.11.2026: per-submission offline-conversion event log so the admin
-- inquiries table can show whether each gclid-carrying contact form was
-- actually sent to Google (not just that the weekly upload HTTP 200'd).
CREATE TABLE IF NOT EXISTS "offline_conversion_events" (
  "id" serial PRIMARY KEY,
  "submission_id" integer NOT NULL,
  "event_type" text NOT NULL,
  "run_id" integer REFERENCES "offline_conversion_uploads" ("id") ON DELETE CASCADE,
  "status" text NOT NULL,
  "error_message" text NOT NULL DEFAULT '',
  "uploaded_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "offline_conv_events_submission_idx" ON "offline_conversion_events" ("submission_id");
CREATE INDEX IF NOT EXISTS "offline_conv_events_run_idx" ON "offline_conversion_events" ("run_id");
