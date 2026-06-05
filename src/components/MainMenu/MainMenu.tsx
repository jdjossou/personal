'use client'

// Main menu — Task 02: selection system + selector cursor; Task 06: input wiring.
// A single `selectedIndex` drives everything. Each item is tilted at its own
// angle, the items overlap vertically, and their blue brightens toward the
// front of the stack (see ITEM_STYLES). The selected item is rendered as a
// stack: two angular triangles BEHIND the text (white over an offset red
// "shadow"), then the text itself in two tones — black where it sits over the
// blue background, red where it crosses the white triangle (a clip-path matching
// the triangle drives the recolour). Input (Task 06): arrow keys move the
// selection (wrapping), Enter / click / tap open a section (router.push to its
// route), Escape calls onBack to return to the landing screen, and mouse hover
// selects an item instantly. The component stays a transparent full-screen
// overlay so the global P3R water background (mounted in layout.tsx) shows through.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { InfoBlock } from './InfoBlock'
import { LeftPanel } from './LeftPanel'
import { Selector } from './Selector'
import {
  ITEM_STYLES,
  ITEM_TRANSITION_MS,
  MENU_ITEMS,
  MENU_ROUTES,
  MENU_INACTIVE_FONT,
  MENU_LIST_PAD_LEFT_VW,
  MENU_SELECTED_FONT,
  MENU_ZONE_WIDTH,
  SELECTED_BLACK,
  SELECTED_RED,
  SELECTED_Z,
  SHOW_LEFT_PANEL,
  SHOW_SYSTEM_PANELS,
  LABEL_FONT,
  LABEL_LEFT_VW,
  LABEL_OFFSET_VH,
  LABEL_OPACITY,
  VERTICAL_LABEL,
  shapeClipPath,
  MENU_ENTER_MS,
  MENU_ENTER_STAGGER_MS,
  MENU_ENTER_OFFSET_PX,
  SELECTOR_SPAWN_DELAY_MS,
  PANELS_ENTER_MS,
  PANELS_ENTER_DELAY_MS,
  PANELS_ENTER_OFFSET_PX,
  SEQUENCE_TOTAL_MS,
} from './constants'

type MainMenuProps = {
  // Called on Escape (or a touch back gesture) — returns to the landing screen.
  onBack: () => void
}

// Stable no-op subscriber for useSyncExternalStore: the pointer type is read
// once and never updated (we deliberately don't react to device changes).
const NO_SUBSCRIBE = () => () => {}

export function MainMenu({ onBack }: MainMenuProps) {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Pointer type, committed once at load (Task 06): coarse pointers get the
  // "tap to open" hint, everything else the keyboard prompt row. Read via
  // useSyncExternalStore (no-op subscribe) so the value is consistent across
  // SSR/hydration without a setState-in-effect; we never re-subscribe, matching
  // the "pick one at load time" rule.
  const isTouch = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => window.matchMedia('(pointer: coarse)').matches,
    () => false,
  )
  // Reduced-motion preference, committed once at load (same useSyncExternalStore
  // pattern as isTouch). When set, the opening sequence (Task 07) is skipped and
  // every element renders in its final state with no entrance transition.
  const reducedMotion = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
  // Opening sequence (Task 07). `entered` drives every element's entrance: it
  // starts false (items hidden + offset below) and flips true one frame after
  // mount, so the CSS transitions play. `opening` is a one-time window used only
  // to give the selector its spawn delay; it clears once the run has finished.
  const [entered, setEntered] = useState(false)
  const [opening, setOpening] = useState(true)
  useEffect(() => {
    // Double rAF so the initial opacity:0 / offset frame paints before we flip.
    // Under reduced motion the entrance transitions are disabled at render time,
    // so this same flip just snaps to the final state with no visible motion.
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true))
    })
    const done = window.setTimeout(() => setOpening(false), SEQUENCE_TOTAL_MS)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(done)
    }
  }, [])

  const rootRef = useRef<HTMLElement>(null)
  // Mirror the latest selectedIndex / onBack so the keydown listener can read
  // them without re-subscribing on every change. Synced in effects (not during
  // render) to keep refs render-pure.
  const selectedRef = useRef(selectedIndex)
  const onBackRef = useRef(onBack)
  useEffect(() => {
    selectedRef.current = selectedIndex
  }, [selectedIndex])
  useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  // Open a section: confirm sound (Task 09) and exit transition (Task 08) hook
  // in here later; for now navigate straight to the section's route.
  function openSection(index: number) {
    // TODO Task 09: play confirm sound.
    // TODO Task 08: run the exit transition, then navigate.
    router.push(MENU_ROUTES[index])
  }

  // Focus the menu on open so keystrokes are captured immediately (Task 06).
  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  // Global keyboard navigation (Task 06). Attached to window so it works
  // regardless of focus; removed on unmount to avoid ghost inputs.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const len = MENU_ITEMS.length
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => (i - 1 + len) % len)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => (i + 1) % len)
          break
        case 'Enter':
          e.preventDefault()
          openSection(selectedRef.current)
          break
        case 'Escape':
          e.preventDefault()
          onBackRef.current()
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main
      ref={rootRef}
      tabIndex={-1}
      className="fixed inset-0 z-0 overflow-hidden bg-transparent outline-none select-none"
    >
      {/* Left visual — the flat white region with its organic, flowing water edge
          (z-0, in front of the z:-1 water canvas, behind the z-10 menu text),
          taking the role P3R gives its character art, plus the giant black
          vertical name on it. SHOW_LEFT_PANEL toggles the whole thing off. */}
      {SHOW_LEFT_PANEL && (
        // The left visual has no entrance — it's present from the start (Task 07
        // animates only the menu text, selector, and system panels).
        <>
          <LeftPanel />

          {/* Giant black vertical name, sitting on the white region. It runs
              vertical and is sized so its bottom tail spills past the viewport
              (clipped by main's overflow-hidden). */}
          <div
            aria-hidden
            className="absolute z-[1] font-display leading-none text-black uppercase"
            style={{
              left: `${LABEL_LEFT_VW}vw`,
              top: `calc(50% + ${LABEL_OFFSET_VH}vh)`,
              transform: 'translateY(-50%)',
              opacity: LABEL_OPACITY,
              writingMode: 'vertical-rl',
              fontSize: LABEL_FONT,
              letterSpacing: '0.01em',
            }}
          >
            {VERTICAL_LABEL}
          </div>
        </>
      )}

      {/* Zone B — right side: the vertical menu list, left-aligned so every
          item shares a common left edge, set in from the zone's left margin. */}
      <nav
        className="absolute inset-y-0 right-0 z-10 flex flex-col justify-center"
        style={{ width: MENU_ZONE_WIDTH, paddingLeft: `${MENU_LIST_PAD_LEFT_VW}vw` }}
      >
        <ul className="flex flex-col items-start text-left">
          {MENU_ITEMS.map((item, i) => {
            const isSelected = i === selectedIndex
            const s = ITEM_STYLES[i]
            return (
              <li
                key={item}
                data-menu-item={item}
                data-selected={isSelected}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => openSection(i)}
                className={`cursor-pointer font-display leading-none tracking-wide uppercase ${
                  isSelected ? 'relative' : ''
                }`}
                style={{
                  fontSize: isSelected ? MENU_SELECTED_FONT : MENU_INACTIVE_FONT,
                  marginTop: i === 0 ? 0 : s.overlapY,
                  // Entrance (Task 07, Step 2): rise from MENU_ENTER_OFFSET_PX
                  // below + fade in, staggered top→bottom. The per-item transform
                  // is constant (depends on i, not selection), so folding the
                  // entrance translateY in here never fights selection swaps.
                  opacity: entered ? 1 : 0,
                  transform: `translateX(${s.nudgeX}px) translateY(${
                    entered ? 0 : MENU_ENTER_OFFSET_PX
                  }px) rotate(${s.angleDeg}deg)`,
                  transformOrigin: 'left center',
                  zIndex: isSelected ? SELECTED_Z : s.z,
                  transition: reducedMotion
                    ? `font-size ${ITEM_TRANSITION_MS}ms ease-out`
                    : `font-size ${ITEM_TRANSITION_MS}ms ease-out, opacity ${MENU_ENTER_MS}ms ease-out ${
                        i * MENU_ENTER_STAGGER_MS
                      }ms, transform ${MENU_ENTER_MS}ms ease-out ${i * MENU_ENTER_STAGGER_MS}ms`,
                }}
              >
                {isSelected ? (
                  <>
                    {/* Two angular shapes behind the text (white over red). On
                        the opening the selector is held back until PROJECTS'
                        text settles (Task 07, Step 3); afterwards it snaps in
                        instantly on each selection change. */}
                    <Selector
                      spawnDelay={opening && !reducedMotion ? SELECTOR_SPAWN_DELAY_MS : 0}
                    />
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

      {/* Zone C — bottom bar: the selected-section info block with the nav
          prompts stacked beneath it (lower-right), driven by `selectedIndex`. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-end gap-4 px-[4vw] pb-6">
        {/* Lower-right: selected-section info block with the navigation prompts
            directly below it. Entrance (Task 07, Step 4): the whole column fades
            and slides up shortly after the run begins — the wrapper handles the
            entrance so InfoBlock's own selection-change fade stays untouched. */}
        <div
          className="flex flex-col items-end gap-2 text-right"
          style={{
            opacity: entered ? 1 : 0,
            transform: `translateY(${entered ? 0 : PANELS_ENTER_OFFSET_PX}px)`,
            transition: reducedMotion
              ? undefined
              : `opacity ${PANELS_ENTER_MS}ms ease-out ${PANELS_ENTER_DELAY_MS}ms, transform ${PANELS_ENTER_MS}ms ease-out ${PANELS_ENTER_DELAY_MS}ms`,
          }}
        >
          {SHOW_SYSTEM_PANELS && <InfoBlock selectedIndex={selectedIndex} />}

          {/* Navigation prompts — pointer-based: coarse pointers get the tap
              hint, everything else the keyboard prompt row (Task 06). */}
          {isTouch ? (
            <div className="font-mono text-xs tracking-wide text-white/50">
              Tap a command to open it
            </div>
          ) : (
            <div
              className="flex gap-6 font-mono text-xs tracking-wide text-white/50"
              data-nav-prompts
            >
              <span>↑ ↓ / Move</span>
              <span>Enter / Select</span>
              <span>Esc / Back</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
