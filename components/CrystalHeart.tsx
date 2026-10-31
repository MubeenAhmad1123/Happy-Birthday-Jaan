'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

interface CrystalHeart3DProps {
  onPulse?: () => void
  pulsing: boolean
}

// Check if device supports smooth WebGL
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false
    // Low-end device check
    if (
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 2
    ) {
      return false
    }
    return true
  } catch {
    return false
  }
}

// Generate parametric 3D heart point cloud (~1500 points)
function generateHeartPoints(count = 1500) {
  const points: number[] = []
  const colors: number[] = []

  const color1 = new THREE.Color('#FFF8F5') // white-cream
  const color2 = new THREE.Color('#F9D5DE') // blush
  const color3 = new THREE.Color('#E56B8A') // rose
  const tempColor = new THREE.Color()

  for (let i = 0; i < count; i++) {
    // Heart parametric equations
    const t = Math.PI * (Math.random() * 2 - 1)
    const u = Math.PI * (Math.random() * 2 - 1)

    // Standard 3D heart curves
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    const z = u * 4 * Math.sin(t)

    // Jitter for volume
    const jitter = 0.8 * (Math.random() - 0.5)
    points.push(
      (x + jitter) * 0.12,
      (y + jitter) * 0.12,
      (z + jitter) * 0.12
    )

    // Color gradient based on height
    const ratio = (y + 16) / 32
    if (ratio < 0.5) {
      tempColor.lerpColors(color3, color2, ratio * 2)
    } else {
      tempColor.lerpColors(color2, color1, (ratio - 0.5) * 2)
    }

    colors.push(tempColor.r, tempColor.g, tempColor.b)
  }

  return {
    positions: new Float32Array(points),
    colors: new Float32Array(colors),
  }
}

// Pure Three.js Canvas component (lightweight, zero bundle bloat, zero SSR issue)
export default function CrystalHeartCanvas({ pulsing }: { pulsing: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth || 320
    const height = mount.clientHeight || 360

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 4.5

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)

    // Heart Particle Cloud
    const { positions, colors } = generateHeartPoints(1600)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Glowing particle texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.3, 'rgba(249, 213, 222, 0.8)')
      grad.addColorStop(0.7, 'rgba(229, 107, 138, 0.4)')
      grad.addColorStop(1, 'rgba(229, 107, 138, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
    }
    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const heartParticles = new THREE.Points(geometry, material)
    scene.add(heartParticles)

    // Outer Shimmering Halo / Ring
    const haloGeom = new THREE.BufferGeometry()
    const haloPoints: number[] = []
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2
      const radius = 2.4 + (Math.random() - 0.5) * 0.3
      haloPoints.push(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, (Math.random() - 0.5) * 0.5)
    }
    haloGeom.setAttribute('position', new THREE.Float32BufferAttribute(haloPoints, 3))
    const haloMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffb7c5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const halo = new THREE.Points(haloGeom, haloMat)
    scene.add(halo)

    // Animation Loop
    let reqId: number
    let clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth slow rotation
      heartParticles.rotation.y = elapsed * 0.5
      heartParticles.rotation.x = Math.sin(elapsed * 0.3) * 0.15

      halo.rotation.z = elapsed * 0.2
      halo.rotation.x = Math.PI / 4 + Math.sin(elapsed * 0.4) * 0.1

      // Pulse scaling
      const basePulse = 1 + Math.sin(elapsed * 2.5) * 0.04
      const pulseScale = pulsing ? 1.25 : basePulse
      heartParticles.scale.set(pulseScale, pulseScale, pulseScale)

      renderer.render(scene, camera)
    }

    animate()

    // Resize Handler
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
      haloGeom.dispose()
      haloMat.dispose()
      texture.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [pulsing])

  return <div ref={mountRef} className="w-full h-full min-h-[340px]" />
}

