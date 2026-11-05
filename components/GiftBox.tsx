'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SparkleIcon, CheckIcon } from './Icons'

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
    baseFrom: '#FF7597',
    baseTo: '#E55B7F',
    lidFrom: '#FFA2B8',
    lidTo: '#FF6B8B',
    ribbon: '#FFFFFF',
    accent: '#FFA8C2',
    glow: 'rgba(255, 117, 151, 0.45)',
    border: 'rgba(255, 168, 194, 0.5)',
  },
  gold: {
    baseFrom: '#F59E0B',
    baseTo: '#D97706',
    lidFrom: '#FCD34D',
    lidTo: '#F59E0B',
    ribbon: '#FFFFFF',
    accent: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.45)',
    border: 'rgba(253, 230, 138, 0.5)',
  },
  red: {
    baseFrom: '#F43F5E',
    baseTo: '#BE123C',
    lidFrom: '#FB7185',
    lidTo: '#E11D48',
    ribbon: '#FFFFFF',
    accent: '#FECDD3',
    glow: 'rgba(244, 63, 94, 0.45)',
    border: 'rgba(254, 205, 211, 0.5)',
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
      className="relative flex flex-col items-center justify-end w-[min(116px,29.5vw)] sm:w-[126px] cursor-pointer select-none group focus:outline-none"
      aria-label={isOpened ? `${title} (Opened)` : `Gift ${giftNumber} (Closed surprise)`}
    >
      {/* Box container */}
      <div className="relative w-full aspect-[4/5] flex items-end justify-center">
        {/* Soft back glow */}
        <div
          className="absolute inset-0 rounded-2xl filter blur-md pointer-events-none transition-opacity duration-300"
          style={{
            background: colors.glow,
            opacity: isOpened ? 0.4 : 0.65,
          }}
        />

        {/* ── UNOPENED MYSTERY GIFT BOX ── */}
        {!isOpened ? (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.4 + giftNumber * 0.3,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full flex flex-col items-center justify-end"
          >
            {/* Sparkle on bow */}
            <div className="absolute -top-2 right-1 z-20 pointer-events-none animate-pulse">
              <SparkleIcon size={14} color="#FFFFFF" />
            </div>

            {/* SVG Gift Box with crisp ribbon and double-loop bow */}
            <svg
              viewBox="0 0 100 115"
              className="w-full h-full drop-shadow-xl overflow-visible"
            >
              <defs>
                <linearGradient id={`base-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.baseFrom} />
                  <stop offset="100%" stopColor={colors.baseTo} />
                </linearGradient>
                <linearGradient id={`lid-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.lidFrom} />
                  <stop offset="100%" stopColor={colors.lidTo} />
                </linearGradient>
                <filter id={`shadow-${variant}`} x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Box Body */}
              <rect
                x="15"
                y="36"
                width="70"
                height="72"
                rx="14"
                fill={`url(#base-${variant})`}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant})`}
              />

              {/* Vertical White Ribbon on Body */}
              <rect
                x="42"
                y="36"
                width="16"
                height="72"
                fill="#FFFFFF"
              />
              <rect
                x="47"
                y="36"
                width="5"
                height="72"
                fill="#F3F4F6"
                opacity="0.75"
              />

              {/* Box Lid */}
              <rect
                x="9"
                y="20"
                width="82"
                height="20"
                rx="7"
                fill={`url(#lid-${variant})`}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant})`}
              />

              {/* Horizontal White Ribbon on Lid */}
              <rect
                x="42"
                y="20"
                width="16"
                height="20"
                fill="#FFFFFF"
              />

              {/* Cute Ribbon Bow on Top */}
              <g transform="translate(0, -5)">
                {/* Left Bow Loop */}
                <path
                  d="M 50 24 C 32 8 14 12 24 25 C 31 31 44 28 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 45 22 C 32 12 21 15 28 23 C 33 27 41 25 45 22 Z"
                  fill="#F3F4F6"
                  opacity="0.85"
                />

                {/* Right Bow Loop */}
                <path
                  d="M 50 24 C 68 8 86 12 76 25 C 69 31 56 28 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 55 22 C 68 12 79 15 72 23 C 67 27 59 25 55 22 Z"
                  fill="#F3F4F6"
                  opacity="0.85"
                />

                {/* Bow Center Knot */}
                <circle
                  cx="50"
                  cy="24"
                  r="6.5"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="0.8"
                />

                {/* Ribbon tails hanging down */}
                <path
                  d="M 46 27 C 39 34 32 40 28 46"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 54 27 C 61 34 68 40 72 46"
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
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-4 inset-x-1 z-10 aspect-square rounded-2xl overflow-hidden border-2 border-white/90 shadow-2xl bg-neutral-900"
              style={{
                boxShadow: `0 10px 28px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
              {/* Subtle glossy sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/15 pointer-events-none" />
            </motion.div>

            {/* Box base holding the gift */}
            <div
              className="relative w-[95%] h-[62px] rounded-b-2xl border border-white/35 overflow-hidden shadow-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.baseFrom} 0%, ${colors.baseTo} 100%)`,
              }}
            >
              {/* White ribbon band on base */}
              <div className="w-4 h-full bg-white shadow-inner" />

              {/* Tilted opened lid on the left */}
              <div
                className="absolute -top-2.5 -left-2 w-11 h-4 rounded-full bg-white/90 border border-black/10 -rotate-25 shadow-md"
              />

              {/* Completed Checkmark Badge */}
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border border-white/80">
                <CheckIcon size={12} color="#FFFFFF" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Label underneath */}
      <div className="mt-2 text-center flex flex-col items-center">
        {!isOpened ? (
          <div className="flex items-center gap-1">
            <span
              className="text-lg sm:text-xl font-bold text-white tracking-wide"
              style={{
                fontFamily: 'var(--font-caveat)',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              gift {giftNumber}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center leading-tight">
            <span
              className="text-xs sm:text-sm font-bold text-white tracking-wide"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              {urduTitle}
            </span>
            <span
              className="text-[10px] text-[#FFD97D] font-bold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Opened ✓
            </span>
          </div>
        )}
      </div>
    </motion.button>
  )
}
