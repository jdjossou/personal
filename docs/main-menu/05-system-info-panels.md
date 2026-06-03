## Task 05 — System Information Panels

### Goal

Build the two small system-readout elements that update when the selected menu item changes: the main index panel (MAIN / 01) and the selected-option info block (View Projects / Quest Log ───). These panels give the screen a game HUD personality and make it feel like a live information system rather than a static layout.

---

### Panel 1 — Main Index Panel

#### Appearance

A white angular polygon or skewed rectangle, positioned in the lower-left area of the screen — above or near the navigation prompts.

Inside the panel, two lines of text:

```
MAIN
01
```

The text should be dark (black or deep navy) to contrast against the white fill. The font should match the general menu style — bold, uppercase, game-like.

The panel itself should be a sharp, slightly skewed shape. A parallelogram or clipped rectangle (achieved with CSS `clip-path` or an SVG shape) works well. It should feel like a UI badge, not a card.

#### Content

The number updates based on the currently selected menu item:

| Menu item   | Number |
|-------------|--------|
| PROJECTS    | 01     |
| EDUCATION   | 02     |
| EXPERIENCE  | 03     |
| STACK       | 04     |
| ASKME       | 05     |

The label `MAIN` stays constant.

#### Update behaviour

When the selection changes, the number should update. A brief flash or short scale pulse (80–120ms) on update makes the change feel registered. Do not use a slow crossfade — keep it snappy.

---

### Panel 2 — Selected Option Info Block

#### Appearance

A small text block positioned at the bottom right of the screen, or in the lower-center area. It floats over the bottom bar area.

It contains two lines:

```
View Projects
Quest Log ───────────────
```

The first line is a title (`View [Section Name]`). The second line is a subtitle (a Persona-style category label) followed by a trailing line.

The trailing line should be a crisp horizontal rule or a sequence of em-dashes (`───────────────`) that extends to the right edge of the panel or a fixed width. It should feel like part of the UI frame — decorative but structural.

#### Full content map

| Selected item | Title          | Subtitle        |
|---------------|----------------|-----------------|
| PROJECTS      | View Projects  | Quest Log       |
| EDUCATION     | View Education | Stats           |
| EXPERIENCE    | View Experience| Social Link     |
| STACK         | View Stack     | Skill List      |
| ASKME         | Ask Juniel     | Broadcast       |

#### Typography

- Title: medium-large, white or near-white. Slightly smaller than the menu items.
- Subtitle: smaller, pale blue or muted. Less visual weight than the title.
- Trailing line: same colour as the subtitle or slightly lighter. Fixed-width, aligned to the right of the subtitle text.

#### Update behaviour

When the selection changes, the info block should update. The recommended transition is a very quick fade-out of the old content and fade-in of the new content — approximately 80ms out, then 120ms in. Or, alternatively, a slide-up reveal of new content. Keep it short and game-like, not a slow dissolve.

---

### Positioning Notes

Both panels should be in Zone C (the bottom bar area) from task 01.

- The index panel sits in the lower-left.
- The info block sits in the lower-right (or lower-center-right).

Both should be absolutely or fixed-positioned so they do not interfere with the main menu list layout.

---

### Relationship to Selection State

Both panels read from the same `selectedIndex` value used in tasks 02 and 03. Whenever `selectedIndex` changes, both panels update simultaneously.

---

### What This Task Produces

At the end of this task:

- The MAIN / 01 index panel appears in the lower-left with the correct number for the current selection.
- The View Projects / Quest Log info block appears in the lower area with the correct content for the current selection.
- Both panels update quickly and visually register the change when the selection changes.
- Both panels feel like game HUD elements: sharp, small, informative, and integrated with the overall screen layout.
