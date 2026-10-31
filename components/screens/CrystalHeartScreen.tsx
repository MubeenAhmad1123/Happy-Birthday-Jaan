'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import CrystalHeartCanvas, { isWebGLAvailable } from '@/components/CrystalHeart'

interface CrystalHeartScreenProps {
  onNext: () => void
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
}

export default function CrystalHeartScreen({ onNext }: CrystalHeartScreenProps) {
  const [pulsing, setPulsing] = useState(false)
  const [use3D, setUse3D] = useState(true)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    setUse3D(isWebGLAvailable())
  }, [])

  const triggerPulse = (e?: React.MouseEvent) => {
    setPulsing(true)
    setTimeout(() => setPulsing(false), 500)

    // Add tap sparkles
    const newSparkles: Sparkle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (e?.clientX ?? window.innerWidth / 2) + (Math.random() - 0.5) * 80,
      y: (e?.clientY ?? window.innerHeight / 2) + (Math.random() - 0.5) * 80,
      size: Math.random() * 14 + 10,
    }))
    setSparkles((prev) => [...prev.slice(-18), ...newSparkles])

    try {
      confetti({
        particleCount: 15,
        spread: 45,
        origin: { y: 0.5 },
        colors: ['#FFFFFF', '#F9D5DE', '#E56B8A'],
      })
    } catch {
      // ignore
    }
  }

  return (
    <div
      onClick={triggerPulse}
      className="screen relative cursor-pointer select-none overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #FFF0F5 0%, #FFF8F5 55%, #F9D5DE 100%)',
      }}
    >
      {/* Dynamic tap sparkles */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.8, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute pointer-events-none z-30"
            style={{ left: s.x, top: s.y, fontSize: s.size }}
          >
            ✨
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1 text-center pt-6 px-4 z-10"
      >
        <span
          className="text-xs tracking-widest uppercase font-bold text-rose-500 opacity-80"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          A piece of my heart
        </span>
        <h2
          className="text-3xl font-heading"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          For you, Maria 🤍
        </h2>
        <p
          className="text-sm opacity-70"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          (Dil pe tap karo aur dekho ✨)
        </p>
      </motion.div>

      {/* Center 3D Crystal Heart OR 2D Fallback */}
      <div className="relative w-full max-w-[340px] h-[340px] flex items-center justify-center my-auto">
        {/* Shimmering "25" badge floating around */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute top-2 right-4 sticker px-3 py-1 bg-white/95 shadow-md flex items-center gap-1"
          >
            <span className="text-sm">✨</span>
            <span
              className="text-lg font-bold text-rose-600"
              style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
            >
              25 Years
            </span>
          </motion.div>
        </motion.div>

        {use3D ? (
          <CrystalHeartCanvas pulsing={pulsing} />
        ) : (
          /* 2D CSS Glow Fallback */
          <motion.div
            animate={{
              scale: pulsing ? [1, 1.25, 1] : [1, 1.08, 1],
              filter: [
                'drop-shadow(0 0 25px rgba(229,107,138,0.5))',
                'drop-shadow(0 0 45px rgba(229,107,138,0.85))',
                'drop-shadow(0 0 25px rgba(229,107,138,0.5))',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative flex items-center justify-center"
          >
            <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#F9D5DE" />
                  <stop offset="100%" stopColor="#E56B8A" />
                </linearGradient>
              </defs>
              <path
                d="M110 35 C85 5 25 15 25 75 C25 130 110 185 110 185 C110 185 195 130 195 75 C195 15 135 5 110 35 Z"
                fill="url(#heartGrad)"
                stroke="#FFFFFF"
                strokeWidth="4"
              />
              {/* Facet reflections */}
              <polygon points="110,35 75,75 110,130 145,75" fill="#FFFFFF" opacity="0.35" />
              <polygon points="110,130 110,185 145,75" fill="#E56B8A" opacity="0.25" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA to Hub */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs px-6 pb-8 z-20 flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          className="btn-primary w-full text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <span>Kuch cheezein khol ke dekho</span>
          <span>→</span>
        </motion.button>
        <span
          className="text-xs opacity-60 text-center"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          3 surprises tumhara intezar kar rahe hain 🤍
        </span>
      </motion.div>
    </div>
  )
}

