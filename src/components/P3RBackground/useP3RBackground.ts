'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  BASE_GRADIENT,
  BLUR,
  CAUSTIC1,
  CAUSTIC2,
  CAUSTIC2_PANEL,
  DISTORTION,
  DPR_CAP,
  STEPPED_FPS,
  TINT,
} from './constants'
import { bakeBubblesMaskTexture, bakeGradientTexture } from './gradient'
import { bakeBubblesTexture, bakeCaustic2PatternTexture, bakePatternTexture } from './noise'
import {
  caustic1Frag,
  caustic2Frag,
  colorMapFrag,
  darkGradientFrag,
  distortionFrag,
  fullscreenVert,
  gaussianBlurFrag,
  lightGradientFrag,
  tintFrag,
} from './shaders'

// Build THREE vectors from the plain tuples in constants.ts (kept THREE-free).
const v2 = (t: readonly [number, number]) => new THREE.Vector2(t[0], t[1])
const v4 = (t: readonly [number, number, number, number]) =>
  new THREE.Vector4(t[0], t[1], t[2], t[3])

export function useP3RBackground(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    // Cap DPR so the 2-RT + 49-tap-blur pipeline never renders at the full 2–3×
    // of a retina panel (big, safe perf win on laptops/phones).
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP))

    const timer = new THREE.Timer()

    // Orthographic camera covers the [-1,1]×[-1,1] clip space — standard fullscreen quad setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // One shared fullscreen quad whose material is swapped per pass.
    const quadGeometry = new THREE.PlaneGeometry(2, 2)
    const quadMesh = new THREE.Mesh(quadGeometry)
    const passScene = new THREE.Scene()
    passScene.add(quadMesh)

    // Off-screen target so distortion (Layer 2) can resample Layer 1's output.
    // Sized to the drawing buffer so it tracks devicePixelRatio. Default
    // UnsignedByte/RGBA/LinearFilter preserves the raw byte pass-through look.
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    const makeRT = () =>
      new THREE.WebGLRenderTarget(size.x, size.y, { depthBuffer: false, stencilBuffer: false })
    const rtA = makeRT()
    // rtB holds the fully composited layers 1–5 so the blur (Layer 6) can resample
    // it. Tagged sRGB so the composite bytes match the on-screen image. Every layer
    // here is a raw ShaderMaterial emitting display-space values directly, so the
    // pre-blur composite is byte-identical to the final image — then merely softened.
    const rtB = makeRT()
    rtB.texture.colorSpace = THREE.SRGBColorSpace

    // Layer 1: vertical luminance ramp (bright surface -> deep navy) + a little
    // FBM, fed through the 1D blue gradient LUT. This ramp is what produces the
    // light-cyan-top → deep-blue-bottom gradient.
    const gradient = bakeGradientTexture()
    const colorMapMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: colorMapFrag,
      uniforms: {
        uGradient: { value: gradient },
        uAspect: { value: window.innerWidth / window.innerHeight },
        uTopLuma: { value: BASE_GRADIENT.topLuma },
        uMidLuma: { value: BASE_GRADIENT.midLuma },
        uBottomLuma: { value: BASE_GRADIENT.bottomLuma },
        uMidPoint: { value: BASE_GRADIENT.midPoint },
        uNoiseAmp: { value: BASE_GRADIENT.noiseAmp },
      },
    })

    // Layer 2: sine distortion — pure UV warp of the previous pass.
    const distortionMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: distortionFrag,
      uniforms: {
        uPreviousPass: { value: null },
        uTime: { value: 0 },
        uAmplitude: { value: DISTORTION.amplitude },
        uSpeed: { value: DISTORTION.speed },
        uWaveLength: { value: DISTORTION.waveLength },
      },
    })

    // Layer 3: cyan tint — a vertical-alpha cyan wash (strong at the surface, light
    // in the depths) so the base ramp's navy bottom survives instead of flattening
    // to a uniform mid-cyan the way the original flat 82% tint did.
    const tintMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: tintFrag,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTintColor: { value: new THREE.Vector3(TINT.color[0], TINT.color[1], TINT.color[2]) },
        uAlphaTop: { value: TINT.alphaTop },
        uAlphaBottom: { value: TINT.alphaBottom },
      },
    })

    // Layer 4: Caustic1 — additive teal caustics + Voronoi bubble outlines.
    // Two scrolling noise textures (baked once) plus two masks: the hand-painted
    // horizon PNG (gates caustics to the "sky") and a vertical bubbles gradient.
    const patternTexture = bakePatternTexture()
    const bubblesTexture = bakeBubblesTexture()
    const bubblesMask = bakeBubblesMaskTexture()
    const patternMask = new THREE.TextureLoader().load(
      '/assets/textures/caustic_1_mask.png',
      onMaskLoaded
    )
    patternMask.colorSpace = THREE.NoColorSpace // greyscale gate, not colour
    patternMask.wrapS = THREE.ClampToEdgeWrapping
    patternMask.wrapT = THREE.ClampToEdgeWrapping
    patternMask.minFilter = THREE.LinearFilter
    patternMask.magFilter = THREE.LinearFilter

    const caustic1Material = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: caustic1Frag,
      transparent: true,
      blending: THREE.AdditiveBlending, // can only brighten the frame
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uPatternTexture: { value: patternTexture },
        uPatternMaskTexture: { value: patternMask },
        uBubblesTexture: { value: bubblesTexture },
        uBubblesMaskTexture: { value: bubblesMask },
        uColor: { value: v4(CAUSTIC1.color) },
        uVelocityMain: { value: v2(CAUSTIC1.velocityMain) },
        uVelocitySecond: { value: v2(CAUSTIC1.velocitySecond) },
        uVelocityBubbles: { value: v2(CAUSTIC1.velocityBubbles) },
        uScaleMain: { value: v2(CAUSTIC1.scaleMain) },
        uScaleSecond: { value: v2(CAUSTIC1.scaleSecond) },
        uScaleBubbles: { value: v2(CAUSTIC1.scaleBubbles) },
        uCut: { value: CAUSTIC1.cut },
        uTime: { value: 0 },
        uSteppedFps: { value: STEPPED_FPS },
      },
    })

    // Layer 5: Caustic2 — denser, brighter caustic bands confined to a 512×512
    // panel in the upper-right. A simplified Caustic1 (no bubbles) fed by a much
    // lower-frequency Perlin texture and a hand-painted caustic-band mask.
    const caustic2Pattern = bakeCaustic2PatternTexture()
    const caustic2Mask = new THREE.TextureLoader().load(
      '/assets/textures/caustic_2_mask.png',
      onMaskLoaded
    )
    caustic2Mask.colorSpace = THREE.NoColorSpace // greyscale gate, not colour
    caustic2Mask.wrapS = THREE.ClampToEdgeWrapping
    caustic2Mask.wrapT = THREE.ClampToEdgeWrapping
    caustic2Mask.minFilter = THREE.LinearFilter
    caustic2Mask.magFilter = THREE.LinearFilter

    const caustic2Material = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: caustic2Frag,
      transparent: true,
      blending: THREE.AdditiveBlending, // can only brighten the frame
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uPatternTexture: { value: caustic2Pattern },
        uMaskTexture: { value: caustic2Mask },
        uColor: { value: v4(CAUSTIC2.color) },
        uVelocityMain: { value: v2(CAUSTIC2.velocityMain) },
        uVelocitySecond: { value: v2(CAUSTIC2.velocitySecond) },
        uScaleMain: { value: v2(CAUSTIC2.scaleMain) },
        uScaleSecond: { value: v2(CAUSTIC2.scaleSecond) },
        uCut: { value: CAUSTIC2.cut },
        uTime: { value: 0 },
        uSteppedFps: { value: STEPPED_FPS },
      },
    })

    // Unlike the other layers this is not full-screen. fullscreenVert passes
    // vertex positions straight through as clip coords (ignoring camera/model
    // matrices), so the panel's placement is baked into the geometry vertices.
    const caustic2Geometry = new THREE.PlaneGeometry(CAUSTIC2_PANEL.width, CAUSTIC2_PANEL.height)
    caustic2Geometry.translate(CAUSTIC2_PANEL.offsetX, CAUSTIC2_PANEL.offsetY, 0)
    const caustic2Mesh = new THREE.Mesh(caustic2Geometry, caustic2Material)
    // Its own scene so it isn't drawn during the full-screen passScene passes.
    const panelScene = new THREE.Scene()
    panelScene.add(caustic2Mesh)

    // Layer 6: Gaussian blur — full-screen soft-focus post-process over the
    // composited rtB. Resolution tracks the drawing buffer so one kernel step =
    // one device pixel.
    const blurMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: gaussianBlurFrag,
      uniforms: {
        uPreviousPass: { value: null },
        uResolution: { value: new THREE.Vector2(size.x, size.y) },
        uSigma: { value: BLUR.sigma },
      },
    })

    // Layer 7: Dark gradient vignette — a static, UV-based diagonal gradient
    // darkening the bottom-right corner to deep navy and fading to transparent at
    // the top-left. Composited over the blurred output via standard alpha.
    const darkGradientMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: darkGradientFrag,
      transparent: true,
      blending: THREE.NormalBlending, // standard src-over alpha
      depthTest: false,
      depthWrite: false,
    })

    // Layer 8: Light gradient — the additive counterpart to Layer 7. A static,
    // UV-based diagonal gradient adding a soft teal-cyan glow to the top-left
    // corner (transparent across the bottom-right half).
    const lightGradientMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: lightGradientFrag,
      transparent: true,
      blending: THREE.AdditiveBlending, // can only brighten the frame
      depthTest: false,
      depthWrite: false,
    })

    function renderPass(
      material: THREE.Material,
      target: THREE.WebGLRenderTarget | null
    ) {
      quadMesh.material = material
      renderer.setRenderTarget(target)
      renderer.render(passScene, camera)
    }

    // The full 8-layer composite for the current uniform state (one frame).
    function renderScene() {
      renderPass(colorMapMaterial, rtA) // Layer 1 -> rtA
      distortionMaterial.uniforms.uPreviousPass.value = rtA.texture
      renderPass(distortionMaterial, rtB) // Layer 2 -> rtB (composite target)
      renderer.autoClear = false
      renderPass(tintMaterial, rtB) // Layer 3 -> vertical cyan wash over rtB
      renderPass(caustic1Material, rtB) // Layer 4 -> additive caustics/bubbles
      renderer.setRenderTarget(rtB)
      renderer.render(panelScene, camera) // Layer 5 -> additive top-right panel
      renderer.autoClear = true
      blurMaterial.uniforms.uPreviousPass.value = rtB.texture
      renderPass(blurMaterial, null) // Layer 6 -> Gaussian blur to screen
      renderer.autoClear = false
      renderPass(darkGradientMaterial, null) // Layer 7 -> vignette over blur
      renderPass(lightGradientMaterial, null) // Layer 8 -> additive teal glow
      renderer.autoClear = true
    }

    function setAnimationTime(elapsed: number) {
      distortionMaterial.uniforms.uTime.value = elapsed
      caustic1Material.uniforms.uTime.value = elapsed
      caustic2Material.uniforms.uTime.value = elapsed
    }

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP))
      const s = renderer.getDrawingBufferSize(new THREE.Vector2())
      rtA.setSize(s.x, s.y)
      rtB.setSize(s.x, s.y)
      blurMaterial.uniforms.uResolution.value.set(s.x, s.y)
      colorMapMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight
      // When the loop is paused (reduced-motion), refresh the static frame so the
      // resized buffers aren't shown stale/stretched.
      if (reduceMotion.matches) renderScene()
    }

    function tick() {
      frameIdRef.current = requestAnimationFrame(tick)
      timer.update() // advance the Timer; getElapsed() only moves after update()
      setAnimationTime(timer.getElapsed())
      renderScene()
    }

    function startLoop() {
      cancelAnimationFrame(frameIdRef.current) // never stack two rAF chains
      frameIdRef.current = requestAnimationFrame(tick)
    }

    function stopLoop() {
      cancelAnimationFrame(frameIdRef.current)
    }

    // Reduced motion: render a single frozen, fully-composited frame and never
    // start the animation loop. Re-evaluated live if the user toggles the setting.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // The caustic masks (PNGs) load asynchronously. In the animated path the loop
    // picks them up automatically, but the reduced-motion path renders only once —
    // possibly before they arrive — so re-draw the frozen frame as each lands.
    function onMaskLoaded() {
      if (reduceMotion.matches && !document.hidden) renderScene()
    }

    function applyMotionPreference() {
      if (reduceMotion.matches) {
        stopLoop()
        // Freeze at a developed 6fps step whose caustic pattern is dense at the
        // top, so the static frame reads like the animated one paused (not a
        // plainer, near-caustic-free background).
        setAnimationTime(3.5)
        renderScene()
      } else {
        startLoop()
      }
    }

    // Pause the loop while the tab is hidden — no point spending GPU off-screen.
    function onVisibilityChange() {
      if (document.hidden) {
        stopLoop()
      } else if (!reduceMotion.matches) {
        startLoop()
      }
    }

    window.addEventListener('resize', onResize)
    reduceMotion.addEventListener('change', applyMotionPreference)
    document.addEventListener('visibilitychange', onVisibilityChange)

    applyMotionPreference()

    return () => {
      stopLoop()
      window.removeEventListener('resize', onResize)
      reduceMotion.removeEventListener('change', applyMotionPreference)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      quadGeometry.dispose()
      colorMapMaterial.dispose()
      distortionMaterial.dispose()
      tintMaterial.dispose()
      caustic1Material.dispose()
      caustic2Geometry.dispose()
      caustic2Material.dispose()
      blurMaterial.dispose()
      darkGradientMaterial.dispose()
      lightGradientMaterial.dispose()
      rtA.dispose()
      rtB.dispose()
      gradient.dispose()
      patternTexture.dispose()
      bubblesTexture.dispose()
      bubblesMask.dispose()
      patternMask.dispose()
      caustic2Pattern.dispose()
      caustic2Mask.dispose()
      renderer.dispose()
    }
  }, [canvasRef])
}
