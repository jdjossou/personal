## Task 03 — Selection & Detail Panel

### Goal

Make the quest list interactive: a visitor selects a project row and its full
details appear in the detail region reserved in Task 02. This is the
"expandable or selectable project details" and "links to GitHub, demo, or
related material" from `goal.md`.

---

### Selection Model

- Exactly one project is "active" at a time (like the reference's highlighted
  quest row driving the lower `Task` panel). Decide and document the default on
  load: either nothing selected (detail region shows a neutral prompt — the
  reference's `Which request do you want to view?`) or the first row preselected.
  Task 04 will override this default when a slug is in the URL.
- Selecting a row updates the active project and renders its detail; the active
  row is visually marked in the list (Persona selection language — the red/white
  selection accent used in `MainMenu`, not a generic hover box).

Two viable presentations — pick the one that matches the reference best:

- **Master–detail** (recommended, matches `reference.png`): the list stays put
  and a fixed detail panel below/beside it swaps content as selection changes.
- **Inline expand**: the row itself expands to reveal details. Acceptable only
  if it still reads as a quest log, not an accordion of cards.

---

### Detail Content

When a project is active, show from its `Project` record (Task 01):

- Name, full date range, status badge (consistent with the row).
- All tags (the row may have truncated them; the detail shows the full set).
- `summary` and the longer `details` body.
- **Links** — GitHub / demo / Devpost / writeup, rendered from `links[]`.
  External links open appropriately (new tab where `newTab`), styled clearly as
  actions, and must not be swallowed by row-selection handlers.
- **Screenshots** — render `screenshots[]` only when present ("only when
  useful"). A project with none must render cleanly without an empty frame.

---

### Input & Navigation

- **Mouse / touch:** click or tap a row to select it.
- **Keyboard:** the list should be navigable — arrow up/down to move selection,
  Enter to confirm/activate, consistent with the site's game-like feel. Reuse
  the keyboard-navigation patterns from `MainMenu` where sensible.
- Selection changes should feel snappy and game-like; the active row and the
  detail panel update together.

---

### State Shape

- Track the active project by **`slug`** (not array index) so Task 04 can drive
  selection straight from the URL and so reordering `PROJECTS` never changes
  which link points where.
- Keep selection state in the Projects client component; expose a setter Task 04
  can call on load and on browser back/forward.

---

### Accessibility

- Rows are real interactive controls (focusable, operable by keyboard alone,
  correct roles/labels).
- The active row's selected state is conveyed non-visually (e.g. `aria-current`
  / `aria-selected`).
- Screenshots have meaningful `alt` (already in the data model).

---

### What This Task Produces

- Click / tap / keyboard selection of a project, with the active row visually
  marked in Persona selection style.
- A detail panel showing the active project's full info: tags, body, links, and
  screenshots-when-present.
- Working external links that don't conflict with row selection.
- Selection tracked by `slug`, ready for Task 04 to drive from the URL.
- No deep linking / shareable URLs yet (Task 04) and no entry/exit transitions
  or sound polish yet (Task 05).
