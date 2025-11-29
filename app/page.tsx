'use client'
import Link from 'next/link'
import StatCard from '@/components/StatCard'
import { Storage } from '@/lib/storage'
import { lastNDays, computeStreak, reasonsDistribution, feelingsDistribution } from '@/lib/stats'
import { LineChart, PieChart, BarChart } from '@/components/Charts'

export default function Page() {
  const dailies = Storage.listDaily()
  const today = Storage.todayDaily()
  const summary7 = lastNDays(dailies, 7)
  const streak = computeStreak(dailies)

  const reasons = reasonsDistribution(dailies)
  const feelings = feelingsDistribution(dailies)

  const avg = (arr: number[]) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : '0'

  return (
    <div className="space-y-4">
      <div className="section flex items-center justify-between">
        <div>
          <div className="text-sm text-warmgray-600">Today</div>
          <div className="text-lg font-semibold">{today ? 'Check-in complete' : 'No check-in yet'}</div>
        </div>
        <Link href="/daily/new" className="btn btn-primary">Start Daily Check-In</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="7-day avg intensity" value={avg(summary7.intensity)} />
        <StatCard title="7-day avg stress" value={avg(summary7.stress)} />
        <StatCard title="Snack days (7d)" value={summary7.snack.reduce((a,b)=>a+b,0)} />
        <StatCard title="Streak" value={streak} hint="consecutive days with check-ins" />
      </div>

      <div className="grid gap-4">
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

      <div className="grid md:grid-cols-2 gap-3">
        <div className="section">
          <div className="section-title">Daily History</div>
          <div className="mt-2">
            {dailies.slice().reverse().slice(0,5).map(d => (
              <Link key={d.id} href={`/daily/${d.id}`} className="flex justify-between py-2 border-b border-warmgray-100 last:border-0">
                <span>{d.date}</span>
                <span className="text-sm text-warmgray-600">int {d.cravingIntensity} / stress {d.stressLevel}</span>
              </Link>
            ))}
            <div className="mt-2"><Link className="text-sm text-lavender-700 hover:underline" href="/daily/history">View all</Link></div>
          </div>
        </div>
        <div className="section">
          <div className="section-title">Weekly Reflections</div>
          <div className="mt-2">
            {Storage.listWeekly().slice().reverse().slice(0,5).map(w => (
              <Link key={w.id} href={`/weekly/${w.id}`} className="flex justify-between py-2 border-b border-warmgray-100 last:border-0">
                <span>{w.weekStart} → {w.weekEnd}</span>
                <span className="text-sm text-warmgray-600">avg {w.avgIntensity}</span>
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/weekly/new" className="btn btn-secondary">New Weekly Reflection</Link>
              <Link href="/weekly/history" className="btn btn-ghost">View all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
