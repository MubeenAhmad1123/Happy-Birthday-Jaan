'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import CameraScreen from './CameraScreen'
import LetterScreen from './LetterScreen'
import CassetteScreen from './CassetteScreen'
import { SiteContent } from '@/lib/contentData'
import AnimatedSticker from '@/components/AnimatedSticker'
import { CheckIcon, ArrowRightIcon, SparkleIcon, HeartIcon } from '@/components/Icons'
import { buzz, softChime } from '@/lib/feedback'

interface HubScreenProps {
  content: SiteContent
  onProceedToReasons: () => void
  onRefreshContent?: () => Promise<void>
  isAudioPlaying?: boolean
  onToggleAudio?: () => void
  audioError?: string
  audioProgress?: number
  audioCurrentTime?: string
  audioDuration?: string
}

type ActiveSubScreen = 'hub' | 'camera' | 'letter' | 'cassette'

const DEFAULT_BUBU_LINES = [
  'Aaj sirf tumhara din hai, Maria!',
  'Mujhe pata hai tum muskura rahi ho 🤍',
  'Dudu ne kaha hai ke tum duniya ki sab se pyari ho.',
  'Chai bani hai, aa jao, thandi ho jayegi!',
  'Tum thak gayi ho? Chalo, thori der ruk jao, main yahin hoon.',
  'Meri taraf se ek bara sa hug 🤗',
  'Tum jitni pyari ho na, utni to meri chai bhi meethi nahi.',
  'Aaj koi tension nahi, sirf khushi.',
  'Dudu thora sharmila hai, par dil se tumse bohot pyaar karta hai.',
  'Sab kuch dekh lo, phir mujhe batana kya pasand aya.',
  'Tumhari smile meri favourite hai, Jaan.',
  '25 saal ki ho gayi ho, par dil se wohi pyari bacchi ho.',
  'Ek raaz ki baat: akhri screen mein ek surprise hai.',
]

export default function HubScreen({
  content,
  onProceedToReasons,
  onRefreshContent,
  isAudioPlaying = false,
  onToggleAudio = () => {},
  audioError,
  audioProgress = 0,
  audioCurrentTime = '00:00',
  audioDuration = '03:45',
}: HubScreenProps) {
  const [activeSub, setActiveSub] = useState<ActiveSubScreen>('hub')
  const [openedItems, setOpenedItems] = useState<{
    camera: boolean
    letter: boolean
    cassette: boolean
  }>({
    camera: false,
    letter: false,
    cassette: false,
  })

  // Talking Bubu State
  const [tapCount, setTapCount] = useState(0)
  const [hasTappedOnce, setHasTappedOnce] = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isBubbleVisible, setIsBubbleVisible] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)

  // Non-repeating line deck
  const deckRef = useRef<number[]>([])
  const lastIndexRef = useRef<number>(-1)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const typeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const bubuLines = content.bubuLines && content.bubuLines.length > 0
    ? content.bubuLines
    : DEFAULT_BUBU_LINES

  // Shuffle helper
  const getNextLine = (): string => {
    // 8th tap Easter egg
    if (tapCount === 7) {
      return 'Itni baar tap kiya... lagta hai tumhe bhi mujhse pyaar hai 🤍'
    }

    if (deckRef.current.length === 0) {
      // Re-fill deck and shuffle
      const indices = Array.from({ length: bubuLines.length }, (_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }
      // Ensure first element of new deck isn't the same as the last line shown
      if (indices[0] === lastIndexRef.current && indices.length > 1) {
        ;[indices[0], indices[1]] = [indices[1], indices[0]]
      }
      deckRef.current = indices
    }

    const nextIdx = deckRef.current.shift() ?? 0
    lastIndexRef.current = nextIdx
    return bubuLines[nextIdx]
  }

  // Handle Bubu Tap
  const handleBubuTap = () => {
    buzz(10)
    softChime()

    if (!hasTappedOnce) setHasTappedOnce(true)
    setTapCount((prev) => prev + 1)

    // Bounce animation
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 260)

    // Clear active timers
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)

    const fullLine = getNextLine()
    setBubbleText(fullLine)
    setDisplayedText('')
    setIsBubbleVisible(true)

    // Typewriter effect (25ms per character)
    let charIdx = 0
    typeTimerRef.current = setInterval(() => {
      charIdx++
      if (charIdx <= fullLine.length) {
        setDisplayedText(fullLine.slice(0, charIdx))
      } else {
        if (typeTimerRef.current) clearInterval(typeTimerRef.current)
        // Auto-hide after 3.5s of reading
        hideTimerRef.current = setTimeout(() => {
          setIsBubbleVisible(false)
        }, 3500)
      }
    }, 25)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    }
  }, [])

  const openItem = (item: 'camera' | 'letter' | 'cassette') => {
    buzz(10)
    setOpenedItems((prev) => ({ ...prev, [item]: true }))
    setActiveSub(item)
  }

  const allThreeOpened =
    openedItems.camera && openedItems.letter && openedItems.cassette

  if (activeSub === 'camera') {
    return (
      <CameraScreen
        photos={content.photos}
        onBack={() => setActiveSub('hub')}
        onRefreshContent={onRefreshContent}
      />
    )
  }

  if (activeSub === 'letter') {
    return (
      <LetterScreen
        letterText={content.letter}
        onBack={() => setActiveSub('hub')}
      />
    )
  }

  if (activeSub === 'cassette') {
    return (
      <CassetteScreen
        songTitle={content.songTitle}
        isPlaying={isAudioPlaying}
        onTogglePlay={onToggleAudio}
        onBack={() => setActiveSub('hub')}
        audioError={audioError}
        progress={audioProgress}
        currentTimeText={audioCurrentTime}
        durationText={audioDuration}
      />
    )
  }

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      contentClassName="justify-between py-2"
    >
      {/* Top Header with Talking Bubu Character */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center mt-1 z-20 w-full relative"
      >
        {/* Floating Speech Bubble with Tail */}
        <div className="w-full flex justify-center min-h-[58px] mb-1">
          <AnimatePresence>
            {isBubbleVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 4 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-[85%] px-4 py-2 rounded-[20px] bg-[#FFFDFB] border border-rose-300 shadow-xl text-center"
              >
                <p
                  className="text-base sm:text-lg font-bold text-[#1E1A20] leading-snug"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {displayedText}
                </p>
                {/* Speech Bubble Arrow Tail pointing down */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-[#FFFDFB]"
                  style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tappable Bubu Header Sticker with min 64x64 Hit Area */}
        <div className="relative inline-flex items-center justify-center">
          {/* Initial Tap Hint Heart (shown first time only) */}
          {!hasTappedOnce && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute -top-3 -right-2 z-30 pointer-events-none bg-rose-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md flex items-center gap-1"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <HeartIcon size={10} color="#FFFFFF" />
              <span>Tap me</span>
            </motion.div>
          )}

          <motion.div
            animate={isBouncing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.26 }}
            onClick={handleBubuTap}
            className="cursor-pointer select-none p-1 rounded-full touch-manipulation"
            role="button"
            aria-label="Bubu se baat karo"
            tabIndex={0}
          >
            <AnimatedSticker
              name="dudu-bubu-chai"
              fallbackType="dudu-bubu-chai"
              size={92}
              priority={true}
              animation="float"
            />
          </motion.div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/35 mt-1">
          <SparkleIcon size={11} color="#D4AF37" />
          <span
            className="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37]"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Special Surprises
          </span>
          <SparkleIcon size={11} color="#D4AF37" />
        </div>

        <h1
          className="heading-fluid leading-tight text-white mt-1"
          style={{
            fontFamily: 'var(--font-dancing)',
            textShadow: '0 2px 14px rgba(229,107,138,0.4)',
          }}
        >
          Kuch cheezein khol ke dekho
        </h1>
        <p
          className="text-sm text-rose-200/80 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Teeno cheezon ko ek ek karke tap karo:
        </p>
      </motion.div>

      {/* 3 Unified Luxury Stacked Cards with Mathematical Alignment */}
      <div className="w-full flex flex-col gap-3.5 my-auto z-10 px-1">
        {/* Card 1: Photo Memories */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('camera')}
          className="group relative w-full min-h-[114px] sm:min-h-[120px] p-3.5 sm:p-4 rounded-[24px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(32, 26, 36, 0.92) 0%, rgba(18, 14, 20, 0.96) 100%)',
            borderColor: openedItems.camera ? 'rgba(212, 175, 55, 0.7)' : 'rgba(212, 175, 55, 0.35)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
          }}
          aria-label="Open Photo Memories"
        >
          {/* Card left sticker frame */}
          <div
            className="w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] rounded-2xl shrink-0 flex items-center justify-center p-1 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.03) 100%)',
              borderColor: 'rgba(212, 175, 55, 0.3)',
            }}
          >
            <AnimatedSticker
              name="hub-camera"
              fallbackType="hub-camera"
              size={72}
              animation="bounce"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-[11px] uppercase tracking-widest font-bold text-[#E8C27A] flex items-center gap-1"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <span>Yaadein</span>
              <span className="opacity-50">•</span>
              <span className="text-white/60">25 Photos</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-wide truncate mt-0.5"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Photo Memories
            </h3>
            <p
              className="text-xs sm:text-sm text-rose-100/75 mt-0.5 leading-snug line-clamp-1"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Hamari 25 pyari tasveerein aur yaadein
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border transition-all ${
              openedItems.camera
                ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#D4AF37] shadow-md shadow-[#D4AF37]/25'
                : 'bg-white/[0.08] border-white/15 text-white/70 group-hover:bg-white/[0.16] group-hover:text-white'
            }`}
          >
            {openedItems.camera ? (
              <CheckIcon size={15} color="#D4AF37" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>

        {/* Card 2: The Letter */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('letter')}
          className="group relative w-full min-h-[114px] sm:min-h-[120px] p-3.5 sm:p-4 rounded-[24px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(36, 24, 32, 0.92) 0%, rgba(20, 14, 18, 0.96) 100%)',
            borderColor: openedItems.letter ? 'rgba(255, 117, 151, 0.7)' : 'rgba(255, 117, 151, 0.35)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
          }}
          aria-label="Open The Letter"
        >
          {/* Card left sticker frame */}
          <div
            className="w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] rounded-2xl shrink-0 flex items-center justify-center p-1 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(229, 107, 138, 0.18) 0%, rgba(229, 107, 138, 0.03) 100%)',
              borderColor: 'rgba(229, 107, 138, 0.35)',
            }}
          >
            <AnimatedSticker
              name="hub-letter"
              fallbackType="hub-letter"
              size={72}
              animation="float"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-[11px] uppercase tracking-widest font-bold text-[#FF7597] flex items-center gap-1"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <span>Dil Se</span>
              <span className="opacity-50">•</span>
              <span className="text-white/60">Khat</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-wide truncate mt-0.5"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              The Letter
            </h3>
            <p
              className="text-xs sm:text-sm text-rose-100/75 mt-0.5 leading-snug line-clamp-1"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Mera dil ki baat, sirf tumhare liye
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border transition-all ${
              openedItems.letter
                ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-md shadow-rose-500/25'
                : 'bg-white/[0.08] border-white/15 text-white/70 group-hover:bg-white/[0.16] group-hover:text-white'
            }`}
          >
            {openedItems.letter ? (
              <CheckIcon size={15} color="#FF7597" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>

        {/* Card 3: Our Song */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('cassette')}
          className="group relative w-full min-h-[114px] sm:min-h-[120px] p-3.5 sm:p-4 rounded-[24px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 24, 34, 0.92) 0%, rgba(16, 13, 20, 0.96) 100%)',
            borderColor: openedItems.cassette ? 'rgba(249, 213, 222, 0.7)' : 'rgba(249, 213, 222, 0.35)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
          }}
          aria-label="Open Our Song"
        >
          {/* Card left sticker frame */}
          <div
            className="w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] rounded-2xl shrink-0 flex items-center justify-center p-1 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 213, 222, 0.16) 0%, rgba(249, 213, 222, 0.03) 100%)',
              borderColor: 'rgba(249, 213, 222, 0.3)',
            }}
          >
            <AnimatedSticker
              name="hub-cassette"
              fallbackType="hub-cassette"
              size={72}
              animation="float"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-[11px] uppercase tracking-widest font-bold text-[#F9D5DE] flex items-center gap-1"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              <span>Hamara Gana</span>
              <span className="opacity-50">•</span>
              <span className="text-white/60">Music</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-wide truncate mt-0.5"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Our Song
            </h3>
            <p
              className="text-xs sm:text-sm text-rose-100/75 mt-0.5 leading-snug line-clamp-1"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              {content.songTitle || 'Dil Ibadat Kar Raha Hai'}
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border transition-all ${
              openedItems.cassette
                ? 'bg-pink-400/25 border-pink-300 text-pink-200 shadow-md shadow-pink-400/25'
                : 'bg-white/[0.08] border-white/15 text-white/70 group-hover:bg-white/[0.16] group-hover:text-white'
            }`}
          >
            {openedItems.cassette ? (
              <CheckIcon size={15} color="#F9D5DE" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Bottom Action: "One last thing" button */}
      <div className="w-full px-1 pb-3 z-20 min-h-[64px] flex flex-col items-center justify-center gap-1.5">
        <AnimatePresence mode="wait">
          {allThreeOpened ? (
            <motion.button
              key="proceed-btn"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                buzz(10)
                onProceedToReasons()
              }}
              className="btn-primary w-full flex items-center justify-center gap-2 shadow-2xl"
            >
              <span>One last thing (25 Reasons)</span>
              <ArrowRightIcon size={18} color="#FFFFFF" />
            </motion.button>
          ) : (
            <motion.div
              key="pending-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <p
                className="text-xs text-rose-200/80 font-medium"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Teeno surprises kholo toh aage ka rasta khulega ✨
              </p>
              <button
                onClick={() => {
                  buzz(10)
                  onProceedToReasons()
                }}
                className="text-[11px] text-[#E8C27A] hover:text-[#F5E6BE] underline font-medium cursor-pointer"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                (Ya seedha 25 Reasons dekho)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  )
}
