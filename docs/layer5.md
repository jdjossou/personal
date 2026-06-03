Layer 5 — Caustic2 Top-Right Layer
What this layer does
This is the second caustic layer, but unlike Caustic1 it does not cover the entire screen. It is a fixed-size panel positioned in the upper-right quadrant of the frame, overlapping the top edge slightly. Its job is to add a second, visually distinct caustic character to that corner — broader, denser bands with faster motion — which creates the impression that the light intensity and pattern vary across the water surface.

The algorithm is a simplified version of Caustic1: same dual-noise convergence technique, but with no bubble system, a denser threshold, a brighter output, and a lower-frequency noise that produces much larger-scale features.

Node geometry
Anchor mode: anchors_preset = 1 — top-right corner. Both horizontal anchors are pinned to the right edge of the parent (1920px). The offsets then position the rect relative to that edge:


offset_left   = -688   →  left edge at  1920 - 688  = 1232px
offset_right  = -176   →  right edge at 1920 - 176  = 1744px
offset_top    =  -16   →  top edge at      0 - 16   = -16px  (clips 16px above screen)
offset_bottom =  496   →  bottom edge at   0 + 496  = 496px
The rect is 512 × 512 px on the 1920×1080 canvas, placed with its right edge 176px from the right border of the screen. The top 16px are clipped above the visible area — a slight overhang that prevents a hard visible seam at the top of the caustic panel.

UV inside the shader runs (0,0) → (1,1) over this 512×512 area, not over the full screen. Every texture sample and mask lookup is local to the panel, not screen-relative.

All inputs
Uniform	Value / Source	Type
pattern_texture	NoiseTexture2D — Perlin (type 3), 4 octaves, frequency 0.0023, lacunarity 2.1, 1024×1024, seamless	Scrolling greyscale noise
mask_texture	caustic_2_mask.png — 512×512, hand-painted / photographed underwater caustic bands	Static greyscale mask
color	(0.587, 0.888, 0.939, 0.471) — light ice-blue, 47.1% alpha	vec4 uniform
velocity_main	(0, −0.10) — moves upward	vec2 uniform
velocity_second	(0, +0.25) — moves downward, fast	vec2 uniform
scale_main	(1.0, 1.0) — unscaled	vec2 uniform
scale_second	(1.0, 2.0) — stretched 2× vertically	vec2 uniform
cut	0.48	float uniform
updates_per_second	6	int uniform
The shader
Full source (caustics_canvas.gdshader):


shader_type canvas_item;
render_mode unshaded, blend_add;

#define USE_ANTIPATTERN

uniform sampler2D SCREEN_TEXTURE : hint_screen_texture, filter_nearest, repeat_disable;

uniform sampler2D pattern_texture: repeat_enable;
uniform sampler2D mask_texture: repeat_enable;

uniform vec4 color: source_color;
uniform vec2 velocity_main   = vec2(0.0, 0.04);
uniform vec2 velocity_second = vec2(0.0, 0.04);
uniform vec2 scale_main   = vec2(1.0);
uniform vec2 scale_second = vec2(1.0);
uniform float cut: hint_range(0.0, 1.0, 0.01) = 0.5;
uniform int updates_per_second = 1;

void fragment() {
    float pattern_1 = texture(pattern_texture,
        scale_main * UV
        + velocity_main * floor(TIME * float(updates_per_second)) / float(updates_per_second)
    ).r;

    float pattern_2 = texture(pattern_texture,
        scale_second * UV + 0.5
        + velocity_second * floor(TIME * float(updates_per_second)) / float(updates_per_second)
    ).r;

    float mask = texture(mask_texture, UV).r;

    float pattern = step(cut, mask - abs(pattern_1 - pattern_2));
    COLOR.a   = pattern * color.a;

    //if (use_antipattern) {
    //    float antipattern = step(1.0 - cut, abs(pattern_1 - pattern_2) - mask);
    //    COLOR.a = (pattern + antipattern) * color.a;
    //} else {
    //    COLOR.a = pattern * color.a;
    //}

    COLOR.rgb = color.rgb;
}
SCREEN_TEXTURE is declared but never read — same unused leftover as in Caustic1. The #define USE_ANTIPATTERN is also declared but never checked (see the commented-out section below).

How it works, step by step
Discrete time stepping
Identical to Caustic1:


float t = floor(TIME * 6.0) / 6.0;
Animation advances at 6 discrete frames per second, not per display frame.

The two noise samples
Both samples draw from the same noise texture but with different transforms, reading opposite regions that scroll in opposite directions:

pattern_1 — Perlin noise at scale (1, 1), scrolling upward at (0, −0.10) UV/sec:


texture(patternTex, UV + (0, -0.10) * t).r
At scale (1,1) and noise frequency 0.0023, the noise features are very large relative to the 512px panel. A single noise "hill" can span nearly the entire panel in both axes. This produces very broad, gradual brightness transitions — more like slow atmospheric light patches than fine grain.

pattern_2 — same texture, scale (1, 2), offset + 0.5, scrolling downward at (0, +0.25) UV/sec:


texture(patternTex, vec2(1, 2) * UV + 0.5 + (0, 0.25) * t).r
The + 0.5 UV bias ensures this sample starts in a different region of the noise tile, so pattern_1 and pattern_2 have no initial correlation. The 2× vertical stretch narrows the features in Y, making this sample produce tall, vertically-elongated bands. It also moves 2.5× faster downward than pattern_1 moves upward.

The opposing directions mean the two noise layers slide past each other constantly, their agreement zones shifting and drifting with every 6fps tick.

The mask
caustic_2_mask.png (512×512) is a hand-painted or photographed greyscale map of underwater caustic light bands — horizontal bright streaks of varying width and intensity, with dark borders between them. Unlike caustic_1_mask.png (which was a simple landscape horizon shape), this mask already looks like caustics. Its bright zones define where the animated pattern can appear, and its dark zones permanently suppress output. The result is that the shader's caustic lines are already structurally "shaped" by the mask's band layout, and only the animation (the noise scrolling) makes them shimmer and shift.

UV for the mask sample is the raw panel UV — no scroll, no scale. The mask is static.

The step() — one operation, no bubbles

float pattern = step(0.48, mask - abs(pattern_1 - pattern_2));
COLOR.a = pattern * color.a;
The logic is identical to the pattern computation in Caustic1:

abs(pattern_1 - pattern_2) — convergence metric. Small when the two noises agree, large when they diverge.

mask - abs(...) — clamps output to bright regions of the mask, further restricted to where the noises are similar.

step(0.48, ...) — fires where the combined value ≥ 0.48.

Critical difference from Caustic1: cut = 0.48 vs Caustic1's 0.79. With the threshold set near 50%, roughly half the pixels where the mask allows it will pass. Compare to Caustic1's 79% threshold which produces sparse, narrow lines. Caustic2 produces wide, blotchy, overlapping caustic bands — a denser fill rather than fine streaks.

Output is purely binary: pattern is 0 or 1. No bubble system, no secondary pattern — just the caustic gate.

Output brightness

COLOR.a   = pattern * 0.471;
COLOR.rgb = (0.587, 0.888, 0.939);
Where the pattern fires, alpha = 0.471. This is nearly double Caustic1's single-source alpha of 0.255. Since blend mode is additive, the per-pixel contribution to the frame is:


(0.587, 0.888, 0.939) × 0.471 ≈ (0.277, 0.418, 0.442)
Caustic2 adds noticeably more brightness per pixel than Caustic1. In the top-right region where both layers overlap, their additive contributions combine — Caustic2's wide bright bands underneath, Caustic1's narrower streaks on top.

The commented-out antipattern
The shader contains this dead code:


//float antipattern = step(1.0 - cut, abs(pattern_1 - pattern_2) - mask);
//COLOR.a = (pattern + antipattern) * color.a;
With cut = 0.48, 1.0 - cut = 0.52. The antipattern would fire where abs(p1 - p2) - mask > 0.52 — i.e., where the two noises diverge strongly AND the mask is dark. This is the spatial complement of the caustic pattern: it would light up the dark gaps and borders between the caustic bands, inverting the mask's role.

#define USE_ANTIPATTERN is declared at the top of the file but never tested with #ifdef in any live code path — the only reference is inside the commented block. This feature was designed, partially implemented, and then disabled. It would have produced a "double exposure" effect where both the bright peaks and the dark troughs of the mask contribute light. It is safe to ignore in a port.

Comparison with Caustic1
Property	Caustic1	Caustic2
Shader	bubbles_caustics_canvas	caustics_canvas
Coverage	Full screen (cropped -162px bottom)	512×512 panel, top-right
UV space	Screen-relative	Panel-relative
Noise type	Simplex (2 oct) + Voronoi (4 oct)	Perlin (4 oct) only
Noise frequency	~0.01 (Simplex default)	0.0023 (much lower)
Has bubbles	Yes	No
cut threshold	0.79 (sparse)	0.48 (dense)
Max alpha	0.510 (when both fire)	0.471
Mask	Landscape horizon silhouette	Painted caustic bands
Velocity range	−0.07 to +0.13	−0.10 to +0.25
How to implement this in other technologies
In GLSL (Three.js ShaderMaterial, additive blending):

The port is simpler than Caustic1 — no bubble system, single step(), same dual-noise pattern:


uniform sampler2D patternTexture;
uniform sampler2D maskTexture;

uniform vec4  color;          // (0.587, 0.888, 0.939, 0.471)
uniform vec2  velocityMain;   // (0, -0.10)
uniform vec2  velocitySecond; // (0,  0.25)
uniform vec2  scaleMain;      // (1.0, 1.0)
uniform vec2  scaleSecond;    // (1.0, 2.0)
uniform float cut;            // 0.48
uniform float time;

varying vec2 vUv;

void main() {
    float t  = floor(time * 6.0) / 6.0;

    float p1   = texture2D(patternTexture, scaleMain   * vUv             + velocityMain   * t).r;
    float p2   = texture2D(patternTexture, scaleSecond * vUv + 0.5       + velocitySecond * t).r;
    float mask = texture2D(maskTexture,    vUv).r;

    float pattern = step(cut, mask - abs(p1 - p2));
    gl_FragColor  = vec4(color.rgb, pattern * color.a);
}
Noise texture:

Perlin noise, 1024×1024, frequency 0.0023, 4 octaves, lacunarity 2.1, seamless. Because the frequency is so low, the actual features visible inside the 512px UV space will be extremely large — a single noise hill may fill the panel. This is intentional; it gives Caustic2 its distinctive thick-band look. Any standard CPU Perlin noise generator works; bake to a THREE.DataTexture with RepeatWrapping.

Mask texture:

Use caustic_2_mask.png directly from the Godot project (custom asset, no Atlus IP). Alternatively, bake a procedural replacement: render several frames of a standalone caustic simulation (many implementations exist in GLSL, e.g. Shadertoy-style abs(sin(...)) approximations) and use one frame as a static grayscale PNG. The exact look will differ but the role is the same. ClampToEdgeWrapping.

Mesh positioning:

This layer is not a fullscreen quad. It is a 512×512 region anchored to the upper-right of the viewport. In Three.js with an orthographic camera sized to the viewport, position the mesh so its right edge sits 176px from the right of the viewport and its top edge sits 16px above the top of the viewport (or flush with the top — the 16px overhang is cosmetic). In NDC coordinates on a 1920×1080 viewport:


right  edge x = 1.0 - (176/960)  ≈  +0.817
left   edge x = right - (512/960) ≈  +0.283
top    edge y = 1.0 + (16/540)   ≈  +1.030  (slightly above frustum)
bottom edge y = top - (512/540)   ≈  +0.082
vUv on this quad naturally runs (0,0) → (1,1) over the 512×512 area, matching the Godot behaviour exactly.