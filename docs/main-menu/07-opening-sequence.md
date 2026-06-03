## Task 07 — Menu Opening Sequence

### Goal

Animate the menu into existence. When the visitor arrives at the main menu from the landing screen, every element should appear through a coordinated entrance sequence that makes the screen feel like a game menu being summoned rather than a page loading.

This task assumes tasks 01–05 are complete and the menu elements are statically positioned. The job here is to add the timed entrance choreography.

---

### Overall Sequence Order

The sequence should unfold in this order, with most steps overlapping:

1. **Transition mask reveals the screen** — the mask from the landing transition (task 08) clears, exposing the menu.
2. **Menu text fades in from below** — staggered, each item slightly delayed.
3. **Selector spawns near the active item** — appears with a quick snap.
4. **System panels appear** — the index panel and info block fade or slide in.
5. **Decorative frame shapes flash** — very brief angular graphic flashes (see below).
6. **Laptop floats into position** — arrives from below the viewport, settles into idle float.

The entire sequence should complete within 800–1100ms. It should feel fast and purposeful, not cinematic.

---

### Step 2 — Menu Text Entrance

Each menu item starts at:
- `opacity: 0`
- `transform: translateY(12px)` (slightly below final position)

And animates to:
- `opacity: 1`
- `transform: translateY(0)`

Duration per item: 180–240ms, using an ease-out curve.

Stagger: each item starts approximately 60–80ms after the previous one. Items can animate from top to bottom (PROJECTS first, ASKME last) or all at once with a small random offset — either is acceptable.

The selected item at open time (default: PROJECTS) should feel settled and dominant immediately after its entrance completes.

---

### Step 3 — Selector Spawn

The selector does not need to travel from off-screen. It should simply appear at the correct position for the initially selected item — either by fading in quickly, or by scaling from zero to full size with a short overshoot spring (150–200ms).

A small twitch (the same twitch defined in task 02) should fire on spawn, as if it snapped into place.

---

### Step 4 — System Panels Entrance

The index panel and the selected-option info block fade in over approximately 200ms. A slight slide-in from below (8–12px) adds to the "summoned" feeling. These can start slightly after the text entrance begins — approximately 100–200ms into the overall sequence.

---

### Step 5 — Decorative Frame Sequence

This is a very brief visual effect that plays once during the opening. It consists of angular shapes — sharp polygons, cutout rectangles, or skewed bars — that flash across the screen in quick sequence.

The effect should:

- Use white, electric blue, and transparent cutout areas.
- Last a total of 200–350ms.
- Consist of 3–5 distinct frame shapes appearing and disappearing in rapid sequence (each frame visible for 40–80ms).
- Feel like a graphic transition impact, not a loading spinner or progress bar.
- Appear at full screen size or concentrated around the menu area.

Implementation: render each frame shape as an absolutely positioned SVG or CSS-clipped element, and use a sequence of timeouts or a CSS animation with steps to trigger each frame. After the last frame, the elements are removed or hidden.

This effect is purely decorative and should not obstruct the menu once it has appeared.

---

### Step 6 — Laptop Entrance

The laptop illustration arrives from slightly below its final resting position (offset by approximately 40–60px) and floats up into place with a 400–600ms ease-out.

It can start its entrance at the same time as the menu text, or with a slight delay (100–150ms). It should settle into its idle float motion (task 04) immediately after arriving.

---

### Sequencing Implementation

The recommended approach is to use a single orchestrated sequence function that fires on component mount (or when a `visible` prop becomes true). Use `setTimeout` or a lightweight animation timeline to schedule each step.

Avoid tying the entrance to a heavy animation library if the project does not already use one. CSS transitions and `requestAnimationFrame` are sufficient for this sequence.

---

### State: Before vs. After Opening

**Before opening (initial state):**
- All menu items: `opacity: 0`, slightly offset downward.
- Selector: `opacity: 0` or `scale: 0`.
- System panels: `opacity: 0`.
- Frame shapes: not yet rendered.
- Laptop: `opacity: 0` or off-screen below.

**After opening (final state):**
- All elements at their normal visible positions.
- Selection system and text effects (tasks 02–03) running normally.
- Laptop in idle float (task 04).

---

### What This Task Produces

At the end of this task:

- Entering the main menu triggers a short, coordinated entrance sequence.
- Menu items appear staggered from below, fading in quickly.
- The selector spawns and twitches into position.
- System panels slide into view.
- Decorative frame shapes flash briefly.
- The laptop floats in from below and settles.
- The entire sequence completes in under 1.1 seconds and feels like a game menu activation.
