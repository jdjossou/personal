'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

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
    // Deep navy: (0.024, 0.039, 0.169) from P3R color_mapping gradient stop 0
    const material = new THREE.MeshBasicMaterial({ color: 0x060a2b })
    scene.add(new THREE.Mesh(geometry, material))

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
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
      renderer.dispose()
    }
  }, [canvasRef])
}
