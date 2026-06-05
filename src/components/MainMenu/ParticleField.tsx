'use client'

// Decorative particles (Task 09) — a sparse field of small polygonal confetti
// drifting slowly above the water but behind the white left panel. Purely
// atmospheric. Drawn on a canvas with additive ('screen') blending so the shapes
// glow rather than paint over the scene, and animated imperatively with
// requestAnimationFrame (no React state churn).
//
// It reuses the LeftPanel / P3RBackground motion plumbing: under reduced motion
// the loop never starts and a single static frame is drawn; the loop also pauses
// while the tab is hidden. A resize listener keeps the canvas matched to the
// viewport (with devicePixelRatio scaling for crisp shapes on HiDPI screens).

import { useEffect, useRef } from 'react'
import {
  PARTICLE_COUNT,
  PARTICLE_COLORS,
  PARTICLE_RED,
  PARTICLE_RED_CHANCE,
  PARTICLE_SIZE_RANGE,
  PARTICLE_SPEED_RANGE,
  PARTICLE_SPIN_RANGE,
  PARTICLE_OPACITY_RANGE,
  PARTICLE_SIDES_RANGE,
  PARTICLE_FLICKER_AMP,
  PARTICLE_FLICKER_SPEED_RANGE,
} from './constants'

const TAU = Math.PI * 2

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  spin: number
  size: number
  color: string
  opacity: number
  flickerPhase: number
  flickerSpeed: number
  verts: [number, number][] // unit-radius polygon offsets (×size at draw time)
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const randInt = (min: number, max: number) =>
  Math.floor(rand(min, max + 1))

// A convex polygon as unit-radius points, with slightly jittered radii so the
// shapes read as irregular confetti rather than perfect regular polygons.
function makeVerts(sides: number): [number, number][] {
  const verts: [number, number][] = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * TAU
    const r = rand(0.7, 1)
    verts.push([Math.cos(a) * r, Math.sin(a) * r])
  }
  return verts
}

function makeParticle(w: number, h: number): Particle {
  const speed = rand(PARTICLE_SPEED_RANGE[0], PARTICLE_SPEED_RANGE[1])
  // Drift generally upward, fanned slightly to the diagonal.
  const dir = -Math.PI / 2 + rand(-0.5, 0.5)
  const isRed = Math.random() < PARTICLE_RED_CHANCE
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    rotation: Math.random() * TAU,
    spin: rand(PARTICLE_SPIN_RANGE[0], PARTICLE_SPIN_RANGE[1]) * (Math.random() < 0.5 ? -1 : 1),
    size: rand(PARTICLE_SIZE_RANGE[0], PARTICLE_SIZE_RANGE[1]),
    color: isRed
      ? PARTICLE_RED
      : PARTICLE_COLORS[randInt(0, PARTICLE_COLORS.length - 1)],
    opacity: rand(PARTICLE_OPACITY_RANGE[0], PARTICLE_OPACITY_RANGE[1]),
    flickerPhase: Math.random() * TAU,
    flickerSpeed: rand(PARTICLE_FLICKER_SPEED_RANGE[0], PARTICLE_FLICKER_SPEED_RANGE[1]),
    verts: makeVerts(randInt(PARTICLE_SIDES_RANGE[0], PARTICLE_SIDES_RANGE[1])),
  }
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(w, h),
    )

    const draw = (p: Particle, t: number) => {
      const flicker = Math.sin(t * p.flickerSpeed + p.flickerPhase) * PARTICLE_FLICKER_AMP
      const alpha = Math.max(0, Math.min(1, p.opacity + flicker))
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      p.verts.forEach(([vx, vy], i) => {
        const px = vx * p.size
        const py = vy * p.size
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const render = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'screen' // additive glow
      const m = 16 // edge margin so shapes wrap fully off-screen before recycling
      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rotation += p.spin * dt
        // Wrap around screen edges (recycle to the opposite side).
        if (p.x < -m) p.x = w + m
        else if (p.x > w + m) p.x = -m
        if (p.y < -m) p.y = h + m
        else if (p.y > h + m) p.y = -m
        draw(p, t)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    let frameId = 0
    let last = performance.now()
    const start = last
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tick = () => {
      frameId = requestAnimationFrame(tick)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05) // clamp after tab stalls
      last = now
      render((now - start) / 1000, dt)
    }
    const startLoop = () => {
      cancelAnimationFrame(frameId) // never stack two rAF chains
      last = performance.now()
      frameId = requestAnimationFrame(tick)
    }
    const stopLoop = () => cancelAnimationFrame(frameId)

    // Reduced motion: render one static frame and never start the loop.
    const applyMotionPreference = () => {
      if (reduceMotion.matches) {
        stopLoop()
        render(0, 0)
      } else {
        startLoop()
      }
    }
    const onVisibilityChange = () => {
      if (document.hidden) stopLoop()
      else if (!reduceMotion.matches) startLoop()
    }

    reduceMotion.addEventListener('change', applyMotionPreference)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', resize)
    applyMotionPreference()

    return () => {
      stopLoop()
      reduceMotion.removeEventListener('change', applyMotionPreference)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
