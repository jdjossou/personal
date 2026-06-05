// Landing / start screen tunables — Task 01 (layout foundation).
// Plain values / `as const` objects, kept free of React + DOM so tuning the
// look never touches component logic (same split as MainMenu/constants.ts and
// P3RBackground/constants.ts).

// --- Copy ------------------------------------------------------------------
export const NAME = 'Juniel Djossou'
export const ROLE_LABEL = '// Software Engineer · CS Student'
// Subtle, unobtrusive mention of the word "portfolio" (system-tag styled).
export const PORTFOLIO_TAG = '// portfolio'

// The centerpiece prompt, one word per stacked line. Each word is rendered as
// its own block so Task 03's scan-line foreground can drive across the glyphs.
// Desktop copy ships now; the responsive TAP ANYWHERE variant is a Task 04
// concern (swap PROMPT_WORDS behind a touch check).
export const PROMPT_WORDS = ['PRESS', 'ANY', 'BUTTON'] as const

// --- Background ------------------------------------------------------------
// Base fill for the shard background (Task 02). The canvas paints a vertical
// gradient: a deep navy at the top (BG_COLOR) → darker navy (BG_COLOR_MID) →
// near-black at the bottom (BG_COLOR_BOTTOM). Kept dark and moody. The hue still
// leans into the menu's blue water family (its cyan-blue #00B7EA tint, brightest
// at the top) so entering the menu reads as the same blue world with the lights
// coming up rather than a hard colour cut — but the values stay low so the screen
// reads dark / high-contrast, never light. No actual water is used here; the
// landing keeps its own self-contained shard backdrop (per the doc).
export const BG_COLOR = '#0a1830' // deep navy top, faint blue lean
export const BG_COLOR_MID = '#06101f' // darker navy
export const BG_COLOR_BOTTOM = '#03060d' // near-black

// --- Shard background (Task 02) --------------------------------------------
// Geometric shard artwork: angular polygon fragments layered at different
// depths/opacities behind the title text. Plain values only (no React/DOM) so
// tuning the look never touches ShardBackground.tsx — same split as
// MainMenu/constants.ts. Drawn on a canvas mirroring ParticleField's lifecycle.

// Near-monochrome palette — a tight set of cool blues only a few steps off the
// dark base, so shards read as faint particles of light catching the navy rather
// than coloured stained glass. No red, no bright fills, no outlines: shards are
// soft filled fragments only, so nothing draws a sharp coloured edge.
export const SHARD_COLORS = [
  '#0e1d39', // base navy, barely above background
  '#14294b', // navy
  '#1b3258', // muted blue
] as const

// Far fewer fragments — a sparse, particle-like scatter, not a full mosaic.
export const SHARD_COUNT = 26

// Per-shard randomized ranges. Depth drives parallax strength, scale, and
// opacity (far = small/dim, near = larger/slightly bolder). Size is the polygon
// radius in px before the depth scale. Sides keeps shards angular.
export const SHARD_DEPTH_RANGE = [0.15, 1.0] as const
export const SHARD_SIZE_RANGE = [24, 150] as const
export const SHARD_SIDES_RANGE = [3, 5] as const
// Low opacities so the dark background stays dominant and the field reads subtle.
export const SHARD_OPACITY_RANGE = [0.08, 0.28] as const
// Very slow autonomous drift (px/sec) so the field feels alive but calm.
export const SHARD_DRIFT_RANGE = [1.5, 6] as const

// Shimmer / light pass: a soft band of brightness sweeping left → right across
// the screen. SPEED is fractions-of-width per second; WIDTH is the gaussian
// falloff (fraction of screen width); AMP is the peak added lightness alpha.
export const SHARD_SHIMMER_SPEED = 0.1
export const SHARD_SHIMMER_WIDTH = 0.16
export const SHARD_SHIMMER_AMP = 0.3

// Center clearance: shards whose centre falls inside this rectangle (fractions
// of the viewport) are thinned out and dimmed so the name + PRESS ANY KEY block
// stays legible. The block sits left-aligned around mid-height (see Landing.tsx).
export const SHARD_CLEAR_RECT = { x0: 0.02, y0: 0.22, x1: 0.62, y1: 0.82 } as const
// Probability a shard generated inside the clear rect is discarded outright, and
// the opacity multiplier applied to those that survive there.
export const SHARD_CLEAR_DISCARD = 0.78
export const SHARD_CLEAR_DIM = 0.4

// --- Typography ------------------------------------------------------------
// PRESS ANY KEY is by far the largest element; clamp keeps it dominant yet
// responsive. line-height < 1 tightens the three stacked lines.
export const PROMPT_FONT = 'clamp(3.25rem, 13vw, 12rem)'
export const PROMPT_LINE_HEIGHT = 0.85

// Name sits over the prompt — prominent, white, but clearly second in hierarchy.
export const NAME_FONT = 'clamp(1.9rem, 4.4vw, 3.75rem)'

// Subdued mono labels (role + portfolio) and the link buttons.
export const LABEL_FONT = 'clamp(0.7rem, 1.1vw, 0.875rem)'

// --- Layout ----------------------------------------------------------------
// Left inset of the whole text block (vw), echoing the reference's left margin.
export const BLOCK_LEFT_VW = 5
// Gap between the identity cluster (label / name / portfolio) and the giant
// prompt, in rem. Keeps the name visually "over" the prompt without overlap.
export const PROMPT_GAP_REM = 0.5

// --- External links --------------------------------------------------------
// Lower-left furniture, echoing where the ATLUS logo sits in the reference.
// `icon` keys map to SVGs in icons.tsx. Résumé is the PDF hosted from /public.
export type IconKey = 'github' | 'linkedin' | 'devpost' | 'resume'
export type LinkItem = {
  label: string
  href: string
  icon: IconKey
  // Opened in a new tab; the résumé PDF and the social profiles are all external
  // to the start screen flow.
  newTab: boolean
}

export const LINKS: readonly LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/jdjossou', icon: 'github', newTab: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/juniel-djossou/',
    icon: 'linkedin',
    newTab: true,
  },
  { label: 'Devpost', href: 'https://devpost.com/jdjossou', icon: 'devpost', newTab: true },
  // Served straight from public/ by Next — opening it views the PDF in-browser.
  { label: 'Résumé', href: '/assets/docs/resume.pdf', icon: 'resume', newTab: true },
] as const

// --- Link button colour theme ----------------------------------------------
// Icons + labels read in the P3R blue/white palette rather than brand colours,
// so the row stays cohesive with the rest of the screen. Resting state is a
// muted pale blue; hover brightens toward white.
export const LINK_ICON_COLOR = '#7EC8F5'
export const LINK_TEXT_COLOR = 'rgba(255,255,255,0.65)'
export const LINK_BORDER_COLOR = 'rgba(126,200,245,0.35)'
export const LINK_BG_COLOR = 'rgba(126,200,245,0.06)'
