# Stack — Skill Screen (Design Overview)

North-star doc for the Stack section. Fixes the design + the P3R mapping; the four
numbered task docs (`01`–`04`) build toward it. Raw brief lives in
[`goal.md`](goal.md); the visual standard is `stack_reference.png`.

---

### What This Section Is

The Stack page presents the technologies I know **like the Persona 3 Reload Skill
screen** — a roster of *categories* on the left (the analog of the party members),
and the *skills in the selected category* on the right (the analog of a character's
skill list). It is **not** a tag cloud and **not** a card grid.

From [`goal.md`](goal.md), the launch content (the categories + which item sits in which
are **author-discretion, not fixed** — `goal.md`'s grouping is a starting example; Task 01
may re-group or rename categories / move an item if it classifies better):

- **Languages:** Java, Python, C++, TypeScript, JavaScript, Swift, HTML/CSS, Dart
- **Frameworks & Libraries:** Spring Boot, React, Next.js, Angular, PyTorch, NumPy, FastAPI, Flutter
- **Tools & Platforms:** Git, Kubernetes, Kafka, Jenkins, Dynatrace, Postman, Jira
- **Certifications:** Microsoft Azure AZ-900, Microsoft Azure AI-900
- **Databases:** PostgreSQL, Oracle SQL, MongoDB, Firebase Firestore
- **Spoken languages:** English, French

---

### The Reference → Stack Mapping

`stack_reference.png` is P3R's **Skill** screen: a rotated cropped `SKILL` title at the
left edge, a left column of party members (`Makoto` / `Yukari` / `Junpei`) each with a
portrait + level + HP/SP bars, a right column skill list (`Dia`, `Media`) with `COST` /
`SP COST` columns, a `COST` box top-right, a central character silhouette, a bottom-right
prompt (`Whose skills do you want to cast?`) with `Confirm` / `Back` controls, all over a
blue watery field. The slots map **directly**:

- **Each party member → one category.** The left roster is the categories, newest/most
  important first per the `goal.md` order. The unit you select.
- **Member portrait → a category icon** (a leading glyph per category). No character art.
- **Member level + HP/SP bars → REMOVED.** No level, health, or mana stats — the row is
  just the category name + its icon (+ an item count is acceptable, not a stat bar).
- **Right skill list (`Dia`/`Media`) → the technologies in the selected category.** Each
  row is one technology, with the **category's leading icon** at the start of the list
  (per `goal.md`: "a leading icon for each category").
- **`COST` / `SP COST` columns + top-right `COST` box → REMOVED.** Technologies have no
  cost. The right column is name-only (a tech may carry an optional one-line note — e.g.
  the full certification name).
- **Central character silhouette → REMOVED.** Center stays open; energy comes from the
  angled panels + typography, not a figure.
- **Bottom prompt** → describes the **reference-link interaction** (see below), e.g.
  "Select a skill to view where it was used." The site's standard **Back to Menu** control
  replaces `Back`.
- **Rotated `SKILL` title → rotated cropped `STACK` title** at the left edge.

So the screen reads: rotated **STACK** title · left **category roster** (icon + name) ·
right **technology list** for the selected category (icon-led, name-only, one row always
focused) · bottom prompt + Back.

#### Reference-link interaction (the "cast skill" analog)

In P3R you select a skill to *cast* it. Here, the right technology list **always has one
focused/hovered row** (like the P3R cursor — there is no empty state). Activating the
focused tech (click / Enter) opens a **reference dialog** listing where that technology was
used — links to projects, repos, experiences, etc.

- Links are **optional and variable in count**: a tech may have **0, 1, or many** links.
- A tech with **0 links** still focuses normally; activating it either shows a "no
  references" dialog state or is a no-op (Task 03 decides) — but it never breaks the
  always-focused rule.
- The bottom prompt communicates this interaction, not "cast."

---

### Visual Rules (P3R house style)

Match the rest of the site (`MainMenu/`, `Projects/`, `Education/`, `Experience/`):

- `font-display` (Bebas Neue) for the `STACK` title, category names, section headers;
  `font-mono` for item rows, notes, labels; white over the dark water.
- Sits over the **shared global P3R water background** — do not re-mount it. 
- Selection uses the site's **red/white Persona accent** (as in `MainMenu`/`Projects`/
  `Education`), never a generic hover box.
- B/W + accents "here and there"; vary the layout — don't just clone Experience's collage.

---

### How the Work Is Split

| Task | File | What it adds |
|------|------|--------------|
| 01 | [`01-data-model-and-content.md`](01-data-model-and-content.md) | `Category` + technology data model, per-category icons, helpers, the real content from `goal.md`. |
| 02 | [`02-skill-screen-layout.md`](02-skill-screen-layout.md) | The static Skill composition: rotated `STACK` title, category roster, technology list panel (icon-led), prompt, Back, stripe/scrim field. |
| 03 | [`03-selection.md`](03-selection.md) | Selectable category rows + swapping technology list (master–detail) + always-focused tech + **reference-link dialog** + shareable `/stack/<category>` deep links + keyboard nav. |
| 04 | [`04-transitions-and-polish.md`](04-transitions-and-polish.md) | Entry/exit reveal, back-to-menu, sound, reduced-motion, final fidelity pass vs the reference. |

Eventual code shape (mirroring `Education/` + `Experience/`):
`src/components/Stack/` → `SkillScreen.tsx`, `SkillScreenBar.tsx`, `CategoryRoster.tsx`,
`CategoryRow.tsx`, `TechList.tsx`, `TechRow.tsx`, `TechDialog.tsx`, `CategoryIcon.tsx`, `SlashField.tsx`
(or reuse Education's), `BackdropShapes.tsx`, `stack.ts`, `constants.ts`, `helpers.ts`.
The route [`src/app/stack/page.tsx`](../../src/app/stack/page.tsx) renders `<SkillScreen />`
(replacing the current `SectionPlaceholder`), with a deep-link route at
`src/app/stack/[category]/page.tsx`.

---

### Done When

- The page reads as a P3R Skill screen: a left roster of categories (icon + name, no
  stats), a right icon-led technology list that swaps as you select a category, always with
  one tech focused; activating a focused tech opens its reference-link dialog.
- All six categories + their `goal.md` items render; central character, cost columns, and
  HP/SP/level stats are absent.
- It matches `stack_reference.png` in layout language + palette (verified via the
  established headless-screenshot iteration workflow).
- Adding a future technology/category is a one-line append to the data array — no UI code
  touched.
