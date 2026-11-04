'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from '@/components/ScreenShell'
import CharacterSticker from '@/components/CharacterSticker'
import { HeartIcon, LockIcon, SparkleIcon } from '@/components/Icons'
import { buzz } from '@/lib/feedback'

interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface GateScreenProps {
  onUnlocked: () => void
  unlockAt: string
  bypassDate: boolean
}

function useCountdown(unlockAt: string): { remaining: CountdownState; isUnlocked: boolean } {
  const target = new Date(unlockAt).getTime()

  function calc(): CountdownState {
    const diff = Math.max(0, target - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }

  const [remaining, setRemaining] = useState<CountdownState>(calc)
  const [isUnlocked, setIsUnlocked] = useState(() => Date.now() >= target)

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now()
      setRemaining(calc())
      if (now >= target) {
        setIsUnlocked(true)
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [unlockAt, target])

  return { remaining, isUnlocked }
}

function ChaiCup() {
  return (
    <div className="relative flex flex-col items-center select-none" aria-hidden>
      <div className="flex gap-2.5 mb-1 h-9">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="12"
            height="32"
            viewBox="0 0 12 32"
            className="steam-puff"
            style={{ animationDelay: `${i * 0.55}s` }}
          >
            <path
              d="M6 30 Q10 22 6 16 Q2 10 6 2"
              stroke="#E56B8A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </svg>
        ))}
      </div>
      <svg width="86" height="74" viewBox="0 0 90 80" fill="none">
        <ellipse cx="45" cy="73" rx="38" ry="6" fill="#F9D5DE" opacity="0.6" />
        <path
          d="M15 20 Q14 65 45 68 Q76 65 75 20 Z"
          fill="#FFFDF9"
          stroke="#E56B8A"
          strokeWidth="2.5"
        />
        <path
          d="M18 36 Q18 64 45 66 Q72 64 72 36 Z"
          fill="#FDE8ED"
          opacity="0.8"
        />
        <path
          d="M75 28 Q92 28 92 42 Q92 56 75 56"
          stroke="#E56B8A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="45" cy="20" rx="30" ry="5" fill="#FFFFFF" stroke="#E56B8A" strokeWidth="2" />
        <ellipse cx="30" cy="50" rx="4" ry="9" fill="white" opacity="0.5" transform="rotate(-15 30 50)" />
      </svg>
    </div>
  )
}

function CountdownTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="px-3 py-2 text-2xl font-bold min-w-[3.2rem] text-center rounded-2xl bg-white border border-rose-200/80 shadow-md text-deep-rose"
        style={{ fontFamily: 'var(--font-baloo)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        className="text-xs mt-1.5 font-bold tracking-wide uppercase text-rose-500"
        style={{ fontFamily: 'var(--font-baloo)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function GateScreen({ onUnlocked, unlockAt, bypassDate }: GateScreenProps) {
  const { remaining, isUnlocked: dateUnlocked } = useCountdown(unlockAt)
  const canUnlock = bypassDate || dateUnlocked

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lockoutSeconds <= 0) return
    const id = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [lockoutSeconds])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    buzz(10)
    if (!canUnlock || loading || lockoutSeconds > 0) return

    setLoading(true)
    setError('')
    setShake(false)

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onUnlocked()
      } else if (res.status === 429) {
        setLockoutSeconds(data.retryAfter ?? 60)
        setError(`Thoda ruko! ${data.retryAfter ?? 60}s baad try karo`)
        triggerShake()
      } else {
        setError('Hmm, phir se koshish karo 🥺')
        triggerShake()
        setPassword('')
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    } catch {
      setError('Connection error, dubara try karo')
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <ScreenShell theme="blush" showAmbient={true}>
      <div className="w-full flex flex-col items-center justify-center my-auto py-4">
        <motion.div
          className="flex flex-col items-center gap-5 w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Romantic Surprise Sticker Header */}
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            >
              <CharacterSticker type="dudu-bubu-box" size={130} />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-1">
            <h1
              className="heading-fluid leading-tight text-deep-rose"
              style={{
                fontFamily: 'var(--font-dancing)',
                color: 'var(--deep-rose)',
                textShadow: '0 2px 10px rgba(229,107,138,0.2)',
              }}
            >
              Jaan, hamara secret word likho
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <SparkleIcon size={14} color="var(--rose)" />
              <span
                className="text-sm font-medium tracking-wide text-rose-500"
                style={{ fontFamily: 'var(--font-caveat)' }}
              >
                A special surprise for Maria
              </span>
              <SparkleIcon size={14} color="var(--rose)" />
            </div>
          </div>

          {/* Countdown before unlock date */}
          <AnimatePresence>
            {!canUnlock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="flex flex-col items-center gap-3 w-full my-2"
              >
                <p
                  className="text-center text-lg text-rose-600 font-bold"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  Bas thora sa intezar… ✨
                </p>
                <div className="flex gap-2.5 justify-center">
                  <CountdownTile value={remaining.days} label="din" />
                  <CountdownTile value={remaining.hours} label="ghante" />
                  <CountdownTile value={remaining.minutes} label="minute" />
                  <CountdownTile value={remaining.seconds} label="second" />
                </div>
                <p
                  className="text-center text-sm opacity-80 text-charcoal/80 mt-1"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                >
                  5 November tak ruko, Jaan 🎂
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Form with Keyboard-safe spacing */}
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-3.5 w-full mt-2 ${shake ? 'shake' : ''}`}
            noValidate
          >
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="password"
                className="input-field text-center font-bold tracking-wider placeholder:tracking-normal"
                placeholder={canUnlock ? 'Secret word…' : '5 November tak locked'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!canUnlock || loading || lockoutSeconds > 0}
                autoComplete="off"
                maxLength={128}
                aria-label="Secret password"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-base text-deep-rose font-bold"
                  style={{ fontFamily: 'var(--font-caveat)' }}
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl"
              disabled={!canUnlock || loading || lockoutSeconds > 0 || !password.trim()}
              whileTap={{ scale: 0.95 }}
              style={{
                opacity: !canUnlock || lockoutSeconds > 0 ? 0.5 : 1,
              }}
            >
              {loading ? (
                <span className="animate-pulse">Khol rahe hain…</span>
              ) : lockoutSeconds > 0 ? (
                <span>{lockoutSeconds}s wait karo</span>
              ) : canUnlock ? (
                <>
                  <LockIcon size={18} color="#FFFFFF" />
                  <span>Kholo Jaan</span>
                  <HeartIcon size={18} color="#FFFFFF" />
                </>
              ) : (
                <span>5 November tak ruko</span>
              )}
            </motion.button>
          </form>

          {/* Discreet Hint */}
          <div className="mt-1 text-center flex items-center justify-center gap-1.5 opacity-80">
            <HeartIcon size={14} color="var(--rose)" />
            <p
              className="text-sm text-charcoal/80 font-medium"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Hint: hamara pyara naam
            </p>
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  )
}
