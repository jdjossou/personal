## Task 04 — Transitions, Navigation & Polish

### Goal

Wire the Education page into the site's navigation and game-like feel: entry/exit transitions,
back-to-menu, sound, reduced-motion, optional sort, optional deep linking, and a final
responsive + reference-fidelity pass. This makes the stats screen feel like part of the
Persona UI rather than a standalone page. Almost all of it reuses patterns already proven in
[`QuestList.tsx`](../../src/components/Projects/QuestList.tsx).

---

### Section Entry / Exit

- The page is opened from the main menu's `EDUCATION` route. It must play the same section
  reveal the other sections use — reuse `ScreenReveal` (`reveals="section"`) and the handoff
  arming pattern (see `SectionPlaceholder` and `docs/main-menu/08-transitions.md`). The current
  `SectionPlaceholder` for `/education` is the model being replaced.
- Provide a **Back to menu** affordance returning to the **main menu** (not the landing
  screen): arm the double-circle reveal and flag the root to open on the menu — copy
  `back(origin)` from `QuestList` (`armTransition({ effect: 'doubleCircle', … })` +
  `armEnterMenu()` + `router.push('/')`).
- **`Escape`** triggers back-to-menu (window-level listener, held in a ref like `QuestList`),
  consistent with the rest of the site.

---

### Sound

- Selection-move, confirm, and cancel/back sounds via `MainMenu/audio` (`playSound`,
  `initAudioOnGesture` on first gesture), consistent with the menu's mute-by-default policy
  (see `docs/main-menu/09-particles-and-sound.md`).
- A lower-left `SoundToggle` reused from `MainMenu`, rendered **outside** the scrolling
  container so it stays pinned (as in `QuestList`).

---

### Sort / Filter (optional, matches reference)

The reference shows a sort affordance (reserved in Task 02). If included, keep it lightweight
and **non-blocking**:

- Cycle modes such as **No. (authored order)**, **Category** (CORE → ELECTIVE → SEMINAR),
  **Level**, or **Term**. Reuse `orderCourses(mode)` from Task 01.
- The displayed `/01 /02` index may re-order, but each course's `slug` and any shared URL stay
  fixed — keep row refs slug-keyed (mirror `QuestList`'s sort handling).

---

### Deep Linking (optional)

If desired, make a course shareable at `/education/<slug>` using the **History-API** approach
from `QuestList` (Task 04 there): mirror the active slug into the path via `pushState` (no Next
navigation → no remount / replayed reveal), seed selection from the path on cold load, sync on
`popstate`, and degrade an unknown slug to the default. This needs an `src/app/education/[slug]`
route mirroring `src/app/projects/[slug]`. Treat as optional polish; the bare `/education` must
work fully without it.

---

### Accessibility & Reduced Motion

- Respect `prefers-reduced-motion` for the entry/exit reveal and any row/detail animation —
  simpler/instant variants.
- Full keyboard operability end-to-end (list nav from Task 03, Back-to-menu, sort control if
  present). Visible focus states throughout.

---

### Final Responsive & Visual Pass

- Verify the stats-screen layout holds from mobile → wide desktop: rows stay rows, the profile
  header and detail panel reflow sensibly (detail stacks under the list on narrow screens),
  badges / levels / figures stay legible.
- Confirm it never reads as a light background and still obeys **no generic rounded cards** and
  **no GPA** after all polish.
- Iterate against `education_reference.png` via headless screenshots (the established
  visual-iteration workflow — Playwright, `/tmp/shot.mjs`) to confirm fidelity.

---

### What This Task Produces

- Education page mounted on the menu's `EDUCATION` route with the shared section entry reveal
  and a working Back-to-menu (mouse + `Escape`) to the main menu.
- Move/confirm/cancel sound + a lower-left `SoundToggle`.
- Optional sort and optional `/education/<slug>` deep linking — both non-blocking.
- Reduced-motion fallbacks and full keyboard operability.
- A final responsive + reference-faithful visual pass; the page feels like a Persona stats
  screen and is ready to ship.
