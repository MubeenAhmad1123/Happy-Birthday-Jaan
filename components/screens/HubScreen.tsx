'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import CameraScreen from './CameraScreen'
import LetterScreen from './LetterScreen'
import CassetteScreen from './CassetteScreen'
import { SiteContent } from '@/lib/contentData'
import AnimatedSticker from '@/components/AnimatedSticker'
import { CameraIcon, LetterIcon, CassetteIcon, CheckIcon, ArrowRightIcon } from '@/components/Icons'

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
      {/* Top Banner with dudu-bubu-chai sticker */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center mt-2 z-10 w-full"
      >
        <AnimatedSticker
          name="dudu-bubu-chai"
          fallbackType="dudu-bubu-chai"
          size={110}
          priority={true}
          animation="float"
        />

        <span
          className="text-xs uppercase tracking-widest font-bold text-rose-500 mt-1"
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

      {/* 3 Large, Colourful Tappable Cards (~110-130px tall each) */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 my-auto z-10 px-1">
        {/* Card 1: Rose Card with White Text (Photo Memories) */}
        <motion.button
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('camera')}
          className="w-full min-h-[110px] p-4 rounded-3xl flex items-center justify-between cursor-pointer border text-left transition-all select-none shadow-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #FF6B8B 0%, #E56B8A 50%, #B8405E 100%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 28px rgba(184, 64, 94, 0.3)',
          }}
          aria-label="Open Photo Memories"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
              <CameraIcon size={28} color="#FFFFFF" />
            </div>
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Photo Memories
              </h3>
              <p
                className="text-sm text-white/90 mt-0.5"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Hamari 25 pyari tasveerein aur yaadein
              </p>
            </div>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
              openedItems.camera
                ? 'border-white bg-white/30 text-white'
                : 'border-white/50 text-white/50'
            }`}
          >
            {openedItems.camera ? (
              <CheckIcon size={16} color="#FFFFFF" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>

        {/* Card 2: White Paper Card with Rose Accents (The Letter) */}
        <motion.button
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('letter')}
          className="w-full min-h-[110px] p-4 rounded-3xl flex items-center justify-between cursor-pointer border text-left transition-all select-none shadow-md bg-white border-rose-200"
          style={{
            boxShadow: '0 8px 25px rgba(229,107,138,0.12)',
          }}
          aria-label="Open The Letter"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 shadow-inner">
              <LetterIcon size={28} color="var(--deep-rose)" />
            </div>
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold text-deep-rose"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                The Letter
              </h3>
              <p
                className="text-sm text-charcoal/80 mt-0.5"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                Dil ki baat, sirf tumhare liye
              </p>
            </div>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
              openedItems.letter
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-rose-300 text-rose-300'
            }`}
          >
            {openedItems.letter ? (
              <CheckIcon size={16} color="#059669" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>

        {/* Card 3: Blush Card with Dark Charcoal Accents (Our Song) */}
        <motion.button
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('cassette')}
          className="w-full min-h-[110px] p-4 rounded-3xl flex items-center justify-between cursor-pointer border text-left transition-all select-none shadow-md"
          style={{
            background: 'linear-gradient(135deg, #FFF8F5 0%, #F9D5DE 100%)',
            borderColor: 'rgba(229, 107, 138, 0.35)',
            boxShadow: '0 8px 25px rgba(229,107,138,0.12)',
          }}
          aria-label="Open Our Song"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/80 border border-rose-300 flex items-center justify-center shrink-0 shadow-inner">
              <CassetteIcon size={28} color="var(--deep-rose)" />
            </div>
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold text-[#1E1A20]"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Our Song
              </h3>
              <p
                className="text-sm text-charcoal/80 mt-0.5"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                {content.songTitle || 'Dil Ibadat Kar Raha Hai'}
              </p>
            </div>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
              openedItems.cassette
                ? 'border-emerald-600 bg-emerald-100 text-emerald-700'
                : 'border-rose-300 text-rose-300'
            }`}
          >
            {openedItems.cassette ? (
              <CheckIcon size={16} color="#059669" />
            ) : (
              <ArrowRightIcon size={14} color="currentColor" />
            )}
          </div>
        </motion.button>
      </div>

      {/* "One last thing" button appears after all three are opened */}
      <div className="w-full max-w-sm px-1 pb-3 z-20 min-h-[64px] flex items-center justify-center">
        <AnimatePresence>
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-xs text-center text-charcoal/70 font-medium"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Teeno surprises kholo toh aage ka rasta khulega ✨
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  )
}
