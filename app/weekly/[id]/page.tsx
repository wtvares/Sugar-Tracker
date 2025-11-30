'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Storage } from '@/lib/storage'
import type { WeeklyReflection } from '@/lib/types'

export default function WeeklyDetail() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const id = params?.id as string
  const [w, setW] = useState<WeeklyReflection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await Storage.getWeekly(id, session?.user?.id)
        setW(data || null)
      } catch (error) {
        setW(null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, session?.user?.id])

  if (loading) {
    return (
      <div className="section pb-24 md:pb-8">
        <div className="empty-state">Loading...</div>
      </div>
    )
  }

  if (!w) {
    return (
      <div className="section pb-24 md:pb-8">
        <div className="empty-state">
          <p className="text-warmgray-500 mb-4">Entry not found.</p>
          <button className="btn btn-primary" onClick={() => router.back()}>Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section">
        <div className="section-title">Weekly Reflection • {w.weekStart} → {w.weekEnd}</div>
        <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><dt className="text-warmgray-600">Strong cravings</dt><dd className="font-medium">{w.strongCravings}</dd></div>
          <div><dt className="text-warmgray-600">Average intensity</dt><dd className="font-medium">{w.avgIntensity}</dd></div>
          <div><dt className="text-warmgray-600">Most common emotion</dt><dd className="font-medium">{w.commonEmotion}</dd></div>
          <div><dt className="text-warmgray-600">Days with snack</dt><dd className="font-medium">{w.daysWithSnack}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">Wins</dt><dd className="font-medium whitespace-pre-line">{w.wins || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">Challenges</dt><dd className="font-medium whitespace-pre-line">{w.challenges || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">Insights</dt><dd className="font-medium whitespace-pre-line">{w.insights || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">Adjustment</dt><dd className="font-medium whitespace-pre-line">{w.adjustment || '-'}</dd></div>
        </dl>
        <div className="mt-3"><button className="btn btn-ghost" onClick={()=>router.back()}>Back</button></div>
      </div>
    </div>
  )
}
