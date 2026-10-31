'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import CharacterSticker from '@/components/CharacterSticker'

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
        { x: -50, y: -20 },
        { x: 50, y: 30 },
        { x: -40, y: 40 },
      ]
      const nextOffset = angles[dodgeCount % angles.length]
      setDodgeOffset(nextOffset)
      setDodgeCount((prev) => prev + 1)
    } else {
      setShowSadBear(true)
    }
  }

  const handleYesClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E56B8A', '#F9D5DE', '#FFF8F5', '#FFB703', '#FFFFFF'],
      })
    } catch (err) {
      console.warn('Confetti error:', err)
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
    <div
      className="screen"
      style={{
        background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)',
      }}
    >
      <AnimatePresence mode="wait">
        {!showSadBear ? (
          <motion.div
            key="opener-main"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 px-6 max-w-sm text-center"
          >
            {/* Panda peeking from box */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <CharacterSticker type="dudu-bubu-box" size={160} />
            </motion.div>

            {/* Question */}
            <h1
              className="text-3xl sm:text-4xl leading-snug px-2"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: 'var(--deep-rose)',
              }}
            >
              Maine tumhare liye kuch special banaya hai… dekhogi? 🥺
            </h1>

            <p
              className="text-lg opacity-80"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: 'var(--charcoal)',
              }}
            >
              Sirf tumhare liye, meri Jaan 🤍
            </p>

            {/* Buttons */}
            <div className="relative flex items-center justify-center gap-4 mt-2 w-full min-h-[70px]">
              {/* YES Button */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleYesClick}
                className="btn-primary min-w-[130px] text-lg font-bold shadow-lg"
              >
                YES! 💕
              </motion.button>

              {/* NO Button with playful dodge */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                animate={{ x: dodgeOffset.x, y: dodgeOffset.y }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={handleNoClick}
                className="btn-secondary min-w-[100px] text-base opacity-90"
              >
                NO 🙈
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="opener-sad"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6 px-6 max-w-sm text-center"
          >
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <CharacterSticker type="bubu-sad" size={170} />
            </motion.div>

            <h2
              className="text-3xl leading-snug"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: 'var(--deep-rose)',
              }}
            >
              Kyun click kiya no? 😭
            </h2>

            <p
              className="text-xl"
              style={{
                fontFamily: 'var(--font-caveat)',
                color: 'var(--charcoal)',
              }}
            >
              Main kitne dino se tumhare liye yeh bana raha tha… ab YES bolo! 🥺🤍
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTryAgain}
              className="btn-primary mt-2 text-lg px-8"
            >
              TRY AGAIN 🤍
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

