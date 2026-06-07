## Task 03 — Selection & Detail Panel

### Goal

Make the stats screen interactive: a visitor selects a course row and its full info appears in
the detail region reserved in Task 02 — the reference's "Whose stats do you want to view?"
master–detail behaviour. This is where a course reads as a **learned ability you can inspect**.

This closely reuses the Projects machinery — model it on
[`QuestList.tsx`](../../src/components/Projects/QuestList.tsx) and
[`QuestDetail.tsx`](../../src/components/Projects/QuestDetail.tsx).

---

### Selection Model

- Exactly one course is "active" at a time (like the reference's highlighted party row driving
  the stat readout). **Default on load = the first course** (`COURSES[0]`), so the detail panel
  is always populated. Task 04 may override this default if a slug is in the URL.
- Selecting a row updates the active course and renders its detail; the active row is visually
  marked in the list using the **Persona red/white selection accent** (as in `MainMenu` /
  `Projects` — soft crimson fill + white left border), never a generic hover box.
- **Master–detail** (matches the reference and Projects): the list stays put and a detail panel
  below it swaps content as selection changes. Not an inline accordion.

---

### Detail Content (`StatDetail`)

When a course is active, show from its `Course` record (Task 01) — render **only when
present**, so a minimal course still reads cleanly:

- **Code + name** as the heading, with **category badge** and **level** (`Lv.N`) consistent
  with the row.
- **Neutral facts** — term taken and units, pinned/labelled (the same figures as the row, no
  GPA).
- **`summary`** lead line, then the longer **`details`** "what it taught" body when present.
- **Links** (`links[]`) — Syllabus / project / notes, rendered as clear angular actions that
  open appropriately (new tab where `newTab`). They must live **structurally outside the
  listbox** (as in `QuestDetail`) so a link click never doubles as a row selection.

`StatDetail` is purely presentational — it renders whatever `Course` it's handed, with no
selection state of its own. Provide a neutral fallback if handed `undefined` (only reachable
via an unknown slug in Task 04).

---

### Input & Navigation

Reuse the listbox model from `QuestList`:

- **Mouse / touch:** click or tap a row to select it.
- **Keyboard:** the row list is an ARIA `listbox` of `option`s — Arrow up/down to move
  selection (wrap like `MainMenu`), Home/End to jump, Enter/Space to confirm. Scope the key
  handler to the list (not `window`) so it never hijacks arrows from the Back/sort controls.
- Selection follows focus; the active row and the detail panel update together, snappy and
  game-like.

---

### State Shape

- Track the active course by **`slug`** (not array index) — so Task 04 can drive selection
  from the URL and reordering `COURSES` (or the optional sort) never changes which link points
  where. Keep refs to rows keyed by `slug`, not position (mirror `rowRefs` in `QuestList`).
- Keep selection state in the `StatScreen` client component; expose a setter Task 04 can call
  on load and on browser back/forward.

---

### Accessibility

- Rows are real interactive controls: focusable, operable by keyboard alone, correct
  `role="option"` / `aria-selected`, and an `aria-label` on the listbox.
- The active row's selected state is conveyed non-visually (`aria-selected` / `aria-current`).
- Links in the detail panel have clear accessible text.

---

### What This Task Produces

- Click / tap / keyboard selection of a course, with the active row marked in Persona
  selection style.
- A `StatDetail` panel showing the active course's full info: facts, summary, "what it taught"
  body, and links-when-present.
- Working external links that don't conflict with row selection.
- Selection tracked by `slug`, ready for Task 04 to optionally drive from the URL.
- No entry/exit transitions, sound, deep links, or sort yet (Task 04).
