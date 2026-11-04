'use client'

import React, { useEffect, useRef } from 'react'
import AmbientBackground from './AmbientBackground'

export type ScreenTheme = 'dark' | 'charcoal' | 'blush' | 'cream' | 'rose'

interface ScreenShellProps {
  children: React.ReactNode
  theme?: ScreenTheme
  className?: string
  contentClassName?: string
  showAmbient?: boolean
  ambientVariant?: 'dark' | 'light'
}

const THEME_STYLES: Record<ScreenTheme, { bg: string; text: string }> = {
  dark: {
    bg: 'linear-gradient(175deg, #121014 0%, #1A151C 50%, #121014 100%)',
    text: '#FFF8F5',
  },
  charcoal: {
    bg: 'linear-gradient(160deg, #1E1A20 0%, #151218 60%, #121014 100%)',
    text: '#FFF8F5',
  },
  blush: {
    bg: 'linear-gradient(160deg, #FFF8F5 0%, #FFF0F4 50%, #F9D5DE 100%)',
    text: '#3A3036',
  },
  cream: {
    bg: 'linear-gradient(160deg, #FFFDF9 0%, #FFF5F7 60%, #F9D5DE 100%)',
    text: '#3A3036',
  },
  rose: {
    bg: 'linear-gradient(160deg, #2A1721 0%, #1E1A20 60%, #121014 100%)',
    text: '#FFF8F5',
  },
}

export default function ScreenShell({
  children,
  theme = 'dark',
  className = '',
  contentClassName = '',
  showAmbient = true,
  ambientVariant,
}: ScreenShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark' || theme === 'charcoal' || theme === 'rose'
  const activeAmbientVariant = ambientVariant || (isDark ? 'dark' : 'light')
  const themeStyle = THEME_STYLES[theme] || THEME_STYLES.dark

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
      className={`min-h-dvh w-full relative overflow-x-hidden flex flex-col items-center justify-between transition-colors duration-500 ${className}`}
      style={{
        background: themeStyle.bg,
        color: themeStyle.text,
        boxSizing: 'border-box',
        paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(20px, env(safe-area-inset-right, 0px))',
        paddingTop: 'max(16px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Subtle ambient particle animation */}
      {showAmbient && <AmbientBackground variant={activeAmbientVariant} />}

      {/* Centred safe-area content wrapper capped at 480px */}
      <div
        className={`w-full max-w-[480px] mx-auto min-w-0 flex flex-col justify-between items-center relative z-10 flex-1 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
