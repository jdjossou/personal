// STACK title — the reference's giant rotated, cropped SKILL title (left edge).
// It reads TOP→BOTTOM up the left edge, oversized and clipped by the viewport so
// part of it runs off the top/left. Background branding, not a heading: aria-hidden,
// non-interactive, semi-transparent white, behind the panels. Size/colour in
// constants.ts.

import {
  WORDMARK,
  WORDMARK_COLOR,
  WORDMARK_LEFT,
  WORDMARK_ROTATE,
  WORDMARK_SIZE,
  WORDMARK_TOP,
} from './constants'

export function StackTitle() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] hidden select-none overflow-hidden md:block"
    >
      <span
        className="absolute font-display uppercase"
        style={{
          // vertical-rl + default (mixed) orientation: latin letters rotate 90° and
          // stack reading TOP→BOTTOM as one connected word in a narrow left column.
          // Position (TOP/LEFT) + extra tilt (ROTATE) are tunable in constants.ts;
          // negative offsets crop it off the top-left like the reference's SKILL.
          top: WORDMARK_TOP,
          left: WORDMARK_LEFT,
          writingMode: 'vertical-rl',
          transform: `rotate(${WORDMARK_ROTATE})`,
          transformOrigin: 'top left',
          fontSize: WORDMARK_SIZE,
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: WORDMARK_COLOR,
        }}
      >
        {WORDMARK}
      </span>
    </div>
  )
}
