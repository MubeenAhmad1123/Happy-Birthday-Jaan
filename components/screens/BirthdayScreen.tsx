'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { SparkleIcon, PlayIcon, PauseIcon } from '@/components/Icons'
import { buzz, softChime } from '@/lib/feedback'
import { startSong, pauseSong, isPlaying, subscribeAudioState } from '@/lib/audioPlayer'

interface BirthdayScreenProps {
  onNext: () => void
  songTitle?: string
}

export default function BirthdayScreen({
  onNext,
  songTitle = 'Dil Ibadat Kar Raha Hai',
}: BirthdayScreenProps) {
  const [isCandleLit, setIsCandleLit] = useState(true)
  const [isDimmed, setIsDimmed] = useState(false)
  const [showSmoke, setShowSmoke] = useState(false)
  const [wishGranted, setWishGranted] = useState(false)
  const [showHeartButton, setShowHeartButton] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Subscribe to audio state so mini-player stays synced
  useEffect(() => {
    setIsMusicPlaying(isPlaying())
    const unsubscribe = subscribeAudioState((state) => {
      setIsMusicPlaying(state.isPlaying)
    })
    return () => unsubscribe()
  }, [])

  // Fallback: heart button appears after 6 seconds even if candle isn't tapped
  useEffect(() => {
    fallbackTimerRef.current = setTimeout(() => {
      setShowHeartButton(true)
    }, 6000)

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current)
    }
  }, [])

  // Candle Tap Handler
  const handleCandleTap = () => {
    if (!isCandleLit) return

    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current)

    // 1. Haptics & Sound
    buzz(20)
    softChime()

    // 2. Extinguish flame & show smoke
    setIsCandleLit(false)
    setShowSmoke(true)
    setTimeout(() => setShowSmoke(false), 1600)

    // 3. Screen dims briefly (35% opacity, 600ms) with star sparkles
    setIsDimmed(true)
    setTimeout(() => {
      setIsDimmed(false)
      setWishGranted(true)

      // 4. Confetti burst: hearts, stars, petals (~40 particles)
      try {
        const isReduced =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        confetti({
          particleCount: isReduced ? 16 : 42,
          spread: 60,
          origin: { y: 0.52 },
          colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A', '#FFFFFF'],
        })
      } catch {
        // ignore
      }

      // 5. Start song (allowed directly from user gesture)
      startSong().catch(() => {})

      // 6. Fade in "Tap karo" heart button after 2 seconds
      setTimeout(() => {
        setShowHeartButton(true)
      }, 2000)
    }, 600)
  }

  const handleToggleMiniMusic = (e: React.MouseEvent) => {
    e.stopPropagation()
    buzz(10)
    if (isMusicPlaying) {
      pauseSong()
    } else {
      startSong().catch(() => {})
    }
  }

  const handleNextClick = () => {
    softChime()
    buzz(15)
    onNext()
  }

  return (
    <ScreenShell theme="blush" showAmbient={true} contentClassName="justify-between py-3">
      {/* Dim overlay with twinkling stars during wish moment */}
      <AnimatePresence>
        {isDimmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.38 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 bg-[#0E0B12] z-40 pointer-events-none flex items-center justify-center"
          >
            {/* Sparkles in the dark */}
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="absolute top-1/4 left-1/4 text-amber-200 text-2xl animate-pulse">✨</span>
              <span className="absolute top-1/3 right-1/4 text-rose-200 text-xl animate-pulse delay-100">🤍</span>
              <span className="absolute bottom-1/3 left-1/3 text-amber-100 text-3xl animate-pulse delay-200">⭐</span>
              <span className="absolute top-1/2 right-1/3 text-rose-300 text-2xl animate-pulse delay-300">✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Centered Stack */}
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 my-auto z-10 text-center">
        {/* Cake with Living Candle */}
        <div className="relative flex flex-col items-center">
          {/* Candle Touch Target (min 64x64px hit area) */}
          <div
            onClick={handleCandleTap}
            className="relative z-20 flex flex-col items-center cursor-pointer -mb-5 select-none"
            style={{ touchAction: 'manipulation' }}
            role="button"
            aria-label="Birthday candle wish"
          >
            {/* Flame or Smoke */}
            <div className="relative w-16 h-14 flex items-center justify-center">
              {isCandleLit ? (
                /* Living Candle Flame */
                <div className="relative flex items-center justify-center animate-flame">
                  {/* Outer soft glow aura */}
                  <div
                    className="absolute w-12 h-12 rounded-full pointer-events-none filter blur-md"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 180, 50, 0.75) 0%, transparent 70%)',
                    }}
                  />

                  {/* Teardrop Flame SVG */}
                  <svg width="24" height="34" viewBox="0 0 24 34" fill="none">
                    <defs>
                      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFCDF" />
                        <stop offset="35%" stopColor="#FFDE59" />
                        <stop offset="75%" stopColor="#FF7A30" />
                        <stop offset="100%" stopColor="#E54366" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2 C16 9 22 17 22 23 A10 10 0 0 1 2 23 C2 17 8 9 12 2 Z"
                      fill="url(#flameGrad)"
                    />
                    {/* Inner bright core */}
                    <ellipse cx="12" cy="24" rx="4" ry="6" fill="#FFFFFF" opacity="0.85" />
                  </svg>
                </div>
              ) : (
                /* Animated Smoke Curl fading out */
                showSmoke && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 0.75, 0], y: -26, scale: 1.2, x: [0, 6, -4] }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="pointer-events-none"
                  >
                    <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                      <path
                        d="M10 26 Q14 18 8 12 Q4 6 12 2"
                        stroke="#B8B0B5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.8"
                      />
                    </svg>
                  </motion.div>
                )
              )}
            </div>

            {/* Candle Stick */}
            <div className="relative w-4 h-9 rounded-sm overflow-hidden border border-rose-300 shadow-sm bg-gradient-to-r from-amber-50 via-rose-100 to-amber-100 flex flex-col justify-between">
              {/* Wick */}
              <div className="w-0.5 h-1.5 bg-neutral-700 mx-auto" />
              {/* Soft Rose Stripes */}
              <div className="w-full h-1 bg-rose-300/60 -rotate-12 scale-125" />
              <div className="w-full h-1 bg-rose-300/60 -rotate-12 scale-125" />
              <div className="w-full h-1 bg-rose-300/60 -rotate-12 scale-125" />
            </div>
          </div>

          {/* Animated Cake Sticker (~60% screen width, gentle float) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-center select-none"
          >
            <AnimatedSticker
              name="dudu-bubu-cake"
              fallbackType="dudu-bubu-bday"
              size={195}
              priority={true}
              animation="float"
            />
          </motion.div>

          {/* Candle Hint (while flame is lit) */}
          <AnimatePresence>
            {isCandleLit && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onClick={handleCandleTap}
                className="mt-1 flex items-center justify-center gap-1.5 cursor-pointer text-center select-none"
              >
                {/* Pulsing Hand/Finger pointing up to candle */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E56B8A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </motion.div>
                <p
                  className="text-base sm:text-lg font-bold text-rose-600"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  Candle pe tap karo, aur dil mein ek wish maango ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Title / Swapped Wish Text */}
        <div className="flex flex-col items-center gap-0.5 w-full max-w-sm px-2 text-center min-h-[110px] justify-center">
          <AnimatePresence mode="wait">
            {!wishGranted ? (
              /* Idle Title: "Happy Birthday, Maria" */
              <motion.div
                key="birthday-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center"
              >
                <p
                  className="text-2xl sm:text-3xl font-medium tracking-wide text-rose-500"
                  style={{ fontFamily: 'var(--font-dancing)' }}
                >
                  Happy Birthday,
                </p>

                <h1
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
                </h1>

                <p
                  className="text-2xl sm:text-[1.7rem] font-bold text-deep-rose mt-0.5"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  meri Jaan, meri Sukoon
                </p>
              </motion.div>
            ) : (
              /* Wish Granted Swapped Text */
              <motion.div
                key="wish-granted"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="inline-flex items-center gap-1.5 text-amber-500">
                  <SparkleIcon size={16} color="#D4AF37" />
                  <span
                    className="text-xs uppercase tracking-widest font-bold"
                    style={{ fontFamily: 'var(--font-baloo)' }}
                  >
                    Dua Dil Se
                  </span>
                  <SparkleIcon size={16} color="#D4AF37" />
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-bold text-deep-rose leading-tight px-1"
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    textShadow: '0 2px 10px rgba(229,107,138,0.25)',
                  }}
                >
                  Aapki wish zaroor poori hogi, Jaan, inshallah 🤍
                </h2>

                <p
                  className="text-lg font-bold text-rose-600/90"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  Hamari har dua tumhare saath hai
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Milestone Pill: "Turning 25 on 5 November 2026" */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
          className="max-w-full whitespace-normal px-4 py-1.5 rounded-full border border-rose-300/80 bg-white/90 shadow-sm inline-flex items-center justify-center gap-2"
        >
          <SparkleIcon size={14} color="#D4AF37" />
          <span
            className="text-sm sm:text-base font-bold tracking-wide text-deep-rose text-center break-words"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Turning 25 on 5 November 2026
          </span>
          <SparkleIcon size={14} color="#D4AF37" />
        </motion.div>

        {/* Tiny Music Playing Indicator (appears when song is active) */}
        <AnimatePresence>
          {wishGranted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/90 border border-rose-200 shadow-sm mt-1"
            >
              {/* 3 Animated Bouncing Audio Bars */}
              <div className="flex items-end gap-1 h-3.5 w-3.5">
                <span
                  className={`w-1 bg-rose-500 rounded-full transition-all duration-300 ${
                    isMusicPlaying ? 'h-3.5 animate-pulse' : 'h-1'
                  }`}
                />
                <span
                  className={`w-1 bg-rose-400 rounded-full transition-all duration-300 ${
                    isMusicPlaying ? 'h-2 animate-pulse delay-75' : 'h-1'
                  }`}
                />
                <span
                  className={`w-1 bg-rose-600 rounded-full transition-all duration-300 ${
                    isMusicPlaying ? 'h-3 animate-pulse delay-150' : 'h-1'
                  }`}
                />
              </div>

              <span
                className="text-xs font-bold text-deep-rose truncate max-w-[170px]"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                {songTitle}
              </span>

              <button
                onClick={handleToggleMiniMusic}
                className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 cursor-pointer hover:bg-rose-100"
                aria-label={isMusicPlaying ? 'Pause song' : 'Play song'}
              >
                {isMusicPlaying ? (
                  <PauseIcon size={10} color="#B8405E" />
                ) : (
                  <PlayIcon size={10} color="#B8405E" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Center: 88px Glowing Heart Button "Tap karo" (fades in after 2s of wish or 6s fallback) */}
      <div className="w-full min-h-[110px] flex flex-col items-center justify-center pb-2 z-20">
        <AnimatePresence>
          {showHeartButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsing Glow Ring */}
                <div
                  className="absolute w-28 h-28 rounded-full pointer-events-none animate-pulse-glow"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(229,107,138,0.4) 0%, rgba(184,64,94,0) 70%)',
                  }}
                />

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleNextClick}
                  className="relative w-[88px] h-[88px] flex flex-col items-center justify-center cursor-pointer select-none drop-shadow-xl"
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Tap karo - aage chalo"
                >
                  {/* SVG Heart with Rose Gradient */}
                  <svg viewBox="0 0 100 95" className="w-full h-full filter drop-shadow-md">
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

              <span
                className="text-sm font-bold tracking-wider uppercase text-deep-rose"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Tap karo
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  )
}
