'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatCard from '@/components/StatCard'
import { Storage } from '@/lib/storage'
import { lastNDays, computeStreak, reasonsDistribution, feelingsDistribution } from '@/lib/stats'
import { LineChart, PieChart, BarChart } from '@/components/Charts'
import { formatNice } from '@/lib/date'

export default function Page() {
  const { data: session } = useSession()
  const [dailies, setDailies] = useState<any[]>([])
  const [today, setToday] = useState<any>(null)
  const [weekly, setWeekly] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (session?.user?.id) {
        const [dailyList, todayData, weeklyList] = await Promise.all([
          Storage.listDaily(session.user.id),
          Storage.todayDaily(session.user.id),
          Storage.listWeekly(session.user.id)
        ])
        setDailies(dailyList)
        setToday(todayData)
        setWeekly(weeklyList)
      } else {
        // Fallback to localStorage - these are now async too, but can work without await for initial load
        // For better UX, you might want to make these async as well
        try {
          const dailyList = await Storage.listDaily()
          const todayData = await Storage.todayDaily()
          const weeklyList = await Storage.listWeekly()
          setDailies(dailyList)
          setToday(todayData)
          setWeekly(weeklyList)
        } catch {
          // If async fails, set empty arrays
          setDailies([])
          setToday(null)
          setWeekly([])
        }
      }
    }
    loadData()
  }, [session])

  const summary7 = lastNDays(dailies, 7)
  const streak = computeStreak(dailies)

  const reasons = reasonsDistribution(dailies)
  const feelings = feelingsDistribution(dailies)

  const avg = (arr: number[]) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : '0'

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="section bg-gradient-to-br from-lavender-50 to-mint-50 border-lavender-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-warmgray-600 mb-1">Today</div>
            <div className="text-2xl font-bold text-lavender-800">
              {today ? '✓ Check-in complete' : 'No check-in yet'}
            </div>
            {today && (
              <div className="text-sm text-warmgray-600 mt-1">
                Intensity: {today.cravingIntensity} / Stress: {today.stressLevel}
              </div>
            )}
          </div>
          <Link href="/daily/new" className="btn btn-primary whitespace-nowrap">
            {today ? 'Edit Today' : 'Start Daily Check-In'}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="7-day avg intensity" value={avg(summary7.intensity)} />
        <StatCard title="7-day avg stress" value={avg(summary7.stress)} />
        <StatCard title="Snack days (7d)" value={summary7.snack.reduce((a,b)=>a+b,0)} />
        <StatCard title="Streak" value={streak} hint="consecutive days with check-ins" />
      </div>

      {/* Charts */}
      <div className="grid gap-5">
        <LineChart labels={summary7.labels} data={summary7.intensity} label="Craving intensity" />
        <LineChart labels={summary7.labels} data={summary7.stress} label="Stress level" />
        <BarChart labels={summary7.labels} data={summary7.snack} label="Afternoon snack (1=yes)" />
        {Object.keys(reasons).length > 0 && (
          <PieChart labels={Object.keys(reasons)} data={Object.values(reasons)} />
        )}
        {Object.keys(feelings).length > 0 && (
          <PieChart labels={Object.keys(feelings)} data={Object.values(feelings)} />
        )}
      </div>

      {/* History Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="section">
          <div className="section-title">Daily History</div>
          <div className="mt-2 space-y-1">
            {dailies.slice().reverse().slice(0,5).map(d => (
              <Link 
                key={d.id} 
                href={`/daily/${d.id}`} 
                className="flex justify-between items-center py-2.5 px-2 rounded-lg hover:bg-warmgray-50 transition-colors duration-150 border-b border-warmgray-100 last:border-0"
              >
                <div>
                  <div className="font-medium text-warmgray-900">{formatNice(d.date)}</div>
                  <div className="text-xs text-warmgray-500 mt-0.5">
                    {d.reasons.length > 0 ? d.reasons.slice(0, 2).join(', ') : 'No reasons noted'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-lavender-700">Int: {d.cravingIntensity}</div>
                  <div className="text-xs text-warmgray-500">Stress: {d.stressLevel}</div>
                </div>
              </Link>
            ))}
            {dailies.length === 0 && (
              <div className="empty-state py-6">No check-ins yet</div>
            )}
            {dailies.length > 0 && (
              <div className="mt-3 pt-2">
                <Link className="text-sm font-medium text-lavender-700 hover:text-lavender-800 hover:underline" href="/daily/history">
                  View all ({dailies.length})
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="section">
          <div className="section-title">Weekly Reflections</div>
          <div className="mt-2 space-y-1">
            {Storage.listWeekly().slice().reverse().slice(0,5).map(w => (
              <Link 
                key={w.id} 
                href={`/weekly/${w.id}`} 
                className="flex justify-between items-center py-2.5 px-2 rounded-lg hover:bg-warmgray-50 transition-colors duration-150 border-b border-warmgray-100 last:border-0"
              >
                <div>
                  <div className="font-medium text-warmgray-900">
                    {formatNice(w.weekStart)} → {formatNice(w.weekEnd)}
                  </div>
                  <div className="text-xs text-warmgray-500 mt-0.5">
                    {w.strongCravings} strong cravings
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-mint-700">Avg: {w.avgIntensity}</div>
                  <div className="text-xs text-warmgray-500">{w.daysWithSnack}/7 snack days</div>
                </div>
              </Link>
            ))}
            {Storage.listWeekly().length === 0 && (
              <div className="empty-state py-6">No reflections yet</div>
            )}
            {Storage.listWeekly().length > 0 && (
              <div className="mt-3 pt-2">
                <Link className="text-sm font-medium text-lavender-700 hover:text-lavender-800 hover:underline" href="/weekly/history">
                  View all ({Storage.listWeekly().length})
                </Link>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/weekly/new" className="btn btn-secondary flex-1">New Weekly Reflection</Link>
            <Link href="/weekly/history" className="btn btn-ghost">View all</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
