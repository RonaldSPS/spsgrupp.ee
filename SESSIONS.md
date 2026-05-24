# SESSIONS.md — Build Log

> **At session START:** read the last 2-3 entries.
> **At session END:** append a new entry. No exceptions.

---

## Template (copy this for each new entry)

```
## Session [NN] — YYYY-MM-DD — [short title]

**Goal going in:** [what you set out to do]

**What got done:**
- [bullet list of completed work]
- [include file paths for major changes]

**What did NOT get done (and why):**
- [carry-overs to next session]

**Decisions made:**
- [architectural / product / design choices, with reasoning]

**Surprises & blockers:**
- [anything unexpected — links to LESSONS.md entries if added]

**Tests run:**
- [build pass/fail, lint, manual test scenarios]

**State of the project:**
- Working: [what's functional right now]
- Broken / WIP: [what's in progress, what's known broken]

**Next session should:**
1. [most important thing to pick up]
2. [...]
3. [...]

**Time spent:** [rough hours]
```

---

## Session 00 — YYYY-MM-DD — Project bootstrap

**Goal going in:** Set up Next.js 15 + Supabase + Tailwind + shadcn baseline.

**What got done:**
- Initialized Next.js 15 with TS, App Router, Tailwind
- Installed shadcn/ui, configured theme tokens in `globals.css`
- Connected Supabase, set up three clients in `lib/supabase/`
- Configured middleware for session refresh
- Created `CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN.md`, `LESSONS.md`, `SESSIONS.md`, `WORKFLOW.md`, `ROADMAP.md`
- First commit pushed to GitHub
- Vercel project linked, env vars set

**Decisions made:**
- npm (not pnpm) for consistency with other projects
- Server Actions over /api routes by default
- shadcn/ui as component baseline, no Material/Chakra

**Next session should:**
1. Build auth flow (login, signup, password reset)
2. Define core DB schema + first migration
3. Add protected route group with layout
```
