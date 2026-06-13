// Job highlights — the right-side job description re-imagined as a SCATTERED comic
// collage (replaces the old star-bullet list). The points are deliberately NOT
// left-aligned: each highlight is its own ink-outlined comic frame whose left
// offset, width, tilt, and text size vary per index (driven by the COMIC_* arrays
// in constants.ts), so the set reads like a hand-placed Persona splash instead of a
// tidy list. Every frame now shares ONE unified scheme — white paper, a thick black
// comic rim, halftone dots, and a bold red corner star — so the column reads as a
// single comic surface rather than alternating colours. The paper is slightly
// translucent so the animated water glints through, while the (opaque) black text
// stays crisp. Frames are plain RECTANGLES with a real border. Presentational;
// desktop + mobile share it, with `mobile` collapsing the offsets/tilt/overlap into
// a clean readable stack.

import { CSSProperties } from 'react'

import {
  ACCENT_RED,
  COMIC_BORDER_COLOR,
  COMIC_BORDER_WIDTH,
  COMIC_FRAME_OVERLAP,
  COMIC_FRAME_PAD,
  COMIC_HALFTONE_COLOR,
  COMIC_OFFSETS,
  COMIC_PANEL_FILL,
  COMIC_SIZES,
  COMIC_TEXT_COLOR,
  COMIC_TILTS,
  COMIC_WIDTHS,
} from './constants'

// A bold 4-point sparkle for the red "flash" tucked at every frame's corner.
const BURST_CLIP =
  'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)'

const at = <T,>(arr: readonly T[], i: number): T => arr[i % arr.length]

export function JobPanels({
  bullets,
  mobile = false,
}: {
  bullets: readonly string[]
  mobile?: boolean
}) {
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col items-start">
        {bullets.map((bullet, i) => {
          // Per-frame placement. Mobile collapses the collage into a clean stack:
          // full width, no offset, no tilt, an even gap instead of the overlap tuck.
          const frameStyle: CSSProperties = mobile
            ? { width: '100%', marginTop: i === 0 ? 0 : '0.7rem', zIndex: i }
            : {
                width: at(COMIC_WIDTHS, i),
                marginLeft: at(COMIC_OFFSETS, i),
                marginTop: i === 0 ? 0 : COMIC_FRAME_OVERLAP,
                transform: `rotate(${at(COMIC_TILTS, i)})`,
                transformOrigin: 'center',
                zIndex: i,
              }

          return (
            <li key={i} className="relative" style={frameStyle}>
              {/* Frame face — translucent paper rectangle with a thick black ink
                  border (a real border, since the shape is now rectangular). */}
              <div
                className="relative overflow-hidden"
                style={{
                  backgroundColor: COMIC_PANEL_FILL,
                  border: `${COMIC_BORDER_WIDTH} solid ${COMIC_BORDER_COLOR}`,
                  padding: COMIC_FRAME_PAD,
                }}
              >
                {/* Halftone corner wedge — dot texture clipped to the top-right
                    triangle, away from the text (every frame). */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(${COMIC_HALFTONE_COLOR} 22%, transparent 24%)`,
                    backgroundSize: '7px 7px',
                    clipPath: 'polygon(100% 0, 100% 55%, 45% 0)',
                  }}
                />

                <p
                  className="relative font-medium leading-snug"
                  style={{ color: COMIC_TEXT_COLOR, fontSize: at(COMIC_SIZES, i) }}
                >
                  {bullet}
                </p>
              </div>

              {/* Red corner star — a bold sparkle flash at the top-right of every
                  frame, the single warm pop that ties the collage together. */}
              <span
                aria-hidden
                className="absolute"
                style={{
                  top: '-0.9rem',
                  right: '-0.7rem',
                  width: '2.2rem',
                  height: '2.2rem',
                  backgroundColor: ACCENT_RED,
                  clipPath: BURST_CLIP,
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
                  zIndex: 2,
                }}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
