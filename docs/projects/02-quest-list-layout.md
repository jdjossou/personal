## Task 02 — Quest List Layout (Mission List)

### Goal

Build the static, data-driven quest log: render `PROJECTS` (Task 01) as a list
of numbered mission rows over the shared P3R water background. No selection, no
expansion, no deep linking yet — just the correct visual structure and
typography. This is the screen's backbone; Tasks 03–05 add behaviour on top.

**The important rule from `goal.md`: no generic rounded project cards.** This
must read as a Persona *quest log / mission list*, not a portfolio card grid.

---

### Reference

See `reference.png` in this folder (Persona 3 Reload's Quest screen):

- A `QUEST` header at the top-left, with a sort affordance on the right
  (`Sort by No.`).
- A vertical list of rows. Each row carries a **number** (`/1`, `/2`, …), a
  **name**, a secondary middle column, and a **status badge** pinned right
  (`InProgress` / `Done`).
- Rows are flat, edge-to-edge, separated by thin rules — **not** boxed cards.
  Alternating row tint / a highlighted row, sharp not rounded.
- A lower **detail region** (the `Task` block) — built out in Task 03; just
  reserve the space here.
- A bottom hint line (`Which project do you want to view?`) and footer controls.

Repurpose this composition for the portfolio:

- `QUEST` header → section title (e.g. `PROJECTS`).
- Each quest row → one `Project`.
- The `InProgress` / `Done` badge
  status badge.

---

### Row Anatomy

Each row maps one-to-one to a `Project` and shows, left → right:

- **Index** — `/01`, `/02`, `/03` … zero-padded, derived from array order
  (monospace, subdued — it's the quest number).
- **Name** — the project name, the dominant text in the row.
- **Date range** — `formatDateRange(start, end)` from Task 01 (`2025.03 — 2025.06`,
  or `2025.03 —` for ongoing).
- **Tags** — compact, system-tag styled (monospace, low-key); truncate/cap how
  many show in the row if space is tight.
- **Status badge** — pinned to the right edge like the reference's
  `InProgress` / `Done` chip. One visual per status (colour comes below).

Rows must be individually targetable elements (Task 03 selection + Task 04 deep
link will key off the project `slug`).

---

### Status Badge Styling

Three states, visually distinct and instantly scannable (sharp, not pill-soft):

- `SHIPPED` — confident / positive accent.
- `IN PROGRESS` — active / in-flight accent (echoes the reference's blue
  `InProgress`).

Keep colours consistent with the site's P3R palette (cold blues/whites with a
red selection accent — see `MainMenu/constants.ts`). Centralise badge colours as
constants so they're tunable.

---

### Typography & Composition

- Match the rest of the site: `font-display` for names/headers, monospace for
  numbers/tags/labels, white over the dark water background, asymmetric and
  left-aligned. Never reads as a light background.
- Sharp edges, thin rules, tight grid alignment — angular Persona UI, not
  Material cards. No `rounded-*`, no drop-shadow card chrome.
- The row columns should align into clean vertical guides down the list.

---

### Responsive Notes

- Desktop: full multi-column rows (index · name · dates · tags · status).
- Mobile: rows stay rows — collapse the least important columns (tags first,
  then dates) but keep index + name + status legible. Still a list, never cards.

---

### What This Task Produces

- `src/components/Projects/` components rendering `PROJECTS` as a numbered quest
  list over the P3R background.
- Per-row: index, name, date range, tags, and a status badge with distinct
  styling per `SHIPPED` / `IN PROGRESS`.
- A reserved detail region (filled in Task 03) and section header.
- A quest-log / mission-list aesthetic — explicitly no rounded cards.
- `src/app/projects/page.tsx` now renders this instead of `SectionPlaceholder`.
- Static only: no selection, expansion, deep links, or transitions yet.
