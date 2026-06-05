// Transition mask tunables (Task 08). Plain values kept free of React + DOM so
// the look can be tuned without touching component logic — same split as
// P3RBackground/constants.ts and MainMenu/constants.ts.
//
// Two effects move between screens, both modelled as a REVEAL of the incoming
// screen (an SVG clip-path grows over it; the global water shows through wherever
// the clip hasn't reached yet):
//   - wavyBlot:     ink-spreading circle with a rippling sine edge — used ENTERING
//   - doubleCircle: two clean circles expanding from two focal points — used BACK

export type TransitionEffect = 'wavyBlot' | 'doubleCircle'

// Which screen a reveal belongs to — the destination's wrapper only consumes a
// hand-off whose target matches, so e.g. the landing screen never plays a reveal
// armed for the menu.
export type RevealTarget = 'landing' | 'menu' | 'section'

// Whole-mask duration. The doc asks for 400–600ms — fast and graphic, not a load.
export const TRANSITION_MS = 1000

// --- Wavy blot (Enter) -----------------------------------------------------
// Points sampled around the circle to draw the polygon edge. ~128 keeps the sine
// ripple smooth without being wasteful.
export const BLOT_POINTS = 128
// Edge distortion: r(θ) = baseR + amp·sin(freq·θ + phase). Amplitude in px,
// frequency = number of waves around the circle.
export const BLOT_AMPLITUDE_PX = 24
export const BLOT_FREQUENCY = 8
// How fast `phase` advances (radians/second) so the edge ripples as it grows,
// rather than simply scaling.
export const BLOT_PHASE_SPEED = 6
// The blot must finish covering even the far corner. We grow baseRadius to the
// screen's centre→corner distance, padded so the wavy trough still clears it.
export const BLOT_RADIUS_PAD_PX = BLOT_AMPLITUDE_PX + 8

// Second, layered blot: same family, slightly larger + phase-shifted + delayed,
// so it reads as related ink spreading just behind the first.
export const BLOT_SECOND_SCALE = 1.06 // radius multiplier vs the lead blot
export const BLOT_SECOND_PHASE_OFFSET = Math.PI * 0.6
export const BLOT_SECOND_DELAY_MS = 100
export const BLOT_SECOND_AMP_SCALE = 1.15 // a touch more wave on the trailing blot

// --- Double circle (Back) --------------------------------------------------
// Two clean circles (no wavy edge — the contrast with the blot is intentional),
// each expanding from its own focal point until it covers the screen. Focal
// points as fractions of the viewport (x, y).
export const CIRCLE_FOCI: readonly (readonly [number, number])[] = [
  [0.36, 0.46],
  [0.64, 0.54],
] as const
// The second circle lags the first by this much, giving the "double" feel.
export const CIRCLE_LEAD_LAG_MS = 80
// Small pad so each circle fully clears its farthest corner.
export const CIRCLE_RADIUS_PAD_PX = 4
