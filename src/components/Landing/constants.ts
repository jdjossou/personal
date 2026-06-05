// Landing / start screen tunables — Task 01 (layout foundation).
// Plain values / `as const` objects, kept free of React + DOM so tuning the
// look never touches component logic (same split as MainMenu/constants.ts and
// P3RBackground/constants.ts).

import { DEFAULT_P3R_CONFIG, type P3RConfig } from '@/components/P3RBackground/constants'

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

// --- Background (Task 02) — landing water variant --------------------------
// The landing reuses the site's animated P3R water (P3RBackground) instead of a
// separate artwork, but mounts its OWN instance with a darker, calmer config so
// it feels distinct from the main menu while clearly belonging to the same blue
// world. Entering the menu then reads as the same water with the lights coming
// up. Only shader-uniform values are overridden here (no texture re-bake): the
// gradient lumas + tint are pulled down to sample the dark end of the shared blue
// LUT, and the animation is slowed and quietened. Everything not listed inherits
// the site default (DEFAULT_P3R_CONFIG).
export const LANDING_WATER: P3RConfig = {
  ...DEFAULT_P3R_CONFIG,
  // Darker base: pull the whole vertical luma ramp down so it sits in the deep
  // navy / dark-blue region of the LUT and never reaches the bright cyan/white top.
  baseGradient: {
    topLuma: 0.28, // was 0.78 — dark blue surface, well below the bright cyan band
    midLuma: 0.14, // was 0.56
    bottomLuma: 0.04, // was 0.10 — near-black depths
    midPoint: 0.6,
    noiseAmp: 0.05,
  },
  // Faint, deep-toned teal wash so the tint adds mood without brightening.
  tint: {
    color: [0.0, 0.38, 0.55], // deeper teal than the default cyan
    alphaTop: 0.22, // was 0.5
    alphaBottom: 0.08, // was 0.2
  },
  // Calmer warp — gentler, slower swell than the menu's.
  distortion: { amplitude: 0.024, speed: 0.32, waveLength: 0.1 },
  // Dimmer, sparser caustics drifting more slowly (subdued vs the menu).
  caustic1: {
    ...DEFAULT_P3R_CONFIG.caustic1,
    color: [0.331, 0.929, 0.919, 0.11], // was alpha 0.255 — dim streaks
    velocityMain: [0.0, -0.045],
    velocitySecond: [0.0, 0.06],
    velocityBubbles: [0.0, 0.08],
    cut: 0.83, // was 0.79 — sparser streaks
  },
  caustic2: {
    ...DEFAULT_P3R_CONFIG.caustic2,
    color: [0.587, 0.888, 0.939, 0.2], // was alpha 0.471
    velocityMain: [0.0, -0.06],
    velocitySecond: [0.0, 0.16],
  },
  // Softer focus + a slightly slower shimmer cadence so it reads distinct.
  blur: { sigma: 1.7 },
  steppedFps: 5,
  // Kill the additive corner glow (Layer 8) so the bottom-left stays as dark as
  // the rest of the frame instead of lifting brighter.
  lightGlow: 0,
}

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
