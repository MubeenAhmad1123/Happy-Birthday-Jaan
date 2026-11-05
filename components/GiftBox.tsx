'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SparkleIcon, CheckIcon, HeartIcon } from './Icons'

export type GiftVariant = 'pink' | 'gold' | 'red'

interface GiftBoxProps {
  variant: GiftVariant
  giftNumber: number
  isOpened: boolean
  thumbnail: string
  title: string
  urduTitle: string
  onClick: () => void
  disabled?: boolean
}

const COLOR_SCHEMES = {
  pink: {
    baseFrom: '#FF6584',
    baseTo: '#E0476E',
    lidFrom: '#FFA0B6',
    lidTo: '#FF6584',
    ribbon: '#FFFFFF',
    ribbonShade: '#FFE5EC',
    glow: 'rgba(255, 101, 132, 0.5)',
    border: '#FFA3B8',
  },
  gold: {
    baseFrom: '#F59E0B',
    baseTo: '#C97103',
    lidFrom: '#FCD34D',
    lidTo: '#F59E0B',
    ribbon: '#FFFFFF',
    ribbonShade: '#FEF3C7',
    glow: 'rgba(245, 158, 11, 0.5)',
    border: '#FDE68A',
  },
  red: {
    baseFrom: '#F43F5E',
    baseTo: '#B91C1C',
    lidFrom: '#FB7185',
    lidTo: '#E11D48',
    ribbon: '#FFFFFF',
    ribbonShade: '#FFE4E6',
    glow: 'rgba(244, 63, 94, 0.5)',
    border: '#FECDD3',
  },
}

export default function GiftBox({
  variant,
  giftNumber,
  isOpened,
  thumbnail,
  title,
  urduTitle,
  onClick,
  disabled = false,
}: GiftBoxProps) {
  const colors = COLOR_SCHEMES[variant]

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -4 } : undefined}
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-center justify-end flex-1 min-w-[96px] max-w-[124px] h-[155px] sm:h-[170px] shrink-0 cursor-pointer select-none group focus:outline-none touch-manipulation"
      style={{ color: '#FFFFFF' }}
      aria-label={isOpened ? `${title} (Opened)` : `Gift ${giftNumber} (Closed surprise)`}
    >
      {/* Box visual container */}
      <div className="relative w-full h-[115px] sm:h-[125px] flex items-end justify-center">
        {/* Soft radial back glow */}
        <div
          className="absolute inset-0 rounded-2xl filter blur-md pointer-events-none transition-opacity duration-300"
          style={{
            background: colors.glow,
            opacity: isOpened ? 0.35 : 0.65,
          }}
        />

        {/* ── UNOPENED MYSTERY GIFT BOX ── */}
        {!isOpened ? (
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.2 + giftNumber * 0.3,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full flex flex-col items-center justify-end"
          >
            {/* Sparkles & Floating Heart */}
            <div className="absolute -top-3 right-1 z-20 pointer-events-none animate-pulse">
              <SparkleIcon size={14} color="#FFF8F0" />
            </div>
            <motion.div
              animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6], scale: [0.85, 1.05, 0.85] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: giftNumber * 0.4 }}
              className="absolute -top-3.5 left-2 z-20 pointer-events-none"
            >
              <HeartIcon size={11} color="#FFD9E2" />
            </motion.div>

            {/* SVG Gift Box */}
            <svg
              viewBox="0 0 100 115"
              className="w-full h-full drop-shadow-2xl overflow-visible"
            >
              <defs>
                <linearGradient id={`base-${variant}-${giftNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.baseFrom} />
                  <stop offset="100%" stopColor={colors.baseTo} />
                </linearGradient>
                <linearGradient id={`lid-${variant}-${giftNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.lidFrom} />
                  <stop offset="100%" stopColor={colors.lidTo} />
                </linearGradient>
                <filter id={`shadow-${variant}-${giftNumber}`} x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Box Body */}
              <rect
                x="14"
                y="36"
                width="72"
                height="74"
                rx="14"
                fill={`url(#base-${variant}-${giftNumber})`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant}-${giftNumber})`}
              />

              {/* Vertical White Ribbon on Body */}
              <rect
                x="42"
                y="36"
                width="16"
                height="74"
                fill="#FFFFFF"
              />
              <rect
                x="47"
                y="36"
                width="6"
                height="74"
                fill={colors.ribbonShade}
                opacity="0.8"
              />

              {/* Box Lid with 3D overhang */}
              <rect
                x="8"
                y="20"
                width="84"
                height="21"
                rx="7"
                fill={`url(#lid-${variant}-${giftNumber})`}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant}-${giftNumber})`}
              />

              {/* Horizontal White Ribbon on Lid */}
              <rect
                x="42"
                y="20"
                width="16"
                height="21"
                fill="#FFFFFF"
              />

              {/* Cute Ribbon Bow on Top */}
              <g transform="translate(0, -6)">
                {/* Left Bow Loop */}
                <path
                  d="M 50 24 C 30 7 12 11 22 25 C 29 32 43 28 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 45 22 C 30 11 19 14 26 23 C 31 28 40 26 45 22 Z"
                  fill={colors.ribbonShade}
                  opacity="0.85"
                />

                {/* Right Bow Loop */}
                <path
                  d="M 50 24 C 70 7 88 11 78 25 C 71 32 57 28 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 55 22 C 70 11 81 14 74 23 C 69 28 60 26 55 22 Z"
                  fill={colors.ribbonShade}
                  opacity="0.85"
                />

                {/* Bow Center Knot */}
                <circle
                  cx="50"
                  cy="24"
                  r="7"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />

                {/* Ribbon tails hanging down */}
                <path
                  d="M 46 27 C 38 34 31 41 27 48"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 54 27 C 62 34 69 41 73 48"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </svg>
          </motion.div>
        ) : (
          /* ── OPENED GIFT BOX (Surprise Peeking Out!) ── */
          <div className="relative w-full h-full flex flex-col items-center justify-end">
            {/* Surprise Artwork Card peeking out */}
            <motion.div
              initial={{ scale: 0.9, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-5 inset-x-1 z-10 aspect-square rounded-2xl overflow-hidden border-2 border-white/95 shadow-2xl bg-neutral-900"
              style={{
                boxShadow: `0 12px 30px ${colors.glow}, 0 4px 12px rgba(0,0,0,0.5)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
              {/* Subtle glossy sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/20 pointer-events-none" />
            </motion.div>

            {/* Box base holding the gift */}
            <div
              className="relative w-[96%] h-[60px] rounded-b-2xl border border-white/40 overflow-hidden shadow-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.baseFrom} 0%, ${colors.baseTo} 100%)`,
              }}
            >
              {/* White ribbon band on base */}
              <div className="w-4 h-full bg-white shadow-inner" />

              {/* Tilted opened lid on the left */}
              <div
                className="absolute -top-3 -left-2 w-11 h-4 rounded-full bg-white/95 border border-black/10 -rotate-25 shadow-md"
              />

              {/* Completed Checkmark Badge */}
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border border-white/90">
                <CheckIcon size={12} color="#FFFFFF" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Label underneath - guaranteed white and gold, immune to any CSS parent override */}
      <div className="mt-2 text-center flex flex-col items-center w-full px-0.5">
        {!isOpened ? (
          <div className="flex items-center justify-center gap-1">
            <span
              className="text-base sm:text-lg font-bold tracking-wide select-none"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-caveat)',
                textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 0 12px rgba(229,107,138,0.4)',
              }}
            >
              gift {giftNumber}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center leading-tight w-full">
            <span
              className="text-xs sm:text-sm font-bold tracking-wide truncate max-w-full"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-baloo)',
                textShadow: '0 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              {urduTitle}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: '#FFD97D',
                fontFamily: 'var(--font-baloo)',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              Opened ✓
            </span>
          </div>
        )}
      </div>
    </motion.button>
  )
}
