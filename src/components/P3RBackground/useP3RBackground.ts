'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { bakeBubblesMaskTexture, bakeGradientTexture } from './gradient'
import { bakeBubblesTexture, bakeCaustic2PatternTexture, bakePatternTexture } from './noise'
import { caustic1Frag, caustic2Frag, colorMapFrag, distortionFrag, fullscreenVert, gaussianBlurFrag } from './shaders'

export function useP3RBackground(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

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
    // it. Tagged sRGB so the tint's MeshBasicMaterial writes the *same* bytes it
    // currently writes to screen (its colorspace conversion targets the RT's
    // colorSpace). The ShaderMaterial layers emit raw values regardless, so this
    // keeps the pre-blur composite byte-identical to the current on-screen image —
    // then merely softened.
    const rtB = makeRT()
    rtB.texture.colorSpace = THREE.SRGBColorSpace

    // Layer 1: luminance of procedural FBM noise -> 1D blue gradient LUT.
    const gradient = bakeGradientTexture()
    const colorMapMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: colorMapFrag,
      uniforms: {
        uGradient: { value: gradient },
        uAspect: { value: window.innerWidth / window.innerHeight },
      },
    })

    // Layer 2: sine distortion — pure UV warp of the previous pass.
    const distortionMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: distortionFrag,
      uniforms: {
        uPreviousPass: { value: null },
        uTime: { value: 0 },
        uAmplitude: { value: 0.02 },
        uSpeed: { value: 0.5 },
        uWaveLength: { value: 0.08 },
      },
    })

    // Layer 3: cyan tint — solid color composited over the distorted image to
    // unify the palette toward P3R's saturated "underwater" blue.
    const tintMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x007fd2), // sRGB cyan (doc's display-ready hex)
      transparent: true,
      opacity: 210 / 255, // ≈ 0.824 — faithful to docs/layer3.md
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
    })

    // Layer 4: Caustic1 — additive teal caustics + Voronoi bubble outlines.
    // Two scrolling noise textures (baked once) plus two masks: the hand-painted
    // horizon PNG (gates caustics to the "sky") and a vertical bubbles gradient.
    const patternTexture = bakePatternTexture()
    const bubblesTexture = bakeBubblesTexture()
    const bubblesMask = bakeBubblesMaskTexture()
    const patternMask = new THREE.TextureLoader().load(
      '/assets/textures/caustic_1_mask.png'
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
        uColor: { value: new THREE.Vector4(0.331, 0.929, 0.919, 0.255) },
        uVelocityMain: { value: new THREE.Vector2(0.0, -0.07) },
        uVelocitySecond: { value: new THREE.Vector2(0.0, 0.1) },
        uVelocityBubbles: { value: new THREE.Vector2(0.0, 0.13) },
        uScaleMain: { value: new THREE.Vector2(0.5, 0.5) },
        uScaleSecond: { value: new THREE.Vector2(1.0, 4.0) },
        uScaleBubbles: { value: new THREE.Vector2(1.6, 0.9) },
        uCut: { value: 0.79 },
        uTime: { value: 0 },
      },
    })

    // Layer 5: Caustic2 — denser, brighter caustic bands confined to a 512×512
    // panel in the upper-right. A simplified Caustic1 (no bubbles) fed by a much
    // lower-frequency Perlin texture and a hand-painted caustic-band mask.
    const caustic2Pattern = bakeCaustic2PatternTexture()
    const caustic2Mask = new THREE.TextureLoader().load(
      '/assets/textures/caustic_2_mask.png'
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
        uColor: { value: new THREE.Vector4(0.587, 0.888, 0.939, 0.471) },
        uVelocityMain: { value: new THREE.Vector2(0.0, -0.1) },
        uVelocitySecond: { value: new THREE.Vector2(0.0, 0.25) },
        uScaleMain: { value: new THREE.Vector2(1.0, 1.0) },
        uScaleSecond: { value: new THREE.Vector2(1.0, 2.0) },
        uCut: { value: 0.48 },
        uTime: { value: 0 },
      },
    })

    // Unlike the other layers this is not full-screen. fullscreenVert passes
    // vertex positions straight through as clip coords (ignoring camera/model
    // matrices), so the panel's placement is baked into the geometry vertices.
    // On a 1920×1080 reference that's 960 px/NDC-unit X, 540 px/NDC-unit Y:
    // right edge 176px from the right, top edge 16px above the frame.
    const caustic2Geometry = new THREE.PlaneGeometry(512 / 960, 512 / 540)
    caustic2Geometry.translate(0.55, 0.5556, 0)
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
        uSigma: { value: 1.4 }, // runtime value from docs/layer6.md (not the 3.3 default)
      },
    })

    function renderPass(
      material: THREE.Material,
      target: THREE.WebGLRenderTarget | null
    ) {
      quadMesh.material = material
      renderer.setRenderTarget(target)
      renderer.render(passScene, camera)
    }

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      const s = renderer.getDrawingBufferSize(new THREE.Vector2())
      rtA.setSize(s.x, s.y)
      rtB.setSize(s.x, s.y)
      blurMaterial.uniforms.uResolution.value.set(s.x, s.y)
      colorMapMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    window.addEventListener('resize', onResize)

    function tick() {
      frameIdRef.current = requestAnimationFrame(tick)
      timer.update() // advance the Timer; getElapsed() only moves after update()
      const elapsed = timer.getElapsed()
      distortionMaterial.uniforms.uTime.value = elapsed
      caustic1Material.uniforms.uTime.value = elapsed
      caustic2Material.uniforms.uTime.value = elapsed

      renderPass(colorMapMaterial, rtA) // Layer 1 -> rtA
      distortionMaterial.uniforms.uPreviousPass.value = rtA.texture
      renderPass(distortionMaterial, rtB) // Layer 2 -> rtB (composite target)
      renderer.autoClear = false
      renderPass(tintMaterial, rtB) // Layer 3 -> composited over rtB
      renderPass(caustic1Material, rtB) // Layer 4 -> additive caustics/bubbles
      renderer.setRenderTarget(rtB)
      renderer.render(panelScene, camera) // Layer 5 -> additive top-right panel
      renderer.autoClear = true
      blurMaterial.uniforms.uPreviousPass.value = rtB.texture
      renderPass(blurMaterial, null) // Layer 6 -> Gaussian blur to screen
    }
    tick()

    return () => {
      cancelAnimationFrame(frameIdRef.current)
      window.removeEventListener('resize', onResize)
      quadGeometry.dispose()
      colorMapMaterial.dispose()
      distortionMaterial.dispose()
      tintMaterial.dispose()
      caustic1Material.dispose()
      caustic2Geometry.dispose()
      caustic2Material.dispose()
      blurMaterial.dispose()
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
