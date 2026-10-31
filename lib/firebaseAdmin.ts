import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

let isConfigured = false
let firestoreInstance: Firestore | null = null
let storageInstance: Storage | null = null

export function isFirebaseReady(): boolean {
  if (isConfigured) return true

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (
    !projectId ||
    !clientEmail ||
    !privateKey ||
    projectId === 'your-project-id' ||
    privateKey.includes('PLACEHOLDER')
  ) {
    return false
  }

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
        databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
      })
    }
    isConfigured = true
    return true
  } catch (err) {
    console.warn('Firebase init deferred/failed:', err)
    return false
  }
}

export function getDb(): Firestore | null {
  if (!isFirebaseReady()) return null
  if (!firestoreInstance) {
    firestoreInstance = getFirestore()
  }
  return firestoreInstance
}

export function getStorageBucket(): Storage | null {
  if (!isFirebaseReady()) return null
  if (!storageInstance) {
    storageInstance = getStorage()
  }
  return storageInstance
}

// Proxies for backward compatibility
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = getDb()
    if (!instance) {
      throw new Error(
        'Firestore is not available. Please configure FIREBASE_* environment variables in .env.local.'
      )
    }
    const val = (instance as any)[prop]
    return typeof val === 'function' ? val.bind(instance) : val
  },
})

export const storage = new Proxy({} as Storage, {
  get(_target, prop) {
    const instance = getStorageBucket()
    if (!instance) {
      throw new Error(
        'Firebase Storage is not available. Please configure FIREBASE_* environment variables in .env.local.'
      )
    }
    const val = (instance as any)[prop]
    return typeof val === 'function' ? val.bind(instance) : val
  },
})
