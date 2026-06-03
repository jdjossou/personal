## Task 08 — Transition Masks

### Goal

Build the two transition effects used to move into and out of the main menu. These masks replace standard page fades with bold, graphic, slightly surreal effects that match the Persona-inspired visual language.

This task covers both transitions: the wavy blot cut (used when entering the menu or a section) and the double-circle cut (used when going back or closing the menu).

---

### General Rules

All transitions should:

- Feel fast. The mask animation itself should last 400–600ms, not 1000ms+.
- Feel graphic and intentional, not like a loading delay.
- Keep the animated background visible at all times — the mask should cut through the screen, not fade it to a single colour.
- Work at any screen size.

Implementation: both effects are best built as full-screen absolutely positioned overlay elements (SVG or canvas) that play once and then are removed. They should not persist after the transition completes.

---

### Transition 1 — Wavy Blot Cut (Enter)

Used when: entering the main menu from the landing screen, or navigating into a section.

#### What it looks like

A circular blot expands from the center of the screen (or from the point where the visitor clicked/selected). The edge of the blot is not a clean circle — it has a wavy, sine-distorted outline that moves like ink spreading through water.

A second, slightly larger or offset blot appears behind the first with a short delay (80–120ms), creating a layered, liquid-spreading effect.

As the blot(s) expand, they reveal the new screen underneath.

#### Implementation

Render the blot as an SVG `clipPath` or as a canvas shape.

The wavy edge can be approximated by computing a circle outline as a series of points and adding a sine-wave radial distortion to the radius at each angle:

```
r(θ) = baseRadius + amplitude * sin(frequency * θ + phase)
```

Animate `baseRadius` from 0 to a value large enough to cover the full screen (diagonal distance from center to corner). During the animation, also animate `phase` to make the edge appear to ripple rather than simply grow.

Typical values:
- Amplitude: 15–30px
- Frequency: 6–10 waves around the circle
- Phase animation speed: 4–8 radians per second

The two blots should use the same parameters but with different phase offsets and a slight size difference, so they look related but not identical.

#### After completion

Once the blot fully covers the screen, the new content is revealed beneath and the mask element is removed.

---

### Transition 2 — Double-Circle Cut (Back / Close)

Used when: pressing Escape to return to the landing screen, or closing a section back to the menu.

#### What it looks like

Two overlapping circular masks contract inward (or expand from opposite corners), revealing or concealing the screen. The effect is clean and geometric — sharp circles, not wavy.

One approach: two circles start large (covering the screen) and contract to nothing, collapsing toward two focal points (e.g., center-left and center-right). As they contract, the screen beneath is revealed.

Alternatively, the circles can start small and expand to cover the screen when transitioning away, then the new screen appears behind.

#### Implementation

Render the two circles as SVG `<circle>` elements within a `<clipPath>`, or as canvas arcs. Animate their radii.

The two circles should have slightly different centres and slightly different timing (one leads the other by 60–100ms) to create the double-circle feel.

The effect should feel clean and graphic. Do not add a wavy edge to this transition — the contrast between the smooth circles here and the wavy blot in transition 1 is intentional.

---

### Wiring the Transitions

**Landing → Menu:** wavy blot cut. The blot expands to reveal the menu. The menu opening sequence (task 07) begins as the blot starts expanding, so that by the time the blot completes, the menu's entrance animation is already partway through.

**Menu → Section:** wavy blot cut. The blot expands to reveal the section.

**Section → Menu:** double-circle cut. The circles reveal the menu.

**Menu → Landing (Escape):** double-circle cut. The circles reveal the landing screen.

---

### Coordination with Sound

When sounds are added (task 09), the whoosh sound for menu open should fire at the same moment the wavy blot begins expanding.

---

### What This Task Produces

At the end of this task:

- Entering the menu plays the wavy blot cut: an ink-spreading circular reveal with a distorted edge.
- Leaving the menu via Escape plays the double-circle cut: two clean circles contracting inward.
- Both transitions complete in under 600ms.
- The animated background remains visible at all times through the transition.
- Transitions fire correctly when triggered by the interaction system from task 06.
