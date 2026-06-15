# Task 04 — Transitions & Polish

Final pass: entry/exit reveal, Back-to-Menu wiring, sound, reduced-motion, and a fidelity
sweep against `stack_reference.png`. Match the polish the other sections already ship.

Builds on Tasks [`02`](02-skill-screen-layout.md) + [`03`](03-selection.md).

---

### Scope

- **Entry/exit reveal.** Section mounts with the site's established reveal (whatever
  `Transitions/` + Education/Experience use). The rotated `STACK` title, roster, and list
  animate in; don't invent a new motion language.
- **Selection feedback.** Row select gets a quick P3R-style accent flick + the list swap
  feels snappy (slide/fade), consistent with the other rosters. Tech-focus moves feel
  crisp (cursor flick), and the reference dialog opens/closes with a sharp P3R transition
  (no soft fade-scale SaaS modal).
- **Back to Menu.** Wire the Back control (placed in Task 02) to return to the main menu
  exactly like the other sections.
- **Sound.** Reuse the existing menu select/confirm SFX hooks if the site has them; no
  new audio system.
- **Reduced motion.** Respect `prefers-reduced-motion`: reveals/animations degrade to
  instant, matching site behavior.
- **Fidelity sweep.** Iterate via headless screenshots (`/tmp/shot.mjs`, Playwright) vs
  `stack_reference.png` until the layout language + palette match — title crop, roster
  rhythm, list density, accent placement, scrim/stripe intensity. Faithful reproduction,
  not an approximation.

### Done When

- Section reveals/exits + back-to-menu behave like the rest of the site.
- Selection + list swap + tech-focus + reference dialog feel polished and consistent with
  Education/Experience.
- Reduced-motion + sound honored.
- Final screenshot vs reference shows a faithful match across all regions.
