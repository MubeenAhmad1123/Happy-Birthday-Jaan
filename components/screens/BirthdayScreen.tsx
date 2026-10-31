'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CharacterSticker from '@/components/CharacterSticker'

interface BirthdayScreenProps {
  onNext: () => void
}

export default function BirthdayScreen({ onNext }: BirthdayScreenProps) {
  return (
    <div
      className="screen relative overflow-hidden"
      style={{
        background:
          'repeating-linear-gradient(45deg, #FFF8F5, #FFF8F5 18px, #F9D5DE 18px, #F9D5DE 36px)',
      }}
    >
      {/* Floating Sparkles & Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          { top: '10%', left: '15%', char: '✨', delay: 0 },
          { top: '18%', right: '12%', char: '🌸', delay: 0.8 },
          { top: '45%', left: '8%', char: '🤍', delay: 1.2 },
          { top: '65%', right: '14%', char: '✨', delay: 0.4 },
          { top: '82%', left: '20%', char: '🌸', delay: 1.6 },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute text-xl"
            style={{ top: item.top, left: item.left, right: item.right }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + idx * 0.5,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            {item.char}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 px-6 max-w-sm text-center z-10"
      >
        {/* Birthday couple sticker */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <CharacterSticker type="dudu-bubu-bday" size={170} />
        </motion.div>

        {/* Big Script Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl leading-tight font-heading text-rose-600"
            style={{
              fontFamily: 'var(--font-dancing)',
              color: 'var(--deep-rose)',
              textShadow: '0 2px 10px rgba(229,107,138,0.25)',
            }}
          >
            Happy Birthday, Maria 🎂
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl"
            style={{
              fontFamily: 'var(--font-caveat)',
              color: 'var(--rose)',
            }}
          >
            meri Jaan, meri Sukoon 🤍
          </motion.p>
        </div>

        {/* Milestone Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="sticker px-5 py-2 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm"
        >
          <span className="text-xl">🌟</span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
          >
            Turning 25 on 5 November 2026
          </span>
          <span className="text-xl">🌟</span>
        </motion.div>

        {/* Heart-shaped "tap me" button */}
        <motion.div
          className="mt-4 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 4px 15px rgba(229,107,138,0.3)',
                '0 8px 25px rgba(229,107,138,0.5)',
                '0 4px 15px rgba(229,107,138,0.3)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            onClick={onNext}
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-rose-500 text-white shadow-xl cursor-pointer"
            style={{ background: 'var(--rose)' }}
            aria-label="Tap me to continue"
          >
            <span className="text-3xl">🤍</span>
            <span
              className="text-xs font-bold tracking-wider"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              TAP ME
            </span>
          </motion.button>
          <span
            className="text-xs opacity-70"
            style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
          >
            Aage dekho Jaan ✨
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

