# WORKFLOW.md — How to run a session

> The exact ritual for starting, working, and ending a build session.

## Session start (first 5 minutes — non-negotiable)

1. **Read `CLAUDE.md`** — re-anchor on rules and stack.
2. **Read the last 2-3 entries in `SESSIONS.md`** — what's the state, what's pending.
3. **Read `LESSONS.md`** — at least skim, especially any entries from the past week.
4. **Read `ROADMAP.md`** — confirm what's next is still what's next.
5. **State the session goal in one sentence** — write it as the first line of your scratchpad.

If any of these files are missing or out of date, fix that first.

## Working rhythm

**One task, fully done, then next.** Do not jump between half-done features.

For each task:

1. **Plan** — write 3-7 bullet steps before opening any file. If the plan is longer than 7 bullets, the task is too big — split it.
2. **Implement** — smallest change that works. Resist refactoring on the side.
3. **Verify** —
   - `npm run build` (catches type + import errors)
   - `npm run lint`
   - Manually test in the browser at the actual route
   - Test the unhappy path (logged out, no data, network slow)
4. **Commit** — clear message: `feat(auth): add password reset flow` or `fix(dashboard): handle empty state`
5. **Update docs** — if a new pattern emerged → `ARCHITECTURE.md`. If something surprised you → `LESSONS.md`.

## When stuck (>15 min on the same problem)

1. State the problem out loud (or in writing) in one sentence.
2. Check `LESSONS.md` for a similar past issue.
3. Check the actual error message — read it word for word, don't skim.
4. Reproduce in isolation (smallest possible repro).
5. If still stuck after 30 min — stop, write what you tried, switch tasks, come back fresh.

Whatever the resolution: **add it to `LESSONS.md`**.

## Session end (last 5 minutes — non-negotiable)

1. **Run the full check:** `npm run build && npm run lint`. Both must pass.
2. **Commit and push** all work, even WIP (in a branch if not done).
3. **Append a new entry to `SESSIONS.md`** using the template. Be honest about what didn't get done.
4. **Update `ROADMAP.md`** if priorities shifted.
5. **Add any new lessons to `LESSONS.md`.**

If you skip the session log, the memory system breaks. Future sessions will repeat past mistakes.

## Git hygiene

- Branch per feature: `feat/auth-flow`, `fix/empty-cart`.
- Commit often, push at session end at minimum.
- Commit message format: `type(scope): summary` (`feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`).
- Squash before merging to `main` if the branch has noise.

## Environment checks (run when something feels off)

```bash
node --version            # matches CLAUDE.md pinned version?
npm --version
npx next --version        # Next.js version still 15.x?
git status                # clean? on the right branch?
git log --oneline -5      # recent commits make sense?
```

## What to ask the human

Ask when:
- A decision changes the architecture
- A new dependency is needed
- The task as written is ambiguous in a way that affects implementation
- You're about to do something destructive (drop table, force-push, delete files)

Do NOT ask when:
- The answer is in `CLAUDE.md`, `ARCHITECTURE.md`, or `DESIGN.md`
- It's a stylistic micro-decision (just pick and document)
- You can try it and revert in 30 seconds

## Anti-patterns for the builder

- ❌ Editing 8 files at once "to get it all done"
- ❌ Skipping the session log because "it was a small session"
- ❌ Adding a dependency without asking
- ❌ Disabling TS errors with `any` instead of fixing the type
- ❌ Commenting out broken code instead of removing or fixing it
- ❌ "I'll document it later" — later never comes
