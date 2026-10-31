'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CassetteScreenProps {
  songUrl: string
  songTitle: string
  onBack: () => void
}

export default function CassetteScreen({
  songUrl,
  songTitle,
  onBack,
}: CassetteScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play blocked/error:', err)
          setIsPlaying(false)
        })
    }
  }

  return (
    <div
      className="screen relative p-4 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)',
      }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={songUrl || '/audio/our-song.mp3'}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6 z-20">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="sticker px-3 py-1.5 text-sm font-bold flex items-center gap-1 bg-white/90"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          ← Wapas
        </motion.button>
        <span
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
        >
          Hamara Gaana 📼
        </span>
        <div className="w-12" />
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-6 my-auto">
        {/* Retro Cassette Tape SVG with spinning reels */}
        <div
          className="relative w-full aspect-[16/10] rounded-3xl p-4 shadow-2xl border-4"
          style={{
            background: 'linear-gradient(135deg, #3A3036 0%, #2A2026 100%)',
            borderColor: '#F9D5DE',
            boxShadow: '0 16px 36px rgba(58,48,54,0.3)',
          }}
        >
          {/* Cassette Label Area */}
          <div
            className="w-full h-full rounded-2xl p-3 flex flex-col justify-between"
            style={{ background: '#FFF8F5' }}
          >
            {/* Top Label */}
            <div className="flex justify-between items-center border-b pb-1 border-rose-200">
              <span
                className="text-xs font-bold text-rose-500 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Side A • For Maria
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                25 YEARS
              </span>
            </div>

            {/* Song title banner */}
            <div className="text-center my-1">
              <p
                className="text-lg font-bold truncate px-2"
                style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
              >
                {songTitle || 'Dil Ibadat Kar Raha Hai'}
              </p>
            </div>

            {/* Cassette Window with Two Spinning Reels */}
            <div className="w-full h-14 rounded-xl bg-neutral-900 border-2 border-neutral-700 flex items-center justify-around px-4 relative overflow-hidden">
              {/* Tape line connecting reels */}
              <div className="absolute top-1/2 left-10 right-10 h-3 -translate-y-1/2 bg-amber-950/70" />

              {/* Left Reel */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 2.5, ease: 'linear' }
                    : { duration: 0.2 }
                }
                className="relative w-10 h-10 rounded-full border-4 border-white/80 bg-neutral-800 flex items-center justify-center z-10"
              >
                {/* Spokes */}
                <div className="w-full h-0.5 bg-white/60 absolute" />
                <div className="w-0.5 h-full bg-white/60 absolute" />
                <div className="w-3 h-3 rounded-full bg-white" />
              </motion.div>

              {/* Tape counter */}
              <div className="text-[10px] font-mono text-emerald-400 z-10 bg-black/60 px-1 rounded">
                {isPlaying ? '02:25' : '00:00'}
              </div>

              {/* Right Reel */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 2.5, ease: 'linear' }
                    : { duration: 0.2 }
                }
                className="relative w-10 h-10 rounded-full border-4 border-white/80 bg-neutral-800 flex items-center justify-center z-10"
              >
                {/* Spokes */}
                <div className="w-full h-0.5 bg-white/60 absolute" />
                <div className="w-0.5 h-full bg-white/60 absolute" />
                <div className="w-3 h-3 rounded-full bg-white" />
              </motion.div>
            </div>

            {/* Bottom Brand */}
            <div className="text-center pt-1">
              <span
                className="text-[10px] uppercase tracking-wider text-rose-400 font-bold"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                STEREO • 🤍 OUR FOREVER SOUNDTRACK
              </span>
            </div>
          </div>
        </div>

        {/* Play / Pause Control Button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl text-2xl text-white cursor-pointer"
            style={{
              background: isPlaying ? 'var(--deep-rose)' : 'var(--rose)',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          <p
            className="text-base text-center"
            style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
          >
            {isPlaying
              ? 'Gaana baj raha hai… sukoon se suno 🤍'
              : 'Tap to play our song 🎵'}
          </p>
        </div>
      </div>
    </div>
  )
}

