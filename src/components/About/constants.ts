// About Me ("DIALOGUE") screen tunables. Plain values / `as const` objects, kept
// free of React + DOM so tuning the look never touches component logic (same
// split as MainMenu/constants.ts, Stack/constants.ts, Landing/constants.ts).
//
// The screen is a Persona-style CONVERSATION with an AI version of Juniel: an
// identity "speaker" panel, a transcript of angled dialogue boxes, the signature
// blue angular response-choice chips (suggested prompts), a command-style composer
// with voice controls, and a bottom bar of external links + a CONTACT button.

import { DEFAULT_P3R_CONFIG, type P3RConfig } from '@/components/P3RBackground/constants'

// --- Copy ------------------------------------------------------------------
export const SECTION_TITLE = 'ABOUT'
// Small system-tag subtitle under the title (mono, muted) — sets the "talk to me"
// framing without a second big headline.
export const SUBTITLE = '// ask the AI anything about Juniel'

// Identity panel — who you're talking to.
export const SPEAKER_NAME = 'Juniel Djossou'
export const SPEAKER_ROLE = '// Software Engineer · CS @ UWaterloo'
export const SPEAKER_STATUS = 'ONLINE'
// Initials for the angular monogram avatar (used when no /public portrait is set).
export const SPEAKER_INITIALS = 'JD'
// Name tag shown above each assistant dialogue box.
export const ASSISTANT_TAG = 'JUJU AI'
export const USER_TAG = 'YOU'

// The opening assistant line, shown as the first dialogue box before any input.
export const GREETING =
  "Hey — I'm Juju AI, Juniel's AI assistant. Ask me about his projects, experience, stack, or how he could help your team. You can type or talk to me."

// --- Suggested prompts (the blue angular choice chips) ---------------------
// Persona dialogue-option style. No leading index numbers (per the site's
// originality rule). Clicking one sends it as the visitor's next message.
export const SUGGESTED_PROMPTS: readonly string[] = [
  'Who is Juniel?',
  'How can Juniel help my company?',
  'What is his tech stack?',
  'Tell me about his best project.',
] as const

// --- Composer --------------------------------------------------------------
export const INPUT_PLACEHOLDER = 'Ask about Juniel…'
export const CONTACT_BUTTON_LABEL = 'Contact'
// Generic error surfaced in the transcript when /api/chat fails (no key, rate
// limit, network). Kept friendly — the page must never look broken.
export const CHAT_ERROR =
  "Sorry — I couldn't reach the model just now. Try again in a moment, or use the Contact button to reach Juniel directly."

// --- Palette ---------------------------------------------------------------
// B/W base with P3R blue + a sparing red accent (the menu's accent rule). Icons
// + chips read in pale electric blue; the active/selected accent is red.
export const ACCENT_BLUE = '#7EC8F5'
export const ACCENT_BLUE_DIM = 'rgba(126,200,245,0.55)'
export const ACCENT_RED = '#E83838'
export const CHIP_BG = 'rgba(126,200,245,0.10)'
export const CHIP_BORDER = 'rgba(126,200,245,0.40)'
export const PANEL_BG = 'rgba(8,20,34,0.62)' // glassy dark navy for boxes/panels
export const PANEL_BORDER = 'rgba(255,255,255,0.14)'
// Black text-shadow so white text stays legible wherever the water brightens.
export const OUTLINE_SHADOW =
  '0 0 3px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,1)'

// Angular clip for dialogue boxes / chips (cut top-left + bottom-right corners) —
// the Persona speech-box silhouette. Tuned small so it reads as a bevel, not a
// diamond.
export const BOX_CLIP = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'
export const CHIP_CLIP = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'

// --- Typography ------------------------------------------------------------
// Big cropped/skewed title (Bebas), like the other section titles.
export const TITLE_SIZE = 'clamp(3rem, 8vw, 7rem)'
export const TITLE_SKEW = '-6deg'
// Conversational body uses the rounded sans (Nunito) so replies feel spoken/
// friendly, distinct from the mono UI chrome elsewhere.

// --- Responsive gate (mirrors SocialLinkScreen) ----------------------------
// Below this width the screen drops from the side-by-side composition to a single
// stacked column.
export const DESKTOP_MIN_WIDTH = 880

// --- Background — About water variant --------------------------------------
// A focused, moderately-dark instance of the shared P3R water: darker than the
// menu (so the dialogue boxes + streaming text stay legible) but lighter than the
// near-black landing, with a calm warp. Only shader-uniform values are overridden
// (no texture re-bake); everything else inherits DEFAULT_P3R_CONFIG.
export const ABOUT_WATER: P3RConfig = {
  ...DEFAULT_P3R_CONFIG,
  baseGradient: {
    topLuma: 0.44, // mid blue surface — readable, not bright cyan
    midLuma: 0.22,
    bottomLuma: 0.06,
    midPoint: 0.58,
    noiseAmp: 0.05,
  },
  tint: {
    color: [0.0, 0.4, 0.58],
    alphaTop: 0.3,
    alphaBottom: 0.1,
  },
  distortion: { amplitude: 0.03, speed: 0.36, waveLength: 0.11 },
  caustic1: {
    ...DEFAULT_P3R_CONFIG.caustic1,
    color: [0.331, 0.929, 0.919, 0.14],
    velocityMain: [0.0, -0.05],
    velocitySecond: [0.0, 0.07],
    velocityBubbles: [0.0, 0.09],
    cut: 0.82,
  },
  caustic2: {
    ...DEFAULT_P3R_CONFIG.caustic2,
    color: [0.587, 0.888, 0.939, 0.22],
    velocityMain: [0.0, -0.07],
    velocitySecond: [0.0, 0.18],
  },
  blur: { sigma: 1.5 },
  steppedFps: 5,
  lightGlow: 0,
}
