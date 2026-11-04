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
    glow: 'rgba(255, 117, 151, 0.4)',
    border: 'rgba(255, 168, 194, 0.5)',
  },
  gold: {
    baseFrom: '#F59E0B',
    baseTo: '#D97706',
    lidFrom: '#FCD34D',
    lidTo: '#F59E0B',
    ribbon: '#FFFFFF',
    accent: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'rgba(253, 230, 138, 0.5)',
  },
  red: {
    baseFrom: '#F43F5E',
    baseTo: '#BE123C',
    lidFrom: '#FB7185',
    lidTo: '#E11D48',
    ribbon: '#FFFFFF',
    accent: '#FECDD3',
    glow: 'rgba(244, 63, 94, 0.4)',
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
      whileHover={!disabled ? { scale: 1.04, y: -3 } : undefined}
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-center justify-end w-[102px] sm:w-[114px] cursor-pointer select-none group focus:outline-none"
      aria-label={isOpened ? `${title} (Opened)` : `Gift ${giftNumber} (Closed surprise)`}
    >
      {/* Box container */}
      <div className="relative w-full aspect-[4/5] flex items-end justify-center">
        {/* Soft back glow */}
        <div
          className="absolute inset-0 rounded-2xl filter blur-md pointer-events-none transition-opacity duration-300"
          style={{
            background: colors.glow,
            opacity: isOpened ? 0.35 : 0.6,
          }}
        />

        {/* ── UNOPENED MYSTERY GIFT BOX ── */}
        {!isOpened ? (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.4 + giftNumber * 0.3,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full flex flex-col items-center justify-end"
          >
            {/* Sparkle on bow */}
            <div className="absolute -top-1.5 right-1 z-20 pointer-events-none animate-pulse">
              <SparkleIcon size={12} color="#FFFFFF" />
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
                x="18"
                y="38"
                width="64"
                height="68"
                rx="12"
                fill={`url(#base-${variant})`}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant})`}
              />

              {/* Vertical White Ribbon on Body */}
              <rect
                x="43"
                y="38"
                width="14"
                height="68"
                fill="#FFFFFF"
              />
              <rect
                x="48"
                y="38"
                width="4"
                height="68"
                fill="#F3F4F6"
                opacity="0.7"
              />

              {/* Box Lid */}
              <rect
                x="12"
                y="24"
                width="76"
                height="18"
                rx="6"
                fill={`url(#lid-${variant})`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                filter={`url(#shadow-${variant})`}
              />

              {/* Horizontal White Ribbon on Lid */}
              <rect
                x="43"
                y="24"
                width="14"
                height="18"
                fill="#FFFFFF"
              />

              {/* Cute Ribbon Bow on Top */}
              <g transform="translate(0, -2)">
                {/* Left Bow Loop */}
                <path
                  d="M 50 24 C 34 10 16 14 26 25 C 33 30 45 27 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 45 22 C 34 14 24 16 30 23 C 35 27 42 25 45 22 Z"
                  fill="#F3F4F6"
                  opacity="0.85"
                />

                {/* Right Bow Loop */}
                <path
                  d="M 50 24 C 66 10 84 14 74 25 C 67 30 55 27 50 24 Z"
                  fill="#FFFFFF"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 55 22 C 66 14 76 16 70 23 C 65 27 58 25 55 22 Z"
                  fill="#F3F4F6"
                  opacity="0.85"
                />

                {/* Bow Center Knot */}
                <circle
                  cx="50"
                  cy="24"
                  r="5.5"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="0.8"
                />

                {/* Ribbon tails hanging down */}
                <path
                  d="M 46 27 C 40 33 34 38 31 43"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 54 27 C 60 33 66 38 69 43"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
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
              className="absolute -top-3 inset-x-2 z-10 aspect-square rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-neutral-900"
              style={{
                boxShadow: `0 8px 24px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
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
              className="relative w-[92%] h-[56px] rounded-b-2xl border border-white/30 overflow-hidden shadow-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.baseFrom} 0%, ${colors.baseTo} 100%)`,
              }}
            >
              {/* White ribbon band on base */}
              <div className="w-3.5 h-full bg-white shadow-inner" />

              {/* Tilted opened lid on the left */}
              <div
                className="absolute -top-2 -left-2 w-10 h-3.5 rounded-full bg-white/90 border border-black/10 -rotate-25 shadow-md"
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
              className="text-base sm:text-lg font-bold text-white tracking-wide"
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
