Layer 7 — Dark Gradient
What this layer does
This is the first of two finishing gradient layers applied over the blurred composite. It creates a dark, opaque vignette concentrated at the bottom-right corner of the frame, fading to fully transparent as it moves toward the top-left. Its function is to anchor the composition visually — the corner feels heavier, deeper, and more shadowed, which makes the bright caustic streaks in the upper regions stand out more by contrast.

Unlike all previous layers, there is no shader involved. This is a plain TextureRect displaying a procedurally generated gradient texture, with no material override and no blend mode special-casing. It composites via standard alpha blending.

Node setup
A fullscreen TextureRect (layout_mode = 1, anchors_preset = 15), a direct child of BackgroundPauseUI, sibling of the Blur node. No shader material is assigned — it uses Godot's default BLEND_MIX (standard src-over alpha compositing). Its texture is a GradientTexture2D resource defined inline in the scene file.

The gradient resource

GradientTexture2D
  fill_from = Vector2(1, 1)    ← bottom-right corner of the texture
  fill_to   = [not specified]  ← Godot default: Vector2(0, 0) = top-left corner
fill_to is absent from the .tscn file, meaning it is at Godot's default value. Based on the visual intent and the directional convention of Godot's GradientTexture2D, this positions the end point at the top-left corner (0, 0). The gradient runs diagonally from bottom-right → top-left.

The fill_from point maps to gradient offset 0 (the first stop). The fill_to point maps to gradient offset 1 (the last stop).

Gradient stops
Three stops, OKLab interpolation (interpolation_color_space = 2):

Offset (position along diagonal)	Linear RGB	Alpha	sRGB hex (approx.)	Label
0.000	(0.000, 0.061, 0.429)	1.000	#000F6D	Deep navy — fully opaque, bottom-right corner
0.075	(0.000, 0.027, 0.486)	0.784	#00077C	Dark blue — 78% alpha
1.000	(0.065, 0.263, 0.963)	0.000	#1E43F6	Bright blue — fully transparent, top-left corner
How the stops produce the visual effect
The stop spacing is deliberately uneven and creates a two-phase fade:

Phase 1 — concentrated corner (offset 0.000 → 0.075, 7.5% of the diagonal):
Alpha drops from 1.0 → 0.784. This phase covers only 7.5% of the diagonal length, meaning a relatively short distance from the corner. The dark overlay is heaviest right at the corner and falls quickly to ~78% within a small radius.

Phase 2 — long slow fade (offset 0.075 → 1.000, 92.5% of the diagonal):
Alpha continues from 0.784 → 0. This second phase covers almost the entire remaining distance to the top-left corner. The fade is very gradual — the layer remains semi-transparent across most of the screen before reaching full transparency at the extreme opposite corner.

The practical result: the bottom-right corner is heavily darkened. Approximately the bottom-right quarter of the frame has noticeable darkening. The top-left corner and most of the upper-left region are essentially unaffected (near-zero alpha).

The transparent stop colour (0.065, 0.263, 0.963) — bright blue at alpha 0 — is visually inert (alpha=0 means colour is irrelevant). It exists only to guide the OKLab interpolation path from the dark navy toward the bright end of the spectrum as the gradient fades out, ensuring the mid-tones of the fade pass through a perceptually smooth blue transition rather than a grey or muddy intermediate.

Blending
Standard src-over alpha compositing (no material override):


output = gradient.rgb × gradient.a  +  previous.rgb × (1 − gradient.a)
At the bottom-right corner (alpha = 1.0):


output = (0, 0.061, 0.429) × 1.0 + previous × 0 = (0, 0.061, 0.429)
The corner is completely replaced with deep navy — the blurred caustics underneath are fully hidden there.

At offset 0.075 from the corner (alpha = 0.784):


output = (0, 0.027, 0.486) × 0.784 + previous × 0.216
       = (0, 0.021, 0.381) + previous × 0.216
The background shows through faintly.

At the top-left corner (alpha = 0):


output = previous × 1.0
No contribution — the blurred caustic composite shows through completely.

How to implement this in other technologies
In WebGL / Three.js (shader on a fullscreen quad):

This layer needs no noise, no time, no screen sampling. It is a pure UV-based gradient. The diagonal gradient can be computed analytically from UV coordinates:


varying vec2 vUv;

void main() {
    // Distance along the bottom-right → top-left diagonal
    // At vUv = (1,1): t = 0.0  (fully opaque)
    // At vUv = (0,0): t = 1.0  (fully transparent)
    float t = 1.0 - (vUv.x + vUv.y) * 0.5;
    // t = 0 at top-left, t = 1 at bottom-right
    // Reverse: t = 1 at bottom-right → offset 0, t = 0 at top-left → offset 1
    float gradPos = 1.0 - t;  // offset in gradient space

    // Two-phase alpha curve matching the 3-stop gradient
    float alpha;
    if (gradPos < 0.075) {
        // Phase 1: 0.075 → remap to [1.0, 0.784]
        alpha = mix(1.0, 0.784, gradPos / 0.075);
    } else {
        // Phase 2: [0.784, 0.0] over remaining distance
        alpha = mix(0.784, 0.0, (gradPos - 0.075) / 0.925);
    }

    // Deep navy color — alpha fades out toward transparent bright blue
    // (the transparent end color is irrelevant, only alpha matters)
    vec3 darkNavy = vec3(0.0, 0.061, 0.429);
    gl_FragColor = vec4(darkNavy, alpha);
}
Use standard THREE.NormalBlending (src-over) on the ShaderMaterial.

In CSS (fullscreen overlay):

The layer is equivalent to a diagonal linear gradient overlaid on the entire background:


.gradient-dark {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to top left,              /* from bottom-right toward top-left */
        rgba(0, 16, 109, 1.000) 0%,      /* deep navy, fully opaque */
        rgba(0,  7, 124, 0.784) 7.5%,    /* dark blue, 78% */
        rgba(30, 67, 246, 0.000) 100%    /* transparent */
    );
    pointer-events: none;
    mix-blend-mode: normal;
}
Note: CSS uses sRGB values. The OKLab-interpolated midtones of the original will not be precisely replicated with CSS gradient interpolation (CSS gradients use sRGB by default), but the corner values and transparency curve will match closely enough. To get perceptually smooth interpolation matching the OKLab original, use background: linear-gradient(in oklab, to top left, ...) — the in oklab color interpolation hint is supported in modern browsers.

As a pre-baked texture (simplest approach for a static asset):

Render the gradient once to a 256×256 PNG and use it as a THREE.Texture on a fullscreen MeshBasicMaterial. This avoids a shader pass entirely. Since the gradient is fully static (no time dependency), a texture is the most efficient option. Use THREE.NormalBlending, transparent: true.