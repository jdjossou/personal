## Task 01 — Layout Foundation

### Goal

Build the static skeleton of the main menu screen. No animations, no interactivity — just the correct visual structure that all subsequent tasks will build on top of.

---

### Three Visual Zones

The menu is a full-screen overlay divided into three zones. These zones should be established as positioned containers:

**Zone A — Left side**
Reserved for the laptop illustration. This zone takes up roughly the left 40–45% of the screen. It is visually dominant but stays behind the menu text in z-order.

**Zone B — Center-right**
The vertical menu list. This is the main functional area. Menu items stack vertically with generous spacing. The list should be roughly centered within the right half of the screen, or slightly offset toward the right edge.

**Zone C — Bottom bar**
A thin strip along the bottom of the screen. Contains the navigation prompts on the left and the selected-section tooltip on the right. Also holds the main index panel (MAIN / 01) near the lower left.

The layout should feel asymmetrical and game-like. It is not a flexbox navbar. It is closer to a positioned game HUD.

---

### Menu Item List

The five menu items should be rendered as a vertical list:

```
PROJECTS
EDUCATION
EXPERIENCE
STACK
ASKME
```

Each item should:

- Use a large, bold, uppercase font. Font size should be substantial — think game menu scale, not website nav scale.
- Be spaced far apart vertically. The gap between items should feel deliberate and generous.
- Be left-aligned within Zone B, or slightly indented from the left edge of that zone.
- Be a block-level element so it can be individually targeted by animations and effects later.

---

### Bottom Bar

The bottom bar should be a fixed or absolutely positioned strip at the very bottom of the screen. It contains:

**Navigation prompts (bottom left):**
```
↑ ↓ / Move     Enter / Select     Esc / Back
```
These should be small, subdued, and laid out horizontally. They should not compete with the menu items visually.

On mobile, replace with:
```
Tap a command to open it
```

**Selected-section info block (bottom right or center-right):**
Placeholder text for now. This area will be wired up in task 05. For now, mark it with a visible but neutral placeholder so it is clear where it lives.

**Main index panel (lower left, near or above the nav prompts):**
Placeholder for the MAIN / 01 block. Mark its position. Will be built in task 05.

---

### Colour and Typography (Static Pass)

For this task, apply only baseline static styles. No animation, no glow, no shaders.

- Background: transparent — the animated blue background from the previous feature shows through.
- Inactive menu text: a blue or bluish-white colour. Something like `#7EB8E8` or `#A8D4F5`.
- Font: a bold condensed typeface that feels sharp and game-like. Suggestions: a custom font loaded via `@font-face`, or a system fallback like Impact as a placeholder.
- The screen must never show a white or light background. If the animated background is not visible, something is wrong.

---

### What This Task Produces

At the end of this task, the screen should show:

- A full-screen overlay with the three zones in their correct positions.
- Five visible menu text items, statically positioned, large and bold.
- A bottom bar with navigation prompts and placeholder areas for the index panel and tooltip.
- No animation, no selection highlight, no cursor — those come in later tasks.
- The animated blue background must still be visible behind everything.
