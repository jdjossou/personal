Layer 4 — Caustic1 Full-Screen Layer
What this layer does
This is the primary animated layer. It generates glowing teal caustic lines and floating bubble outlines using only math and noise — no pre-rendered animation frames. It renders as a fullscreen additive overlay: where it produces non-zero output, it brightens the underlying tinted background. Where it produces zero, the layer is invisible and the background shows through unmodified.

The effect is divided into two interleaved visual elements running in the same shader pass:

Caustic lines — thin bright streaks that look like light refracted through moving water, confined to the upper region of the screen by a hand-painted mask.
Bubble outlines — circular cell edges from Voronoi noise that appear where caustics are absent, drifting upward at a different speed.
Node setup
A fullscreen rectangle (ColorRect) inside the SubViewport render target, with one critical difference from the previous layers: offset_bottom = -162.0. With anchors_preset = 15 (full-screen anchor), this trims the bottom edge 162 pixels upward, so the rect only covers the top 918 of 1080 pixels. Combined with the mask texture that blacks out the bottom half anyway, no caustics ever appear in the lower ~15–50% of the screen.

Blend mode: blend_add (declared in the shader's render_mode). This layer only adds brightness — it can never darken the image.

All inputs
Uniform	Value / Source	Type
pattern_texture	NoiseTexture2D — Simplex, 2 octaves, default frequency (~0.01), seamless	Scrolling greyscale noise
pattern_mask_texture	caustic_1_mask.png — 1024×512, hand-painted landscape horizon	Static greyscale mask
bubbles_texture	NoiseTexture2D — Voronoi, 4 octaves, frequency 0.0222, seamless	Scrolling cell noise
bubbles_mask_texture	GradientTexture2D — vertical greyscale gradient	Procedural 2D gradient
color	(0.331, 0.929, 0.919, 0.255) — bright teal, 25.5% alpha	vec4 uniform
velocity_main	(0, −0.07) — moves upward	vec2 uniform
velocity_second	(0, +0.10) — moves downward	vec2 uniform
velocity_bubbles	(0, +0.13) — moves downward faster	vec2 uniform
scale_main	(0.5, 0.5) — zoomed in 2×	vec2 uniform
scale_second	(1.0, 4.0) — stretched 4× vertically	vec2 uniform
scale_bubbles	(1.6, 0.9) — wide and slightly compressed	vec2 uniform
cut	0.79	float uniform
updates_per_second	6	int uniform
The shader
Full source (bubbles_caustics_canvas.gdshader):


shader_type canvas_item;
render_mode unshaded, blend_add;

#define USE_ANTIPATTERN

uniform sampler2D SCREEN_TEXTURE : hint_screen_texture, repeat_disable;

uniform sampler2D pattern_texture: repeat_enable;
uniform sampler2D pattern_mask_texture: repeat_enable;
uniform sampler2D bubbles_texture: repeat_enable;
uniform sampler2D bubbles_mask_texture: repeat_enable;

uniform vec4 color: source_color;
uniform vec2 velocity_main    = vec2(0.0, 0.04);
uniform vec2 velocity_second  = vec2(0.0, 0.04);
uniform vec2 velocity_bubbles = vec2(0.0, 0.04);
uniform vec2 scale_main    = vec2(1.0);
uniform vec2 scale_second  = vec2(1.0);
uniform vec2 scale_bubbles = vec2(1.0);
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

    float bubbles = texture(bubbles_texture,
        scale_bubbles * UV + 0.5
        + velocity_bubbles * floor(TIME * float(updates_per_second)) / float(updates_per_second)
    ).r;

    float pattern_mask  = texture(pattern_mask_texture,  UV).r;
    float bubbles_mask  = texture(bubbles_mask_texture,  UV).r;

    float pattern    = step(cut,       pattern_mask - abs(pattern_1 - pattern_2));
    float b_pattern_1 = step(cut,      bubbles - pattern - bubbles_mask);
    float b_pattern_2 = step(1.0 - cut, pattern - bubbles);

    COLOR.a   = (b_pattern_1 + b_pattern_2) * color.a;
    COLOR.rgb = color.rgb;
}
Note: SCREEN_TEXTURE is declared but never read in the fragment function — it is an unused leftover. The shader operates entirely from UV-space noise sampling.

How it works, step by step
Discrete time stepping
All three noise samples share the same time quantisation:


floor(TIME * 6.0) / 6.0
TIME normally advances continuously at the display framerate. This expression snaps it to the nearest multiple of 1/6 second — it steps forward in increments of ~167ms rather than every frame. The animation updates at exactly 6 discrete frames per second regardless of the display framerate. This is what gives P3R's caustics their characteristic choppy, almost print-like quality instead of smooth fluid motion.

The three noise samples
pattern_1 — Simplex noise at half scale (0.5, 0.5), scrolling upward at (0, −0.07) UV/sec:


texture(pattern_texture, 0.5 * UV + (0, -0.07) * steppedTime).r
Simplex at lower frequency with only 2 octaves produces broad, smooth hills and valleys. Half-scale means the noise tiles are large — each hill covers roughly half the screen height.

pattern_2 — same Simplex texture, different transform: scale (1.0, 4.0), offset + 0.5, scrolling downward at (0, +0.10):


texture(pattern_texture, vec2(1, 4) * UV + 0.5 + (0, 0.1) * steppedTime).r
The + 0.5 UV offset ensures this sample reads from a completely different region of the noise texture than pattern_1 (it starts half a tile away). The 4× vertical stretch makes the noise features long and thin — tall vertical smears. It scrolls in the opposite direction to pattern_1.

bubbles — Voronoi noise at scale (1.6, 0.9), offset + 0.5, scrolling downward at (0, +0.13):


texture(bubbles_texture, vec2(1.6, 0.9) * UV + 0.5 + (0, 0.13) * steppedTime).r
Voronoi noise naturally produces cell boundaries — bright lines separating irregular polygonal regions — which look like bubble walls or soap film edges. 4 octaves gives the cells a slightly turbulent, organic character. It scrolls downward slightly faster than pattern_2.

The two static masks
pattern_mask — samples caustic_1_mask.png at the raw UV (no scale, no scroll):

The top half of this texture is bright (the "sky"), the bottom half is black (the "ground"), separated by an irregular painted horizon. Its red channel acts as a spatial gate: caustic pattern can only appear where this value is high. Where the mask is black (below the horizon), the caustic output is forced to zero regardless of what the noise looks like.

bubbles_mask — samples the procedural GradientTexture2D at UV:

This is a vertical greyscale gradient baked from four stops:

UV.y	Value
0.000 (top)	0.389 (medium grey)
0.278	0.000 (black)
0.763	0.000 (black)
1.000 (bottom)	0.252 (dark grey)
The broad black mid-section means the bubble contribution is suppressed across the majority of the screen. Only the uppermost ~28% and the lowermost ~24% allow bubbles through, and even there the mask value is below 0.39 — a relatively gentle allow.

The three step() operations
pattern — caustic lines:


float pattern = step(0.79, pattern_mask - abs(pattern_1 - pattern_2));
abs(pattern_1 - pattern_2) measures how different the two noise layers are at this pixel. Where they are nearly identical the difference is small (near 0); where they diverge the difference is large (near 1).

pattern_mask - abs(...): subtract that difference from the mask brightness. The result is high only where two conditions are simultaneously true: the mask is bright (we are in the "sky" region above the horizon) AND the two noise layers nearly agree (their values are close).

step(0.79, ...): with cut=0.79, only pixels where the combined value reaches 0.79 or above fire. Because the mask tops out at ~1.0 and the difference must be at most 0.21 to pass, this creates narrow bands where the scrolling noise layers converge — the visual equivalent of caustic light lines.

b_pattern_1 — bubble outlines:


float b_pattern_1 = step(0.79, bubbles - pattern - bubbles_mask);
bubbles - pattern - bubbles_mask: subtract the caustic value and the suppression mask from the Voronoi brightness. This fires where: Voronoi cell walls are bright AND no caustic is already lit at that pixel AND the spatial mask permits it.

Because pattern is already binary (0 or 1), subtracting it means bubble outlines only appear in the gaps between caustic lines, not on top of them. The bubbles fill the negative space of the caustic pattern.

b_pattern_2 — caustic-dominance lines:


float b_pattern_2 = step(0.21, pattern - bubbles);
1.0 - cut = 0.21. This fires where the caustic line value exceeds the Voronoi bubble value by at least 0.21. Since pattern is binary (0 or 1):

When pattern = 0: 0 - bubbles ≤ 0 → never passes 0.21 → b_pattern_2 = 0
When pattern = 1: 1 - bubbles > 0.21 when bubbles < 0.79 → fires in most caustic-lit pixels
This guarantees caustic lines are bright even in regions where the Voronoi noise is moderately high, preventing the Voronoi from suppressing them.

Final output

COLOR.a   = (b_pattern_1 + b_pattern_2) * color.a;
COLOR.rgb = color.rgb;
Both b_pattern_1 and b_pattern_2 are binary (0 or 1), so their sum is 0, 1, or 2. Multiplied by color.a = 0.255:

0 → pixel is fully transparent, background shows through
1 → alpha = 0.255 (25.5% opacity) — one source fired
2 → alpha = 0.510 (51%) — both fired simultaneously (caustic AND bubble edge at same pixel)
COLOR.rgb is always the uniform teal (0.331, 0.929, 0.919), regardless of which source fired. Since blend mode is additive, the actual contribution to the frame is:


added brightness = (0.331, 0.929, 0.919) × (0, 0.255, or 0.510)
Teal brightens are added to the cyan-tinted background, creating the characteristic glowing white-teal caustic streaks.

Visual character summary
Element	Source	Motion	Where visible
Caustic lines	Simplex noise convergence zones	Main moves up, second moves down	Above the landscape horizon in caustic_1_mask
Bubble outlines	Voronoi cell walls	Moves downward at 0.13 UV/sec	Top ~28% and bottom ~24% of screen only
Both simultaneously	Caustic AND bubble overlap	—	Brighter, ~51% alpha at overlap
All motion is discrete at 6fps. The opposing directions of velocity_main and velocity_second mean the caustic pattern is constantly evolving — as the two noise layers slide past each other in opposite directions, their agreement zones (the caustic lines) shift and flicker frame by frame.

How to implement this in other technologies
In GLSL (Three.js ShaderMaterial, additive blending):

The shader ports almost verbatim. Key substitutions:

UV → vUv (mesh UV, [0,1]²)
TIME → time uniform, stepped as floor(time * 6.0) / 6.0 before use
hint_screen_texture → unused here, omit it
render_mode blend_add → set blending: THREE.AdditiveBlending on the ShaderMaterial

// fragment shader
uniform sampler2D patternTexture;
uniform sampler2D patternMaskTexture;
uniform sampler2D bubblesTexture;
uniform sampler2D bubblesMaskTexture;

uniform vec4  color;           // (0.331, 0.929, 0.919, 0.255)
uniform vec2  velocityMain;    // (0, -0.07)
uniform vec2  velocitySecond;  // (0,  0.10)
uniform vec2  velocityBubbles; // (0,  0.13)
uniform vec2  scaleMain;       // (0.5, 0.5)
uniform vec2  scaleSecond;     // (1.0, 4.0)
uniform vec2  scaleBubbles;    // (1.6, 0.9)
uniform float cut;             // 0.79
uniform float time;            // clock.elapsedTime, stepped externally

varying vec2 vUv;

void main() {
    float t = floor(time * 6.0) / 6.0;

    float p1      = texture2D(patternTexture, scaleMain    * vUv             + velocityMain    * t).r;
    float p2      = texture2D(patternTexture, scaleSecond  * vUv + 0.5       + velocitySecond  * t).r;
    float bubbles = texture2D(bubblesTexture, scaleBubbles * vUv + 0.5       + velocityBubbles * t).r;

    float patternMask = texture2D(patternMaskTexture, vUv).r;
    float bubblesMask = texture2D(bubblesMaskTexture, vUv).r;

    float pattern    = step(cut,         patternMask - abs(p1 - p2));
    float bPattern1  = step(cut,         bubbles - pattern - bubblesMask);
    float bPattern2  = step(1.0 - cut,   pattern - bubbles);

    float alpha = (bPattern1 + bPattern2) * color.a;
    gl_FragColor = vec4(color.rgb, alpha);
}
Noise textures:

patternTexture — Generate a seamless 1024×1024 greyscale texture of 2D Simplex noise. Any glsl-noise Simplex implementation works. Bake to a THREE.DataTexture with wrapS = wrapT = RepeatWrapping, minFilter = LinearFilter. Low frequency, 2 octaves, high smoothness.
bubblesTexture — Generate a seamless 1024×1024 greyscale texture of Voronoi / Worley noise. Libraries like fast-simplex-noise do not include Voronoi; use a CPU-side Worley noise generator or a GPU bake pass. 4 octaves, frequency 0.0222. RepeatWrapping.
Static mask textures:

patternMaskTexture — use caustic_1_mask.png directly from the Godot project (custom, no Atlus IP). ClampToEdgeWrapping.
bubblesMaskTexture — generate with a <canvas> gradient: create a 2×256 canvas, fill with a CanvasGradient from top to bottom: grey(0.389) at y=0, black at y=28%, black at y=76%, grey(0.252) at y=100%. Wrap in a THREE.CanvasTexture. ClampToEdgeWrapping.
Mesh placement:

Use a PlaneGeometry(2, 2) fullscreen quad in an orthographic camera setup, positioned at z=0. To replicate the offset_bottom = -162 crop (the bottom 15% is inactive), either:

Scale the quad vertically: mesh.scale.y = 918/1080 and shift it up slightly, or
Simply let the mask texture handle it (since caustic_1_mask.png already blacks out the lower region, the crop is cosmetic).
#define USE_ANTIPATTERN:

This #define is declared in the shader source but never referenced in the fragment body — there is no #ifdef USE_ANTIPATTERN block. It is either a leftover from an earlier version or a stub for a feature that was never implemented. Ignore it in the port.