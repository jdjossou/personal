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

// --- Background (placeholder) ----------------------------------------------
// Flat deep-navy stand-in so the screen reads dark and never light. Task 02
// swaps this single layer for the shard artwork — keep it isolated.
export const BG_COLOR = '#0a1428'

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
