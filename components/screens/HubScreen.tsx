'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CameraScreen from './CameraScreen'
import LetterScreen from './LetterScreen'
import CassetteScreen from './CassetteScreen'
import { SiteContent } from '@/lib/contentData'

interface HubScreenProps {
  content: SiteContent
  onProceedToReasons: () => void
}

type ActiveSubScreen = 'hub' | 'camera' | 'letter' | 'cassette'

export default function HubScreen({ content, onProceedToReasons }: HubScreenProps) {
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
        songUrl={content.songUrl}
        songTitle={content.songTitle}
        onBack={() => setActiveSub('hub')}
      />
    )
  }

  return (
    <div
      className="screen relative p-6 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background:
          'repeating-linear-gradient(45deg, #FFF8F5, #FFF8F5 16px, #FDF2F4 16px, #FDF2F4 32px)',
      }}
    >
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mt-4"
      >
        <span
          className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-1"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Special Surprises
        </span>
        <h1
          className="text-3xl sm:text-4xl leading-tight"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          Kuch cheezein khol ke dekho 🤍
        </h1>
        <p
          className="text-base opacity-75 mt-1"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          Teeno cheezon ko ek ek karke tap karo:
        </p>
      </motion.div>

      {/* 3 Sticker Items in a Grid / Stack */}
      <div className="w-full max-w-sm flex flex-col gap-4 my-auto">
        {/* 1. Camera */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('camera')}
          className="sticker p-4 flex items-center justify-between cursor-pointer shadow-md bg-white/95"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl shadow-inner">
              📷
            </div>
            <div className="text-left">
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
              >
                Photo Memories
              </h3>
              <p
                className="text-sm opacity-70"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                Hamari pyari tasveerein aur yaadein
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border-2 border-rose-300">
            {openedItems.camera ? (
              <span className="text-emerald-500">✓</span>
            ) : (
              <span className="text-rose-300">→</span>
            )}
          </div>
        </motion.button>

        {/* 2. Envelope */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('letter')}
          className="sticker p-4 flex items-center justify-between cursor-pointer shadow-md bg-white/95"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl shadow-inner">
              ✉️
            </div>
            <div className="text-left">
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
              >
                The Letter
              </h3>
              <p
                className="text-sm opacity-70"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                Dil ki baat, sirf tumhare liye
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border-2 border-rose-300">
            {openedItems.letter ? (
              <span className="text-emerald-500">✓</span>
            ) : (
              <span className="text-rose-300">→</span>
            )}
          </div>
        </motion.button>

        {/* 3. Cassette */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => openItem('cassette')}
          className="sticker p-4 flex items-center justify-between cursor-pointer shadow-md bg-white/95"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl shadow-inner">
              📼
            </div>
            <div className="text-left">
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
              >
                Our Song
              </h3>
              <p
                className="text-sm opacity-70"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                Dil Ibadat Kar Raha Hai 🎵
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border-2 border-rose-300">
            {openedItems.cassette ? (
              <span className="text-emerald-500">✓</span>
            ) : (
              <span className="text-rose-300">→</span>
            )}
          </div>
        </motion.button>
      </div>

      {/* "One last thing →" button unlocks when all three opened */}
      <div className="w-full max-w-sm mb-4">
        <AnimatePresence>
          {allThreeOpened ? (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={onProceedToReasons}
                className="btn-primary w-full text-lg shadow-xl flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500"
              >
                <span>One last thing</span>
                <span>→</span>
              </motion.button>
              <span
                className="text-xs opacity-75 text-center"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                Abhi to kahani shuru hui hai… ✨
              </span>
            </motion.div>
          ) : (
            <div className="text-center py-2">
              <p
                className="text-xs opacity-60"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                (Teeno cheezon pe tick aane ke baad next step open hoga ✨)
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

