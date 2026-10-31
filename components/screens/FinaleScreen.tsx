'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import CharacterSticker from '@/components/CharacterSticker'

interface FinaleScreenProps {
  finalMessage: string
  onReplay: () => void
  onBackToHub: () => void
}

export default function FinaleScreen({
  finalMessage,
  onReplay,
  onBackToHub,
}: FinaleScreenProps) {
  // Confetti shower on entrance
  useEffect(() => {
    try {
      const count = 200
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#FFB703', '#FFFFFF'],
      }

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })
      }

      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    } catch {
      // ignore
    }
  }, [])

  const tiles = ['H', 'A', 'P', 'P', 'Y', 'B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y']

  return (
    <div
      className="screen relative p-6 flex flex-col items-center justify-between overflow-hidden"
      style={{
        backgroundColor: '#FFF5F7',
        backgroundImage: 'radial-gradient(#F9D5DE 2px, transparent 2px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top: Letter Tiles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-2 mt-2"
      >
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {tiles.map((letter, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.04, type: 'spring' }}
              className="w-7 h-8 rounded-lg bg-white border-2 border-rose-300 shadow-sm flex items-center justify-center font-bold text-base text-rose-600 select-none"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              {letter}
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-heading text-rose-600 mt-1"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          Maria 🤍
        </motion.h2>
      </motion.div>

      {/* Center Dudu-Bubu Hugging with Bouquet */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="flex flex-col items-center my-auto"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        >
          <CharacterSticker type="dudu-bubu-hug" size={170} />
        </motion.div>

        {/* Message Card */}
        <div
          className="sticker p-5 max-w-sm bg-white/95 shadow-xl text-center mt-3 border-rose-300"
          style={{
            boxShadow: '0 8px 30px rgba(229,107,138,0.25)',
          }}
        >
          <p
            className="text-xl sm:text-2xl leading-relaxed"
            style={{
              fontFamily: 'var(--font-caveat)',
              color: 'var(--charcoal)',
            }}
          >
            {finalMessage ||
              'Maria, meri Jaan, 25 saal mubarak ho. Tum bohot khush rehna, bohot muskurana. Tumhara Ganda Bachha hamesha tumhare saath hai, inshallah. 🤍'}
          </p>
        </div>
      </motion.div>

      {/* Bottom Buttons: Replay & Back to Hub (NO SHARE BUTTON) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm flex gap-3 mb-3"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReplay}
          className="btn-primary flex-1 text-base shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Replay ↺</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBackToHub}
          className="btn-secondary flex-1 text-base shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Wapas Hub 🤍</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

