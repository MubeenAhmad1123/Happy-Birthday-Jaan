import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { isContentUnlocked } from '@/lib/unlock'
import { promises as fs, createReadStream, statSync, existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Session verification
  const hasSession = await verifySession(req)
  if (!hasSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Unlock date guard
  if (!isContentUnlocked()) {
    return NextResponse.json({ error: 'Not yet unlocked' }, { status: 403 })
  }

  // Path to private audio file
  const audioPath = path.resolve(process.cwd(), 'assets-private', 'audio', 'our-song.mp3')

  if (!existsSync(audioPath)) {
    const isDev = process.env.NODE_ENV !== 'production'
    return NextResponse.json(
      {
        error: isDev
          ? 'Song file nahi mila. Place our-song.mp3 in /assets-private/audio/'
          : 'Audio currently unavailable',
      },
      { status: 404 }
    )
  }

  try {
    const stat = statSync(audioPath)
    const fileSize = stat.size
    const range = req.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      const fileHandle = await fs.open(audioPath, 'r')
      const buffer = Buffer.alloc(chunkSize)
      await fileHandle.read(buffer, 0, chunkSize, start)
      await fileHandle.close()

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'private, no-cache',
        },
      })
    } else {
      const fileBuffer = await fs.readFile(audioPath)
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Length': String(fileSize),
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
        },
      })
    }
  } catch (err) {
    console.error('Audio stream error:', err)
    return NextResponse.json({ error: 'Failed to read audio' }, { status: 500 })
  }
}

