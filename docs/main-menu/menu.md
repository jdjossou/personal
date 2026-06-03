## Full Main Menu Interface

### Purpose

The full main menu is the central navigation hub of the portfolio. It appears after the landing/start screen and acts like the main command menu of a Persona-inspired game interface. The visitor should feel like they have entered a stylized developer system rather than a normal website.

The animated blue background remains visible behind everything, but the main menu adds the actual interface layer: menu options, cursor movement, selected-state effects, section preview information, a large right-side visual element, and small system-style details that make the screen feel alive.

This screen should feel sharp, fast, layered, and game-like.

---

## Overall Layout

The full main menu is a full-screen interface divided into three main visual zones:

1. **Right / center-right:** the vertical menu list
2. **Left side:** a large laptop or developer-machine illustration
3. **Bottom / corners:** system information, selected-section details, and navigation prompts

The layout should not feel like a regular website navbar. It should feel like a pause menu or command menu floating over a deep-blue animated world.

The visual composition should be slightly asymmetrical. The menu options dominate the left side, while the right side provides visual weight through a large abstract laptop illustration, geometric shards, or a stylized developer workstation icon.

---

## Main Menu Options

The menu should contain the main portfolio sections:

```txt
PROJECTS
EDUCATION
EXPERIENCE
STACK
ASKME
```

Each item represents a major section of the portfolio.

The menu items should be arranged vertically, with generous spacing between them. The selected item should be visually dominant, while the inactive items should remain visible but subdued.

### Inactive Menu Items

Inactive items should:

* Use a blue or bluish-white text colour
* Have lower visual weight than the selected item
* Subtly drift or wave, as if affected by water
* Include occasional soft caustic highlights moving across the letters
* Feel alive, but not distracting

Inactive menu items should never look disabled. They should look available, just not currently selected.

### Selected Menu Item

The selected item should:

* Scale up slightly compared to inactive items
* Move visually to the foreground
* Use a stronger contrast colour, such as black text on a bright shape or full white text with a strong cursor overlay
* Stop or reduce the wavy idle motion so it feels locked in
* Trigger the cursor to align around or beside it
* Update all related menu information on the screen

The selected state should be immediate and satisfying. Moving from one option to another should feel snappy, not slow.

---

## Selector

The main menu should use a custom visual selector instead of a simple hover underline.

The selector is made of two angular triangle-like shapes:

* One white shape
* One red accent shape

The selector should sit below the selected text. Its purpose is not only to point at the selected option, but also to create the aggressive Persona-style selection effect.

### Selector Behaviour

When the selected option changes, the selector should:

* Move quickly to the new selected option
* Rotate slightly to match the angle and rhythm of the selected text
* Scale to fit the selected word’s approximate width and height
* Twitch occasionally to make the interface feel energetic
* Twitch immediately when the selection changes

The selector should not move in a perfectly smooth or generic way. It should have a short, sharp, slightly exaggerated motion, as if it snaps into place.

## Text Effects

The menu text should have multiple layered effects.

### Idle Motion

Inactive text should have a subtle horizontal wave distortion. The distortion should be soft and slow, like text being refracted through water.

The movement should be visible enough to make the screen feel alive, but not so strong that readability suffers.

### Caustic Flares

Inactive menu text should occasionally receive soft white-blue caustic flares. These flares should move across the text like reflected light.

The flare effect should be:

* Bright but brief
* Mostly white or pale blue
* Irregular, not a simple linear shine
* More visible on inactive blue text than on selected text

### Opening Animation

When the main menu opens, the menu options should appear with a short entrance animation.

The text should:

* Start slightly transparent
* Start slightly lower than its final position
* Move upward into place
* Fade in quickly
* Appear in a staggered sequence or with slight timing offsets

This gives the menu a “summoned” feeling instead of simply appearing instantly.

---

## Left-Side Laptop / Developer Machine Illustration

In Persona 3 Reload, the main menu uses a large character figure in the background. For this portfolio, that role should be replaced by a large stylized laptop, developer workstation, or abstract computer-machine illustration.

This visual should occupy the left side of the screen and provide the same kind of visual weight that a character illustration would normally provide.

### Visual Direction

The illustration should feel like:

* A laptop floating underwater
* A developer machine suspended inside the menu world
* A stylized computer terminal as a “summoned object”
* A personal system interface rather than a realistic device

The laptop should not look like a normal flat icon pasted onto the page. It should feel integrated into the environment.

### Colour Treatment

The laptop illustration should use a limited colour palette:

* White
* Electric blue
* Deep navy
* Black or near-black
* Optional small red accent

It should avoid full realistic shading. The look should be graphic and poster-like, with sharp silhouettes and large flat colour areas.

### Background-Mapped Areas

Some parts of the laptop illustration can appear to inherit colours from the animated background instead of using a fixed fill colour.

This creates the impression that the laptop is partially transparent, refractive, or fused with the underwater blue environment.

Important: this should not feel like simple opacity. The laptop should still have a clear silhouette, but some interior shapes or edge areas can reveal the animated background inside them.

### Motion

The laptop should have a very slow floating motion.

It can:

* Drift slightly up and down
* Rotate by a very small amount
* Swing gently, as if suspended in water
* React subtly when the menu opens

The movement should be calm compared to the cursor and menu text. The cursor is sharp and snappy; the laptop is slow and atmospheric.

---

## Menu Opening Sequence

When the visitor enters the main menu from the landing screen, several things should happen together:

1. The transition mask covers or reveals the menu
2. Menu text appears from transparency and slight downward offset
3. The cursor spawns near the currently selected option
4. The laptop illustration drops or floats into its position
5. Decorative frame shapes briefly appear in sequence
6. The selected-section information becomes visible

The opening should feel like a game menu being activated.

### Frame Sequence

The menu opening can include a short frame sequence made of angular white and blue shapes. These shapes appear very briefly, like graphic transition frames.

The frames should:

* Be sharp and geometric
* Use white, blue, and transparent cutout areas
* Flash in sequence very quickly
* Help blend the previous screen into the menu screen
* Last only a fraction of a second

This should not feel like a loading animation. It should feel like a stylized menu impact effect.

---

## Transition Masks

Transitions into and out of the main menu should use bold mask effects instead of simple fades.

### Double-Circle Cut

One transition style uses two overlapping circular masks. The circles expand or contract to reveal or hide the menu.

This can be used especially for going back or closing the menu.

The effect should feel clean, graphic, and slightly surreal.

### Wavy Blot Cut

Another transition style uses a circular blot shape with a wavy sine-like edge.

The blot expands across the screen, with its edge moving like liquid or ink in water. A second larger or offset blot can appear behind it with a slight delay, creating a layered transition.

This works especially well when entering a new menu or section.

### Transition Personality

Transitions should not feel like standard web fades. They should feel like animated masks cutting through the screen.

The overall personality should be:

* Fast
* Graphic
* Watery
* Slightly aggressive
* Consistent with the Persona-inspired menu language

---

## Selected Menu State Information

The main menu should display small system-like information that updates when the selected option changes.

### Main Index Panel

A white polygon or angular panel should appear on the left or lower-left area of the screen.

It should contain:

```txt
MAIN
01
```

The number updates based on the currently selected menu option.

Example:

```txt
MAIN
01
```

for `PROJECTS`

```txt
MAIN
02
```

for `EDUCATION`

```txt
MAIN
03
```

for `EXPERIENCE`

The index should feel like a system readout, not a page number.

### Selected Option Info

A tooltip-style information block should appear near the bottom right or lower area of the screen.

It should contain:

* A title matching the selected section
* A subtitle describing the command/category
* A thin trailing line extending from the subtitle

Example:

```txt
View Projects
Quest Log ───────────────
```

Other possible mappings:

```txt
View Education
Stats ───────────────
```

```txt
View Experience
Social Link ───────────────
```

```txt
View Stack
Skill List ───────────────
```

```txt
Ask Juniel
Broadcast ───────────────
```

The trailing line should be crisp and geometric. It should feel like part of the UI frame.

---

## Bottom Navigation Prompts

The bottom of the screen should include small guide prompts showing what the visitor can do.

Possible prompts:

```txt
↑ ↓ / Move
Enter / Select
Esc / Back
```

On mobile, these should be replaced by touch-friendly language:

```txt
Tap a command to open it
```

The prompts should be subtle and should not compete with the main menu options.

---

## Decorative Confetti / Particles

The main menu can include small polygonal confetti shapes layered above the background.

These shapes should:

* Be simple polygons
* Use blue, white, and occasional red
* Appear with additive brightness or a glowing feel
* Drift or flicker subtly
* Stay sparse

They should support the atmosphere without making the screen noisy.

---

## Interaction Behaviour

### Keyboard

The main menu should support keyboard-like navigation:

* Up: previous option
* Down: next option
* Enter: open selected section
* Escape: return to landing screen

### Mouse

Mouse movement over a menu item should update the selected option.

Clicking a menu item should open that section.

The cursor should react to mouse selection the same way it reacts to keyboard selection.

### Touch

On mobile or touch devices, each menu item should be large enough to tap comfortably.

Touching a menu item can either:

* Select it first, then require a second tap to open
* Or immediately open it

For simplicity, immediate opening is acceptable on mobile.

---

## Sound Behaviour

The main menu can include subtle UI sounds.

Recommended sounds:

* Small blip when the selected option changes
* Stronger confirm sound when opening a section
* Lower cancel sound when going back
* Soft whoosh when the menu opens

Sounds should be short, clean, and quiet. They should support the game-menu feeling without becoming annoying.

A sound toggle should be available somewhere in or near the main menu.

---

## Visual Rules

The full main menu should follow these rules:

* The animated blue background must remain visible
* The selected menu item must be much stronger than inactive items
* The cursor must feel like a real part of the typography
* The right-side laptop illustration must replace the character-art role
* The interface should use sharp angles, skewed bars, polygons, and strong contrast
* Red should be rare and used mainly for the cursor or one small accent
* The screen should feel like a stylized developer command menu, not a standard portfolio homepage

---

## What This Screen Should Not Do

The main menu should not:

* Look like a normal website navbar
* Use generic cards for navigation
* Use a realistic photo of the developer
* Use copyrighted Persona character art
* Feel static
* Hide the animated background completely
* Overuse red accents
* Use emoji
* Depend on a light-mode version

---

## Summary

The full main menu is the portfolio’s central command screen.

It combines:

* A vertical Persona-style section list
* A sharp animated cursor
* Wavy blue menu text
* A large floating laptop/developer-machine illustration
* System-style selected-section information
* Graphic transition masks
* Short, snappy interactions
* Subtle sound and motion polish

The goal is for the visitor to feel like they are navigating a personalized JRPG-inspired developer interface, where each portfolio section is treated as a command, quest, stat screen, skill list, or communication channel.
