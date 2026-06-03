## Task 04 — Laptop Illustration

### Goal

Build the large stylized laptop illustration that occupies the left side of the menu screen. This visual replaces the character-art role from Persona 3 Reload — it provides the left-side visual weight that makes the layout feel like a game menu rather than a web page.

---

### Role of the Illustration

In the Persona 3 Reload main menu, a large character illustration stands on the left, giving the screen visual mass and personality. This portfolio replaces that role with a stylized developer machine.

The laptop should not look like a clipart icon or a generic emoji. It should feel like a summoned object — a laptop suspended in the underwater menu world, rendered in the portfolio's visual language.

---

### Drawing the Laptop

The illustration should be built as an SVG (preferred) or as a canvas drawing. SVG is recommended because it is easier to animate individual parts and to apply the background-mapped transparency effect described below.

The laptop should be viewed from a slight three-quarter or isometric angle, not flat-on. A purely frontal view is acceptable if it looks sufficiently stylized, but a slight angle gives it more presence.

The design should be graphic and flat-shaded, not realistically rendered. Think of a poster illustration or a game asset, not a product photo.

Key structural parts to draw:

- The body/base of the laptop (keyboard deck and hinge)
- The screen (open, showing a dark terminal or code-like abstract content)
- Hard, clean silhouette edges
- Large flat colour areas — no soft gradients or drop shadows

Optional additions:

- A few abstract code lines or a blinking cursor on the screen interior
- A subtle keyboard grid pattern on the deck
- Angular "tech" details on the corners or bezel (lines, small cutout shapes)

---

### Colour Palette

The illustration must use only these colours:

- White (`#FFFFFF` or near-white)
- Electric blue (`#3A9FE8`, `#5BC8FF`, or similar)
- Deep navy (`#0A1828`, `#0D2137`, or similar)
- Black or near-black (`#000000`, `#0A0A0F`)
- One small red accent, used sparingly (`#E83838` or similar — optional)

No full-colour gradients. No realistic shading. The look should be sharp and poster-like.

---

### Background-Mapped Transparent Areas

Some parts of the laptop should appear to inherit the animated blue background rather than using a fixed fill colour. This creates the impression that the laptop is partially transparent or fused with the environment.

This is not a simple opacity reduction. The laptop should still have a clear, solid silhouette. Only interior shapes or edge areas should reveal the background.

#### Implementation

In SVG, this is achieved by setting certain `<path>` or `<rect>` fills to `none` (transparent), so the animated background canvas behind the SVG shows through those areas. The SVG must not have a background of its own.

Possible areas to make transparent:

- The screen interior (the dark display area can show the animated background instead of a solid fill)
- A cutout window or vent shape on the deck
- Thin edge strips along the bezel

The effect should feel intentional, not accidental. The transparent areas should look like the laptop is embedded in the underwater world.

---

### Floating Motion

The laptop should have a very slow, calm idle animation. This is the opposite of the selector — it is atmospheric, not snappy.

The motion should consist of:

- A slow vertical drift: move up and down by approximately 8–14px over a cycle of 4–7 seconds. Use a sine wave eased at both ends.
- A very small rotation: ±1–2 degrees over a similar period, slightly out of phase with the vertical drift so the motion feels organic, not robotic.
- Optionally, a slow horizontal sway of ±3–5px, on a longer cycle (8–12 seconds).

These three components should be layered (applied as separate transforms or combined into a single `transform`) so the resulting motion feels like gentle floating rather than a single axis bounce.

#### On menu open

When the main menu opens, the laptop should drop or float into its position from slightly below or slightly outside the viewport. A 400–600ms ease-out arrival is appropriate. After arriving, it settles into the idle float.

---

### Positioning

The laptop occupies Zone A — the left 40–45% of the screen. It should be vertically centered, or slightly below center, to feel grounded.

It should be large — this is a hero visual, not a small icon. On a 1440px-wide screen, the laptop illustration should be roughly 500–700px wide.

The illustration should sit behind the menu text in z-order but in front of the raw animated background.

---

### What This Task Produces

At the end of this task:

- A stylized laptop SVG (or canvas drawing) is visible on the left side of the menu.
- It uses only the specified colour palette with some transparent cutout areas showing the animated background.
- It floats gently with a slow, organic idle motion.
- It does not animate in from offscreen yet — that entrance animation is part of task 07 (Opening Sequence).
- It should look clearly like a laptop or developer workstation, integrated into the menu world.
