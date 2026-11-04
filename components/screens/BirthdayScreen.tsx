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
        particleCount: 75,
        spread: 65,
        origin: { y: 0.5 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A', '#FFFFFF'],
      })
    } catch {
      // ignore
    }
  }, [])

  return (
    <ScreenShell theme="blush" showAmbient={true} contentClassName="justify-between py-4">
      {/* Centered vertical stack */}
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 my-auto z-10 text-center">
        {/* Animated Cake Sticker (~60% screen width, gentle float) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <AnimatedSticker
            name="dudu-bubu-cake"
            fallbackType="dudu-bubu-bday"
            size={200}
            priority={true}
            animation="float"
          />
        </motion.div>

        {/* Text Stack */}
        <div className="flex flex-col items-center gap-0.5 w-full max-w-sm px-2 text-center">
          {/* Small script line: "Happy Birthday," */}
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-2xl sm:text-3xl font-medium tracking-wide text-rose-500"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            Happy Birthday,
          </motion.p>

          {/* Huge script: "Maria" */}
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="leading-none text-center font-bold tracking-tight my-1"
            style={{
              fontFamily: 'var(--font-dancing)',
              fontSize: 'clamp(3.5rem, 18vw, 5.5rem)',
              background: 'linear-gradient(135deg, #FF6B8B 0%, #E56B8A 50%, #B8405E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 14px rgba(229,107,138,0.3))',
            }}
          >
            Maria
          </motion.h1>

          {/* Caveat script: "meri Jaan, meri Sukoon" */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-2xl sm:text-[1.7rem] font-bold text-deep-rose mt-0.5"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            meri Jaan, meri Sukoon
          </motion.p>
        </div>

        {/* Milestone Pill: "Turning 25 on 5 November 2026" */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260 }}
          className="max-w-full whitespace-normal px-4 py-1.5 rounded-full border border-rose-300/80 bg-white/90 shadow-sm inline-flex items-center justify-center gap-2 my-1"
        >
          <SparkleIcon size={15} color="#D4AF37" />
          <span
            className="text-sm sm:text-base font-bold tracking-wide text-deep-rose text-center break-words"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Turning 25 on 5 November 2026
          </span>
          <SparkleIcon size={15} color="#D4AF37" />
        </motion.div>
      </div>

      {/* Bottom Center: 88px Glowing Heart Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full flex flex-col items-center gap-2 pb-2 z-20"
      >
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Pulse Ring */}
          <div
            className="absolute w-28 h-28 rounded-full pointer-events-none animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(229,107,138,0.4) 0%, rgba(184,64,94,0) 70%)',
            }}
          />

          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={onNext}
            className="relative w-[88px] h-[88px] flex flex-col items-center justify-center cursor-pointer select-none drop-shadow-xl"
            style={{ touchAction: 'manipulation' }}
            aria-label="Tap karo"
          >
            {/* SVG Heart with Rose Gradient */}
            <svg
              viewBox="0 0 100 95"
              className="w-full h-full filter drop-shadow-md"
            >
              <defs>
                <linearGradient id="bdayHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7597" />
                  <stop offset="50%" stopColor="#E56B8A" />
                  <stop offset="100%" stopColor="#B8405E" />
                </linearGradient>
                <filter id="bdayHeartGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#B8405E" floodOpacity="0.45" />
                </filter>
              </defs>
              <path
                d="M50 88 C20 62 4 45 4 28 C4 13 15 4 30 4 C39 4 46 8 50 16 C54 8 61 4 70 4 C85 4 96 13 96 28 C96 45 80 62 50 88 Z"
                fill="url(#bdayHeartGrad)"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#bdayHeartGlow)"
              />
              {/* Inner subtle specular sheen */}
              <path
                d="M30 10 C20 10 12 16 12 26 C12 34 18 44 26 52"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
            </svg>

            {/* Inner Heart Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-1">
              <svg width="28" height="26" viewBox="0 0 24 22" fill="#FFFFFF">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </motion.button>
        </div>

        {/* Small label "Tap karo" in Baloo 2 below it */}
        <span
          className="text-sm font-bold tracking-wider uppercase text-deep-rose mt-1"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Tap karo
        </span>
      </motion.div>
    </ScreenShell>
  )
}
