'use client'
import { DailyCheckIn, WeeklyReflection, Preferences } from './types'
import { uid } from './id'
import { todayISO } from './date'
import { createClient } from '@supabase/supabase-js'

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
  // Daily
  listDaily(): DailyCheckIn[] { return safeGet<DailyCheckIn[]>(DAILY_KEY, []).sort((a,b)=>a.date.localeCompare(b.date)) },
  getDaily(id: string): DailyCheckIn | undefined { return this.listDaily().find(d => d.id === id) },
  upsertDaily(input: Omit<DailyCheckIn,'id'|'createdAt'> & Partial<Pick<DailyCheckIn,'id'|'createdAt'>>): DailyCheckIn {
    const list = this.listDaily()
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
  todayDaily(): DailyCheckIn | undefined {
    const today = todayISO()
    return this.listDaily().find(d => d.date === today)
  },

  // Weekly
  listWeekly(): WeeklyReflection[] { return safeGet<WeeklyReflection[]>(WEEKLY_KEY, []).sort((a,b)=>a.weekStart.localeCompare(b.weekStart)) },
  getWeekly(id: string): WeeklyReflection | undefined { return this.listWeekly().find(d => d.id === id) },
  upsertWeekly(input: Omit<WeeklyReflection,'id'|'createdAt'> & Partial<Pick<WeeklyReflection,'id'|'createdAt'>>): WeeklyReflection {
    const list = this.listWeekly()
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

  // Preferences
  getPrefs(): Preferences { return safeGet<Preferences>(PREFS_KEY, { remindersEnabled: false, checkInHour: 15 }) },
  setPrefs(p: Preferences) { safeSet(PREFS_KEY, p) },

  // Export / Import
  exportAll(): string {
    const data = {
      daily: this.listDaily(),
      weekly: this.listWeekly(),
      prefs: this.getPrefs()
    }
    return JSON.stringify(data, null, 2)
  },
  importAll(json: string) {
    const data = JSON.parse(json)
    if (data.daily) safeSet(DAILY_KEY, data.daily)
    if (data.weekly) safeSet(WEEKLY_KEY, data.weekly)
    if (data.prefs) safeSet(PREFS_KEY, data.prefs)
  }
}
