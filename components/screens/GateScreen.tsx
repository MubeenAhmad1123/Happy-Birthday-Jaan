'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────
interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface GateScreenProps {
  onUnlocked: () => void
  /** ISO 8601 string of unlock date, passed from server component */
  unlockAt: string
  /** If true, bypass date check (UNLOCK_NOW=true) */
  bypassDate: boolean
}

// ── Countdown hook ─────────────────────────────────────────────────
function useCountdown(unlockAt: string): { remaining: CountdownState; isUnlocked: boolean } {
  const target = new Date(unlockAt).getTime()

  function calc(): CountdownState {
    const diff = Math.max(0, target - Date.now())
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockAt])

  return { remaining, isUnlocked }
}

// ── Steam SVG ──────────────────────────────────────────────────────
function ChaiCup() {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Steam */}
      <div className="flex gap-2 mb-1 h-10">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="12"
            height="32"
            viewBox="0 0 12 32"
            className="steam-puff"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <path
              d="M6 30 Q10 22 6 16 Q2 10 6 2"
              stroke="#E56B8A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </svg>
        ))}
      </div>
      {/* Cup */}
      <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
        {/* Saucer */}
        <ellipse cx="45" cy="73" rx="38" ry="6" fill="#F9D5DE" opacity="0.6" />
        {/* Cup body */}
        <path
          d="M15 20 Q14 65 45 68 Q76 65 75 20 Z"
          fill="#FFF8F5"
          stroke="#E56B8A"
          strokeWidth="2.5"
        />
        {/* Tea */}
        <path
          d="M18 38 Q18 65 45 67 Q72 65 72 38 Z"
          fill="#F9D5DE"
          opacity="0.7"
        />
        {/* Handle */}
        <path
          d="M75 28 Q92 28 92 42 Q92 56 75 56"
          stroke="#E56B8A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Rim */}
        <ellipse cx="45" cy="20" rx="30" ry="5" fill="#FFF8F5" stroke="#E56B8A" strokeWidth="2" />
        {/* Highlight */}
        <ellipse cx="30" cy="50" rx="5" ry="10" fill="white" opacity="0.3" transform="rotate(-15 30 50)" />
      </svg>
    </div>
  )
}

// ── Countdown tile ─────────────────────────────────────────────────
function CountdownTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="sticker px-3 py-2 text-2xl font-bold min-w-[3rem] text-center"
        style={{ fontFamily: 'var(--font-baloo)', color: 'var(--deep-rose)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        className="text-xs mt-1"
        style={{ fontFamily: 'var(--font-baloo)', color: 'var(--rose)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ── Floating hearts ────────────────────────────────────────────────
function FloatingHearts() {
  const hearts = ['🤍', '💕', '✨', '🌸', '💗']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          className="floating-heart absolute text-lg"
          style={{
            left: `${10 + i * 18}%`,
            bottom: '10%',
            '--delay': `${i * 0.7}s`,
            '--r': `${(i - 2) * 10}deg`,
            animationDuration: `${2.5 + i * 0.4}s`,
          } as React.CSSProperties}
        >
          {h}
        </span>
      ))}
    </div>
  )
}

// ── Gate screen ────────────────────────────────────────────────────
export default function GateScreen({ onUnlocked, unlockAt, bypassDate }: GateScreenProps) {
  const { remaining, isUnlocked: dateUnlocked } = useCountdown(unlockAt)
  const canUnlock = bypassDate || dateUnlocked

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Lockout countdown
  useEffect(() => {
    if (lockoutSeconds <= 0) return
    const id = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) { clearInterval(id); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [lockoutSeconds])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
        setError(`Thoda ruko! ${data.retryAfter ?? 60}s baad try karo 🥺`)
        triggerShake()
      } else {
        setError('Hmm, phir se koshish karo 🥺')
        triggerShake()
        setPassword('')
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    } catch {
      setError('Connection error, retry karo')
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <div
      className="screen"
      style={{ background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)', minHeight: '100dvh' }}
    >
      <FloatingHearts />

      <motion.div
        className="flex flex-col items-center gap-6 px-6 w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Chai cup */}
        <ChaiCup />

        {/* Character placeholder */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{ background: 'rgba(249,213,222,0.5)' }}
          aria-label="Dudu-Bubu sticker placeholder"
        >
          🐼
        </div>

        {/* Heading */}
        <h1
          className="text-center text-3xl leading-snug"
          style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
        >
          Jaan, hamara secret word likho 🤍
        </h1>

        {/* Countdown — shown before unlock date */}
        <AnimatePresence>
          {!canUnlock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <p
                className="text-center text-lg"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--rose)' }}
              >
                Bas thora sa intezar… ✨
              </p>
              <div className="flex gap-3 justify-center">
                <CountdownTile value={remaining.days}    label="din" />
                <CountdownTile value={remaining.hours}   label="ghante" />
                <CountdownTile value={remaining.minutes} label="minute" />
                <CountdownTile value={remaining.seconds} label="second" />
              </div>
              <p
                className="text-center text-base opacity-70"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
              >
                5 November tak ruko, Jaan 🎂
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password form */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-4 w-full ${shake ? 'shake' : ''}`}
          noValidate
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              className="input-field"
              placeholder={canUnlock ? 'Secret word…' : 'Abhi nahi…'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!canUnlock || loading || lockoutSeconds > 0}
              autoComplete="off"
              maxLength={128}
              aria-label="Password"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-base"
                style={{ fontFamily: 'var(--font-caveat)', color: 'var(--deep-rose)' }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={!canUnlock || loading || lockoutSeconds > 0 || !password.trim()}
            whileTap={{ scale: 0.96 }}
            style={{
              opacity: (!canUnlock || lockoutSeconds > 0) ? 0.5 : 1,
            }}
          >
            {loading
              ? '…'
              : lockoutSeconds > 0
              ? `${lockoutSeconds}s`
              : canUnlock
              ? 'Kholo 🤍'
              : 'November 5 tak ruko'}
          </motion.button>
        </form>

        {/* Small hint */}
        <p
          className="text-center text-sm opacity-60"
          style={{ fontFamily: 'var(--font-caveat)', color: 'var(--charcoal)' }}
        >
          Hint: hamara pyara naam 🤍
        </p>
      </motion.div>
    </div>
  )
}

