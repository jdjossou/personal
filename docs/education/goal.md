# Education — Stats Screen (Design Overview)

This is the north-star doc for the Education section. It establishes the design and the
P3R mapping; the four numbered task docs (`01`–`04`) build toward it. The raw brief lives in
[`education.md`](education.md); the visual standard is `education_reference.png`.

---

### What This Section Is

The Education page presents the academic profile **like a Persona character stats screen** —
factual and clean, almost like a system profile. It is *not* a résumé block or a card grid.

From `education.md`, it must surface:

- University name
- Degree / program
- Expected graduation date
- Relevant courses, **styled like abilities / learned skills**
- **No GPA**

---

### The Reference → Education Mapping

`education_reference.png` is P3R's **"Check Stats"** screen: a left column of selectable
party-member rows (role badge · name · `Lv.NN` · stat figures), a focal character
illustration on the right, a top "Check Station" bumper band, and a bottom "Whose stats do
you want to view?" prompt — all over the water background. We repurpose that composition:

- **Each relevant course = one party-member / ability row.** A course is the unit you select
  and inspect, exactly like checking a party member's stats.
- **The "character" whose abilities these are = you.** University, degree, and expected
  graduation live in a fixed **profile header** at the top (not a selectable row).
- **Role badge (`LEADER` / `PARTY`) → course category** (`CORE` / `ELECTIVE` / `SEMINAR`).
- **`Lv.NN` → course level** (derived from the course number, e.g. CS246 → Lv.2).
- **Stat figures (`227 → 146`) → neutral facts** — term taken and units. **No GPA, no
  invented attribute scores.** Keep it factual.
- **Bottom prompt** → "Which course do you want to view?" with a Back control.

**Two deliberate departures from the reference, already decided:**

1. **No focal character illustration.** The right-side art is dropped in favour of a cleaner,
   full-width stats panel. The list spans the content column; selection drives a detail
   readout below it (master–detail, like the Projects quest screen).
2. **Stat figures are factual, not RPG attributes** — see above.

---

### Visual Rules (P3R house style)

Match the rest of the site (see `MainMenu/`, `Projects/`):

- `font-display` (Bebas Neue) for the profile title / section header; `font-mono` for course
  codes, levels, terms, units, and labels; white over the dark water background.
- Angular Persona UI: sharp edges, thin rules, tight grid alignment, asymmetric/left-aligned.
  **No `rounded-*` card chrome, no drop-shadow boxes** — the same "no generic rounded cards"
  rule the Projects screen obeys.
- The page sits over the **shared global P3R water background** (do not re-mount it); add a
  left-anchored legibility scrim so text stays readable where the water runs bright.
- Selection uses the site's red/white Persona accent (as in `MainMenu` / `Projects`), never a
  generic hover box.

---

### How the Work Is Split

| Task | File | What it adds |
|------|------|--------------|
| 01 | [`01-data-model-and-content.md`](01-data-model-and-content.md) | `EducationProfile` + `Course` data model, real Waterloo content, helpers. |
| 02 | [`02-stats-screen-layout.md`](02-stats-screen-layout.md) | The static stats-screen frame: profile header + ability rows + bands. |
| 03 | [`03-selection-and-detail.md`](03-selection-and-detail.md) | Selectable rows + a swapping course detail panel (master–detail). |
| 04 | [`04-transitions-and-polish.md`](04-transitions-and-polish.md) | Entry/exit reveal, back-to-menu, sound, reduced-motion, final fidelity pass. |

Eventual code shape (prescribed across the tasks): `src/components/Education/` →
`StatScreen.tsx`, `StatRow.tsx`, `StatDetail.tsx`, `ProfileHeader.tsx`, `CategoryBadge.tsx`,
`education.ts`, `constants.ts`, `helpers.ts`; the route
[`src/app/education/page.tsx`](../../src/app/education/page.tsx) renders `<StatScreen />`,
replacing the current `SectionPlaceholder`.

---

### Done When

- The page reads as a Persona stats screen: a profile header for the "character", a list of
  courses as selectable ability rows, factual figures (no GPA), and a detail readout.
- It matches `education_reference.png` in layout language and palette (verified via the
  established headless-screenshot iteration workflow).
- Adding a future course is a one-line append to the data array — no UI code touched.
