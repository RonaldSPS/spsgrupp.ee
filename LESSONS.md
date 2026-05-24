# LESSONS.md — Mistakes → Fixes

> **Read before coding.** This is the project's memory of what went wrong and how to avoid it.
> **Update whenever** something breaks, surprises you, or you spend >15 min debugging.

## How to write an entry

Each lesson has 4 parts. Keep it short — future-you should grok it in 30 seconds.

```
### [Short title — what went wrong]
**Date:** YYYY-MM-DD | **Session:** NN
**Symptom:** [what you saw — error message, broken behavior]
**Root cause:** [what was actually wrong]
**Fix:** [what to do instead — code snippet if helpful]
**Rule:** [one-line takeaway to apply going forward]
```

---

## Pre-seeded lessons (common Next.js 15 / Supabase pitfalls)

### Using getSession() server-side returns unverified data
**Symptom:** Auth seems to work but security feels wrong.
**Root cause:** `supabase.auth.getSession()` reads cookies without verifying the JWT. An attacker can forge it.
**Fix:** Use `supabase.auth.getUser()` server-side. It calls Supabase to verify.
**Rule:** `getUser()` on the server, `getSession()` only in the browser.

### "use client" cascading too far up the tree
**Symptom:** Bundle size balloons, server features stop working in pages.
**Root cause:** Adding `"use client"` to a parent makes all children client components.
**Fix:** Push `"use client"` as deep as possible. Pass server-fetched data down as props.
**Rule:** A client component can render server children only if passed as `children` prop.

### Forgetting revalidatePath after mutations
**Symptom:** Data updates in DB but UI shows stale values until hard refresh.
**Root cause:** Next.js caches Server Component renders. Mutations don't auto-invalidate.
**Fix:** Call `revalidatePath("/route")` or `revalidateTag("tag")` at the end of every Server Action.
**Rule:** Every mutation Server Action ends with revalidation + return.

### RLS policies blocking legit queries silently
**Symptom:** Query returns empty array, no error.
**Root cause:** RLS enabled but no SELECT policy for the user's role.
**Fix:** Test policies in Supabase SQL editor with `set role authenticated; set request.jwt.claim.sub = '<user-id>';`.
**Rule:** When a query returns empty unexpectedly, suspect RLS first.

### Env vars not available in client components
**Symptom:** `process.env.MY_VAR` is undefined in the browser.
**Root cause:** Only vars prefixed `NEXT_PUBLIC_` are exposed to the client.
**Fix:** Rename to `NEXT_PUBLIC_*` if it's safe to expose; otherwise read it in a Server Component / Action.
**Rule:** Default to server-only. Promote to `NEXT_PUBLIC_` only with intent.

### Server Actions failing on FormData with files
**Symptom:** File uploads truncated or empty in Server Action.
**Root cause:** Default body size limit is 1MB.
**Fix:** Set `export const maxDuration` and configure body size in `next.config.js`, or upload directly to Supabase Storage from the client with a signed URL.
**Rule:** For files >1MB, upload client → Supabase Storage directly, then save the URL via Server Action.

### Type mismatch after schema migration
**Symptom:** TS errors everywhere after a DB change.
**Root cause:** `types/database.ts` is stale.
**Fix:** Re-run `npx supabase gen types typescript --local > types/database.ts`.
**Rule:** Regenerate types as the LAST step of every migration.

### Vercel build fails but local build passes
**Symptom:** `npm run build` works locally, Vercel errors out.
**Root cause:** Usually one of: case-sensitive filename (Linux vs Windows), missing env var on Vercel, or `devDependency` used in production code.
**Fix:** Check imports for case mismatches; verify env vars in Vercel dashboard match `.env.local`; move misplaced packages from `devDependencies` to `dependencies`.
**Rule:** Always test `npm run build` locally before pushing. Filenames are case-sensitive on deploy.

### Middleware loop redirecting forever
**Symptom:** Browser shows "too many redirects".
**Root cause:** Middleware redirects unauthenticated users to `/login`, but `/login` itself is being checked → loop.
**Fix:** Exclude auth routes from the middleware matcher or check `pathname.startsWith("/login")` and skip.
**Rule:** Always whitelist auth routes in middleware.

### Hydration mismatch from Date / Math.random
**Symptom:** Console error: "Text content does not match server-rendered HTML."
**Root cause:** Server and client rendered different output (timestamps, random IDs, locale-dependent formatting).
**Fix:** Move the dynamic value into `useEffect`, or use `suppressHydrationWarning` for known-safe cases (rare).
**Rule:** Anything time/random/locale-dependent renders client-side after mount.

---

## Project-specific lessons

> Append new lessons below. Newest at the bottom.

<!-- Add yours here -->
