'use client'

// Tech stack — the floating, draggable, SHAKEABLE technology tokens. Below the
// detail card on the LEFT sits a big tilted "TECH STACK" title; the role's
// technologies are angular tokens that gently bob like objects on water, can be
// dragged anywhere, and carry an angular-spring rotation: flick or shake a token
// and it spins, then eases back to 0° (upright = readable).
//
// Transforms are split across nested layers so they never fight each other:
//   • OUTER div — the token's HOME position (pure CSS `calc()` off the invisible
//     TECHZONE, seeded from the index so SSR and client render identically) PLUS
//     the px DRAG `translate` (0 until dragged; released tokens keep their offset).
//   • PHYSICS div — `rotate(angle)` written IMPERATIVELY by a single shared rAF
//     spring loop (per-token {angle, vel} held in a ref, DOM written via node refs
//     so the loop never triggers a React render). React never sets its transform,
//     so the imperative value survives re-renders.
//   • FLOAT div — the looping `techFloat` keyframe (small per-token translate +
//     rotate), so the ambient bob rides on top of home + drag + spin.
//   • Inside it, the chip is a two-layer shape: a cyan back layer inflated by the
//     outline width (so the rim follows the FULL slanted clip — a plain `border`
//     gets clipped off the parallelogram's slanted sides) under the dark fill.

import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  ACCENT_CYAN,
  TAG_FILL,
  TECH_FLOAT_AMPLITUDE,
  TECH_FLOAT_DUR_MAX,
  TECH_FLOAT_DUR_MIN,
  TECH_SHAKE_GAIN,
  TECH_SPIN_MAX,
  TECH_SPRING_DAMP,
  TECH_SPRING_K,
  TECH_TITLE,
  TECH_TITLE_LEFT,
  TECH_TITLE_OUTLINE,
  TECH_TITLE_OUTLINE_COLOR,
  TECH_TITLE_SIZE,
  TECH_TITLE_SKEW,
  TECH_TITLE_TOP,
  TECH_TOKEN_CLIP,
  TECH_TOKEN_OUTLINE,
  TECH_TOKEN_SIZE,
  TECHZONE_HEIGHT,
  TECHZONE_LEFT,
  TECHZONE_TOP,
  TECHZONE_WIDTH,
} from './constants'
import { useReducedMotion } from './useReducedMotion'

type Pos = { x: number; y: number }

// Deterministic 0..1 pseudo-random from a seed (the classic fract-sin hash). Used
// instead of Math.random so the scatter + float params are stable and SSR-safe.
const hash = (n: number): number => {
  const s = Math.sin(n) * 43758.5453
  return s - Math.floor(s)
}

export function TechStack({
  technologies,
  scaleRef,
}: {
  technologies: readonly string[]
  // Live stage scale (the desktop canvas is transform-scaled). Drag deltas arrive
  // in screen px, so we divide by it to map them back into stage space → the token
  // tracks the cursor 1:1 regardless of how small the canvas is scaled.
  scaleRef?: RefObject<number>
}) {
  // Reduced motion: hold the tokens still — no ambient float, no rAF spring loop.
  // They keep their scattered home positions and stay draggable (just no spin).
  const reduced = useReducedMotion()

  const n = technologies.length
  // Loose grid for the home scatter.
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)))
  const rows = Math.max(1, Math.ceil(n / cols))

  // Zone bounds as raw numbers. TECHZONE_LEFT/WIDTH share the vw unit and
  // TECHZONE_TOP/HEIGHT share vh, so each home position collapses to a SINGLE
  // `<n>vw` / `<n>vh` length (no arithmetic calc()). That matters for hydration:
  // a browser normalizes `calc(3vw + 2.03 * 40vw / 4)` to `calc(23.3147vw)` in
  // the DOM, which then wouldn't match React's raw string. A plain rounded length
  // round-trips cleanly.
  const zoneLeft = parseFloat(TECHZONE_LEFT)
  const zoneWidth = parseFloat(TECHZONE_WIDTH)
  const zoneTop = parseFloat(TECHZONE_TOP)
  const zoneHeight = parseFloat(TECHZONE_HEIGHT)

  // Per-token DRAG offset in px; starts at 0 so the CSS home position shows on the
  // first paint (identical on server + client).
  const [offsets, setOffsets] = useState<Pos[]>(() => technologies.map(() => ({ x: 0, y: 0 })))
  // Active drag: which token, the pointer-down point, the token's offset at grab
  // time, and the last X seen (to derive per-move horizontal step → spin torque).
  const drag = useRef<{ i: number; px: number; py: number; ox: number; oy: number; lastX: number } | null>(null)

  // Angular spring state per token + DOM refs to the physics layers. The rAF loop
  // mutates these and writes `rotate(...)` straight to the nodes — no re-render.
  const physics = useRef<{ angle: number; vel: number }[]>(technologies.map(() => ({ angle: 0, vel: 0 })))
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reduced) return // no spring loop under reduced motion — tokens stay upright
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000) // clamp dt so tab-switches don't explode the spring
      last = now
      for (let i = 0; i < physics.current.length; i++) {
        const p = physics.current[i]
        // Damped spring toward 0°: accel = -K·angle - DAMP·vel.
        const accel = -TECH_SPRING_K * p.angle - TECH_SPRING_DAMP * p.vel
        p.vel += accel * dt
        if (p.vel > TECH_SPIN_MAX) p.vel = TECH_SPIN_MAX
        else if (p.vel < -TECH_SPIN_MAX) p.vel = -TECH_SPIN_MAX
        p.angle += p.vel * dt
        const node = nodeRefs.current[i]
        if (node) node.style.transform = `rotate(${p.angle.toFixed(3)}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const onPointerDown = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { i, px: e.clientX, py: e.clientY, ox: offsets[i].x, oy: offsets[i].y, lastX: e.clientX }
  }

  const onPointerMove = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.i !== i) return
    // Translate follows the pointer (screen px → stage px via the live scale).
    const s = scaleRef?.current || 1
    const nx = d.ox + (e.clientX - d.px) / s
    const ny = d.oy + (e.clientY - d.py) / s
    setOffsets((prev) => prev.map((p, idx) => (idx === i ? { x: nx, y: ny } : p)))
    // Horizontal step since the last move feeds spin — shaking left/right makes
    // the token wobble, a fast flick spins it (the spring then unwinds it).
    const dx = (e.clientX - d.lastX) / s
    d.lastX = e.clientX
    physics.current[i].vel += TECH_SHAKE_GAIN * dx
  }

  const onPointerUp = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.i === i) drag.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <>
      {/* TECH STACK title — anchored below the card + its shadow, on the left.
          Big, heavy, slightly tilted. */}
      <p
        className="absolute z-20 font-display font-black tracking-[-0.03em] text-white uppercase"
        style={{
          top: TECH_TITLE_TOP,
          left: TECH_TITLE_LEFT,
          fontSize: TECH_TITLE_SIZE,
          transform: `skewX(${TECH_TITLE_SKEW})`,
          WebkitTextStroke: `${TECH_TITLE_OUTLINE} ${TECH_TITLE_OUTLINE_COLOR}`,
        }}
      >
        {TECH_TITLE}
      </p>

      {/* The float keyframe — one shared animation; each token varies it via CSS
          vars (--ax/--ay/--rot) + its own duration/delay so motion is organic. */}
      <style>{`
        @keyframes techFloat {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          50%  { transform: translate(calc(var(--ax) * 1px), calc(var(--ay) * 1px)) rotate(var(--rot)); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
      `}</style>

      {/* Drag layer — spans the stage so tokens can be dragged anywhere. The layer
          itself ignores pointer events; only the tokens catch them. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {technologies.map((tech, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          // Home position: cell origin + a deterministic jitter within the cell,
          // collapsed to a single rounded length (see zone* notes above).
          const fx = col + hash(i * 12.9898) * 0.55
          const fy = row + hash(i * 78.233) * 0.55
          const left = `${(zoneLeft + (fx * zoneWidth) / cols).toFixed(4)}cqw`
          const top = `${(zoneTop + (fy * zoneHeight) / rows).toFixed(4)}cqh`

          // Per-token float params, all derived from the index (deterministic).
          // Rounded so the inline values round-trip through the browser's CSSOM
          // (full-precision seconds get re-serialized, breaking hydration).
          const dur = (TECH_FLOAT_DUR_MIN + hash(i * 0.741) * (TECH_FLOAT_DUR_MAX - TECH_FLOAT_DUR_MIN)).toFixed(3)
          const delay = (-hash(i * 2.317) * Number(dur)).toFixed(3) // negative → desynced phases
          const ax = ((hash(i * 5.21) - 0.5) * 2 * TECH_FLOAT_AMPLITUDE * 0.6).toFixed(2)
          const ay = ((hash(i * 9.07) - 0.5) * 2 * TECH_FLOAT_AMPLITUDE).toFixed(2)
          const rot = `${((hash(i * 3.13) - 0.5) * 8).toFixed(2)}deg`

          const off = offsets[i]

          return (
            <div
              key={tech}
              className="pointer-events-auto absolute cursor-grab touch-none select-none active:cursor-grabbing"
              style={{ left, top, transform: `translate(${off.x}px, ${off.y}px)` }}
              onPointerDown={onPointerDown(i)}
              onPointerMove={onPointerMove(i)}
              onPointerUp={onPointerUp(i)}
            >
              {/* PHYSICS layer — rotation written imperatively by the rAF spring.
                  No `transform` in its React style, so re-renders never clobber it. */}
              <div
                ref={(el) => {
                  nodeRefs.current[i] = el
                }}
                style={{ transformOrigin: 'center' }}
              >
                {/* FLOAT layer — the ambient bob. */}
                <div
                  className="relative block"
                  style={
                    {
                      animation: reduced
                        ? undefined
                        : `techFloat ${dur}s ease-in-out ${delay}s infinite`,
                      '--ax': ax,
                      '--ay': ay,
                      '--rot': rot,
                    } as CSSProperties
                  }
                >
                  {/* Cyan outline back layer — same clip, inflated on every side so
                      the rim follows the full slanted shape. */}
                  <span
                    aria-hidden
                    className="absolute"
                    style={{ inset: `-${TECH_TOKEN_OUTLINE}`, backgroundColor: ACCENT_CYAN, clipPath: TECH_TOKEN_CLIP }}
                  />
                  {/* Dark fill chip on top. */}
                  <span
                    className="relative block px-3 py-1.5 font-medium tracking-[0.08em] whitespace-nowrap text-white uppercase"
                    style={{
                      fontSize: TECH_TOKEN_SIZE,
                      backgroundColor: TAG_FILL,
                      clipPath: TECH_TOKEN_CLIP,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
                    }}
                  >
                    {tech}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
