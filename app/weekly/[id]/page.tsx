'use client'
import { useParams, useRouter } from 'next/navigation'
import { Storage } from '@/lib/storage'

export default function WeeklyDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const w = Storage.getWeekly(id)
  if (!w) return <div className="section">Entry not found.</div>
  return (
    <div className="space-y-4">
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
