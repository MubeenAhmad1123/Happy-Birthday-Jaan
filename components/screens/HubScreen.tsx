'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import CameraScreen from './CameraScreen'
import LetterScreen from './LetterScreen'
import CassetteScreen from './CassetteScreen'
import { SiteContent } from '@/lib/contentData'
import AnimatedSticker from '@/components/AnimatedSticker'
import { CheckIcon, ArrowRightIcon, SparkleIcon } from '@/components/Icons'

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

  const openItem = (item: 'camera' | 'letter' | 'cassette') => {
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
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center mt-2 z-10 w-full"
      >
        <span
          className="text-xs uppercase tracking-widest font-bold text-rose-500"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Special Surprises
        </span>
        <h1
          className="heading-fluid leading-tight text-deep-rose mt-0.5"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: 'var(--deep-rose)',
            textShadow: '0 2px 10px rgba(229,107,138,0.2)',
          }}
        >
          Kuch cheezein khol ke dekho
        </h1>
        <p
          className="text-sm text-charcoal/80 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Teeno cheezon ko ek ek karke tap karo:
        </p>
      </motion.div>

      {/* 3 Big Full-Width Stacked Cards (min-h-[140px] to 150px) */}
      <div className="w-full flex flex-col gap-3.5 my-auto z-10 px-1">
        {/* Card 1: Photo Memories (Black Card, Rose Text, Subtle Gold Hairline Border) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('camera')}
          className="relative w-full min-h-[140px] p-4 rounded-3xl flex items-center gap-4 cursor-pointer text-left transition-all select-none shadow-xl border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E1A20 0%, #121014 100%)',
            borderColor: 'rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          }}
          aria-label="Open Photo Memories"
        >
          {/* Opened Tick Badge */}
          {openedItems.camera && (
            <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
              <CheckIcon size={13} color="#D4AF37" />
            </div>
          )}

          {/* Left: Big Sticker (96-105px) */}
          <div className="shrink-0 flex items-center justify-center w-[96px] h-[96px]">
            <AnimatedSticker
              name="dudu-bubu-box"
              fallbackType="dudu-bubu-box"
              size={96}
              animation="bounce"
            />
          </div>

          {/* Right: Title + One-line hint */}
          <div className="flex flex-col justify-center flex-1 pr-4 min-w-0">
            <span
              className="text-xs uppercase tracking-wider font-bold text-[#D4AF37]"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Yaadein
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-rose-300 leading-snug"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Photo Memories
            </h3>
            <p
              className="text-sm sm:text-base text-rose-100/80 mt-1 leading-tight break-words"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Hamari 25 pyari tasveerein aur yaadein
            </p>
          </div>
        </motion.button>

        {/* Card 2: The Letter (Rose Gradient Card, White Text) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('letter')}
          className="relative w-full min-h-[140px] p-4 rounded-3xl flex items-center gap-4 cursor-pointer text-left transition-all select-none shadow-xl border overflow-hidden text-white"
          style={{
            background: 'linear-gradient(135deg, #FF6B8B 0%, #E56B8A 50%, #B8405E 100%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 30px rgba(184, 64, 94, 0.3)',
          }}
          aria-label="Open The Letter"
        >
          {/* Opened Tick Badge */}
          {openedItems.letter && (
            <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-white/25 border border-white flex items-center justify-center">
              <CheckIcon size={13} color="#FFFFFF" />
            </div>
          )}

          {/* Left: Big Sticker (96-105px) */}
          <div className="shrink-0 flex items-center justify-center w-[96px] h-[96px]">
            <AnimatedSticker
              name="dudu-bubu-flowers"
              fallbackType="dudu-bubu-flowers"
              size={96}
              animation="float"
            />
          </div>

          {/* Right: Title + One-line hint */}
          <div className="flex flex-col justify-center flex-1 pr-4 min-w-0">
            <span
              className="text-xs uppercase tracking-wider font-bold text-white/80"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Dil Se
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-white leading-snug"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              The Letter
            </h3>
            <p
              className="text-sm sm:text-base text-white/90 mt-1 leading-tight break-words"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Mera dil ki baat, sirf tumhare liye
            </p>
          </div>
        </motion.button>

        {/* Card 3: Our Song (Blush Card, Dark Charcoal Text, Soft Gold / Rose Accent) */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openItem('cassette')}
          className="relative w-full min-h-[140px] p-4 rounded-3xl flex items-center gap-4 cursor-pointer text-left transition-all select-none shadow-xl border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF3F6 60%, #F9D5DE 100%)',
            borderColor: 'rgba(229, 107, 138, 0.4)',
            boxShadow: '0 10px 28px rgba(229, 107, 138, 0.15)',
          }}
          aria-label="Open Our Song"
        >
          {/* Opened Tick Badge */}
          {openedItems.cassette && (
            <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center">
              <CheckIcon size={13} color="#B8405E" />
            </div>
          )}

          {/* Left: Big Sticker (96-105px) */}
          <div className="shrink-0 flex items-center justify-center w-[96px] h-[96px]">
            <AnimatedSticker
              name="dudu-bubu-chai"
              fallbackType="dudu-bubu-chai"
              size={96}
              animation="float"
            />
          </div>

          {/* Right: Title + One-line hint */}
          <div className="flex flex-col justify-center flex-1 pr-4 min-w-0">
            <span
              className="text-xs uppercase tracking-wider font-bold text-rose-500"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Naghma
            </span>
            <h3
              className="text-xl sm:text-2xl font-bold text-[#1E1A20] leading-snug"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Our Song
            </h3>
            <p
              className="text-sm sm:text-base text-charcoal/80 mt-1 leading-tight break-words truncate"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              {content.songTitle || 'Dil Ibadat Kar Raha Hai'}
            </p>
          </div>
        </motion.button>
      </div>

      {/* Bottom Action: "One last thing" button appears once all three are opened (plus subtle skip option) */}
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
              onClick={onProceedToReasons}
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
                className="text-xs text-charcoal/80 font-medium"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Teeno surprises kholo toh aage ka rasta khulega ✨
              </p>
              <button
                onClick={onProceedToReasons}
                className="text-[11px] text-rose-500/80 hover:text-rose-600 underline font-medium cursor-pointer"
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
