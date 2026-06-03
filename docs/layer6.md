Layer 6 — Gaussian Blur
What this layer does
This is a post-process blur applied over the entire composited image. It samples the screen as it currently appears — after all five preceding layers have been rendered — and outputs a weighted average of a 7×7 neighbourhood of pixels in place of each pixel.

The primary purpose is to soften the hard binary edges produced by the step() operations in the two caustic shaders. Without this pass, the caustic lines have perfectly sharp, aliased outlines (because step() is a discontinuous function). The blur dissolves those edges into a soft glow, giving the caustics their dreamy, light-through-water quality rather than looking like geometric cutouts.

Structural position — outside the SubViewport
This is the first layer that lives outside the SubViewport render target. In the scene tree:


BackgroundPauseUI [Control]
├── SubViewportContainer          ← layers 1–5 render here
│   └── SubViewport
│       ├── TextureRect           (layer 1 — color map)
│       ├── Distortion            (layer 2 — wave warp)
│       ├── Tint                  (layer 3 — cyan tint)
│       ├── Caustic1              (layer 4 — full-screen caustics)
│       └── Caustic2              (layer 5 — top-right caustics)
├── Blur  ◄── HERE                ← sibling of SubViewportContainer
├── GradientDark
└── GradientLight
At the point the Blur node is drawn, the SCREEN_TEXTURE it captures contains the fully composited SubViewport output — the SubViewportContainer with its additive blend mode already applied. Layers 3–5 are already merged. The blur sees the final merged image, not the individual layers.

Node setup
A fullscreen rectangle (ColorRect) anchored to cover the entire viewport with layout_mode = 1 and anchors_preset = 15. Default (normal) blend mode — it writes full-opacity output (alpha = 1.0) and completely replaces what was below it. There is no transparency; it performs an in-place replacement of the screen content.

The shader
Full source (gaussian_blur.gdshader):


shader_type canvas_item;

uniform sampler2D SCREEN_TEXTURE: hint_screen_texture, repeat_disable, filter_nearest;
uniform float sigma: hint_range(0.1, 20.0) = 3.3;

float gaussianDistribution(float x, float STD) {
    return exp(-(x*x) / (2.*STD*STD)) / (sqrt(2.*PI) * STD);
}

vec3 gaussianblur(sampler2D sampler, vec2 pos, vec2 pixel_size, float sigmaUsed, int radius) {
    vec3 blurredPixel = vec3(0.0);
    float total_weight = 0.0;
    for (int i = -radius; i <= radius; i++) {
        for (int j = -radius; j <= radius; j++) {
            vec2 offset     = vec2(float(i), float(j)) * pixel_size;
            vec2 changedPos = pos + offset;
            float weight = gaussianDistribution(float(i), sigmaUsed)
                         * gaussianDistribution(float(j), sigmaUsed);
            blurredPixel  += texture(SCREEN_TEXTURE, changedPos).rgb * weight;
            total_weight  += weight;
        }
    }
    blurredPixel /= total_weight;
    return blurredPixel;
}

void fragment() {
    vec3 PixelBlurred = gaussianblur(SCREEN_TEXTURE, SCREEN_UV, SCREEN_PIXEL_SIZE, sigma, 3);
    COLOR = vec4(PixelBlurred, 1.);
}
Runtime parameter value:


sigma = 1.4
How it works, step by step
The kernel
gaussianblur() is called with radius = 3 (hardcoded). The loop runs from −3 to +3 in both X and Y — a 7 × 7 grid of 49 samples per output pixel, centered on the current pixel.

Each sample at offset (i, j) receives a weight:


weight(i, j) = G(i, σ) × G(j, σ)
where the 1D Gaussian function is:


G(x, σ) = exp(−x² / (2σ²)) / (√(2π) × σ)
This is a separable 2D Gaussian — the weight is the product of two independent 1D Gaussians evaluated at the integer offsets. With σ = 1.4, the weight profile across the 7-sample axis is:

Offset	G(offset, 1.4)	Relative weight
0	0.2852	1.000 (peak)
±1	0.2280	0.799
±2	0.1179	0.413
±3	0.0392	0.138
At offset ±3 the weight is only 14% of the centre weight — small but non-zero, which is why a radius of 3 is sufficient. Beyond radius 3 the Gaussian has dropped to near zero, so further samples would contribute negligible weight while costing GPU time.

The 2D weight at corner offset (3, 3) is 0.0392² ≈ 0.0015 — about 0.2% of the centre weight.

Normalisation
After accumulating all 49 weighted samples, the sum is divided by total_weight (the sum of all 49 weights). This ensures the output brightness is preserved exactly — no darkening, no brightening. The Gaussian weights are computed and summed at runtime rather than precomputed as constants, but since σ = 1.4 never changes, these 49 weight evaluations are effectively constant-folded by the shader compiler.

Pixel offsets

vec2 offset = vec2(float(i), float(j)) * pixel_size;
SCREEN_PIXEL_SIZE in Godot is vec2(1/viewport_width, 1/viewport_height) — the UV size of one pixel. Multiplying integer offsets by this converts them to UV-space steps that land exactly on adjacent pixel centres. On a 1920×1080 display, one step = (0.000521, 0.000926) UV units.

Final output

COLOR = vec4(PixelBlurred, 1.0);
Alpha is always 1.0. The blur fully replaces each pixel — it is not alpha-composited over the screen, it overwrites it.

The filter_nearest qualifier on SCREEN_TEXTURE means screen samples use nearest-neighbour filtering. Because every sample offset is an exact integer multiple of SCREEN_PIXEL_SIZE (always landing precisely on a pixel centre), nearest-neighbour and bilinear filtering produce identical results here. The choice is inconsequential.

Effect at σ = 1.4
The effective blur radius is approximately σ × √(2 ln 2) ≈ 1.4 × 1.18 ≈ 1.65 pixels (half-width at half-maximum). This is a very mild blur — just enough to:

Soften the single-pixel-wide aliased edges of the caustic step() outputs into smooth gradients ~2–3 px wide
Slightly blend together adjacent caustic streaks that are very close together
Give the overall image a very faint "soft glow" quality — the caustics appear to have diffuse halos rather than hard cuts
The image does not look blurry. A viewer would not consciously notice the blur; they would simply perceive the caustics as having natural soft edges rather than harsh digital ones.

How to implement this in other technologies
Option A — Port the shader directly (Three.js ShaderPass):

The port is a direct translation. Replace SCREEN_UV with vUv, SCREEN_PIXEL_SIZE with 1.0 / resolution passed as a vec2 uniform, and SCREEN_TEXTURE with the previous render target texture:


uniform sampler2D previousPass;
uniform vec2 resolution;   // e.g. vec2(1920, 1080)
uniform float sigma;       // 1.4

varying vec2 vUv;

float G(float x, float s) {
    return exp(-(x*x) / (2.0*s*s)) / (sqrt(2.0*3.14159265) * s);
}

void main() {
    vec2 pixelSize = 1.0 / resolution;
    vec3 result = vec3(0.0);
    float totalWeight = 0.0;
    for (int i = -3; i <= 3; i++) {
        for (int j = -3; j <= 3; j++) {
            vec2 offset = vec2(float(i), float(j)) * pixelSize;
            float w = G(float(i), sigma) * G(float(j), sigma);
            result      += texture2D(previousPass, vUv + offset).rgb * w;
            totalWeight += w;
        }
    }
    gl_FragColor = vec4(result / totalWeight, 1.0);
}
Option B — Two-pass separated Gaussian (more efficient):

A 2D Gaussian is separable: applying a 1D horizontal blur followed by a 1D vertical blur produces exactly the same result as the 2D kernel, at 2×7 = 14 samples instead of 7×7 = 49. For a background layer rendered once per frame this is not a critical optimisation, but it is the standard approach in production:

Render previous layers → RenderTargetA
Horizontal 1D Gaussian pass: read RenderTargetA, write RenderTargetB
Vertical 1D Gaussian pass: read RenderTargetB, write to final output
Each 1D pass samples at offsets (±1, 0)×pixelSize and (0, ±1)×pixelSize respectively, with the same Gaussian weights as above.

Option C — Three.js EffectComposer built-in passes:

Three.js's UnrealBloomPass adds bloom (not a pure blur). For a clean Gaussian, use a custom ShaderPass with the shader above, or the HorizontalBlurShader + VerticalBlurShader from three/examples/jsm/shaders/. Set their h and v parameters to sigma / viewport_height (and width) to match the softness at σ=1.4.

Placement in the render pipeline:

This pass reads the fully composited output of all five previous layers. In a multi-pass Three.js setup, it should be the first pass that operates on the merged render target — after Caustic1 and Caustic2 have both been additively composited onto the tinted, distorted base. Do not apply it between caustic layers; it must see the combined result.