'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { ReasonItem } from '@/lib/contentData'
import {
  HeartIcon,
  SparkleIcon,
  CloseIcon,
  ArrowRightIcon,
  CameraIcon,
  ArrowLeftIcon,
} from '@/components/Icons'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
}

export default function ReasonsScreen({ reasons, onNext }: ReasonsScreenProps) {
  const safeReasons = reasons && reasons.length > 0 ? reasons : []
  const total = safeReasons.length

  // Track which cards are flipped (open)
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({})
  // Track photo modal index
  const [photoModalIndex, setPhotoModalIndex] = useState<number | null>(null)

  const toggleFlip = (index: number) => {
    setFlippedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const flipAll = () => {
    const allOpen = Object.keys(flippedMap).length === total && Object.values(flippedMap).every(Boolean)
    if (allOpen) {
      setFlippedMap({})
    } else {
      const nextMap: Record<number, boolean> = {}
      for (let i = 0; i < total; i++) {
        nextMap[i] = true
      }
      setFlippedMap(nextMap)
    }
  }

  const revealedCount = Object.values(flippedMap).filter(Boolean).length
  const allRevealed = revealedCount === total && total > 0

  const activePhotoReason =
    photoModalIndex !== null ? safeReasons[photoModalIndex] : null

  return (
    <ScreenShell
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-2 z-10 px-2">
        <div className="flex items-center justify-between w-full mb-1">
          <span
            className="text-xs uppercase tracking-widest font-bold text-rose-500"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            25 Years • 25 Reasons
          </span>

          <button
            onClick={flipAll}
            className="text-xs font-bold text-rose-600 bg-white/90 border border-rose-200/80 px-2.5 py-0.5 rounded-full shadow-sm hover:bg-rose-50 cursor-pointer transition-all"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            {revealedCount === total ? 'Hide all' : 'Reveal all'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-0.5">
          <h1
            className="heading-fluid leading-tight text-deep-rose"
            style={{
              fontFamily: 'var(--font-dancing)',
              color: 'var(--deep-rose)',
              textShadow: '0 2px 10px rgba(229,107,138,0.2)',
            }}
          >
            25 Reasons I Love You
          </h1>
          <HeartIcon size={24} color="var(--rose)" />
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-full max-w-xs mt-2 flex flex-col gap-1 items-center">
          <div className="w-full h-2 rounded-full bg-rose-200/50 overflow-hidden border border-rose-300/40">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-300"
              style={{ width: `${(revealedCount / total) * 100}%` }}
            />
          </div>
          <span
            className="text-xs font-medium text-rose-600/90"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            {revealedCount} of {total} revealed
          </span>
        </div>
      </div>

      {/* Grid of 25 Love Cards (2 columns on mobile, matching reference layout) */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 my-3 px-1 z-10">
        {safeReasons.map((item, idx) => {
          const isFlipped = !!flippedMap[idx]
          const photoUrl =
            item.photoUrl ||
            `/api/photos/${String(idx + 1).padStart(2, '0')}`

          return (
            <div
              key={item.id || idx}
              className="relative w-full h-[120px] sm:h-[130px] perspective-1000 select-none cursor-pointer"
              onClick={() => toggleFlip(idx)}
            >
              <motion.div
                className="w-full h-full relative transform-style-3d transition-transform duration-500 rounded-2xl shadow-md"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                {/* ── FRONT FACE (Unrevealed: Vibrant Pink Love Card) ── */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rounded-2xl flex flex-col items-center justify-center p-3 text-white border border-white/30"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B8B 0%, #E56B8A 50%, #B8405E 100%)',
                    boxShadow: '0 6px 18px rgba(229,107,138,0.25)',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2 + (idx % 4) * 0.3,
                      ease: 'easeInOut',
                    }}
                  >
                    <HeartIcon size={26} color="#FFFFFF" />
                  </motion.div>

                  <span
                    className="text-2xl font-bold mt-1 tracking-wide"
                    style={{
                      fontFamily: 'var(--font-baloo)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {idx + 1}
                  </span>
                </div>

                {/* ── BACK FACE (Revealed: Clean White Romantic Text Card) ── */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl flex flex-col justify-between p-2.5 bg-white border border-rose-200 shadow-md text-left overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-rose-100 pb-1 mb-1">
                    <span
                      className="text-[11px] font-bold text-rose-500"
                      style={{ fontFamily: 'var(--font-baloo)' }}
                    >
                      #{idx + 1}
                    </span>
                    <HeartIcon size={12} color="var(--rose)" />
                  </div>

                  <p
                    className="text-xs sm:text-sm leading-snug font-medium text-[#2D2329] line-clamp-3 my-auto"
                    style={{ fontFamily: 'var(--font-caveat)' }}
                  >
                    {item.text}
                  </p>

                  {/* Photo View Thumbnail Pill */}
                  <div className="flex items-center justify-between pt-1 border-t border-rose-50 mt-1">
                    <span
                      className="text-[10px] text-rose-400 font-bold"
                      style={{ fontFamily: 'var(--font-baloo)' }}
                    >
                      Maria 🤍
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPhotoModalIndex(idx)
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-50 text-[10px] text-rose-600 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                      style={{ fontFamily: 'var(--font-baloo)' }}
                      title="View Photo"
                    >
                      <CameraIcon size={11} color="var(--rose)" />
                      <span>Photo</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Footer Instruction & Next Chapter Button */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 px-2 pb-4 z-10">
        <p
          className="text-xs sm:text-sm text-center text-rose-700/80 flex items-center justify-center gap-1 font-medium"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          <span>Click each heart to reveal</span>
          <HeartIcon size={14} color="var(--rose)" />
        </p>

        {/* Proceed Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Aage chalo (Tumhara Khwab)</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </div>

      {/* Full Photo Modal when tapped */}
      <AnimatePresence>
        {photoModalIndex !== null && activePhotoReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4"
          >
            {/* Modal Header */}
            <div className="w-full max-w-sm flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                <SparkleIcon size={16} color="var(--soft-gold)" />
                <span style={{ fontFamily: 'var(--font-baloo)' }}>
                  Reason #{photoModalIndex + 1}
                </span>
              </div>

              <button
                onClick={() => setPhotoModalIndex(null)}
                className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center border border-white/30 cursor-pointer"
                aria-label="Close photo"
              >
                <CloseIcon size={18} color="#FFFFFF" />
              </button>
            </div>

            {/* Modal Image Display (3:4 ratio) */}
            <div className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center my-auto py-2">
              <div className="relative w-full aspect-[3/4] max-h-[50dvh] rounded-3xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activePhotoReason.photoUrl ||
                    `/api/photos/${String(photoModalIndex + 1).padStart(2, '0')}`
                  }
                  alt={activePhotoReason.text}
                  className="w-full h-full object-contain"
                />

                {/* Left / Right arrows to navigate photos */}
                <button
                  onClick={() =>
                    setPhotoModalIndex((prev) =>
                      prev !== null ? (prev > 0 ? prev - 1 : total - 1) : 0
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ArrowLeftIcon size={18} color="#FFFFFF" />
                </button>

                <button
                  onClick={() =>
                    setPhotoModalIndex((prev) =>
                      prev !== null ? (prev < total - 1 ? prev + 1 : 0) : 0
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 cursor-pointer"
                  aria-label="Next photo"
                >
                  <ArrowRightIcon size={18} color="#FFFFFF" />
                </button>
              </div>

              {/* Reason card below photo */}
              <div className="w-full mt-3 p-3.5 rounded-2xl bg-white shadow-xl text-center border border-rose-200">
                <p
                  className="text-base sm:text-lg leading-snug font-bold text-[#2D2329]"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {activePhotoReason.text}
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm flex justify-center pb-2">
              <span
                className="text-xs text-white/60"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Swipe left / right ya buttons se agla photo dekho 🤍
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  )
}
