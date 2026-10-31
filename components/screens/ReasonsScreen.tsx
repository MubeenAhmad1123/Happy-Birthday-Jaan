'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReasonItem } from '@/lib/contentData'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
}

export default function ReasonsScreen({ reasons, onNext }: ReasonsScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  const itemsPerPage = 4
  const totalPages = Math.ceil(reasons.length / itemsPerPage)

  const startIndex = currentPage * itemsPerPage
  const currentReasons = reasons.slice(startIndex, startIndex + itemsPerPage)

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const revealedCount = Object.keys(flippedCards).length
  const progressText = `${Math.min(revealedCount, 25)}/25`

  return (
    <div
      className="screen relative p-6 flex flex-col justify-between overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)',
      }}
    >
      {/* Header & Progress Counter */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center mt-2">
        <div className="flex items-center justify-between w-full mb-1">
          <span
            className="text-xs uppercase tracking-widest font-bold text-rose-500"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            25 Years • 25 Reasons
          </span>
          <div className="sticker px-2.5 py-0.5 text-xs font-bold text-rose-600 bg-white shadow-sm">
            {progressText} Revealed
          </div>
        </div>

        <h1
          className="text-3xl font-heading leading-tight"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          25 reasons I love you 🤍
        </h1>
        <p
          className="text-sm opacity-70 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          (Har card pe tap karke reason kholo)
        </p>
      </div>

      {/* 2-Column Grid (4 cards at a time) */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-3.5 my-auto">
        <AnimatePresence mode="wait">
          {currentReasons.map((item, localIdx) => {
            const globalIndex = startIndex + localIdx
            const isFlipped = !!flippedCards[globalIndex]

            return (
              <motion.div
                key={item.id || globalIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: localIdx * 0.06 }}
                onClick={() => toggleFlip(globalIndex)}
                className="relative h-44 rounded-2xl cursor-pointer select-none perspective"
              >
                <div
                  className={`w-full h-full rounded-2xl sticker transition-all duration-500 p-3.5 flex flex-col items-center justify-center text-center relative overflow-hidden ${
                    isFlipped
                      ? 'bg-white shadow-md border-rose-300'
                      : 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg'
                  }`}
                >
                  {!isFlipped ? (
                    /* Card Front: Reason Number */
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-3xl">🤍</span>
                      <span
                        className="text-2xl font-bold font-mono tracking-tight text-white drop-shadow"
                        style={{ fontFamily: 'var(--font-baloo)' }}
                      >
                        #{item.order || globalIndex + 1}
                      </span>
                      <span
                        className="text-xs text-white/90"
                        style={{ fontFamily: 'var(--font-caveat)' }}
                      >
                        Tap to reveal ✨
                      </span>
                    </div>
                  ) : (
                    /* Card Back: Revealed Text */
                    <div className="flex flex-col items-center justify-between h-full py-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-rose-400">
                          #{item.order || globalIndex + 1}
                        </span>
                        <span className="text-xs text-rose-400">🌸</span>
                      </div>
                      <p
                        className="text-base sm:text-lg leading-tight my-auto px-1"
                        style={{
                          fontFamily: 'var(--font-caveat)',
                          color: 'var(--charcoal)',
                        }}
                      >
                        {item.text}
                      </p>
                      <span className="text-[10px] text-rose-300">Tap to flip</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Pagination & Next Button */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 mb-2">
        {/* Page navigation controls */}
        <div className="flex items-center justify-between w-full px-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="sticker px-3 py-1.5 text-xs font-bold disabled:opacity-40 bg-white"
            style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
          >
            ← Previous
          </button>

          <span
            className="text-xs font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="sticker px-3 py-1.5 text-xs font-bold disabled:opacity-40 bg-white"
            style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
          >
            Next Page →
          </button>
        </div>

        {/* CTA to Timeline */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="btn-primary w-full text-lg shadow-lg flex items-center justify-center gap-2 mt-1"
        >
          <span>Hamari Kahani (Timeline)</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  )
}

