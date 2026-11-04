'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppFrame from '@/components/AppFrame'
import GateScreen from '@/components/screens/GateScreen'
import OpenerScreen from '@/components/screens/OpenerScreen'
import BirthdayScreen from '@/components/screens/BirthdayScreen'
import CrystalHeartScreen from '@/components/screens/CrystalHeartScreen'
import HubScreen from '@/components/screens/HubScreen'
import ReasonsScreen from '@/components/screens/ReasonsScreen'
import LawyerDreamScreen from '@/components/screens/LawyerDreamScreen'
import FreedomScreen from '@/components/screens/FreedomScreen'
import TimelineScreen from '@/components/screens/TimelineScreen'
import FinaleScreen from '@/components/screens/FinaleScreen'
import { SiteContent, DEFAULT_CONTENT } from '@/lib/contentData'
import {
  setSongSource,
  toggleSong,
  startSong,
  pauseSong,
  subscribeAudioState,
} from '@/lib/audioPlayer'

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
  const [currentScreen, setCurrentScreen] = useState<number>(1) // 1 to 9
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)

  // Shared Audio State across all screens via lib/audioPlayer
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [currentTimeText, setCurrentTimeText] = useState('00:00')
  const [durationText, setDurationText] = useState('03:45')
  const [audioError, setAudioError] = useState<string | undefined>(undefined)

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Subscribe to singleton audio player state changes
  useEffect(() => {
    const unsubscribe = subscribeAudioState((state) => {
      setIsAudioPlaying(state.isPlaying)
      setAudioProgress(state.progress)
      setCurrentTimeText(formatTime(state.currentTime))
      if (state.duration > 0) {
        setDurationText(formatTime(state.duration))
      }
    })
    return () => unsubscribe()
  }, [])

  // Fetch or refresh content (handles signed URL expiry)
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      if (!res.ok) throw new Error('Content fetch failed')
      const data: SiteContent = await res.json()
      if (data) {
        setContent(data)
        if (data.songUrl) {
          setSongSource(data.songUrl)
        }
      }
    } catch (err) {
      console.warn('Content fallback active:', err)
    }
  }, [])

  useEffect(() => {
    if (unlocked) {
      fetchContent()
    }
  }, [unlocked, fetchContent])

  // Gate Screen if locked
  if (!unlocked) {
    return (
      <AppFrame showMuteToggle={false}>
        <GateScreen
          onUnlocked={() => setUnlocked(true)}
          unlockAt={unlockAt}
          bypassDate={bypassDate}
        />
      </AppFrame>
    )
  }

  return (
    <AppFrame showMuteToggle={true}>
      <div className="w-full min-h-[100dvh] relative overflow-x-hidden flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* Screen 1: Opener */}
          {currentScreen === 1 && (
            <motion.div
              key="screen-1"
              className="w-full h-full flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.35 }}
            >
              <OpenerScreen onYes={() => setCurrentScreen(2)} />
            </motion.div>
          )}

          {/* Screen 2: Happy Birthday (with Candle interaction) */}
          {currentScreen === 2 && (
            <motion.div
              key="screen-2"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BirthdayScreen
                onNext={() => setCurrentScreen(3)}
                songTitle={content.songTitle}
              />
            </motion.div>
          )}

          {/* Screen 3: 3D Crystal Heart */}
          {currentScreen === 3 && (
            <motion.div
              key="screen-3"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
            >
              <CrystalHeartScreen onNext={() => setCurrentScreen(4)} />
            </motion.div>
          )}

          {/* Screen 4: Hub ("Kuch cheezein khol ke dekho" + Talking Bubu) */}
          {currentScreen === 4 && (
            <motion.div
              key="screen-4"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <HubScreen
                content={content}
                onProceedToReasons={() => setCurrentScreen(5)}
                onRefreshContent={fetchContent}
                isAudioPlaying={isAudioPlaying}
                onToggleAudio={toggleSong}
                audioError={audioError}
                audioProgress={audioProgress}
                audioCurrentTime={currentTimeText}
                audioDuration={durationText}
              />
            </motion.div>
          )}

          {/* Screen 5: 25 Reasons (3D Coverflow Carousel) */}
          {currentScreen === 5 && (
            <motion.div
              key="screen-5"
              className="w-full h-full flex-1"
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

          {/* Screen 6: Tumhara Khwab (Lawyer dream) */}
          {currentScreen === 6 && (
            <motion.div
              key="screen-6"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
            >
              <LawyerDreamScreen
                onNext={() => setCurrentScreen(7)}
                onBack={() => setCurrentScreen(5)}
              />
            </motion.div>
          )}

          {/* Screen 7: Azaadi (Freedom and joy) */}
          {currentScreen === 7 && (
            <motion.div
              key="screen-7"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
            >
              <FreedomScreen
                onNext={() => setCurrentScreen(8)}
                onBack={() => setCurrentScreen(6)}
              />
            </motion.div>
          )}

          {/* Screen 8: Hamari Kahani (Timeline) */}
          {currentScreen === 8 && (
            <motion.div
              key="screen-8"
              className="w-full h-full flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <TimelineScreen
                timeline={content.timeline}
                onNext={() => setCurrentScreen(9)}
              />
            </motion.div>
          )}

          {/* Screen 9: Finale */}
          {currentScreen === 9 && (
            <motion.div
              key="screen-9"
              className="w-full h-full flex-1"
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
    </AppFrame>
  )
}
