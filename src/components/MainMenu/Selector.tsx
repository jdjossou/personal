'use client'

// The two-shape selector, rendered BEHIND the selected item's text (Task 02).
// It absolutely fills the selected item's box, so it inherits the item's tilt
// for free and needs no external measurement. Two stacked SVGs draw a white
// triangle over an offset red one that reads as its shadow; the same triangle
// geometry is reused by MainMenu as a clip-path so the text recolours where it
// crosses the white shape. Because the component only mounts while its item is
// selected, the entrance twitch replays naturally on every selection change.

import {
  IDLE_PERIOD_MS,
  SELECTOR_RED_SHADOW,
  SELECTOR_SHADOW_OFFSET,
  SELECTOR_WHITE,
  TWITCH_MS,
  shapeSvgPoints,
} from './constants'

function Shape({ fill }: { fill: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 overflow-visible"
    >
      <polygon points={shapeSvgPoints()} fill={fill} />
    </svg>
  )
}

export function Selector() {
  return (
    <div
      aria-hidden
      data-menu-selector
      className="pointer-events-none absolute inset-0 -z-10"
      // Entrance jolt — replays on mount (i.e. on each selection change).
      style={{ animation: `selector-twitch ${TWITCH_MS}ms ease-out` }}
    >
      {/* Idle wobble — perpetual, subtle. */}
      <div
        className="absolute inset-0"
        style={{
          animation: `selector-idle ${IDLE_PERIOD_MS}ms ease-in-out infinite`,
          transformOrigin: 'center',
        }}
      >
        {/* Red shadow, offset down-right. */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${SELECTOR_SHADOW_OFFSET.x}px, ${SELECTOR_SHADOW_OFFSET.y}px)`,
          }}
        >
          <Shape fill={SELECTOR_RED_SHADOW} />
        </div>
        {/* White shape on top. */}
        <Shape fill={SELECTOR_WHITE} />
      </div>
    </div>
  )
}
