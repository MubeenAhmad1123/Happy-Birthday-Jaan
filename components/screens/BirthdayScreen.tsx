'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowRightIcon, HeartIcon } from '@/components/Icons'
import { buzz, pop, softChime } from '@/lib/feedback'
import { startSong } from '@/lib/audioPlayer'

interface BirthdayScreenProps {
  onNext: () => void
  songTitle?: string
}

interface CursorHeart {
  id: number
  x: number
  y: number
  color: string
}

const HEART_COLORS = ['#ff3366', '#ff6699', '#ff33cc', '#ff99cc', '#ff66b2', '#ff0066']

export default function BirthdayScreen({
  onNext,
  songTitle = 'Dil Ibadat Kar Raha Hai',
}: BirthdayScreenProps) {
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [dateText, setDateText] = useState('')
  const [letterTypedText, setLetterTypedText] = useState('')
  const [cursorHearts, setCursorHearts] = useState<CursorHeart[]>([])
  const letterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dateTimerRef = useRef<NodeJS.Timeout | null>(null)

  const milestoneDate = '5 November 2026 • 25 Years 🤍'
  const letterMessage =
    'Maria, meri Jaan, 25 saal mubarak ho! You are the most special girl in the world. Today, I wish you endless happiness, beautiful health, and countless reasons to smile. Har saal hum aise hi saath celebrate karenge inshallah. Happy Birthday to you meri Sukoon! 💕 — Tumhara Ganda Bachha'

  // Auto-start music on enter
  useEffect(() => {
    startSong().catch(() => {})
  }, [])

  // Floating Heart Cursor & Touch Trail
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (Math.random() > 0.4) return // rate limit for smooth 60fps
    const newHeart: CursorHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }
    setCursorHearts((prev) => [...prev.slice(-15), newHeart])
  }

  // Type out milestone date
  useEffect(() => {
    let currentIdx = 0
    const delayTimer = setTimeout(() => {
      dateTimerRef.current = setInterval(() => {
        currentIdx++
        if (currentIdx <= milestoneDate.length) {
          setDateText(milestoneDate.slice(0, currentIdx))
        } else {
          if (dateTimerRef.current) clearInterval(dateTimerRef.current)
        }
      }, 70)
    }, 1200)

    return () => {
      clearTimeout(delayTimer)
      if (dateTimerRef.current) clearInterval(dateTimerRef.current)
    }
  }, [milestoneDate])

  // Open Letter Modal
  const handleOpenLetter = () => {
    buzz(15)
    softChime()
    pop()
    setIsLetterOpen(true)

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FF7882', '#FF66B2', '#FFFFFF', '#D4AF37'],
      })
    } catch {
      // ignore
    }

    // Type letter text
    let charIdx = 0
    setLetterTypedText('')
    if (letterTimerRef.current) clearInterval(letterTimerRef.current)

    setTimeout(() => {
      letterTimerRef.current = setInterval(() => {
        charIdx += 2
        if (charIdx <= letterMessage.length) {
          setLetterTypedText(letterMessage.slice(0, charIdx))
        } else {
          setLetterTypedText(letterMessage)
          if (letterTimerRef.current) clearInterval(letterTimerRef.current)
        }
      }, 30)
    }, 400)
  }

  const handleCloseLetter = () => {
    buzz(8)
    if (letterTimerRef.current) clearInterval(letterTimerRef.current)
    setIsLetterOpen(false)
  }

  const handleProceed = () => {
    buzz(15)
    softChime()
    onNext()
  }

  // Clean old cursor hearts after 1.2s
  useEffect(() => {
    if (cursorHearts.length === 0) return
    const timer = setTimeout(() => {
      setCursorHearts((prev) => prev.slice(1))
    }, 1200)
    return () => clearTimeout(timer)
  }, [cursorHearts])

  return (
    <div
      onPointerMove={handlePointerMove}
      className="birthday-animation-container select-none"
    >
      {/* ── Top Bunting Flags ── */}
      <div className="flag__birthday">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/1.png" alt="Party flags" className="flag__left" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/1.png" alt="Party flags" className="flag__right" />
      </div>

      {/* ── Floating Stars ── */}
      <div className="decorate_star star1" style={{ width: 18, height: 18, top: '8%', left: '8%' }} />
      <div className="decorate_star star2" style={{ width: 14, height: 14, top: '15%', right: '12%' }} />
      <div className="decorate_star star3" style={{ width: 16, height: 16, bottom: '22%', left: '10%' }} />
      <div className="decorate_star star4" style={{ width: 15, height: 15, bottom: '15%', right: '14%' }} />

      {/* ── Floating Flowers & Decor ── */}
      <div className="absolute top-[28%] left-3 pointer-events-none opacity-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/decorate_flower.png" width="22" alt="" />
      </div>
      <div className="absolute top-[32%] right-3 pointer-events-none opacity-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/decorate_flower.png" width="22" alt="" />
      </div>

      {/* ── Main Content Column ── */}
      <div className="bday_content">
        {/* Bouncy Staggered "Happy Birthday" Title with Party Hat */}
        <div className="bday_title">
          <h1 className="happy">
            <span style={{ '--t': '0.1s' } as React.CSSProperties}>H</span>
            <span style={{ '--t': '0.18s' } as React.CSSProperties}>a</span>
            <span style={{ '--t': '0.26s' } as React.CSSProperties}>p</span>
            <span style={{ '--t': '0.34s' } as React.CSSProperties}>p</span>
            <span style={{ '--t': '0.42s' } as React.CSSProperties}>y</span>
          </h1>
          <h1 className="birthday">
            <span style={{ '--t': '0.5s' } as React.CSSProperties}>B</span>
            <span style={{ '--t': '0.58s' } as React.CSSProperties}>i</span>
            <span style={{ '--t': '0.66s' } as React.CSSProperties}>r</span>
            <span style={{ '--t': '0.74s' } as React.CSSProperties}>t</span>
            <span style={{ '--t': '0.82s' } as React.CSSProperties}>h</span>
            <span style={{ '--t': '0.90s' } as React.CSSProperties}>d</span>
            <span style={{ '--t': '0.98s' } as React.CSSProperties}>a</span>
            <span style={{ '--t': '1.06s' } as React.CSSProperties}>y</span>
          </h1>

          {/* Party Cone Hat perching on 'B' */}
          <div className="hat pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birthday-gift/hat.png" alt="Party Hat" />
          </div>
        </div>

        {/* Circular Framed Photo Card with Floating Balloons & Rotating Badge */}
        <div className="box__account">
          {/* Left Balloon */}
          <div className="balloon_one">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birthday-gift/balloon1.png" alt="Balloon" />
          </div>

          {/* Circular Photo */}
          <div className="image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/birthday-gift/img.png"
              alt="Maria"
              onError={(e) => {
                // Fallback to Photo 01 if needed
                e.currentTarget.src = '/api/photos/01'
              }}
            />
          </div>

          {/* Right Balloon */}
          <div className="balloon_two">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birthday-gift/balloon2.png" alt="Balloon" />
          </div>

          {/* Rotating "happy-birthday-" Circular Badge */}
          <div className="cricle">
            <div className="text__cricle">
              {['h', 'a', 'p', 'p', 'y', '-', 'b', 'i', 'r', 't', 'h', 'd', 'a', 'y', '-'].map(
                (char, idx) => (
                  <span key={idx} style={{ '--i': idx + 1 } as React.CSSProperties}>
                    {char}
                  </span>
                )
              )}
            </div>
            <div className="center-heart">
              <HeartIcon size={14} color="#F61F1F" />
            </div>
          </div>

          {/* Name Badge with Hearts */}
          <div className="name">
            <HeartIcon size={14} color="#F61F1F" />
            <span>Maria 🤍</span>
            <HeartIcon size={14} color="#F61F1F" />
          </div>
        </div>

        {/* Milestone Date Badge */}
        <div className="date__of__birth">
          <span>{dateText || '5 November 2026'}</span>
        </div>

        {/* "Click here ✉️" Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          id="btn__letter"
          onClick={handleOpenLetter}
        >
          <span>Click here</span>
          <span className="text-xl leading-none">✉️</span>
        </motion.button>
      </div>

      {/* ── Bottom Decorative Elements ── */}
      <div className="smiley__icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/smiley_icon.png" alt="Smiley" />
      </div>

      <div className="decorate_bottom">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birthday-gift/decorate.png" alt="Decorations" />
      </div>

      {/* ── Primary Action: "Aage Chalo" to Crystal Heart ── */}
      <div className="w-full max-w-[390px] mt-3 z-20 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProceed}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #FF6B8B 0%, #E56B8A 50%, #B8405E 100%)',
          }}
        >
          <span>Aage chalo (Tumhare liye ek khaas dil hai)</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </div>

      {/* ── Interactive Birthday Letter Modal ── */}
      <AnimatePresence>
        {isLetterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="box__letter"
            onClick={handleCloseLetter}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="letter__border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseLetter}
                className="close-btn"
                aria-label="Close letter"
              >
                ✕
              </button>

              <div className="letter">
                <div className="title__letter">To Maria 🤍</div>
                <div className="content__letter">
                  {/* Authentic Dudu wishing Bubu with Birthday Roses */}
                  <div className="flex flex-col items-center justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/characters/dudu-bubu-flowers-real.jpg"
                      alt="Dudu wishing Bubu with fresh roses"
                      className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg border-2 border-rose-300"
                    />
                  </div>

                  {/* Typed Letter Content */}
                  <div className="text__letter">
                    <p>{letterTypedText}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Cursor Hearts ── */}
      {cursorHearts.map((h) => (
        <span
          key={h.id}
          className="bday-cursor-heart"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            color: h.color,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
