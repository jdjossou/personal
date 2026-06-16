// Stack "Skill Screen" presentation constants — the tunable look of the P3R
// Skill-screen reproduction (docs/stack/stack_reference.png). The reference is a
// BRIGHT blue screen: a giant cropped STACK title up the left edge, two white
// semi-transparent triangles over the water, center-left party rows as
// quadrilaterals (straight left edge / diagonal right) each backed by an offset
// red drop-shadow, and a top-right skill list in cyan under a thick black header.
// Constants only — the category/technology data lives in stack.ts and the lookup
// helpers in helpers.ts, the same split as Education/constants.ts.

import {
  DEFAULT_P3R_CONFIG,
  type P3RConfig,
} from '@/components/P3RBackground/constants'

// --- Screen chrome ----------------------------------------------------------
export const SECTION_TITLE = 'STACK'
export const VIEW_HINT = 'Select a skill to see where it was used.'

// Keyboard indications shown bottom-right under the prompt, the P3R "(A) Confirm
// / (B) Back" analog. Edit freely — the prompt block maps over this list.
export const KEY_HINTS: readonly { keys: string; label: string }[] = [
  { keys: '↑ ↓', label: 'Move' },
  { keys: '← →', label: 'Category' },
  { keys: 'Enter', label: 'Select' },
  { keys: 'Esc', label: 'Back' },
]

// --- Rotated STACK title ----------------------------------------------------
// The reference's rotated cropped SKILL title → a giant STACK wordmark up the
// LEFT edge, oversized and clipped by the viewport, semi-transparent white so it
// reads as background branding. Position + angle are tunable: TOP/LEFT place the
// span's origin (negative values crop it off-screen), ROTATE tilts it (deg).
export const WORDMARK = SECTION_TITLE
export const WORDMARK_COLOR = 'rgba(188, 188, 188, 1)'
export const WORDMARK_SIZE = 'clamp(6rem, 25vw, 25rem)'
export const WORDMARK_TOP = '-10vh' // vertical origin (CSS top); negative crops off the top
export const WORDMARK_LEFT = '0.5vw' // horizontal origin (CSS left); negative crops off the left
export const WORDMARK_ROTATE = '10deg' // extra tilt on top of the vertical stacking

// --- White triangles --------------------------------------------------------
// Two big white, semi-transparent triangles over the water (the reference's pale
// angular fields). Tune each polygon (clip-path) + the shared opacity here.
export const TRIANGLE_FILL = 'rgba(255, 255, 255, 1)'
export const TRIANGLE_A_CLIP = 'polygon(0 0, 5% 0, 73% 100%, 0 100%)' // upper-right wedge
export const TRIANGLE_B_CLIP = 'polygon(77% 100%, 100% 100%, 100% 45%)' // lower wedge

// --- Category quadrilateral + red drop-shadow -------------------------------
// Each category row is a quadrilateral: straight LEFT edge (flush to the screen
// edge) + a DIAGONAL right edge. A red copy, offset behind, reads as its shadow.
export const CAT_CLIP =
  'polygon(0 0, 100% 0, 98.5% 100%, 0 100%)'
export const SHADOW_COLOR = '#C81E2C' // P3R red — the offset drop-shadow behind each row
// Offset toward the OPEN side (down-right): rows are flush to the screen's left
// edge, so a left/large-down offset pushed the red copy off-screen + detached it
// into the row gap. A small down-right offset keeps the red hugging the row as a
// clean drop-shadow/slash that peeks along the bottom + diagonal right edge.
export const SHADOW_OFFSET = 'translate(5px, -4px)'
export const ROW_GAP = '0vh' // vertical gap between roster rows

// Selected row: bright white fill + dark text (the lit party member). Unselected:
// SOLID black fill + white text — opaque so the red shadow only peeks at the
// offset edge (a translucent fill let the red bleed through the whole face).
export const SELECT_FILL = 'rgba(255, 255, 255, 1)'
export const SELECT_TEXT = '#0A1A2B'
export const ROW_FILL = '#0A0A0A'

// --- Skill list -------------------------------------------------------------
// Tech names in bright cyan; the category-name header above the list in thick
// black (so it reads over the bright water without a scrim).
export const SKILL_CYAN = '#5EE0E6'
export const HEADER_COLOR = '#0A0A0A'
// Vertical gap between the category-name header and the first skill row (e.g.
// LANGUAGES → JAVA). Applied as the skill-rows block's top margin.
export const SKILL_HEADER_GAP = '0.2vh'

// --- Focused skill row (right-list selection) -------------------------------
// The mirror of a selected CategoryRow: the focused tech renders as a WHITE
// rounded rectangle whose RIGHT side is flush to the screen edge (only the LEFT
// corners are rounded), backed by an offset P3R-red copy reading as a
// drop-shadow. Dark text reads over the white face.
export const SKILL_SELECT_FILL = 'rgba(255, 255, 255, 1)'
export const SKILL_SELECT_TEXT = '#0A1A2B'
export const SKILL_SELECT_RADIUS = '5px' // left-corner pill radius
export const SKILL_SHADOW_COLOR = SHADOW_COLOR // reuse the roster's P3R red
// Offset toward the OPEN side (down-left): the rect is flush to the screen's
// RIGHT edge, so a left/down offset lets the red peek along the rounded left side
// + bottom as a clean drop-shadow instead of sliding off-screen.
export const SKILL_SHADOW_OFFSET = 'translate(1px, -6px)'
// How far the white rect bleeds past the list block to touch the screen's right
// edge — must match SkillScreen's desktop `right-[4vw]` list offset.
export const SKILL_EDGE_BLEED = '4vw'

// --- Reference dialog -------------------------------------------------------
// The angular Persona panel opened by activating a focused tech (Enter / click).
// Lists the tech's reference links (where it was used); no rounded SaaS modal —
// the panel is a chamfered quadrilateral mirroring the screen's clip language.
export const DIALOG_BACKDROP = 'rgba(6, 14, 26, 0.72)' // dimming scrim behind the panel
export const DIALOG_CLIP =
  'polygon(0 0, calc(100% - 1.1rem) 0, 100% 1.1rem, 100% 100%, 1.1rem 100%, 0 calc(100% - 1.1rem))' // top-right + bottom-left corners cut
export const DIALOG_PANEL_FILL = '#0A1A2B' // deep navy face, dark Persona chrome
export const DIALOG_PANEL_TEXT = 'rgba(255, 255, 255, 0.92)'
export const DIALOG_ACCENT = SHADOW_COLOR // P3R red — header rule + offset shadow
export const DIALOG_LINK_CYAN = SKILL_CYAN // link labels echo the skill-list cyan
export const DIALOG_EMPTY = 'No references yet.' // shown when a tech carries no links

// --- Background water -------------------------------------------------------
// The Stack screen mounts its own instance of the P3R water (over the global
// bright one), the same move the landing makes. The palette sits HALFWAY between
// the site's bright DEFAULT and the landing's deep-navy LANDING_WATER — a
// mid-blue "dusk" read: dimmer than the menu, but not as crushed as the landing.
// Every value below is the arithmetic midpoint of DEFAULT_P3R_CONFIG and
// LANDING_WATER; tune here if Stack should diverge later.
export const STACK_WATER: P3RConfig = {
  ...DEFAULT_P3R_CONFIG,
  // Luma ramp pulled to the middle of the LUT — mid blue, not bright cyan, not
  // near-black depths.
  baseGradient: {
    topLuma: 0.53, // mid of 0.78 (default) / 0.28 (landing)
    midLuma: 0.35, // mid of 0.56 / 0.14
    bottomLuma: 0.07, // mid of 0.10 / 0.04
    midPoint: 0.6,
    noiseAmp: 0.055,
  },
  // Tint halfway between the bright cyan wash and the landing's deep teal.
  tint: {
    color: [0.0, 0.549, 0.734], // mid of [0,0.718,0.918] / [0,0.38,0.55]
    alphaTop: 0.36, // mid of 0.5 / 0.22
    alphaBottom: 0.14, // mid of 0.2 / 0.08
  },
  // Warp between the menu's energy and the landing's calm swell.
  distortion: { amplitude: 0.022, speed: 0.41, waveLength: 0.09 },
  caustic1: {
    ...DEFAULT_P3R_CONFIG.caustic1,
    color: [0.331, 0.929, 0.919, 0.18], // mid alpha of 0.255 / 0.11
    velocityMain: [0.0, -0.0575],
    velocitySecond: [0.0, 0.08],
    velocityBubbles: [0.0, 0.105],
    cut: 0.81, // mid of 0.79 / 0.83
  },
  caustic2: {
    ...DEFAULT_P3R_CONFIG.caustic2,
    color: [0.587, 0.888, 0.939, 0.34], // mid alpha of 0.471 / 0.2
    velocityMain: [0.0, -0.08],
    velocitySecond: [0.0, 0.205],
  },
  blur: { sigma: 1.55 }, // mid of 1.4 / 1.7
  // Corner glow at half strength (default 1 / landing 0).
  lightGlow: 0.5,
}
