'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { ArrowLeftIcon, CassetteIcon, PlayIcon, PauseIcon } from '@/components/Icons'

interface CassetteScreenProps {
  songTitle: string
  isPlaying: boolean
  onTogglePlay: () => void
  onBack: () => void
  audioError?: string
  progress?: number
  currentTimeText?: string
  durationText?: string
}

export default function CassetteScreen({
  songTitle = 'Dil Ibadat Kar Raha Hai',
  isPlaying,
  onTogglePlay,
  onBack,
  audioError,
  progress = 0,
  currentTimeText = '00:00',
  durationText = '03:45',
}: CassetteScreenProps) {
  return (
    <ScreenShell theme="dark" showAmbient={true} contentClassName="justify-between">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20 pt-2 mb-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-rose-300 border border-white/10 backdrop-blur-md"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas Hub"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <CassetteIcon size={18} color="var(--rose)" />
          <span
            className="text-base font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Hamara Gaana
          </span>
        </div>

        <div className="w-12" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-6 my-auto">
        {/* Retro Cassette Tape SVG with spinning reels */}
        <div
          className="relative w-full aspect-[16/10] rounded-3xl p-4 shadow-2xl border flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #1E1A20 0%, #121014 100%)',
            borderColor: 'rgba(229, 107, 138, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Cassette Label Area */}
          <div
            className="w-full h-full rounded-2xl p-3 flex flex-col justify-between"
            style={{ background: 'linear-gradient(145deg, #FFF8F5 0%, #FFF0F4 100%)' }}
          >
            {/* Top Label */}
            <div className="flex justify-between items-center border-b pb-1 border-rose-200">
              <span
                className="text-[11px] font-bold text-rose-500 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Side A • For Maria
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-400">
                25 YEARS
              </span>
            </div>

            {/* Song Title Banner */}
            <div className="text-center my-1 px-1">
              <p
                className="text-xl font-bold truncate text-deep-rose"
                style={{ fontFamily: 'var(--font-dancing)' }}
              >
                {songTitle}
              </p>
            </div>

            {/* Cassette Window with Two Spinning Reels */}
            <div className="w-full h-14 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-around px-4 relative overflow-hidden shadow-inner">
              {/* Tape line connecting reels */}
              <div className="absolute top-1/2 left-10 right-10 h-3 -translate-y-1/2 bg-amber-950/70" />

              {/* Left Reel */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 2.2, ease: 'linear' }
                    : { duration: 0.2 }
                }
                className="relative w-10 h-10 rounded-full border-4 border-white/80 bg-neutral-800 flex items-center justify-center z-10"
              >
                <div className="w-full h-0.5 bg-white/60 absolute" />
                <div className="w-0.5 h-full bg-white/60 absolute" />
                <div className="w-3 h-3 rounded-full bg-white" />
              </motion.div>

              {/* Tape Counter */}
              <div className="text-[10px] font-mono text-emerald-400 z-10 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {currentTimeText}
              </div>

              {/* Right Reel */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 2.2, ease: 'linear' }
                    : { duration: 0.2 }
                }
                className="relative w-10 h-10 rounded-full border-4 border-white/80 bg-neutral-800 flex items-center justify-center z-10"
              >
                <div className="w-full h-0.5 bg-white/60 absolute" />
                <div className="w-0.5 h-full bg-white/60 absolute" />
                <div className="w-3 h-3 rounded-full bg-white" />
              </motion.div>
            </div>

            {/* Bottom Brand */}
            <div className="text-center pt-1 border-t border-rose-100">
              <span
                className="text-[9px] uppercase tracking-wider text-rose-400 font-bold"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                STEREO • OUR FOREVER SOUNDTRACK
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Timing */}
        <div className="w-full px-2 flex flex-col gap-1.5">
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="w-full flex justify-between text-xs text-white/50 font-mono">
            <span>{currentTimeText}</span>
            <span>{durationText}</span>
          </div>
        </div>

        {/* Big 64px Play / Pause Button with Ripple Glow */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            {isPlaying && (
              <div className="absolute w-20 h-20 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onTogglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl text-white cursor-pointer select-none transition-all z-10"
              style={{
                background: isPlaying
                  ? 'linear-gradient(135deg, #B8405E 0%, #E56B8A 100%)'
                  : 'linear-gradient(135deg, #E56B8A 0%, #FF7597 100%)',
                boxShadow: '0 8px 24px rgba(229,107,138,0.4)',
              }}
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? (
                <PauseIcon size={26} color="#FFFFFF" />
              ) : (
                <div className="ml-1">
                  <PlayIcon size={26} color="#FFFFFF" />
                </div>
              )}
            </motion.button>
          </div>

          <p
            className="text-base text-center text-white/90"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            {isPlaying
              ? 'Gaana baj raha hai… sukoon se suno 🤍'
              : 'Tap karo to play our song'}
          </p>

          {audioError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-500/30 text-center max-w-xs"
            >
              {audioError}
            </motion.p>
          )}
        </div>
      </div>
    </ScreenShell>
  )
}
