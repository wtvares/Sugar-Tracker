'use client'
import Link from 'next/link'
import { Storage } from '@/lib/storage'

export default function DailyHistory() {
  const list = Storage.listDaily().slice().reverse()
  return (
    <div className="section">
      <div className="section-title">Daily History</div>
      <div className="mt-2 divide-y divide-warmgray-100">
        {list.map(d => (
          <Link key={d.id} href={`/daily/${d.id}`} className="flex justify-between py-3">
            <span>{d.date}</span>
            <span className="text-sm text-warmgray-600">int {d.cravingIntensity} / stress {d.stressLevel}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
