'use client'

/**
 * lib/audioPlayer.ts
 * ONE shared HTMLAudioElement for the entire story.
 * - Created lazily on first use
 * - Plays only inside user tap handler (wrapped in try/catch)
 * - Auto-refetches /api/content on 403 / expired signed URL and retries once
 * - Persists playback state seamlessly across all screens
 */

type AudioSubscriber = (state: {
  isPlaying: boolean
  currentTime: number
  duration: number
  progress: number
}) => void

let sharedAudio: HTMLAudioElement | null = null
let currentSongUrl = ''
let isCurrentlyPlaying = false
let hasRetriedAfter403 = false
const subscribers: Set<AudioSubscriber> = new Set()

function notifySubscribers() {
  const currentTime = sharedAudio?.currentTime || 0
  const duration = sharedAudio?.duration || 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const state = {
    isPlaying: isCurrentlyPlaying,
    currentTime,
    duration,
    progress,
  }

  subscribers.forEach((sub) => {
    try {
      sub(state)
    } catch {
      // ignore
    }
  })
}

export function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null

  if (!sharedAudio) {
    sharedAudio = new Audio()
    sharedAudio.preload = 'auto'
    ;(sharedAudio as any).playsInline = true
    sharedAudio.setAttribute('playsinline', 'true')

    sharedAudio.addEventListener('play', () => {
      isCurrentlyPlaying = true
      notifySubscribers()
    })

    sharedAudio.addEventListener('pause', () => {
      isCurrentlyPlaying = false
      notifySubscribers()
    })

    sharedAudio.addEventListener('ended', () => {
      isCurrentlyPlaying = false
      notifySubscribers()
    })

    sharedAudio.addEventListener('timeupdate', () => {
      notifySubscribers()
    })

    sharedAudio.addEventListener('error', async () => {
      console.warn('Audio player encountered error, checking URL...')
      if (!hasRetriedAfter403) {
        hasRetriedAfter403 = true
        try {
          const res = await fetch('/api/content')
          if (res.ok) {
            const data = await res.json()
            if (data?.songUrl) {
              setSongSource(data.songUrl)
              if (isCurrentlyPlaying) {
                await startSong(data.songUrl)
              }
            }
          }
        } catch (err) {
          console.warn('Audio URL refresh failed:', err)
        }
      }
    })
  }

  return sharedAudio
}

export function setSongSource(url: string) {
  if (!url) return
  currentSongUrl = url
  const audio = getAudioElement()
  if (audio && audio.src !== url) {
    audio.src = url
  }
}

export async function startSong(customUrl?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const audio = getAudioElement()
    if (!audio) return false

    if (customUrl && audio.src !== customUrl) {
      currentSongUrl = customUrl
      audio.src = customUrl
    } else if (!audio.src && currentSongUrl) {
      audio.src = currentSongUrl
    } else if (!audio.src) {
      // Default to /api/audio if not set yet
      audio.src = '/api/audio'
    }

    await audio.play()
    isCurrentlyPlaying = true
    notifySubscribers()
    return true
  } catch (err) {
    console.warn('Audio startSong blocked or failed:', err)
    isCurrentlyPlaying = false
    notifySubscribers()
    return false
  }
}

export function pauseSong(): void {
  const audio = getAudioElement()
  if (audio) {
    try {
      audio.pause()
    } catch {
      // ignore
    }
  }
  isCurrentlyPlaying = false
  notifySubscribers()
}

export async function toggleSong(): Promise<boolean> {
  if (isCurrentlyPlaying) {
    pauseSong()
    return false
  } else {
    return await startSong()
  }
}

export function isPlaying(): boolean {
  return isCurrentlyPlaying
}

export function subscribeAudioState(subscriber: AudioSubscriber): () => void {
  subscribers.add(subscriber)
  // Immediate initial call
  notifySubscribers()
  return () => {
    subscribers.delete(subscriber)
  }
}
