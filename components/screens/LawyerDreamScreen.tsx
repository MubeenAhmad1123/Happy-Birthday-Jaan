'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CharacterSticker from '@/components/CharacterSticker'

interface LawyerDreamScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function LawyerDreamScreen({
  onNext,
  onBack,
}: LawyerDreamScreenProps) {
  return (
    <div
      className="screen relative p-6 flex flex-col justify-between overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFFDF9 0%, #FFF5F7 60%, #F9D5DE 100%)',
      }}
    >
      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="sticker px-3 py-1 text-xs font-bold flex items-center gap-1 bg-white/95"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          ← Wapas
        </motion.button>
        <div className="flex items-center gap-1 sticker px-3 py-1 bg-white/95">
          <span className="text-sm">⚖️</span>
          <span
            className="text-xs font-bold tracking-wider uppercase text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Tumhara Khwab
          </span>
        </div>
        <div className="w-12" />
      </div>

      {/* Center Character & Message Card */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto gap-5 text-center">
        {/* Lawyer Panda Character Sticker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative"
        >
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-2xl transform scale-125 pointer-events-none" />
          <CharacterSticker type="panda-lawyer" size={175} />
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="sticker p-5 bg-white/95 shadow-xl border-rose-300 w-full"
        >
          <div className="flex justify-center mb-2">
            <span className="text-2xl">⚖️ 🌸 📖</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-heading mb-3"
            style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
          >
            Advocate Maria 🤍
          </h2>

          <p
            className="text-xl sm:text-2xl leading-relaxed font-body"
            style={{
              fontFamily: 'var(--font-caveat)',
              color: 'var(--charcoal)',
            }}
          >
            Tumhara khwab abhi bhi zinda hai, Maria. Ek din tum bohot bari wakeel banogi, aur main tumhara sab se pehla supporter hounga.
          </p>

          <p
            className="text-sm opacity-70 mt-3 text-rose-500 font-bold"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Hamesha tumhare saath, inshallah 🤍
          </p>
        </motion.div>
      </div>

      {/* Bottom Button to proceed to Hamari Kahani */}
      <div className="w-full max-w-sm mx-auto mb-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="btn-primary w-full text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <span>Hamari Kahani (Timeline)</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  )
}

