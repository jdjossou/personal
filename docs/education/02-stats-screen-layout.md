## Task 02 — Stats Screen Layout (Static Frame)

### Goal

Build the static, data-driven stats screen: render `PROFILE` + `COURSES` (Task 01) as a
Persona **"Check Stats"** screen over the shared P3R water background. No selection, no detail
swap, no transitions yet — just the correct visual structure and typography. This is the
screen's backbone; Tasks 03–04 add behaviour on top.

**The rule from `goal.md`: this must read as a Persona stats / system-profile screen, not a
résumé block or card grid.** No generic rounded cards.

---

### Reference

See `education_reference.png` (P3R's "Check Stats" screen) and the mapping in `goal.md`:

- A top **band** — section title, with a sort affordance reserved on the right (wired in
  Task 04), echoing the reference's "Check Station / LB ◀ ▶ RB" bumper bar.
- A fixed **profile header** = the "character": university, degree, expected graduation.
- A vertical list of **course rows** = the party-member rows. Each carries a **category
  badge**, a **code + name**, a **level** (`Lv.N`), and **neutral-fact figures** (term ·
  units) pinned right.
- A reserved lower **detail region** (filled in Task 03) — just reserve the space here.
- A bottom **hint line** ("Which course do you want to view?") and footer controls.

**Departure from the reference (per `goal.md`):** no right-side character illustration — the
list is **full-width** within the content column.

---

### Profile Header Anatomy

The fixed "character profile" at the top (renders `PROFILE`, never selectable):

- **University** — the dominant line, `font-display`, uppercase, white (the section's H1).
- **Degree / program** — secondary line, `font-mono` or lighter display weight.
- **Expected graduation** — `formatGraduation()` ("Expected 2027"), `font-mono`, subdued,
  pinned aside or under the degree.
- Optional `location` / `tagline` as small monospace meta.

Reads as the system header above the ability list — factual and clean.

---

### Course Row Anatomy

Each row maps one-to-one to a `Course` and shows, left → right (align into clean vertical
guides down the list, like `Projects/QuestRow` `ROW_GRID`):

- **Index** — `/01`, `/02` … zero-padded, derived from array order (monospace, subdued).
- **Category badge** — `CORE` / `ELECTIVE` / `SEMINAR`, the reference's `LEADER` / `PARTY`
  slot. One sharp visual per category (colours from `constants.ts`, not hardcoded in JSX).
- **Code** — `CS246`, monospace, the system identifier.
- **Name** — the course name, the dominant text in the row.
- **Level** — `Lv.N` from `levelFromCode()` (monospace, echoes the reference's `Lv.16`).
- **Neutral-fact figures** — `formatTerm(term)` and `formatUnits(units)`, pinned right (the
  reference's `227 → 146` slot). Tabular-nums, monospace. **No GPA.**

Rows must be individually targetable elements (Task 03 selection / Task 04 optional deep link
key off the course `slug`). Build them as a `StatRow` component with a shared grid constant
exported for the header guide row, mirroring `QuestRow` / `ROW_GRID`.

---

### Category Badge Styling

Three categories, visually distinct and instantly scannable (sharp, not pill-soft) —
centralise colours as constants so they're tunable:

- `CORE` — the strongest accent (the "leader" of the set).
- `ELECTIVE` — a cooler/secondary accent.
- `SEMINAR` — the most subdued.

Keep colours consistent with the site's P3R palette (cold blues/whites + the red selection
accent — see `MainMenu/constants.ts`).

---

### Composition & Typography

- `font-display` for the university title; `font-mono` for codes / levels / terms / units /
  labels; white over the dark water. Asymmetric, left-aligned.
- Sit over the **global** P3R water background (do not re-mount it). Add a left-anchored
  legibility scrim — a full-bleed dark gradient over the water (copy the pattern from
  `QuestList`: `from-black/65 via-black/45 to-black/20`), **not** a card.
- Sharp edges, thin rules, tight grid alignment. **No `rounded-*`, no drop-shadow card chrome.**
- Use a `max-w-*` content column with viewport padding (`px-[6vw] py-[6vh]` base, `md:px-12`),
  matching `QuestList`.

---

### Responsive Notes

- Desktop: full multi-column rows (index · badge · code · name · level · term · units).
- Mobile: rows stay rows — collapse the least important columns first (units, then term),
  keep index + badge + code/name + level legible. Still a list, never cards.

---

### What This Task Produces

- `src/components/Education/` components rendering `PROFILE` as a profile header and `COURSES`
  as a numbered list of course "ability" rows over the P3R background.
- Per-row: index, category badge, code, name, `Lv.N`, and neutral-fact figures (term · units).
- A reserved detail region (Task 03), a top band with a reserved sort affordance, and a bottom
  hint line + Back control.
- A Persona stats-screen aesthetic — explicitly no rounded cards, no GPA.
- `src/app/education/page.tsx` renders `<StatScreen />` instead of `SectionPlaceholder`.
- Static only: no selection, detail swap, transitions, sound, or deep links yet.
