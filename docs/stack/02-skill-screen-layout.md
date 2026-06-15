# Task 02 — Skill Screen Layout (Static Composition)

Build the static Skill-screen composition over the shared water background. No selection
logic yet (Task 03) — render the **default category** selected and hard-code the right
list to it. This task is the bulk of the visual work.

Reference: `stack_reference.png`. Mapping: [`00-overview.md`](00-overview.md). Reuse
`Education/` primitives where they fit (`SlashField`, `BackdropShapes`, `CategoryBadge`).

---

### Layout regions (left → right, matching the reference)

1. **Rotated `STACK` title** — left edge, vertical/rotated, oversized, cropped, white,
   `font-display`. The analog of the reference's rotated `SKILL`. A graphic element, not a
   heading; sits behind the panels.
2. **Category roster (left column)** — the analog of the party-member list. One row per
   category: leading **category icon** + category label (`font-display`), thin angular
   row chrome, left-aligned. **No level, no HP/SP bars, no portraits.** The default/first
   category renders in the selected (red/white accent) state. An item count is allowed but
   must not look like a stat bar.
3. **Technology list (right column)** — the analog of the skill list (`Dia`/`Media`). The
   selected category's `items`, one row each (`font-mono`), with the **category's leading
   icon** heading the list (per `goal.md`). **No `COST` / `SP COST` columns**, no top-right
   `COST` box. Optional `note` renders as a dim secondary line. **One row is always in the
   focused/cursor state** (red/white accent, like the P3R skill cursor) — render the first
   item focused in this static task; selection logic + the reference dialog land in Task 03.
   A focused tech with links may show a subtle affordance (e.g. a chevron / link glyph) hint
   that activating it opens references.
4. **Bottom prompt + Back** — a Persona-style prompt line describing the reference-link
   interaction (e.g. "Select a skill to see where it was used.") + the site's standard
   **Back to Menu** control (reuse the existing one; wiring lands in Task 04).
5. **Signature field + scrim** — diagonal blue stripe field (Education's `SlashField`
   analog) + legibility scrim over the shared water. **Do not re-mount the water.**

Explicitly absent: central character silhouette, cost columns/box, any stats.

### Components (`src/components/Stack/`)

- `SkillScreen.tsx` — top-level composition; lays out the five regions.
- `SkillScreenBar.tsx` — top band / prompt + Back row (the bumper-band analog).
- `CategoryRoster.tsx` + `CategoryRow.tsx` — left roster.
- `TechList.tsx` + `TechRow.tsx` — right list.
- `CategoryIcon.tsx` — maps `CategoryIconId` → glyph (inline SVG or icon set; monochrome,
  white/grayscale, P3R-flat — no full-color logos).
- `SlashField.tsx` / `BackdropShapes.tsx` — reuse Education's if a copy fits; else local.

### Visual rules

- `font-display` for `STACK` + category names; `font-mono` for tech rows/notes/labels.
- Sharp edges, thin rules, asymmetric, left-aligned. No `rounded-*`, no shadow boxes.
- Red/white accent only for the selected category. B/W elsewhere + accents "here and there."
- Vary it from Experience's collage — don't clone that layout.

### Done When

- All five regions render over the water with the default category selected.
- Left roster shows all categories (icon + name), no stats.
- Right list shows the default category's items, icon-led, name-only (+ optional note),
  with one row in the focused/cursor accent state.
- Bottom prompt describes the reference-link interaction.
- No central character, no cost columns/box, no HP/SP/level.
- Matches `stack_reference.png` layout language + palette — verify with a headless
  screenshot vs the reference (`/tmp/shot.mjs` workflow).
