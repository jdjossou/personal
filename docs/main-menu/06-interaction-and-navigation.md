## Task 06 — Interaction & Navigation

### Goal

Wire up all input methods — keyboard, mouse, and touch — so the visitor can navigate the menu and trigger section transitions. This task connects user input to the `selectedIndex` state built in task 02 and activates the visual system from all previous tasks.

---

### Keyboard Navigation

The menu must support keyboard navigation from the moment it is visible.

| Key             | Action                                         |
|-----------------|------------------------------------------------|
| Arrow Up        | Move selection to the previous item            |
| Arrow Down      | Move selection to the next item                |
| Enter           | Open the currently selected section            |
| Escape          | Return to the landing screen                   |

Selection wraps around. Pressing Down on the last item moves to the first; pressing Up on the first moves to the last.

Arrow key presses should feel immediate. The selection state should update on `keydown`, not `keyup`. Do not debounce or throttle arrow key input — the menu should be fully responsive.

Focus management: the menu container should receive focus automatically when the menu becomes visible (`element.focus()` on open). This ensures keyboard events are captured without the visitor needing to click first.

---

### Mouse Navigation

#### Hover

Moving the mouse over a menu item should update `selectedIndex` to that item. The selector should respond immediately.

Do not add a delay or threshold. Hover-to-select should feel instant and direct, consistent with the keyboard experience.

Note: if the visitor was using the keyboard and then moves the mouse, the selected item should switch to whatever the mouse is hovering over. The two input methods share the same state.

#### Click

Clicking a menu item opens that section, the same as pressing Enter on the keyboard. A single click is sufficient — no double-click required.

---

### Touch Navigation

On touch devices, each menu item should be large enough to tap comfortably. Minimum touch target height: 48px per item, though the generous spacing from task 01 should already provide this.

Tapping a menu item should immediately open that section. A two-tap flow (first tap to select, second to open) is not required. Immediate opening is acceptable and simpler.

If a two-tap flow is implemented, the first tap should visually update the selected item (so the visitor sees confirmation), and the second tap should open it.

---

### Opening a Section

When the visitor selects a section (Enter key, mouse click, or touch):

1. Play the confirm sound (if sound is implemented — task 09 covers this).
2. Trigger the exit transition out of the menu (task 08 covers the specific transition effect).
3. Navigate to or reveal the selected section.

The navigation destination for each item:

| Menu item  | Destination        |
|------------|--------------------|
| PROJECTS   | `/projects` or projects section |
| EDUCATION  | `/education` or education section |
| EXPERIENCE | `/experience` or experience section |
| STACK      | `/stack` or stack section |
| ASKME      | `/askme` or contact section |

The exact routing mechanism depends on the project's router setup. Use the existing Next.js router (`useRouter` or `<Link>`) to navigate.

---

### Returning to Landing

Pressing Escape (or a back button on mobile) should:

1. Play the cancel sound (task 09).
2. Trigger the exit transition out of the menu (task 08).
3. Return to the landing screen.

---

### Navigation Prompts (Responsiveness)

The bottom-bar navigation prompts from task 01 should now be live. On desktop, show:

```
↑ ↓ / Move     Enter / Select     Esc / Back
```

On touch/mobile, show:

```
Tap a command to open it
```

Detecting touch vs. non-touch: use a CSS media query (`(pointer: coarse)`) or check `'ontouchstart' in window` once on mount. Do not try to detect the current input device dynamically — pick one at load time and commit to it.

---

### Event Cleanup

When the menu is unmounted or hidden, remove all global event listeners (keydown, etc.) to avoid memory leaks or ghost inputs affecting other screens.

---

### What This Task Produces

At the end of this task:

- Arrow keys navigate the menu, updating the selection and all related visuals from tasks 02–05.
- Mouse hover updates selection. Click opens a section.
- Touch tap opens a section directly.
- Escape returns to the landing screen.
- The navigation prompts at the bottom accurately reflect the available interactions.
- All event listeners are cleaned up on unmount.
