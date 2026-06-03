Layer 1 — Base Blue / Color-Mapped Background
What this layer does
This is the first and lowest layer in the stack. Its job is to establish the deep-blue color field that everything else is composited on top of. It takes an input image — in the Godot project this is a live texture of the 3D game scene — and remaps every pixel's color to a shade of blue based solely on that pixel's luminance. Bright pixels become near-white or electric blue; dark pixels become deep navy. The result is a monochromatic blue field that feels like the world is being seen through water.

In a portfolio context where there is no live game scene feeding in, the input can be a solid dark-grey rectangle, a noise texture, or any canvas — the shader converts it regardless of source color.

Node / element setup
Inside a dedicated off-screen render target (Godot SubViewport, web equivalent: a WebGLRenderTarget or an offscreen canvas) sized at 1920 × 1080, with a transparent background. The render target is set to always update every frame.

Inside that render target, the first element is a fullscreen rectangle (TextureRect in Godot, a fullscreen quad mesh in WebGL). It is stretched to fill the entire 1920 × 1080 area. It has the color-mapping shader attached as its material. The texture property (the input image) is injected at runtime from outside — in Godot this is an exported variable that the parent scene sets; in a web context it would be a THREE.Texture uniform.

The color-mapping shader
Full source (color_mapping.gdshader):


shader_type canvas_item;

uniform sampler2D gradient_texture: source_color, repeat_disable;

void fragment() {
    float lightness = float(0.299 * COLOR.r + 0.587 * COLOR.g + 0.114 * COLOR.b);
    vec4 gradient = texture(gradient_texture, vec2(lightness, 0.0));
    COLOR = gradient;
}
How it works, step by step:

COLOR coming into the fragment stage is the input texture's pixel color at the current UV coordinate.
The luminance (perceived brightness) is computed using the ITU-R BT.601 luma formula: L = 0.299R + 0.587G + 0.114B. This gives a scalar 0.0 (black) → 1.0 (white) that represents how bright the pixel is, ignoring its hue.
That scalar is used as a horizontal U coordinate to sample a 1D gradient texture. The V coordinate is always 0.0 (irrelevant for a 1D texture). So the gradient texture acts as a lookup table: the darker the input pixel, the further left you sample; the brighter, the further right.
The sampled gradient color completely replaces the input pixel. The original hue and saturation of the input are discarded — only brightness survives, mapped to the blue palette.
This technique is called luminance-based color remapping or a 1D LUT (lookup table). It is equivalent to converting the image to greyscale and then colorizing it via a gradient map — the same effect as Photoshop's "Gradient Map" adjustment layer.

The gradient (the blue palette)
The gradient is a 1D texture with 5 color stops, using cubic interpolation in OKLab color space (Godot's interpolation_mode = 1, interpolation_color_space = 2). OKLab interpolation means the midpoint colors between stops are perceptually uniform — no unexpected saturation spikes or grey muddiness.

Stop position (U)	Color (linear RGB)	Hex approx.	Label
0.000	(0.024, 0.039, 0.169)	#060A2B	Deep navy — darkest input pixels
0.309	(0.047, 0.071, 0.298)	#0C124C	Dark blue
0.480	(0.106, 0.220, 0.941)	#1B38F0	Electric blue — midtones
0.768	(0.200, 0.318, 1.000)	#3351FF	Bright blue-cyan
0.813	(0.988, 0.996, 0.996)	#FCFEFE	Near-white — brightest input pixels
The stops are not evenly spaced. Stops 0 through 0.48 cover the dark half of the range and contain only dark navy blues. The jump from 0.48 to 0.768 is where the dominant mid-blue color lives. The near-white stop at 0.813 means anything brighter than ~80% luminance in the input maps to an almost-white highlight — this is what gives the effect its high-contrast shimmer.

Because the input to the shader is typically a dark scene (or a solid dark color in the portfolio case), the output is concentrated in the left portion of the gradient, producing a deep dark-blue base with electric-blue midtones.

What it produces visually
With a dark input (e.g. a solid #1A1A1A grey):

Every pixel has luminance ≈ 0.10 → samples near position 0.309 on the gradient → outputs dark blue #0C124C.
With a slightly varied input (subtle noise or a game scene):

Dark areas → deep navy
Mid-brightness areas → electric blue #1B38F0
Any bright spot → snaps quickly to near-white
The result is a flat, deep-blue canvas with no hue variation — just luminance re-expressed as shades of navy through electric blue. This is the "water at depth" starting color before any caustics or tint are added.

How to implement this in other technologies
In GLSL (WebGL / Three.js ShaderMaterial):

Port is nearly 1:1. The only difference is COLOR in Godot canvas shaders corresponds to texture(inputTexture, vUv) in a standard Three.js fullscreen pass:


uniform sampler2D inputTexture;   // the scene / base color input
uniform sampler2D gradientTexture; // the 1D blue gradient, repeat: ClampToEdge

varying vec2 vUv;

void main() {
    vec4 inputColor = texture2D(inputTexture, vUv);
    float luma = 0.299 * inputColor.r + 0.587 * inputColor.g + 0.114 * inputColor.b;
    vec4 mapped = texture2D(gradientTexture, vec2(luma, 0.0));
    gl_FragColor = mapped;
}
Creating the gradient texture:

Bake it once into a THREE.DataTexture (or draw it to an offscreen <canvas> and use THREE.CanvasTexture). The texture should be 256 × 1 pixels, wrapS = ClampToEdge, wrapT = ClampToEdge, minFilter = LinearFilter. Populate it by sampling the 5-stop cubic gradient at each of the 256 positions. When creating this in JavaScript, use an OKLab-interpolated gradient library (e.g. culori with interpolate in oklab) to match the exact midpoint colors.

Gradient stop values to hardcode:


[
  { pos: 0.000, color: '#060A2B' },
  { pos: 0.309, color: '#0C124C' },
  { pos: 0.480, color: '#1B38F0' },
  { pos: 0.768, color: '#3351FF' },
  { pos: 0.813, color: '#FCFEFE' },
]
In CSS (as a pure approximation, no shader):

A simple background: linear-gradient(...) cannot replicate the luminance-mapping behavior, but it can approximate the palette as a static gradient. This is only appropriate if there is no dynamic input image.

Input image choice for a portfolio:

Since there is no live game scene, the simplest approach is to feed the shader a solid dark grey quad (luminance ≈ 0.08–0.15). This maps entirely into the 0.0–0.309 range of the gradient, producing a uniform deep navy. For more visual interest, feed it a low-contrast noise texture (e.g. FBM noise at very low amplitude, outputting luminance values in the 0.05–0.4 range). This creates subtle dark-navy-to-electric-blue variation across the background before any caustics are added — which is the correct behavior since the Godot version feeds in a 3D scene with depth and shadow variation.