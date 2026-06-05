'use client'

// ScreenReveal (Task 08) — wraps an incoming screen and, on mount, plays the
// transition mask that was ARMED by whatever triggered the screen change (see
// handoff.ts). The mask is an SVG clip-path on a full-screen wrapper: it grows
// from the trigger's origin to cover the viewport, revealing the screen as it
// goes. The global water background is a sibling BEHIND this wrapper, so wherever
// the clip hasn't reached the water simply shows through — the screen is masked,
// the background never is.
//
// Two effects, chosen by the hand-off:
//   - wavyBlot:     two layered ink blots with a rippling sine edge (entering)
//   - doubleCircle: two clean circles expanding from two foci (going back)
//
// A reveal only plays if a hand-off targeting THIS screen is present; a plain
// load (no hand-off) just shows the screen. Reduced motion skips the mask.

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import {
  BLOT_AMPLITUDE_PX,
  BLOT_FREQUENCY,
  BLOT_PHASE_SPEED,
  BLOT_POINTS,
  BLOT_RADIUS_PAD_PX,
  BLOT_SECOND_AMP_SCALE,
  BLOT_SECOND_DELAY_MS,
  BLOT_SECOND_PHASE_OFFSET,
  BLOT_SECOND_SCALE,
  CIRCLE_FOCI,
  CIRCLE_LEAD_LAG_MS,
  CIRCLE_RADIUS_PAD_PX,
  TRANSITION_MS,
  type RevealTarget,
} from './constants'
import { coverRadius, easeOutCubic, wavyBlotPolygon } from './clipGeometry'
import { consumeTransition, peekTransition } from './handoff'

// Stable no-op subscriber: the reduced-motion preference is read once at mount
// (same pattern as MainMenu) — we don't react to changes mid-transition.
const NO_SUBSCRIBE = () => () => {}
const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n)

export function ScreenReveal({
  reveals,
  children,
}: {
  reveals: RevealTarget
  children: ReactNode
}) {
  const reducedMotion = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )

  // Peek (without clearing) the armed reveal for this screen at first render, so
  // the very first paint is already clipped CLOSED (screen hidden, only water
  // showing) — no flash of full content before the rAF loop opens the mask. The
  // effect below consumes + animates it. On the server / a plain load there's no
  // hand-off, so this is null and the screen renders normally.
  const [pending] = useState(() =>
    reducedMotion ? null : peekTransition(reveals),
  )
  const [clipActive, setClipActive] = useState(() => pending != null)

  // clip-path ids can't carry the ':' useId emits.
  const clipId = `screen-reveal-${useId().replace(/:/g, '')}`

  // Shape nodes are updated imperatively each frame — no React re-render per tick.
  const leadRef = useRef<SVGPolygonElement>(null)
  const trailRef = useRef<SVGPolygonElement>(null)
  const circleRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    // Animate from the value peeked at render (`pending`) rather than consuming
    // here: under StrictMode the effect runs setup→cleanup→setup, so consuming
    // inside would clear the hand-off on the first setup and find nothing on the
    // second. `pending` persists across that, so the reveal still plays. We only
    // clear the stored hand-off (so it can't replay on a later back/forward).
    if (!pending || reducedMotion) return
    consumeTransition(reveals)
    const { effect, origin } = pending
    const w = window.innerWidth
    const h = window.innerHeight
    const cx = origin.x
    const cy = origin.y
    // wavyBlot's lead finishes at TRANSITION_MS; the trailing blot / lagging
    // circle finish a touch later. Run until the last one is done, then drop the
    // mask (by then it fully covers, so removing it is seamless).
    const endMs =
      TRANSITION_MS +
      (effect === 'doubleCircle' ? CIRCLE_LEAD_LAG_MS : BLOT_SECOND_DELAY_MS)
    const start = performance.now()
    let raf = 0

    const frame = (now: number) => {
      const elapsed = now - start
      if (effect === 'wavyBlot') {
        const targetR = coverRadius(cx, cy, w, h) + BLOT_RADIUS_PAD_PX
        const phase = (elapsed / 1000) * BLOT_PHASE_SPEED
        const leadR = easeOutCubic(clamp01(elapsed / TRANSITION_MS)) * targetR
        leadRef.current?.setAttribute(
          'points',
          wavyBlotPolygon(cx, cy, leadR, BLOT_AMPLITUDE_PX, BLOT_FREQUENCY, phase, BLOT_POINTS),
        )
        const trailR =
          easeOutCubic(clamp01((elapsed - BLOT_SECOND_DELAY_MS) / TRANSITION_MS)) *
          targetR *
          BLOT_SECOND_SCALE
        trailRef.current?.setAttribute(
          'points',
          wavyBlotPolygon(
            cx,
            cy,
            trailR,
            BLOT_AMPLITUDE_PX * BLOT_SECOND_AMP_SCALE,
            BLOT_FREQUENCY,
            phase + BLOT_SECOND_PHASE_OFFSET,
            BLOT_POINTS,
          ),
        )
      } else {
        for (let i = 0; i < CIRCLE_FOCI.length; i++) {
          const [fxF, fyF] = CIRCLE_FOCI[i]
          const fx = fxF * w
          const fy = fyF * h
          const cover = coverRadius(fx, fy, w, h) + CIRCLE_RADIUS_PAD_PX
          const r =
            easeOutCubic(clamp01((elapsed - i * CIRCLE_LEAD_LAG_MS) / TRANSITION_MS)) *
            cover
          const c = circleRefs.current[i]
          if (c) {
            c.setAttribute('cx', String(fx))
            c.setAttribute('cy', String(fy))
            c.setAttribute('r', String(r))
          }
        }
      }
      if (elapsed < endMs) {
        raf = requestAnimationFrame(frame)
      } else {
        setClipActive(false)
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // Runs once on mount; reveals/reducedMotion are fixed for this instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Closed geometry for the first paint (radius 0 at the origin → nothing shown).
  const ox = pending?.origin.x ?? 0
  const oy = pending?.origin.y ?? 0
  const closedPoly = wavyBlotPolygon(ox, oy, 0, BLOT_AMPLITUDE_PX, BLOT_FREQUENCY, 0, BLOT_POINTS)

  return (
    <div
      // Full-viewport box so the clip-path has something to clip; when no clip is
      // active this is an inert transparent layer and the screen behaves normally.
      className="fixed inset-0 z-0"
      style={
        clipActive
          ? { clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }
          : undefined
      }
    >
      {pending && (
        <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              {pending.effect === 'wavyBlot' ? (
                <>
                  <polygon ref={leadRef} points={closedPoly} />
                  <polygon ref={trailRef} points={closedPoly} />
                </>
              ) : (
                CIRCLE_FOCI.map((_, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      circleRefs.current[i] = el
                    }}
                    cx={ox}
                    cy={oy}
                    r={0}
                  />
                ))
              )}
            </clipPath>
          </defs>
        </svg>
      )}
      {children}
    </div>
  )
}
