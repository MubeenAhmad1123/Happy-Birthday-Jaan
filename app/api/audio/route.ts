import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { isContentUnlocked } from '@/lib/unlock'
import { promises as fs, createReadStream, statSync, existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Session verification - only authenticated visitors can stream the private song
  const hasSession = await verifySession(req)
  if (!hasSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Look for our-song.mp3 across candidate directories
  const candidatePaths = [
    path.resolve(process.cwd(), 'assets-private', 'audio', 'our-song.mp3'),
    path.resolve(process.cwd(), 'assets-private', 'our-song.mp3'),
    path.resolve(process.cwd(), 'public', 'audio', 'our-song.mp3'),
    path.resolve(process.cwd(), 'birthday-site', 'assets-private', 'audio', 'our-song.mp3'),
    path.resolve(process.cwd(), 'birthday-site', 'assets-private', 'our-song.mp3'),
    path.join(__dirname, '..', '..', '..', '..', 'assets-private', 'audio', 'our-song.mp3'),
    path.join(__dirname, '..', '..', '..', '..', 'assets-private', 'our-song.mp3'),
    path.join(__dirname, '..', '..', '..', '..', '..', 'assets-private', 'our-song.mp3'),
  ]

  let audioPath: string | null = null
  for (const p of candidatePaths) {
    if (existsSync(/* turbopackIgnore: true */ p)) {
      audioPath = p
      break
    }
  }

  if (!audioPath) {
    const isDev = process.env.NODE_ENV !== 'production'
    return NextResponse.json(
      {
        error: isDev
          ? 'Song file nahi mila. Place our-song.mp3 in /assets-private/'
          : 'Audio currently unavailable',
      },
      { status: 404 }
    )
  }

  try {
    const stat = statSync(/* turbopackIgnore: true */ audioPath)
    const fileSize = stat.size
    const range = req.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      const fileHandle = await fs.open(/* turbopackIgnore: true */ audioPath, 'r')
      const buffer = Buffer.alloc(chunkSize)
      await fileHandle.read(buffer, 0, chunkSize, start)
      await fileHandle.close()

      return new NextResponse(new Uint8Array(buffer), {
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
      const fileBuffer = await fs.readFile(/* turbopackIgnore: true */ audioPath)
      return new NextResponse(new Uint8Array(fileBuffer), {
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

