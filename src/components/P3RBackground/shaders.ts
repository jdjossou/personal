// Shared passthrough vertex shader for fullscreen-quad passes.
export const fullscreenVert = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Layer 1 — color mapping. There is no live 3D scene to feed the shader, so we
// generate the "input image" procedurally as low-contrast FBM noise, remap it
// into a luminance range of ~0.05–0.4, and use that scalar to look up a color
// in the 1D blue gradient (uGradient). This reproduces the navy↔electric-blue
// variation the Godot version gets from scene depth.
export const colorMapFrag = /* glsl */ `
  precision highp float;

  uniform sampler2D uGradient;
  uniform float uAspect;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * vnoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-correct so noise cells stay square regardless of viewport.
    vec2 p = vUv * 3.0;
    p.x *= uAspect;

    float luma = 0.05 + fbm(p) * 0.35;
    gl_FragColor = texture2D(uGradient, vec2(luma, 0.0));
  }
`

// Layer 2 — sine distortion. Pure UV warp: resamples the previous pass with a
// Y-only displacement driven by a slow horizontal sine wave. Produces no color
// of its own. Ported from distortion.gdshader (docs/layer2.md).
export const distortionFrag = /* glsl */ `
  precision highp float;

  uniform sampler2D uPreviousPass;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uWaveLength;

  varying vec2 vUv;

  void main() {
    // Inset the readable area by uAmplitude on all sides so the Y displacement
    // below can never sample off-edge (no clamp() needed — see docs/layer2.md).
    vec2 scaledUv = vec2(uAmplitude) + vUv * (1.0 - uAmplitude * 2.0);
    float wave = sin(vUv.x / uWaveLength + uTime * uSpeed) * uAmplitude;
    gl_FragColor = texture2D(uPreviousPass, scaledUv + vec2(0.0, wave));
  }
`

// Layer 4 — Caustic1. The primary animated layer: glowing teal caustic streaks
// plus Voronoi "bubble" outlines, composited additively over the tinted base.
// Ported from bubbles_caustics_canvas.gdshader (docs/layer4.md).
//
// Two transforms of the same scrolling Simplex pattern are differenced — the
// pixels where they nearly agree (abs small) inside the "sky" mask become the
// caustic lines. The Voronoi map fills the gaps with bubble outlines, gated by a
// vertical mask. All three samples share a 6 fps discrete time step
// (floor(uTime*6)/6), which gives P3R's choppy, print-like shimmer. Output is the
// flat teal colour with a binary alpha; AdditiveBlending turns it into glow.
export const caustic1Frag = /* glsl */ `
  precision highp float;

  uniform sampler2D uPatternTexture;
  uniform sampler2D uPatternMaskTexture;
  uniform sampler2D uBubblesTexture;
  uniform sampler2D uBubblesMaskTexture;

  uniform vec4 uColor;
  uniform vec2 uVelocityMain;
  uniform vec2 uVelocitySecond;
  uniform vec2 uVelocityBubbles;
  uniform vec2 uScaleMain;
  uniform vec2 uScaleSecond;
  uniform vec2 uScaleBubbles;
  uniform float uCut;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    // Snap time to 6 discrete steps/sec — the source's updates_per_second.
    float t = floor(uTime * 6.0) / 6.0;

    float p1 = texture2D(uPatternTexture, uScaleMain * vUv + uVelocityMain * t).r;
    float p2 = texture2D(uPatternTexture, uScaleSecond * vUv + 0.5 + uVelocitySecond * t).r;
    float bubbles = texture2D(uBubblesTexture, uScaleBubbles * vUv + 0.5 + uVelocityBubbles * t).r;

    float patternMask = texture2D(uPatternMaskTexture, vUv).r;
    float bubblesMask = texture2D(uBubblesMaskTexture, vUv).r;

    // Caustic lines: bright where the mask allows AND the two noise layers agree.
    float pattern = step(uCut, patternMask - abs(p1 - p2));
    // Bubble outlines: Voronoi walls in the gaps between caustics, gated by mask.
    float bPattern1 = step(uCut, bubbles - pattern - bubblesMask);
    // Keep caustic lines lit where they dominate the Voronoi value.
    float bPattern2 = step(1.0 - uCut, pattern - bubbles);

    gl_FragColor = vec4(uColor.rgb, (bPattern1 + bPattern2) * uColor.a);
  }
`
