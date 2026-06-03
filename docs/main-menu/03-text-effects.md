## Task 03 — Text Effects: Wave Distortion & Caustic Flares

### Goal

Add the two idle visual effects that make the inactive menu items feel like they exist underwater: a slow horizontal wave distortion, and occasional soft caustic light flares moving across the text.

These effects apply only to inactive (non-selected) menu items. The selected item must remain visually stable and sharp.

---

### Effect 1 — Idle Wave Distortion

Inactive menu text should appear to drift and wobble slightly, as if the text is being viewed through shallow water.

#### What it should look like

Each letter or word should appear to shift horizontally by a small amount, following a slow sine wave. The shift should be:

- Horizontal only. Vertical drift is a different effect and should not be added here.
- Slow. The wave cycle should be around 3–5 seconds per full cycle.
- Subtle. Maximum horizontal displacement should be approximately 3–6px. Larger values will hurt readability.
- Per-character or per-word offsets should be slightly phase-shifted from each other, so the wave appears to travel across the word rather than the whole word moving as a block.

#### Implementation approach

The most flexible approach is to wrap each character in a `<span>` and animate their `transform: translateX()` using JavaScript or a CSS custom property driven by a `requestAnimationFrame` loop.

An alternative is to use a canvas overlay or an SVG `feTurbulence` / `feDisplacementMap` filter applied to the text element. A displacement map approach produces a more naturalistic refraction effect but requires the text to be composited into an SVG or canvas layer.

Either approach is acceptable. The result should look like slow liquid refraction, not a mechanical horizontal scroll.

#### Stopped on selection

When an item becomes selected, its wave distortion should stop and reset to zero offset. The item should snap to a clean, stable position. A very short transition (60–100ms) on the transform reset is fine, but the snap should feel abrupt, not slow.

---

### Effect 2 — Caustic Flares

Inactive menu text should occasionally receive a soft, moving highlight — a band of bright white or pale blue light that sweeps across the text, like sunlight reflecting off water onto the letters below.

#### What it should look like

- A bright, soft gradient band (or a few overlapping bands) moves across the text from left to right (or at a slight angle).
- The band should be partially transparent. It should brighten the underlying text rather than cover it.
- The colour of the flare should be white or pale blue (`#FFFFFF`, `#D0EEFF`, or similar).
- The edges of the band should be very soft — a wide, feathered gradient, not a hard line.
- Flares should not be perfectly regular. Vary the timing, speed, and width between different items and between successive flares on the same item.

#### Timing

Each inactive item should fire a flare independently, on a randomized interval. A reasonable range is every 2–5 seconds per item, with a random offset so they do not all fire at the same time.

Each individual flare should last 600–1000ms.

#### Implementation approach

One approach: use a `::before` or `::after` pseudo-element (or an overlay `<span>`) with a linear-gradient from transparent → white/pale-blue → transparent, animated with `transform: translateX()` from -100% to +150%. The element is clipped to the text's bounding box using `overflow: hidden` on the text container, or using `mix-blend-mode: overlay` or `screen` so it brightens the text beneath it.

A canvas-based approach is also valid if text effects are already being driven from a canvas.

#### Stopped on selection

When an item becomes selected, its caustic flares should stop. Active flares that are mid-animation can be allowed to finish naturally — no need to cut them.

---

### Coordination with Selection State

Both effects read from the same `selectedIndex` value used in task 02. The rule is simple:

- `item.index !== selectedIndex` → wave + flares active
- `item.index === selectedIndex` → wave stopped, flares stopped, text stable

---

### What This Task Produces

At the end of this task:

- All inactive menu items have a slow, subtle horizontal wave distortion.
- All inactive items receive occasional soft caustic light flares sweeping across the text.
- The selected item has neither effect — it is clean and locked.
- The effects do not hurt readability at any point.
- Changing the selected item correctly stops effects on the newly selected item and restores them on the previously selected one.
