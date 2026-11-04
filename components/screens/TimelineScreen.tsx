'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import { TimelineItem } from '@/lib/contentData'
import AnimatedSticker from '@/components/AnimatedSticker'
import { CharacterType } from '@/components/CharacterSticker'
import { SparkleIcon, HeartIcon, ArrowRightIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

interface TimelineScreenProps {
  timeline: TimelineItem[]
  onNext: () => void
}

export default function TimelineScreen({ timeline, onNext }: TimelineScreenProps) {
  return (
    <ScreenShell
      theme="blush"
      showAmbient={true}
      contentClassName="justify-between py-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-2 mb-6 max-w-sm z-10"
      >
        <span
          className="text-xs uppercase tracking-widest font-bold text-rose-500"
          style={{ fontFamily: 'var(--font-baloo)' }}
        >
          Our Journey
        </span>
        <h1
          className="heading-fluid leading-tight text-deep-rose mt-1"
          style={{
            fontFamily: 'var(--font-dancing)',
            color: 'var(--deep-rose)',
            textShadow: '0 2px 10px rgba(229,107,138,0.2)',
          }}
        >
          Hamari Kahani
        </h1>
        <p
          className="text-sm text-charcoal/80 mt-0.5"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Har ek lamha jo humne saath guzara…
        </p>
      </motion.div>

      {/* Vertical Timeline Container */}
      <div className="relative w-full max-w-sm flex flex-col gap-6 pb-6 z-10">
        {/* Connecting Vertical Line */}
        <div className="absolute left-5 top-6 bottom-12 w-0.5 border-l-2 border-dashed border-rose-300 pointer-events-none" />

        {timeline.map((item, idx) => {
          const charType: CharacterType =
            (item.character as CharacterType) ||
            (idx === 0
              ? 'dudu-bubu-box'
              : idx === 1
              ? 'dudu-bubu-nashta'
              : idx === 2
              ? 'dudu-bubu-chai'
              : idx === 5
              ? 'bubu-sad'
              : idx === 7
              ? 'dudu-bubu-bday'
              : 'dudu-bubu-hug')

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="relative flex items-start gap-3.5 pl-1"
            >
              {/* Date node icon circle */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center text-sm shadow-md z-10 shrink-0 text-rose-500">
                <SparkleIcon size={16} color="var(--rose)" />
              </div>

              {/* Card Content */}
              <div
                className="p-4 flex-1 rounded-3xl border shadow-md text-left bg-white border-rose-200"
              >
                <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-rose-100">
                  <span
                    className="text-base font-bold text-deep-rose"
                    style={{ fontFamily: 'var(--font-baloo)' }}
                  >
                    {item.date}
                  </span>
                  <HeartIcon size={14} color="var(--rose)" />
                </div>

                <p
                  className="text-base sm:text-lg leading-snug mb-3 text-[#2D2329]"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  {item.text}
                </p>

                {/* Sticker scene */}
                <div className="flex justify-end pt-1">
                  <AnimatedSticker
                    name={charType}
                    fallbackType={charType}
                    size={75}
                    animation="float"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Button to Finale */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-sm z-10 pt-2 pb-4 px-1"
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
          <span>Aakhri paighaam dekho</span>
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </motion.button>
      </motion.div>
    </ScreenShell>
  )
}
