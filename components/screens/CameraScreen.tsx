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
      theme="blush"
      showAmbient={true}
      className="p-0"
      contentClassName="h-full justify-between max-w-[440px] px-3 py-2"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-10 pt-1 pb-2">
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
            You Through My Eyes ({activeIndex + 1}/{totalPhotos})
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Carousel Frame (Inspired by reference Image 2) */}
      <div className="w-full flex flex-col items-center z-10 my-auto">
        <div
          className="relative w-full rounded-3xl p-3 shadow-xl border flex flex-col items-center bg-white"
          style={{
            borderColor: 'rgba(229, 107, 138, 0.25)',
            boxShadow: '0 14px 36px rgba(229, 107, 138, 0.15)',
          }}
        >
          {/* Carousel Viewport (Aspect 3:4 for portrait mobile photos) */}
          <div
            className="relative w-full aspect-[3/4] max-h-[54dvh] rounded-2xl overflow-hidden bg-rose-50/60 flex items-center justify-center border border-rose-100 select-none shadow-inner"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Background subtle blur of photo */}
            {currentPhoto.url && (
              <div className="absolute inset-0 pointer-events-none opacity-20 filter blur-xl scale-110">
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
                className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing p-1"
              >
                {!imgErrors[activeIndex] && currentPhoto.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.caption || 'Maria Memory'}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(activeIndex)}
                    className="w-full h-full object-contain pointer-events-none rounded-xl"
                  />
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

            {/* Left / Right Circular White Navigation Pills (Like Reference Screenshot) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevPhoto}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 text-deep-rose shadow-lg flex items-center justify-center z-20 border border-rose-200 cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeftIcon size={18} color="var(--deep-rose)" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextPhoto}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 text-deep-rose shadow-lg flex items-center justify-center z-20 border border-rose-200 cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRightIcon size={18} color="var(--deep-rose)" />
            </motion.button>
          </div>

          {/* Caption in Dancing Script font */}
          <div className="w-full mt-2.5 px-2 py-1 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-lg sm:text-xl font-bold leading-snug text-deep-rose"
                style={{ fontFamily: 'var(--font-dancing)' }}
              >
                {currentPhoto.caption}
              </motion.p>
            </AnimatePresence>

            {/* Dot indicators (Like Reference Image 2) */}
            <div className="flex items-center gap-1.5 mt-2">
              {safePhotos.slice(0, 10).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    activeIndex % 10 === i
                      ? 'w-4 h-1.5 bg-rose-500'
                      : 'w-1.5 h-1.5 bg-rose-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 25-Thumbnail Horizontal Film Strip with snap-scroll */}
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
              className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white snap-center cursor-pointer ${
                activeIndex === idx
                  ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/30'
                  : 'border-rose-200/70 opacity-60 hover:opacity-90'
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
