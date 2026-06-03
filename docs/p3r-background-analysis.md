# Persona 3 Reload Background — Full Technical Analysis

## 1. Files Responsible for the Animated Background

| File                                              | Role                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `data/ui/pause_ui/background_pause_ui.tscn`       | Master scene — declares the entire layered rendering stack |
| `data/ui/pause_ui/background_pause_ui.gd`         | Script that drives the background at runtime               |
| `assets/shaders/caustics_canvas.gdshader`         | Caustic2: secondary caustic pattern, top-right panel       |
| `assets/shaders/bubbles_caustics_canvas.gdshader` | Caustic1: primary full-screen caustic + bubble layer       |
| `assets/shaders/distortion.gdshader`              | Wave distortion applied to the whole viewport              |
| `assets/shaders/gaussian_blur.gdshader`           | Final soft-focus pass over the composed result             |
| `assets/shaders/color_mapping.gdshader`           | Remaps game-viewport luminance to a custom blue gradient   |

## 2. Texture/Image Assets Required

| File                                 |    Dimensions | What it does                                                                                                                                                                                                                 |
| ------------------------------------ | ------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/textures/caustic_1_mask.png` |  1024×512 RGB | Landscape-horizon grayscale mask — controls **where** the Caustic1 bubbles/caustics layer is visible. White = visible, upper screen; black = hidden, lower screen; with a soft irregular horizon silhouette as the boundary. |
| `assets/textures/caustic_2_mask.png` |   512×512 RGB | Painted/photographed underwater caustic light bands — fed as the mask to Caustic2, positioned in the top-right corner. Gives the secondary caustic panel its horizontal streak character.                                    |
| `makoto_ui_texture.png`              | 1024×512 RGBA | **NOT used in the background.** Used by UI panels for in-game screenshots and character overlays.                                                                                                                            |
| `makoto_p3hero.png`                  | 1024×512 RGBA | **NOT used in the background.** 3D model preview for the character.                                                                                                                                                          |

### Procedural Runtime-Generated Noise Textures

No files on disk.

| Used by                         | Noise type                       | Frequency | Octaves |      Size |
| ------------------------------- | -------------------------------- | --------: | ------: | --------: |
| Caustic1 `pattern_texture`      | Simplex 2D                       |    0.0222 |       2 | 1920×1080 |
| Caustic1 `bubbles_texture`      | Voronoi                          |    0.0222 |       4 | 1920×1080 |
| Caustic1 `bubbles_mask_texture` | GradientTexture2D, left to right |         — |       — |        1D |
| Caustic2 `pattern_texture`      | Perlin                           |    0.0023 |       4 | 1024×1024 |

## 3. Official Persona 3 Reload / Atlus Assets

`makoto_ui_texture.png` — **YES, official Atlus asset.** It visually contains in-game screenshots from P3R, including Makoto Yuki studying at a desk, the dorm interior, and cyan UI geometry fragments. It is used for the character/UI panel, not the animated background.

`caustic_1_mask.png` — **Custom / fan-made.** It is a hand-painted grayscale mask depicting an irregular landscape horizon, possibly inspired by Iwatodai's skyline, but it is not a ripped game file. Its purpose is purely as a binary mask shape.

`caustic_2_mask.png` — **Custom / fan-made.** It looks like either a photograph of real water caustics or a hand-painted grayscale texture simulating them. It is not an official game asset.

All shaders, gradients, SVGs, and noise textures are **100% original custom work** — no Atlus content.

For your portfolio: the background effect itself requires **zero official Atlus assets**. Only `makoto_ui_texture.png` does, and it is only used in UI panels on top of the background.

## 4. Shader Parameters That Control the Look

### `caustics_canvas.gdshader` — Caustic2

```text
color:              (0.587, 0.888, 0.939) alpha 0.47   ← ice-blue
velocity_main:      (0, -0.1)                           ← moves upward
velocity_second:    (0, +0.25)                          ← moves downward
scale_main:         (1, 1)
scale_second:       (1, 2)                              ← vertically stretched second pattern
cut:                0.48                                ← ~50% threshold → dense caustics
updates_per_second: 6                                   ← stepped animation at 6 fps
```

### `bubbles_caustics_canvas.gdshader` — Caustic1

```text
color:              (0.331, 0.929, 0.919) alpha 0.25   ← bright teal, more transparent
velocity_main:      (0, -0.07)
velocity_second:    (0,  0.10)
velocity_bubbles:   (0,  0.13)
scale_main:         (0.5, 0.5)                         ← finer grain
scale_second:       (1, 4)                             ← very tall stretched second layer
scale_bubbles:      (1.6, 0.9)                         ← wide flat bubble cells
cut:                0.79                               ← high threshold → sparse, dotty caustics
updates_per_second: 6
```

### `distortion.gdshader`

```text
amplitude:    0.02    ← 2% screen offset — subtle
speed:        0.5     ← slow wave
wave_length:  0.08    ← tight/frequent ripples
```

### `gaussian_blur.gdshader`

```text
sigma: 1.4    ← 7×7 kernel, light softening
```

### `color_mapping` Gradient

Five stops remap luminance to a blue palette.

|  Stop | Color                   | Description      |
| ----: | ----------------------- | ---------------- |
| 0.000 | `(0.024, 0.039, 0.169)` | Deep navy        |
| 0.309 | `(0.047, 0.071, 0.298)` | Dark blue        |
| 0.480 | `(0.106, 0.220, 0.941)` | Electric blue    |
| 0.768 | `(0.200, 0.318, 1.000)` | Bright blue-cyan |
| 0.813 | `(0.988, 0.996, 0.996)` | Near white       |

### Tint Layer

Plain `ColorRect`.

```text
color: (0.000, 0.498, 0.824) alpha 0.824   ← strong cyan vignette
```

## 5. Rendering / Layering Structure

```text
BackgroundPauseUI [Control, fullscreen]
│
└── SubViewportContainer  [blend_mode: ADDITIVE]
    └── SubViewport [1920×1080, transparent, always render]
        │
        ├── 1. TextureRect
        │       shader: color_mapping.gdshader
        │       → game viewport texture in
        │       → luminance remapped to navy→electric-blue→white gradient
        │
        ├── 2. Distortion [ColorRect]
        │       shader: distortion.gdshader
        │       → amplitude 0.02, speed 0.5, wavelen 0.08
        │       → gentle sine-wave Y offset on SCREEN_UV
        │
        ├── 3. Tint [ColorRect]
        │       no shader — solid color (0, 0.498, 0.824) alpha 0.824
        │       → floods the whole frame with a cyan wash
        │
        ├── 4. Caustic1 [ColorRect]  blend: ADD, crops bottom 162px
        │       shader: bubbles_caustics_canvas.gdshader
        │       masks: caustic_1_mask.png (landscape horizon)
        │       → full-width bubble+caustic layer, stepped at 6 fps
        │
        └── 5. Caustic2 [ColorRect]  blend: ADD, top-right ~512×496 px
                shader: caustics_canvas.gdshader
                masks: caustic_2_mask.png (painted caustic bands)
                → secondary caustic panel, top-right corner only
│
├── 6. Blur [ColorRect]  (outside SubViewport, fullscreen)
│       shader: gaussian_blur.gdshader sigma=1.4
│       → softens the entire composited image
│
├── 7. GradientDark [TextureRect]
│       gradient: bottom-right → dark navy vignette
│       blend: normal
│
└── 8. GradientLight [TextureRect]
        gradient: bottom-right → teal semi-transparent accent
        blend: MULTIPLY
```

### Key Mechanism — Discrete Frame Stepping

Both caustic shaders use:

```glsl
floor(TIME * 6) / 6
```

Instead of raw `TIME`.

This gives the animation a deliberate 6-fps strobing quality that matches P3R's chunky UI aesthetic.

## 6. Can This Be Recreated in Next.js / Three.js Without Official Assets?

### a) Fully Procedural — No Assets Needed

* All noise textures, including Simplex and Voronoi, can be generated with `simplex-noise`, `glsl-noise`, or a custom WGSL/GLSL noise function.
* The color mapping gradient can be hardcoded as a 1D texture or gradient uniform.
* The distortion wave is a simple sine-wave UV offset in a fragment shader.
* Gaussian blur can be implemented with a 7×7 kernel shader or a Three.js `EffectComposer` pass.
* `GradientDark` and `GradientLight` overlays can be pure CSS gradients or fullscreen quad shaders.
* The tint overlay can be a `THREE.Color` uniform or CSS `mix-blend-mode: color`.
* The `updates_per_second` step can be implemented as:

```ts
Math.floor(clock.elapsedTime * 6) / 6
```

### b) Needs Replacement Textures

Two items need replacement textures:

* `caustic_1_mask.png` — replace with a custom grayscale PNG showing your preferred horizon silhouette, abstract or portfolio-specific. Simple to paint in Photoshop or Figma.
* `caustic_2_mask.png` — replace with either a new hand-painted caustic texture or a procedurally baked caustic map. The real one looks like photographed underwater light.

### c) Hard to Match Exactly Without Original Assets

* The exact character of `caustic_2_mask.png` — its horizontal streak pattern is what gives the top-right caustics their realistic look. A procedural replacement will produce similar but not identical light bands. Close enough for a portfolio.
* The `caustic_1_mask.png` horizon silhouette — specific to the Godot project's artistic choice. Trivial to redraw, but it will not be identical.
* The `color_mapping` base input — in Godot, it remaps the 3D game scene. In your portfolio, you will not have a live 3D scene feeding it, so you would drive it with a solid or gradient base color instead.

## 7. Minimal Asset List for a Next.js Recreation

| Asset                                | Can be procedural?         | Notes                                                                       |
| ------------------------------------ | -------------------------- | --------------------------------------------------------------------------- |
| Caustic noise, Simplex 1920×1080     | Yes — fully procedural     | Generate in shader or via `simplex-noise` package                           |
| Bubble noise, Voronoi 1920×1080      | Yes — fully procedural     | GLSL Voronoi or Three.js noise                                              |
| Color gradient, 1D with 5 stops      | Yes — inline in code       | `vec4` array or 1D canvas texture                                           |
| `GradientDark` + `GradientLight`     | Yes — CSS or shader        | CSS `radial-gradient` is sufficient                                         |
| `caustic_1_mask.png`                 | No — custom texture needed | Hand-draw: horizon silhouette, 1024×512 grayscale, black bottom / white top |
| `caustic_2_mask.png`                 | Partly                     | Can bake from shader or hand-paint caustic bands, 512×512 grayscale         |
| Bubbles gradient mask, left to right | Yes — 1D gradient          | Single `ctx.createLinearGradient` to a canvas texture                       |

Grand total: **2 custom grayscale PNGs needed** — the two masks. Everything else is procedural or hardcoded constants.

## 8. Migration Plan for Next.js / Three.js

### Architecture Overview

Use one `<canvas>` element running a Three.js scene.

No React Three Fiber needed — vanilla Three.js with `EffectComposer` is more transparent for this kind of layered 2D shader work.

### Files to Create

```text
src/
  components/
    P3RBackground/
      P3RBackground.tsx          ← React component, mounts canvas, owns resize/cleanup
      useP3RBackground.ts        ← hook that runs the Three.js scene
      shaders/
        caustics.frag.glsl       ← port of bubbles_caustics_canvas.gdshader
        caustics2.frag.glsl      ← port of caustics_canvas.gdshader
        distortion.frag.glsl     ← port of distortion.gdshader
        colorMap.frag.glsl       ← port of color_mapping.gdshader
        gaussianBlur.frag.glsl   ← port of gaussian_blur.gdshader
        fullscreen.vert.glsl     ← shared passthrough vertex shader
      textures/
        caustic_1_mask.png       ← custom grayscale horizon mask, hand-painted
        caustic_2_mask.png       ← custom grayscale caustic bands, hand-painted or baked
```

### Godot → Three.js Mapping

| Godot node/concept                        | Three.js equivalent                                         |
| ----------------------------------------- | ----------------------------------------------------------- |
| `SubViewport`                             | `THREE.WebGLRenderTarget` offscreen render                  |
| `SubViewportContainer` additive blend     | `THREE.AdditiveBlending` on a fullscreen `PlaneGeometry`    |
| `ColorRect` with shader                   | `THREE.Mesh` fullscreen quad + `THREE.ShaderMaterial`       |
| `TextureRect` with `color_mapping`        | First pass to `RenderTarget` with `colorMap.frag.glsl`      |
| `CanvasItemMaterial blend_mode: ADD`      | `blending: THREE.AdditiveBlending` on the mesh              |
| `CanvasItemMaterial blend_mode: MULTIPLY` | `blending: THREE.MultiplyBlending`                          |
| `SCREEN_TEXTURE` uniform                  | Previous `RenderTarget.texture` passed as uniform           |
| `SCREEN_UV`                               | UV coordinates on fullscreen quad, 0→1                      |
| `TIME`                                    | `clock.elapsedTime`, stepped as `Math.floor(t * 6) / 6`     |
| `GradientTexture2D`                       | `THREE.CanvasTexture` from a `<canvas>` gradient            |
| Gaussian blur pass                        | `EffectComposer`, `UnrealBloomPass`, or custom `ShaderPass` |

### Render Loop

Eight passes, matching the Godot order:

1. Draw solid base color → `RenderTarget A`
2. Apply `colorMap.frag` → `RenderTarget B`
3. Apply `distortion.frag`, reading from B and writing back to A
4. Draw tint quad with `AdditiveBlending` on top
5. Draw Caustic1 quad with `AdditiveBlending` + `caustic_1_mask` texture
6. Draw Caustic2 quad with `AdditiveBlending` + `caustic_2_mask` texture, positioned top-right
7. Apply Gaussian blur pass on the composite with `EffectComposer` / `ShaderPass`
8. Draw `GradientDark` + `GradientLight` quads with normal / multiply blending to the final canvas

### Noise Generation

Use `glsl-noise` from npm for Simplex in the fragment shader.

For Voronoi bubbles, either:

* port a GLSL Voronoi function directly into `caustics.frag.glsl`, or
* pre-bake it once to a `DataTexture`.

### Porting Note for the Caustic Step Logic

The core trick in both shaders is:

```glsl
// Godot
float p1 = texture(pattern, scale * UV + vel * floor(TIME * ups) / ups).r;
float p2 = texture(pattern, scale2 * UV + 0.5 + vel2 * floor(TIME * ups) / ups).r;
float caustic = step(cut, mask - abs(p1 - p2));
COLOR.a = caustic * color.a;
```

The GLSL port is almost identical:

```glsl
float steppedTime = floor(uTime * uUpdatesPerSecond) / uUpdatesPerSecond;

float p1 = texture2D(uPattern, uScaleMain * vUv + uVelocityMain * steppedTime).r;
float p2 = texture2D(uPattern, uScaleSecond * vUv + 0.5 + uVelocitySecond * steppedTime).r;

float caustic = step(uCut, mask - abs(p1 - p2));
gl_FragColor.a = caustic * uColor.a;
```

## Bottom Line

The entire background is about **95% procedural**.

The only two physical assets you need to produce are the two grayscale mask PNGs. Both are hand-paintable in about 20 minutes in Figma.

No official Atlus content touches the background layer.

#	Layer	Blend	Effect
1	Color-mapped base	Normal	Establishes deep navy-to-electric-blue field
2	Sine distortion	Normal	Gently warps the field with 2 slow wave cycles
3	Cyan tint	Normal (82% alpha)	Floods frame with a dominant cyan wash
4	Caustic1 full-screen	Additive	Teal caustic lines and bubble rings, stepping at 6fps
5	Caustic2 top-right	Additive	Broader, denser secondary caustics in upper-right panel
6	Gaussian blur	Normal (replaces)	Softens step-function edges into gentle glows
7	Dark gradient	Normal	Deep navy vignette concentrated at bottom-right corner
8	Light gradient	Additive	Teal-cyan brightness accent from centre to top-left