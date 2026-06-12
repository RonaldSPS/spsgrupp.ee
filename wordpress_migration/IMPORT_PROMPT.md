# AprilBuild blog import prompt

Import the prepared WordPress posts into the existing Next.js blog in `D:\WORKS\SPS\2026AprillWeb\AprilBuild`.

Before editing Next.js code, read the relevant guides in `node_modules/next/dist/docs/` as required by `AGENTS.md`. Preserve unrelated working-tree changes. No text may be smaller than 15px.

Use these prepared artifacts:

- `wordpress_migration/prepared/index.json`: audit, comparison, and post manifest.
- `wordpress_migration/prepared/posts/post-*.json`: 40 cleaned post records.
- `wordpress_migration/prepared/media/`: all referenced images.

Implementation requirements:

1. Copy the prepared media tree to `public/blog-media/`, preserving its year/month paths and Unicode filenames.
2. Replace the empty placeholder dataset in `app/blog/data.ts` with a typed build-time loader or generated data module based on the prepared JSON files. Do not manually paste the articles into TSX.
3. Use the supplied newer post for shared WordPress IDs. The prepared package has already merged in the three older-only posts.
4. Render `contentHtml` as trusted, locally generated static HTML. Add article styling for headings, paragraphs, lists, links, figures, and inline images. Do not split the HTML into newline paragraphs.
5. Use each post's supplied `featuredImage`. All 40 posts have one; six are marked `first-content-image` because WordPress lacked `_thumbnail_id` metadata.
6. Import only the 30 records marked `migrationStatus: "ready"`.
7. Do not import the ten records marked `excluded-image-only`. Both backups contain only their title and featured image, with no article body to recover, and the user has chosen to skip them.
8. The four Russian records are identified by `language: "ru"` (IDs 6498, 6364, 6369, and 6371). Keep them out of the default Estonian listing unless the app already has a Russian locale route.
9. Preserve slugs, dates, titles, excerpts, internal links, inline images, and YouTube links. Add canonical and Open Graph image metadata from the imported records.
10. Remove the current fallback image rotation. Never substitute a random image when a supplied featured image exists.
11. Fix all blog-page font sizes below 15px while touching those files, including breadcrumbs, category labels, dates, and related-post metadata.
12. Run lint/build checks, start the app, and verify the blog index plus representative posts: one modern post, post 4747 with multiple inline media items, one Russian post's exclusion from the Estonian listing, and confirmation that no excluded image-only entries were imported.

Do not reintroduce WordPress, Avada, caption, or Contact Form 7 shortcodes. The prepared content contains no remaining shortcodes or missing media references.
