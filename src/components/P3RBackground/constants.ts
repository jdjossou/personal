// Single source of truth for every tunable value in the P3R background.
// Keep this dependency-free (plain numbers / tuples) — the hook constructs the
// THREE.Vector2/Vector4 instances from these so tuning never means touching
// render code. Vectors are [x, y]; colours are linear RGB(A) unless noted.

// Cap the device pixel ratio so the 2-render-target + 49-tap-blur pipeline never
// renders at the full 2–3× of a retina panel. 1.5 keeps it crisp but cheap.
export const DPR_CAP = 1.5

// Caustic shaders step their animation at this many discrete frames/sec — the
// Godot source's `updates_per_second`. Drives the chunky P3R shimmer.
export const STEPPED_FPS = 6

// Layer 1 — base colour. Luminance is now a vertical ramp (bright surface at the
// top → deep navy at the bottom) that is fed into the 1D blue LUT, with a little
// FBM noise added for organic depth. midPoint splits the two ramp halves: the
// top (1 - midPoint) of the screen stays in the light-blue band.
export const BASE_GRADIENT = {
  topLuma: 0.78, // vUv.y = 1 (top) → light blue-cyan end of the LUT
  midLuma: 0.56, // at midPoint → electric/royal blue
  bottomLuma: 0.1, // vUv.y = 0 (bottom) → deep blue (luminous, not crushed)
  midPoint: 0.6, // top 40% of the screen reads as light blue
  noiseAmp: 0.06, // ± luma jitter from FBM (organic depth, not structure)
} as const

// Layer 3 — cyan tint. Now a vertical-alpha wash instead of a flat 82%: strong
// on the bright surface, light on the depths, so the navy bottom survives.
// NOTE: this is the *sRGB display* value (#00B7EA), not the doc's linear
// (0, 0.498, 0.824). The tint is now a raw ShaderMaterial that writes its output
// unconverted (like every other custom pass here), so it must already be in the
// display space — matching what the old MeshBasicMaterial wrote after its
// automatic linear→sRGB conversion.
export const TINT = {
  color: [0.0, 0.718, 0.918] as const,
  alphaTop: 0.5,
  alphaBottom: 0.2,
} as const

// Layer 2 — sine distortion (pure UV warp).
export const DISTORTION = {
  amplitude: 0.02, // 2% screen offset — subtle
  speed: 0.5,
  waveLength: 0.08,
} as const

// Layer 4 — Caustic1 (full-screen additive caustics + Voronoi bubbles).
export const CAUSTIC1 = {
  color: [0.331, 0.929, 0.919, 0.255] as const, // teal, low alpha
  velocityMain: [0.0, -0.07] as const,
  velocitySecond: [0.0, 0.1] as const,
  velocityBubbles: [0.0, 0.13] as const,
  scaleMain: [0.5, 0.5] as const,
  scaleSecond: [1.0, 4.0] as const,
  scaleBubbles: [1.6, 0.9] as const,
  cut: 0.79, // high threshold → sparse, dotty caustics
} as const

// Layer 5 — Caustic2 (denser, brighter caustics in the top-right panel).
export const CAUSTIC2 = {
  color: [0.587, 0.888, 0.939, 0.471] as const, // ice-blue
  velocityMain: [0.0, -0.1] as const,
  velocitySecond: [0.0, 0.25] as const,
  scaleMain: [1.0, 1.0] as const,
  scaleSecond: [1.0, 2.0] as const,
  cut: 0.48, // ~50% threshold → dense fill
} as const

// Caustic2 panel geometry. Placement is baked into the quad's vertices (the
// shared vertex shader ignores camera/model matrices). Sizes are in NDC units;
// the reference is a 1920×1080 frame: 960 px / NDC-unit X, 540 px / NDC-unit Y.
export const CAUSTIC2_PANEL = {
  width: 512 / 960,
  height: 512 / 540,
  offsetX: 0.55,
  offsetY: 0.5556,
} as const

// Layer 6 — Gaussian blur.
export const BLUR = {
  sigma: 1.4, // 7×7 kernel, light softening
} as const
