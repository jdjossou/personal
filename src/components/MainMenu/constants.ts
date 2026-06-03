// Main menu tunables — Task 02 (selection system & selector cursor).
// Plain values / `as const` objects, kept free of React + DOM so tuning the
// look never touches component logic (same split as P3RBackground/constants.ts).

export const MENU_ITEMS = [
  'PROJECTS',
  'EDUCATION',
  'EXPERIENCE',
  'STACK',
  'ASKME',
] as const

// --- Selected-item colours -------------------------------------------------
// Selected text is two-tone: black where it sits over the plain blue background,
// red where it crosses the white selector triangle.
export const SELECTED_BLACK = '#0A0A0A'
export const SELECTED_RED = '#E01010'
// The two behind-text selector shapes: a white triangle over an offset red one
// that reads as its shadow.
export const SELECTOR_WHITE = '#FFFFFF'
export const SELECTOR_RED_SHADOW = '#C40000'

// --- Per-item appearance ---------------------------------------------------
// Each menu item is tilted at its own angle and the items overlap vertically.
// `z` orders them front-to-back; the more front-most (higher z) an item is, the
// brighter its blue. `overlapY` is a negative margin that superposes an item
// onto the previous one; `nudgeX` shifts it horizontally for an organic stack.
export type ItemStyle = {
  angleDeg: number
  blue: string
  z: number
  overlapY: number // px, negative superposes onto the item above
  nudgeX: number // px
}

// Indices line up with MENU_ITEMS (0 = PROJECTS … 4 = ASKME).
export const ITEM_STYLES: readonly ItemStyle[] = [
  { angleDeg: -5, blue: '#A8D4F5', z: 5, overlapY: 0, nudgeX: 0 }, // PROJECTS  (front, brightest)
  { angleDeg: 3, blue: '#6FA8D6', z: 2, overlapY: -12, nudgeX: 22 }, // EDUCATION
  { angleDeg: -6, blue: '#95C7EF', z: 4, overlapY: -8, nudgeX: -10 }, // EXPERIENCE
  { angleDeg: 4, blue: '#5E97C8', z: 1, overlapY: -10, nudgeX: 30 }, // STACK     (back, dimmest)
  { angleDeg: -3, blue: '#7EB8E8', z: 3, overlapY: -12, nudgeX: 8 }, // ASKME
] as const

// The selected item always sits on top of the stack.
export const SELECTED_Z = 20

// --- Timings ---------------------------------------------------------------
// Item swap is near-instant so the hierarchy snaps rather than morphs.
export const ITEM_TRANSITION_MS = 100
// Selector entrance jolt + perpetual low-frequency idle wobble.
export const TWITCH_MS = 150
export const IDLE_PERIOD_MS = 2500
// Temporary: drives the demo auto-cycle until Task 06 wires real input.
export const AUTOCYCLE_MS = 1500

// --- Selector geometry -----------------------------------------------------
// A true triangle, as fractional points in a 0–100 box (y grows downward). It
// spans the full width at the top and narrows to a point near the bottom-right,
// so its only edge that crosses the letters is the single diagonal running from
// the top-left down to that apex — everything above/right of it reads red, and
// the bottom-left wedge left below it reads black. The top and right vertices
// sit slightly OUTSIDE the box (negative / >100) on purpose: the shape overflows
// (overflow-visible) so no edge lies flush along the text box, which is what made
// the previous version look like a boxed-in, multi-sided cutout. The red shadow
// is the same triangle offset down-right by a few px.
export const SELECTOR_SHAPE: readonly (readonly [number, number])[] = [
  [-8, 22], // top-left, just past the corner
  [110, -10], // top-right, just past the corner
  [100, 110], // apex near the bottom-right — the diagonal cut runs back to top-left
] as const
export const SELECTOR_SHADOW_OFFSET = { x: 7, y: 7 } as const // px

// Shared geometry, formatted for the two consumers:
//  - SVG <polygon points> (viewBox 0 0 100 100, preserveAspectRatio="none")
//  - CSS clip-path: polygon(…%) on the red text overlay (same box → aligned)
export const shapeSvgPoints = (): string =>
  SELECTOR_SHAPE.map(([x, y]) => `${x},${y}`).join(' ')

export const shapeClipPath = (): string =>
  `polygon(${SELECTOR_SHAPE.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
