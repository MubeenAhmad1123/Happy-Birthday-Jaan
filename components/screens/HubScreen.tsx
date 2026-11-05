'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import CameraScreen from './CameraScreen'
import LetterScreen from './LetterScreen'
import CassetteScreen from './CassetteScreen'
import GiftBox, { GiftVariant } from '@/components/GiftBox'
import { SiteContent } from '@/lib/contentData'
import AnimatedSticker from '@/components/AnimatedSticker'
import { CheckIcon, ArrowRightIcon, SparkleIcon, HeartIcon } from '@/components/Icons'
import { buzz, pop, softChime } from '@/lib/feedback'

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
type GiftKey = 'camera' | 'letter' | 'cassette'

const DEFAULT_BUBU_LINES = [
  'i love you! 🤍',
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

const GIFT_CONFIG: Record<
  GiftKey,
  {
    number: number
    variant: GiftVariant
    title: string
    urduTitle: string
    subtitle: string
    thumbnail: string
  }
> = {
  camera: {
    number: 1,
    variant: 'pink',
    title: 'Photo Memories',
    urduTitle: 'Yaadein 📸',
    subtitle: 'Hamari 25 pyari tasveerein aur yaadein',
    thumbnail: '/characters/hub-camera-photo.jpg',
  },
  letter: {
    number: 2,
    variant: 'gold',
    title: 'The Letter',
    urduTitle: 'Khat 💌',
    subtitle: 'Mera dil ki baat, sirf tumhare liye',
    thumbnail: '/characters/hub-letter-card.jpg',
  },
  cassette: {
    number: 3,
    variant: 'red',
    title: 'Our Song',
    urduTitle: 'Gana 🎵',
    subtitle: 'Dil Ibadat Kar Raha Hai',
    thumbnail: '/characters/hub-music-couch.jpg',
  },
}

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

  // Unboxing Modal Animation State
  const [unboxingGift, setUnboxingGift] = useState<GiftKey | null>(null)
  const [unboxingStage, setUnboxingStage] = useState<'shake' | 'open' | 'reveal'>('shake')
  const unboxingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Talking Bubu State
  const [tapCount, setTapCount] = useState(0)
  const [hasTappedOnce, setHasTappedOnce] = useState(false)
  const [displayedText, setDisplayedText] = useState('i love you! 🤍')
  const [isBubbleVisible, setIsBubbleVisible] = useState(true)
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
    if (tapCount === 7) {
      return 'Itni baar tap kiya... lagta hai tumhe bhi mujhse pyaar hai 🤍'
    }

    if (deckRef.current.length === 0) {
      const indices = Array.from({ length: bubuLines.length }, (_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }
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

    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 260)

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)

    const fullLine = getNextLine()
    setDisplayedText('')
    setIsBubbleVisible(true)

    let charIdx = 0
    typeTimerRef.current = setInterval(() => {
      charIdx++
      if (charIdx <= fullLine.length) {
        setDisplayedText(fullLine.slice(0, charIdx))
      } else {
        if (typeTimerRef.current) clearInterval(typeTimerRef.current)
        hideTimerRef.current = setTimeout(() => {
          setIsBubbleVisible(false)
        }, 4000)
      }
    }, 25)
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
      if (unboxingTimerRef.current) clearTimeout(unboxingTimerRef.current)
    }
  }, [])

  // Handle Gift Click
  const handleGiftClick = (item: GiftKey) => {
    buzz(12)

    // If already opened, open the sub-screen immediately
    if (openedItems[item]) {
      setActiveSub(item)
      return
    }

    // Trigger Magical Unboxing Sequence
    setUnboxingGift(item)
    setUnboxingStage('shake')
    pop()

    // 1. Shake anticipation (0ms -> 350ms)
    setTimeout(() => {
      setUnboxingStage('open')
      pop()
      softChime()
      buzz(25)

      try {
        confetti({
          particleCount: 40,
          spread: 65,
          origin: { y: 0.5 },
          colors: ['#FF7597', '#FBBF24', '#F43F5E', '#FFFFFF', '#D4AF37'],
        })
      } catch {
        // ignore
      }

      // 2. Reveal stage (350ms -> 700ms)
      setTimeout(() => {
        setUnboxingStage('reveal')

        // 3. Auto-open subscreen after 1.5s of seeing the gift
        unboxingTimerRef.current = setTimeout(() => {
          finishUnboxing(item)
        }, 1500)
      }, 350)
    }, 350)
  }

  const finishUnboxing = (item: GiftKey) => {
    if (unboxingTimerRef.current) clearTimeout(unboxingTimerRef.current)
    buzz(10)
    setOpenedItems((prev) => ({ ...prev, [item]: true }))
    setUnboxingGift(null)
    setActiveSub(item)
  }

  const openedCount =
    (openedItems.camera ? 1 : 0) +
    (openedItems.letter ? 1 : 0) +
    (openedItems.cassette ? 1 : 0)

  const allThreeOpened = openedCount === 3

  // Sub-screens routing
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

  const activeGiftConfig = unboxingGift ? GIFT_CONFIG[unboxingGift] : null

  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      contentClassName="justify-between py-2 select-none"
    >
      {/* ── TOP HEADER (Pick a gift / 3 surprises / 0/3 opened) ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center mt-0.5 z-20 w-full relative px-2"
      >
        {/* Cute Paper Sticker Top-Right: "Favorite person ↷" */}
        <div className="w-full flex justify-end pr-2 -mb-2 z-30">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: [-4, -8, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFFDF9]/90 border border-rose-300 text-[#1E1A20] shadow-md -rotate-6"
          >
            <span
              className="text-xs font-bold text-deep-rose"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Favorite person
            </span>
            <span className="text-xs text-rose-500">↷</span>
            <HeartIcon size={10} color="#E56B8A" />
          </motion.div>
        </div>

        {/* Floating Heart / Sparkle Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/50 shadow-sm mt-1">
          <SparkleIcon size={12} color="#FFD97D" />
          <span
            className="text-[11px] uppercase tracking-widest font-bold"
            style={{ fontFamily: 'var(--font-baloo)', color: '#FFD97D' }}
          >
            {openedCount} / 3 opened
          </span>
          <SparkleIcon size={12} color="#FFD97D" />
        </div>

        {/* Main Title: Pick a gift */}
        <h1
          className="heading-fluid leading-tight mt-1"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: '#FFFFFF',
            textShadow: '0 2px 18px rgba(229,107,138,0.5)',
            fontSize: 'clamp(2.4rem, 9.5vw, 3.5rem)',
          }}
        >
          Pick a gift
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)', color: '#FFD9E2' }}
        >
          3 surprises are waiting for you
        </p>
      </motion.div>

      {/* ── THE 3 MYSTERY GIFT BOXES IN A ROW (Exactly like user reference) ── */}
      <div className="w-full my-auto z-10 px-1 py-3 flex flex-col items-center">
        {/* Subtle romantic back glow */}
        <div
          className="w-full max-w-[425px] p-3.5 sm:p-4 px-2 sm:px-3 rounded-[32px] border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(155deg, rgba(34, 22, 36, 0.85) 0%, rgba(18, 14, 20, 0.95) 100%)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Subtle Polka-Dot Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #FFFFFF 1.5px, transparent 1.5px)',
              backgroundSize: '18px 18px',
            }}
          />

          <div className="relative z-10 flex flex-row flex-nowrap items-end justify-center gap-1.5 sm:gap-3 w-full">
            {/* Gift 1: Pink Box */}
            <GiftBox
              variant="pink"
              giftNumber={1}
              isOpened={openedItems.camera}
              thumbnail="/characters/hub-camera-photo.jpg"
              title="Photo Memories"
              urduTitle="Yaadein 📸"
              onClick={() => handleGiftClick('camera')}
            />

            {/* Gift 2: Gold/Yellow Box */}
            <GiftBox
              variant="gold"
              giftNumber={2}
              isOpened={openedItems.letter}
              thumbnail="/characters/hub-letter-card.jpg"
              title="The Letter"
              urduTitle="Khat 💌"
              onClick={() => handleGiftClick('letter')}
            />

            {/* Gift 3: Red/Rose Box */}
            <GiftBox
              variant="red"
              giftNumber={3}
              isOpened={openedItems.cassette}
              thumbnail="/characters/hub-music-couch.jpg"
              title="Our Song"
              urduTitle="Gana 🎵"
              onClick={() => handleGiftClick('cassette')}
            />
          </div>

          {/* Tap hint below boxes */}
          <div className="mt-4 text-center">
            <span
              className="text-xs sm:text-sm font-medium tracking-wide"
              style={{ fontFamily: 'var(--font-caveat)', color: '#FFB6C1' }}
            >
              {openedCount === 0
                ? 'Kisi bhi gift box par tap karo kholne ke liye ✨'
                : openedCount < 3
                ? 'Agla surprise khol ke dekho! 🎁'
                : 'MashaAllah, teeno surprises khul gaye! 🤍'}
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Cute Hugging Characters with Speech Bubble ("i love you!") ── */}
      <div className="w-full flex flex-col items-center z-20 px-2 mt-auto pb-1">
        <div className="w-full flex items-center justify-center gap-3">
          {/* Tappable Dudu-Bubu Hugging Character */}
          <motion.div
            animate={isBouncing ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={handleBubuTap}
            className="cursor-pointer select-none p-1 rounded-full touch-manipulation shrink-0"
            role="button"
            aria-label="Bubu & Dudu se baat karo"
            tabIndex={0}
          >
            <AnimatedSticker
              name="dudu-bubu-hug"
              fallbackType="dudu-bubu-hug"
              size={84}
              priority={true}
              animation="bounce"
            />
          </motion.div>

          {/* Speech Bubble: "i love you!" (exact quote from user reference!) */}
          <AnimatePresence mode="wait">
            {isBubbleVisible && (
              <motion.div
                key={displayedText}
                initial={{ opacity: 0, scale: 0.88, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.2 }}
                onClick={handleBubuTap}
                className="relative px-4 py-2 rounded-full bg-[#FFFDFB] border border-rose-300 shadow-xl cursor-pointer max-w-[70%]"
              >
                <p
                  className="text-base sm:text-lg font-bold text-[#1E1A20] leading-none"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {displayedText}
                </p>
                {/* Bubble tail pointing to character */}
                <div
                  className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[#FFFDFB]"
                  style={{ filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.15))' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── "One last thing (25 Reasons)" button when all 3 opened ── */}
        <div className="w-full mt-3 min-h-[54px] flex items-center justify-center">
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
                className="btn-primary w-full max-w-[390px] flex items-center justify-center gap-2 shadow-2xl"
              >
                <span>One last thing (25 Reasons)</span>
                <ArrowRightIcon size={18} color="#FFFFFF" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* ── 🎁 MAGICAL UNBOXING MODAL OVERLAY ── */}
      <AnimatePresence>
        {unboxingGift && activeGiftConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => finishUnboxing(unboxingGift)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[340px] rounded-3xl p-6 flex flex-col items-center text-center border shadow-2xl select-none"
              style={{
                background: 'linear-gradient(145deg, #2D1A2C 0%, #170F1B 100%)',
                borderColor: 'rgba(255, 117, 151, 0.5)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(229,107,138,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti & Light Rays behind */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none filter blur-xl opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(255,117,151,0.4) 0%, transparent 70%)',
                }}
              />

              {/* Title Header */}
              <div className="z-10 flex flex-col items-center">
                <span
                  className="text-xs uppercase tracking-widest font-bold text-[#FFD97D]"
                  style={{ fontFamily: 'var(--font-baloo)' }}
                >
                  Surprise {activeGiftConfig.number}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mt-1"
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    textShadow: '0 2px 14px rgba(229,107,138,0.5)',
                  }}
                >
                  {unboxingStage === 'shake'
                    ? 'Opening Box…'
                    : 'Surprise Unlocked! 🎉'}
                </h3>
              </div>

              {/* Box Animation Stage */}
              <div className="relative w-44 h-44 my-4 flex items-center justify-center">
                {/* 1. Shaking Closed Box */}
                {unboxingStage === 'shake' && (
                  <motion.div
                    animate={{ rotate: [-6, 6, -5, 5, -2, 2, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    className="w-32 h-36 flex items-center justify-center"
                  >
                    <GiftBox
                      variant={activeGiftConfig.variant}
                      giftNumber={activeGiftConfig.number}
                      isOpened={false}
                      thumbnail={activeGiftConfig.thumbnail}
                      title={activeGiftConfig.title}
                      urduTitle={activeGiftConfig.urduTitle}
                      onClick={() => {}}
                      disabled={true}
                    />
                  </motion.div>
                )}

                {/* 2. Popped Box & Revealed Gift Item Rising Up */}
                {(unboxingStage === 'open' || unboxingStage === 'reveal') && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {/* Golden Light Burst */}
                    <motion.div
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: [0.3, 1.5], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-rose-300 to-amber-200 filter blur-lg pointer-events-none"
                    />

                    {/* Flying Lid */}
                    <motion.div
                      initial={{ y: 0, rotate: 0, opacity: 1 }}
                      animate={{ y: -75, rotate: -35, opacity: 0 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="absolute -top-4 w-28 h-7 rounded-lg bg-white shadow-xl pointer-events-none"
                      style={{
                        background:
                          activeGiftConfig.variant === 'gold'
                            ? '#FCD34D'
                            : activeGiftConfig.variant === 'red'
                            ? '#FB7185'
                            : '#FFA2B8',
                      }}
                    />

                    {/* Rising Artwork Card */}
                    <motion.div
                      initial={{ y: 35, scale: 0.6, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="relative z-20 w-32 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-neutral-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeGiftConfig.thumbnail}
                        alt={activeGiftConfig.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Revealed Info */}
              <div className="z-10 flex flex-col items-center mt-1">
                <span
                  className="text-xl font-bold text-white tracking-wide"
                  style={{ fontFamily: 'var(--font-baloo)' }}
                >
                  {activeGiftConfig.title}
                </span>
                <span
                  className="text-sm font-medium text-rose-200 mt-0.5"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {activeGiftConfig.subtitle}
                </span>
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => finishUnboxing(unboxingGift)}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Khol ke dekho ✨</span>
                <ArrowRightIcon size={16} color="#FFFFFF" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  )
}
