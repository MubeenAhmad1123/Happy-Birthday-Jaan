'use client'

/**
 * lib/feedback.ts
 * Subtle WebAudio sound feedback (pop, softChime) and haptic vibration (buzz).
 * - Lazy AudioContext on first tap
 * - iOS Safari safe (silent vibration fallback, unlocked context)
 * - Mute toggle support (mutes sound effects only, NOT the song)
 * - Sound throttling (1 per 80ms, max 3 overlapping)
 * - Page visibility aware (silenced when tab hidden)
 */

let audioCtx: AudioContext | null = null
let isAudioUnlocked = false
let isMuted = false
let lastSoundTime = 0
let activeSoundsCount = 0

type SoundListener = (muted: boolean) => void
const soundListeners: Set<SoundListener> = new Set()

export function getMuteState(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('maria_sound_muted')
    if (saved !== null) {
      isMuted = saved === 'true'
    }
  }
  return isMuted
}

export function setMuteState(muted: boolean): void {
  isMuted = muted
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('maria_sound_muted', String(muted))
    } catch {
      // ignore
    }
  }
  soundListeners.forEach((listener) => listener(isMuted))
}

export function toggleMuteState(): boolean {
  const next = !isMuted
  setMuteState(next)
  return next
}

export function subscribeMuteState(listener: SoundListener): () => void {
  soundListeners.add(listener)
  listener(isMuted)
  return () => {
    soundListeners.delete(listener)
  }
}

/**
 * Lazily creates or resumes the WebAudio AudioContext on the first user interaction.
 */
export function unlockAudio(): void {
  if (typeof window === 'undefined') return
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    isAudioUnlocked = true
  } catch (err) {
    // silent failure if not supported
  }
}

function canPlaySound(): boolean {
  if (typeof window === 'undefined') return false
  if (isMuted) return false
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false
  if (!isAudioUnlocked || !audioCtx) return false

  const now = performance.now()
  if (now - lastSoundTime < 80) return false
  if (activeSoundsCount >= 3) return false

  lastSoundTime = now
  return true
}

/**
 * pop(): a soft pop made with WebAudio:
 * sine oscillator 520Hz -> 220Hz over 90ms with gain envelope (0.0001 -> 0.18 -> 0.0001),
 * plus a tiny 1200Hz "sparkle" tick at 30ms.
 */
export function pop(): void {
  if (!canPlaySound() || !audioCtx) return

  try {
    const ctx = audioCtx
    const now = ctx.currentTime
    activeSoundsCount++

    // Main downward pitch glide oscillator
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.09)

    // Gain envelope: 0.0001 -> 0.18 -> 0.0001
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.095)

    // Tiny 1200Hz sparkle tick at 30ms
    const sparkleOsc = ctx.createOscillator()
    const sparkleGain = ctx.createGain()

    sparkleOsc.type = 'sine'
    sparkleOsc.frequency.setValueAtTime(1200, now + 0.03)

    sparkleGain.gain.setValueAtTime(0.0001, now + 0.03)
    sparkleGain.gain.exponentialRampToValueAtTime(0.04, now + 0.035)
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)

    sparkleOsc.connect(sparkleGain)
    sparkleGain.connect(ctx.destination)

    sparkleOsc.start(now + 0.03)
    sparkleOsc.stop(now + 0.06)

    osc.onended = () => {
      activeSoundsCount = Math.max(0, activeSoundsCount - 1)
    }
  } catch {
    activeSoundsCount = Math.max(0, activeSoundsCount - 1)
  }
}

/**
 * softChime(): two quick sine notes (784Hz then 1047Hz, 120ms each, gain 0.08)
 * for the candle wish and Bubu talking taps.
 */
export function softChime(): void {
  if (!canPlaySound() || !audioCtx) return

  try {
    const ctx = audioCtx
    const now = ctx.currentTime
    activeSoundsCount++

    // Note 1: G5 (784Hz) for 120ms
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(784, now)
    gain1.gain.setValueAtTime(0.0001, now)
    gain1.gain.exponentialRampToValueAtTime(0.08, now + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.125)

    // Note 2: C6 (1047Hz) for 120ms starting at now + 0.09s
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1047, now + 0.09)
    gain2.gain.setValueAtTime(0.0001, now + 0.09)
    gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.11)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.09)
    osc2.stop(now + 0.225)

    osc2.onended = () => {
      activeSoundsCount = Math.max(0, activeSoundsCount - 1)
    }
  } catch {
    activeSoundsCount = Math.max(0, activeSoundsCount - 1)
  }
}

/**
 * buzz(ms = 15): Haptic feedback
 * - Uses navigator.vibrate in try/catch
 * - Silently no-ops on iOS Safari
 * - Skips when prefers-reduced-motion is enabled
 */
export function buzz(ms = 15): void {
  if (typeof window === 'undefined') return
  try {
    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms)
    }
  } catch {
    // Silent fail on unsupported platforms
  }
}

