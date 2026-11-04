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
  theme = 'blush',
  className = '',
  contentClassName = '',
  showAmbient = true,
  ambientVariant,
}: ScreenShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  // Determine background style based on theme
  const getThemeBackground = () => {
    switch (theme) {
      case 'dark':
      case 'charcoal':
        return {
          background: 'linear-gradient(180deg, #1E1A20 0%, #151217 50%, #100E12 100%)',
          color: '#FFF8F5',
        }
      case 'rose':
        return {
          background: 'linear-gradient(145deg, #2A131E 0%, #3D1828 50%, #1A0C13 100%)',
          color: '#FFFFFF',
        }
      case 'cream':
        return {
          background: 'linear-gradient(175deg, #FFFDFB 0%, #FFF8F5 50%, #FDF4EC 100%)',
          color: '#2D2329',
        }
      case 'blush':
      default:
        return {
          background: 'linear-gradient(175deg, #FFF9FA 0%, #FFF2F5 45%, #FDEAF0 85%, #FFF5F7 100%)',
          color: '#2D2329',
        }
    }
  }

  const themeStyle = getThemeBackground()
  const isDark = theme === 'dark' || theme === 'charcoal' || theme === 'rose'
  const effectiveAmbientVariant = ambientVariant || (isDark ? 'dark' : 'light')

  // Dev check: logs any element causing overflow
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
      className={`min-h-dvh w-full relative overflow-x-hidden flex flex-col items-center justify-between text-center select-none ${className}`}
      style={{
        ...themeStyle,
        boxSizing: 'border-box',
        paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(20px, env(safe-area-inset-right, 0px))',
        paddingTop: 'max(20px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Subtle floating ambient particles */}
      {showAmbient && <AmbientBackground variant={effectiveAmbientVariant} />}

      {/* Centered safe-area content wrapper */}
      <div
        className={`w-full max-w-[430px] mx-auto min-w-0 flex flex-col justify-between items-center text-center relative z-10 flex-1 overflow-x-hidden ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
