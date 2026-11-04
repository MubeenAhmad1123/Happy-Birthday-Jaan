'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { ArrowLeftIcon, LetterIcon, FlowerIcon, HeartIcon } from '@/components/Icons'

interface LetterScreenProps {
  letterText: string
  onBack: () => void
}

export default function LetterScreen({ letterText, onBack }: LetterScreenProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const cardScrollRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Start typewriter when envelope opens
  useEffect(() => {
    if (!isOpen) return

    let currentIndex = 0
    setIsTyping(true)
    setDisplayedText('')

    typingTimerRef.current = setInterval(() => {
      currentIndex += 2
      if (currentIndex >= letterText.length) {
        setDisplayedText(letterText)
        setIsTyping(false)
        if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      } else {
        setDisplayedText(letterText.slice(0, currentIndex))
        if (cardScrollRef.current) {
          cardScrollRef.current.scrollTop = cardScrollRef.current.scrollHeight
        }
      }
    }, 24)

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    }
  }, [isOpen, letterText])

  const handleSkipTyping = () => {
    if (isTyping) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      setDisplayedText(letterText)
      setIsTyping(false)
    }
  }

  return (
    <ScreenShell
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20 pt-2 mb-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white shadow-sm text-deep-rose border border-rose-200/80 cursor-pointer"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas Hub"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-1.5">
          <LetterIcon size={18} color="var(--rose)" />
          <span
            className="text-base font-bold text-deep-rose tracking-wide"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            The Letter
          </span>
        </div>

        <div className="w-12" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-6 my-auto w-full max-w-xs text-center cursor-pointer select-none"
            onClick={() => setIsOpen(true)}
          >
            {/* SVG Envelope with Wax Seal */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="relative w-72 h-52 drop-shadow-xl"
            >
              <svg viewBox="0 0 240 180" width="100%" height="100%">
                <rect
                  x="10"
                  y="10"
                  width="220"
                  height="160"
                  rx="18"
                  fill="#FFFFFF"
                  stroke="#E56B8A"
                  strokeWidth="2.5"
                />
                <path
                  d="M10 10 L120 100 L230 10"
                  stroke="#F9D5DE"
                  strokeWidth="2.5"
                  fill="#FFF2F5"
                />
                <path d="M10 170 L95 90" stroke="#F9D5DE" strokeWidth="2" />
                <path d="M230 170 L145 90" stroke="#F9D5DE" strokeWidth="2" />
                <circle cx="120" cy="98" r="22" fill="#E56B8A" />
                <circle cx="120" cy="98" r="18" fill="#B8405E" />
                <path
                  d="M120 92 C118 88 112 88 110 92 C108 96 120 104 120 104 C120 104 132 96 130 92 C128 88 122 88 120 92 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </motion.div>

            <div className="flex flex-col items-center gap-1.5">
              <h2
                className="text-2xl sm:text-3xl font-bold text-deep-rose"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  color: 'var(--deep-rose)',
                  textShadow: '0 2px 10px rgba(229,107,138,0.2)',
                }}
              >
                Maria ke naam… 🤍
              </h2>
              <p
                className="text-sm text-rose-600 font-bold"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                (Khat kholne ke liye tap karo)
              </p>
            </div>
          </motion.div>
        ) : (
          /* Opened Letter Paper Card (Max 70dvh with inner scroll) */
          <motion.div
            key="letter-open"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            onClick={handleSkipTyping}
            className="w-full max-w-[440px] rounded-3xl p-6 shadow-xl relative border flex flex-col select-none my-auto max-h-[70dvh] overflow-hidden bg-white"
            style={{
              borderColor: 'rgba(229, 107, 138, 0.3)',
              boxShadow: '0 16px 40px rgba(229,107,138,0.15)',
            }}
          >
            {/* Corner Decorative Flower SVGs */}
            <div className="absolute top-3 left-3 opacity-30 pointer-events-none">
              <FlowerIcon size={20} color="var(--rose)" />
            </div>
            <div className="absolute top-3 right-3 opacity-30 pointer-events-none">
              <HeartIcon size={18} color="var(--rose)" />
            </div>

            {/* Scrollable Letter Body */}
            <div
              ref={cardScrollRef}
              className="relative z-10 w-full overflow-y-auto pr-1 text-left"
              style={{
                scrollBehavior: 'smooth',
                maxHeight: 'calc(70dvh - 56px)',
              }}
            >
              <p
                className="whitespace-pre-wrap leading-[1.7] text-[#2D2329]"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(18px, 4.8vw, 20px)',
                }}
              >
                {displayedText}
                {isTyping && <span className="animate-pulse text-rose-500 font-bold">|</span>}
              </p>

              {/* Romantic Sign-off in Dancing Script */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-3 border-t border-rose-100 text-right"
                >
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: 'var(--font-dancing)',
                      color: 'var(--deep-rose)',
                    }}
                  >
                    Tumhara Ganda Bachha 🤍
                  </p>
                  <p
                    className="text-base font-bold opacity-80"
                    style={{ fontFamily: 'var(--font-caveat)', color: 'var(--rose)' }}
                  >
                    (Mera Shehzada)
                  </p>
                </motion.div>
              )}
            </div>

            {/* Tap to skip hint */}
            {isTyping && (
              <div className="text-center pt-2 mt-auto border-t border-rose-100">
                <span
                  className="text-xs text-rose-400 font-bold"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  (Tap anywhere to skip typewriter)
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  )
}
