import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { isContentUnlocked } from '@/lib/unlock'
import { getDb, getStorageBucket } from '@/lib/firebaseAdmin'
import { DEFAULT_CONTENT } from '@/lib/contentData'

export const dynamic = 'force-dynamic'

/** Generate short-lived signed URL (10 min) for private Storage files */
async function signedUrl(filePath: string): Promise<string> {
  const storage = getStorageBucket()
  if (!storage) return filePath // fallback directly to public path

  try {
    const bucket = storage.bucket()
    const file = bucket.file(filePath)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 10 * 60 * 1000,
    })
    return url
  } catch (err) {
    console.warn(`Failed to sign URL for ${filePath}:`, err)
    return filePath
  }
}

export async function GET(req: NextRequest) {
  // 1. Session verification - required to access any content
  const hasSession = await verifySession(req)
  if (!hasSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  if (db) {
    try {
      const [contentDoc, reasonsSnap, timelineSnap] = await Promise.all([
        db.collection('config').doc('content').get(),
        db.collection('reasons').orderBy('order').get(),
        db.collection('timeline').orderBy('order').get(),
      ])

      if (contentDoc.exists) {
        const content = contentDoc.data() ?? {}

        const rawReasons = reasonsSnap.empty
          ? DEFAULT_CONTENT.reasons
          : reasonsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))

        const reasons = await Promise.all(
          rawReasons.map(async (r: any) => {
            let pUrl = r.photoUrl || ''
            if (pUrl && !pUrl.startsWith('http') && !pUrl.startsWith('/')) {
              pUrl = await signedUrl(pUrl)
            }
            if (!pUrl && (r.order || r.id)) {
              const num = parseInt(String(r.order || r.id), 10)
              if (!isNaN(num) && num >= 1 && num <= 25) {
                pUrl = `/api/photos/${String(num).padStart(2, '0')}`
              }
            }
            return {
              ...r,
              photoUrl: pUrl,
            }
          })
        )

        const timeline = timelineSnap.empty
          ? DEFAULT_CONTENT.timeline
          : timelineSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))

        const photosRaw: Array<{ path?: string; url?: string; caption: string }> =
          content.photos ?? []

        const photos = await Promise.all(
          photosRaw.map(async (p) => {
            const pathOrUrl = p.path || p.url || ''
            if (pathOrUrl.startsWith('http') || pathOrUrl.startsWith('/')) {
              return { url: pathOrUrl, caption: p.caption }
            }
            return {
              url: await signedUrl(pathOrUrl),
              caption: p.caption,
            }
          })
        )

        let songUrl = '/api/audio'
        if (content.songPath) {
          songUrl = await signedUrl(content.songPath)
        } else if (content.songUrl) {
          songUrl = content.songUrl
        }

        return NextResponse.json({
          letter: content.letter ?? DEFAULT_CONTENT.letter,
          finalMessage: content.finalMessage ?? DEFAULT_CONTENT.finalMessage,
          gateHint: content.gateHint ?? DEFAULT_CONTENT.gateHint,
          songTitle: content.songTitle ?? DEFAULT_CONTENT.songTitle,
          songUrl,
          bubuLines: content.bubuLines ?? DEFAULT_CONTENT.bubuLines,
          reasons: reasons && reasons.length >= 25 ? reasons : DEFAULT_CONTENT.reasons,
          timeline,
          photos: photos.length >= 25 ? photos : DEFAULT_CONTENT.photos,
        })
      }
    } catch (err) {
      console.warn('Error fetching Firestore content, falling back to defaults:', err)
    }
  }

  // Default seeded content (works offline, locally, or before Firestore seed)
  return NextResponse.json(DEFAULT_CONTENT)
}
