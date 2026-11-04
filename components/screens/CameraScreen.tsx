'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import { PhotoItem } from '@/lib/contentData'
import CharacterSticker from '@/components/CharacterSticker'
import { ArrowLeftIcon, ArrowRightIcon, CameraIcon, HeartIcon } from '@/components/Icons'

interface CameraScreenProps {
  photos: PhotoItem[]
  onBack: () => void
  onRefreshContent?: () => Promise<void>
}

interface FloatingHeart {
  id: number
  xOffset: number
}

export default function CameraScreen({
  photos,
  onBack,
  onRefreshContent,
}: CameraScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const [reactionHearts, setReactionHearts] = useState<FloatingHeart[]>([])
  const thumbnailStripRef = useRef<HTMLDivElement>(null)

  const safePhotos = photos && photos.length > 0 ? photos : []
  const totalPhotos = safePhotos.length || 25
  const currentPhoto = safePhotos[activeIndex] || safePhotos[0] || {
    url: '/api/photos/01',
    caption: 'Hamari pyari yaadein 🤍',
  }

  // Preload neighboring photos
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

  // Center active thumbnail in film strip
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

  const handleHeartReaction = () => {
    const newHeart: FloatingHeart = {
      id: Date.now(),
      xOffset: (Math.random() - 0.5) * 40,
    }
    setReactionHearts((prev) => [...prev.slice(-8), newHeart])

    try {
      confetti({
        particleCount: 12,
        spread: 40,
        origin: { y: 0.75 },
        colors: ['#E56B8A', '#FF7597', '#F9D5DE', '#FFFFFF'],
      })
    } catch {
      // ignore
    }
  }

  return (
    <ScreenShell
      theme="blush"
      showAmbient={true}
      className="p-0"
      contentClassName="h-full justify-between max-w-[430px] px-3 py-2"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-20 pt-1 pb-1">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white shadow-sm text-deep-rose border border-rose-200/80 cursor-pointer"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas Hub jao"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-1.5">
          <CameraIcon size={18} color="var(--rose)" />
          <span
            className="text-base font-bold text-deep-rose tracking-wide"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Photo Memories ({activeIndex + 1}/{totalPhotos})
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Carousel Frame */}
      <div className="w-full flex flex-col items-center z-10 my-auto">
        <div
          className="relative w-full rounded-3xl p-3 shadow-xl border flex flex-col items-center bg-white"
          style={{
            borderColor: 'rgba(229, 107, 138, 0.28)',
            boxShadow: '0 14px 36px rgba(229, 107, 138, 0.16)',
          }}
        >
          {/* Carousel Viewport (Aspect 3:4 for portrait mobile photos) */}
          <div
            className="relative w-full aspect-[3/4] max-h-[50dvh] rounded-2xl overflow-hidden bg-rose-50/70 flex items-center justify-center border border-rose-100 select-none shadow-inner"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Soft blurred background of same photo */}
            {currentPhoto.url && (
              <div className="absolute inset-0 pointer-events-none opacity-25 filter blur-xl scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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
                className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing p-1 overflow-hidden"
              >
                {!imgErrors[activeIndex] && currentPhoto.url ? (
                  /* Ken-Burns Slow Zoom: 1.0 -> 1.05 over 8s */
                  <motion.div
                    animate={{ scale: [1, 1.05] }}
                    transition={{
                      duration: 8,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPhoto.url}
                      alt={currentPhoto.caption || 'Maria Memory'}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(activeIndex)}
                      className="w-full h-full object-contain pointer-events-none rounded-xl"
                    />
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <CharacterSticker type="dudu-bubu-hug" size={130} />
                    <span
                      className="text-sm text-deep-rose mt-2 font-bold"
                      style={{ fontFamily: 'var(--font-caveat)' }}
                    >
                      Hamara sukoon 🤍
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Left / Right Circular Navigation Buttons */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-deep-rose shadow-md flex items-center justify-center z-20 border border-rose-200 cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeftIcon size={16} color="var(--deep-rose)" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-deep-rose shadow-md flex items-center justify-center z-20 border border-rose-200 cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRightIcon size={16} color="var(--deep-rose)" />
            </motion.button>
          </div>

          {/* Caption Card Below Photo with Heart Reaction Button */}
          <div className="w-full mt-2.5 px-2 py-1 flex items-center justify-between">
            <div className="flex flex-col text-left flex-1 min-w-0 pr-2">
              <span
                className="text-[11px] font-bold text-rose-500 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                Photo {String(activeIndex + 1).padStart(2, '0')} / {totalPhotos}
              </span>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="text-base sm:text-lg font-bold leading-tight text-deep-rose truncate"
                  style={{ fontFamily: 'var(--font-dancing)' }}
                >
                  {currentPhoto.caption}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Heart Reaction Button with Floating Hearts */}
            <div className="relative shrink-0">
              <AnimatePresence>
                {reactionHearts.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 1, scale: 0.6, y: 0, x: h.xOffset }}
                    animate={{ opacity: 0, scale: 1.4, y: -45, x: h.xOffset * 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                  >
                    <HeartIcon size={20} color="#E56B8A" />
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.86 }}
                onClick={handleHeartReaction}
                className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-sm cursor-pointer hover:bg-rose-100 transition-colors"
                aria-label="Love this photo"
              >
                <HeartIcon size={18} color="#E56B8A" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 25-Thumbnail Horizontal Film Strip */}
        <div
          ref={thumbnailStripRef}
          className="w-full mt-2.5 flex items-center gap-2 overflow-x-auto py-1 px-1 snap-x no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {safePhotos.map((p, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-13 h-13 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white snap-center cursor-pointer ${
                activeIndex === idx
                  ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/30'
                  : 'border-rose-200/70 opacity-60 hover:opacity-90'
              }`}
              style={{ width: '52px', height: '52px' }}
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
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                {idx + 1}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}
