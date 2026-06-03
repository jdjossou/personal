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
