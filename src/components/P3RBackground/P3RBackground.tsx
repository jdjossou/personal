'use client'

import { useRef, useSyncExternalStore } from 'react'
import { useP3RBackground } from './useP3RBackground'
import { getServerSnapshot, getSnapshot, subscribe } from './waterConfig'

// The animated P3R water. Mounted ONCE globally (layout.tsx) — one canvas, one
// WebGL context for the whole site. Its look is driven by the waterConfig store:
// most screens use the default; the landing screen pushes a darker, calmer config
// while it's shown (see Landing/Landing.tsx) and reverts on leave, so there's no
// second canvas/pipeline. The hook applies config changes to the live uniforms.
export function P3RBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const config = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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
