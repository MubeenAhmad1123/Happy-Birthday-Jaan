/**
 * Firestore seed script — run once to set up the database.
 *
 * Usage:
 *   1. Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path, OR
 *      set FIREBASE_* env vars as in .env.local
 *   2. node scripts/seedFirestore.mjs <password>
 *
 * e.g.  node scripts/seedFirestore.mjs "hamari-jaan"
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import nextEnv from '@next/env'

const { loadEnvConfig } = nextEnv
const __dirname = dirname(fileURLToPath(import.meta.url))
loadEnvConfig(resolve(__dirname, '..'))

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/seedFirestore.mjs <password>')
  process.exit(1)
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

const hash = await bcrypt.hash(password, 12)
console.log('Password hash created:', hash.slice(0, 20) + '…')

// ── config/gate ────────────────────────────────────────────────────
await db.collection('config').doc('gate').set({ passwordHash: hash })
console.log('✅ config/gate set')

// ── config/content ─────────────────────────────────────────────────
await db.collection('config').doc('content').set({
  gateHint: 'Hint: hamara pyara naam 🤍',
  letter: `Meri pyari Jaan,

Aaj tumhara din hai aur main chahta tha ke tum jaano ke tum meri zindagi mein kitni roshni laye ho. Tumhara hasna, tumhari baatein, sab kuch… yaadon mein mehek jaata hai.

Bohot lambi kahani hai, aur hum saath likhte rahenge.

Tumhara,
Ganda Bachha 🤍`,
  finalMessage: 'Maria, meri Jaan, 25 saal mubarak ho. Tum bohot khush rehna, bohot muskurana. Tumhara Ganda Bachha hamesha tumhare saath hai, inshallah. 🤍',
  songPath: 'audio/our-song.mp3',
  songTitle: 'Dil Ibadat Kar Raha Hai',
  photos: [
    { path: 'photos/photo-01.jpg', caption: 'Hamari pehli yaad 🤍' },
    { path: 'photos/photo-02.jpg', caption: 'Aur yeh bhi… 🌸' },
  ],
})
console.log('✅ config/content set')

// ── reasons ────────────────────────────────────────────────────────
const reasons = [
  { text: 'Tumhari smile meri har thaki hui shaam ka sukoon hai.', photoUrl: '/api/photos/01' },
  { text: 'Tum ho to chai bhi zyada meethi lagti hai ☕', photoUrl: '/api/photos/02' },
  { text: 'Tumne mujhe himmat di, Begum.', photoUrl: '/api/photos/03' },
  { text: 'Tumhari hansi meri favourite awaaz hai.', photoUrl: '/api/photos/04' },
  { text: 'Tum saath ho to ghar jaisa lagta hai.', photoUrl: '/api/photos/05' },
  { text: 'Tum mujhe behtar insaan banati ho.', photoUrl: '/api/photos/06' },
  { text: 'Tumhare saath khamoshi bhi pyari lagti hai.', photoUrl: '/api/photos/07' },
  { text: 'Tum meri Zindagi ho, aur mere dil ka Sukoon.', photoUrl: '/api/photos/08' },
  { text: 'Tumhari baatein sunna meri favourite aadat ban chuki hai.', photoUrl: '/api/photos/09' },
  { text: 'Tumhara gussa bhi bohot cute hota hai 🥺', photoUrl: '/api/photos/10' },
  { text: 'Tum mere har chote baday dukh ko bhula deti ho.', photoUrl: '/api/photos/11' },
  { text: 'Tumhari masoomiyat dil jeet leti hai.', photoUrl: '/api/photos/12' },
  { text: 'Jab tum "Ganda Bachha" kehti ho, dil pighal jaata hai.', photoUrl: '/api/photos/13' },
  { text: 'Lambi calls mein jab tum so jaati ho, woh lamha anmol hota hai.', photoUrl: '/api/photos/14' },
  { text: 'Tum meri har dua mein shamil rehti ho.', photoUrl: '/api/photos/15' },
  { text: 'Tumhara care karna mujhe hamesha mehfooz feel karata hai.', photoUrl: '/api/photos/16' },
  { text: 'Tumhara favourite colour white hai, aur tum khud noor jaisi ho 🤍', photoUrl: '/api/photos/17' },
  { text: 'Tumhare baghair sab kuch adhoora lagta hai.', photoUrl: '/api/photos/18' },
  { text: 'Tum mere khwabon ko apni umeed bana leti ho.', photoUrl: '/api/photos/19' },
  { text: 'Tumhari har choti baat mere liye maayne rakhti hai.', photoUrl: '/api/photos/20' },
  { text: 'Tum meri sab se achi dost aur meri Begum ho.', photoUrl: '/api/photos/21' },
  { text: 'Tumhare saath waqt kitni jaldi guzar jata hai pata hi nahi chalta.', photoUrl: '/api/photos/22' },
  { text: 'Tum meri aankhon mein khushi dekhna chahti ho.', photoUrl: '/api/photos/23' },
  { text: 'Tum meri taqat aur meri kamzori dono ho.', photoUrl: '/api/photos/24' },
  { text: 'Kyunkay Maria, tum jaisi poori dunya mein koi nahi hai 🤍', photoUrl: '/api/photos/25' },
]

const batch = db.batch()
// Delete old reasons
const existing = await db.collection('reasons').get()
existing.docs.forEach((d) => batch.delete(d.ref))
reasons.forEach((r, i) => {
  const ref = db.collection('reasons').doc(`reason-${String(i + 1).padStart(2, '0')}`)
  batch.set(ref, { text: r.text, photoUrl: r.photoUrl, order: i + 1 })
})
await batch.commit()
console.log('✅ 25 reasons seeded')

// ── timeline ───────────────────────────────────────────────────────
const timeline = [
  { date: '8 Sept',  text: 'Pehli mulaqat. Mujhe nahi pata tha ke meri zindagi badalne wali hai.', icon: '🌟', character: 'dudu-bubu-box' },
  { date: 'Nashta',  text: 'Subah subah meetha chawal, chane aur naan. Aur Rehan bhi saath tha 😄', icon: '🍚', character: 'dudu-bubu-nashta' },
  { date: 'Chai',    text: 'Tumhare liye chai lana meri favourite aadat ban gayi ☕', icon: '☕', character: 'dudu-bubu-chai' },
  { date: 'IT room', text: 'Saath baith ke baatein, hansi, aur bohot saari yaadein.', icon: '💻', character: 'dudu-bubu-hug' },
  { date: 'Calls',   text: 'Lambi calls, lambi video calls… neend bhi baad mein.', icon: '📱', character: 'dudu-bubu-hug' },
  { date: '25 Sept', text: 'Tum chali gayi, magar dil wahin reh gaya.', icon: '🌧️', character: 'bubu-sad' },
  { date: '15 Oct',  text: 'Us din tumne mujhe bohot special mehsoos karaya.', icon: '💌', character: 'dudu-bubu-hug' },
  { date: '5 Nov',   text: 'Aaj tumhara din hai, meri Jaan.', icon: '🎂', character: 'dudu-bubu-bday' },
]

const batch2 = db.batch()
const existingTL = await db.collection('timeline').get()
existingTL.docs.forEach((d) => batch2.delete(d.ref))
timeline.forEach((item, i) => {
  const ref = db.collection('timeline').doc(`tl-${String(i + 1).padStart(2, '0')}`)
  batch2.set(ref, { ...item, order: i + 1 })
})
await batch2.commit()
console.log('✅ Timeline seeded')

console.log('\n🎉 Firestore seeded! Set your .env.local and run the app.')

