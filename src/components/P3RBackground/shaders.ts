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

// Layer 5 — Caustic2. A simplified Caustic1: the same dual-noise convergence
// (step(cut, mask - abs(p1 - p2))) but with no bubble system, a denser threshold
// (0.48), brighter output, and a much lower-frequency Perlin noise so features are
// very large. Rendered into a 512×512 panel anchored top-right, not full-screen.
// Ported from caustics_canvas.gdshader (docs/layer5.md).
export const caustic2Frag = /* glsl */ `
  precision highp float;

  uniform sampler2D uPatternTexture;
  uniform sampler2D uMaskTexture;

  uniform vec4 uColor;
  uniform vec2 uVelocityMain;
  uniform vec2 uVelocitySecond;
  uniform vec2 uScaleMain;
  uniform vec2 uScaleSecond;
  uniform float uCut;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    // Snap time to 6 discrete steps/sec — same updates_per_second as Caustic1.
    float t = floor(uTime * 6.0) / 6.0;

    float p1 = texture2D(uPatternTexture, uScaleMain * vUv + uVelocityMain * t).r;
    float p2 = texture2D(uPatternTexture, uScaleSecond * vUv + 0.5 + uVelocitySecond * t).r;
    float mask = texture2D(uMaskTexture, vUv).r;

    // Caustic bands: bright where the painted mask allows AND the two noise
    // layers agree. Denser cut (0.48) → wide, blotchy fill, not sparse streaks.
    float pattern = step(uCut, mask - abs(p1 - p2));
    gl_FragColor = vec4(uColor.rgb, pattern * uColor.a);
  }
`

// Layer 6 — Gaussian blur. A full-screen post-process over the composited output
// of layers 1–5 (resampled from an off-screen render target). A 7×7 Gaussian
// kernel (radius 3, σ=1.4) softens the hard binary edges left by the caustics'
// step() outputs into smooth ~2–3px gradients — giving the streaks a diffuse,
// light-through-water glow instead of aliased geometric cutouts. Deliberately
// mild: the image does not read as "blurry". Direct port of gaussian_blur.gdshader
// (docs/layer6.md): SCREEN_TEXTURE -> uPreviousPass, SCREEN_PIXEL_SIZE -> 1/uResolution.
export const gaussianBlurFrag = /* glsl */ `
  precision highp float;

  uniform sampler2D uPreviousPass;
  uniform vec2 uResolution;
  uniform float uSigma;

  varying vec2 vUv;

  // 1D Gaussian weight at integer offset x. The 2D kernel is separable, so the
  // 2D weight is G(i) * G(j). (PI inlined to avoid clashing with any prelude.)
  float gaussian(float x, float sigma) {
    return exp(-(x * x) / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.141592653589793) * sigma);
  }

  void main() {
    vec2 pixelSize = 1.0 / uResolution; // UV size of one texel
    vec3 blurred = vec3(0.0);
    float totalWeight = 0.0;

    // 7x7 neighbourhood (49 samples) centred on the current pixel.
    for (int i = -3; i <= 3; i++) {
      for (int j = -3; j <= 3; j++) {
        vec2 offset = vec2(float(i), float(j)) * pixelSize;
        float weight = gaussian(float(i), uSigma) * gaussian(float(j), uSigma);
        blurred += texture2D(uPreviousPass, vUv + offset).rgb * weight;
        totalWeight += weight;
      }
    }

    // Normalise so brightness is preserved exactly (no darkening/brightening).
    gl_FragColor = vec4(blurred / totalWeight, 1.0);
  }
`

// Layer 7 — Dark gradient vignette. The first of two finishing gradient layers,
// composited over the blurred composite via standard src-over (NormalBlending).
// Static: no shader inputs, no time, no screen sampling — a pure UV-based diagonal
// gradient running bottom-right -> top-left. It anchors the composition by
// darkening the bottom-right corner to deep navy, fading to fully transparent at
// the top-left so the bright caustics higher up stand out by contrast. Direct port
// of the GradientTexture2D from docs/layer7.md (3 stops, two-phase alpha curve).
export const darkGradientFrag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    // Distance along the bottom-right -> top-left diagonal.
    // gradPos = 0 at bottom-right (vUv 1,1), gradPos = 1 at top-left (vUv 0,0).
    float t = 1.0 - (vUv.x + vUv.y) * 0.5;
    float gradPos = 1.0 - t;

    // Two-phase alpha curve matching the 3-stop gradient: a fast drop over the
    // first 7.5% of the diagonal, then a long slow fade to full transparency.
    float alpha;
    if (gradPos < 0.075) {
      alpha = mix(1.0, 0.784, gradPos / 0.075);
    } else {
      alpha = mix(0.784, 0.0, (gradPos - 0.075) / 0.925);
    }

    // Deep navy. The transparent end colour is irrelevant (alpha 0), so only this
    // opaque-corner colour matters for the visible result.
    vec3 darkNavy = vec3(0.0, 0.061, 0.429);
    gl_FragColor = vec4(darkNavy, alpha);
  }
`

// Layer 8 — Light gradient. The final layer and the additive counterpart to
// Layer 7. Same bottom-right -> top-left diagonal, but it adds a soft teal-cyan
// glow to the top-left corner instead of darkening the bottom-right. With
// AdditiveBlending it can only brighten: where transparent it has zero effect.
// The first gradient stop sits at offset 0.468, so the bottom-right ~half of the
// diagonal is fully transparent; from there the colour ramps from periwinkle blue
// toward bright teal while alpha rises 0 -> 39.2%. Output is premultiplied
// (col * alpha) to match THREE.AdditiveBlending's GL_SRC_ALPHA, GL_ONE. The blue
// transparent end only shapes the interpolation path; it adds no brightness.
// Direct port of the GradientTexture2D from docs/layer8.md (linear approximation
// of the OKLab interpolation).
export const lightGradientFrag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    // gradPos = 0 at bottom-right (vUv 1,1), gradPos = 1 at top-left (vUv 0,0).
    float gradPos = 1.0 - (vUv.x + vUv.y) * 0.5;

    // Before the first stop (offset 0.468) the gradient is fully transparent —
    // additive contribution is zero, so the whole bottom-right half is untouched.
    if (gradPos < 0.468) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Remap 0.468 -> 1.0 into 0.0 -> 1.0, then ramp both colour and alpha.
    float t = (gradPos - 0.468) / 0.532;
    float alpha = mix(0.0, 0.392, t);
    vec3 col = mix(vec3(0.282, 0.427, 0.867), vec3(0.0, 0.988, 0.949), t);

    // Premultiply for additive blending (src.rgb * src.alpha + dst.rgb).
    gl_FragColor = vec4(col * alpha, alpha);
  }
`
