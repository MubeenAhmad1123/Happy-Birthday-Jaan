/**
 * Upload all WebP photos from assets-private/assets/photos to Firebase Storage under photos/
 *
 * Usage:
 *   node scripts/uploadPhotos.mjs
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { existsSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
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
  console.error('Missing Firebase credentials in .env.local')
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

const photosDir = resolve(__dirname, '../assets-private/assets/photos')

if (!existsSync(photosDir)) {
  console.error('Photos dir not found:', photosDir)
  process.exit(1)
}

console.log(`Connecting to bucket: ${bucket.name}...`)

const files = readdirSync(photosDir).filter((f) => f.endsWith('.webp'))
files.sort()

console.log(`Found ${files.length} WebP photos to upload.`)

let uploadedCount = 0
for (const file of files) {
  const localPath = join(photosDir, file)
  const destPath = `photos/${file}`
  const stat = statSync(localPath)

  try {
    await bucket.upload(localPath, {
      destination: destPath,
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=86400',
      },
    })
    console.log(`✅ Uploaded ${file} (${(stat.size / 1024).toFixed(1)} KB) -> gs://${bucket.name}/${destPath}`)
    uploadedCount++
  } catch (err) {
    console.error(`❌ Failed to upload ${file}:`, err.message)
  }
}

console.log(`\nFinished: ${uploadedCount}/${files.length} photos uploaded.`)
