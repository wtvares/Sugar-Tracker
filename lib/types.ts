export type CravingReason = 'Stress' | 'Boredom' | 'Emotional comfort' | 'Hunger' | 'Habit' | 'Fatigue' | 'Not sure'

export type FeelAfter = 'Relieved' | 'Neutral' | 'Guilty' | 'Still craving' | 'Calm' | 'Other'

export type UsedPause = 'Yes' | 'No' | "Didn't need to"

export interface DailyCheckIn {
  id: string
  date: string // YYYY-MM-DD
  afternoonSnack: boolean
  cravingIntensity: number
  stressLevel: number
  reasons: CravingReason[]
  usedPause: UsedPause
  whatAte: string
  feelAfter: FeelAfter
  goodThing: string
  hardThing: string
  createdAt: string
}

export interface WeeklyReflection {
  id: string
  weekStart: string // YYYY-MM-DD (Mon)
  weekEnd: string   // YYYY-MM-DD (Sun)
  strongCravings: number
  avgIntensity: number
  commonEmotion: string
  daysWithSnack: number
  wins: string
  challenges: string
  insights: string
  adjustment: string
  createdAt: string
}

export interface Preferences {
  name?: string
  remindersEnabled: boolean
  checkInHour: number // 0-23
}
