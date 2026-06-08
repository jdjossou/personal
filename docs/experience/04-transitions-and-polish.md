## Task 04 — Transitions, Navigation & Polish

### Goal

Wire the Experience page into the site's navigation and game-like feel, then take the
final fidelity pass: section entry/exit reveal, back-to-menu, UI sound, reduced-motion,
and a reference-faithful responsive sweep. This is mostly reuse of pieces already proven
in `Education/StatScreen.tsx` — `ScreenReveal`, the `handoff` arming pattern, and the
`MainMenu` audio — plus the screenshot-iteration polish loop.

---

### Section Entry / Exit (reuse, don't rebuild)

- The page is opened from the menu's `EXPERIENCE` route (`MENU_ROUTES[2]` →
  `/experience`). Wrap `SocialLinkScreen`'s root in `<ScreenReveal reveals="section">`,
  exactly as `StatScreen` does, so it plays the same section reveal as the other
  sections (replacing the `SectionPlaceholder` handoff, not discarding it).
- **Back to menu** returns to the **main menu** (not the landing screen): on Back, play
  the `cancel` sound, `armTransition({ effect: 'doubleCircle', origin, target: 'menu' })`,
  `armEnterMenu()`, then `router.push('/')` — copy `StatScreen.back()` verbatim, held in
  a ref so the window `Escape` listener always calls the latest closure.
- `Escape` triggers back-to-menu, consistent with the rest of the site (window-level
  listener; the listbox keeps arrows/Enter scoped to itself so they never conflict).

---

### Sound

Reuse the `MainMenu/audio` SFX, matching `StatScreen`'s wiring and the global
mute / muted-by-default policy:

- `initAudioOnGesture()` on mount.
- `move` on a real selection change (never re-fires on the active row, never double-fires
  with keyboard `moveTo`).
- `confirm` on Enter/Space, `cancel` on Back/Escape.
- The pure URL/selection writer stays **sound-free** so popstate / deep-link callers
  don't fire SFX — keep the SFX at the user-input sites (the discipline `StatScreen`
  documents).

---

### Accessibility & Reduced Motion

- Respect `prefers-reduced-motion` for the entry/exit reveal and any card/stripe motion
  — simpler / instant variants.
- Full keyboard operability end-to-end: roster nav (Task 03), bumper paging, back-to-menu.
- Visible focus states throughout.

---

### Final Responsive & Visual Pass

- Verify the Social Link layout holds mobile → wide desktop: roster stays a list, the
  journal stays readable, the tarot company card scales without overflowing, the
  company name/bio and rank stay legible.
- Confirm it never reads as a light background and still obeys **no generic rounded
  cards** after all polish — and that it reads as its *own* screen, not a recoloured
  Projects/Education clone (the tarot card + stripe field carry that distinction).
- Iterate against `experience_reference.png` via headless screenshots (the established
  visual-iteration workflow) until the composition, palette, and the journal/card
  hierarchy match.

---

### What This Task Produces

- Experience page mounted on the menu's `EXPERIENCE` route with the shared section entry
  reveal and a working Back-to-menu (mouse + `Escape`) to the main menu.
- `MainMenu` UI sounds on move / confirm / cancel, honouring global mute.
- Reduced-motion fallbacks and full keyboard operability.
- A final responsive + reference-faithful visual pass; the page feels like a Persona
  Social Link screen and is ready to ship.
