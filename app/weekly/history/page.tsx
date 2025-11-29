'use client'
import Link from 'next/link'
import { Storage } from '@/lib/storage'

export default function WeeklyHistory() {
  const list = Storage.listWeekly().slice().reverse()
  return (
    <div className="section">
      <div className="section-title">Weekly Reflection History</div>
      <div className="mt-2 divide-y divide-warmgray-100">
        {list.map(w => (
          <Link key={w.id} href={`/weekly/${w.id}`} className="flex justify-between py-3">
            <span>{w.weekStart} → {w.weekEnd}</span>
            <span className="text-sm text-warmgray-600">avg {w.avgIntensity}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
