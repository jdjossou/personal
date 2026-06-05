## Task 04 — Interaction & Entry

### Goal

Make the landing screen functional: any key press (or tap/click) dismisses the start screen and enters the site, transitioning into the main menu. This wires the "PRESS ANY BUTTON" promise to actual behaviour.

---

### Input Handling

The landing screen should advance on **any** of the following:

- **Keyboard:** any key press.
- **Mouse:** a click anywhere on the screen.
- **Touch:** a tap anywhere on the screen.

The whole screen is the activation target — the visitor does not need to aim at the prompt specifically.

**Exception — external links.** Clicking/tapping a GitHub, LinkedIn, Devpost, or Résumé link must follow that link, not trigger entry. Those links should stop the activation from firing (and should open external destinations appropriately, e.g. a new tab).

---

### Entry Transition

Activating the landing screen transitions the visitor into the main menu.

- The transition should feel deliberate and game-like, not an instant cut. It should hand off cleanly to the main menu's opening sequence (see `docs/main-menu/07-opening-sequence.md` and `08-transitions.md`).
- Prefer reusing the Persona-style mask transition language used elsewhere (graphic mask cut rather than a plain web fade) so the landing → menu hand-off is consistent with the rest of the site.
- Activation should fire once — guard against double-triggering (e.g. a key held down or a tap that also registers a click).

---

### Optional Polish

- A short confirm sound on activation, consistent with the main menu's sound behaviour (and respecting any global sound toggle / muted-by-default policy).
- Briefly intensify or "snap" the PRESS ANY BUTTON animation on activation before the transition begins.

These are optional and should not block the core entry behaviour.

---

### Accessibility

- The screen should be operable by keyboard alone (any key works, which inherently satisfies this).
- Respect `prefers-reduced-motion` for the entry transition — provide a simpler transition when reduced motion is requested.

---

### What This Task Produces

At the end of this task:

- Any key, click, or tap (outside the external links) dismisses the landing screen.
- External links remain independently clickable.
- Activation triggers a clean, game-like transition into the main menu, firing exactly once.
- Optional sound / animation polish and a reduced-motion fallback.
