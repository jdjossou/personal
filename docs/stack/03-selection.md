# Task 03 — Selection

Make the category roster interactive: selecting a category swaps the right technology
list.

Builds on the static layout from [`02-skill-screen-layout.md`](02-skill-screen-layout.md)
and the data/helpers from [`01-data-model-and-content.md`](01-data-model-and-content.md).

---

### Behavior

- **Selectable roster.** Clicking a `CategoryRow` selects it: the row takes the red/white
  Persona accent, and `TechList` re-renders that category's `items` + leading icon.
- **Always-focused tech.** The right list always has exactly one tech in the focused/cursor
  state (the P3R skill-cursor analog) — never an empty selection. Switching category resets
  focus to that category's first item. Hover moves focus; keyboard moves focus.
- **Keyboard nav.** Up/Down (or W/S) moves focus through the right list; Left/Right (or a
  Tab) moves between categories — or match whatever Education/Experience already do for
  parity. Enter activates the focused tech.
- **Reference dialog.** Clicking / Enter on the focused tech opens `TechDialog` listing its
  `links` (Task 01) — each a labeled link to a project/experience/external page. Variable
  count:
  - **Many links** → a short list.
  - **One link** → single entry (could navigate directly instead of a list — implementer's
    call, but a consistent dialog is fine).
  - **Zero links** → either a "no references yet" dialog state or a no-op; the focus state
    and prompt must not break. Decide once, apply to all link-less techs.
  - Dialog is angular Persona chrome (no rounded SaaS modal), dismiss on Esc / backdrop /
    Back. Internal links use the app router; external links open in a new tab.

### Notes

- No cost/SP/stat anything enters here — selection only swaps the name-only list + drives
  focus + opens the dialog.
- Keep the data → UI contract: a new category or a tech (with/without links) appended in
  Task 01 must appear + work with **no change here**.

### Done When

- Selecting any category swaps the right list + moves the accent, with no reload.
- The right list always shows exactly one focused tech; focus follows hover + keyboard.
- Activating a focused tech opens its reference dialog; 0 / 1 / many links all render
  correctly; dismiss works.
- Keyboard nav + Enter-to-activate work and match the other sections.
- Verified via headless screenshots of two categories selected + the dialog open.
