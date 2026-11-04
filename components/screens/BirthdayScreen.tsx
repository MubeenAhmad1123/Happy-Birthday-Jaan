'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { SparkleIcon } from '@/components/Icons'

interface BirthdayScreenProps {
  onNext: () => void
}

export default function BirthdayScreen({ onNext }: BirthdayScreenProps) {
  // Confetti burst once on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A', '#FFFFFF'],
      })
    } catch {
      // ignore
    }
  }, [])

  return (
    <ScreenShell theme="blush" showAmbient={true}>
      <div className="w-full flex flex-col items-center justify-between my-auto py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 w-full max-w-sm text-center z-10"
        >
          {/* Animated Birthday Cake sticker */}
          <AnimatedSticker
            name="dudu-bubu-cake"
            fallbackType="dudu-bubu-bday"
            size={165}
            priority={true}
            animation="bounce"
          />

          {/* Heading */}
          <div className="flex flex-col items-center gap-1.5 px-2">
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="heading-fluid leading-tight text-deep-rose"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: 'var(--deep-rose)',
                textShadow: '0 2px 12px rgba(229,107,138,0.25)',
              }}
            >
              Happy Birthday, Maria
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl sm:text-3xl font-medium"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: 'var(--rose)',
              }}
            >
              meri Jaan, meri Sukoon
            </motion.p>
          </div>

          {/* Milestone Badge with Gold Star Icons */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 280 }}
            className="card-cream px-5 py-2 inline-flex items-center gap-2 rounded-full border border-rose-200/60 shadow-md"
          >
            <SparkleIcon size={16} color="var(--soft-gold)" />
            <span
              className="text-base sm:text-lg font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
            >
              Turning 25 on 5 November 2026
            </span>
            <SparkleIcon size={16} color="var(--soft-gold)" />
          </motion.div>

          {/* Big Glowing Heart-Shaped Button */}
          <motion.div
            className="mt-3 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Glow Aura */}
              <div
                className="absolute w-24 h-24 rounded-full pointer-events-none animate-pulse-glow"
                style={{
                  background: 'radial-gradient(circle, rgba(229,107,138,0.45) 0%, rgba(184,64,94,0) 70%)',
                }}
              />

              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.06 }}
                onClick={onNext}
                className="relative w-20 h-20 flex flex-col items-center justify-center cursor-pointer select-none drop-shadow-xl"
                style={{ touchAction: 'manipulation' }}
                aria-label="Tap karo - aage dekho"
              >
                {/* SVG Heart Body with Rose Gradient */}
                <svg
                  viewBox="0 0 100 95"
                  className="w-full h-full filter drop-shadow-md"
                >
                  <defs>
                    <linearGradient id="heartButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF7597" />
                      <stop offset="50%" stopColor="#E56B8A" />
                      <stop offset="100%" stopColor="#B8405E" />
                    </linearGradient>
                    <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#B8405E" floodOpacity="0.4" />
                    </filter>
                  </defs>
                  <path
                    d="M50 88 C20 62 4 45 4 28 C4 13 15 4 30 4 C39 4 46 8 50 16 C54 8 61 4 70 4 C85 4 96 13 96 28 C96 45 80 62 50 88 Z"
                    fill="url(#heartButtonGrad)"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    filter="url(#heartGlow)"
                  />
                  {/* Subtle inner highlight */}
                  <path
                    d="M30 10 C20 10 12 16 12 26 C12 34 18 44 26 52"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>

                {/* Text centered inside the heart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none pt-1">
                  <span
                    className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white"
                    style={{
                      fontFamily: 'var(--font-baloo)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Tap karo
                  </span>
                </div>
              </motion.button>
            </div>

            <span
              className="text-sm font-medium opacity-80 mt-1"
              style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
            >
              Aage dekho Jaan
            </span>
          </motion.div>
        </motion.div>
      </div>
    </ScreenShell>
  )
}
