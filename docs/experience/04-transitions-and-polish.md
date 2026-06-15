## Task 04 — Transitions, Navigation & Polish

> **Status (2026-06-14): PARTIALLY DONE.** The hard part of navigation already shipped in
> [`SocialLinkScreen.tsx`](../../src/components/Experience/SocialLinkScreen.tsx):
> Back-to-menu is wired (`back()` plays `cancel`, `armTransition({ effect: 'doubleCircle',
> target: 'menu' })`, `armEnterMenu()`, `router.push('/')`), held in `backRef`, and the
> window-level `Escape` listener calls it. The collage also already has a robust
> responsive system (a `matchMedia` desktop/mobile gate + a scale-to-fit stage driven by a
> `ResizeObserver`) and a mobile flow. **What's left is the entry reveal, the move/confirm
> sounds, reduced-motion, and the final fidelity pass** — most of which depends on Task 03
> existing first (no selection = no move/confirm sound).

> **Design note:** the page follows [`redesign.md`](redesign.md), not the original
> tarot/journal brief in `00`–`02`. References below to `StatScreen` patterns still apply;
> references to tarot cards / journals do not.

---

### Section Entry / Exit — REMAINING

- The page is opened from the menu's `EXPERIENCE` route (`MENU_ROUTES[2]` →
  `/experience`). **Wrap `SocialLinkScreen`'s root in `<ScreenReveal reveals="section">`**,
  exactly as `StatScreen` does (`src/components/Education/StatScreen.tsx`), so it plays the
  same section reveal as the other sections. The root `<main>` is currently unwrapped.
- Confirm the wrap composes with the existing scale-to-fit stage and the desktop/mobile
  gate without double-animating or fighting the `transform: scale(...)` on the stage.
- **Back to menu — DONE.** `back()` + `backRef` + the `Escape` listener already match
  `StatScreen.back()`. Leave as-is; just verify it still fires correctly once `ScreenReveal`
  wraps the tree.

---

### Sound — PARTIALLY DONE

- `cancel` on Back/Escape — **DONE** (`playSound('cancel')` in `back()`).
- **REMAINING:** call `initAudioOnGesture()` on mount (as `StatScreen` does) so the first
  interaction unlocks audio.
- **REMAINING (needs Task 03):** `move` on a real selection change (Prev/Next/arrow paging)
  — never re-fire on a no-op, never double-fire with keyboard paging. Optional `confirm`
  if you add an explicit confirm key.
- Keep the pure URL/selection writer **sound-free** so `popstate` / cold deep-link callers
  don't fire SFX — fire SFX only at the user-input sites (the discipline `StatScreen`
  documents).

---

### Accessibility & Reduced Motion — REMAINING

- Respect `prefers-reduced-motion` for: the `ScreenReveal` entry, the `TechStack`
  floating/draggable token motion, the `JobPanels` scatter, and any title/card motion —
  provide simpler/instant variants.
- Full keyboard operability end-to-end: Prev/Next + arrow paging (Task 03), Back-to-menu
  (done). Visible focus states on `NavButton`s and any links.

---

### Final Responsive & Visual Pass — REMAINING

The scaffolding is solid (gate + scale-to-fit stage + mobile flow already handle grow/shrink
without a refresh). The remaining work is fidelity + content, not plumbing:

- **Content:** `experience.ts` is still flagged `⚠️ SCAFFOLD — VERIFY THIS`. Replace the
  placeholder dates/bullets/tech/summaries with the **real** experience before shipping; the
  `bullets` must obey the **Voice** rule ("Built X, which did Y", never "responsible for X").
- Decide the fate of the unrendered `summary` and `links` fields (see Task 03) so no dead
  data ships.
- Verify the collage holds mobile → wide desktop: the `ExperienceCard` stays legible, the
  `JobPanels` ★ bullets stay readable, the `TechStack` tokens don't overflow the stage, and
  the title crop reads as intentional (not clipped content).
- Confirm it never reads as a light background and obeys **no generic rounded cards**, and
  that it reads as its *own* screen (the EXPERIENCE title crop + card shape language +
  scattered comic frames + draggable tech tokens carry that distinction), not a recoloured
  Projects/Education clone.
- Iterate against `experience_reference.png` / the `redesign.md` intent via the established
  headless-screenshot workflow until composition, palette, and hierarchy match.

---

### What This Task Produces

- The shared section entry reveal (`ScreenReveal`) on the Experience collage. *(Back-to-menu
  + Escape already done.)*
- `initAudioOnGesture()` on mount and `move` SFX on real paging (confirm optional),
  honouring global mute. *(cancel already done.)*
- Reduced-motion fallbacks across the reveal, tech tokens, and job-panel scatter; full
  keyboard operability with visible focus.
- Real content in `experience.ts` (Voice-compliant) and a resolved decision on the dead
  `summary` / `links` fields.
- A final responsive + reference-faithful visual pass; the page feels like a Persona Social
  Link collage and is ready to ship.
