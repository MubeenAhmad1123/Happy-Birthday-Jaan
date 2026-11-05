import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { isContentUnlocked } from '@/lib/unlock'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// High-speed in-memory buffer cache to eliminate disk I/O on repeat requests
const photoCache = new Map<string, Buffer>()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Session check - protects Maria's private photos so only authenticated visitors with session cookie can view
  const hasSession = await verifySession(req)
  if (!hasSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Normalize ID e.g. "1" -> "01.webp", "01" -> "01.webp", "01.webp" -> "01.webp"
  let cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '')
  if (/^\d$/.test(cleanId)) {
    cleanId = `0${cleanId}`
  }
  if (!cleanId.endsWith('.webp')) {
    cleanId = `${cleanId}.webp`
  }

  // 1. Fast in-memory cache hit
  let fileBuffer = photoCache.get(cleanId) || null

  if (!fileBuffer) {
    // Look for photo across possible execution root directories
    const candidatePaths = [
      path.resolve(process.cwd(), 'assets-private', 'assets', 'photos', cleanId),
      path.resolve(process.cwd(), 'birthday-site', 'assets-private', 'assets', 'photos', cleanId),
      path.join(__dirname, '..', '..', '..', '..', 'assets-private', 'assets', 'photos', cleanId),
      path.join(__dirname, '..', '..', '..', '..', '..', 'assets-private', 'assets', 'photos', cleanId),
      path.resolve(process.cwd(), '.next', 'server', 'assets-private', 'assets', 'photos', cleanId),
    ]

    for (const p of candidatePaths) {
      try {
        const buf = await fs.readFile(/* turbopackIgnore: true */ p)
        if (buf && buf.length > 0) {
          fileBuffer = buf
          photoCache.set(cleanId, buf)
          break
        }
      } catch {
        // try next candidate
      }
    }
  }

  if (fileBuffer) {
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    })
  }

  return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
}

