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

  // Valid slug check: accepts SITE_SLUG from env or default fallback
  const validSlug = process.env.SITE_SLUG || 'qw3rty7uioplkjhgfds12345'
  if (slug !== validSlug) {
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

