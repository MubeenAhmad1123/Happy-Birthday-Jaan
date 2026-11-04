'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import AnimatedSticker from '@/components/AnimatedSticker'
import { ArrowLeftIcon, ArrowRightIcon, DoveIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

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
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            buzz(10)
            onBack()
          }}
          className="px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 bg-white shadow-sm text-deep-rose border border-rose-200/80 cursor-pointer"
          style={{ fontFamily: 'var(--font-baloo)' }}
          aria-label="Wapas lawyer screen pe jao"
        >
          <ArrowLeftIcon size={16} color="currentColor" />
          <span>Wapas</span>
        </motion.button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-emerald-300">
          <DoveIcon size={16} color="#059669" />
          <span
            className="text-xs font-bold tracking-wider uppercase text-emerald-700"
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
          <div className="p-2.5 bg-white border border-emerald-200 shadow-md rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center">
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
              className="text-xs text-emerald-700 font-bold mt-1.5 text-center"
              style={{ fontFamily: 'var(--font-baloo)' }}
            >
              Khuli Hawa
            </p>
          </div>

          {/* Photo 19 (Sunrise Dupatta) */}
          <div className="p-2.5 bg-white border border-rose-200 shadow-md rounded-2xl transform rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center">
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
              className="text-xs text-deep-rose font-bold mt-1.5 text-center"
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
            className="heading-fluid leading-tight text-deep-rose"
            style={{
              fontFamily: 'var(--font-dancing)',
              color: 'var(--deep-rose)',
              textShadow: '0 2px 10px rgba(229,107,138,0.2)',
            }}
          >
            Azaadi, Sukoon Aur Tum
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed text-[#2D2329]"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Tumhara haq hai aisi zindagi jahan koi dar na ho, jahan tum khul ke
            saans lo, jahan tumhari hansi sab se oonchi ho. Main har qadam pe
            tumhare saath khara hoon, inshallah.
          </p>
          <span
            className="text-xs font-bold tracking-wider text-rose-600 mt-0.5"
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
          onClick={() => {
            buzz(10)
            onNext()
          }}
          className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl"
        >
          <span>Hamari kahani dekho</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </motion.div>
    </ScreenShell>
  )
}
