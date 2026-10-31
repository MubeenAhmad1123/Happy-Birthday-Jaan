import { notFound } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/session'
import { getUnlockDate } from '@/lib/unlock'
import StoryApp from '@/components/StoryApp'

interface Props {
  params: Promise<{ slug: string }>
}

export const metadata = {
  title: 'A little something',
  robots: { index: false, follow: false },
}

export default async function GatePage({ params }: Props) {
  const { slug } = await params

  // Only the correct slug is valid — everything else is a 404
  if (slug !== process.env.SITE_SLUG) {
    notFound()
  }

  // Check if already authenticated
  const hasSession = await getSessionFromCookies()
  const unlockAt = getUnlockDate().toISOString()
  const bypassDate = process.env.UNLOCK_NOW === 'true'

  return (
    <StoryApp
      initiallyUnlocked={hasSession}
      unlockAt={unlockAt}
      bypassDate={bypassDate}
    />
  )
}

