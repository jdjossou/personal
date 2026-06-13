// Previous / Next navigation controls — the reference's LB / RB shoulder prompts,
// restyled (§3): a bold red arrow head with a skewed uppercase label. The screen
// positions a pair of these so they straddle the seam between the big EXPERIENCE
// title and the detail card — Previous toward the left, Next toward the right.
// Slightly oversized, stylized game-menu prompts, not plain buttons. Hovering a
// control highlights its arrow orange.
//
// Visual-only for now: onClick is wired but inert (the screen hands down no-ops).

'use client'

import { useState } from 'react'

import {
  ACCENT_RED,
  NAV_ARROW_HOVER,
  NAV_ARROW_OUTLINE_COLOR,
  NAV_ARROW_OUTLINE_WIDTH,
  NAV_ARROW_SIZE,
  NAV_GAP,
  NAV_LABEL_OUTLINE,
  NAV_LABEL_SIZE,
  NAV_LABEL_SKEW,
  NAV_NEXT,
  NAV_PREV,
} from './constants'

// A solid red arrow head (clipped triangle). `hovered` swaps the fill to the
// orange highlight. The black outline is a second, slightly larger triangle of
// the same shape sitting behind the colored one (a plain `border` can't follow a
// clip-path, and chained drop-shadows don't trace it reliably): the back layer is
// inflated by the outline width on every side via a negative `inset`, so a black
// rim peeks out around the fill. A soft glow in the arrow's current color sits on top.
function Arrow({ dir, hovered }: { dir: 'prev' | 'next'; hovered: boolean }) {
  const clip =
    dir === 'prev'
      ? 'polygon(100% 0, 100% 100%, 0 50%)'
      : 'polygon(0 0, 0 100%, 100% 50%)'
  const color = hovered ? NAV_ARROW_HOVER : ACCENT_RED
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{
        width: NAV_ARROW_SIZE,
        height: NAV_ARROW_SIZE,
        filter: `drop-shadow(0 0 8px ${color}99)`,
      }}
    >
      {/* black outline layer — same triangle, inflated by the outline width */}
      <span
        className="absolute"
        style={{
          inset: `-${NAV_ARROW_OUTLINE_WIDTH}`,
          backgroundColor: NAV_ARROW_OUTLINE_COLOR,
          clipPath: clip,
        }}
      />
      {/* colored fill on top */}
      <span
        className="absolute inset-0 transition-colors duration-150"
        style={{ backgroundColor: color, clipPath: clip }}
      />
    </span>
  )
}

// One Prev / Next control — red/orange arrow head + skewed label. Inert for now.
export function NavButton({
  dir,
  onClick,
}: {
  dir: 'prev' | 'next'
  onClick: () => void
}) {
  const label = dir === 'prev' ? NAV_PREV : NAV_NEXT
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={dir === 'prev' ? 'Previous experience' : 'Next experience'}
      className="inline-flex items-center transition-transform hover:scale-[1.05] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
      style={{ gap: NAV_GAP }}
    >
      {dir === 'prev' && <Arrow dir="prev" hovered={hovered} />}
      <span
        className="font-display leading-none tracking-[-0.05em] text-white uppercase font-black"
        style={{
          fontSize: NAV_LABEL_SIZE,
          transform: `skewX(${NAV_LABEL_SKEW})`,
          WebkitTextStroke: `${NAV_LABEL_OUTLINE} black`,
        }}
      >
        {label}
      </span>
      {dir === 'next' && <Arrow dir="next" hovered={hovered} />}
    </button>
  )
}
