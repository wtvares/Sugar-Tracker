'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Storage } from '@/lib/storage'
import { formatNice } from '@/lib/date'

export default function DailyDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const d = Storage.getDaily(id)
  
  if (!d) {
    return (
      <div className="section pb-24 md:pb-8">
        <div className="empty-state">
          <p className="text-warmgray-500 mb-4">Entry not found.</p>
          <Link href="/daily/history" className="btn btn-primary">Back to History</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="section-title mb-1">Daily Check-In</div>
            <div className="text-sm text-warmgray-600">{formatNice(d.date)}</div>
          </div>
          <Link href={`/daily/new?edit=${id}`} className="btn btn-ghost text-xs">
            Edit
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-lavender-50 rounded-lg p-3 border border-lavender-100">
            <div className="text-xs font-medium text-lavender-600 mb-1">Craving Intensity</div>
            <div className="text-2xl font-bold text-lavender-700">{d.cravingIntensity}/10</div>
          </div>
          <div className="bg-mint-50 rounded-lg p-3 border border-mint-100">
            <div className="text-xs font-medium text-mint-600 mb-1">Stress Level</div>
            <div className="text-2xl font-bold text-mint-700">{d.stressLevel}/10</div>
          </div>
        </div>

        <dl className="space-y-4">
          <div className="pb-4 border-b border-warmgray-100">
            <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">Afternoon Snack</dt>
            <dd className="text-base font-medium text-warmgray-900">{d.afternoonSnack ? 'Yes' : 'No'}</dd>
          </div>
          
          <div className="pb-4 border-b border-warmgray-100">
            <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">Reasons for Craving</dt>
            <dd className="flex flex-wrap gap-2 mt-2">
              {d.reasons.length > 0 ? (
                d.reasons.map(r => (
                  <span key={r} className="badge">{r}</span>
                ))
              ) : (
                <span className="text-warmgray-500">None noted</span>
              )}
            </dd>
          </div>
          
          <div className="pb-4 border-b border-warmgray-100">
            <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">5-Minute Pause</dt>
            <dd className="text-base font-medium text-warmgray-900">{d.usedPause}</dd>
          </div>
          
          {d.whatAte && (
            <div className="pb-4 border-b border-warmgray-100">
              <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">What You Ate</dt>
              <dd className="text-base text-warmgray-900">{d.whatAte}</dd>
            </div>
          )}
          
          <div className="pb-4 border-b border-warmgray-100">
            <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">Felt Afterward</dt>
            <dd className="text-base font-medium text-warmgray-900">{d.feelAfter}</dd>
          </div>
          
          {d.goodThing && (
            <div className="pb-4 border-b border-warmgray-100">
              <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">One Good Thing</dt>
              <dd className="text-base text-warmgray-900 leading-relaxed">{d.goodThing}</dd>
            </div>
          )}
          
          {d.hardThing && (
            <div>
              <dt className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-1">One Hard Thing</dt>
              <dd className="text-base text-warmgray-900 leading-relaxed">{d.hardThing}</dd>
            </div>
          )}
        </dl>
        
        <div className="mt-6 flex gap-2">
          <button className="btn btn-ghost" onClick={()=>router.back()}>Back</button>
          <Link href="/daily/history" className="btn btn-primary">View All History</Link>
        </div>
      </div>
    </div>
  )
}
