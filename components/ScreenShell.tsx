'use client'

import React, { useEffect, useRef } from 'react'
import AmbientBackground from './AmbientBackground'

export type ScreenTheme = 'blush' | 'cream' | 'rose' | 'dark' | 'charcoal'

interface ScreenShellProps {
  children: React.ReactNode
  theme?: ScreenTheme
  className?: string
  contentClassName?: string
  showAmbient?: boolean
  ambientVariant?: 'light' | 'dark'
}

export default function ScreenShell({
  children,
  className = '',
  contentClassName = '',
  showAmbient = true,
}: ScreenShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  // Development check: logs any element wider than viewport to eliminate horizontal scroll
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      const checkOverflow = () => {
        const vw = document.documentElement.clientWidth
        const allElements = document.querySelectorAll('*')
        allElements.forEach((el) => {
          if (el.scrollWidth > vw + 1) {
            console.warn('⚠️ Overflow detected:', el, 'width:', el.scrollWidth, 'viewport:', vw)
          }
        })
      }
      const timer = setTimeout(checkOverflow, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={shellRef}
      className={`min-h-dvh w-full relative overflow-x-hidden flex flex-col items-center justify-between ${className}`}
      style={{
        background: 'linear-gradient(175deg, #FFF9FA 0%, #FFF2F5 45%, #FDEAF0 85%, #FFF5F7 100%)',
        color: '#2D2329',
        boxSizing: 'border-box',
        paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
        paddingTop: 'max(14px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(18px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Subtle floating ambient hearts and petals */}
      {showAmbient && <AmbientBackground variant="light" />}

      {/* Centred safe-area content wrapper capped at 440px for ideal mobile reading */}
      <div
        className={`w-full max-w-[440px] mx-auto min-w-0 flex flex-col justify-between items-center relative z-10 flex-1 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
