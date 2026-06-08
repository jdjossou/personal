// Experience "Social Link" presentation constants — the tunable look of the
// screen (section chrome, the selection accent, the diagonal blue stripe-field
// palette, the company tarot-card frame, and the angular clip-paths). Constants
// only: role data lives in experience.ts and formatting/lookup in helpers.ts.
// Kept React/DOM-free so the components stay logic-free, same split as
// Education/constants.ts and Projects/constants.ts.

// --- Screen chrome ----------------------------------------------------------
// From P3R's Social Link screen: the top bumper band reads SOCIAL LINK (with
// LB/RB paging the bond roster), and the bottom prompt asks which bond to view.
export const SECTION_TITLE = 'SOCIAL LINK'
export const VIEW_HINT = 'Which bond do you want to view?'

// --- Selection accent -------------------------------------------------------
// The active bond row uses the same soft translucent crimson + white marker as
// the Education term rows and Projects quest rows, so selection reads
// consistently across the whole site.
export const SELECT_BAND_FILL = 'rgba(163, 22, 33, 0.82)' // soft translucent crimson
export const SELECT_MARKER_WHITE = '#FFFFFF'

// --- Stripe field -----------------------------------------------------------
// The reference's diagonal blue striped field — the section's signature texture
// (the analog of Education's SlashField / SLASH_BLUES). P3R cold blues, soft and
// additive over the dark scrim; tune freely. Ordered light → deep.
export const STRIPE_BLUES = ['#8FCBF2', '#5EA8E0', '#3E7CB1', '#1E3A5F'] as const

// --- Company tarot card -----------------------------------------------------
// The tilted "system card" that carries the company logo (or a monogram
// fallback) on the right of the detail — the one intentional framed object on
// the screen. Sharp + tilted, never a soft rounded card. Tune the tilt, frame,
// and footprint here.
export const CARD_ROTATION = '-6deg' // tarot-style tilt
export const CARD_BORDER = '2px solid rgba(255, 255, 255, 0.85)'
export const CARD_WIDTH = '17rem'
export const CARD_ASPECT = '2 / 3' // classic tarot proportion

// --- Backdrop / angular shape language --------------------------------------
// Large, soft, low-opacity angular colour fields behind the content, plus the
// clip-paths that "de-square" the UI — modelled on the menu's parallelogram
// badge and reused across panels, the selection band, and tags so the angular
// language stays consistent (one chamfer + one skew). Cool tones only; red is
// reserved for the selection band.
export const SHAPE_DEEP_BLUE = '#10273F' // cold slab behind the roster
export const SHAPE_STEEL = '#2F5E86' // steel-blue wedge behind the detail
export const SHAPE_CYAN = '#2C7DA0' // faint accent glint

// Chamfered panel — top-right and bottom-left corners cut, the Persona/HUD cut.
export const PANEL_CLIP =
  'polygon(0 0, calc(100% - 1.1rem) 0, 100% 1.1rem, 100% 100%, 1.1rem 100%, 0 calc(100% - 1.1rem))'

// Selection band — a flat left edge (carries the white marker) with the right
// edge slanted, so the active row reads as a slanted band, not a rectangle.
export const BAND_CLIP = 'polygon(0 0, 100% 0, calc(100% - 0.7rem) 100%, 0 100%)'

// Spare parallelogram tag (slanted left + right edges) for small badges.
export const TAG_CLIP = 'polygon(7% 0, 100% 0, 93% 100%, 0 100%)'
