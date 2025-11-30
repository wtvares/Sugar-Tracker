'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Storage } from '@/lib/storage'
import type { WeeklyReflection } from '@/lib/types'

export default function WeeklyHistory() {
  const { data: session } = useSession()
  const [list, setList] = useState<WeeklyReflection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await Storage.listWeekly(session?.user?.id)
        setList(data.slice().reverse())
      } catch (error) {
        setList([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [session?.user?.id])

  if (loading) {
    return (
      <div className="section pb-24 md:pb-8">
        <div className="empty-state">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section">
        <div className="section-title">Weekly Reflection History</div>
        {list.length === 0 ? (
          <div className="empty-state py-12">
            <p className="text-warmgray-500 mb-4">No reflections yet</p>
            <Link href="/weekly/new" className="btn btn-primary">Create Your First Reflection</Link>
          </div>
        ) : (
          <div className="mt-2 divide-y divide-warmgray-100">
            {list.map(w => (
              <Link key={w.id} href={`/weekly/${w.id}`} className="flex justify-between py-3 hover:bg-warmgray-50 -mx-2 px-2 rounded-lg transition-colors duration-150">
                <span>{w.weekStart} → {w.weekEnd}</span>
                <span className="text-sm text-warmgray-600">avg {w.avgIntensity}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
