// Pure geometry for the transition masks (Task 08). No React, no DOM — just maths
// the rAF loop in ScreenReveal feeds each frame. Both masks are built in the
// clipped element's user space (CSS px, clipPathUnits="userSpaceOnUse").

// Ease-out cubic — fast then settling, so the reveal lunges open and eases shut.
export const easeOutCubic = (p: number): number => 1 - Math.pow(1 - p, 3)

// Distance from a focal point to its farthest viewport corner — how far a mask
// must grow to fully cover the screen from that point.
export function coverRadius(
  cx: number,
  cy: number,
  w: number,
  h: number,
): number {
  const dx = Math.max(cx, w - cx)
  const dy = Math.max(cy, h - cy)
  return Math.hypot(dx, dy)
}

// One wavy blot, as an SVG <polygon> points string. The edge is a circle whose
// radius is sine-distorted per angle — r(θ) = baseR + amp·sin(freq·θ + phase) —
// so it ripples like ink rather than reading as a clean circle. `phase` is
// advanced over time by the caller to keep the edge alive while it grows.
export function wavyBlotPolygon(
  cx: number,
  cy: number,
  baseR: number,
  amp: number,
  freq: number,
  phase: number,
  points: number,
): string {
  // Cap the wave amplitude at half the radius so the edge can never fold through
  // the centre (a negative radius). This also makes the blot open from a point as
  // a clean small circle, then grow its ripple as it expands.
  const a = Math.min(amp, baseR * 0.5)
  let out = ''
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * Math.PI * 2
    const r = baseR + a * Math.sin(freq * theta + phase)
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    out += `${x.toFixed(1)},${y.toFixed(1)} `
  }
  return out.trimEnd()
}
