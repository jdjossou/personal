// Triangle field — two large white, semi-transparent triangles over the shared
// water, the reference's pale angular fields (docs/stack/stack_reference.png).
// Purely decorative chrome: aria-hidden, non-interactive, pinned full-bleed above
// the water and below the content. Does NOT re-mount the water (global, in
// src/app/layout.tsx). Tune the polygons + opacity in constants.ts via screenshots.

import { TRIANGLE_A_CLIP, TRIANGLE_B_CLIP, TRIANGLE_FILL } from './constants'

export function TriangleField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* Upper-right wedge — points down toward the center, the larger field. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: TRIANGLE_FILL,
          clipPath: TRIANGLE_A_CLIP,
        }}
      />
      {/* Lower wedge — rises from the bottom edge, offset left of the first. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: TRIANGLE_FILL,
          clipPath: TRIANGLE_B_CLIP,
        }}
      />
    </div>
  )
}
