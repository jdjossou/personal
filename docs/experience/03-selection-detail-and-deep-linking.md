## Task 03 — Selection, Detail & Deep Linking

> **Status (2026-06-14): NOT STARTED — this is the next task.**
> The page currently renders a single, hard-coded role (`activeIndex = 0` in
> [`SocialLinkScreen.tsx`](../../src/components/Experience/SocialLinkScreen.tsx)).
> Both `NavButton`s are wired to a `noop`, `BondPager` is a static indicator, and
> there is no `src/app/experience/[slug]/page.tsx`. Task 03 makes the page
> multi-role and shareable.

> **Read this first — the design changed.** The original tarot/journal/master-detail
> brief in [`00-overview.md`](00-overview.md) / [`01`](01-data-model-and-content.md) /
> [`02`](02-social-link-screen-layout.md) was **superseded by**
> [`redesign.md`](redesign.md) and the shipped code. The page is now a single-role
> **collage** (EXPERIENCE title · Prev/Next · `ExperienceCard` · `JobPanels` ★ bullets
> · `TechStack` · `BondPager` · Back), not a roster→detail split. So selection here is
> a **pager** (one role on screen at a time, paged with Prev/Next), **not** an ARIA
> listbox. Ignore the listbox/`BondRoster`/`TermRoster` framing below where it conflicts
> — keep only the `StatScreen` URL machinery, which still applies verbatim.

### Goal

Make the collage page **multi-role and shareable**: a visitor pages between roles with
Previous / Next (and arrow keys), the whole collage swaps to the selected role, and every
role gets a direct, shareable URL (`/experience/<slug>`) that cold-loads onto that role.
The deep-link half is the proven recipe already running in
[`Education/StatScreen.tsx`](../../src/components/Education/StatScreen.tsx) — **port it**,
don't reinvent it.

---

### Selection Model (pager, not listbox)

Replace the constant `activeIndex = 0` with real selection state in `SocialLinkScreen`:

- Exactly one role is active at a time, **keyed by `slug`, not index** (so reordering
  `ROLES` never moves a link and the URL can drive selection). Derive the index from the
  slug for the components that take `activeIndex` / `roleCount` (`ExperienceCard`,
  `BondPager`).
- **Default selection** = the most recent role (`ROLES[0]` / current job). The URL layer
  below overrides it when a slug is present.
- **Paging:** wire both `NavButton`s (`SocialLinkBar.NavButton`, `dir="prev"|"next"`) to a
  `moveTo`/`step(±1)` that advances the active role **with wrap** (prev on the first role
  → last, next on the last → first). `BondPager` must reflect the live active index.
- **Keyboard:** a window-level (or focused-region) listener — `ArrowLeft`/`ArrowRight`
  (and `ArrowUp`/`ArrowDown`) page prev/next with wrap; `Home`/`End` jump to
  first/last. Keep these from clashing with the existing `Escape` → back-to-menu listener.
- On every selection change, re-derive `role`, `dates`, and pass the new `role.bullets` /
  `role.technologies` down so `ExperienceCard`, `JobPanels`, and `TechStack` all swap.
  (Note `TechStack` holds per-token drag positions — reset/re-seed them on role change so
  a new role's tokens don't inherit the previous role's scattered layout.)

There is **no clickable roster** in this design, so there is no listbox/`rowRefs`
plumbing to port — selection is driven entirely by the pager + keys + the URL.

---

### Detail Content (already rendered — just needs to swap)

The collage already renders everything from the active `Role`; Task 03 only has to feed it
the *selected* role instead of `ROLES[0]`:

- `ExperienceCard` ← `company` · `role` · `location` · `formatDateRange(start, end)`.
- `JobPanels` ← `bullets` (the ★ highlights collage).
- `TechStack` ← `technologies`.
- `BondPager` / `ExperienceCard` ← `activeIndex`, `roleCount`.

Two `Role` fields are **defined but not yet rendered anywhere** — decide during this task:
- `summary` — the redesign's bottom-right one-line identity blurb (`redesign.md §9.2`).
  Either surface it (e.g. near the card / above tech) or drop the field. Currently dead.
- `links?: RoleLink[]` — typed but unused and absent from all seed data. If you want
  per-role links (GitHub / case study), render them as real, labelled controls (new tab
  where `newTab`), with visible focus; otherwise remove the type to avoid dead surface.

---

### Deep Linking (port `StatScreen` verbatim in spirit)

URL scheme: **path segment** `/experience/<slug>`, exactly like `/education/<slug>`. Bare
`/experience` shows the default (most-recent) role.

- Port `slugFromPath` / `pathForSlug` / `resolveActive` from `StatScreen` — the default
  role maps to the **bare base** so there is exactly one canonical URL per state.
- **Seed `activeSlug` from `usePathname()`** in the `useState` initializer so the right
  role renders on first paint (no flash of the default), both at `/experience` and a cold
  `/experience/<slug>`. `usePathname()` returns the real path during SSR.
- **Selecting** mirrors the slug into the URL with the **native History API**
  (`window.history.pushState`) — shallow, so no Next navigation / remount / replayed
  `ScreenReveal` (Task 04), but back/forward still works. Keep this writer **sound-free**.
- **Cold deep link** (mount effect): point selection at the targeted slug; an
  unknown/removed slug **degrades to the default** and cleans the URL via `replaceState`
  (never a hard 404 — a portfolio shouldn't 404 a removed job).
- **`popstate`** re-points selection on back/forward — the one URL change we don't
  originate.

The dynamic route: add `src/app/experience/[slug]/page.tsx` that renders the **same**
`<SocialLinkScreen />` (the screen reads the active slug from `usePathname()`, so no param
is threaded down) plus `generateStaticParams()` returning `ROLES.map(r => ({ slug: r.slug }))`
— copy the structure of the **existing**
[`src/app/education/[slug]/page.tsx`](../../src/app/education/[slug]/page.tsx) (confirm the
current App-Router `[slug]` convention there before writing — this Next.js differs from
training data, per `AGENTS.md`). `dynamicParams` stays default-true so unlisted slugs still
render and degrade gracefully.

---

### Interaction With Transitions

In-page paging must **not** replay the section entry reveal — only the cross-page arrival
from the menu does (the shallow `pushState` guarantees this). Wiring the entry reveal
itself is Task 04; just don't break the shallow-update contract here.

---

### Accessibility

- `NavButton`s are real, labelled `<button>`s with visible focus and `aria-label`
  ("Previous experience" / "Next experience").
- The active role is conveyed non-visually (e.g. `aria-current`/live announcement when the
  collage swaps), and `BondPager` exposes position (`aria-label="Experience n of m"`).
- Any per-role links (if kept) are real, labelled controls with visible focus.

---

### What This Task Produces

- Prev/Next + keyboard paging through `ROLES` (with wrap), the whole collage
  (`ExperienceCard` · `JobPanels` · `TechStack` · `BondPager`) swapping to the active role.
- A shareable `/experience/<slug>` per role: cold-loading opens that role; unknown slugs
  degrade to the default and clean the URL; back/forward pages between roles.
- Selection tracked by `slug`; `src/app/experience/[slug]/page.tsx` added with
  `generateStaticParams`.
- A decision made on the dead `summary` / `links` fields (surfaced or removed).
- No entry/exit reveal or move/confirm sound yet (Task 04 — back-to-menu + `cancel` sound
  are already wired in `SocialLinkScreen`).
