'use client'
import { DailyCheckIn, WeeklyReflection, Preferences } from './types'
import { uid } from './id'
import { todayISO } from './date'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fallback to localStorage if not authenticated
const DAILY_KEY = 'ct_daily'
const WEEKLY_KEY = 'ct_weekly'
const PREFS_KEY = 'ct_prefs'

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export const Storage = {
  async listDaily(userId?: string): Promise<DailyCheckIn[]> {
    if (userId) {
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
      
      if (error || !data) return []
      return data.map(transformDailyFromDB)
    }
    return safeGet<DailyCheckIn[]>(DAILY_KEY, []).sort((a,b)=>a.date.localeCompare(b.date))
  },

  async getDaily(id: string, userId?: string): Promise<DailyCheckIn | undefined> {
    if (userId) {
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error || !data) return undefined
      return transformDailyFromDB(data)
    }
    const list = await this.listDaily()
    return list.find(d => d.id === id)
  },

  async upsertDaily(input: Omit<DailyCheckIn,'id'|'createdAt'> & Partial<Pick<DailyCheckIn,'id'|'createdAt'>>, userId?: string): Promise<DailyCheckIn> {
    if (userId) {
      const dbData = transformDailyToDB(input, userId)
      const { data, error } = await supabase
        .from('daily_checkins')
        .upsert(dbData, { onConflict: 'id' })
        .select()
        .single()
      
      if (error || !data) throw new Error('Failed to save')
      return transformDailyFromDB(data)
    }
    
    // Fallback to localStorage
    const list = await this.listDaily()
    let item: DailyCheckIn
    if (input.id) {
      item = { ...(input as DailyCheckIn), createdAt: input.createdAt ?? new Date().toISOString() }
      const idx = list.findIndex(d => d.id === input.id)
      if (idx >= 0) list[idx] = item
      else list.push(item)
    } else {
      item = { ...(input as DailyCheckIn), id: uid(), createdAt: new Date().toISOString() }
      list.push(item)
    }
    safeSet(DAILY_KEY, list)
    return item
  },

  async todayDaily(userId?: string): Promise<DailyCheckIn | undefined> {
    const today = todayISO()
    if (userId) {
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single()
      
      if (error || !data) return undefined
      return transformDailyFromDB(data)
    }
    const list = await this.listDaily()
    return list.find(d => d.date === today)
  },

  async listWeekly(userId?: string): Promise<WeeklyReflection[]> {
    if (userId) {
      const { data, error } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true })
      
      if (error || !data) return []
      return data.map(transformWeeklyFromDB)
    }
    return safeGet<WeeklyReflection[]>(WEEKLY_KEY, []).sort((a,b)=>a.weekStart.localeCompare(b.weekStart))
  },

  async getWeekly(id: string, userId?: string): Promise<WeeklyReflection | undefined> {
    if (userId) {
      const { data, error } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error || !data) return undefined
      return transformWeeklyFromDB(data)
    }
    const list = await this.listWeekly()
    return list.find(d => d.id === id)
  },

  async upsertWeekly(input: Omit<WeeklyReflection,'id'|'createdAt'> & Partial<Pick<WeeklyReflection,'id'|'createdAt'>>, userId?: string): Promise<WeeklyReflection> {
    if (userId) {
      const dbData = transformWeeklyToDB(input, userId)
      const { data, error } = await supabase
        .from('weekly_reflections')
        .upsert(dbData, { onConflict: 'id' })
        .select()
        .single()
      
      if (error || !data) throw new Error('Failed to save')
      return transformWeeklyFromDB(data)
    }
    
    // Fallback to localStorage
    const list = await this.listWeekly()
    let item: WeeklyReflection
    if (input.id) {
      item = { ...(input as WeeklyReflection), createdAt: input.createdAt ?? new Date().toISOString() }
      const idx = list.findIndex(d => d.id === input.id)
      if (idx >= 0) list[idx] = item
      else list.push(item)
    } else {
      item = { ...(input as WeeklyReflection), id: uid(), createdAt: new Date().toISOString() }
      list.push(item)
    }
    safeSet(WEEKLY_KEY, list)
    return item
  },

  async getPrefs(userId?: string): Promise<Preferences> {
    if (userId) {
      const { data, error } = await supabase
        .from('preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error || !data) {
        return { remindersEnabled: false, checkInHour: 15 }
      }
      return {
        name: data.name || undefined,
        remindersEnabled: data.reminders_enabled,
        checkInHour: data.check_in_hour
      }
    }
    return safeGet<Preferences>(PREFS_KEY, { remindersEnabled: false, checkInHour: 15 })
  },

  async setPrefs(p: Preferences, userId?: string): Promise<void> {
    if (userId) {
      const { error } = await supabase
        .from('preferences')
        .upsert({
          user_id: userId,
          name: p.name,
          reminders_enabled: p.remindersEnabled,
          check_in_hour: p.checkInHour,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw new Error('Failed to save preferences')
      return
    }
    safeSet(PREFS_KEY, p)
  },

  async exportAll(userId?: string): Promise<string> {
    const data = {
      daily: await this.listDaily(userId),
      weekly: await this.listWeekly(userId),
      prefs: await this.getPrefs(userId)
    }
    return JSON.stringify(data, null, 2)
  },

  async importAll(json: string, userId?: string): Promise<void> {
    const data = JSON.parse(json)
    if (data.daily) {
      for (const item of data.daily) {
        await this.upsertDaily(item, userId)
      }
    }
    if (data.weekly) {
      for (const item of data.weekly) {
        await this.upsertWeekly(item, userId)
      }
    }
    if (data.prefs) {
      await this.setPrefs(data.prefs, userId)
    }
  }
}

// Helper functions to transform between app format and DB format
function transformDailyToDB(input: any, userId: string) {
  return {
    id: input.id,
    user_id: userId,
    date: input.date,
    afternoon_snack: input.afternoonSnack,
    craving_intensity: input.cravingIntensity,
    stress_level: input.stressLevel,
    reasons: input.reasons,
    used_pause: input.usedPause,
    what_ate: input.whatAte || null,
    feel_after: input.feelAfter,
    good_thing: input.goodThing || null,
    hard_thing: input.hardThing || null,
    updated_at: new Date().toISOString()
  }
}

function transformDailyFromDB(data: any): DailyCheckIn {
  return {
    id: data.id,
    date: data.date,
    afternoonSnack: data.afternoon_snack,
    cravingIntensity: data.craving_intensity,
    stressLevel: data.stress_level,
    reasons: data.reasons,
    usedPause: data.used_pause,
    whatAte: data.what_ate || '',
    feelAfter: data.feel_after,
    goodThing: data.good_thing || '',
    hardThing: data.hard_thing || '',
    createdAt: data.created_at
  }
}

function transformWeeklyToDB(input: any, userId: string) {
  return {
    id: input.id,
    user_id: userId,
    week_start: input.weekStart,
    week_end: input.weekEnd,
    strong_cravings: input.strongCravings,
    avg_intensity: input.avgIntensity,
    common_emotion: input.commonEmotion,
    days_with_snack: input.daysWithSnack,
    wins: input.wins || null,
    challenges: input.challenges || null,
    insights: input.insights || null,
    adjustment: input.adjustment || null,
    updated_at: new Date().toISOString()
  }
}

function transformWeeklyFromDB(data: any): WeeklyReflection {
  return {
    id: data.id,
    weekStart: data.week_start,
    weekEnd: data.week_end,
    strongCravings: data.strong_cravings,
    avgIntensity: data.avg_intensity,
    commonEmotion: data.common_emotion,
    daysWithSnack: data.days_with_snack,
    wins: data.wins || '',
    challenges: data.challenges || '',
    insights: data.insights || '',
    adjustment: data.adjustment || '',
    createdAt: data.created_at
  }
}
