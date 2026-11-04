'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { ReasonItem } from '@/lib/contentData'
import CharacterSticker from '@/components/CharacterSticker'
import {
  HeartIcon,
  SparkleIcon,
  FlowerIcon,
  CloseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@/components/Icons'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
}

const tilts = [-3, 2.5, -2, 3, -2.5, 1.8]

export default function ReasonsScreen({ reasons, onNext }: ReasonsScreenProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null)
  const [viewedReasons, setViewedReasons] = useState<Record<number, boolean>>({})

  // 3 cards per page as requested
  const itemsPerPage = 3
  const safeReasons = reasons && reasons.length > 0 ? reasons : []
  const totalReasons = safeReasons.length
  const totalPages = Math.ceil(totalReasons / itemsPerPage)

  const startIndex = currentPage * itemsPerPage
  const currentReasons = safeReasons.slice(startIndex, startIndex + itemsPerPage)

  const openReasonModal = (index: number) => {
    setActiveModalIndex(index)
    setViewedReasons((prev) => ({ ...prev, [index]: true }))
  }

  const closeModal = () => {
    setActiveModalIndex(null)
  }

  const nextReasonInModal = () => {
    if (activeModalIndex !== null) {
      const nextIdx = (activeModalIndex + 1) % totalReasons
      setActiveModalIndex(nextIdx)
      setViewedReasons((prev) => ({ ...prev, [nextIdx]: true }))
    }
  }

  const prevReasonInModal = () => {
    if (activeModalIndex !== null) {
      const prevIdx = (activeModalIndex - 1 + totalReasons) % totalReasons
      setActiveModalIndex(prevIdx)
      setViewedReasons((prev) => ({ ...prev, [prevIdx]: true }))
    }
  }

  const activeReason =
    activeModalIndex !== null ? safeReasons[activeModalIndex] : null

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Header & Progress Counter */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-1 z-10">
        <div className="flex items-center justify-between w-full mb-1 px-1">
          <span
            className="text-xs uppercase tracking-widest font-bold text-rose-400"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            25 Years • 25 Reasons
          </span>
          <div className="px-3 py-0.5 rounded-full text-xs font-bold text-white bg-rose-950/70 border border-rose-500/40 shadow-sm">
            {Object.keys(viewedReasons).length}/{totalReasons} Dekhe
          </div>
        </div>

        <h1
          className="heading-fluid leading-tight text-white mt-0.5"
          style={{
            fontFamily: 'var(--font-dancing)',
            textShadow: '0 2px 14px rgba(229,107,138,0.4)',
          }}
        >
          25 reasons I love you
        </h1>
        <p
          className="text-xs sm:text-sm text-white/60 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          (Har card pe tap karke tasveer aur dil ki baat dekho)
        </p>
      </div>

      {/* 3 Cards at a time (stacked vertically) */}
      <div className="w-full max-w-sm flex flex-col gap-3 my-auto z-10 px-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 w-full"
          >
            {currentReasons.map((item, localIdx) => {
              const globalIndex = startIndex + localIdx
              const tilt = tilts[globalIndex % tilts.length]
              const variant = globalIndex % 3 // 0: Dark, 1: Rose, 2: Blush
              const photoUrl =
                item.photoUrl ||
                `/api/photos/${String(globalIndex + 1).padStart(2, '0')}`

              // Card styling variants
              let cardBg = 'linear-gradient(135deg, #1E1A20 0%, #151218 100%)'
              let cardBorder = 'rgba(229, 107, 138, 0.4)'
              let textColor = '#FFF8F5'
              let subtextColor = 'rgba(255, 248, 245, 0.75)'

              if (variant === 1) {
                cardBg = 'linear-gradient(135deg, #B8405E 0%, #E56B8A 100%)'
                cardBorder = 'rgba(255, 255, 255, 0.25)'
                textColor = '#FFFFFF'
                subtextColor = 'rgba(255, 255, 255, 0.9)'
              } else if (variant === 2) {
                cardBg = 'linear-gradient(135deg, #FFF8F5 0%, #F9D5DE 100%)'
                cardBorder = 'rgba(232, 194, 122, 0.5)'
                textColor = '#1E1A20'
                subtextColor = 'rgba(58, 48, 54, 0.85)'
              }

              return (
                <motion.button
                  key={item.id || globalIndex}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openReasonModal(globalIndex)}
                  className="w-full min-h-[105px] p-3.5 rounded-3xl flex items-center justify-between border cursor-pointer text-left shadow-lg select-none"
                  style={{
                    background: cardBg,
                    borderColor: cardBorder,
                  }}
                  aria-label={`Reason ${globalIndex + 1}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Small tilted photo thumbnail */}
                    <div
                      className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white/40 shadow-md bg-black"
                      style={{
                        transform: `rotate(${tilt}deg)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Content preview */}
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-current"
                          style={{
                            fontFamily: 'var(--font-baloo)',
                            color: textColor,
                          }}
                        >
                          #{globalIndex + 1}
                        </span>
                        <HeartIcon size={14} color={variant === 2 ? '#B8405E' : '#E56B8A'} />
                      </div>

                      <p
                        className="text-base line-clamp-2 leading-snug font-medium"
                        style={{
                          fontFamily: 'var(--font-caveat)',
                          color: subtextColor,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>

                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
                    style={{ borderColor: cardBorder }}
                  >
                    <ArrowRightIcon size={12} color={textColor} />
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Paging Controls */}
      <div className="w-full max-w-sm flex items-center justify-between z-10 px-2 py-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 bg-white/10 text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          <ArrowLeftIcon size={14} color="currentColor" />
          <span>Piche</span>
        </motion.button>

        {/* Dots Indicator */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === i
                  ? 'w-5 bg-rose-500'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {currentPage < totalPages - 1 ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 bg-white/10 text-white border border-white/10"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            <span>Aage</span>
            <ArrowRightIcon size={14} color="currentColor" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onNext}
            className="px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 bg-rose-600 text-white shadow-lg border border-rose-400/50"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            <span>Aage chalo</span>
            <ArrowRightIcon size={14} color="#FFFFFF" />
          </motion.button>
        )}
      </div>

      {/* Expanded Modal / Bottom-Sheet (Large Photo + Separate Text Card) */}
      <AnimatePresence>
        {activeModalIndex !== null && activeReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4"
          >
            {/* Modal Top Bar */}
            <div className="w-full max-w-sm flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-sm">
                <SparkleIcon size={14} color="#E8C27A" />
                <span style={{ fontFamily: 'var(--font-baloo)' }}>
                  Reason #{activeModalIndex + 1} of {totalReasons}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center border border-white/20 cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon size={18} color="#FFFFFF" />
              </motion.button>
            </div>

            {/* Modal Center: Large 3:4 Photo on top with blurred backing */}
            <div
              className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center my-auto py-2"
              style={{ touchAction: 'pan-y' }}
            >
              <div
                className="relative w-full aspect-[3/4] max-h-[46dvh] rounded-3xl overflow-hidden bg-black/80 border border-white/15 flex items-center justify-center shadow-2xl"
              >
                {/* Background blur */}
                {activeReason.photoUrl && (
                  <div className="absolute inset-0 pointer-events-none opacity-30 filter blur-xl scale-110">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeReason.photoUrl ||
                        `/api/photos/${String(activeModalIndex + 1).padStart(2, '0')}`
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Main contain image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activeReason.photoUrl ||
                    `/api/photos/${String(activeModalIndex + 1).padStart(2, '0')}`
                  }
                  alt={activeReason.text}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain relative z-10 pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />

                {/* Left / Right arrows inside photo to flip between all 25 */}
                <button
                  onClick={prevReasonInModal}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center z-20 border border-white/20 cursor-pointer"
                  aria-label="Previous reason"
                >
                  <ArrowLeftIcon size={18} color="#FFFFFF" />
                </button>

                <button
                  onClick={nextReasonInModal}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center z-20 border border-white/20 cursor-pointer"
                  aria-label="Next reason"
                >
                  <ArrowRightIcon size={18} color="#FFFFFF" />
                </button>
              </div>

              {/* Separate Text Card BELOW the photo */}
              <motion.div
                key={activeModalIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full mt-3 p-4 rounded-3xl border text-center shadow-2xl relative"
                style={{
                  background:
                    activeModalIndex % 2 === 0
                      ? 'linear-gradient(145deg, #1E1A20 0%, #121014 100%)'
                      : 'linear-gradient(145deg, #FFF8F5 0%, #F9D5DE 100%)',
                  borderColor: 'rgba(232, 194, 122, 0.4)',
                }}
              >
                {/* Subtle decorative icons in corners */}
                <div className="absolute top-2.5 left-3 opacity-40">
                  <FlowerIcon
                    size={16}
                    color={activeModalIndex % 2 === 0 ? 'var(--rose)' : 'var(--deep-rose)'}
                  />
                </div>
                <div className="absolute top-2.5 right-3 opacity-40">
                  <HeartIcon
                    size={16}
                    color={activeModalIndex % 2 === 0 ? 'var(--rose)' : 'var(--deep-rose)'}
                  />
                </div>

                <p
                  className="text-xl sm:text-2xl leading-relaxed font-bold px-3 py-1"
                  style={{
                    fontFamily: 'var(--font-caveat)',
                    color: activeModalIndex % 2 === 0 ? '#FFF8F5' : '#1E1A20',
                  }}
                >
                  {activeReason.text}
                </p>
              </motion.div>
            </div>

            {/* Modal Bottom Counter */}
            <div className="w-full max-w-sm flex justify-center pb-2">
              <span
                className="text-xs text-white/50"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Swipe left / right ya teer daba ke agla reason dekho ✨
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  )
}
