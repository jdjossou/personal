## Task 03 — Selection, Detail & Deep Linking

### Goal

Make the bond roster interactive and shareable: a visitor selects a role and its Social
Link detail swaps in (master–detail), and every role gets a direct, shareable URL
(`/experience/<slug>`) that cold-loads onto that bond. This is the proven recipe already
running in `Education/StatScreen.tsx` — **port it**, don't reinvent it. The two are
near-identical interaction models (slug-keyed selection + History-API deep link + ARIA
listbox), so this task is largely adaptation plus wiring the journal/links detail.

> Read the relevant guide in `node_modules/next/dist/docs/` before adding the dynamic
> route — this Next.js has breaking changes vs. training data (see `AGENTS.md`). Confirm
> the current `[slug]` convention by checking how the **existing**
> `src/app/education/[slug]/page.tsx` coexists with `src/app/education/page.tsx`, and
> copy that structure rather than assuming the App Router layout from memory.

---

### Selection Model (mirror `StatScreen`)

- Exactly one role is active at a time, **keyed by `slug`, not index** (so reordering
  `ROLES` never moves a link and the URL can drive selection). The detail follows
  selection; the active row carries the crimson/white selection band.
- **Default selection** = the most recent role (the first array entry / current job).
  Document it; Task 03's URL layer overrides it when a slug is present.
- The roster is an **ARIA listbox**: click / tap to select, arrows (up/down + left/right)
  to move with wrap, `Home`/`End` to jump, `Enter`/`Space` to confirm — selection
  follows focus. Lift the exact keyboard model and the `rowRefs` focus/scroll plumbing
  from `StatScreen.onListKeyDown` / `moveTo` / `registerRef`.
- The `SocialLinkBar` ← / → bumpers page the selection (wire them to the same `moveTo`,
  as `CheckStationBar` does).

---

### Detail Content

When a role is active, `BondDetail` shows from its `Role` record (Task 01):

- The header stack: job title (`Classmate` slot) · location (`ARCANA` micro-label) ·
  **company** (`Magician` slot) · `formatDateRange(start, end)` (`RANK n` slot).
- The `journal` paragraph as the hero body (the job description in journal voice).
- The `CompanyCard` (company tarot card) as focal art and the optional `companyBlurb`.
- **Links** — `links[]` rendered as clear actions (GitHub / case study / demo), opening
  in a new tab where `newTab`, and **not swallowed by row-selection handlers** (stop
  propagation, same care Projects' detail links take).
- A role with no `links` / no `logo` / no `companyBlurb` renders cleanly (monogram card;
  no empty action row or bio line).

---

### Deep Linking

URL scheme: **path segment** `/experience/<slug>` (cleanest to share), exactly like
`/education/<slug>`. Bare `/experience` shows the default selection.

Port the `StatScreen` URL machinery verbatim in spirit:

- `slugFromPath` / `pathForSlug` / `resolveActive` — the default role maps to the **bare
  base**, so there is exactly one canonical URL per state.
- **Seed `activeSlug` from `usePathname()`** in `useState`'s initializer so the correct
  bond renders on first paint (no flash of the default), both at `/experience` and a cold
  `/experience/<slug>`.
- **Selecting** mirrors the slug into the URL with the **native History API**
  (`history.pushState`) — shallow, so there is no Next navigation / remount / replayed
  `ScreenReveal`, but back/forward still works.
- **Cold deep link** (mount effect): bring the targeted row into view + focus it; an
  unknown/removed slug **degrades to the default** and cleans the URL via
  `replaceState` (never a hard 404 — a portfolio shouldn't 404 a removed job).
- **`popstate`** syncs selection ⇄ URL on back/forward (re-point selection, scroll into
  view), the one URL change we don't originate.

The dynamic route: add `src/app/experience/[slug]/page.tsx` that renders the **same**
`<SocialLinkScreen />` (the screen reads the active slug from `usePathname()`, so no param
is threaded down) and a `generateStaticParams()` returning `ROLES.map(r => ({ slug }))`,
exactly like `education/[slug]/page.tsx`. `dynamicParams` stays default-true so unlisted
slugs still render and degrade gracefully.

---

### Interaction With Transitions

In-page selection changes must **not** replay the section entry reveal — only the
cross-page arrival from the menu does (the shallow `pushState` guarantees this). Wiring
the entry reveal itself is Task 04; just don't break the shallow-update contract here.

---

### Accessibility

- Rows are real listbox options: focusable, keyboard-operable, correct roles, and the
  active option conveyed non-visually (`aria-selected` / `aria-current`), as in
  `TermRoster`.
- Links inside the detail are real, labelled controls with visible focus.

---

### What This Task Produces

- Click / tap / keyboard / bumper selection of a role, the active row marked in Persona
  selection style, the `BondDetail` swapping to match.
- Working external links in the detail that don't conflict with row selection.
- A shareable `/experience/<slug>` per role: cold-loading opens that bond selected,
  detailed, and in view; unknown slugs degrade to the default and clean the URL;
  back/forward navigates between bonds.
- Selection tracked by `slug`; `src/app/experience/[slug]/page.tsx` added with
  `generateStaticParams`. No entry/exit transitions or sound yet (Task 04).
