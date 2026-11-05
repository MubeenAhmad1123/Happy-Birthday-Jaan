'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import { ArrowLeftIcon, LetterIcon, FlowerIcon, HeartIcon } from '@/components/Icons'
import { buzz, softChime } from '@/lib/feedback'

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

  const handleOpenEnvelope = () => {
    buzz(15)
    softChime()
    setIsOpen(true)
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A'],
      })
    } catch {
      // ignore
    }
  }

  // Typewriter effect when envelope opens
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
    }, 20)

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

  // Split drop cap first letter from the rest
  const firstLetter = displayedText.charAt(0)
  const remainingText = displayedText.slice(1)

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20 pt-1 pb-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            buzz(10)
            onBack()
          }}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/10 shadow-sm text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Back to Hub"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Back</span>
        </motion.button>

        <div className="flex items-center gap-1.5">
          <LetterIcon size={18} color="#FF7597" />
          <span
            className="text-base font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            The Letter
          </span>
        </div>

        <div className="w-12" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed 80% Width Envelope with Wax Seal */
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-6 my-auto w-full text-center cursor-pointer select-none"
            onClick={handleOpenEnvelope}
          >
            {/* 80% Width Envelope SVG */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="relative w-[80%] max-w-[340px] aspect-[4/3] drop-shadow-2xl"
            >
              <svg viewBox="0 0 240 180" width="100%" height="100%">
                <defs>
                  <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FFF2F5" />
                  </linearGradient>
                  <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#B8405E" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Envelope Body */}
                <rect
                  x="10"
                  y="10"
                  width="220"
                  height="160"
                  rx="16"
                  fill="url(#envelopeGrad)"
                  stroke="#E56B8A"
                  strokeWidth="2.5"
                />

                {/* Top Triangular Flap */}
                <path
                  d="M10 10 L120 100 L230 10"
                  stroke="#F9D5DE"
                  strokeWidth="2.5"
                  fill="#FFF0F4"
                />

                {/* Side lines */}
                <path d="M10 170 L95 90" stroke="#F9D5DE" strokeWidth="2" />
                <path d="M230 170 L145 90" stroke="#F9D5DE" strokeWidth="2" />

                {/* Wax Seal Heart in Center */}
                <circle cx="120" cy="98" r="22" fill="#E56B8A" filter="url(#sealShadow)" />
                <circle cx="120" cy="98" r="18" fill="#B8405E" />
                <path
                  d="M120 92 C118 88 112 88 110 92 C108 96 120 104 120 104 C120 104 132 96 130 92 C128 88 122 88 120 92 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </motion.div>

            <div className="flex flex-col items-center gap-1.5 px-2">
              <h2
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  textShadow: '0 2px 14px rgba(229,107,138,0.4)',
                }}
              >
                Maria ke naam… 🤍
              </h2>
              <p
                className="text-sm text-rose-200/90 font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                (Khat kholne ke liye tap karo)
              </p>
            </div>
          </motion.div>
        ) : (
          /* Opened Letter Paper Card (Max 78dvh with inner scroll) */
          <motion.div
            key="letter-open"
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={handleSkipTyping}
            className="w-full max-w-[430px] rounded-3xl p-6 shadow-2xl relative border flex flex-col select-none my-auto max-h-[78dvh] overflow-hidden bg-[#FFFDF9]"
            style={{
              borderColor: 'rgba(229, 107, 138, 0.35)',
              boxShadow: '0 20px 48px rgba(229,107,138,0.18)',
            }}
          >
            {/* Corner Decorative Flower Illustrations */}
            <div className="absolute top-3 left-3 opacity-25 pointer-events-none">
              <FlowerIcon size={24} color="#E56B8A" />
            </div>
            <div className="absolute top-3 right-3 opacity-25 pointer-events-none">
              <HeartIcon size={22} color="#E56B8A" />
            </div>
            <div className="absolute bottom-3 left-3 opacity-25 pointer-events-none">
              <HeartIcon size={20} color="#E56B8A" />
            </div>
            <div className="absolute bottom-3 right-3 opacity-25 pointer-events-none">
              <FlowerIcon size={22} color="#E56B8A" />
            </div>

            {/* Scrollable Letter Body */}
            <div
              ref={cardScrollRef}
              className="relative z-10 w-full overflow-y-auto pr-1 text-left"
              style={{
                scrollBehavior: 'smooth',
                maxHeight: 'calc(78dvh - 50px)',
              }}
            >
              <div
                className="whitespace-pre-wrap text-[#2D2329]"
                style={{
                  fontFamily: 'var(--font-caveat)',
                  fontSize: 'clamp(19px, 4.8vw, 20px)',
                  lineHeight: '1.75',
                }}
              >
                {/* Drop-cap styled first letter */}
                {firstLetter && (
                  <span
                    className="float-left text-4xl sm:text-5xl font-bold text-deep-rose mr-2 leading-none"
                    style={{ fontFamily: 'var(--font-dancing)' }}
                  >
                    {firstLetter}
                  </span>
                )}
                {remainingText}
                {isTyping && (
                  <span className="animate-pulse text-rose-500 font-bold ml-1">|</span>
                )}
              </div>

              {/* Romantic Sign-off with Handwritten Heart */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-3 border-t border-rose-200/60 text-right"
                >
                  <p
                    className="text-2xl sm:text-3xl font-bold"
                    style={{
                      fontFamily: 'var(--font-dancing)',
                      color: 'var(--deep-rose)',
                    }}
                  >
                    Tumhara Ganda Bachha 🤍
                  </p>
                  <p
                    className="text-base font-bold opacity-80 mt-0.5"
                    style={{
                      fontFamily: 'var(--font-caveat)',
                      color: 'var(--rose)',
                    }}
                  >
                    (Mera Shehzada)
                  </p>
                </motion.div>
              )}
            </div>

            {/* Tap to skip typing hint */}
            {isTyping && (
              <div className="text-center pt-2 mt-auto border-t border-rose-100/60">
                <span
                  className="text-xs text-rose-400 font-bold"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  (Tap anywhere to skip typing)
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  )
}
