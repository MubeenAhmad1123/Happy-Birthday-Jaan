'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { PhotoItem } from '@/lib/contentData'
import CharacterSticker from '@/components/CharacterSticker'
import { ArrowLeftIcon, ArrowRightIcon, CameraIcon } from '@/components/Icons'

interface CameraScreenProps {
  photos: PhotoItem[]
  onBack: () => void
  onRefreshContent?: () => Promise<void>
}

export default function CameraScreen({
  photos,
  onBack,
  onRefreshContent,
}: CameraScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const thumbnailStripRef = useRef<HTMLDivElement>(null)

  // Ensure we always have an array of 25 items
  const safePhotos = photos && photos.length > 0 ? photos : []
  const totalPhotos = safePhotos.length
  const currentPhoto = safePhotos[activeIndex] || safePhotos[0] || {
    url: '/api/photos/01',
    caption: 'Hamari pyari yaadein 🤍',
  }

  // Preload next 2 photos
  useEffect(() => {
    if (totalPhotos <= 1) return
    const next1 = safePhotos[(activeIndex + 1) % totalPhotos]?.url
    const next2 = safePhotos[(activeIndex + 2) % totalPhotos]?.url
    if (next1) {
      const img1 = new Image()
      img1.src = next1
    }
    if (next2) {
      const img2 = new Image()
      img2.src = next2
    }
  }, [activeIndex, safePhotos, totalPhotos])

  // Scroll active thumbnail into center of film strip
  useEffect(() => {
    if (!thumbnailStripRef.current) return
    const activeThumb = thumbnailStripRef.current.children[activeIndex] as HTMLElement
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeIndex])

  const prevPhoto = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))
  }

  const nextPhoto = () => {
    setActiveIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))
  }

  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }))
    if (onRefreshContent) {
      onRefreshContent().catch(() => {})
    }
  }

  return (
    <ScreenShell
      theme="dark"
      showAmbient={false}
      className="p-0"
      contentClassName="h-full justify-between max-w-[480px] px-3 py-2"
    >
      {/* Blurred background copy of the current photo (colour-tinted) */}
      {currentPhoto.url && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhoto.url}
            alt=""
            className="w-full h-full object-cover filter blur-3xl scale-125 transform transition-all duration-700"
          />
          <div className="absolute inset-0 bg-ink-black/60" />
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-10 pt-1 pb-2">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-rose-300 border border-white/10 backdrop-blur-md"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas Hub jao"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <CameraIcon size={18} color="var(--rose)" />
          <span
            className="text-base font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Yaadein ({activeIndex + 1}/{totalPhotos})
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Retro Camera Frame with 3:4 Viewfinder */}
      <div className="w-full flex flex-col items-center z-10 my-auto">
        <div
          className="relative w-full rounded-3xl p-3 shadow-2xl border flex flex-col items-center"
          style={{
            background: 'linear-gradient(160deg, #1E1A20 0%, #151218 100%)',
            borderColor: 'rgba(229, 107, 138, 0.3)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Camera Top Details: Shutter & Flash LED */}
          <div className="w-full flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-gold/80" />
            </div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-rose-300/80 uppercase">
              MARIA-MEMORIES • 25
            </div>
          </div>

          {/* 3:4 Aspect Ratio Viewfinder (max 58dvh on phone) */}
          <div
            className="relative w-full aspect-[3/4] max-h-[56dvh] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 select-none shadow-inner"
            style={{ touchAction: 'pan-y' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 40) {
                    prevPhoto()
                  } else if (info.offset.x < -40) {
                    nextPhoto()
                  }
                }}
                className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
              >
                {!imgErrors[activeIndex] && currentPhoto.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.caption || 'Maria Memory'}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(activeIndex)}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <CharacterSticker type="dudu-bubu-hug" size={130} />
                    <span
                      className="text-sm text-rose-300 mt-2 font-medium"
                      style={{ fontFamily: 'var(--font-caveat)' }}
                    >
                      Hamara sukoon 🤍
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Left / Right 48px Navigation Buttons */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-lg z-20 cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeftIcon size={20} color="#FFFFFF" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-lg z-20 cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRightIcon size={20} color="#FFFFFF" />
            </motion.button>
          </div>

          {/* Caption Card below camera viewfinder */}
          <div className="w-full mt-2.5 px-2 py-1.5 min-h-[46px] rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-base sm:text-lg leading-snug text-white/95"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                {currentPhoto.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* 25-Thumbnail Horizontal Film Strip */}
        <div
          ref={thumbnailStripRef}
          className="w-full mt-3 flex items-center gap-2 overflow-x-auto py-2 px-1 snap-x no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {safePhotos.map((p, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-black snap-center ${
                activeIndex === idx
                  ? 'border-rose-500 scale-105 shadow-lg shadow-rose-500/30'
                  : 'border-white/20 opacity-55 hover:opacity-80'
              }`}
              aria-label={`Photo ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                {idx + 1}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}
