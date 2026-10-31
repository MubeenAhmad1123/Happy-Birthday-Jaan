'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhotoItem } from '@/lib/contentData'
import CharacterSticker from '@/components/CharacterSticker'

interface CameraScreenProps {
  photos: PhotoItem[]
  onBack: () => void
}

export default function CameraScreen({ photos, onBack }: CameraScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const currentPhoto = photos[activeIndex] || photos[0]

  const backgroundColors = [
    '#FFF0F5',
    '#FFF5F0',
    '#F0F8FF',
    '#FDF2F4',
    '#FFF9E6',
    '#F5F0FF',
  ]
  const currentBg = backgroundColors[activeIndex % backgroundColors.length]

  return (
    <div
      className="screen relative overflow-hidden transition-colors duration-700 p-4"
      style={{ backgroundColor: currentBg }}
    >
      {/* Soft blurred background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, var(--rose) 0%, transparent 70%)`,
        }}
      />

      {/* Top Bar */}
      <div className="w-full max-w-sm flex items-center justify-between z-10 pt-2 mb-3">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="sticker px-3 py-1.5 text-sm font-bold flex items-center gap-1 bg-white/90"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          ← Wapas
        </motion.button>
        <span
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          Yaadein 📷 ({activeIndex + 1}/{photos.length})
        </span>
        <div className="w-12" />
      </div>

      {/* Retro Camera Body */}
      <div className="w-full max-w-sm flex flex-col items-center z-10">
        <div
          className="relative w-full rounded-3xl p-4 shadow-xl border-4"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF, #FFF5F7)',
            borderColor: '#F9D5DE',
            boxShadow: '0 12px 32px rgba(229,107,138,0.2)',
          }}
        >
          {/* Camera top details: Shutter & Flash */}
          <div className="flex justify-between items-center mb-2 px-3">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-rose-400 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
            </div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
              MEMORIES-25
            </div>
          </div>

          {/* Camera Viewfinder / Screen */}
          <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 flex items-center justify-center border-2 border-rose-200"
            style={{
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col items-center justify-center p-3 relative"
              >
                {/* Image display */}
                {currentPhoto.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.caption}
                    className="w-full h-full object-contain rounded-xl select-none"
                    onError={(e) => {
                      // Fallback sticker if image fails to load
                      (e.currentTarget as HTMLElement).style.display = 'none'
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                )}
                <div
                  className="hidden flex-col items-center justify-center w-full h-full"
                  aria-hidden
                >
                  <CharacterSticker type="dudu-bubu-hug" size={130} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tap controls overlays (left / right) */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-rose-600 flex items-center justify-center font-bold shadow-md cursor-pointer"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-rose-600 flex items-center justify-center font-bold shadow-md cursor-pointer"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>

          {/* Caption */}
          <div className="mt-3 text-center min-h-[48px] flex items-center justify-center px-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-lg leading-snug"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  color: 'var(--charcoal)',
                }}
              >
                {currentPhoto.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Film Strip Thumbnails Below */}
        <div className="w-full mt-4 flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
          {photos.map((p, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white ${
                activeIndex === idx
                  ? 'border-rose-500 scale-105 shadow-md'
                  : 'border-rose-200 opacity-60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

