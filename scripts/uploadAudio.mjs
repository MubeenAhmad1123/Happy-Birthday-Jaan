/**
 * Upload our-song.mp3 from assets-private/audio/ to Firebase Storage under audio/our-song.mp3
 *
 * Usage:
 *   node scripts/uploadAudio.mjs
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { existsSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import nextEnv from '@next/env'
const { loadEnvConfig } = nextEnv

const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnvConfig(resolve(__dirname, '..'))

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase credentials in .env.local')
  process.exit(1)
}

const audioFile = resolve(__dirname, '../assets-private/audio/our-song.mp3')

if (!existsSync(audioFile)) {
  console.error('\n⚠️ Missing audio file!')
  console.error('Please place your song file at:')
  console.error(`  ${audioFile}`)
  console.error('\nExpected name: our-song.mp3\n')
  process.exit(1)
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  })
}

const storage = getStorage()
const bucket = storage.bucket(storageBucket)
const stat = statSync(audioFile)

console.log(`Connecting to bucket: ${bucket.name}...`)
console.log(`Uploading our-song.mp3 (${(stat.size / (1024 * 1024)).toFixed(2)} MB)...`)

try {
  await bucket.upload(audioFile, {
    destination: 'audio/our-song.mp3',
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=86400',
    },
  })
  console.log(`✅ Uploaded successfully -> gs://${bucket.name}/audio/our-song.mp3`)
} catch (err) {
  console.error(`❌ Failed to upload audio:`, err.message)
}
