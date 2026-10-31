'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LetterScreenProps {
  letterText: string
  onBack: () => void
}

export default function LetterScreen({ letterText, onBack }: LetterScreenProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Start typewriter when envelope opens
  useEffect(() => {
    if (!isOpen) return

    let currentIndex = 0
    setIsTyping(true)

    typingTimerRef.current = setInterval(() => {
      currentIndex += 2
      if (currentIndex >= letterText.length) {
        setDisplayedText(letterText)
        setIsTyping(false)
        if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      } else {
        setDisplayedText(letterText.slice(0, currentIndex))
      }
    }, 28)

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    }
  }, [isOpen, letterText])

  // Tap anywhere on paper to skip typewriter
  const handleSkipTyping = () => {
    if (isTyping) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      setDisplayedText(letterText)
      setIsTyping(false)
    }
  }

  return (
    <div
      className="screen relative p-4 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)',
      }}
    >
      {/* Top Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 z-20">
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
          Khat ✉️
        </span>
        <div className="w-12" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="flex flex-col items-center gap-6 my-auto max-w-xs text-center cursor-pointer select-none"
            onClick={() => setIsOpen(true)}
          >
            {/* SVG Envelope */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="relative w-64 h-48 drop-shadow-2xl"
            >
              <svg viewBox="0 0 240 180" width="100%" height="100%">
                {/* Envelope Base */}
                <rect x="10" y="10" width="220" height="160" rx="14" fill="#FFFFFF" stroke="#E56B8A" strokeWidth="3" />
                {/* Flap fold lines */}
                <path d="M10 10 L120 100 L230 10" stroke="#F9D5DE" strokeWidth="3" fill="#FFF0F5" />
                <path d="M10 170 L95 90" stroke="#F9D5DE" strokeWidth="2.5" />
                <path d="M230 170 L145 90" stroke="#F9D5DE" strokeWidth="2.5" />
                {/* Wax Seal with Heart */}
                <circle cx="120" cy="98" r="22" fill="#E56B8A" />
                <circle cx="120" cy="98" r="18" fill="#B8405E" />
                <path
                  d="M120 92 C118 88 112 88 110 92 C108 96 120 104 120 104 C120 104 132 96 130 92 C128 88 122 88 120 92 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </motion.div>

            <div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
              >
                Maria ke naam… 🤍
              </h2>
              <p
                className="text-sm opacity-70 mt-1"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                (Khat kholne ke liye tap karo)
              </p>
            </div>
          </motion.div>
        ) : (
          /* Opened Letter View */
          <motion.div
            key="letter-open"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={handleSkipTyping}
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border-4 flex flex-col select-none my-auto max-h-[75dvh] overflow-y-auto"
            style={{
              background: '#FFFDF9',
              borderColor: '#F9D5DE',
              boxShadow: '0 12px 36px rgba(229,107,138,0.22)',
            }}
          >
            {/* Paper texture lines */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 31px, #E56B8A 31px, #E56B8A 32px)',
                backgroundPosition: '0 40px',
              }}
            />

            {/* Stamp on top right */}
            <div className="absolute top-4 right-4 sticker px-2 py-1 bg-rose-50 border-rose-300 transform rotate-3 flex items-center gap-1">
              <span className="text-xs">🌸</span>
              <span
                className="text-[10px] font-bold text-rose-500 uppercase"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Nov 2026
              </span>
            </div>

            {/* Letter Content with Typewriter */}
            <div className="relative z-10 pt-2 pb-4">
              <p
                className="text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  color: 'var(--charcoal)',
                }}
              >
                {displayedText}
                {isTyping && <span className="animate-pulse text-rose-500">|</span>}
              </p>

              {/* Sign off */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-right"
                >
                  <p
                    className="text-xl font-bold"
                    style={{
                      fontFamily: 'var(--font-dancing)',
                      color: 'var(--deep-rose)',
                    }}
                  >
                    Tumhara Ganda Bachha 🤍
                  </p>
                  <p
                    className="text-sm opacity-80"
                    style={{ fontFamily: 'var(--font-caveat)', color: 'var(--rose)' }}
                  >
                    (Mera Shehzada)
                  </p>
                </motion.div>
              )}
            </div>

            {/* Skip hint */}
            {isTyping && (
              <div className="text-center mt-auto pt-2">
                <span
                  className="text-xs opacity-50"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  (Tap karo to skip typewriter)
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

