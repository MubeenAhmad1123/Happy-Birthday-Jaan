'use client'

import React, { useState, useCallback, useEffect } from 'react'
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
import { pop, buzz } from '@/lib/feedback'

interface ReasonsScreenProps {
  reasons: ReasonItem[]
  onNext: () => void
}

export default function ReasonsScreen({ reasons, onNext }: ReasonsScreenProps) {
  const safeReasons = reasons && reasons.length > 0 ? reasons : []
  const total = safeReasons.length || 25
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Preload neighboring photos so back face photos show instantly
  useEffect(() => {
    if (total <= 0) return
    const curNum = String(activeIndex + 1).padStart(2, '0')
    const nextNum = String(((activeIndex + 1) % total) + 1).padStart(2, '0')
    const prevNum = String((activeIndex === 0 ? total : activeIndex)).padStart(2, '0')

    const p1 = new Image()
    p1.src = `/api/photos/${curNum}`
    const p2 = new Image()
    p2.src = `/api/photos/${nextNum}`
    const p3 = new Image()
    p3.src = `/api/photos/${prevNum}`
  }, [activeIndex, total])

  const goToCard = useCallback(
    (index: number) => {
      setIsFlipped(false)
      setActiveIndex(index)
    },
    []
  )

  const prevCard = () => {
    buzz(10)
    setIsFlipped(false)
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
  }

  const nextCard = () => {
    buzz(10)
    setIsFlipped(false)
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
  }

  const handleCenterCardClick = () => {
    const nextFlip = !isFlipped
    setIsFlipped(nextFlip)

    if (nextFlip) {
      pop()
      buzz(15)
      try {
        confetti({
          particleCount: 18,
          spread: 45,
          origin: { y: 0.55 },
          colors: ['#E56B8A', '#F9D5DE', '#D4AF37', '#FFFFFF'],
        })
      } catch {
        // ignore
      }
    } else {
      buzz(8)
    }
  }

  // Pre-generate front style based on index
  const getFrontStyle = (idx: number) => {
    const variant = idx % 3
    if (variant === 0) {
      return {
        background: 'linear-gradient(145deg, #1A161E 0%, #121014 60%, #0D0B0F 100%)',
        accentColor: '#D4AF37',
        glowColor: 'rgba(212, 175, 55, 0.3)',
      }
    } else if (variant === 1) {
      return {
        background: 'linear-gradient(145deg, #3A1422 0%, #250B16 60%, #17070E 100%)',
        accentColor: '#FF7597',
        glowColor: 'rgba(229, 107, 138, 0.35)',
      }
    } else {
      return {
        background: 'linear-gradient(145deg, #241A22 0%, #171116 60%, #100C0F 100%)',
        accentColor: '#F5E6BE',
        glowColor: 'rgba(249, 213, 222, 0.3)',
      }
    }
  }

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-1 z-10 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 mb-1">
          <SparkleIcon size={13} color="#D4AF37" />
          <span
            className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            25 Years • 25 Reasons
          </span>
          <SparkleIcon size={13} color="#D4AF37" />
        </div>

        <h1
          className="heading-fluid leading-tight text-white mt-0.5"
          style={{
            fontFamily: 'var(--font-dancing)',
            textShadow: '0 2px 14px rgba(229,107,138,0.4)',
          }}
        >
          25 Reasons I Love You
        </h1>
      </div>

      {/* 3D Coverflow Carousel Area */}
      <div className="relative w-full h-[390px] sm:h-[410px] flex items-center justify-center my-auto overflow-hidden select-none">
        {/* Soft radial glow behind center card */}
        <div
          className="absolute w-72 h-72 rounded-full pointer-events-none filter blur-2xl"
          style={{
            background:
              'radial-gradient(circle, rgba(229,107,138,0.2) 0%, rgba(212,175,55,0.08) 50%, transparent 70%)',
          }}
        />

        {safeReasons.map((item, idx) => {
          // Calculate relative position to activeIndex with wrapping or clamp
          const offset = idx - activeIndex
          const isCenter = offset === 0
          const isLeft = offset === -1 || (activeIndex === 0 && idx === total - 1)
          const isRight = offset === 1 || (activeIndex === total - 1 && idx === 0)

          // Only render current, previous, and next card for ultra performance
          if (!isCenter && !isLeft && !isRight) {
            return null
          }

          const front = getFrontStyle(idx)
          const reasonNum = String(idx + 1).padStart(2, '0')
          const photoUrl =
            item.photoUrl ||
            `/api/photos/${reasonNum}`

          return (
            <motion.div
              key={item.id || idx}
              initial={false}
              animate={{
                x: isCenter ? '0%' : isLeft ? '-76%' : '76%',
                scale: isCenter ? 1 : 0.88,
                opacity: isCenter ? 1 : 0.65,
                zIndex: isCenter ? 30 : 10,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
              }}
              drag={isCenter ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x > 45) {
                  prevCard()
                } else if (info.offset.x < -45) {
                  nextCard()
                }
              }}
              onClick={() => {
                if (isCenter) {
                  handleCenterCardClick()
                } else if (isLeft) {
                  prevCard()
                } else if (isRight) {
                  nextCard()
                }
              }}
              className="absolute w-[76vw] max-w-[310px] aspect-[3/4] cursor-pointer"
              style={{
                perspective: '1200px',
                WebkitPerspective: '1200px',
                touchAction: 'pan-y',
              }}
            >
              {/* 3D Flippable Body */}
              <motion.div
                animate={{ rotateY: isCenter && isFlipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-full h-full relative rounded-[28px] shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
              >
                {/* ─── FRONT FACE (Luxury Dark Card with Glowing Heart) ─── */}
                <div
                  className="absolute inset-0 w-full h-full rounded-[28px] p-3 flex flex-col justify-between items-center text-center border overflow-hidden select-none backface-hidden"
                  style={{
                    background: front.background,
                    borderColor: 'rgba(212, 175, 55, 0.55)',
                    boxShadow: `0 14px 36px rgba(0, 0, 0, 0.6), 0 0 20px ${front.glowColor}`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {/* Subtle hairline inner border */}
                  <div className="absolute inset-2.5 rounded-[22px] border border-rose-300/25 pointer-events-none" />

                  {/* Top: Reason Number in Gold Script */}
                  <div className="w-full flex items-center justify-between pt-2 px-3 z-10">
                    <span
                      className="text-xs font-bold uppercase tracking-wider text-white/50"
                      style={{ fontFamily: 'var(--font-baloo)' }}
                    >
                      Reason
                    </span>
                    <span
                      className="text-3xl font-bold tracking-wider"
                      style={{
                        fontFamily: 'var(--font-dancing)',
                        color: front.accentColor,
                        textShadow: `0 2px 10px ${front.glowColor}`,
                      }}
                    >
                      {reasonNum}
                    </span>
                  </div>

                  {/* Center: Glowing SVG Heart with Gentle Heartbeat */}
                  <div className="my-auto relative flex items-center justify-center">
                    <div
                      className="absolute w-24 h-24 rounded-full pointer-events-none filter blur-xl animate-pulse-glow"
                      style={{
                        background: `radial-gradient(circle, ${front.glowColor} 0%, transparent 70%)`,
                      }}
                    />

                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.2,
                        ease: 'easeInOut',
                      }}
                      className="drop-shadow-lg"
                    >
                      <svg width="68" height="64" viewBox="0 0 24 22" fill="none">
                        <defs>
                          <linearGradient
                            id={`heartGlow-${idx}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#FF7597" />
                            <stop offset="50%" stopColor="#E56B8A" />
                            <stop offset="100%" stopColor="#B8405E" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill={`url(#heartGlow-${idx})`}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Bottom: "Tap to flip" */}
                  <div className="pb-3 z-10 flex items-center gap-1.5 opacity-90">
                    <SparkleIcon size={12} color={front.accentColor} />
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{
                        fontFamily: 'var(--font-baloo)',
                        color: front.accentColor,
                      }}
                    >
                      Tap to flip 🤍
                    </span>
                    <SparkleIcon size={12} color={front.accentColor} />
                  </div>
                </div>

                {/* ─── BACK FACE (Top 62% Photo, Bottom 38% Cream Panel) ─── */}
                <div
                  className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden flex flex-col bg-[#FFF8F5] border border-rose-300/80 shadow-2xl backface-hidden rotate-y-180 select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    WebkitTransform: 'rotateY(180deg)',
                  }}
                >
                  {/* Top 62%: Maria's Photo (object-cover, top-aligned) */}
                  <div className="relative w-full h-[62%] bg-neutral-900 overflow-hidden border-b border-rose-200">
                    {/* Shimmer pulse loading indicator */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-[#121014] animate-pulse" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={item.text}
                      className="relative z-10 w-full h-full object-cover object-top select-none pointer-events-none transition-opacity duration-300"
                      loading={isCenter ? 'eager' : 'lazy'}
                      onLoad={(e) => {
                        const target = e.currentTarget
                        target.style.opacity = '1'
                      }}
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.opacity = '0.3'
                      }}
                    />

                    {/* Fallback romantic graphic if image is loading or fails */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mb-1">
                        <HeartIcon size={22} color="#E56B8A" />
                      </div>
                      <span className="text-[11px] text-rose-200/90 font-bold" style={{ fontFamily: 'var(--font-baloo)' }}>
                        Maria 🤍
                      </span>
                    </div>

                    {/* Subtle top gold gradient overlay */}
                    <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-20" />

                    {/* Small Reason Number Badge at top right */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white text-[11px] font-bold z-20">
                      #{reasonNum}
                    </div>
                  </div>

                  {/* Bottom 38%: Cream Romantic Panel with Reason Text */}
                  <div className="relative w-full h-[38%] p-3 bg-gradient-to-b from-[#FFFDFB] to-[#FFF5F8] flex flex-col justify-between items-center text-center">
                    <div className="w-full my-auto px-1 flex flex-col items-center">
                      <p
                        className="font-bold text-[#1E1A20] leading-snug line-clamp-3"
                        style={{
                          fontFamily: 'var(--font-caveat)',
                          fontSize: 'clamp(19px, 5vw, 22px)',
                        }}
                      >
                        {item.text}
                      </p>
                    </div>

                    {/* Bottom shy decoration */}
                    <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-rose-200/50 w-full">
                      <HeartIcon size={12} color="#E56B8A" />
                      <span
                        className="text-[11px] font-bold text-rose-500 tracking-wide"
                        style={{ fontFamily: 'var(--font-baloo)' }}
                      >
                        Maria 🤍
                      </span>
                      <HeartIcon size={12} color="#E56B8A" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Controls & Navigation Below Carousel */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 px-2 pb-2 z-10">
        {/* Counter: "7 / 25" + Dot progress bar */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <div className="flex items-center gap-2">
            <span
              className="text-base font-bold text-white tracking-wider"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              {activeIndex + 1} / {total}
            </span>
          </div>

          {/* Sleek continuous progress bar */}
          <div className="w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-[#D4AF37] to-rose-300 transition-all duration-300 rounded-full"
              style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* 48px Round Arrow Buttons + "Tap karke kholo" */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={prevCard}
            className="btn-circle"
            aria-label="Previous reason"
          >
            <ArrowLeftIcon size={18} color="#B8405E" />
          </button>

          <span
            className="text-sm font-medium text-rose-300/90"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Tap karke kholo ✨
          </span>

          <button
            onClick={nextCard}
            className="btn-circle"
            aria-label="Next reason"
          >
            <ArrowRightIcon size={18} color="#B8405E" />
          </button>
        </div>

        {/* Proceed to Next Chapter Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            buzz(10)
            onNext()
          }}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl mt-1"
        >
          <span>Aage chalo (Tumhara Khwab)</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </div>
    </ScreenShell>
  )
}
