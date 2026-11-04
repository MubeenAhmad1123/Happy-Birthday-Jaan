'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMuteState, toggleMuteState, subscribeMuteState, buzz } from '@/lib/feedback'

export default function MuteToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setMuted(getMuteState())
    const unsubscribe = subscribeMuteState((isMuted) => {
      setMuted(isMuted)
    })
    return () => unsubscribe()
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    buzz(10)
    toggleMuteState()
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`fixed sm:absolute top-3 right-3 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center bg-white/80 dark:bg-black/40 backdrop-blur-md border border-rose-200/50 dark:border-white/10 shadow-sm cursor-pointer select-none transition-colors ${className}`}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      title={muted ? 'Sound effects muted' : 'Sound effects on'}
    >
      {muted ? (
        /* Muted Speaker Icon */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-rose-400 dark:text-rose-300"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Unmuted Speaker Icon */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-deep-rose dark:text-rose-300"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.3" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </motion.button>
  )
}
