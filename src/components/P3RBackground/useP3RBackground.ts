'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { bakeBubblesMaskTexture, bakeGradientTexture } from './gradient'
import { bakeBubblesTexture, bakePatternTexture } from './noise'
import { caustic1Frag, colorMapFrag, distortionFrag, fullscreenVert } from './shaders'

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
    // A second target (rtB) gets introduced for ping-pong once layers 3+ land.

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
      colorMapMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    window.addEventListener('resize', onResize)

    function tick() {
      frameIdRef.current = requestAnimationFrame(tick)
      timer.update() // advance the Timer; getElapsed() only moves after update()
      const elapsed = timer.getElapsed()
      distortionMaterial.uniforms.uTime.value = elapsed
      caustic1Material.uniforms.uTime.value = elapsed

      renderPass(colorMapMaterial, rtA) // Layer 1 -> off-screen
      distortionMaterial.uniforms.uPreviousPass.value = rtA.texture
      renderPass(distortionMaterial, null) // Layer 2 -> screen
      renderer.autoClear = false
      renderPass(tintMaterial, null) // Layer 3 -> composited over screen
      renderPass(caustic1Material, null) // Layer 4 -> additive caustics/bubbles
      renderer.autoClear = true
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
      rtA.dispose()
      gradient.dispose()
      patternTexture.dispose()
      bubblesTexture.dispose()
      bubblesMask.dispose()
      patternMask.dispose()
      renderer.dispose()
    }
  }, [canvasRef])
}
