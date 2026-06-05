## Task 01 — Layout Foundation

### Goal

Build the static skeleton of the landing / start screen. No animations, no interactivity — just the correct visual structure and typography that the later tasks (background, text animation, entry interaction) build on top of.

This is the first screen visitors see before entering the site.

---

### Reference

See `reference.png` in this folder. In the reference (Persona 3 Reload's title screen):

- `Persona3 RELOAD` sits small in the upper-left.
- `PRESS ANY BUTTON` dominates the screen in huge white uppercase letters, left-aligned.
- The `ATLUS` logo sits in the lower-left corner.

For this portfolio, the same composition is reused but repurposed:

- The small upper-left label becomes **the visitor's name**.
- The huge centerpiece text becomes **PRESS ANY KEY**.
- The role label and external links replace the studio/logo furniture.

---

### Screen Elements

Establish each of these as positioned, individually targetable elements. They will be styled and animated in later tasks.

**Name (upper area, white)**
The visitor's name (`Juniel Djossou`) in large display type. It sits *over* / above the giant prompt and is rendered in white. Smaller than the PRESS ANY KEY text but still prominent.

**Role label**
A small monospace-style label near the name:
```
// Software Engineer · CS Student
```
Subdued compared to the name. Reads like a code comment / system tag.

**PRESS ANY KEY prompt (the centerpiece)**
```
PRESS ANY KEY
```
- Uppercase, very large, bold — this is the **largest text on the screen**, nothing else should compete with it.
- Left-aligned, occupying the dominant visual mass of the screen (as `PRESS ANY BUTTON` does in the reference).
- Rendered as a block / element whose individual letters or glyphs can be targeted later (the scan-line animation in Task 03 needs to drive a foreground effect across the text).
- On touch devices, the wording should adapt to `TAP ANYWHERE` (see Task 04). For this task, ship the desktop copy and leave a clear hook for the responsive variant.

**External links**
A row or stack of external links:
```
GitHub   LinkedIn   Devpost   Résumé
```
Small, legible, and clearly clickable. Positioned away from the centerpiece text so they don't fight it — a corner or edge of the screen (e.g. lower area), echoing where the `ATLUS` logo sits in the reference.

**Portfolio mention**
A subtle mention of the word *portfolio* somewhere on the page (e.g. near the name, the role label, or a small footer tag). It should be present but unobtrusive.

---

### Typography (Static Pass)

Apply only baseline static styles in this task. No glow, no scan lines, no shaders.

- PRESS ANY KEY: bold, condensed, sharp, game-like uppercase. Largest type on screen. Solid white for now — the animated foreground treatment comes in Task 03.
- Name: white display type, second in hierarchy.
- Role label / portfolio mention / links: small, subdued, monospace or condensed.
- Keep the type left-aligned and asymmetrical, matching the reference. This is a title screen, not a centered hero section.

---

### Colour (Static Pass)

- Use a temporary dark / deep-navy flat background colour as a placeholder. The real shard background is built in Task 02 — do not block its insertion.
- Foreground text in white, with subdued elements at reduced opacity.
- The screen must never read as a light / white background.

---

### Responsive Notes

- Desktop: large centerpiece text, links in a corner.
- Mobile: the layout should still hold — centerpiece text scales down but stays the dominant element, links remain reachable, and the prompt copy will switch to the tap variant in Task 04.

---

### What This Task Produces

At the end of this task, the screen should show:

- The name in large white display type, with the `// Software Engineer · CS Student` role label.
- A huge, left-aligned, uppercase **PRESS ANY KEY** as the largest element on screen.
- A row/stack of external links: GitHub, LinkedIn, Devpost, Résumé.
- A subtle portfolio mention.
- A placeholder dark background (real shard background comes next).
- No animation and no interactivity yet — those come in Tasks 03 and 04.
