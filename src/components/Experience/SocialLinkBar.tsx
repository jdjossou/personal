// Previous / Next navigation controls — the reference's LB / RB shoulder prompts,
// restyled (§3): a bold red arrow head with a skewed uppercase label. The screen
// positions a pair of these so they straddle the seam between the big EXPERIENCE
// title and the detail card — Previous toward the left, Next toward the right.
// Slightly oversized, stylized game-menu prompts, not plain buttons. Hovering a
// control highlights its arrow orange; navigating (by click OR keyboard) flashes
// that same orange highlight for ~NAV_PULSE_MS plus a brief scale bump, driven by
// a `pulse` nonce the screen bumps on every page in this button's direction.

'use client'

import { useEffect, useState } from 'react'

import {
  ACCENT_RED,
  NAV_ARROW_HOVER,
  NAV_ARROW_OUTLINE_COLOR,
  NAV_ARROW_OUTLINE_WIDTH,
  NAV_ARROW_SIZE,
  NAV_BUMP_MS,
  NAV_GAP,
  NAV_LABEL_OUTLINE,
  NAV_LABEL_SIZE,
  NAV_LABEL_SKEW,
  NAV_NEXT,
  NAV_PREV,
  NAV_PULSE_MS,
} from './constants'
import { useReducedMotion } from './useReducedMotion'

// A solid red arrow head (clipped triangle). `highlighted` swaps the fill to the
// orange highlight (on hover OR a navigate flash). The black outline is a second,
// slightly larger triangle of the same shape sitting behind the colored one (a
// plain `border` can't follow a clip-path, and chained drop-shadows don't trace it
// reliably): the back layer is inflated by the outline width on every side via a
// negative `inset`, so a black rim peeks out around the fill. A soft glow in the
// arrow's current color sits on top.
function Arrow({ dir, highlighted }: { dir: 'prev' | 'next'; highlighted: boolean }) {
  const clip =
    dir === 'prev'
      ? 'polygon(100% 0, 100% 100%, 0 50%)'
      : 'polygon(0 0, 0 100%, 100% 50%)'
  const color = highlighted ? NAV_ARROW_HOVER : ACCENT_RED
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

// The flashable arrow+label group. Remounted (keyed by the pulse nonce in the
// parent) on every navigate, so the highlight hold + scale bump restart cleanly —
// `active` seeds from `flashing` via a useState INITIALIZER (not a setState in an
// effect), and the effect only schedules the clear. `hovered` comes down as a prop
// so hovering doesn't reset the flash and the flash doesn't drop a live hover.
function NavContent({
  dir,
  label,
  hovered,
  flashing,
  reduced,
}: {
  dir: 'prev' | 'next'
  label: string
  hovered: boolean
  flashing: boolean
  reduced: boolean
}) {
  const [active, setActive] = useState(flashing)
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setActive(false), NAV_PULSE_MS)
    return () => clearTimeout(t)
    // Mount-only: this group is remounted per navigate, so one timer per flash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const highlighted = hovered || active

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: NAV_GAP,
        // Bump is motion-only; under reduced motion only the colour flash fires.
        animation: !reduced && flashing ? `nav-bump ${NAV_BUMP_MS}ms ease-out` : undefined,
      }}
    >
      {dir === 'prev' && <Arrow dir="prev" highlighted={highlighted} />}
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
      {dir === 'next' && <Arrow dir="next" highlighted={highlighted} />}
    </span>
  )
}

// One Prev / Next control — red/orange arrow head + skewed label. `pulse` is a
// nonce the screen bumps whenever it pages in THIS button's direction (from a
// click or the keyboard); each change remounts NavContent (keyed by `pulse`) to
// flash the orange highlight for NAV_PULSE_MS and replay the scale bump, even on a
// repeat in the same direction. The button itself keeps hover/focus state so a
// remount never drops keyboard focus.
export function NavButton({
  dir,
  onClick,
  pulse,
}: {
  dir: 'prev' | 'next'
  onClick: () => void
  pulse?: number
}) {
  const label = dir === 'prev' ? NAV_PREV : NAV_NEXT
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={dir === 'prev' ? 'Previous experience' : 'Next experience'}
      className={`inline-flex items-center transition-transform focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none${
        reduced ? '' : ' hover:scale-[1.05]'
      }`}
    >
      <NavContent
        key={pulse}
        dir={dir}
        label={label}
        hovered={hovered}
        flashing={pulse !== undefined}
        reduced={reduced}
      />
    </button>
  )
}
