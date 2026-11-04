'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface CrystalHeartCanvasProps {
  pulsing: boolean
}

// Low-end device / WebGL detection
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false

    // Fall back on devices with very low concurrency or high dpr penalty
    const concurrency = navigator.hardwareConcurrency ?? 4
    const dpr = window.devicePixelRatio ?? 1
    if (concurrency <= 2 || dpr > 3) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export default function CrystalHeartCanvas({ pulsing }: CrystalHeartCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const pulsingRef = useRef(pulsing)
  pulsingRef.current = pulsing

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 320
    const height = mount.clientHeight || 360

    // 1. Scene, Camera (fixed at z=6, fov=45)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 6)

    // 2. Renderer (capped at dpr 2 for performance)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mount.appendChild(renderer.domElement)

    // 3. Heart Geometry using THREE.Shape with Bezier curves
    const shape = new THREE.Shape()
    // Top center dip
    shape.moveTo(0, 0.42)
    // Left upper lobe
    shape.bezierCurveTo(-0.12, 0.8, -0.65, 0.9, -0.9, 0.52)
    // Left bottom tip
    shape.bezierCurveTo(-1.12, 0.15, -0.82, -0.42, 0, -1.15)
    // Right bottom tip to right lobe
    shape.bezierCurveTo(0.82, -0.42, 1.12, 0.15, 0.9, 0.52)
    // Right upper lobe to top dip
    shape.bezierCurveTo(0.65, 0.9, 0.12, 0.8, 0, 0.42)

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.48,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    // Critical: center the heart so rotation is around geometric centroid
    geometry.center()

    // 4. Faceted Crystal Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xE56B8A,
      emissive: 0x4A1020,
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.08,
      transmission: 0.65,
      ior: 1.52,
      reflectivity: 0.9,
      flatShading: true, // Crystal faceted look
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    })

    const heartMesh = new THREE.Mesh(geometry, material)
    // Fitted scale for 60dvh container with camera at z=6
    heartMesh.scale.set(1.45, 1.45, 1.45)
    scene.add(heartMesh)

    // 5. 800 - 1000 Sparkle Points surrounding the heart
    const sparkleCount = 900
    const sparklePositions = new Float32Array(sparkleCount * 3)
    const sparkleOriginalRadii = new Float32Array(sparkleCount)
    const sparkleAngles = new Float32Array(sparkleCount)
    const sparkleSpeeds = new Float32Array(sparkleCount)

    for (let i = 0; i < sparkleCount; i++) {
      const radius = 1.6 + Math.random() * 1.8
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 2.8
      const z = (Math.random() - 0.5) * 2.2

      sparklePositions[i * 3] = Math.cos(angle) * radius
      sparklePositions[i * 3 + 1] = y
      sparklePositions[i * 3 + 2] = z

      sparkleOriginalRadii[i] = radius
      sparkleAngles[i] = angle
      sparkleSpeeds[i] = 0.2 + Math.random() * 0.4
    }

    const sparkleGeom = new THREE.BufferGeometry()
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))

    // Sparkle texture
    const sparkleCanvas = document.createElement('canvas')
    sparkleCanvas.width = 32
    sparkleCanvas.height = 32
    const ctx = sparkleCanvas.getContext('2d')
    if (ctx) {
      const radGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      radGrad.addColorStop(0.3, 'rgba(249, 213, 222, 0.9)')
      radGrad.addColorStop(0.7, 'rgba(232, 194, 122, 0.4)')
      radGrad.addColorStop(1, 'rgba(229, 107, 138, 0)')
      ctx.fillStyle = radGrad
      ctx.fillRect(0, 0, 32, 32)
    }
    const sparkleTex = new THREE.CanvasTexture(sparkleCanvas)

    const sparkleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: sparkleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const sparkles = new THREE.Points(sparkleGeom, sparkleMat)
    scene.add(sparkles)

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f5, 1.2)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
    mainLight.position.set(3, 4, 5)
    scene.add(mainLight)

    const pinkFillLight = new THREE.PointLight(0xE56B8A, 2.5, 10)
    pinkFillLight.position.set(-2, -1, 3)
    scene.add(pinkFillLight)

    const goldAccentLight = new THREE.PointLight(0xE8C27A, 1.5, 8)
    goldAccentLight.position.set(2, 2, -1)
    scene.add(goldAccentLight)

    // 7. Animation loop with pendulum swing (NEVER full 360 spin)
    let reqId: number
    const clock = new THREE.Clock()
    let currentScale = 1.45

    const maxSwingRad = (32 * Math.PI) / 180 // +-32 degrees swing

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Swing gently around Y (+- 32 deg) so the heart is ALWAYS facing front and never a line!
      heartMesh.rotation.y = Math.sin(elapsed * 0.75) * maxSwingRad
      heartMesh.rotation.x = Math.sin(elapsed * 0.4) * 0.08
      heartMesh.rotation.z = Math.cos(elapsed * 0.5) * 0.04

      // Gentle continuous breathing + tap pulse
      const isTapPulsing = pulsingRef.current
      const targetScale = isTapPulsing ? 1.85 : 1.45 + Math.sin(elapsed * 2.2) * 0.05
      currentScale += (targetScale - currentScale) * 0.15
      heartMesh.scale.set(currentScale, currentScale, currentScale)

      // Orbit sparkles gently
      sparkles.rotation.y = elapsed * 0.18

      renderer.render(scene, camera)
    }

    animate()

    // 8. Resize handler
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      sparkleGeom.dispose()
      sparkleMat.dispose()
      sparkleTex.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: 'min(55dvh, 380px)', width: '100%' }}
    />
  )
}
