import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/firebaseAdmin'
import { createSessionToken, setSessionCookie } from '@/lib/session'
import { checkRateLimit, recordFailedAttempt, resetAttempts } from '@/lib/rateLimit'
import { isContentUnlocked } from '@/lib/unlock'

// Force dynamic execution for API routes
export const dynamic = 'force-dynamic'

// Default fallback secret words if Firestore is not yet configured:
// "jaan", "sukoon", "bubu", "begum" (case-insensitive)
const DEFAULT_ALLOWED_WORDS = ['jaan', 'sukoon', 'bubu', 'begum', 'maria']

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)

  // 1. Rate limit check
  const rateCheck = await checkRateLimit(ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts', retryAfter: rateCheck.retryAfterSeconds },
      { status: 429 }
    )
  }

  // 2. Parse body
  let password = ''
  try {
    const body = await req.json()
    password = (body.password ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  if (!password || typeof password !== 'string' || password.length > 128) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
  }

  // 3. Password matching
  let match = false
  const db = getDb()

  if (db) {
    try {
      const gateDoc = await db.collection('config').doc('gate').get()
      if (gateDoc.exists) {
        const { passwordHash } = gateDoc.data()!
        if (passwordHash) {
          match = await bcrypt.compare(password, passwordHash)
        }
      }
    } catch (err) {
      console.warn('Firestore gate read failed, falling back to local verification:', err)
    }
  }

  // If no Firestore hash exists or comparison didn't match, check env / default words
  if (!match) {
    const envPassword = process.env.GATE_PASSWORD
    if (envPassword) {
      match = password.toLowerCase() === envPassword.toLowerCase()
    } else {
      match = DEFAULT_ALLOWED_WORDS.includes(password.toLowerCase())
    }
  }

  if (!match) {
    await recordFailedAttempt(ip)
    return NextResponse.json(
      { error: 'Wrong password', remaining: Math.max(0, rateCheck.remaining) },
      { status: 401 }
    )
  }

  // 4. Success -> Reset rate limit
  await resetAttempts(ip)

  // 5. Issue session cookie
  const token = await createSessionToken()
  const payload = { success: true, unlocked: isContentUnlocked() }

  const response = NextResponse.json(payload, { status: 200 })
  return setSessionCookie(response, token)
}
