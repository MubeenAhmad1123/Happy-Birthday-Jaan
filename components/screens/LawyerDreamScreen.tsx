'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import BackButton from '@/components/BackButton'
import AnimatedSticker from '@/components/AnimatedSticker'
import { ArrowLeftIcon, ArrowRightIcon, ScaleIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

interface LawyerDreamScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function LawyerDreamScreen({
  onNext,
  onBack,
}: LawyerDreamScreenProps) {
  return (
    <ScreenShell
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-2"
    >
      {/* Top Header */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-between z-10 pt-1">
        <BackButton onClick={onBack} aria-label="Back to Reasons" />

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-rose-200">
          <ScaleIcon size={16} color="var(--deep-rose)" />
          <span
            className="text-xs font-bold tracking-wider uppercase text-deep-rose"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            Tumhara Khwab
          </span>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto gap-4 text-center py-2 z-10">
        {/* Animated Lawyer Sticker */}
        <AnimatedSticker
          name="dudu-bubu-lawyer"
          fallbackType="dudu-bubu-lawyer"
          size={135}
          animation="float"
        />

        {/* Photos 14 & 15 Side-by-Side Polaroids */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {/* Photo 14 (Library) */}
          <div className="p-2.5 bg-white border border-rose-200 shadow-md rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/14"
                alt="Advocate in Library"
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
              Law Library
            </p>
          </div>

          {/* Photo 15 (Courthouse) */}
          <div className="p-2.5 bg-white border border-rose-200 shadow-md rounded-2xl transform rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-36 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/photos/15"
                alt="Lawyer at Courthouse"
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
              The Courthouse
            </p>
          </div>
        </motion.div>

        {/* Inspiring Tribute Text */}
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
            Advocate Maria
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed text-[#2D2329]"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Yeh sirf ek khwab nahi hai, yeh tumhara mustaqbil hai. Tumhari mehnat,
            tumhara jazba aur tumhara honsla… Inshallah ek din tum court mein
            khari ho kar sachai ke liye laro gi.
          </p>
          <span
            className="text-xs font-bold tracking-wider text-rose-600 mt-0.5"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            MUJHE TUM PE BOHOT NAAZ HAI 🤍
          </span>
        </motion.div>
      </div>

      {/* Bottom Button to Next Screen */}
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
          <span>Azaadi ki roshni dekho</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </motion.div>
    </ScreenShell>
  )
}
