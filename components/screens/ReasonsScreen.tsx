'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReasonItem } from '@/lib/contentData'
import CharacterSticker, { CharacterType } from '@/components/CharacterSticker'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
}

// Preset slight tilts for stickers (-2deg to 2.5deg)
const tilts = [-2, 1.5, -1, 2, -1.8, 1.2]

// Fallback character stickers for cards without uploaded photos
const fallbackCharacters: CharacterType[] = [
  'dudu-bubu-chai',
  'dudu-bubu-hug',
  'dudu-bubu-flowers',
  'dudu-bubu-bday',
  'dudu-bubu-nashta',
  'dudu-bubu-box',
]

export default function ReasonsScreen({ reasons, onNext }: ReasonsScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  // 6 cards per page as specified
  const itemsPerPage = 6
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
      className="screen relative p-4 flex flex-col justify-between overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)',
      }}
    >
      {/* Header & Progress Counter */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center mt-1 relative">
        <div className="flex items-center justify-between w-full mb-1">
          <span
            className="text-xs uppercase tracking-widest font-bold text-rose-500"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            25 Years • 25 Reasons
          </span>
          <div className="sticker px-2.5 py-0.5 text-xs font-bold text-rose-600 bg-white shadow-sm">
            {progressText}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1
            className="text-3xl font-heading leading-tight"
            style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
          >
            25 reasons I love you 🤍
          </h1>
          <div className="shrink-0 -mr-2">
            <CharacterSticker type="dudu-bubu-flowers" size={48} />
          </div>
        </div>
        <p
          className="text-xs opacity-75 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          (Har card pe tap karke photo aur baat dekho ✨)
        </p>
      </div>

      {/* 2-Column Grid (6 cards per page) */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-2.5 my-auto py-1">
        <AnimatePresence mode="wait">
          {currentReasons.map((item, localIdx) => {
            const globalIndex = startIndex + localIdx
            const isFlipped = !!flippedCards[globalIndex]
            const tilt = tilts[localIdx % tilts.length]
            const fallbackChar = fallbackCharacters[globalIndex % fallbackCharacters.length]

            return (
              <motion.div
                key={item.id || globalIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: localIdx * 0.04 }}
                onClick={() => toggleFlip(globalIndex)}
                className="relative h-40 rounded-2xl cursor-pointer select-none"
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                <div
                  className={`w-full h-full rounded-2xl sticker transition-all duration-300 p-2 flex flex-col items-center justify-between text-center relative overflow-hidden ${
                    isFlipped
                      ? 'bg-white shadow-md border-rose-300'
                      : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md'
                  }`}
                >
                  {!isFlipped ? (
                    /* Card Front: Small heart + Year Number */
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <span className="text-2xl animate-pulse">🤍</span>
                      <span
                        className="text-xl font-bold font-mono tracking-tight text-white drop-shadow"
                        style={{ fontFamily: 'var(--font-baloo)' }}
                      >
                        #{item.order || globalIndex + 1}
                      </span>
                      <span
                        className="text-[11px] text-white/90"
                        style={{ fontFamily: 'var(--font-caveat)' }}
                      >
                        Tap to reveal 🌸
                      </span>
                    </div>
                  ) : (
                    /* Card Back: Photo + Roman Urdu Reason */
                    <div className="flex flex-col items-center justify-between h-full w-full py-0.5">
                      {/* Photo or Cute Character Placeholder */}
                      <div className="w-full h-20 rounded-xl overflow-hidden border border-rose-200 bg-rose-50 flex items-center justify-center flex-shrink-0">
                        {item.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none'
                              const fb = e.currentTarget.nextElementSibling as HTMLElement
                              if (fb) fb.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className={`flex items-center justify-center w-full h-full ${
                            item.photoUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          <CharacterSticker type={fallbackChar} size={64} />
                        </div>
                      </div>

                      {/* Reason Text */}
                      <p
                        className="text-xs sm:text-sm leading-snug line-clamp-3 my-auto px-1 font-body"
                        style={{
                          fontFamily: 'var(--font-caveat)',
                          color: 'var(--charcoal)',
                        }}
                      >
                        {item.text}
                      </p>

                      <div className="flex items-center justify-between w-full px-1">
                        <span className="text-[10px] font-bold text-rose-400">
                          #{item.order || globalIndex + 1}
                        </span>
                        <span className="text-[10px] text-rose-400">🤍</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Pagination & Next Button to Screen 5b */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 mb-1">
        {/* Page navigation controls */}
        <div className="flex items-center justify-between w-full px-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="sticker px-3 py-1 text-xs font-bold disabled:opacity-30 bg-white"
            style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
          >
            ← Prev
          </button>

          <span
            className="text-xs font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Page {currentPage + 1} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="sticker px-3 py-1 text-xs font-bold disabled:opacity-30 bg-white"
            style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
          >
            Next →
          </button>
        </div>

        {/* CTA to Screen 5b (Tumhara Khwab) */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="btn-primary w-full text-base shadow-md flex items-center justify-center gap-1.5 py-2.5"
        >
          <span>Tumhara Khwab ⚖️</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  )
}
