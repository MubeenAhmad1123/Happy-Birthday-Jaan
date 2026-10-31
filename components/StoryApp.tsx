'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GateScreen from '@/components/screens/GateScreen'
import OpenerScreen from '@/components/screens/OpenerScreen'
import BirthdayScreen from '@/components/screens/BirthdayScreen'
import CrystalHeartScreen from '@/components/screens/CrystalHeartScreen'
import HubScreen from '@/components/screens/HubScreen'
import ReasonsScreen from '@/components/screens/ReasonsScreen'
import TimelineScreen from '@/components/screens/TimelineScreen'
import FinaleScreen from '@/components/screens/FinaleScreen'
import { SiteContent, DEFAULT_CONTENT } from '@/lib/contentData'

interface StoryAppProps {
  initiallyUnlocked: boolean
  unlockAt: string
  bypassDate: boolean
}

export default function StoryApp({
  initiallyUnlocked,
  unlockAt,
  bypassDate,
}: StoryAppProps) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked)
  const [currentScreen, setCurrentScreen] = useState<number>(1) // 1 to 7
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loadingContent, setLoadingContent] = useState(false)

  // Fetch content after unlock
  useEffect(() => {
    if (!unlocked) return

    setLoadingContent(true)
    fetch('/api/content')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data: SiteContent) => {
        if (data) setContent(data)
      })
      .catch((err) => {
        console.warn('Using default content fallback:', err)
      })
      .finally(() => setLoadingContent(false))
  }, [unlocked])

  // Screen 0: Gate Screen
  if (!unlocked) {
    return (
      <GateScreen
        onUnlocked={() => setUnlocked(true)}
        unlockAt={unlockAt}
        bypassDate={bypassDate}
      />
    )
  }

  // Story Screen Transitions
  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden max-w-[430px] mx-auto shadow-2xl bg-white">
      <AnimatePresence mode="wait">
        {currentScreen === 1 && (
          <motion.div
            key="screen-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <OpenerScreen onYes={() => setCurrentScreen(2)} />
          </motion.div>
        )}

        {currentScreen === 2 && (
          <motion.div
            key="screen-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <BirthdayScreen onNext={() => setCurrentScreen(3)} />
          </motion.div>
        )}

        {currentScreen === 3 && (
          <motion.div
            key="screen-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4 }}
          >
            <CrystalHeartScreen onNext={() => setCurrentScreen(4)} />
          </motion.div>
        )}

        {currentScreen === 4 && (
          <motion.div
            key="screen-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <HubScreen
              content={content}
              onProceedToReasons={() => setCurrentScreen(5)}
            />
          </motion.div>
        )}

        {currentScreen === 5 && (
          <motion.div
            key="screen-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            <ReasonsScreen
              reasons={content.reasons}
              onNext={() => setCurrentScreen(6)}
            />
          </motion.div>
        )}

        {currentScreen === 6 && (
          <motion.div
            key="screen-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <TimelineScreen
              timeline={content.timeline}
              onNext={() => setCurrentScreen(7)}
            />
          </motion.div>
        )}

        {currentScreen === 7 && (
          <motion.div
            key="screen-7"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <FinaleScreen
              finalMessage={content.finalMessage}
              onReplay={() => setCurrentScreen(1)}
              onBackToHub={() => setCurrentScreen(4)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
