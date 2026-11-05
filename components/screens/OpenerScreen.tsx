'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { HeartIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

interface OpenerScreenProps {
  onYes: () => void
}

export default function OpenerScreen({ onYes }: OpenerScreenProps) {
  const [dodgeCount, setDodgeCount] = useState(0)
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 })
  const [showSadBear, setShowSadBear] = useState(false)

  const handleNoClick = () => {
    if (dodgeCount < 3) {
      const angles = [
        { x: -50, y: -25 },
        { x: 50, y: 35 },
        { x: -45, y: 40 },
      ]
      const nextOffset = angles[dodgeCount % angles.length]
      setDodgeOffset(nextOffset)
      setDodgeCount((prev) => prev + 1)
    } else {
      setShowSadBear(true)
    }
  }

  const handleYesClick = () => {
    buzz(10)
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#E8C27A', '#FFFFFF'],
      })
    } catch {
      // ignore
    }
    setTimeout(() => {
      onYes()
    }, 450)
  }

  const handleTryAgain = () => {
    setShowSadBear(false)
    setDodgeCount(0)
    setDodgeOffset({ x: 0, y: 0 })
  }

  return (
    <ScreenShell theme="blush" showAmbient={true}>
      <div className="w-full flex flex-col items-center justify-center my-auto py-6">
        <AnimatePresence mode="wait">
          {!showSadBear ? (
            <motion.div
              key="opener-main"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm text-center"
            >
              {/* Forehead kiss & sweet embrace sticker */}
              <AnimatedSticker
                name="dudu-bubu-kiss"
                fallbackType="dudu-bubu-kiss"
                size={160}
                priority={true}
                animation="float"
              />

              {/* Romantic Question */}
              <div className="flex flex-col items-center gap-2 px-2">
                <h1
                  className="heading-fluid leading-tight text-deep-rose"
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    color: 'var(--deep-rose)',
                    textShadow: '0 2px 10px rgba(229,107,138,0.2)',
                  }}
                >
                  Maine tumhare liye kuch special banaya hai… dekhogi?
                </h1>

                <p
                  className="body-fluid font-medium text-rose-600/90 mt-1"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  Sirf tumhare liye, meri Jaan
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative flex items-center justify-center gap-4 mt-2 w-full min-h-[64px]">
                {/* YES Button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={handleYesClick}
                  className="btn-primary min-w-[140px] shadow-xl flex items-center justify-center gap-2 text-lg font-bold"
                  aria-label="Yes, dekhna hai"
                >
                  <HeartIcon size={20} color="#FFFFFF" />
                  <span>YES!</span>
                </motion.button>

                {/* NO Button with playful dodge */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  animate={{ x: dodgeOffset.x, y: dodgeOffset.y }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  onClick={handleNoClick}
                  className="btn-secondary min-w-[105px] flex items-center justify-center gap-1.5 opacity-90"
                  aria-label="No, nahi dekhna"
                >
                  <span>NO</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opener-sad"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm text-center"
            >
              {/* Sad Bear */}
              <AnimatedSticker
                name="bubu-sad"
                fallbackType="bubu-sad"
                size={165}
                priority={true}
                animation="bounce"
              />

              <div className="flex flex-col items-center gap-2 px-2">
                <h2
                  className="heading-fluid leading-tight text-deep-rose"
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    color: 'var(--deep-rose)',
                  }}
                >
                  Kyun click kiya no?
                </h2>

                <p
                  className="body-fluid text-[#2D2329]"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  Main kitne dino se tumhare liye yeh bana raha tha… ab YES bolo!
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleTryAgain}
                className="btn-primary px-8 text-lg font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <HeartIcon size={20} color="#FFFFFF" />
                <span>TRY AGAIN</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  )
}
