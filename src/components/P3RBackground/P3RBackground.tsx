'use client'

import { useRef } from 'react'
import { useP3RBackground } from './useP3RBackground'

export function P3RBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useP3RBackground(canvasRef)

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
