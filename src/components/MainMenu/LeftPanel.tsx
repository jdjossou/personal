'use client'

// Left panel (Task 04) — the flat WHITE region that fills the left of the menu,
// replacing the old laptop. Its right edge is an organic, gently-flowing curve
// (not a straight line), taking the role the character's body outline plays in
// the P3R reference: the white hides the water on the left, the curve reveals it
// on the right. A few subtle abstract code lines sit on the white.
//
// The edge is animated imperatively with requestAnimationFrame — the d attribute
// of one <path> is rewritten each frame (no React state churn) — and it reuses
// the background's reduced-motion + tab-visibility handling
// (see P3RBackground/useP3RBackground.ts): under reduced motion the loop never
// starts and the edge rests at a single static shape.

import { useEffect, useRef } from 'react'
import {
  PANEL_BASE_X,
  PANEL_EDGE_SAMPLES,
  PANEL_OPACITY,
  PANEL_WAVES,
  PANEL_WHITE,
} from './constants'

const TAU = Math.PI * 2

// The boundary, as a closed white path in the 0–100 viewBox. The right edge is
// sampled top-to-bottom (x deformed by the layered sines), smoothed through a
// Catmull-Rom→cubic conversion, then closed down the left side. Corners overshoot
// the viewBox so no straight seam shows along the top/bottom/left.
function buildEdgePath(t: number): string {
  const n = PANEL_EDGE_SAMPLES
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const y = (i / (n - 1)) * 100
    let x = PANEL_BASE_X
    for (const w of PANEL_WAVES) {
      x += w.amp * Math.sin((y / 100) * w.k * TAU + t * w.speed + w.phase)
    }
    pts.push([x, y])
  }

  let d = `M -8 -8 L ${pts[0][0].toFixed(2)} 0`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? pts[i + 1]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  d += ' L -8 108 Z'
  return d
}

export function LeftPanel() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    let frameId = 0
    const start = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const draw = (t: number) => path.setAttribute('d', buildEdgePath(t))

    const tick = () => {
      frameId = requestAnimationFrame(tick)
      draw((performance.now() - start) / 1000)
    }
    const startLoop = () => {
      cancelAnimationFrame(frameId) // never stack two rAF chains
      frameId = requestAnimationFrame(tick)
    }
    const stopLoop = () => cancelAnimationFrame(frameId)

    // Reduced motion: render one frozen edge and never start the loop.
    const applyMotionPreference = () => {
      if (reduceMotion.matches) {
        stopLoop()
        draw(0)
      } else {
        startLoop()
      }
    }
    // Pause the loop while the tab is hidden.
    const onVisibilityChange = () => {
      if (document.hidden) stopLoop()
      else if (!reduceMotion.matches) startLoop()
    }

    reduceMotion.addEventListener('change', applyMotionPreference)
    document.addEventListener('visibilitychange', onVisibilityChange)
    applyMotionPreference()

    return () => {
      stopLoop()
      reduceMotion.removeEventListener('change', applyMotionPreference)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Slightly-transparent white region; the right edge is rewritten each
          frame so the boundary gently flows. */}
      <path ref={pathRef} d={buildEdgePath(0)} fill={PANEL_WHITE} opacity={PANEL_OPACITY} />
    </svg>
  )
}
