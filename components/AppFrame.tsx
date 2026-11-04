'use client'

import React, { useEffect, useRef } from 'react'
import { unlockAudio } from '@/lib/feedback'
import MuteToggle from './MuteToggle'

interface AppFrameProps {
  children: React.ReactNode
  className?: string
  showMuteToggle?: boolean
}

export default function AppFrame({
  children,
  className = '',
  showMuteToggle = true,
}: AppFrameProps) {
  const hasUnlockedRef = useRef(false)

  // Lazily unlock WebAudio AudioContext on the very first user interaction
  useEffect(() => {
    const handleFirstTap = () => {
      if (!hasUnlockedRef.current) {
        hasUnlockedRef.current = true
        unlockAudio()
      }
    }

    window.addEventListener('pointerdown', handleFirstTap, { once: true, passive: true })
    window.addEventListener('touchstart', handleFirstTap, { once: true, passive: true })

    return () => {
      window.removeEventListener('pointerdown', handleFirstTap)
      window.removeEventListener('touchstart', handleFirstTap)
    }
  }, [])

  return (
    <div
      className={`min-h-dvh w-full bg-[#121014] flex justify-center items-center relative overflow-x-hidden ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 30%, rgba(229, 107, 138, 0.16) 0%, rgba(18, 16, 20, 0.95) 60%, #121014 100%)',
      }}
    >
      {/* Centered phone shell: full width on mobile, max 430px on desktop */}
      <div
        className="w-full max-w-[430px] min-h-dvh mx-auto relative overflow-x-hidden flex flex-col sm:shadow-[0_0_80px_rgba(0,0,0,0.8)] sm:border-x sm:border-[#382833]/50"
        style={{
          boxSizing: 'border-box',
        }}
      >
        {showMuteToggle && <MuteToggle />}
        {children}
      </div>
    </div>
  )
}
