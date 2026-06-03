Layer 3 — Cyan Tint
What this layer does
This is the simplest layer in the entire stack — no shader, no texture, no animation. It is a fullscreen solid-color rectangle drawn with standard alpha blending over the distorted background. Its purpose is to push the entire image toward a dominant cyan-blue hue, dramatically reducing the visibility of the underlying detail and establishing the bold, saturated "underwater" tone that defines the P3R aesthetic.

Node / element setup
A fullscreen rectangle (ColorRect in Godot, a fullscreen quad or <div> in web) anchored to cover the entire 1920 × 1080 render target. It carries no shader and no special material — it uses the default normal (alpha) blend mode. The only property set is its fill color.

Color value

Color(0, 0.498039, 0.823529, 0.823529)
       R    G          B        Alpha
In 0–255 terms: R=0, G=127, B=210, A=210
Approximate hex: #007FD2 at ~82.4% opacity

This is a vivid, slightly warm cyan — more blue than teal, with zero red. At 82.4% alpha it is very opaque; only the remaining ~17.6% lets the underlying layers show through.

How blending works
The blend mode is normal alpha compositing (the default, often called "over" or "src-over"):


output = tint.rgb × tint.a  +  previous.rgb × (1 − tint.a)
       = (0, 0.498, 0.824) × 0.824  +  previous × 0.176
       = (0, 0.410, 0.679)           +  previous × 0.176
The fixed contribution of this layer to every pixel is (0, 0.410, 0.679) regardless of what is underneath. The underlying image (color-mapped + distorted) contributes only 17.6% of its own value on top.

What this means in practice:

Even the darkest pixel from the previous layers (deep navy #060A2B) will end up as:


(0, 0.410, 0.679) + (0.024, 0.039, 0.169) × 0.176
≈ (0.004, 0.417, 0.709)  →  approximately #006AB5
And the brightest pixel (near-white from a bright input) ends up as:


(0, 0.410, 0.679) + (0.988, 0.996, 0.996) × 0.176
≈ (0.174, 0.585, 0.854)  →  approximately #2C95DA
The entire output range after this layer is compressed into a narrow band between dark cyan #006AB5 and bright sky blue #2C95DA. Almost no hue variation survives from the layers below — only a faint luminance difference between where the background was dark vs. bright. This is intentional: the tint flattens and unifies the palette before the caustics add the high-contrast bright streaks on top.

Why this layer exists
Without the tint, the output of the color-mapping shader is a pure blue-to-white gradient that can include very dark navy regions and near-white highlights. The distortion adds movement but no color. Before the caustics are applied additively (layers 4 and 5), the background needs to sit at a specific mid-brightness level — dark enough that the additive caustic streaks will stand out, but bright enough to look saturated and "water-like" rather than just black. This tint calibrates that baseline. It also warms the blue slightly toward cyan, which matches P3R's characteristic palette.

How to implement this in other technologies
In WebGL / Three.js:

No shader needed. Draw a fullscreen quad with a MeshBasicMaterial (or equivalent) set to the tint color and standard alpha blending:


const geometry = new THREE.PlaneGeometry(2, 2); // fullscreen in NDC
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x007FD2),
    transparent: true,
    opacity: 210 / 255, // ≈ 0.824
    blending: THREE.NormalBlending,
    depthTest: false,
    depthWrite: false,
});
const tintQuad = new THREE.Mesh(geometry, material);
scene.add(tintQuad);
If you are using a manual multi-pass render loop with WebGLRenderTargets, this pass reads whatever is in the current target and composites the solid color over it. It does not need to read the screen texture — it is drawn on top via the renderer's normal compositing, not by a shader sampling the previous result.

In CSS (as a pure overlay):

If the background is an HTML element, this layer maps exactly to a ::after pseudo-element or a sibling <div> with position: absolute:


.tint-layer {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 127, 210, 0.824);
    mix-blend-mode: normal;
    pointer-events: none;
}
Color space note:

The values (0, 0.498039, 0.823529) in the Godot .tscn file are in linear light space. CSS rgba() and HTML hex colors use sRGB. If you feed these linear values directly to CSS you will get a slightly darker, less saturated result. To convert:


sRGB = linearRGB^(1/2.2)   (approximate)

G_sRGB = 0.498^0.4545 ≈ 0.72  →  183  →  #B7
B_sRGB = 0.824^0.4545 ≈ 0.92  →  234  →  #EA
Corrected CSS hex: #00B7EA at 82.4% opacity. Use this for CSS implementations; use the raw linear values (0, 0.498, 0.824) for GLSL uniforms (since GPU shaders work in linear space by default when the framebuffer is linear).