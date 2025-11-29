'use client'
import Link from 'next/link'

export default function WeeklyHome() {
  return (
    <div className="section">
      <div className="section-title">Weekly Reflections</div>
      <div className="mt-2 flex gap-2">
        <Link href="/weekly/new" className="btn btn-secondary">New Reflection</Link>
        <Link href="/weekly/history" className="btn btn-ghost">View History</Link>
      </div>
    </div>
  )
}
