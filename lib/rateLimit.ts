import { getDb } from './firebaseAdmin'
import { createHash } from 'crypto'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60
const COLLECTION = 'rateLimit'

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + 'bday-salt').digest('hex').slice(0, 32)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

// In-memory fallback if Firestore is not configured
interface MemoryRecord {
  attempts: number
  windowStart: number
  lockedUntil: number
}
const memoryStore = new Map<string, MemoryRecord>()

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = hashIP(ip)
  const db = getDb()
  const now = Date.now()

  if (db) {
    try {
      const docRef = db.collection(COLLECTION).doc(key)
      const doc = await docRef.get()

      if (!doc.exists) {
        return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
      }

      const data = doc.data()!
      const lockedUntil: number = data.lockedUntil ?? 0
      const attempts: number = data.attempts ?? 0
      const windowStart: number = data.windowStart ?? now

      if (lockedUntil > now) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000),
        }
      }

      if (now - windowStart > 2 * 60 * 1000) {
        await docRef.set({ attempts: 1, windowStart: now, lockedUntil: 0 })
        return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
      }

      if (attempts >= MAX_ATTEMPTS) {
        const lockedUntilNew = now + LOCKOUT_SECONDS * 1000
        await docRef.update({ lockedUntil: lockedUntilNew })
        return { allowed: false, remaining: 0, retryAfterSeconds: LOCKOUT_SECONDS }
      }

      return { allowed: true, remaining: MAX_ATTEMPTS - attempts - 1 }
    } catch (err) {
      console.warn('Firestore rate limit error, using in-memory store:', err)
    }
  }

  // In-memory fallback
  const record = memoryStore.get(key)
  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  if (record.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    }
  }

  if (now - record.windowStart > 2 * 60 * 1000) {
    memoryStore.set(key, { attempts: 1, windowStart: now, lockedUntil: 0 })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_SECONDS * 1000
    return { allowed: false, remaining: 0, retryAfterSeconds: LOCKOUT_SECONDS }
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.attempts - 1 }
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  const key = hashIP(ip)
  const db = getDb()
  const now = Date.now()

  if (db) {
    try {
      const docRef = db.collection(COLLECTION).doc(key)
      const doc = await docRef.get()
      if (!doc.exists) {
        await docRef.set({ attempts: 1, windowStart: now, lockedUntil: 0 })
        return
      }

      const data = doc.data()!
      const newAttempts = (data.attempts ?? 0) + 1
      const update: Record<string, unknown> = { attempts: newAttempts }

      if (newAttempts >= MAX_ATTEMPTS) {
        update.lockedUntil = now + LOCKOUT_SECONDS * 1000
      }

      await docRef.update(update)
      return
    } catch (err) {
      console.warn('Firestore failed attempt update error:', err)
    }
  }

  // Memory fallback
  const record = memoryStore.get(key)
  if (!record) {
    memoryStore.set(key, { attempts: 1, windowStart: now, lockedUntil: 0 })
    return
  }

  record.attempts += 1
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_SECONDS * 1000
  }
}

export async function resetAttempts(ip: string): Promise<void> {
  const key = hashIP(ip)
  const db = getDb()

  if (db) {
    try {
      await db.collection(COLLECTION).doc(key).delete()
    } catch (err) {
      console.warn('Firestore reset attempts error:', err)
    }
  }
  memoryStore.delete(key)
}
