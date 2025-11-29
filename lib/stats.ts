import { DailyCheckIn } from './types'

export function computeStreak(dailies: DailyCheckIn[]): number {
  if (!dailies.length) return 0
  const dates = new Set(dailies.map(d => d.date))
  let streak = 0
  let cursor = new Date()
  while (dates.has(cursor.toISOString().slice(0,10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function lastNDays(dailies: DailyCheckIn[], n: number) {
  const map = new Map<string, DailyCheckIn>()
  dailies.forEach(d => map.set(d.date, d))
  const labels: string[] = []
  const intensity: number[] = []
  const stress: number[] = []
  const snack: number[] = []

  const today = new Date()
  for (let i=n-1; i>=0; i--) {
    const dt = new Date(today)
    dt.setDate(today.getDate()-i)
    const iso = dt.toISOString().slice(0,10)
    labels.push(iso)
    const item = map.get(iso)
    intensity.push(item?.cravingIntensity ?? 0)
    stress.push(item?.stressLevel ?? 0)
    snack.push(item?.afternoonSnack ? 1 : 0)
  }
  return { labels, intensity, stress, snack }
}

export function reasonsDistribution(dailies: DailyCheckIn[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const d of dailies) {
    for (const r of d.reasons) counts[r] = (counts[r] || 0) + 1
  }
  return counts
}

export function feelingsDistribution(dailies: DailyCheckIn[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const d of dailies) counts[d.feelAfter] = (counts[d.feelAfter] || 0) + 1
  return counts
}
