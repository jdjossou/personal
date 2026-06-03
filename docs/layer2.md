Layer 2 — Sine Distortion
What this layer does
This is the second layer inside the off-screen render target, drawn immediately after the color-mapped background. It reads the pixels that have already been rendered to the screen so far (i.e. the output of Layer 1) and resamples them with a displaced UV coordinate, creating a slow, gentle wave warp. The visual result is that the blue background appears to undulate as if seen through a gently moving water surface.

Critically, this layer does not produce its own color — it only repositions existing pixels. It is a pure distortion pass.

Node / element setup
A fullscreen rectangle (ColorRect in Godot, fullscreen quad in WebGL) anchored to cover the entire 1920 × 1080 render target. It carries the distortion shader as its material. No input texture is manually assigned — the shader reads whatever has already been drawn to the screen behind it via a special hint_screen_texture sampler.

The distortion shader
Full source (distortion.gdshader):


shader_type canvas_item;

uniform float amplitude  = 0.1;
uniform float speed      = 10.0;
uniform float wave_length = 2.0;
uniform sampler2D screen_texture: hint_screen_texture;

void fragment() {
    vec2 scaled_uv = vec2(amplitude) + SCREEN_UV * (1.0 - amplitude * 2.);
    vec4 color = texture(screen_texture, scaled_uv + vec2(0.0, sin(SCREEN_UV.x / wave_length + TIME * speed)) * amplitude);
    COLOR = color;
}
Runtime parameter values (set in background_pause_ui.tscn):


amplitude   = 0.02
speed       = 0.5
wave_length = 0.08
How it works, step by step
Step 1 — Inset the sampling area

vec2 scaled_uv = vec2(amplitude) + SCREEN_UV * (1.0 - amplitude * 2.0);
SCREEN_UV runs from (0,0) at the top-left to (1,1) at the bottom-right. This line remaps it to run from (amplitude, amplitude) to (1−amplitude, 1−amplitude).

With amplitude = 0.02 this means the readable UV range shrinks from [0, 1] to [0.02, 0.98] on both axes, leaving a 2% inset border on all four sides.

The reason: step 2 is about to add a displacement of up to ±amplitude to the Y coordinate. If the base UV started at 0.0, a negative displacement would go below 0.0 and sample off the edge of the texture. The inset pre-compensates exactly: the max possible displaced coordinate is 0.98 + 0.02 = 1.00 and the min is 0.02 − 0.02 = 0.00 — perfectly clamped to the valid range without needing an explicit clamp() call. The inset and the amplitude are the same value by design.

Step 2 — Compute the wave offset

sin(SCREEN_UV.x / wave_length + TIME * speed) * amplitude
Breaking this down with the runtime values:

Wave argument: SCREEN_UV.x / 0.08 + TIME * 0.5

SCREEN_UV.x / 0.08 ranges from 0 to 12.5 radians as X goes left to right. Since one full sine cycle is 2π ≈ 6.28 rad, this gives 12.5 / 6.28 ≈ 2 complete wave cycles visible across the full width of the screen — two broad, widely-spaced ripples.
TIME * 0.5 increments the phase at 0.5 rad/sec. This causes the waves to travel horizontally — specifically leftward — at a slow pace. A complete left-pass of one wave period takes 2π / 0.5 ≈ 12.6 seconds.
Wave output: sin(...) produces a value in [−1, 1], which is then multiplied by amplitude = 0.02, giving a displacement of at most ±0.02 in UV space (≈ ±21 pixels on a 1080p screen).

Step 3 — Apply the displacement in Y only

scaled_uv + vec2(0.0, sin(...) * amplitude)
The displacement vector is (0, wave) — it only affects the vertical (Y) component of the sample coordinate. The horizontal position of each pixel is unchanged.

What this means visually: every vertical column of pixels at a given X position gets shifted up or down by the same fixed amount, determined by the sine wave at that X. Adjacent columns have slightly different Y offsets, producing a continuous horizontal wave. The wave crests are vertical bands that travel horizontally.

This is the same distortion pattern you see when looking at a flat surface through a gently rippling water surface from directly above — continuous horizontal undulations with no vertical variation within each column.

Step 4 — Read and output the displaced pixel

vec4 color = texture(screen_texture, displaced_uv);
COLOR = color;
screen_texture with hint_screen_texture (Godot) or the equivalent RenderTarget.texture in Three.js captures whatever was previously drawn — in this case, the color-mapped background from Layer 1. The shader simply reads that texture at the displaced coordinate and outputs it.

No blending math, no color modification — pure UV warp.

Parameter sensitivity
Parameter	Value	Effect of increasing	Effect of decreasing
amplitude	0.02	Larger, more violent warp; pixels skew noticeably	Flatter, barely perceptible shimmer
speed	0.5	Waves travel faster horizontally	Waves nearly frozen
wave_length	0.08	Fewer cycles across screen → bigger, slower-looking waves	More cycles → fine, tight ripples
At the current values (amplitude 0.02, 2 cycles wide, speed 0.5), the effect is extremely subtle — just enough to break the static feel of the background without making it distracting.

How to implement this in other technologies
In GLSL (Three.js ShaderMaterial / ShaderPass):

The port is almost identical. Replace SCREEN_UV with vUv and screen_texture with the previous render target's texture:


uniform sampler2D previousPass;  // output of Layer 1 render target
uniform float amplitude;         // 0.02
uniform float speed;             // 0.5
uniform float waveLenth;         // 0.08
uniform float time;              // updated each frame: clock.elapsedTime

varying vec2 vUv;

void main() {
    vec2 scaledUv = vec2(amplitude) + vUv * (1.0 - amplitude * 2.0);
    float wave = sin(vUv.x / waveLenth + time * speed) * amplitude;
    vec4 color = texture2D(previousPass, scaledUv + vec2(0.0, wave));
    gl_FragColor = color;
}
Rendering setup:

This should be implemented as a screen-space post-process pass over the Layer 1 output — not as a Three.js object in a scene. The cleanest approach:

Render Layer 1 into RenderTargetA.
Use a fullscreen quad ShaderMaterial that reads from RenderTargetA.texture and writes to RenderTargetB (or directly to the screen if there are no more render-target passes before the next layer that needs screen capture).
In Three.js EffectComposer terms, this would be a custom ShaderPass. However, because later layers also read from the screen texture (they use hint_screen_texture too), the cleanest architecture is a manual multi-pass loop using two ping-pong WebGLRenderTargets — read from one, write to the other, swap.

Important — SCREEN_UV vs vUv:

In Godot, SCREEN_UV refers to the pixel's position on the physical screen, not the UV of the mesh. For a fullscreen quad, these are the same thing. In Three.js, vUv on a fullscreen PlaneGeometry is also [0,1]². The substitution is direct with no remapping needed.

Time stepping:

This layer uses raw TIME (smooth, continuous). Unlike the caustic layers, it does not use the discrete floor(TIME * updates_per_second) stepping. The wave animates continuously and smoothly every frame — pass clock.elapsedTime directly as the time uniform.