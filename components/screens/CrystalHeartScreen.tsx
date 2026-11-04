'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import CrystalHeartCanvas, { isWebGLAvailable } from '@/components/CrystalHeart'
import { SparkleIcon, ArrowRightIcon } from '@/components/Icons'

interface CrystalHeartScreenProps {
  onNext: () => void
}

interface SparkleItem {
  id: number
  x: number
  y: number
}

export default function CrystalHeartScreen({ onNext }: CrystalHeartScreenProps) {
  const [pulsing, setPulsing] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [sparkles, setSparkles] = useState<SparkleItem[]>([])

  useEffect(() => {
    setUse3D(isWebGLAvailable())
  }, [])

  const triggerPulse = (e?: React.MouseEvent) => {
    setPulsing(true)
    setTimeout(() => setPulsing(false), 450)

    // Dynamic tap sparkles
    const newSparkles: SparkleItem[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (e?.clientX ?? window.innerWidth / 2) + (Math.random() - 0.5) * 80,
      y: (e?.clientY ?? window.innerHeight / 2) + (Math.random() - 0.5) * 80,
    }))
    setSparkles((prev) => [...prev.slice(-18), ...newSparkles])

    try {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#FFFFFF', '#F9D5DE', '#E56B8A', '#E8C27A'],
      })
    } catch {
      // ignore
    }
  }

  return (
    <ScreenShell theme="blush" showAmbient={true} contentClassName="justify-between py-2">
      {/* Dynamic tap sparkles */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.8, y: -35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute pointer-events-none z-30"
            style={{ left: s.x, top: s.y }}
          >
            <SparkleIcon size={20} color="#E8C27A" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top: Gold Script "25" Badge ABOVE the heart, clearly separated */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex justify-center pt-2 z-10"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-md bg-white/95 backdrop-blur-md">
          <SparkleIcon size={16} color="#D4AF37" />
          <span
            className="text-2xl sm:text-3xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-dancing)',
              background: 'linear-gradient(135deg, #B8405E 0%, #E56B8A 40%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            25
          </span>
          <SparkleIcon size={16} color="#D4AF37" />
        </div>
      </motion.div>

      {/* Center: Exactly 60dvh Canvas Room for 3D Crystal Heart */}
      <div
        onClick={triggerPulse}
        className="relative w-full flex flex-col items-center justify-center my-auto cursor-pointer select-none"
        style={{ height: '56dvh', minHeight: '340px', maxHeight: '480px' }}
      >
        {/* Soft glowing ambient light pool behind the crystal heart */}
        <div
          className="absolute w-72 h-72 rounded-full pointer-events-none filter blur-2xl"
          style={{
            background:
              'radial-gradient(circle, rgba(249,213,222,0.85) 0%, rgba(229,107,138,0.25) 50%, transparent 70%)',
          }}
        />

        {/* 3D Heart or Graceful Fallback */}
        <div className="relative w-full h-full flex items-center justify-center">
          {use3D ? (
            <CrystalHeartCanvas pulsing={pulsing} />
          ) : (
            <motion.div
              animate={{
                scale: pulsing ? [1, 1.22, 1] : [1, 1.06, 1],
                filter: [
                  'drop-shadow(0 0 25px rgba(229,107,138,0.5))',
                  'drop-shadow(0 0 45px rgba(229,107,138,0.85))',
                  'drop-shadow(0 0 25px rgba(229,107,138,0.5))',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="relative flex items-center justify-center p-6"
            >
              <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
                <defs>
                  <linearGradient id="fallbackHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#F9D5DE" />
                    <stop offset="85%" stopColor="#E56B8A" />
                    <stop offset="100%" stopColor="#B8405E" />
                  </linearGradient>
                </defs>
                <path
                  d="M110 35 C85 5 25 15 25 75 C25 130 110 185 110 185 C110 185 195 130 195 75 C195 15 135 5 110 35 Z"
                  fill="url(#fallbackHeartGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                />
                <polygon points="110,35 75,75 110,130 145,75" fill="#FFFFFF" opacity="0.4" />
                <polygon points="110,130 110,185 145,75" fill="#E56B8A" opacity="0.3" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Text "For you, Maria" under the heart */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-deep-rose tracking-wide mt-1 pointer-events-none"
          style={{
            fontFamily: 'var(--font-dancing)',
            textShadow: '0 2px 10px rgba(229,107,138,0.25)',
          }}
        >
          For you, Maria 🤍
        </motion.p>
      </div>

      {/* Bottom CTA: Full-width rose button + One-line caption in 14px */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full px-2 pb-3 z-20 flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Kuch cheezein khol ke dekho</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>

        <p
          className="text-[14px] text-charcoal/80 text-center font-medium"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Yeh dil tumhare liye dharakta hai
        </p>
      </motion.div>
    </ScreenShell>
  )
}
