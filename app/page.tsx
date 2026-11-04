import { getSessionFromCookies } from '@/lib/session'
import { getUnlockDate } from '@/lib/unlock'
import StoryApp from '@/components/StoryApp'

export const metadata = {
  title: 'Happy Birthday Maria 🤍',
  description: 'A little birthday story for Maria',
  robots: { index: false, follow: false },
}

export default async function Home() {
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
