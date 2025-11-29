'use client'
import Link from 'next/link'
import { Storage } from '@/lib/storage'
import { formatNice } from '@/lib/date'

export default function DailyHistory() {
  const list = Storage.listDaily().slice().reverse()
  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section">
        <div className="section-title">Daily History</div>
        {list.length === 0 ? (
          <div className="empty-state py-12">
            <p className="text-warmgray-500 mb-4">No check-ins yet</p>
            <Link href="/daily/new" className="btn btn-primary">Start Your First Check-In</Link>
          </div>
        ) : (
          <div className="mt-2 divide-y divide-warmgray-100">
            {list.map(d => (
              <Link 
                key={d.id} 
                href={`/daily/${d.id}`} 
                className="flex justify-between items-center py-4 hover:bg-warmgray-50 -mx-2 px-2 rounded-lg transition-colors duration-150"
              >
                <div className="flex-1">
                  <div className="font-medium text-warmgray-900">{formatNice(d.date)}</div>
                  <div className="text-sm text-warmgray-600 mt-1">
                    {d.reasons.length > 0 ? d.reasons.join(', ') : 'No reasons noted'}
                  </div>
                  {d.whatAte && (
                    <div className="text-xs text-warmgray-500 mt-1">Ate: {d.whatAte}</div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xs text-warmgray-500">Intensity</div>
                      <div className="text-lg font-bold text-lavender-700">{d.cravingIntensity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-warmgray-500">Stress</div>
                      <div className="text-lg font-bold text-mint-700">{d.stressLevel}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
