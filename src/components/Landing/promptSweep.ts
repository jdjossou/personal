// Prompt sweep — derived values for the Task 03 "PRESS ANY BUTTON" wipe.
//
// constants.ts holds the plain tunables; this module turns them into the things
// the component + `prompt-sweep` keyframe (globals.css) actually consume: the
// repeating-linear-gradient string, the horizontal translate distance, and the
// total cycle time. Kept separate so constants.ts stays free of functions/logic.
//
// The fill is ONE gradient clipped to the text (`background-clip: text`) plus a
// permanent white text-stroke (the outline). The gradient is a SYMMETRIC,
// 4-segment repeating pattern along the diagonal axis:
//   [ WHITE flat | group of transparent "/" strips | TRANSPARENT flat | group of
//     white "/" strips ]
// The flats are wider than the text, so while a flat slides under the block the
// whole title is uniformly one state (a hold); the visible sweep happens only
// while a strip group crosses. The keyframe slides the pattern left→right at
// constant velocity by exactly one full period per loop (seamless).

import {
  SWEEP_ANGLE,
  SWEEP_GAP_PX,
  SWEEP_HOLD_S,
  SWEEP_STRIP_COUNT,
  SWEEP_STRIP_PX,
  SWEEP_TEXT_EXTENT_PX,
  SWEEP_WIPE_S,
} from './constants'

// Width of one travelling slash group, along the axis.
const GROUP_PX = SWEEP_STRIP_COUNT * (SWEEP_STRIP_PX + SWEEP_GAP_PX)

// Constant-velocity timing model. A sweep moves the group across the text, which
// is (text extent + group) of axis travel, and must take SWEEP_WIPE_S. A hold is
// the EXTRA flat travel beyond the text extent and must take SWEEP_HOLD_S. Solve
// for the axis velocity and the flat width so both timings come out exactly (at
// the reference text extent); the loop then closes with cycle = 2·(hold + wipe).
const AXIS_VELOCITY = (SWEEP_TEXT_EXTENT_PX + GROUP_PX) / SWEEP_WIPE_S // px/s along axis
const FLAT_PX = SWEEP_TEXT_EXTENT_PX + AXIS_VELOCITY * SWEEP_HOLD_S
const PERIOD_PX = 2 * FLAT_PX + 2 * GROUP_PX

// The keyframe slides HORIZONTALLY, so the horizontal period (one seamless loop's
// translate) is the axis period / sin(angle). Exposed to the keyframe as
// `--sweep-tile`.
export const SWEEP_TRANSLATE_PX = Math.round(PERIOD_PX / Math.sin((SWEEP_ANGLE * Math.PI) / 180))

// Full loop time = 2 holds + 2 sweeps (equivalently PERIOD_PX / velocity).
export const SWEEP_CYCLE = `${(2 * (SWEEP_HOLD_S + SWEEP_WIPE_S)).toFixed(2)}s`

// Build the symmetric 4-segment repeating gradient with HARD stops (no feather)
// so the slashes and letter edges stay sharp/graphic. `repeating-linear-gradient`
// tiles seamlessly along the diagonal on its own.
function buildSweepGradient(): string {
  const stops: string[] = []
  let x = 0
  // Hard-edge helper: emit `color` from the current x for `len` px (double stops
  // at the boundaries keep transitions crisp), leaving x at the segment end.
  const seg = (color: string, len: number) => {
    stops.push(`${color} ${x.toFixed(1)}px`, `${color} ${(x + len).toFixed(1)}px`)
    x += len
  }
  // A strip group wiping from one flat colour to the next: it leads with a gap of
  // the `from` colour then a strip of the `to` colour, reading as a cluster of
  // `to`-coloured slashes heralding the `to` flat.
  const group = (from: string, to: string) => {
    for (let i = 0; i < SWEEP_STRIP_COUNT; i++) {
      seg(from, SWEEP_GAP_PX)
      seg(to, SWEEP_STRIP_PX)
    }
  }
  seg('#fff', FLAT_PX) // hold: solid white
  group('#fff', 'transparent') // wipe → transparent
  seg('transparent', FLAT_PX) // hold: transparent (outline only)
  group('transparent', '#fff') // wipe → white (mirror of group A)
  return `repeating-linear-gradient(${SWEEP_ANGLE}deg, ${stops.join(', ')})`
}

export const PROMPT_SWEEP_GRADIENT = buildSweepGradient()
