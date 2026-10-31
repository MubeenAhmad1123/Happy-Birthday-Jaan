/**
 * Checks whether the content unlock date has passed.
 * Unlock date is read from UNLOCK_AT env var (ISO 8601).
 * If UNLOCK_NOW=true the check is bypassed (admin testing).
 */
export function isContentUnlocked(): boolean {
  if (process.env.UNLOCK_NOW === 'true') return true

  const unlockAt = process.env.UNLOCK_AT
  if (!unlockAt) return false

  const unlockDate = new Date(unlockAt)
  return Date.now() >= unlockDate.getTime()
}

export function getUnlockDate(): Date {
  const unlockAt = process.env.UNLOCK_AT
  if (!unlockAt) return new Date('2026-11-05T00:00:00+05:00')
  return new Date(unlockAt)
}

