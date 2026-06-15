# Persona 3 Reload–Inspired Experience List Page — Visual Design Specification

## Purpose of the Page

This page is an **Experience list screen** for a portfolio website. Its purpose is to show all experiences in a stylized vertical menu before the user opens a specific experience detail page.

The design should feel like a Persona 3 Reload menu: sharp, angular, energetic, high-contrast, and layered over a bright blue animated background. The page should not look like a normal web list. It should feel like a game UI screen where the user is selecting an item from a menu.

## Required Content Changes from the Reference

Use the reference screenshot as the visual base, but adapt the content to a portfolio experience page.

The reference can be found at `docs/experience/experience_list.png`.

- Every reference to **Social Link** or **S. Link** must become **Experience**.
- The **rank label and rank number** must be replaced by the **date range** of the experience.
- The large text at the top-left of each card must become the **role position**.
- The text at the bottom of each card must become the **company name**.
- The selected experience must use the **black and white palette**.
- Non-selected experiences must use the **dark navy, cyan, and aqua palette**.
- Do not render a tarot card icon, tarot card number, arcana number, or any equivalent numbered badge.
- Do not render a character illustration in the background.

## Overall Screen Composition

The page is a full-screen 16:9 game-menu composition. It should fill the viewport and avoid looking like a centered web component.

The layout has three major visual zones:

1. **Left side:** the main interactive experience list.
2. **Center and right side:** blue animated background plus a large white diagonal graphic panel.
3. **Bottom-right:** a small prompt and control hint area.

The left-side list is the focus of the page. The right side is decorative and should add motion, scale, and Persona-style asymmetry without competing with the list.

## Layer Stack

Render the page using this approximate layer order, from back to front:

1. **Animated blue background**  
   Already implemented in the project. It fills the entire viewport.

2. **Large white diagonal panel on the right**  
   A huge white polygon cuts across the right side of the screen. It starts near the upper-right edge and continues diagonally toward the lower-middle area. It should feel like a giant paper-like slash over the blue background.

3. **Large semi-transparent diagonal wordmark**  
   Place a giant gray word such as `EXPERIENCE` on top of the white panel. The text is rotated diagonally and partially cropped by the viewport. It is aligned with the diagonal.

4. **Small floating shards / geometric accents**  
   Optional if already part of the animated background. These should be subtle, not the main focus.

5. **Top-left page title**  
   The word `LIST` in large white italic text.

6. **Experience list cards**  
   A vertical stack of angular cards on the left side.

7. **Bottom-right prompt and controls**  
   A thin underline, a short guide prompt, and confirm/back hints.

## Background Treatment

The page should keep the existing animated blue background.

The background should not be covered by a flat overlay. It should remain visible behind the cards and around the white diagonal panel.

### Right-Side White Diagonal Panel

The right side should include a large white diagonal panel inspired by the reference screenshot. Since the character is omitted, this panel becomes the main background graphic element.

Suggested shape:

```css
clip-path: polygon(55% 0%, 100% 0%, 100% 45%, 72% 100%, 52% 100%, 72% 45%);
```

This is only a starting point. The important qualities are:

- It is large and bold.
- It occupies the right half of the screen.
- Its edges are diagonal, not rectangular.
- It cuts through the blue background dramatically.
- It is pure white or near-white.
- It feels like a giant graphic slash, not a normal card.

The white panel should sit behind the list cards. It can overlap the middle of the screen, but it should not obscure the left-side list.

### Large Background Wordmark

On the white diagonal panel, place a huge gray wordmark:

```text
EXPERIENCE
```

Visual behavior:

- The wordmark should be very large.
- It should be rotated diagonally. It should be aligned with the diagonal of the white panel.
- It should be partially cropped by the right and bottom edges of the viewport.
- It should use a heavy bold italic sans-serif font.
- It should be light gray, not black.
- It should feel like background branding, not readable body text.

Suggested styling:

```css
font-size: clamp(7rem, 13vw, 16rem);
font-weight: 900;
font-style: italic;
letter-spacing: -0.06em;
color: rgba(0, 0, 0, 0.28);
transform: rotate();
```

The wordmark should not say `SOCIAL LINK`. It should say `EXPERIENCE`.

## Top-Left Page Title

The top-left title says:

```text
LIST
```

Visual style:

- Large uppercase text.
- White fill.
- Heavy bold italic sans-serif.
- Slight forward slant.
- Positioned above the first experience card.
- Aligned with the left edge of the list, but slightly more to the left.
- It should feel like a menu category label, not a page heading from a normal website.

Approximate placement:

```css
left: 3.5vw;
top: 15vh;
font-size: clamp(3rem, 5.5vw, 6rem);
font-weight: 900;
font-style: italic;
line-height: 0.9;
```

The title should have a crisp, graphic look. A very subtle cyan or navy shadow can be used, but avoid making it soft or blurry.

## Experience List Layout

The experience list appears as a vertical stack on the left side of the screen.

Approximate placement:

```css
left: 4.5vw;
top: 23vh;
width: 34vw;
```

The cards should not be perfectly aligned like normal rectangles. They should look layered, slightly offset, and angular.

Recommended list behavior:

- The selected item sits visually on top of the stack.
- Non-selected items are stacked below with tight vertical spacing.
- Cards may overlap slightly or have very small gaps.
- Each card uses diagonal right edges.
- Each card has strong geometric silhouettes.
- The list should feel like a dynamic game menu, not a static table.

Suggested card dimensions:

```css
card width: 32vw to 36vw;
card height: 10vh to 13vh;
vertical gap: 0.6vh to 1.2vh;
```

On a 16:9 desktop viewport, five cards should be visible comfortably.

## Card Content Structure

Each experience card contains three pieces of information:

1. **Role position**  
   Large text in the upper-left area.

2. **Date range**  
   Smaller but bold text in the upper-right area. This replaces the original rank area.

3. **Company name**  
   Text inside the lower strip of the card.

Example content structure:

```text
Software Engineer Intern        May 2026 – Aug 2026
Microsoft Azure AI
```

Do not include a rank label, rank number, tarot number, arcana number, or card icon.

It is basically a simpler version of the card in the specific experience page, but with some elements removed, like the location, and some elements moved. Another difference is that the black shape with the company name is a rectangle and in this one, as can be seen in the reference.

## Selected Experience Card

The selected experience is the most important visual state. It must use the **black and white palette** like the selected row in the reference.

### Selected Card Shape

The selected card should be a white angular parallelogram-like panel with a dramatic red offset layer behind it.

Suggested structure:

```html
<div class="experience-card selected">
  <div class="selected-red-shadow"></div>
  <div class="selected-main-panel">
    <div class="selected-top-row">
      <span class="role">Software Engineer Intern</span>
      <span class="date-range">May 2026 – Aug 2026</span>
    </div>
    <div class="selected-company-strip">
      Microsoft Azure AI
    </div>
  </div>
</div>
```

Suggested outer shape:

```css
clip-path: polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%);
```

The selected card should not be a perfect rectangle. The right edge should lean down and right. The left edge can also have a slight diagonal cut, but it should not contain any tarot badge.

### Selected Card Colors

Use this palette:

```css
main background: #ffffff;
main text: #050505;
company strip: #050505;
company text: #ffffff;
red offset accent: #ff1f12;
```

The selected card should feel sharp and loud. The red accent is important because it gives the selected card the same aggressive Persona-style energy as the reference.

### Red Offset Accent

Behind the selected white card, place a red polygon of the same general shape. It should be slightly offset to the right and down.

Suggested styling:

```css
.selected-red-shadow {
  position: absolute;
  inset: 0;
  transform: translate(10px, 6px);
  background: #ff1f12;
  clip-path: polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%);
  z-index: 0;
}
```

The red should mostly appear on the right edge and lower-right edge. It should not cover the main white panel.

### Selected Top Row

The upper section of the selected card is white.

Role position:

- Large.
- Black.
- Heavy bold italic.
- Left aligned.
- Tight letter spacing.
- Positioned close to the top-left.

Date range:

- Black.
- Bold.
- Right aligned.
- Smaller than the role text, but still very visible.
- It replaces the original `RANK` and number area.
- It can use two levels of scale if needed, but it should read as one date range, not a rank value.

Suggested styling:

```css
.role {
  font-size: clamp(1.8rem, 3vw, 3.8rem);
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.06em;
  color: #050505;
}

.date-range {
  font-size: clamp(0.9rem, 1.3vw, 1.6rem);
  font-weight: 900;
  text-transform: uppercase;
  color: #050505;
  white-space: nowrap;
}
```

### Selected Company Strip

The lower section of the selected card is a black horizontal strip.

Visual behavior:

- It sits inside the selected white panel.
- It spans most of the card width.
- It has a slightly angular left and right edge.
- It should not be too tall.
- It should contain the company name.
- The company name should be white and centered or slightly right-weighted.

Suggested styling:

```css
.selected-company-strip {
  background: #050505;
  color: #ffffff;
  height: 34%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 1.6vw, 2rem);
  font-weight: 600;
  clip-path: polygon(3% 0%, 100% 0%, 98% 100%, 0% 100%);
}
```

The selected company strip should create a strong black-and-white contrast with the white upper area.

## Non-Selected Experience Cards

Non-selected cards use the blue/cyan palette. They should look energetic but less dominant than the selected card.

Each non-selected card has two main areas:

1. A **dark navy upper panel** containing the role and date range.
2. A **bright cyan lower strip** containing the company name.

### Non-Selected Card Shape

The non-selected card should be a dark navy parallelogram with a cyan strip below it. It should have a slanted right edge and a slightly angular left side.

Suggested outer shape:

```css
clip-path: polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%);
```

The lower cyan strip can extend slightly differently from the top panel so the card feels layered.

### Non-Selected Colors

Use this palette:

```css
upper panel: #080b5f;
upper panel alternate: #060846;
cyan text: #82f8ff;
cyan strip: #83f4f6;
cyan outline: #65fbff;
company text on cyan strip: #09104f;
shadow / backing shape: #03072f;
```

The exact values can be adjusted, but the contrast should remain:

- dark navy upper section,
- bright aqua/cyan text,
- bright cyan lower strip,
- dark navy company text on the strip.

### Non-Selected Upper Panel

The upper panel contains the role position on the left and the date range on the right.

Role position:

- Large.
- Bold italic.
- Aqua/cyan or near-white with cyan tint.
- Left aligned.
- Slightly compressed or condensed.

Date range:

- Upper-right.
- Aqua/cyan.
- Smaller than the role.
- Bold and compact.
- Should not use the word `RANK`.

Suggested styling:

```css
.non-selected .role {
  color: #83f8ff;
  font-size: clamp(1.5rem, 2.5vw, 3rem);
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.07em;
}

.non-selected .date-range {
  color: #83f8ff;
  font-size: clamp(0.75rem, 1vw, 1.25rem);
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
}
```

### Non-Selected Company Strip

The lower strip is bright cyan and contains the company name.

Visual behavior:

- It should be lower than the role row.
- It should feel like a separate panel attached to the card.
- It should be slightly inset or clipped differently from the top panel.
- It should have dark navy text.
- The text should be centered horizontally.

Suggested styling:

```css
.non-selected-company-strip {
  background: #83f4f6;
  color: #09104f;
  height: 36%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.95rem, 1.5vw, 1.9rem);
  font-weight: 600;
  clip-path: polygon(3% 0%, 98% 0%, 100% 100%, 6% 100%);
}
```

### Non-Selected Card Shadow

Each non-selected card should have a dark backing shape slightly offset to the lower-right. This creates the layered, stacked look.

Suggested styling:

```css
.non-selected::before {
  content: "";
  position: absolute;
  inset: 0;
  transform: translate(10px, 8px);
  background: #03072f;
  clip-path: polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%);
  z-index: -1;
}
```

This shadow should be graphic and flat, not soft or blurred.

## Card Alignment and Stacking

The cards should look like a stack of sharp UI plates.

Recommended behavior:

- The selected card should be slightly farther left than the non-selected cards.
- Non-selected cards can be indented by `1vw` to `1.5vw` compared to the selected card.
- Cards should be close vertically, with almost no empty space.
- Some card shadows may overlap the card below.
- The selected card should have the highest z-index.

Approximate positioning:

```css
.experience-list {
  position: absolute;
  left: 4.5vw;
  top: 23vh;
  width: 35vw;
}

.experience-card {
  position: relative;
  width: 100%;
  height: 11.5vh;
  margin-bottom: 0.8vh;
}

.experience-card.selected {
  transform: translateX(-0.6vw);
  z-index: 10;
}

.experience-card:not(.selected) {
  transform: translateX(0.8vw);
  z-index: 1;
}
```

The selected card should feel like it is being pulled forward.

## Left-Side Decorative Accent

The reference has a bold vertical/slanted accent near the lower-left of the list. You can include a simplified version to maintain the game UI feel.

Suggested accent:

- A tall, thin, slanted black rectangle behind the list.
- A shorter white strip layered over it.
- Positioned near the left edge of the lower cards.
- It should look decorative, not like a scrollbar unless it is intentionally used as one.

Suggested styling:

```css
.list-side-accent {
  position: absolute;
  left: 6vw;
  top: 75vh;
  width: 1.2vw;
  height: 18vh;
  background: #050505;
  transform: rotate(-5deg);
}

.list-side-accent::after {
  content: "";
  position: absolute;
  left: 35%;
  top: 8%;
  width: 35%;
  height: 60%;
  background: #ffffff;
}
```

This is optional, but it helps the list feel less like a plain column.

## Bottom-Right Prompt Area

The bottom-right area should include a small guide-style prompt inspired by the screenshot.

Replace the original prompt with experience wording.

Recommended prompt:

```text
Which experience do you want to view?
```

This reads more naturally than a literal replacement such as `Whose Experience do you want to view?`.

Visual style:

- White italic text.
- Medium size.
- Thin dark outline or shadow for readability.
- Positioned above a thin horizontal line.
- Bottom-right aligned.
- Should not overpower the list.

Suggested placement:

```css
right: 4vw;
bottom: 8vh;
```

Suggested styling:

```css
.prompt-text {
  color: #ffffff;
  font-size: clamp(1rem, 1.8vw, 2rem);
  font-weight: 800;
  font-style: italic;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.55);
}

.prompt-line {
  width: 32vw;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
}
```

## Confirm / Back Controls

At the bottom-right, include small input hints. These should be adapted to the website rather than copied literally from a console UI.

Possible desktop version:

```text
Enter View    Esc Back
```

Possible gamepad-inspired version:

```text
ENTER Confirm    ESC Back
```
Use a version that match with the rest of the project.

Visual style:

- Small white text.
- Rounded button glyphs or outlined circles for the key labels.
- Slight black shadow or outline.
- Aligned along the bottom-right.
- Below the prompt line.

The controls are secondary. They should be readable but not visually dominant.

## Typography Direction

The design depends heavily on typography. Use fonts with the following qualities:

### Title and Role Text

Use a bold italic condensed sans-serif font.

Characteristics:

- Heavy weight.
- Italic or oblique slant.
- Tight letter spacing.
- Sharp modern feeling.
- Works well in uppercase and title case.

The role position should be the most prominent text inside each card.

### Date Range Text

Use a compact bold sans-serif.

Characteristics:

- Smaller than role text.
- Very bold.
- High contrast.
- No decorative serif.
- Should fit in the upper-right area without wrapping.

If a date range is long, shrink it slightly rather than letting it wrap.

### Company Name Text

The company name can use a slightly different style to mimic the contrast in the reference.

Characteristics:

- Medium-large size.
- Clear and readable.
- Slightly more formal than the role text.
- Can be serif or clean sans-serif depending on the rest of the site.
- Should be centered in the lower strip.

## Motion and Interaction

The screen should feel responsive and alive, but transitions should be quick and graphic rather than soft.

### Selection Change Animation

When the user changes the selected experience:

- The newly selected card changes from navy/cyan to black/white.
- It shifts slightly left.
- It moves above the other cards in z-index.
- The red accent appears behind it.
- The previously selected card returns to the navy/cyan palette.

Suggested transition timing:

```css
transition: transform 120ms ease-out, filter 120ms ease-out;
```

Avoid slow fades. Persona-style UI feels snappy and assertive.

### Hover State

On desktop, hovering over a non-selected card can preview selection.

Suggested hover behavior:

- Slight left shift.
- Slight brightness increase.
- Cursor becomes pointer.
- Do not fully apply the selected black/white palette unless hover also changes actual selection.

### Click / Confirm Behavior

When the user clicks or confirms a selected experience:

- Briefly flash or scale the card.
- Navigate to the specific experience detail page.
- The detail page can use the same black-and-white selected card palette, since that is already part of the existing specific experience page.

## Responsive Behavior

### Desktop / Wide Screens

Use the full composition:

- `LIST` title top-left.
- Experience cards on the left.
- White diagonal panel and giant `EXPERIENCE` wordmark on the right.
- Prompt and controls bottom-right.

### Tablet

- Keep the list on the left, but widen it slightly.
- The white diagonal panel can become more cropped.
- The giant wordmark can remain partially visible.
- Reduce role text size to avoid wrapping.

### Mobile

The exact reference composition is very wide, so mobile needs adaptation.

Recommended mobile approach:

- Keep the animated blue background.
- Keep the `LIST` title near the top-left.
- Make the list cards occupy most of the screen width.
- Remove or heavily crop the right-side white diagonal panel.
- Hide the giant `EXPERIENCE` wordmark if it makes the page crowded.
- Move the prompt below the list or hide it if navigation is obvious.

Mobile card width:

```css
width: 88vw to 94vw;
left: 4vw;
```

The selected card should still use black/white, and non-selected cards should still use navy/cyan.

## Accessibility and Readability

Even though the design is highly stylized, the information should remain readable.

Important rules:

- Role position must not be cut off.
- Date range should not overlap the role text.
- Company name should be centered and readable.
- Text should have enough contrast against its panel.
- Do not place important text directly on the animated background without a panel.
- The selected state should not rely on movement only; the palette change must clearly identify it.
- Keyboard navigation should be supported.

## Recommended Data Model

Make use of the data in experience.ts.
