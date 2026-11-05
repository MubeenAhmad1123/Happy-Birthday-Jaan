'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { HeartIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

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
      const count = 180
      const defaults = {
        origin: { y: 0.65 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A', '#FFFFFF'],
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
    <ScreenShell
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-3"
    >
      {/* Top: Letter Tiles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-2 mt-1 z-10 w-full"
      >
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {tiles.map((letter, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.03, type: 'spring' }}
              className="w-7 h-8 rounded-lg bg-white border border-rose-300 shadow-md flex items-center justify-center font-bold text-sm text-deep-rose select-none"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              {letter}
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="heading-fluid leading-tight text-deep-rose mt-1"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: 'var(--deep-rose)',
            textShadow: '0 2px 10px rgba(229,107,138,0.2)',
          }}
        >
          Maria 🤍
        </motion.h2>
      </motion.div>

      {/* Center Dudu-Bubu Hugging */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring' }}
        className="flex flex-col items-center my-auto z-10 w-full max-w-sm"
      >
        <AnimatedSticker
          name="dudu-bubu-hug"
          fallbackType="dudu-bubu-hug"
          size={185}
          animation="breathe"
        />

        {/* Message Card */}
        <div
          className="w-full p-5 rounded-3xl border text-center mt-3 shadow-xl relative bg-white border-rose-200"
          style={{
            boxShadow: '0 12px 36px rgba(229,107,138,0.15)',
          }}
        >
          <p
            className="text-xl sm:text-2xl leading-relaxed text-[#2D2329]"
            style={{
              fontFamily: 'var(--font-caveat)',
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
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm flex gap-3 mb-2 z-10 px-1"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            buzz(10)
            onReplay()
          }}
          className="btn-primary flex-1 text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-xl"
        >
          <span>Replay ↺</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            buzz(10)
            onBackToHub()
          }}
          className="btn-secondary flex-1 text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md"
        >
          <HeartIcon size={16} color="var(--rose)" />
          <span>Wapas Hub</span>
        </motion.button>
      </motion.div>
    </ScreenShell>
  )
}
