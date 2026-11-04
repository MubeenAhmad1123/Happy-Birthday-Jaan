'use client'

import React, { useState, useEffect, useRef } from 'react'
import CharacterSticker, { CharacterType } from './CharacterSticker'

interface AnimatedStickerProps {
  name: string
  videoUrl?: string
  fallbackType?: CharacterType
  size?: number
  className?: string
  priority?: boolean
  animation?: 'float' | 'bounce' | 'breathe' | 'none'
}

export default function AnimatedSticker({
  name,
  videoUrl,
  fallbackType,
  size = 150,
  className = '',
  priority = false,
  animation = 'float',
}: AnimatedStickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [hasVideoError, setHasVideoError] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(priority)

  // Check user preference for reduced motion or save-data
  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    // Check navigator.connection saveData
    const nav = navigator as any
    if (nav.connection?.saveData) {
      setReduceMotion(true)
    }

    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  // IntersectionObserver to pause/play video when off-screen (saves battery/perf)
  useEffect(() => {
    if (priority || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {})
            } else {
              videoRef.current.pause()
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const posterPath = `/characters/${name}.png`
  const webmPath = videoUrl || `/characters/anim/${name}.webm`
  const mp4Path = `/characters/anim/${name}.mp4`

  // Map idle animation class
  const getAnimationClass = () => {
    if (reduceMotion || animation === 'none') return ''
    switch (animation) {
      case 'bounce':
        return 'animate-gentle-bounce'
      case 'breathe':
        return 'animate-pulse-glow'
      case 'float':
      default:
        return 'animate-float'
    }
  }

  const effectiveCharacterType = (fallbackType || name) as CharacterType

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center select-none overflow-hidden ${getAnimationClass()} ${className}`}
      style={{
        width: size,
        height: size,
        contain: 'paint layout',
      }}
    >
      {/* 1. Video animation (if not disabled by reduced motion / error) */}
      {!reduceMotion && !hasVideoError && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay={isVisible}
          preload={priority ? 'auto' : 'none'}
          poster={posterPath}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasVideoError(true)}
          className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: size, height: size }}
        >
          {videoUrl ? (
            <source src={videoUrl} type="video/mp4" />
          ) : (
            <>
              <source src={webmPath} type="video/webm" />
              <source src={mp4Path} type="video/mp4" />
            </>
          )}
        </video>
      )}

      {/* 2. Fallback PNG / SVG Character Sticker (visible while video loads or if video is unavailable) */}
      {(!isVideoLoaded || hasVideoError || reduceMotion) && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isVideoLoaded && !hasVideoError && !reduceMotion ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <CharacterSticker
            type={effectiveCharacterType}
            size={size}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
