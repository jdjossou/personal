// Education "Academic Status" presentation constants — the tunable look of the
// Check-Status redesign (section chrome, category badge labels/colours, the
// per-status term accents, the selection accent, and the diagonal slash-field
// palette). Constants only: course/term data lives in education.ts and the
// formatting/lookup in helpers.ts. Kept React/DOM-free so the components stay
// logic-free, same split as Projects/constants.ts.

import type { CourseCategory } from './education'
import type { TermStatus } from './education'

// --- Screen chrome ----------------------------------------------------------
// Repurposed from P3R's "Check Status" screen: the top bumper reads
// ACADEMIC STATUS (with ← / → paging the roster), and the bottom "whose stats?"
// prompt becomes "which term?".
export const SECTION_TITLE = 'ACADEMIC STATUS'
export const VIEW_HINT = 'Which term do you want to view?'

// --- Category badge ---------------------------------------------------------
// The reference's LEADER/PARTY role badge → course category, used by the course
// list inside a term's detail. Data enum stays CORE/ELECTIVE/SEMINAR; these are
// only the display labels and accent colours.
export const CATEGORY_LABEL: Record<CourseCategory, string> = {
  CORE: 'CORE',
  ELECTIVE: 'ELECTIVE',
  SEMINAR: 'SEMINAR',
}

export const CATEGORY_COLOR: Record<CourseCategory, string> = {
  CORE: '#E0444A', // confident crimson — the "main" requirements
  ELECTIVE: '#5EA8E0', // cold P3R blue
  SEMINAR: '#9AA7B4', // muted slate — supporting
}

// --- Term status ------------------------------------------------------------
// Each roster term carries its progress status; this drives the row's left
// accent border and the detail's status tag. Completed terms read in cold P3R
// blue, the live ("current") term in crimson, and not-yet terms in muted slate.
export const TERM_STATUS_LABEL: Record<TermStatus, string> = {
  completed: 'Completed',
  current: 'In Progress',
  upcoming: 'Upcoming',
}

export const TERM_STATUS_COLOR: Record<TermStatus, string> = {
  completed: '#5EA8E0',
  current: '#E0444A',
  upcoming: '#6B7785',
}

// --- Selection accent -------------------------------------------------------
// The active term row uses the same soft translucent crimson + white marker as
// the Projects quest rows, so selection reads consistently across the site.
export const SELECT_BAND_FILL = 'rgba(163, 22, 33, 0.82)' // soft translucent crimson
export const SELECT_MARKER_WHITE = '#FFFFFF'

// --- Slash field ------------------------------------------------------------
// The diagonal blue brush-slashes that sweep across the screen are the page's
// signature (the divergence from the Projects quest log). P3R cold blues, soft
// and additive over the dark scrim; tune freely. Ordered light → deep.
export const SLASH_BLUES = ['#8FCBF2', '#5EA8E0', '#3E7CB1', '#1E3A5F'] as const

// --- Backdrop shapes --------------------------------------------------------
// Large, soft, low-opacity angular colour fields behind the content (Backdrop
// shapes) — Persona puts colours + shapes behind the text, so the screen isn't
// one flat scrim. All cool tones (red is reserved for the selection band only):
// a deep cold-blue slab behind the roster, a steel-blue wedge behind the
// identity, and a faint cyan accent. Kept muted so text stays the hero.
export const SHAPE_DEEP_BLUE = '#10273F' // cold slab behind the roster
export const SHAPE_STEEL = '#2F5E86' // steel-blue wedge behind the identity
export const SHAPE_CYAN = '#2C7DA0' // faint accent glint

// --- Angular shape language -------------------------------------------------
// The clip-paths that "de-square" the UI, modelled on the menu's parallelogram
// badge (INDEX_PANEL_CLIP). Reused across the roster panel, the selection band,
// and any tag so the angular language stays consistent (one chamfer + one skew).

// Chamfered panel — top-right and bottom-left corners cut, the Persona/HUD cut.
export const PANEL_CLIP =
  'polygon(0 0, calc(100% - 1.1rem) 0, 100% 1.1rem, 100% 100%, 1.1rem 100%, 0 calc(100% - 1.1rem))'

// Selection band — a flat left edge (carries the white marker) with the right
// edge slanted, so the active row reads as a slanted band, not a rectangle.
export const BAND_CLIP = 'polygon(0 0, 100% 0, calc(100% - 0.7rem) 100%, 0 100%)'

// Spare parallelogram tag (slanted left + right edges) for small badges.
export const TAG_CLIP = 'polygon(7% 0, 100% 0, 93% 100%, 0 100%)'
