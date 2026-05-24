# DESIGN.md — Visual System

> **Read before any UI work.** Update when tokens change.

## Brand identity

**Personality:** [3-5 adjectives — e.g. confident, calm, modern, approachable]
**Avoid:** [what the brand is NOT — e.g. childish, corporate-sterile, trendy-flashy]

## Color tokens

Define once in `app/globals.css` as CSS variables, consume via Tailwind.

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    --primary: [HSL];        /* Main brand color */
    --primary-foreground: [HSL];

    --secondary: [HSL];
    --accent: [HSL];          /* Highlights, CTAs */

    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: [HSL same as primary];

    --destructive: 0 84% 60%;
    --success: 142 76% 36%;
    --warning: 38 92% 50%;

    --radius: 0.5rem;
  }

  .dark { /* dark mode overrides */ }
}
```

**Rule:** Never hardcode hex values in components. Always use semantic tokens (`bg-primary`, `text-muted-foreground`).

## Typography

- **Font:** [e.g. Inter via `next/font/google`]
- **Display font (optional):** [if using a separate heading font]

| Use | Class | Size | Weight |
|---|---|---|---|
| Display (hero) | `text-5xl md:text-6xl font-bold tracking-tight` | 48-60px | 700 |
| H1 | `text-4xl font-bold tracking-tight` | 36px | 700 |
| H2 | `text-3xl font-semibold tracking-tight` | 30px | 600 |
| H3 | `text-xl font-semibold` | 20px | 600 |
| Body | `text-base leading-relaxed` | 16px | 400 |
| Small | `text-sm text-muted-foreground` | 14px | 400 |
| Caption | `text-xs text-muted-foreground uppercase tracking-wide` | 12px | 400 |

## Spacing & layout

- **Base unit:** 4px (Tailwind default).
- **Section padding:** `py-16 md:py-24` for marketing sections.
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Define once, reuse.
- **Card padding:** `p-6` standard, `p-4` compact, `p-8` generous.

## Radius & shadows

- **Radius:** `--radius` token. Use `rounded-md` (default), `rounded-lg` (cards), `rounded-full` (avatars, pills).
- **Shadow scale:** `shadow-sm` (subtle borders), `shadow-md` (cards), `shadow-lg` (modals, popovers). Skip `shadow-xl+` unless intentional.

## Component patterns

### Buttons
- Primary action per view: ONE `Button` (default variant).
- Secondary: `variant="outline"`.
- Tertiary: `variant="ghost"`.
- Destructive: `variant="destructive"` — confirm before destructive actions.

### Forms
- Label always visible (no placeholder-as-label).
- Errors below the field, red, `text-sm`.
- Required fields marked with `*`.
- Submit button shows loading state (`disabled` + spinner).

### Empty states
- Every list/table needs an empty state.
- Pattern: icon + headline + 1-line description + primary action.

### Loading states
- Skeletons that match the final layout, not generic spinners.
- For full-page: `loading.tsx` with skeleton.
- For inline: shadcn `Skeleton`.

### Toasts (sonner)
- Success: 3s auto-dismiss.
- Error: stays until dismissed, includes retry if applicable.
- Never use toasts for critical info — use inline UI.

## Responsive breakpoints

Tailwind defaults — design mobile-first.
- `sm` 640 — large phone / small tablet
- `md` 768 — tablet
- `lg` 1024 — small laptop
- `xl` 1280 — desktop
- `2xl` 1536 — large desktop

**Test at 375px width minimum.** Most real users are on phones.

## Accessibility floor

- Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text.
- All interactive elements keyboard-accessible.
- Focus rings visible — never `outline-none` without a replacement.
- Form inputs have associated `<label>`.
- Images have `alt` (empty `alt=""` for decorative).
- Headings in order — no jumping h1 → h3.

## Anti-patterns (do not do)

- ❌ Inline styles (`style={{...}}`) — use Tailwind.
- ❌ Hardcoded colors — use tokens.
- ❌ Custom CSS files per component — Tailwind only, with `@apply` rare.
- ❌ Three different button styles on one screen.
- ❌ Modal inside modal.
- ❌ Carousels for primary content (users miss slides 2+).
- ❌ Auto-playing video with sound.
- ❌ Hover-only interactions (broken on touch).
