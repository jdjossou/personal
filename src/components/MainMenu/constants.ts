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

// --- Menu list layout (section texts) --------------------------------------
// Size + horizontal placement of the vertical section list (Zone B). Sizes are
// CSS font-size (clamp keeps them responsive); the selected item is larger than
// the inactive ones. The list is anchored to the right edge: a wider zone +
// smaller left pad push the whole list further left.
export const MENU_SELECTED_FONT = 'clamp(3.5rem, 6.6vw, 5.6rem)'
export const MENU_INACTIVE_FONT = 'clamp(3rem, 5.6vw, 4.7rem)'
export const MENU_ZONE_WIDTH = '80%' // width of the right-hand zone the list fills
export const MENU_LIST_PAD_LEFT_VW = 0 // left pad inside that zone (vw); smaller = further left

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

// --- System info panels (Task 05) ------------------------------------------
// The two game-HUD readouts that update with `selectedIndex`: a white skewed
// index badge (MAIN / 01) in the lower-left, and a title + subtitle-with-
// trailing-line info block (View Projects / Quest Log ───) in the lower-right.
// Master toggle, mirroring SHOW_LEFT_PANEL.
export const SHOW_SYSTEM_PANELS = true

// Per-item content, indices aligned to MENU_ITEMS (0 = PROJECTS … 4 = ASKME).
export type SectionInfo = {
  index: string // two-digit readout, e.g. '01'
  title: string // "View …" line
  subtitle: string // Persona-style category label
}
export const SECTION_INFO: readonly SectionInfo[] = [
  { index: '01', title: 'View Projects', subtitle: 'Commands' },
  { index: '02', title: 'View Education', subtitle: 'Commands' },
  { index: '03', title: 'View Experience', subtitle: 'Commands' },
  { index: '04', title: 'View Stack', subtitle: 'Commands' },
  { index: '05', title: 'Ask Juniel', subtitle: 'Commands' },
] as const

// The constant label above the number in the index badge.
export const INDEX_PANEL_LABEL = 'MAIN'
// The badge is a sharp parallelogram (slanted left/right edges) cut from a white
// fill, with dark text. clip-path in the 0–100% box (x y per corner).
export const INDEX_PANEL_CLIP = 'polygon(12% 0, 100% 0, 88% 100%, 0% 100%)'
export const INDEX_PANEL_WHITE = SELECTOR_WHITE
export const INDEX_PANEL_TEXT = SELECTED_BLACK
// Brief scale-pulse when the number changes (snappy, not a crossfade).
export const PANEL_PULSE_MS = 110

// Info-block colours: bright title, muted pale-blue subtitle + trailing line.
export const INFO_TITLE_COLOR = '#F2F8FF'
export const INFO_SUBTITLE_COLOR = '#9CC6EE'
// Trailing line after the subtitle (em-dash run reads as part of the UI frame).
export const INFO_TRAILING = '───────────────'
// Quick fade-out → fade-in on change (game-like, short).
export const INFO_FADE_OUT_MS = 80
export const INFO_FADE_IN_MS = 120

// --- Left panel (Task 04) --------------------------------------------------
// The left side of the menu is a flat WHITE region whose right edge is an
// organic, gently-flowing curve (not a straight line) — taking the role the
// character's body outline plays in the P3R reference. The white hides the water
// on the left; the curve reveals it on the right. Coordinates are in the panel
// SVG's 0–100 viewBox (preserveAspectRatio="none", so x maps to screen width).
// Master toggle for the whole left visual — set to false to remove both the
// white background panel AND the name label on it (leaving just the water).
export const SHOW_LEFT_PANEL = true

export const PANEL_WHITE = '#FFFFFF'
// The white region is slightly transparent so the water tints through it.
export const PANEL_OPACITY = 0.9

// Mean horizontal position of the white/blue boundary (viewBox units ≈ % width).
export const PANEL_BASE_X = 13
// The edge is sampled at this many points down its height, then smoothed.
export const PANEL_EDGE_SAMPLES = 9
// Two layered sine waves deform the edge over (y, time) for an organic, slowly
// morphing silhouette. `k` is spatial frequency (per viewBox height), `speed` is
// temporal (rad/s), `amp` in viewBox units. Small amplitudes = "a little bit".
export const PANEL_WAVES = [
  { amp: 0.5, k: 0.6, speed: 0.1, phase: 0 },
  { amp: 1, k: 2.3, speed: 0.2, phase: 1.7 },
] as const

// Big vertical name down the far-left edge (Bebas). Black, very large.
export const VERTICAL_LABEL = 'JUNIEL'
// Font-size of the name — fully viewport-relative so it never breaks. It is
// capped by viewport HEIGHT (the stacked letters keep their vertical proportion
// and their bottom overflow) AND, via min(), by WIDTH (so on narrow/tall phones
// the vertical column can't grow wider than the screen). The small rem floor
// keeps it legible on tiny screens; the rem ceiling stops it on huge ones.
export const LABEL_FONT = 'clamp(4rem, min(42vh, 27vw), 32rem)'
// Slightly transparent so it isn't a flat solid black on the white.
export const LABEL_OPACITY = 0.75
// Vertical placement: the name is centred on the screen's middle, then shifted by
// this offset (vh, positive = downward). Centring keeps it near the middle on
// smaller screens too; the offset lets you nudge it off-centre.
export const LABEL_OFFSET_VH = 0
// Horizontal offset of the name, in vw. Negative pushes it off the left edge of
// the screen (so the left side of the letters runs out of view).
export const LABEL_LEFT_VW = -30
