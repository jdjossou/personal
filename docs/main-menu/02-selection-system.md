## Task 02 — Selection System & Selector Cursor

### Goal

Implement the core selection mechanic: which menu item is currently active, how that state is represented visually, and the custom angular selector (cursor) that appears below the selected item.

This task does not cover keyboard or mouse input events — those come in task 06. For now, the selected item can be hardcoded to `PROJECTS` and changed by modifying state directly, to allow this task to be built and tested in isolation.

---

### Selection State

The menu maintains a single `selectedIndex` (0–4) that determines which item is active.

All visual differences between items — size, colour, motion, cursor position — are driven from this one value.

---

### Inactive Item Appearance

Items that are not selected should:

- Use a blue or bluish-white text colour (e.g. `#7EB8E8`, `#A8D4F5`).
- Be slightly smaller than the selected item. Not dramatically — maybe 80–85% of the selected size, or simply a lower `font-size` / `font-weight`.
- Feel available, not disabled. Do not grey them out. The visual treatment is "standing by", not "locked".

The wavy idle motion and caustic flares are added in task 03. For now, inactive items can be fully static.

---

### Selected Item Appearance

The selected item should:

- Use a strong contrast colour: pure white (`#FFFFFF`) or near-white, with high contrast against the blue background.
- Be visibly larger than inactive items. Increase `font-size` or apply a `scale` transform — enough to make the hierarchy immediately clear.
- Have zero wave distortion. The selected item is "locked in" and stable.
- Be the visual anchor of the screen.

The transition from inactive to selected (and back) should be nearly instant — a very short duration, 80–120ms at most. The goal is a snappy, responsive feel, not a smooth morph.

---

### Selector (Cursor) Shapes

The selector is the main visual differentiator. It sits below (or partially overlapping) the selected item text and acts as an aggressive pointing device, Persona-style.

The selector is made of two shapes:

**Shape 1 — White angular form**
A sharp, skewed polygon. Think of a parallelogram or a wide triangle with a clipped top. It should be wide enough to roughly match the selected word's width, and positioned so its longest edge sits under the text.

**Shape 2 — Red accent form**
A smaller, offset angular shape that partially overlaps or sits beside Shape 1. It should be positioned slightly off-center or at an angle, adding visual tension.

Both shapes should be rendered as absolutely positioned elements (CSS clip-path polygon, SVG, or canvas). SVG is recommended for ease of precision.

#### Selector Positioning

The selector should be positioned directly relative to the selected item's bounding box. When the selected item changes, the selector must jump to the new item's position.

Use a quick ease or spring — approximately 120–180ms. Do not make it perfectly linear. A short overshoot feel (spring easing) makes it feel mechanical and alive.

#### Selector Sizing

Scale the selector to approximately match the selected item's text width. You can read the element's `offsetWidth` and use it to set the selector's width. Height should be fixed or slightly proportional.

#### Selector Twitching

The selector should twitch slightly when the selection changes. This is a brief (50–80ms) scale pulse or rotation jolt on arrival — like it snapped into place with a little impact.

After the twitch settles, the selector should have a very subtle, low-frequency idle rotation or skew oscillation (±1–2 degrees, period ~2–3 seconds). This keeps the selector feeling alive even when nothing is happening.

---

### What This Task Produces

At the end of this task:

- One menu item is visually dominant (larger, white, stable).
- All other items are subdued (smaller, blue).
- The two-shape selector appears below the selected item.
- Changing `selectedIndex` moves the selector quickly and correctly.
- The selector twitches on arrival and idles subtly.
- No keyboard or mouse wiring yet — selection changes are tested by changing state directly.
