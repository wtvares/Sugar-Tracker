'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Storage } from '@/lib/storage'
import type { DailyCheckIn } from '@/lib/types'

export default function DailyHome() {
  const { data: session } = useSession()
  const [today, setToday] = useState<DailyCheckIn | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await Storage.todayDaily(session?.user?.id)
        setToday(data || null)
      } catch (error) {
        setToday(null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [session?.user?.id])

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section">
        <div className="section-title">Daily Check-Ins</div>
        <div className="mt-2 flex gap-2">
          <Link href="/daily/new" className="btn btn-primary">Start Today</Link>
          <Link href="/daily/history" className="btn btn-ghost">View History</Link>
        </div>
      </div>
      {!loading && today && (
        <div className="section">You already checked in today. You can edit from history.</div>
      )}
    </div>
  )
}
