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
      className="screen relative p-4 sm:p-6 flex flex-col justify-between overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, #FFFDF9 0%, #FFF5F7 60%, #F9D5DE 100%)',
      }}
    >
      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="sticker px-3 py-1 text-xs font-bold flex items-center gap-1 bg-white/95"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          ← Wapas
        </motion.button>
        <div className="flex items-center gap-1.5 sticker px-3 py-1 bg-white/95">
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

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto gap-4 text-center py-2">
        {/* Lawyer Character Sticker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative"
        >
          <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-2xl transform scale-125 pointer-events-none" />
          <CharacterSticker type="dudu-bubu-lawyer" size={130} />
        </motion.div>

        {/* Photos 14 & 15 Side-by-Side Polaroids */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {/* Photo 14 (Library) */}
          <div className="sticker p-2 bg-white shadow-md rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-32 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/14"
                alt="Advocate in Library"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
            </div>
            <p
              className="text-[11px] text-rose-600 font-bold mt-1 text-center"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Law Library 📚
            </p>
          </div>

          {/* Photo 15 (Courthouse) */}
          <div className="sticker p-2 bg-white shadow-md rounded-2xl transform rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-32 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/15"
                alt="Lawyer at Courthouse"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
            </div>
            <p
              className="text-[11px] text-rose-600 font-bold mt-1 text-center"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Courthouse Steps 🏛️
            </p>
          </div>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="sticker p-4 bg-white/95 shadow-lg border-rose-300 w-full rounded-2xl"
        >
          <h2
            className="text-2xl font-heading mb-1.5"
            style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
          >
            Advocate Maria 🤍
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed font-body"
            style={{
              fontFamily: 'var(--font-caveat)',
              color: 'var(--charcoal)',
            }}
          >
            Tumhara khwab abhi bhi zinda hai, Maria. Ek din tum bohot bari wakeel banogi, aur main tumhara sab se pehla supporter hounga.
          </p>

          <p
            className="text-xs opacity-75 mt-2 text-rose-500 font-bold"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Hamesha tumhare saath, inshallah ⚖️🤍
          </p>
        </motion.div>
      </div>

      {/* Bottom Button to proceed to Freedom Screen */}
      <div className="w-full max-w-sm mx-auto mb-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="btn-primary w-full text-base shadow-md flex items-center justify-center gap-1.5 py-2.5"
        >
          <span>Azaadi 🕊️</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  )
}
