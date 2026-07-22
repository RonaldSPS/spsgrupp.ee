-- Enable RLS on all public tables
ALTER TABLE "blog_edits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_announcements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonial_translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;

-- Public content tables: allow anonymous read, authenticated full access
CREATE POLICY "anon_read_blog" ON "blog_edits" FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_blog_tr" ON "blog_translations" FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_jobs" ON "job_announcements" FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_job_tr" ON "job_translations" FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_testimonials" ON "testimonials" FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_testimonial_tr" ON "testimonial_translations" FOR SELECT TO anon USING (true);

-- Authenticated users: full CRUD on content tables
CREATE POLICY "auth_all_blog" ON "blog_edits" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_blog_tr" ON "blog_translations" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_jobs" ON "job_announcements" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_job_tr" ON "job_translations" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_testimonials" ON "testimonials" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_testimonial_tr" ON "testimonial_translations" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin-only tables: authenticated full access, no anon access
CREATE POLICY "auth_all_settings" ON "system_settings" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_admin_users" ON "admin_users" FOR ALL TO authenticated USING (true) WITH CHECK (true);
