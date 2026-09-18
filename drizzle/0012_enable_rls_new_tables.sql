-- Enable RLS on tables created after 0004_enable_rls.sql
-- (fixes Supabase security advisor rls_disabled_in_public).
-- Deliberately NO policies: form_submissions holds PII and weekly_reports is
-- internal -- both are admin-only. The app connects as the `postgres` role
-- (DATABASE_URL), which bypasses RLS; anon/authenticated are fully denied.
ALTER TABLE "form_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "weekly_reports" ENABLE ROW LEVEL SECURITY;
