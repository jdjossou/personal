'use client'

// Main menu — Task 02: selection system + selector cursor.
// A single `selectedIndex` drives everything. Each item is tilted at its own
// angle, the items overlap vertically, and their blue brightens toward the
// front of the stack (see ITEM_STYLES). The selected item is rendered as a
// stack: two angular triangles BEHIND the text (white over an offset red
// "shadow"), then the text itself in two tones — black where it sits over the
// blue background, red where it crosses the white triangle (a clip-path matching
// the triangle drives the recolour). Input wiring (keyboard/mouse/touch) is
// Task 06; a temporary auto-cycle advances the selection so the motion is
// testable. The component stays a transparent full-screen overlay so the global
// P3R water background (mounted in layout.tsx) keeps showing through.

import { useEffect, useState } from 'react'
import { Selector } from './Selector'
import {
  AUTOCYCLE_MS,
  ITEM_STYLES,
  ITEM_TRANSITION_MS,
  MENU_ITEMS,
  SELECTED_BLACK,
  SELECTED_RED,
  SELECTED_Z,
  shapeClipPath,
} from './constants'

const SELECTED_SIZE = 'text-5xl sm:text-6xl lg:text-7xl'
const INACTIVE_SIZE = 'text-4xl sm:text-5xl lg:text-6xl'

export function MainMenu() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // TEMP — remove in Task 06 (input wiring).
  // Auto-advances the selection on a loop so the selector's entrance twitch,
  // idle wobble, and the two-tone text can be observed without input handlers.
  useEffect(() => {
    const id = window.setInterval(() => {
      setSelectedIndex((i) => (i + 1) % MENU_ITEMS.length)
    }, AUTOCYCLE_MS)
    return () => window.clearInterval(id)
  }, [])
  // END TEMP

  return (
    <main className="fixed inset-0 z-0 overflow-hidden bg-transparent select-none">
      {/* Zone A — left ~42%: reserved for the laptop illustration (task 04). */}
      <div
        className="absolute inset-y-0 left-0 z-0 w-[42%]"
        aria-hidden
        // Placeholder bounds for the floating laptop / developer machine.
      />

      {/* Zone B — right side: the vertical menu list, left-aligned so every
          item shares a common left edge, set in from the zone's left margin. */}
      <nav className="absolute inset-y-0 right-0 z-10 flex w-[58%] flex-col justify-center pl-[4vw]">
        <ul className="flex flex-col items-start text-left">
          {MENU_ITEMS.map((item, i) => {
            const isSelected = i === selectedIndex
            const s = ITEM_STYLES[i]
            return (
              <li
                key={item}
                data-menu-item={item}
                data-selected={isSelected}
                className={`font-display leading-none tracking-wide uppercase ${
                  isSelected ? SELECTED_SIZE : INACTIVE_SIZE
                } ${isSelected ? 'relative' : ''}`}
                style={{
                  marginTop: i === 0 ? 0 : s.overlapY,
                  transform: `translateX(${s.nudgeX}px) rotate(${s.angleDeg}deg)`,
                  transformOrigin: 'left center',
                  zIndex: isSelected ? SELECTED_Z : s.z,
                  transition: `font-size ${ITEM_TRANSITION_MS}ms ease-out`,
                }}
              >
                {isSelected ? (
                  <>
                    {/* Two angular shapes behind the text (white over red). */}
                    <Selector />
                    {/* Black base — defines the box; visible outside the triangle. */}
                    <span
                      className="relative block"
                      style={{
                        color: SELECTED_BLACK,
                        WebkitTextStroke: `1px ${SELECTED_BLACK}`,
                      }}
                    >
                      {item}
                    </span>
                    {/* Red copy, clipped to the white shape — visible only
                        where the letters cross it (i.e. everywhere except the
                        bottom-left wedge, which stays black). */}
                    <span
                      aria-hidden
                      className="absolute inset-0 block"
                      style={{
                        color: SELECTED_RED,
                        WebkitTextStroke: `1px ${SELECTED_RED}`,
                        clipPath: shapeClipPath(),
                      }}
                    >
                      {item}
                    </span>
                  </>
                ) : (
                  <span
                    className="block"
                    style={{
                      color: s.blue,
                      WebkitTextStroke: `0.75px ${s.blue}`,
                    }}
                  >
                    {item}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Zone C — bottom bar: index panel (lower-left) + selected-section info
          with the nav prompts stacked beneath it (lower-right). */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-[4vw] pb-6">
        {/* Lower-left: main index panel placeholder (built in task 05). */}
        <div
          className="w-fit border border-dashed border-white/30 px-3 py-2 font-display text-sm leading-tight tracking-widest text-white/60"
          data-placeholder="main-index"
        >
          MAIN
          <br />
          01
        </div>

        {/* Lower-right: selected-section tooltip placeholder (wired in task 05),
            with the navigation prompts directly below it. */}
        <div className="flex flex-col items-end gap-2 text-right">
          <div
            className="border border-dashed border-white/30 px-3 py-2 font-mono text-xs tracking-wide text-white/40"
            data-placeholder="section-tooltip"
          >
            selected-section info
          </div>

          {/* Navigation prompts (desktop). */}
          <div
            className="hidden gap-6 font-mono text-xs tracking-wide text-white/50 sm:flex"
            data-nav-prompts
          >
            <span>↑ ↓ / Move</span>
            <span>Enter / Select</span>
            <span>Esc / Back</span>
          </div>

          {/* Touch hint (mobile). */}
          <div className="font-mono text-xs tracking-wide text-white/50 sm:hidden">
            Tap a command to open it
          </div>
        </div>
      </div>
    </main>
  )
}
