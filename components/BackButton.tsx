'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from './Icons'
import { buzz } from '@/lib/feedback'

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
  'aria-label'?: string
}

export default function BackButton({
  onClick,
  label = 'Back',
  className = '',
  'aria-label': ariaLabel,
}: BackButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => {
        buzz(10)
        onClick()
      }}
      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer select-none group touch-manipulation backdrop-blur-md relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(229, 107, 138, 0.35) 0%, rgba(30, 22, 32, 0.92) 100%)',
        border: '1.5px solid rgba(255, 117, 151, 0.75)',
        boxShadow: '0 4px 18px rgba(229, 107, 138, 0.38), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
        color: '#FFFFFF',
        fontFamily: 'var(--font-baloo)',
      }}
      aria-label={ariaLabel || label}
    >
      {/* Subtle glowing sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none opacity-80" />

      {/* Pure White Arrow */}
      <ArrowLeftIcon size={15} color="#FFFFFF" />

      {/* Pure White Glowing Text with Shadow */}
      <span
        style={{
          color: '#FFFFFF',
          textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.7)',
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
    </motion.button>
  )
}

