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
  'Maine tumhare liye ek pyara sa surprise banaya hai!',
  'Tum thak gayi ho? Chalo, thori der ruk jao, main yahin hoon.',
  'Meri taraf se ek bara sa hug 🤗',
  'Tum jitni pyari ho na, utna to koi phool bhi khushnuma nahi.',
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
              name="dudu-bubu-hug"
              fallbackType="dudu-bubu-hug"
              size={92}
              priority={true}
              animation="bounce"
            />
          </motion.div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/50 mt-1 shadow-sm">
          <SparkleIcon size={12} color="#FFD97D" />
          <span
            className="text-[11px] uppercase tracking-widest font-bold"
            style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
          >
            Special Surprises
          </span>
          <SparkleIcon size={12} color="#FFD97D" />
        </div>

        <h1
          className="heading-fluid leading-tight mt-1"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: '#FFFFFF',
            textShadow: '0 2px 16px rgba(229,107,138,0.5)',
          }}
        >
          Kuch cheezein khol ke dekho
        </h1>
        <p
          className="text-base sm:text-lg mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)', color: '#FFD9E2' }}
        >
          Teeno cheezon ko ek ek karke tap karo:
        </p>
      </motion.div>

      {/* 3 Rich Luxury Jewel-Toned Cards with Vibrant Color & Glowing High-Contrast Text */}
      <div className="w-full flex flex-col gap-3.5 my-auto z-10 px-1">
        {/* Card 1: Photo Memories (Warm Royal Plum & Champagne Gold) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('camera')}
          className="group relative w-full min-h-[116px] sm:min-h-[122px] p-3.5 sm:p-4 rounded-[26px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border-2 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #381A2D 0%, #24111E 50%, #170A13 100%)',
            borderColor: openedItems.camera ? '#E8C27A' : 'rgba(232, 194, 122, 0.55)',
            boxShadow: '0 14px 34px rgba(0, 0, 0, 0.55), 0 0 20px rgba(232, 194, 122, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          }}
          aria-label="Open Photo Memories"
        >
          {/* Card left sticker frame: Dudu photographing Bubu */}
          <div
            className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-2xl shrink-0 flex items-center justify-center p-0.5 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(232, 194, 122, 0.22) 0%, rgba(232, 194, 122, 0.05) 100%)',
              borderColor: 'rgba(232, 194, 122, 0.5)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/characters/hub-camera-photo.jpg"
              alt="Photo Memories"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
            >
              <span>Yaadein</span>
              <span className="opacity-60">•</span>
              <span style={{ color: '#FFF0F5' }}>25 Photos</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold leading-tight tracking-wide truncate mt-0.5"
              style={{
                fontFamily: 'var(--font-baloo)',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}
            >
              Photo Memories
            </h3>
            <p
              className="text-sm sm:text-base mt-0.5 leading-snug line-clamp-1 font-medium"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: '#FFE6ED',
              }}
            >
              Hamari 25 pyari tasveerein aur yaadein
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all shadow-md"
            style={{
              background: openedItems.camera
                ? 'rgba(232, 194, 122, 0.3)'
                : 'rgba(255, 255, 255, 0.12)',
              borderColor: openedItems.camera ? '#E8C27A' : 'rgba(255, 255, 255, 0.35)',
              color: openedItems.camera ? '#FFD97D' : '#FFFFFF',
            }}
          >
            {openedItems.camera ? (
              <CheckIcon size={16} color="#FFD97D" />
            ) : (
              <ArrowRightIcon size={15} color="#FFFFFF" />
            )}
          </div>
        </motion.button>

        {/* Card 2: The Letter (Rich Berry Rose & Deep Wine) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('letter')}
          className="group relative w-full min-h-[116px] sm:min-h-[122px] p-3.5 sm:p-4 rounded-[26px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border-2 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #4D1629 0%, #300C19 50%, #1C060E 100%)',
            borderColor: openedItems.letter ? '#FF7597' : 'rgba(255, 117, 151, 0.55)',
            boxShadow: '0 14px 34px rgba(0, 0, 0, 0.55), 0 0 20px rgba(255, 117, 151, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          }}
          aria-label="Open The Letter"
        >
          {/* Card left sticker frame: Bubu My Love Card */}
          <div
            className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-2xl shrink-0 flex items-center justify-center p-0.5 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.22) 0%, rgba(255, 117, 151, 0.05) 100%)',
              borderColor: 'rgba(255, 117, 151, 0.5)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/characters/hub-letter-card.jpg"
              alt="The Letter"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-baloo)', color: '#FFA8C2' }}
            >
              <span>Dil Se</span>
              <span className="opacity-60">•</span>
              <span style={{ color: '#FFF0F5' }}>Khat</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold leading-tight tracking-wide truncate mt-0.5"
              style={{
                fontFamily: 'var(--font-baloo)',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}
            >
              The Letter
            </h3>
            <p
              className="text-sm sm:text-base mt-0.5 leading-snug line-clamp-1 font-medium"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: '#FFF0F5',
              }}
            >
              Mera dil ki baat, sirf tumhare liye
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all shadow-md"
            style={{
              background: openedItems.letter
                ? 'rgba(255, 117, 151, 0.3)'
                : 'rgba(255, 255, 255, 0.12)',
              borderColor: openedItems.letter ? '#FF7597' : 'rgba(255, 255, 255, 0.35)',
              color: openedItems.letter ? '#FFA8C2' : '#FFFFFF',
            }}
          >
            {openedItems.letter ? (
              <CheckIcon size={16} color="#FFA8C2" />
            ) : (
              <ArrowRightIcon size={15} color="#FFFFFF" />
            )}
          </div>
        </motion.button>

        {/* Card 3: Our Song (Deep Twilight Amethyst & Violet-Rose) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('cassette')}
          className="group relative w-full min-h-[116px] sm:min-h-[122px] p-3.5 sm:p-4 rounded-[26px] flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left transition-all select-none border-2 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #2D1B44 0%, #1B102B 50%, #10091B 100%)',
            borderColor: openedItems.cassette ? '#D8B4FE' : 'rgba(216, 180, 254, 0.55)',
            boxShadow: '0 14px 34px rgba(0, 0, 0, 0.55), 0 0 20px rgba(216, 180, 254, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          }}
          aria-label="Open Our Song"
        >
          {/* Card left sticker frame: Bubu & Dudu Couch Music */}
          <div
            className="w-[78px] h-[78px] sm:w-[84px] sm:h-[84px] rounded-2xl shrink-0 flex items-center justify-center p-0.5 relative overflow-hidden border shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(216, 180, 254, 0.22) 0%, rgba(216, 180, 254, 0.05) 100%)',
              borderColor: 'rgba(216, 180, 254, 0.5)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/characters/hub-music-couch.jpg"
              alt="Our Song"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Card text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
            <span
              className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-baloo)', color: '#E9D5FF' }}
            >
              <span>Hamara Gana</span>
              <span className="opacity-60">•</span>
              <span style={{ color: '#FFF0F5' }}>Music</span>
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold leading-tight tracking-wide truncate mt-0.5"
              style={{
                fontFamily: 'var(--font-baloo)',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}
            >
              Our Song
            </h3>
            <p
              className="text-sm sm:text-base mt-0.5 leading-snug line-clamp-1 font-medium"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: '#FAF5FF',
              }}
            >
              {content.songTitle || 'Dil Ibadat Kar Raha Hai'}
            </p>
          </div>

          {/* Status badge / Chevron */}
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all shadow-md"
            style={{
              background: openedItems.cassette
                ? 'rgba(216, 180, 254, 0.3)'
                : 'rgba(255, 255, 255, 0.12)',
              borderColor: openedItems.cassette ? '#D8B4FE' : 'rgba(255, 255, 255, 0.35)',
              color: openedItems.cassette ? '#E9D5FF' : '#FFFFFF',
            }}
          >
            {openedItems.cassette ? (
              <CheckIcon size={16} color="#E9D5FF" />
            ) : (
              <ArrowRightIcon size={15} color="#FFFFFF" />
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
              animate={{ opacity: 0.95 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <p
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-caveat)', color: '#FFD9E2' }}
              >
                Teeno surprises kholo toh aage ka rasta khulega ✨
              </p>
              <button
                onClick={() => {
                  buzz(10)
                  onProceedToReasons()
                }}
                className="text-xs underline font-bold cursor-pointer transition-colors"
                style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
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
