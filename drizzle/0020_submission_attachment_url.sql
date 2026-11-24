-- 24.11.2026: store public URL of uploaded form attachments so admins can open them in paringud.
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS attachment_url text NOT NULL DEFAULT '';
