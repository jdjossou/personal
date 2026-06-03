'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { bakeGradientTexture } from './gradient'
import { colorMapFrag, fullscreenVert } from './shaders'

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

    const scene = new THREE.Scene()
    // Orthographic camera covers the [-1,1]×[-1,1] clip space — standard fullscreen quad setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    // Layer 1: luminance of procedural FBM noise -> 1D blue gradient LUT.
    const gradient = bakeGradientTexture()
    const material = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: colorMapFrag,
      uniforms: {
        uGradient: { value: gradient },
        uAspect: { value: window.innerWidth / window.innerHeight },
      },
    })
    scene.add(new THREE.Mesh(geometry, material))

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    window.addEventListener('resize', onResize)

    function tick() {
      frameIdRef.current = requestAnimationFrame(tick)
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(frameIdRef.current)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      gradient.dispose()
      renderer.dispose()
    }
  }, [canvasRef])
}
