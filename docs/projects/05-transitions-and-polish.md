## Task 05 — Transitions, Navigation & Polish

### Goal

Wire the projects page into the site's navigation and game-like feel: entry/exit
transitions, back-to-menu, optional sort, sound, reduced-motion, and final
responsive/visual pass. This makes the quest screen feel like part of the
Persona UI rather than a standalone page.

---

### Section Entry / Exit

- The projects page is opened from the main menu's `PROJECTS` route. It must play
  the same section reveal the other sections use — reuse `ScreenReveal` and the
  handoff arming pattern (see `SectionPlaceholder` and
  `docs/main-menu/08-transitions.md`). The current `SectionPlaceholder` for
  `/projects` is the model to replace/extend, not discard.
- Provide a **Back to menu** affordance that returns to the **main menu** (not
  the landing screen): arm the double-circle reveal and flag the root to open on
  the menu, exactly as `SectionPlaceholder.back()` does today.
- `Escape` should trigger back-to-menu, consistent with the rest of the site.

---

### Sort / Filter (optional, matches reference)

The reference shows a `Sort by No.` control. If included, keep it lightweight:

- Sort modes such as **No. (default order)**, **Date**, or **Status**.
- Optionally filter by status (`SHIPPED` / `IN PROGRESS`) or by tag.
- Sorting must not break the deep-link `slug` contract — the displayed `/01 /02`
  index may re-order, but a project's `slug` and its shareable URL stay fixed.
- Treat this as optional polish; it must not block core navigation.

---

### Sound

- Selection-move, confirm, and cancel/back sounds consistent with the menu's
  sound behaviour and any global mute / muted-by-default policy
  (see `docs/main-menu/09-particles-and-sound.md`). Optional, non-blocking.

---

### Accessibility & Reduced Motion

- Respect `prefers-reduced-motion` for the entry/exit reveal and any row/detail
  animation — provide simpler/instant variants.
- Full keyboard operability end-to-end (list nav from Task 03, back-to-menu,
  sort control if present).
- Visible focus states throughout.

---

### Final Responsive & Visual Pass

- Verify the quest-log layout holds from mobile → wide desktop: rows stay rows,
  the detail panel reflows sensibly (stacked under the list on narrow screens),
  status badges and tags stay legible.
- Confirm it never reads as a light background and still obeys the **no generic
  rounded cards** rule after all polish.
- Iterate against `reference.png` via headless screenshots (the established
  visual-iteration workflow) to confirm fidelity.

---

### What This Task Produces

- Projects page mounted on the menu's `PROJECTS` route with the shared section
  entry reveal and a working Back-to-menu (mouse + `Escape`) to the main menu.
- Optional sort/filter, optional sound — both non-blocking.
- Reduced-motion fallbacks and full keyboard operability.
- A final responsive + reference-faithful visual pass; the page feels like a
  Persona quest screen and is ready to ship.
