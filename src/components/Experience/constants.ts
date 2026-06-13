// Experience "Social Link" presentation constants — the tunable look of the
// screen (section title, navigation labels, the accent palette, the black/white
// info card, the scattered comic-frame job HIGHLIGHTS, the floating tech tokens,
// the vertical indicator, and the clip-paths). Constants only: role data lives in
// experience.ts and formatting/lookup in helpers.ts. Kept React/DOM-free so the
// components stay logic-free, same split as Education/constants.ts and Projects/constants.ts.

// --- Screen chrome ----------------------------------------------------------
// The screen is titled EXPERIENCE (top-left, sitting above the detail card) and
// replaces the LB/RB controller prompts with Previous / Next navigation.
export const SECTION_TITLE = 'EXPERIENCE'
export const NAV_PREV = 'Prev'
export const NAV_NEXT = 'Next'

// --- Sizing & typography (the dials) ----------------------------------------
// Everything visual that you'll want to nudge while matching the reference, in
// one place. Values are raw CSS strings so they can be dropped straight into
// inline `style`; `clamp(min, fluid, max)` keeps a value responsive (it grows
// with the viewport between min and max) without needing Tailwind breakpoints.
// Skews are kept as their own dials so the whole screen can lean together.

// EXPERIENCE section title (top-left / mobile heading).
export const TITLE_SIZE = 'clamp(3rem, 10vw, 12rem)' // desktop fluid headline
export const TITLE_SIZE_MOBILE = '3.75rem' // mobile stacked heading
export const TITLE_SKEW = '-4deg' // forward lean of the title
export const TITLE_TRACKING = '-0.02em' // letter-spacing

// Prev / Next navigation controls.
export const NAV_LABEL_SIZE = 'clamp(2rem, 4rem, 5rem)' // the PREV/NEXT word
export const NAV_LABEL_SKEW = '-8deg' // forward lean of the label
export const NAV_LABEL_OUTLINE = '0.75px' // black text-stroke around the label
export const NAV_ARROW_SIZE = '2.4rem' // outer red arrow-head box
export const NAV_ARROW_HOVER = '#FF8A00' // arrow color when its label is hovered (orange highlight)
export const NAV_ARROW_OUTLINE_WIDTH = '1.5px' // thickness of the black outline traced around the arrow
export const NAV_ARROW_OUTLINE_COLOR = '#000000' // color of the arrow outline
export const NAV_GAP = '0.625rem' // space between arrow and label

// Bond pager pips (bottom-left selector).
export const PAGER_PIP_ACTIVE = '0.6rem' // the filled, selected pip
export const PAGER_PIP_IDLE = '0.45rem' // the faint, unselected pips
export const PAGER_GAP = '0.5rem' // space between pips

// Detail card (white/black parallelogram) text.
export const CARD_TITLE_SIZE = 'clamp(1.25rem, 2.75vw, 4rem)' // big role title
export const CARD_TITLE_SKEW = '-7deg' // lean of the role title
export const CARD_COMPANY_SIZE = 'clamp(1.25rem, 2vw, 1.5rem)' // company in black panel
export const CARD_DATE_SIZE = 'clamp(1.25rem, 2vw, 1.5rem)' // date range, upper-right

// ★ Job HIGHLIGHTS — a scattered comic-frame collage (JobPanels). Each bullet is
// its own ink-bordered comic frame; the frames are deliberately NOT left-aligned
// and each varies its offset, width, tilt, text size, and fill/accent so the set
// reads like a hand-placed Persona splash rather than a tidy list. See JobPanels.
// Frame shape + ink — a plain RECTANGLE with a thick black comic outline drawn as
// a real border (a border works cleanly on a rectangle, no two-layer trick needed).
export const COMIC_BORDER_WIDTH = '4px' // chunky comic ink line
export const COMIC_BORDER_COLOR = '#0B0D12' // ink outline
export const COMIC_PANEL_FILL = 'rgba(243, 245, 248, 0.82)' // translucent paper — water shows faintly through
export const COMIC_TEXT_COLOR = '#0B0D12' // ink text on paper frames
export const COMIC_HALFTONE_COLOR = 'rgba(11, 13, 18, 0.22)' // dot texture on paper frames

// Frame layout — base vertical rhythm + the collage overlap (negative = frames
// tuck under each other).
export const COMIC_FRAME_PAD = '0.7rem 1rem'
export const COMIC_FRAME_OVERLAP = '-0.6vh' // vertical tuck between consecutive frames

// Per-point variance — indexed by bullet position (wraps via modulo). The jagged
// left OFFSETS are the heart of the look; WIDTHS/TILTS/SIZES add energy. Colour no
// longer alternates: every frame shares one scheme (white paper, black ink rim,
// red corner star) so the collage reads as a single unified comic surface.
export const COMIC_OFFSETS = ['0vw', '5vw', '1.5vw', '7vw', '3vw'] // left indent → jagged edges
export const COMIC_WIDTHS = ['30vw', '27vw', '33vw', '25vw', '29vw'] // frame width
export const COMIC_TILTS = ['-2.5deg', '1.5deg', '-1.5deg', '2deg', '-2deg'] // frame rotation (kept small → readable)
export const COMIC_SIZES = ['1.3rem', '1rem', '1.1rem', '0.95rem', '1.2rem'] // text size hierarchy

// --- Tech stack (floating tokens) -------------------------------------------
// The tech stack lives below the card on the LEFT (change 4): a "TECH STACK"
// title, then the technologies as angular tokens that bob on the water and can be
// dragged. Their start + default-float positions are seeded inside an invisible
// ZONE (TECHZONE_*) below the card; they can be dragged anywhere and stay put.
export const TECH_TITLE = 'TECH STACK'
export const TECH_TITLE_SIZE = 'clamp(2rem, 4vw, 3.4rem)' // bigger
export const TECH_TITLE_SKEW = '-7deg' // slight forward tilt
export const TECH_TITLE_OUTLINE = '1px' // thin black ink stroke traced around the caps (no shadow)
export const TECH_TITLE_OUTLINE_COLOR = '#0B0D12'
export const TECH_TITLE_TOP = '45vh' // below the white card + its shadow
export const TECH_TITLE_LEFT = '2vw'

// The invisible seeding zone (offsets from the stage; tokens scatter inside it).
// Starts below the TECH STACK title (TECH_TITLE_TOP) so tokens don't overlap it.
export const TECHZONE_TOP = '58vh'
export const TECHZONE_LEFT = '3vw'
export const TECHZONE_WIDTH = '40vw'
export const TECHZONE_HEIGHT = '30vh'

// Token look + float dynamics.
export const TECH_TOKEN_SIZE = '0.8rem'
export const TECH_TOKEN_OUTLINE = '1.5px' // cyan rim traced around the full clipped shape
export const TECH_FLOAT_AMPLITUDE = 10 // px of gentle bob (translate)
export const TECH_FLOAT_DUR_MIN = 4 // s — bob cycle range, randomized per token
export const TECH_FLOAT_DUR_MAX = 7

// Angular spring physics — shaking a token (fast drag) spins it; it then eases
// back to 0° (upright = readable). A damped spring integrated each frame:
//   accel = -K*angle - DAMP*vel ; vel += SHAKE_GAIN*dragDx while dragging.
export const TECH_SPRING_K = 90 // stiffness — higher snaps back faster (ω≈1.5Hz)
export const TECH_SPRING_DAMP = 6 // damping — higher settles with less wobble
export const TECH_SHAKE_GAIN = 1.2 // deg/s of spin per px of horizontal drag step
export const TECH_SPIN_MAX = 720 // clamp on angular velocity (deg/s), avoids runaway

// --- Layout & positions (desktop collage) -----------------------------------
// Where each block sits on the desktop stage and how wide it is. Every block is
// absolutely positioned, so these are its offset(s) from the stage edges plus a
// width. Values are CSS lengths — `vw`/`vh` (% of viewport width/height), `%`
// (of the stage), or `rem`. Mobile uses a simple stacked flow and ignores these.

// EXPERIENCE title (top-left).
export const TITLE_TOP = '2vh'
export const TITLE_LEFT = '0vw'

// Prev / Next row. NAV_INSET_X is the side padding that pushes the two controls
// inward from the row's edges (Prev from the left, Next from the right).
export const NAV_TOP = '12vh'
export const NAV_LEFT = '-2.5vw'
export const NAV_WIDTH = '50.5vw'
export const NAV_INSET_X = '4.5vw'

// Detail card (white/black parallelogram). The card is stacked directly beneath
// the EXPERIENCE title in one column, so it has no top/left of its own: the
// column is placed by TITLE_TOP / TITLE_LEFT above. CARD_GAP is the card's top
// margin — POSITIVE pushes it lower, NEGATIVE pulls it up over the title until
// the bottom of the letters touches the card's top edge (font line-boxes leave
// some slack under the caps, so a negative value is normal to close that). This
// way the card always tracks the title, whatever size the title is. CARD_WIDTH
// sets the column (and therefore the card) width.
export const CARD_GAP = '-2vh'
// width of the white card
export const CARD_WIDTH = '44vw' 
// Height of the white card. Use 'auto' to let it grow with its content (company
// panel + role title); set a fixed length (vw/vh/rem/%) to pin it — note that
// the white card's clip-path will crop anything taller than this.
export const CARD_HEIGHT = '26.67vh'

// White card overhang past the left screen edge. The black panel is clipped to
// the white card, so this also caps how far the black panel can bleed left:
// raise it to let the black bleed further off-canvas (positive = more overhang).
export const CARD_BLEED_LEFT = '3vw'

// --- Detail-card internals (fully positioned) -------------------------------
// Everything inside the white card, each independently movable + sizable. X/Y
// are offsets from the element's natural spot: positive X = right, negative =
// left; positive Y = down, negative = up. WIDTH/HEIGHT size the box ('auto' =
// fit the content). Lengths are CSS units (vw/vh/%/rem).

// BLACK company panel. A big negative CARD_BLACK_X bleeds it off the left edge
// (it's clipped to the white card — see CARD_BLEED_LEFT to let it go further).
export const CARD_BLACK_X = '-5vw' // horizontal offset (− = toward/off left edge)
export const CARD_BLACK_Y = '-2vh' // vertical offset (− = up, + = down)
export const CARD_BLACK_WIDTH = '44vw' // panel width (of the white card)
export const CARD_BLACK_HEIGHT = '10vh' // panel height ('auto' = fit the company text)

// COMPANY name — bottom-aligned inside the black panel; this is its gap from the
// panel's bottom edge.
export const CARD_COMPANY_BOTTOM = '0.875rem'

// TITLE over DATE — a right-aligned stack in the white below the black panel:
// title on top, date beneath, both flush to CARD_DATE_RIGHT. CARD_TITLE_TOP is
// the gap above the stack; CARD_TITLE_DATE_GAP the gap between title and date.
// MAXW caps the title width so a long title wraps before crossing the white
// card's slanted right edge (and stays on one line when it fits).
export const CARD_TITLE_TOP = '2.5vh' // gap above the title + date stack
export const CARD_TITLE_DATE_GAP = '0.7vh' // gap between title and date
export const CARD_TITLE_MAXW = '90%' // max title width before it wraps
export const CARD_DATE_RIGHT = '7%' // right indent of the title + date stack

// LOCATION pennant — the triangular tab poking out of the black panel. TOP/LEFT
// place it relative to the black panel, WIDTH sizes it; its shape is
// LOCATION_TRI_CLIP (in the clip-paths section). The text inside is placed and
// angled independently via LOCATION_TEXT_* below, so it can ride along the
// triangle's bottom-right edge.
export const LOCATION_TOP = '8.333vh' // vertical spot (relative to black panel)
export const LOCATION_LEFT = '2vw' // horizontal spot (relative to black panel)
export const LOCATION_WIDTH = '15vw' // pennant width ('auto' = fit the location text)
export const LOCATION_HEIGHT = '6.667vh' // pennant height (the text is absolute, so set it here)

// LOCATION text — positioned inside the pennant, independent of the pennant's
// shape. TOP/LEFT place the text within the pennant; SIZE sets the font size. The
// angle is NOT a dial — it's computed at render time from the pennant's measured
// size + LOCATION_TRI_POINT_X so the text always rides exactly along the
// triangle's bottom-right edge (see ExperienceCard).
export const LOCATION_TEXT_TOP = '3.5vh' // text vertical spot (within the pennant)
export const LOCATION_TEXT_LEFT = '1.5vw' // text horizontal spot (within the pennant)
export const LOCATION_TEXT_SIZE = '1.2rem' // location pennant text size

// ★ Job HIGHLIGHTS collage — right side, starts high and flows down into the
// freed bottom-right space (the logo plate was removed). The container is placed
// by these dials; per-frame offsets/widths live in the COMIC_* arrays above.
export const BULLETS_TOP = '13vh'
export const BULLETS_RIGHT = '3.5vw'
export const BULLETS_WIDTH = '46vw'

// Back-to-menu control (bottom-RIGHT, sharing the logo plate's right edge, sitting
// below it). Wired like the rest of the site (handoff → main menu).
export const BACK_BOTTOM = '3vh'
export const BACK_RIGHT = '3vw'

// Vertical experience indicator — a column of pips just RIGHT of the white card,
// vertically centred on the card and leaned to PARALLEL the card's slanted right
// edge. The angle is NOT a fixed dial: CARD_WHITE_CLIP's right edge runs 100% top →
// 90% bottom, and the card mixes vw width with vh height, so the real on-screen
// lean depends on the viewport. ExperienceCard measures the card and computes the
// angle (same approach as the location-pennant text). INDICATOR_GAP is the gap
// placed to the right of the card's shadow.
export const INDICATOR_GAP = '0.75rem'

// --- Accents ----------------------------------------------------------------
// Red is reserved for the Previous / Next arrows — the ONE warm accent on an
// otherwise blue/navy/black/white screen, so it pops (redesign §12). Cyan is the
// ★ bullet markers + the chip/token borders (the reference's character-name cyan).
export const ACCENT_RED = '#E23B3B' // prev/next arrows ONLY
export const ACCENT_CYAN = '#FFFFFF' // bullet ★ + chip/token borders
export const SELECT_MARKER_WHITE = '#FFFFFF' // pager pip

// --- Detail card (white parallelogram + inner black panel) ------------------
// The black-and-white angled card in the upper-left (the reference's Social Link
// banner): a large off-white parallelogram bleeding off the left edge, an inset
// near-black panel carrying the COMPANY (centred), a black location pennant, the
// experience title (black) + date range (black). Strong B/W contrast, never a
// soft rounded card.
export const CARD_INK = '#0B0D12' // near-black inner panel + location pennant
export const CARD_PAPER = '#F3F5F8' // off-white main parallelogram

// Drop-shadow card — a semi-transparent black copy of the white parallelogram,
// layered behind it and offset down/right so it reads as a cast shadow (change 5).
export const CARD_SHADOW_X = '1vh' // horizontal offset (+ = right)
export const CARD_SHADOW_Y = '1vw' // vertical offset (+ = down)
export const CARD_SHADOW_FILL = 'rgba(0, 0, 0, 0.45)'

// --- Navy / tag palette -----------------------------------------------------
// Shared dark-blue grounds reused by the angular bullet chips (change 3) and the
// floating tech tokens (change 4). Dark blue at ~0.85 opacity (rgba so foreground
// text stays fully opaque) plus a steel-blue accent hue and a darker tag ground.
export const PANEL_NAVY_75 = 'rgba(2, 3, 55, 0.85)' // dark-blue chip ground
export const PANEL_NAVY_STEEL = '#1D22F3' // steel-blue accent
export const TAG_FILL = '#0B0D12' // black token ground (fully opaque)

// --- Angular shape language (clip-paths) ------------------------------------
// The clip-paths that "de-square" the UI into the layered Persona/HUD shapes.

// Detail card — the large WHITE parallelogram. It bleeds off the LEFT screen
// edge (the card is shifted left so its left slant is off-canvas), so only the
// slanted RIGHT edge reads. Right edge leans left going down → a parallelogram.
export const CARD_WHITE_CLIP =
  'polygon(0 0, 100% 0, 90% 100%, 0 100%)'

// Inner BLACK parallelogram — shorter than the white shape and inset from its
// top + right (white shows above and to the right). Both vertical edges slant
// the same way, parallel to the white card's right edge.
export const CARD_BLACK_CLIP =
  'polygon(0 0, 100% 0, 96.25% 100%, 0 100%)'

// Location pennant — a black tab dropping out of the black panel's bottom-left,
// a flat top carrying the location text with a triangular point beneath it (the
// "triangular extension"), so the text stays on black and the shape reads as a
// triangle poking out of the panel.
// LOCATION_TRI_POINT_X is the X (% of width) of the downward point; it's shared
// by the clip below and the text-angle math in ExperienceCard so they stay in
// sync. The bottom-right edge runs from the top-right corner (100% 0) down to
// this point (X 100%); the location text is angled to ride along that edge.
export const LOCATION_TRI_POINT_X = 10
export const LOCATION_TRI_CLIP = `polygon(0 0, 100% 0, ${LOCATION_TRI_POINT_X}% 100%)`

// Tech token (floating chip) — a leaning parallelogram, same angular idiom as the
// bullet chips. Reused for each draggable technology token (change 4).
export const TECH_TOKEN_CLIP =
  'polygon(0.6rem 0, 100% 0, calc(100% - 0.6rem) 100%, 0 100%)'
