'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import { ReasonItem } from '@/lib/contentData'
import {
  HeartIcon,
  SparkleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@/components/Icons'
import { pop, buzz, softChime } from '@/lib/feedback'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
  onBack?: () => void
}

const CARDS_PER_PAGE = 6

export default function ReasonsScreen({
  reasons,
  onNext,
  onBack,
}: ReasonsScreenProps) {
  const safeReasons = reasons && reasons.length > 0 ? reasons : []
  const totalReasons = safeReasons.length || 25
  const totalPages = Math.ceil(totalReasons / CARDS_PER_PAGE) // 5 pages for 25 items

  const [currentPage, setCurrentPage] = useState(1)
  // Map of card index -> isFlipped
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  // Slice cards for the active page
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const activePageReasons = safeReasons.slice(startIndex, startIndex + CARDS_PER_PAGE)

  // Preload photos for current and next page
  useEffect(() => {
    const preloadStart = startIndex
    const preloadEnd = Math.min(startIndex + CARDS_PER_PAGE * 2, totalReasons)
    for (let i = preloadStart; i < preloadEnd; i++) {
      const numStr = String(i + 1).padStart(2, '0')
      const img = new Image()
      img.src = `/api/photos/${numStr}`
    }
  }, [currentPage, startIndex, totalReasons])

  // Handle Flip
  const handleCardClick = (globalIndex: number) => {
    const currentlyFlipped = !!flippedCards[globalIndex]
    const willBeFlipped = !currentlyFlipped

    setFlippedCards((prev) => ({
      ...prev,
      [globalIndex]: willBeFlipped,
    }))

    if (willBeFlipped) {
      pop()
      buzz(15)
      try {
        confetti({
          particleCount: 16,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#FF7597', '#F9D5DE', '#FFD97D', '#FFFFFF'],
        })
      } catch {
        // ignore
      }
    } else {
      buzz(8)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      buzz(10)
      setCurrentPage((prev) => prev - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      buzz(10)
      softChime()
      setCurrentPage((prev) => prev + 1)
    }
  }

  const isFinalPage = currentPage === totalPages

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      contentClassName="justify-between py-2 select-none"
    >
      {/* ── TOP HEADER ── */}
      <div className="w-full flex items-center justify-between z-20 pt-1 pb-1 px-1">
        {onBack ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              buzz(10)
              onBack()
            }}
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-white/15 text-white border border-white/25 hover:bg-white/25 shadow-md transition-all cursor-pointer"
            style={{ fontFamily: 'var(--font-baloo)' }}
            aria-label="Back to Hub"
          >
            <ArrowLeftIcon size={14} color="#FFFFFF" />
            <span>Back</span>
          </motion.button>
        ) : (
          <div className="w-16" />
        )}

        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/50 shadow-sm">
            <SparkleIcon size={11} color="#FFD97D" />
            <span
              className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold"
              style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
            >
              25 Reasons • {currentPage}/{totalPages}
            </span>
            <SparkleIcon size={11} color="#FFD97D" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight mt-0.5"
            style={{
              fontFamily: 'var(--font-dancing)',
              color: '#FFFFFF',
              textShadow: '0 2px 14px rgba(229,107,138,0.5)',
            }}
          >
            25 Reasons I Love You
          </h1>
        </div>

        <div className="w-16" />
      </div>

      {/* ── 2 COLUMNS × 3 ROWS GRID (Total 6 Cards Per Screen) ── */}
      <div className="w-full my-auto z-10 px-1 py-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`w-full max-w-[420px] mx-auto ${
              isFinalPage && activePageReasons.length === 1
                ? 'flex flex-col items-center justify-center'
                : 'grid grid-cols-2 gap-2.5 sm:gap-3'
            }`}
          >
            {activePageReasons.map((item, idx) => {
              const globalIndex = startIndex + idx
              const cardNumber = globalIndex + 1
              const isFlipped = !!flippedCards[globalIndex]
              const photoNum = String(cardNumber).padStart(2, '0')
              const photoUrl = item.photoUrl || `/api/photos/${photoNum}`

              // Special highlight for the 25th milestone card
              const isSpecial25 = cardNumber === 25

              return (
                <div
                  key={item.id || globalIndex}
                  onClick={() => handleCardClick(globalIndex)}
                  className={`relative select-none cursor-pointer focus:outline-none touch-manipulation transition-transform ${
                    isSpecial25 && isFinalPage
                      ? 'w-full max-w-[320px] h-[220px] sm:h-[240px]'
                      : 'w-full h-[162px] sm:h-[178px]'
                  }`}
                  style={{
                    perspective: '1000px',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Reason ${cardNumber}: ${isFlipped ? item.text : 'Tap to reveal'}`}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full h-full relative"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* ── FRONT FACE (Unrevealed Card) ── */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col justify-between items-center text-center border shadow-xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: isSpecial25
                          ? 'linear-gradient(145deg, #381928 0%, #20111B 60%, #150A11 100%)'
                          : idx % 2 === 0
                          ? 'linear-gradient(145deg, #2A1726 0%, #1A111A 60%, #120D14 100%)'
                          : 'linear-gradient(145deg, #22182B 0%, #171120 60%, #100C17 100%)',
                        borderColor: isSpecial25
                          ? 'rgba(255, 217, 125, 0.65)'
                          : 'rgba(229, 107, 138, 0.4)',
                        boxShadow: isSpecial25
                          ? '0 12px 30px rgba(229,107,138,0.35), 0 0 15px rgba(255,217,125,0.2)'
                          : '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* Romantic Glow Aura */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40 filter blur-md"
                        style={{
                          background: isSpecial25
                            ? 'radial-gradient(circle, #E56B8A 0%, transparent 70%)'
                            : 'radial-gradient(circle, #B8405E 0%, transparent 70%)',
                        }}
                      />

                      {/* Top Row: Badge & Sparkle */}
                      <div className="relative z-10 w-full flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border"
                          style={{
                            fontFamily: 'var(--font-baloo)',
                            background: isSpecial25 ? '#FFD97D' : 'rgba(255,255,255,0.15)',
                            color: isSpecial25 ? '#1E1A20' : '#FFD97D',
                            borderColor: isSpecial25 ? '#FFE59E' : 'rgba(255,217,125,0.4)',
                          }}
                        >
                          #{cardNumber < 10 ? `0${cardNumber}` : cardNumber}
                        </span>

                        <motion.div
                          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                        >
                          <SparkleIcon
                            size={12}
                            color={isSpecial25 ? '#FFD97D' : '#FF7597'}
                          />
                        </motion.div>
                      </div>

                      {/* Center Heart / Love Icon */}
                      <div className="relative z-10 flex flex-col items-center my-auto">
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.8 + idx * 0.2,
                            ease: 'easeInOut',
                          }}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg border"
                          style={{
                            background: isSpecial25
                              ? 'linear-gradient(135deg, #FF6584 0%, #B8405E 100%)'
                              : 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.25)',
                          }}
                        >
                          <HeartIcon
                            size={20}
                            color={isSpecial25 ? '#FFFFFF' : '#FF7597'}
                          />
                        </motion.div>
                        <span
                          className="text-[11px] text-white/90 font-bold tracking-wide mt-1"
                          style={{ fontFamily: 'var(--font-baloo)' }}
                        >
                          {isSpecial25 ? 'Final Reason 🎂' : 'Dil ki baat'}
                        </span>
                      </div>

                      {/* Bottom Prompt */}
                      <div className="relative z-10 w-full flex items-center justify-center gap-1">
                        <span
                          className="text-xs sm:text-[13px] font-medium"
                          style={{
                            fontFamily: 'var(--font-caveat)',
                            color: isSpecial25 ? '#FFD97D' : '#FFB6C1',
                          }}
                        >
                          Tap to reveal 🤍
                        </span>
                      </div>
                    </div>

                    {/* ── BACK FACE (Revealed Photo + Reason Text) ── */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between items-center text-center border shadow-2xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(155deg, #1F1520 0%, #150E17 60%, #0E090F 100%)',
                        borderColor: isSpecial25
                          ? 'rgba(255, 217, 125, 0.7)'
                          : 'rgba(255, 117, 151, 0.5)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      {/* Top Photo Thumbnail */}
                      <div
                        className={`relative w-full rounded-xl overflow-hidden border border-white/35 shadow-md shrink-0 ${
                          isSpecial25 && isFinalPage
                            ? 'h-[110px] sm:h-[125px]'
                            : 'h-[74px] sm:h-[82px]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt={`Memory #${cardNumber}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Gradient tint so card blends seamlessly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Tiny Card # badge on photo */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/20">
                          <span
                            className="text-[9px] font-bold text-white leading-none block"
                            style={{ fontFamily: 'var(--font-baloo)' }}
                          >
                            #{cardNumber}
                          </span>
                        </div>
                      </div>

                      {/* Reason Text */}
                      <div className="w-full flex-1 flex items-center justify-center px-1 my-0.5">
                        <p
                          className="font-medium text-white text-center leading-tight overflow-hidden"
                          style={{
                            fontFamily: 'var(--font-caveat)',
                            fontSize: isSpecial25
                              ? 'clamp(15px, 4.2vw, 18px)'
                              : 'clamp(12px, 3.2vw, 14px)',
                            display: '-webkit-box',
                            WebkitLineClamp: isSpecial25 ? 4 : 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.text}
                        </p>
                      </div>

                      {/* Bottom Status Badge */}
                      <div className="w-full flex items-center justify-center gap-1 shrink-0 pt-0.5">
                        <span
                          className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                          style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
                        >
                          Reason #{cardNumber} 🤍
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CONTROLS & PAGINATION (Crystal-Clear UX) ── */}
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center z-20 px-2 mt-auto pb-1">
        {/* If on final page (Page 5), show the grand NEXT STEP BUTTON */}
        {isFinalPage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-2"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                buzz(12)
                softChime()
                onNext()
              }}
              className="btn-primary w-full flex items-center justify-center gap-2 shadow-2xl py-3"
            >
              <span className="text-base sm:text-lg">Aage Barho (Tumhara Khwab ⚖️)</span>
              <ArrowRightIcon size={18} color="#FFFFFF" />
            </motion.button>

            {/* Back to previous reasons */}
            <button
              onClick={goToPrevPage}
              className="text-xs font-bold text-rose-300/80 hover:text-white underline cursor-pointer transition-colors"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              ← Pichle Reasons (19–24) dekho
            </button>
          </motion.div>
        ) : (
          /* Pagination Row: [ Previous ] • • • • • [ Next 6 Reasons → ] */
          <div className="w-full flex items-center justify-between gap-2">
            {/* Previous Page Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/50 border border-white/10'
                  : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 active:scale-95 cursor-pointer'
              }`}
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <ArrowLeftIcon size={14} color="#FFFFFF" />
              <span>Prev</span>
            </motion.button>

            {/* Glowing Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, pIdx) => {
                const pageNum = pIdx + 1
                const isActive = pageNum === currentPage
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      buzz(8)
                      setCurrentPage(pageNum)
                    }}
                    className={`transition-all rounded-full ${
                      isActive
                        ? 'w-5 h-2 bg-[#FF7597] shadow-[0_0_8px_rgba(255,117,151,0.8)]'
                        : 'w-2 h-2 bg-white/25 hover:bg-white/40'
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  />
                )
              })}
            </div>

            {/* Next Page Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={goToNextPage}
              className="btn-primary px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <span>Next</span>
              <ArrowRightIcon size={14} color="#FFFFFF" />
            </motion.button>
          </div>
        )}
      </div>
    </ScreenShell>
  )
}
