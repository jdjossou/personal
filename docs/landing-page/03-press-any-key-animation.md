## Task 03 — PRESS ANY KEY Text Animation

### Goal

Animate the giant **PRESS ANY KEY** prompt built in Task 01. This is the focal animation of the landing screen — the single effect that makes the title feel alive. It is a scan-line / light-sweep effect driven across the letters.

---

### The Effect

The foreground (fill) of the PRESS ANY KEY title animates **from white to transparent and from transparent back to white**, in a continuous loop.

The transition is not a flat global fade. Instead:

- Multiple **lines / bands of the target colour pass through the text**, sweeping across it.
- These lines move **from left to right**.
- The lines are **not uniformly separated** — the spacing between them is irregular, so the sweep feels organic rather than mechanical.
- The lines travel at a **defined speed** (tunable). As each line passes across a region of the text, that region transitions between white and transparent, producing the impression of light bands wiping across the letters.

The net read: the white title shimmers, with bands of the alternate state continuously passing left-to-right at uneven intervals.

---

### Behaviour Details

- The effect loops continuously while the visitor is on the landing screen (it is an idle "press a key" invitation, like an attract-mode title).
- White ↔ transparent is the core state change of the title's foreground. Where the foreground goes transparent, the shard background (Task 02) shows through the letterforms.
- The bands sweep strictly left → right. They do not bounce or reverse.
- Band spacing is intentionally irregular — define a set of offsets that are visibly non-uniform, not evenly spaced.
- Keep readability: at any given moment the word must still read as PRESS ANY KEY. The effect modulates the fill; it should not erase the text entirely.

---

### Implementation Notes

- Likely approaches: an animated gradient mask (`background-clip: text` with a moving multi-stop gradient), an SVG mask with moving bands, or a shader if finer control is needed. Favour the simplest technique that gives irregular band spacing and a clean left-to-right sweep.
- Expose the key parameters as tunables (consistent with how the background work keeps tunables in `constants.ts`): sweep speed, band count, band widths, and the irregular spacing offsets.
- The name text from Task 01 stays solid white — only the PRESS ANY KEY prompt gets this sweep treatment.
- Respect `prefers-reduced-motion`: provide a calmer or static fallback when the visitor has reduced motion enabled.

---

### What This Task Produces

At the end of this task, the landing screen should show:

- The PRESS ANY KEY title continuously shimmering as bands sweep left-to-right across it.
- Foreground transitioning white ↔ transparent, revealing the shard background through the letters where transparent.
- Irregular, non-uniform spacing between the sweeping bands.
- Tunable speed / band parameters, and a reduced-motion fallback.
