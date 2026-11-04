import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { isContentUnlocked } from '@/lib/unlock'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Session check
  const hasSession = await verifySession(req)
  if (!hasSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Unlock check
  if (!isContentUnlocked()) {
    return NextResponse.json({ error: 'Not yet unlocked' }, { status: 403 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Normalize ID e.g. "1" -> "01", "01.webp" -> "01.webp"
  let cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '')
  if (/^\d$/.test(cleanId)) {
    cleanId = `0${cleanId}`
  }
  if (!cleanId.endsWith('.webp')) {
    cleanId = `${cleanId}.webp`
  }

  const photoPath = path.resolve(process.cwd(), 'assets-private', 'assets', 'photos', cleanId)

  try {
    const fileBuffer = await fs.readFile(photoPath)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'private, max-age=600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }
}

