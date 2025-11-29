'use client'
import { useParams, useRouter } from 'next/navigation'
import { Storage } from '@/lib/storage'

export default function DailyDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const d = Storage.getDaily(id)
  if (!d) return <div className="section">Entry not found.</div>
  return (
    <div className="space-y-4">
      <div className="section">
        <div className="section-title">Daily Check-In • {d.date}</div>
        <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><dt className="text-warmgray-600">Afternoon snack</dt><dd className="font-medium">{d.afternoonSnack ? 'Yes' : 'No'}</dd></div>
          <div><dt className="text-warmgray-600">Craving intensity</dt><dd className="font-medium">{d.cravingIntensity}</dd></div>
          <div><dt className="text-warmgray-600">Stress level</dt><dd className="font-medium">{d.stressLevel}</dd></div>
          <div><dt className="text-warmgray-600">Reasons</dt><dd className="font-medium">{d.reasons.join(', ') || '-'}</dd></div>
          <div><dt className="text-warmgray-600">5-minute pause</dt><dd className="font-medium">{d.usedPause}</dd></div>
          <div><dt className="text-warmgray-600">What you ate</dt><dd className="font-medium">{d.whatAte || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">Felt afterward</dt><dd className="font-medium">{d.feelAfter}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">One good thing</dt><dd className="font-medium">{d.goodThing || '-'}</dd></div>
          <div className="md:col-span-2"><dt className="text-warmgray-600">One hard thing</dt><dd className="font-medium">{d.hardThing || '-'}</dd></div>
        </dl>
        <div className="mt-3"><button className="btn btn-ghost" onClick={()=>router.back()}>Back</button></div>
      </div>
    </div>
  )
}
