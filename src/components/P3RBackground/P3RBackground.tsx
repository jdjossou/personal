'use client'

import { useRef } from 'react'
import type { P3RConfig } from './constants'
import { useP3RBackground } from './useP3RBackground'

// The animated P3R water. Mounted globally (layout.tsx) for the site-wide look,
// and again by the landing screen with a darker, calmer `config` so the landing
// reads as its own deeper variant of the same water (see Landing/constants.ts).
export function P3RBackground({ config }: { config?: P3RConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useP3RBackground(canvasRef, config)

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
