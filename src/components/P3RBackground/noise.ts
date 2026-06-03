import * as THREE from 'three'

// Layer 4 (Caustic1) needs two *scrolling* greyscale noise textures: a broad
// Simplex-style "pattern" and a Voronoi "bubbles" map. The Godot original feeds
// these as seamless NoiseTexture2D resources sampled with RepeatWrapping, so the
// shader can offset their UVs over time and have them tile without seams.
//
// We bake both on the CPU at mount, matching the project's self-contained style
// (no noise dependency — hand-rolled like the existing vnoise/OKLab code). The
// key requirement is **seamless tiling**: every lattice / feature-point index is
// wrapped modulo a period, so the value at UV 0 matches the value at UV 1 on both
// axes. Anything sampled with RepeatWrapping then tiles perfectly while scrolling.

const TEXTURE_SIZE = 1024

// Periods are "cells across the full texture" for the base octave. Higher = finer
// features. Tuned to the docs' description (broad half-screen hills for the
// pattern; mid-sized bubble cells), then scaled further by the shader's
// scale_* uniforms. Adjust here if the on-screen grain needs tweaking.
const PATTERN_PERIOD = 6 // Simplex pattern: large, smooth hills
const PATTERN_OCTAVES = 2
const BUBBLE_PERIOD = 16 // Voronoi cells: mid-sized bubble outlines
const BUBBLE_OCTAVES = 4

// 32-bit integer hash -> two floats in [0,1). Math.imul keeps the multiply in
// 32-bit so the bit-mixing is stable across platforms.
function hash2(ix: number, iy: number, seed: number): [number, number] {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 0x85ebca6b)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  const rx = (h >>> 0) / 4294967296
  const h2 = Math.imul((h ^ 0x9e3779b9) >>> 0, 2654435761)
  const ry = (h2 >>> 0) / 4294967296
  return [rx, ry]
}

// Quintic fade (Perlin's improved interpolant) — zero 1st/2nd derivative at ends.
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Pseudo-random unit gradient at a lattice corner, wrapped to [0,period) so the
// corner at index `period` is identical to index 0 → seamless on both axes.
function gradAt(ix: number, iy: number, period: number, seed: number): [number, number] {
  const wx = ((ix % period) + period) % period
  const wy = ((iy % period) + period) % period
  const angle = hash2(wx, wy, seed)[0] * Math.PI * 2
  return [Math.cos(angle), Math.sin(angle)]
}

// Periodic Perlin gradient noise. `u,v` are in [0,1); `period` is the lattice
// resolution for this octave. Result is roughly in [-0.7, 0.7].
function perlinPeriodic(u: number, v: number, period: number, seed: number): number {
  const x = u * period
  const y = v * period
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = x0 + 1
  const y1 = y0 + 1
  const sx = fade(x - x0)
  const sy = fade(y - y0)

  const dot = (cx: number, cy: number) => {
    const g = gradAt(cx, cy, period, seed)
    return g[0] * (x - cx) + g[1] * (y - cy)
  }

  const ix0 = lerp(dot(x0, y0), dot(x1, y0), sx)
  const ix1 = lerp(dot(x0, y1), dot(x1, y1), sx)
  return lerp(ix0, ix1, sy)
}

// fBm of periodic Perlin — each octave doubles the period (stays seamless) and
// halves the amplitude. Returns the raw (un-normalised) sum.
function fbmPerlin(u: number, v: number, basePeriod: number, octaves: number, seed: number): number {
  let sum = 0
  let amp = 0.5
  let period = basePeriod
  for (let o = 0; o < octaves; o++) {
    sum += amp * perlinPeriodic(u, v, period, seed + o * 1013)
    period *= 2
    amp *= 0.5
  }
  return sum
}

// Periodic Worley F1 — distance to the nearest feature point on a toroidal grid.
// F1 is 0 at the feature point (cell centre) and largest along the Voronoi edges,
// so a bright F1 traces the cell *boundaries* — exactly the "bubble outline" look.
function worleyF1(u: number, v: number, period: number, seed: number): number {
  const fx = u * period
  const fy = v * period
  const cx = Math.floor(fx)
  const cy = Math.floor(fy)
  let f1 = Infinity
  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      const gx = cx + ox
      const gy = cy + oy
      // Hash from the *wrapped* cell so cells across the seam share a point.
      const wx = ((gx % period) + period) % period
      const wy = ((gy % period) + period) % period
      const r = hash2(wx, wy, seed)
      // Position the point in *unwrapped* space for a continuous distance.
      const dx = gx + r[0] - fx
      const dy = gy + r[1] - fy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < f1) f1 = d
    }
  }
  return f1
}

// fBm of periodic Worley F1, doubling the period each octave (stays seamless).
function fbmWorley(u: number, v: number, basePeriod: number, octaves: number, seed: number): number {
  let sum = 0
  let amp = 0.5
  let period = basePeriod
  for (let o = 0; o < octaves; o++) {
    sum += amp * worleyF1(u, v, period, seed + o * 2017)
    period *= 2
    amp *= 0.5
  }
  return sum
}

// Bakes a float field (sampled per texel as a function of UV in [0,1)) into a
// greyscale RGBA DataTexture, normalising the observed range to fill [0,255] so
// the shader thresholds (step(cut, ...)) have full contrast to work with.
function bakeField(
  sample: (u: number, v: number) => number,
  size: number
): THREE.DataTexture {
  const raw = new Float32Array(size * size)
  let min = Infinity
  let max = -Infinity
  for (let y = 0; y < size; y++) {
    const v = y / size // [0,1) — seam at the wrap boundary
    for (let x = 0; x < size; x++) {
      const u = x / size
      const value = sample(u, v)
      raw[y * size + x] = value
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  const span = max - min || 1
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < raw.length; i++) {
    const g = Math.round(((raw[i] - min) / span) * 255)
    const o = i * 4
    data[o] = g
    data[o + 1] = g
    data[o + 2] = g
    data[o + 3] = 255
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.colorSpace = THREE.NoColorSpace // raw scalar noise, not colour data
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

// Caustic1 pattern_texture — broad, smooth Simplex-style noise, 2 octaves.
export function bakePatternTexture(): THREE.DataTexture {
  return bakeField(
    (u, v) => fbmPerlin(u, v, PATTERN_PERIOD, PATTERN_OCTAVES, 1),
    TEXTURE_SIZE
  )
}

// Caustic1 bubbles_texture — Voronoi cell-edge noise (F1), 4 octaves.
export function bakeBubblesTexture(): THREE.DataTexture {
  return bakeField(
    (u, v) => fbmWorley(u, v, BUBBLE_PERIOD, BUBBLE_OCTAVES, 7),
    TEXTURE_SIZE
  )
}
