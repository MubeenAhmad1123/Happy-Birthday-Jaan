import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/firebaseAdmin'
import { DEFAULT_CONTENT } from '@/lib/contentData'

export const dynamic = 'force-dynamic'

const ADMIN_COOKIE = 'bday_admin'

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET || 'dev-secret-replace-before-deploy-32bytes'
  return new TextEncoder().encode(raw)
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

// GET /api/admin - Fetch content & reasons for admin panel
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  if (db) {
    try {
      const [contentDoc, reasonsSnap] = await Promise.all([
        db.collection('config').doc('content').get(),
        db.collection('reasons').orderBy('order').get(),
      ])

      const content = contentDoc.exists ? contentDoc.data() : {}
      const reasons = !reasonsSnap.empty
        ? reasonsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        : DEFAULT_CONTENT.reasons

      return NextResponse.json({
        letter: content?.letter ?? DEFAULT_CONTENT.letter,
        finalMessage: content?.finalMessage ?? DEFAULT_CONTENT.finalMessage,
        unlockNow: content?.unlockNow ?? true,
        reasons,
      })
    } catch (err) {
      console.warn('Error reading admin content from Firestore:', err)
    }
  }

  return NextResponse.json({
    letter: DEFAULT_CONTENT.letter,
    finalMessage: DEFAULT_CONTENT.finalMessage,
    unlockNow: true,
    reasons: DEFAULT_CONTENT.reasons,
  })
}

// POST /api/admin - Login or Update Actions
export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { action, password, newGatePassword, letter, finalMessage, unlockNow, reasons } = body

  // 1. Admin Login
  if (action === 'login') {
    const adminPass = process.env.ADMIN_PASSWORD || 'admin-dev-password'
    if (password !== adminPass) {
      return NextResponse.json({ error: 'Galat admin password!' }, { status: 401 })
    }

    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(getSecret())

    const res = NextResponse.json({ success: true })
    res.headers.append(
      'Set-Cookie',
      `${ADMIN_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`
    )
    return res
  }

  // 2. All other actions require admin session
  const isAdmin = await verifyAdmin(req)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  // Change Gate Password
  if (action === 'changeGatePassword') {
    if (!newGatePassword || typeof newGatePassword !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
    const hash = await bcrypt.hash(newGatePassword, 12)
    if (db) {
      try {
        await db.collection('config').doc('gate').set({ passwordHash: hash }, { merge: true })
      } catch (err) {
        console.warn('Firestore update error:', err)
      }
    }
    return NextResponse.json({ success: true, message: 'Gate password updated successfully!' })
  }

  // Update Letter or Final Message
  if (action === 'updateContent') {
    if (db) {
      try {
        const updateData: any = {}
        if (letter !== undefined) updateData.letter = letter
        if (finalMessage !== undefined) updateData.finalMessage = finalMessage
        if (unlockNow !== undefined) updateData.unlockNow = unlockNow
        await db.collection('config').doc('content').set(updateData, { merge: true })
      } catch (err) {
        console.warn('Firestore content update error:', err)
      }
    }
    return NextResponse.json({ success: true, message: 'Content saved!' })
  }

  // Update 25 Reasons & photo assignments
  if (action === 'updateReasons') {
    if (Array.isArray(reasons) && db) {
      try {
        const batch = db.batch()
        for (const item of reasons) {
          const ref = db.collection('reasons').doc(String(item.id || item.order))
          batch.set(
            ref,
            {
              order: item.order,
              text: item.text,
              photoUrl: item.photoUrl || '',
            },
            { merge: true }
          )
        }
        await batch.commit()
      } catch (err) {
        console.warn('Firestore reasons batch update error:', err)
      }
    }
    return NextResponse.json({ success: true, message: 'Reasons & photos saved successfully!' })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
