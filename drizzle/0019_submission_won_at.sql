-- 24.11.2026: track when a submission's sales status changed to "won" for offline conversion upload.
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS won_at timestamp with time zone;
