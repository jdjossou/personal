'use client'

// Shard background (Task 02) — the landing / start screen's own backdrop,
// distinct from the shared P3R water background used everywhere else. A field of
// sharp angular polygon fragments ("broken glass / crystalline shards catching
// light") layered at different depths and opacities behind the title text, in the
// Persona-inspired navy/blue/white palette. It provides atmosphere and visual
// weight without ever competing with the foreground type: shards are thinned and
// dimmed inside the centerpiece text region (SHARD_CLEAR_RECT).
//
// Motion is deliberately subtle and subordinate to Task 03's PRESS ANY KEY scan
// animation: a slow autonomous drift and a faint light pass sweeping left → right
// across the facets. The shards do NOT react to the mouse.
//
// Lifecycle mirrors MainMenu/ParticleField: a DPR-scaled canvas, a single rAF
// loop with a clamped dt, regeneration on resize, a static one-frame fallback
// under prefers-reduced-motion (no drift/shimmer), and a pause while the tab is
// hidden. The canvas is pointer-events-none so the screen's onStart click passes
// straight through to <main>.

import { useEffect, useRef } from 'react'
import {
  BG_COLOR,
  BG_COLOR_BOTTOM,
  BG_COLOR_MID,
  SHARD_CLEAR_DIM,
  SHARD_CLEAR_DISCARD,
  SHARD_CLEAR_RECT,
  SHARD_COLORS,
  SHARD_COUNT,
  SHARD_DEPTH_RANGE,
  SHARD_DRIFT_RANGE,
  SHARD_OPACITY_RANGE,
  SHARD_SHIMMER_AMP,
  SHARD_SHIMMER_SPEED,
  SHARD_SHIMMER_WIDTH,
  SHARD_SIDES_RANGE,
  SHARD_SIZE_RANGE,
} from './constants'

type Shard = {
  x: number
  y: number
  vx: number
  vy: number
  depth: number // 0.15..1 — drives parallax, scale, opacity
  size: number // polygon radius (px) before depth scale
  color: string
  opacity: number
  verts: [number, number][] // jittered unit-radius polygon offsets
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))

// An angular convex polygon as unit-radius points. Radii are jittered hard and
// the first vertex angle is offset randomly so shards read as sharp, irregular
// faceted slivers rather than regular polygons. One axis is squashed to make many
// of them elongated.
function makeVerts(sides: number): [number, number][] {
  const verts: [number, number][] = []
  const a0 = Math.random() * Math.PI * 2
  const squash = rand(0.35, 1) // < 1 → sliver-like
  for (let i = 0; i < sides; i++) {
    const a = a0 + (i / sides) * Math.PI * 2
    const r = rand(0.45, 1)
    verts.push([Math.cos(a) * r, Math.sin(a) * r * squash])
  }
  return verts
}

function makeShard(w: number, h: number): Shard | null {
  const x = Math.random() * w
  const y = Math.random() * h

  // Asymmetric distribution: bias placement away from the left-of-centre text
  // band. Shards landing in the clear rect are mostly discarded (returns null so
  // the caller can retry), and the survivors are dimmed.
  const fx = x / w
  const fy = y / h
  const inClear =
    fx > SHARD_CLEAR_RECT.x0 &&
    fx < SHARD_CLEAR_RECT.x1 &&
    fy > SHARD_CLEAR_RECT.y0 &&
    fy < SHARD_CLEAR_RECT.y1
  if (inClear && Math.random() < SHARD_CLEAR_DISCARD) return null

  const depth = rand(SHARD_DEPTH_RANGE[0], SHARD_DEPTH_RANGE[1])
  // Near shards (high depth) are larger, bolder; far shards small and dim.
  const opacity =
    rand(SHARD_OPACITY_RANGE[0], SHARD_OPACITY_RANGE[1]) *
    (0.55 + depth * 0.45) *
    (inClear ? SHARD_CLEAR_DIM : 1)
  const speed = rand(SHARD_DRIFT_RANGE[0], SHARD_DRIFT_RANGE[1])
  const dir = Math.random() * Math.PI * 2

  return {
    x,
    y,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    depth,
    size: rand(SHARD_SIZE_RANGE[0], SHARD_SIZE_RANGE[1]) * (0.5 + depth * 0.7),
    color: SHARD_COLORS[randInt(0, SHARD_COLORS.length - 1)],
    opacity,
    verts: makeVerts(randInt(SHARD_SIDES_RANGE[0], SHARD_SIDES_RANGE[1])),
  }
}

function buildShards(w: number, h: number): Shard[] {
  const shards: Shard[] = []
  let guard = 0
  while (shards.length < SHARD_COUNT && guard < SHARD_COUNT * 20) {
    guard++
    const s = makeShard(w, h)
    if (s) shards.push(s)
  }
  return shards
}

export function ShardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let shards = buildShards(w, h)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      shards = buildShards(w, h)
    }
    resize()

    const drawShard = (s: Shard, lightAlpha: number) => {
      // Slow drift wraps the shard's stored position so it never leaves a hole.
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.globalAlpha = Math.min(1, s.opacity + lightAlpha * s.opacity)
      ctx.fillStyle = s.color
      ctx.beginPath()
      s.verts.forEach(([vx, vy], i) => {
        const X = vx * s.size
        const Y = vy * s.size
        if (i === 0) ctx.moveTo(X, Y)
        else ctx.lineTo(X, Y)
      })
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const render = (t: number, dt: number, animate: boolean) => {
      // Base gradient — deep azure top → navy → near-black, echoing the menu
      // water's blue + bright-top structure so the transition reads coherently,
      // while staying dark behind the shards (never light).
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, BG_COLOR)
      grad.addColorStop(0.45, BG_COLOR_MID)
      grad.addColorStop(1, BG_COLOR_BOTTOM)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Light-pass band centre, sweeping left → right and recycling.
      const bandX = ((t * SHARD_SHIMMER_SPEED) % 1.4) - 0.2 // -0.2..1.2 of width
      const bandW = SHARD_SHIMMER_WIDTH

      ctx.globalCompositeOperation = 'source-over'
      for (const s of shards) {
        if (animate) {
          s.x += s.vx * dt
          s.y += s.vy * dt
          // Wrap with a margin so shards re-enter from the opposite edge.
          const m = s.size
          if (s.x < -m) s.x = w + m
          else if (s.x > w + m) s.x = -m
          if (s.y < -m) s.y = h + m
          else if (s.y > h + m) s.y = -m
        }
        // Gaussian falloff of the shard's distance to the light band.
        const d = (s.x / w - bandX) / bandW
        const lightAlpha = animate ? Math.exp(-d * d) * SHARD_SHIMMER_AMP : 0
        drawShard(s, lightAlpha)
      }
      ctx.globalAlpha = 1
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
      render((now - start) / 1000, dt, true)
    }
    const startLoop = () => {
      cancelAnimationFrame(frameId) // never stack two rAF chains
      last = performance.now()
      frameId = requestAnimationFrame(tick)
    }
    const stopLoop = () => cancelAnimationFrame(frameId)

    // Reduced motion: one static frame (full composition), no loop.
    const applyMotionPreference = () => {
      if (reduceMotion.matches) {
        stopLoop()
        render(0, 0, false)
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
      className="pointer-events-none absolute inset-0 -z-10"
    />
  )
}
