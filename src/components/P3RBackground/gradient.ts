import * as THREE from 'three'

// Layer 1 — the P3R blue palette as a 1D LUT.
// Stops from docs/layer1.md, given in *linear* RGB. We interpolate between them
// in OKLab (perceptually uniform — matches Godot's interpolation_color_space=2),
// then encode to sRGB so the baked texels are the display-ready colors the
// color-mapping shader can output directly.
const STOPS: { pos: number; rgb: [number, number, number] }[] = [
  { pos: 0.0, rgb: [0.024, 0.039, 0.169] }, // deep navy
  { pos: 0.309, rgb: [0.047, 0.071, 0.298] }, // dark blue
  { pos: 0.48, rgb: [0.106, 0.22, 0.941] }, // electric blue
  { pos: 0.768, rgb: [0.2, 0.318, 1.0] }, // bright blue-cyan
  { pos: 0.813, rgb: [0.988, 0.996, 0.996] }, // near white
]

type Vec3 = [number, number, number]

function linearRgbToOklab(r: number, g: number, b: number): Vec3 {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ]
}

function oklabToLinearRgb(L: number, a: number, b: number): Vec3 {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

// Linear RGB -> sRGB 8-bit channel.
function encodeSrgb(c: number): number {
  const clamped = Math.min(1, Math.max(0, c))
  const v =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
  return Math.round(v * 255)
}

/**
 * Bakes the 5-stop blue gradient into a 256×1 sRGB DataTexture, interpolating
 * in OKLab between the (non-uniformly spaced) stops.
 */
export function bakeGradientTexture(): THREE.DataTexture {
  const width = 256
  const data = new Uint8Array(width * 4)

  // Pre-convert stops to OKLab once.
  const labStops = STOPS.map((stop) => ({
    pos: stop.pos,
    lab: linearRgbToOklab(stop.rgb[0], stop.rgb[1], stop.rgb[2]),
  }))

  for (let i = 0; i < width; i++) {
    const pos = i / (width - 1)

    // Find the bracketing stops.
    let lo = labStops[0]
    let hi = labStops[labStops.length - 1]
    for (let s = 0; s < labStops.length - 1; s++) {
      if (pos >= labStops[s].pos && pos <= labStops[s + 1].pos) {
        lo = labStops[s]
        hi = labStops[s + 1]
        break
      }
    }

    const span = hi.pos - lo.pos
    const t = span > 0 ? (pos - lo.pos) / span : 0
    const L = lo.lab[0] + (hi.lab[0] - lo.lab[0]) * t
    const a = lo.lab[1] + (hi.lab[1] - lo.lab[1]) * t
    const b = lo.lab[2] + (hi.lab[2] - lo.lab[2]) * t

    const [lr, lg, lb] = oklabToLinearRgb(L, a, b)
    const o = i * 4
    data[o] = encodeSrgb(lr)
    data[o + 1] = encodeSrgb(lg)
    data[o + 2] = encodeSrgb(lb)
    data[o + 3] = 255
  }

  const texture = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

// Layer 4 (Caustic1) — bubbles_mask_texture. A vertical greyscale gradient that
// gates where the Voronoi "bubbles" may appear: a broad black mid-section
// suppresses them across most of the screen, leaving only a soft allowance at the
// very top and bottom. Stops are from docs/layer4.md, given there in Godot UV
// (y-down). We re-express them in our vUv (y-up) so screen-top is bright:
//
//   vUv.y 1.000 (top)    -> 0.389   |   Godot UV.y 0.000
//   vUv.y 0.722          -> 0.000   |   Godot UV.y 0.278
//   vUv.y 0.237          -> 0.000   |   Godot UV.y 0.763
//   vUv.y 0.000 (bottom) -> 0.252   |   Godot UV.y 1.000
//
// Baked as a 1×256 column (sampled by vUv.y). DataTexture has flipY = false, so
// data row 0 is vUv.y = 0 (bottom). Plain linear grey — it's a mask, not colour.
const BUBBLE_MASK_STOPS: { pos: number; grey: number }[] = [
  { pos: 0.0, grey: 0.252 }, // bottom
  { pos: 0.237, grey: 0.0 },
  { pos: 0.722, grey: 0.0 },
  { pos: 1.0, grey: 0.389 }, // top
]

export function bakeBubblesMaskTexture(): THREE.DataTexture {
  const height = 256
  const data = new Uint8Array(height * 4)

  for (let r = 0; r < height; r++) {
    const pos = r / (height - 1) // vUv.y at this row

    let lo = BUBBLE_MASK_STOPS[0]
    let hi = BUBBLE_MASK_STOPS[BUBBLE_MASK_STOPS.length - 1]
    for (let s = 0; s < BUBBLE_MASK_STOPS.length - 1; s++) {
      if (pos >= BUBBLE_MASK_STOPS[s].pos && pos <= BUBBLE_MASK_STOPS[s + 1].pos) {
        lo = BUBBLE_MASK_STOPS[s]
        hi = BUBBLE_MASK_STOPS[s + 1]
        break
      }
    }

    const span = hi.pos - lo.pos
    const t = span > 0 ? (pos - lo.pos) / span : 0
    const grey = lo.grey + (hi.grey - lo.grey) * t
    const byte = Math.round(grey * 255)

    const o = r * 4
    data[o] = byte
    data[o + 1] = byte
    data[o + 2] = byte
    data[o + 3] = 255
  }

  const texture = new THREE.DataTexture(data, 1, height, THREE.RGBAFormat)
  texture.colorSpace = THREE.NoColorSpace // mask data, not colour
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
