// Experience LIST screen constants — the tunable look of the master list screen
// (menu → LIST → detail). Positions/sizes are `vw`/`vh`/`rem` against the full
// viewport (no scale-to-fit stage), matching the reference's 16:9 game-menu
// framing. Mobile collapses to a stacked flow.
//
// Detail-screen constants (SocialLinkScreen, ExperienceCard, etc.) live in
// constants.ts. Shared tokens like CARD_INK / CARD_PAPER / ACCENT_RED also live
// there — import them directly.

// --- Text ---
export const LIST_TITLE = 'CAREER' // top-left page/category label
export const LIST_WORDMARK = 'EXPERIENCE' // giant cropped background wordmark
export const LIST_PROMPT = 'Which experience do you want to view?' // bottom-right guide
export const LIST_HINT_OPEN = '↵ View' // confirm hint glyph + label
export const LIST_HINT_BACK = 'Esc Back' // back hint glyph + label

// --- Non-selected card palette (navy / cyan). Solid grounds — the existing
// PANEL_NAVY_* in constants.ts are translucent rgba meant for chips over water;
// list cards are opaque plates, so they get their own solid grounds. ---
export const LIST_NAVY = '#080B5F' // dark-navy upper panel
export const LIST_NAVY_ALT = '#060846' // alternate navy (depth between stacked cards)
export const LIST_CYAN_TEXT = '#83F8FF' // aqua role + date on the navy panel
export const LIST_CYAN_STRIP = '#83F4F6' // bright-cyan lower company strip
export const LIST_COMPANY_ON_CYAN = '#09104F' // navy company text on the cyan strip
export const LIST_CARD_SHADOW = '#03072F' // flat dark backing plate (offset down-right)

// --- Card clip-paths (angular plates — never plain rectangles). Selected and
// non-selected lean their right edge the same direction as the detail card. ---
export const LIST_CARD_CLIP = 'polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)' // non-selected outer
export const LIST_SELECTED_CLIP = 'polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)' // selected outer
// The company box is a plain rounded rectangle (not a parallelogram) inset from
// the plate edges — see LIST_STRIP_RADIUS / LIST_STRIP_INSET below.
export const LIST_STRIP_RADIUS = '4px' // rounded corners on the company box
export const LIST_STRIP_INSET = '7%' // left/right/bottom inset so it never touches the plate edges

// --- Card geometry / type ---
export const LIST_CARD_HEIGHT = '13vh' // one card's height (5 fit a 16:9 desktop)
export const LIST_CARD_GAP = '1.1vh' // tight vertical gap between cards
export const LIST_CARD_STRIP_FRAC = '34%' // company strip height as a share of the card
export const LIST_VISIBLE_CARDS = 5 // how many cards fit before the stack scrolls
export const LIST_DIAGONAL_STEP = '1.4vw' // each card sits this much right of the one above (diagonal stack)
export const LIST_RED_OFFSET = 'translate(8px, -2px)' // red slash offset behind the selected card
export const LIST_SHADOW_OFFSET = 'translate(7px, -2px)' // backing-plate offset behind a non-selected card
export const LIST_ROLE_SIZE = 'clamp(1.05rem, 1.85vw, 2.2rem)' // role title (upper-left, desktop)
export const LIST_ROLE_SIZE_MOBILE = 'clamp(1.5rem, 6.5vw, 2.6rem)' // role title (mobile — scales off the narrow viewport so it fills its row)
export const LIST_ROLE_SKEW = '-7deg' // role lean (matches the detail card)
export const LIST_DATE_SIZE = 'clamp(0.78rem, 1.05vw, 1.35rem)' // date range (upper-right)
export const LIST_COMPANY_SIZE = 'clamp(0.95rem, 1.45vw, 1.7rem)' // company on the strip

// --- List container placement (desktop) ---
export const LIST_STACK_LEFT = '4.5vw'
export const LIST_STACK_TOP = '23vh'
export const LIST_STACK_WIDTH = '36vw'

// --- LIST title (top-left) ---
export const LIST_TITLE_LEFT = '3.5vw'
export const LIST_TITLE_TOP = '12vh'
export const LIST_TITLE_SIZE = 'clamp(3.5rem, 6.5vw, 7rem)'
export const LIST_TITLE_SKEW = '-6deg'

// --- Right-side white diagonal panel + giant wordmark (faithful to reference) ---
// A bold near-white slash running TOP-RIGHT → BOTTOM-LEFT: the leading (left)
// edge leans left going down, from (52%,0) to (20%,100), so it reads as a giant
// graphic cut sweeping across the water, not a rectangle. The card stack is
// opaque, so the panel can pass behind it; it stays clear of the LIST title.
export const LIST_WHITE_PANEL_CLIP = 'polygon(70% 0%, 100% 0%, 100% 45%, 72% 100% ,0 100%)'
export const LIST_WHITE_PANEL_FILL = 'rgba(243, 245, 248, 0.72)' // semi-transparent near-white slash (paper hue, lets water show through)
export const LIST_WORDMARK_SIZE = 'clamp(8rem, 15vw, 18rem)'
export const LIST_WORDMARK_COLOR = 'rgba(55, 59, 89, 0.35)' // faint navy-gray branding on the white
export const LIST_WORDMARK_ROTATE = '-45deg' // parallel to the panel's leading diagonal edge ((52%,0)→(20%,100)), reading up-right
// Positioned along the panel's diagonal, then cropped by the bottom/right edges.
export const LIST_WORDMARK_RIGHT = '0.9vw'
export const LIST_WORDMARK_TOP = '30vh'

// --- Bottom-right prompt + controls ---
export const LIST_PROMPT_RIGHT = '4vw'
export const LIST_PROMPT_BOTTOM = '8vh'
export const LIST_PROMPT_LINE_WIDTH = '32vw'

// --- Desktop/mobile breakpoint (LIST-only — independent of the detail screen's
// DESKTOP_MIN_* in constants.ts). The list's collage holds up at much smaller
// widths than the detail stage, so it switches to the stacked mobile flow later.
//   • LIST_DESKTOP_MIN_WIDTH — below this px width → mobile.
//   • LIST_DESKTOP_MIN_ASPECT_W / _H — min width:height for desktop (ratio). Lower
//     it → more tall-ish windows stay desktop; raise it → flip to mobile sooner.
export const LIST_DESKTOP_MIN_WIDTH = 680
export const LIST_DESKTOP_MIN_ASPECT_W = 5
export const LIST_DESKTOP_MIN_ASPECT_H = 4
