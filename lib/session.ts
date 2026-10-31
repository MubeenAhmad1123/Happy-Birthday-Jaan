import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'bday_session'
const SESSION_TTL_HOURS = 12

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET
  if (!raw) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(raw)
}

/** Create a signed session cookie payload */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  const token = await new SignJWT({ unlocked: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(secret)
  return token
}

/** Set the httpOnly session cookie on a Response object */
export function setSessionCookie(response: Response, token: string): Response {
  const maxAge = SESSION_TTL_HOURS * 60 * 60
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`
  )
  return response
}

/** Verify the session cookie from a Request; returns true if valid */
export async function verifySession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

/** Check session from server component (uses next/headers) */
export async function getSessionFromCookies(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

