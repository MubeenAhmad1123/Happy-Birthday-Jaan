'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TimelineItem } from '@/lib/contentData'
import CharacterSticker, { CharacterType } from '@/components/CharacterSticker'

interface TimelineScreenProps {
  timeline: TimelineItem[]
  onNext: () => void
}

export default function TimelineScreen({ timeline, onNext }: TimelineScreenProps) {
  return (
    <div
      className="min-h-[100dvh] w-full relative p-6 flex flex-col items-center"
      style={{
        background: 'linear-gradient(180deg, #FFF8F5 0%, #FFF0F5 50%, #F9D5DE 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4 mb-8 max-w-sm"
      >
        <span
          className="text-xs uppercase tracking-widest font-bold text-rose-500"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Our Journey
        </span>
        <h1
          className="text-4xl font-heading leading-tight"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          Hamari Kahani 📖
        </h1>
        <p
          className="text-base opacity-75 mt-1"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          Har ek lamha jo humne saath guzara…
        </p>
      </motion.div>

      {/* Vertical Timeline Container */}
      <div className="relative w-full max-w-sm flex flex-col gap-8 pb-10">
        {/* Connecting Vertical Dotted Line */}
        <div className="absolute left-6 top-8 bottom-12 w-0.5 border-l-2 border-dashed border-rose-300 pointer-events-none" />

        {timeline.map((item, idx) => {
          // Map character string to CharacterType
          const charType: CharacterType =
            (item.character as CharacterType) ||
            (idx === 0
              ? 'dudu-bubu-box'
              : idx === 1
              ? 'dudu-bubu-nashta'
              : idx === 2
              ? 'dudu-bubu-chai'
              : idx === 5
              ? 'bubu-sad'
              : idx === 7
              ? 'dudu-bubu-bday'
              : 'dudu-bubu-hug')

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="relative flex items-start gap-4 pl-2"
            >
              {/* Date node icon circle */}
              <div className="w-9 h-9 rounded-full sticker bg-white flex items-center justify-center text-lg shadow-md z-10 flex-shrink-0 border-rose-400">
                {item.icon || '🌸'}
              </div>

              {/* Card Content */}
              <div className="sticker p-4 flex-1 bg-white/95 shadow-md border-rose-200">
                <div className="flex items-center justify-between border-b pb-1 mb-2 border-rose-100">
                  <span
                    className="text-base font-bold text-rose-600"
                    style={{ fontFamily: 'var(--font-baloo)' }}
                  >
                    {item.date}
                  </span>
                  <span className="text-xs text-rose-300">🤍</span>
                </div>

                <p
                  className="text-lg leading-snug mb-3"
                  style={{
                    fontFamily: 'var(--font-caveat)',
                    color: 'var(--charcoal)',
                  }}
                >
                  {item.text}
                </p>

                {/* Cute Character Scene Sticker */}
                <div className="flex justify-center pt-1 border-t border-rose-50">
                  <CharacterSticker type={charType} size={110} />
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Final CTA Button to Screen 7 (Finale) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="btn-primary w-full text-lg shadow-xl flex items-center justify-center gap-2 py-3.5"
          >
            <span>Ek aakhri paigham 💌</span>
            <span>→</span>
          </motion.button>
          <span
            className="text-xs opacity-60 text-center"
            style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
          >
            Yeh bas shuruaat hai, Jaan 🤍
          </span>
        </motion.div>
      </div>
    </div>
  )
}

