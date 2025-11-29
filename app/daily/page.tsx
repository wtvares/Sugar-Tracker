'use client'
import Link from 'next/link'
import { Storage } from '@/lib/storage'

export default function DailyHome() {
  const today = Storage.todayDaily()
  return (
    <div className="space-y-4">
      <div className="section">
        <div className="section-title">Daily Check-Ins</div>
        <div className="mt-2 flex gap-2">
          <Link href="/daily/new" className="btn btn-primary">Start Today</Link>
          <Link href="/daily/history" className="btn btn-ghost">View History</Link>
        </div>
      </div>
      {today && (
        <div className="section">You already checked in today. You can edit from history.</div>
      )}
    </div>
  )
}
