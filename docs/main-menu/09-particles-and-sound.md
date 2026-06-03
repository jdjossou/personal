## Task 09 — Decorative Particles & Sound

### Goal

Add the two final polish layers: a sparse field of floating polygonal confetti shapes above the menu, and a small set of UI sounds that reinforce interactions. Neither of these is structural — they exist purely to deepen the atmosphere. This task should be the last one done, after all other systems are working correctly.

---

## Part A — Decorative Particles

### What they are

Small polygonal shapes — triangles, quads, irregular pentagons — that drift slowly above the menu. They are sparse, subtle, and purely decorative. Their purpose is to make the screen feel alive and layered without adding visual noise.

### Visual properties

- Shape: simple convex polygons (3–6 sides). No circles or organic blobs.
- Size: small — roughly 4–12px across. Vary sizes across the particle set.
- Colour: primarily blue and white, with occasional red. Use the same palette as the rest of the menu (`#3A9FE8`, `#7ECDF5`, `#FFFFFF`, `#E83838`).
- Blend mode: additive (`mix-blend-mode: screen` or canvas `globalCompositeOperation: 'screen'`). This makes them glow against the dark background rather than painting over it.
- Opacity: low to medium (0.3–0.7). They should be visible but not dominant.
- Count: keep it sparse. 15–30 visible particles at any time is sufficient. More than 40 starts to feel noisy.

### Motion

Each particle should:

- Drift slowly in a consistent direction (generally upward, or diagonally). Speed: very slow, approximately 10–30px per second.
- Rotate slowly as it moves. Rotation rate: 0.2–1.0 radians per second, varied per particle.
- Occasionally flicker in opacity (subtle, not strobing).
- Wrap around when it exits the screen edge (recycle it back to the opposite edge rather than respawning).

### Implementation

A canvas layer positioned absolutely above the menu (but below the text and selector, so z-order: background → canvas particles → laptop illustration → menu text → selector) drawn in a `requestAnimationFrame` loop.

Each particle is a struct with: position, velocity, rotation, rotationSpeed, opacity, flicker phase, polygon vertex offsets. Initialise all particles with random values within the specified ranges on mount.

Do not use a heavy particle library unless the project already depends on one. A simple canvas loop is 40–60 lines and is easier to tune.

---

## Part B — Sound

### Sound events

Four distinct sounds are needed:

| Event                            | Sound character                                      |
|----------------------------------|------------------------------------------------------|
| Selection changes (move)         | Short, clean blip or click. 80–120ms duration.       |
| Section opens (confirm)          | Stronger, slightly longer tone. 200–350ms.           |
| Back / Escape (cancel)           | Lower pitch, slightly softer. 150–250ms.             |
| Menu opens (whoosh)              | Soft, brief whoosh or sweep. 300–500ms.              |

All sounds should be:

- Short. None should feel like music or SFX from a commercial game.
- Quiet by default. Aim for a level that does not startle.
- Clean — no crackling, no reverb tails that linger noticeably.

### Generating or sourcing sounds

Options, in order of recommendation:

1. **Web Audio API synthesis** — generate all sounds programmatically. A blip is a short oscillator burst (sine or square wave, fast attack, fast decay). A whoosh is filtered noise with a pitch envelope. This approach requires no audio files and loads instantly. Preferred if the developer is comfortable with Web Audio.

2. **Small audio files** — use short `.ogg` or `.mp3` files (each under 30KB). Load them as `<audio>` elements or `AudioBuffer`. Acceptable if synthesis feels too complex.

Do not use sounds that are copyrighted or sourced from the Persona games.

### Sound toggle

A small icon button (speaker on / speaker off) should appear somewhere visible — near the bottom bar, or in a corner. Toggling it should mute or unmute all sounds.

The toggle state should persist in `localStorage` so the visitor's preference is remembered across page loads.

Default state: sounds on.

### Implementation notes

- All sound playback should be triggered through a single `playSound(eventName)` function that checks the mute state before playing.
- Initialise the Web Audio API context on the first user interaction (click, keydown), not on page load, to avoid browser autoplay restrictions.
- Do not play the "selection changes" sound when the selection is set programmatically on open — only play it when the user explicitly moves the selection via keyboard or mouse.

---

### What This Task Produces

At the end of this task:

- 15–30 small polygonal particles drift slowly above the menu in blue, white, and occasional red. They glow slightly and do not obscure any text.
- Four interaction sounds fire on: selection change, confirm, cancel, and menu open.
- A visible sound toggle button mutes or unmutes all sounds, with the preference saved to localStorage.
- The menu feels complete, polished, and atmospheric.
