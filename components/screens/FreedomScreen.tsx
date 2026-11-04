'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { ArrowLeftIcon, ArrowRightIcon, DoveIcon } from '@/components/Icons'

interface FreedomScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function FreedomScreen({
  onNext,
  onBack,
}: FreedomScreenProps) {
  return (
    <ScreenShell
      theme="dark"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-rose-300 border border-white/10 backdrop-blur-md"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas lawyer screen pe jao"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-emerald-400/30">
          <DoveIcon size={16} color="#34D399" />
          <span
            className="text-xs font-bold tracking-wider uppercase text-emerald-300"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Azaadi Aur Khushi
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto gap-4 text-center py-2 z-10">
        {/* Animated Freedom Sticker */}
        <AnimatedSticker
          name="dudu-bubu-freedom"
          fallbackType="dudu-bubu-freedom"
          size={135}
          animation="float"
        />

        {/* Photos 18 & 19 Side-by-Side Polaroids */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {/* Photo 18 (Meadow) */}
          <div className="p-2.5 bg-[#1E1A20] border border-emerald-500/30 shadow-xl rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/18"
                alt="Green Meadow Freedom"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
            </div>
            <p
              className="text-xs text-emerald-300 font-bold mt-1.5 text-center"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Khuli Hawa
            </p>
          </div>

          {/* Photo 19 (Sunrise Dupatta) */}
          <div className="p-2.5 bg-[#1E1A20] border border-rose-500/30 shadow-xl rounded-2xl transform rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/19"
                alt="Sunrise Flight"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
            </div>
            <p
              className="text-xs text-rose-300 font-bold mt-1.5 text-center"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Nayi Subah
            </p>
          </div>
        </motion.div>

        {/* Freedom Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col gap-1.5 px-2"
        >
          <h2
            className="heading-fluid leading-tight text-white"
            style={{
              fontFamily: 'var(--font-dancing)',
              textShadow: '0 2px 14px rgba(229,107,138,0.4)',
            }}
          >
            Azaadi, Sukoon Aur Tum
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed text-white/90"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Tumhara haq hai aisi zindagi jahan koi dar na ho, jahan tum khul ke
            saans lo, jahan tumhari hansi sab se oonchi ho. Main har qadam pe
            tumhare saath khara hoon, inshallah.
          </p>
          <span
            className="text-xs font-bold tracking-wider text-emerald-300 mt-0.5"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            TUM HAMESHA KHUSH RAHO, BEGUM 🤍
          </span>
        </motion.div>
      </div>

      {/* Bottom Button to Timeline Screen */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-sm mx-auto z-10 pb-2 px-1"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Hamari kahani dekho</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </motion.div>
    </ScreenShell>
  )
}
