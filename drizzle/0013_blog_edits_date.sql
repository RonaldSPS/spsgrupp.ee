-- Allow admins to override a blog post's publication date from the admin UI.
-- Text column keeps the "YYYY-MM-DD HH:MM:SS" format used by posts.generated.ts
-- so scheduling (isPublished in app/(et)/blog/data.ts) compares like for like.
ALTER TABLE "blog_edits" ADD COLUMN IF NOT EXISTS "date" text;
