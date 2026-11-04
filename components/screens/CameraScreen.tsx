'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import { PhotoItem } from '@/lib/contentData'
import CharacterSticker from '@/components/CharacterSticker'
import { ArrowLeftIcon, ArrowRightIcon, CameraIcon, HeartIcon } from '@/components/Icons'
import { buzz, softChime } from '@/lib/feedback'

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
    buzz(10)
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))
  }

  const nextPhoto = () => {
    buzz(10)
    setActiveIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))
  }

  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }))
    if (onRefreshContent) {
      onRefreshContent().catch(() => {})
    }
  }

  const handleHeartReaction = () => {
    buzz(15)
    softChime()
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
      theme="dark"
      showAmbient={true}
      ambientVariant="dark"
      className="p-0"
      contentClassName="h-full justify-between max-w-[430px] px-3 py-2"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-20 pt-1 pb-1">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => {
            buzz(10)
            onBack()
          }}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/10 shadow-sm text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas Hub jao"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-1.5">
          <CameraIcon size={18} color="#E8C27A" />
          <span
            className="text-base font-bold text-white tracking-wide"
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
          className="relative w-full rounded-3xl p-3 shadow-2xl border flex flex-col items-center backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 24, 34, 0.95) 0%, rgba(18, 14, 20, 0.98) 100%)',
            borderColor: 'rgba(212, 175, 55, 0.35)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Carousel Viewport (Aspect 3:4 for portrait mobile photos) */}
          <div
            className="relative w-full aspect-[3/4] max-h-[50dvh] rounded-2xl overflow-hidden bg-black/70 flex items-center justify-center border border-white/10 select-none shadow-inner"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Soft blurred background of same photo */}
            {currentPhoto.url && (
              <div className="absolute inset-0 pointer-events-none opacity-30 filter blur-xl scale-110">
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
                      loading="eager"
                      decoding="async"
                      onError={() => handleImageError(activeIndex)}
                      className="w-full h-full object-contain pointer-events-none rounded-xl"
                    />
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <CharacterSticker type="dudu-bubu-hug" size={130} />
                    <span
                      className="text-sm text-rose-200 mt-2 font-bold"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md shadow-md flex items-center justify-center z-20 border border-white/20 hover:bg-black/80 transition-all cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeftIcon size={16} color="#FFFFFF" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md shadow-md flex items-center justify-center z-20 border border-white/20 hover:bg-black/80 transition-all cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRightIcon size={16} color="#FFFFFF" />
            </motion.button>
          </div>

          {/* Caption Card Below Photo with Heart Reaction Button */}
          <div className="w-full mt-2.5 px-2 py-1 flex items-center justify-between">
            <div className="flex flex-col text-left flex-1 min-w-0 pr-2">
              <span
                className="text-[11px] font-bold text-[#E8C27A] uppercase tracking-wider"
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
                  className="text-base sm:text-lg font-bold leading-tight text-white truncate"
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
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-rose-300 shadow-sm cursor-pointer hover:bg-white/20 transition-colors"
                aria-label="Love this photo"
              >
                <HeartIcon size={18} color="#FF7597" />
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
              className={`relative flex-shrink-0 w-13 h-13 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-neutral-900 snap-center cursor-pointer ${
                activeIndex === idx
                  ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/40 ring-1 ring-[#D4AF37]'
                  : 'border-white/20 opacity-50 hover:opacity-90'
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
