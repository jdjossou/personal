## Task 02 — Shard Background

### Goal

Build the custom background for the landing / start screen. This background is **different from the rest of the site** — the landing page does not use the animated blue water background that the main menu and other pages use. Instead it has its own geometric shard artwork.

---

### Direction

The landing background is made of **geometric shards**: sharp, angular polygon fragments arranged across the screen. Think of a stylized JRPG title screen — broken glass / crystalline shards catching light — rather than a soft gradient.

The shards should:

- Be angular polygons (triangles, slivers, faceted fragments), not soft blobs.
- Use a limited palette consistent with the Persona-inspired look: deep navy, electric blue, white, near-black, with red used sparingly if at all.
- Layer at different depths and opacities to create a sense of fractured space behind the title text.
- Stay clearly behind the foreground text — the PRESS ANY KEY prompt and name must remain fully legible. The background provides atmosphere and visual weight, it never competes with the type.

---

### Composition

- The shard artwork should fill the full screen.
- Distribution can be asymmetrical, with denser clusters of shards toward edges or one side, leaving the centerpiece text area relatively clear for readability.
- Match the moody, dark, high-contrast feel of the reference (`reference.png`) — deep blues with bright highlights, never a light background.

---

### Motion (Optional / Subtle)

The shards may have very subtle motion to keep the screen feeling alive:

- Slow drift, parallax on mouse move, or a faint shimmer / light pass across facets.
- Motion must stay calm and atmospheric — it should not distract from the PRESS ANY KEY animation (Task 03), which is the screen's focal animation.

If motion adds complexity or risk, a static shard composition is an acceptable first version; motion can be layered in afterward.

---

### Implementation Notes

- This is the landing page's own background. Keep it self-contained so it does not leak into or replace the shared animated background used elsewhere.
- Consider whether shards are best done as SVG polygons, CSS clip-path shapes, a canvas, or a Three.js layer. Favour the simplest approach that achieves the sharp faceted look and acceptable performance; reserve Three.js for if real lighting / parallax is needed.
- Slot in beneath the Task 01 layout, replacing the placeholder dark background.

---

### What This Task Produces

At the end of this task, the landing screen should show:

- A full-screen geometric shard background distinct from the rest of the site.
- A dark, deep-blue, high-contrast atmosphere matching the reference.
- Foreground text from Task 01 still fully legible above the shards.
- Optionally, subtle calm motion in the shards.
