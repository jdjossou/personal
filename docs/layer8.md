Layer 8 — Light Gradient
What this layer does
This is the final layer in the stack and the compositional counterpart to Layer 7. Where the dark gradient suppresses the bottom-right corner, this layer adds a soft teal-cyan glow to the upper-left region. Together the two gradients establish a diagonal light direction across the frame — bottom-right is dark and shadowed, top-left is brighter and cooler — which is the characteristic P3R UI depth signature.

Unlike every preceding layer, this one uses additive blending. It does not replace or multiply existing pixels; it only ever adds brightness. Where its texture is transparent it has zero effect; where it carries colour, it brightens whatever is underneath it.

Node setup
A fullscreen TextureRect (layout_mode = 1, anchors_preset = 15), final child of BackgroundPauseUI. It carries an explicit CanvasItemMaterial with blend_mode = 1.

In Godot 4's CanvasItemMaterial enum:


BLEND_MODE_MIX          = 0   (standard src-over)
BLEND_MODE_ADD          = 1   ← this layer
BLEND_MODE_SUB          = 2
BLEND_MODE_MUL          = 3
BLEND_MODE_PREMULT_ALPHA = 4
Blend mode is BLEND_MODE_ADD — additive. The prior agent analysis mislabelled this as "multiply"; that is incorrect.

The gradient resource

GradientTexture2D
  fill_from = Vector2(1, 1)    ← bottom-right corner = gradient offset 0.0
  fill_to   = [not specified]  ← Godot default: Vector2(0, 0) = top-left corner = gradient offset 1.0
Same diagonal direction as the dark gradient (bottom-right → top-left), same unspecified fill_to. The difference is entirely in what the gradient stops carry at each end.

Gradient stops
Two stops, OKLab interpolation (interpolation_color_space = 2):

Offset	Linear RGB	Alpha	sRGB hex (approx.)	Label
0.468	(0.282, 0.427, 0.867)	0.000	#4A6DDD	Blue — fully transparent
1.000	(0.000, 0.988, 0.949)	0.392	#00FCEF	Bright teal-cyan — 39.2% alpha
The gradient has only two stops, and the first one begins at offset 0.468 — nearly halfway along the diagonal. There are no stops defined for offsets 0.0 through 0.467. In Godot, values before the first stop are clamped to the first stop's value. Since the first stop has alpha = 0, the entire bottom-right half of the gradient (and beyond) is fully transparent.

How the stops produce the visual effect
From gradient offset 0.0 to 0.468 (the bottom-right ~half of the diagonal):

The colour is clamped to the first stop: (0.282, 0.427, 0.867, 0) — blue at zero alpha. Additive blending multiplies source RGB by source alpha before adding, so the contribution is:


added = (0.282, 0.427, 0.867) × 0 = (0, 0, 0)
No brightness is added. The entire bottom-right region of the frame is completely unaffected by this layer.

From gradient offset 0.468 to 1.000 (from the diagonal midpoint toward the top-left):

OKLab interpolation runs from (0.282, 0.427, 0.867, 0.0) → (0.000, 0.988, 0.949, 0.392). Both the colour and the alpha change simultaneously. The hue shifts from a periwinkle blue toward a bright teal-green, while the alpha builds from 0 to 39.2%.

The additive contribution at each point along this range:


added = gradient.rgb × gradient.alpha
At the top-left corner (offset 1.0, maximum contribution):


added = (0.000, 0.988, 0.949) × 0.392 = (0.000, 0.387, 0.372)
On a background whose blue channel is already around 0.5–0.7 after the caustics and tint, the green and blue additions of (0, 0.387, 0.372) noticeably shift those pixels toward teal-white. The red channel stays at zero throughout — this layer never introduces any warmth.

Additive blending formula
With BLEND_MODE_ADD, Godot sets the GPU blend equation to approximately:


glBlendFunc(GL_SRC_ALPHA, GL_ONE)
Meaning:


output.rgb = src.rgb × src.alpha  +  dst.rgb × 1
           = (gradient.rgb × gradient.alpha)  +  previous_layer.rgb
The destination (everything rendered so far) is preserved in full and the source's premultiplied colour is added on top. The output can exceed 1.0 — it is clamped to [0, 1] by the display. For the top-left corner where (0, 0.387, 0.372) is added to a background around (0, 0.45, 0.72):


output ≈ (0, 0.837, 1.000) → clamped at B=1.0
The upper-left corner approaches white-teal saturation — the characteristic near-overexposed look of P3R's corner highlights.

Relationship to Layer 7
The two gradient layers work as a pair:

Property	Layer 7 — Dark	Layer 8 — Light
Blend mode	Normal (src-over)	Additive (ADD)
Opaque end	Bottom-right corner	Top-left corner
First stop offset	0.000	0.468
Effect at bottom-right	Darkens to deep navy	No effect (transparent)
Effect at top-left	No effect (transparent)	Brightens toward teal-white
Number of stops	3	2
Interaction	Can fully obscure background	Can only brighten, never darken
The dark gradient concentrates its opacity near the corner (first two stops within 7.5% of the gradient) then fades slowly. The light gradient has no effect for the first 46.8% of the gradient, then rises smoothly to its maximum. The result is that the two effects barely overlap in the centre of the frame — the dark corner and bright corner are nearly mutually exclusive.

The transparent stop colour
The first stop's colour (0.282, 0.427, 0.867) — a medium periwinkle blue — is visually irrelevant because its alpha is zero. It exists only to define the starting point of the OKLab interpolation path from that blue toward the final teal-cyan. Without it, Godot would have to extrapolate the colour from a single stop, likely defaulting to black. By giving the transparent end a blue hue, the interpolation transitions from the blue family toward teal as the alpha rises, meaning the first visible pixels as the gradient comes in are a cool mid-blue rather than a cold greenish teal.

How to implement this in other technologies
In GLSL (Three.js ShaderMaterial, additive blending):


varying vec2 vUv;

void main() {
    // Same diagonal as dark gradient:
    // gradPos = 0.0 at bottom-right (1,1), 1.0 at top-left (0,0)
    float gradPos = 1.0 - (vUv.x + vUv.y) * 0.5;

    // Before offset 0.468: transparent, add nothing
    float alpha = 0.0;
    vec3 col    = vec3(0.0);

    if (gradPos >= 0.468) {
        // Remap 0.468→1.0 into 0.0→1.0
        float t = (gradPos - 0.468) / (1.0 - 0.468);
        // Interpolate alpha and colour (approximating OKLab with linear here)
        alpha = mix(0.0,   0.392,                    t);
        col   = mix(vec3(0.282, 0.427, 0.867),
                    vec3(0.000, 0.988, 0.949),        t);
    }

    // Premultiply for additive blend (THREE.AdditiveBlending uses src alpha)
    gl_FragColor = vec4(col * alpha, alpha);
}
Set blending: THREE.AdditiveBlending on the ShaderMaterial. Three.js's AdditiveBlending uses GL_SRC_ALPHA, GL_ONE — matching Godot's BLEND_MODE_ADD.

For a more accurate OKLab interpolation: convert both stop colours to OKLab, interpolate linearly in OKLab space, then convert back to sRGB. The culori library handles this in JavaScript if baking to a texture, or you can implement an OKLab↔linear-RGB conversion directly in GLSL (it's a 3×3 matrix multiply + cube root).

In CSS (fullscreen overlay):


.gradient-light {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        in oklab to bottom right,
        rgba(0, 252, 239, 0.392) 0%,       /* bright teal, 39% — top-left */
        rgba(74, 109, 221, 0.000) 53.2%,   /* periwinkle blue, transparent */
        rgba(74, 109, 221, 0.000) 100%     /* transparent through bottom-right */
    );
    mix-blend-mode: screen;    /* closest CSS equivalent to additive blending */
    pointer-events: none;
}
CSS has no true additive blend mode. mix-blend-mode: screen is the closest semantic equivalent — it brightens the destination without darkening it, similar to additive for mid-to-dark backgrounds. For very precise matching, use a WebGL canvas layer instead.

As a pre-baked texture:

Same recommendation as Layer 7: bake to a 256×256 RGBA PNG once, use as a THREE.Texture on a fullscreen quad with THREE.AdditiveBlending. Since this layer is static, a texture avoids a shader pass entirely.

Final composition summary
After all 8 layers, the rendering order and their cumulative roles are:
