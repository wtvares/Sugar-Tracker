'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Storage } from '@/lib/storage'
import { startOfWeek, endOfWeek, toISO } from '@/lib/date'

const schema = z.object({
  weekStart: z.string(),
  weekEnd: z.string(),
  strongCravings: z.coerce.number().min(0),
  avgIntensity: z.coerce.number().min(0).max(10),
  commonEmotion: z.string().max(50),
  daysWithSnack: z.coerce.number().min(0).max(7),
  wins: z.string().max(1000).optional().default(''),
  challenges: z.string().max(1000).optional().default(''),
  insights: z.string().max(1000).optional().default(''),
  adjustment: z.string().max(1000).optional().default('')
})

type FormData = z.infer<typeof schema>

export default function WeeklyNewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const defaultStart = toISO(startOfWeek())
  const defaultEnd = toISO(endOfWeek())

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      weekStart: defaultStart,
      weekEnd: defaultEnd,
      strongCravings: 0,
      avgIntensity: 0,
      commonEmotion: 'Neutral',
      daysWithSnack: 0
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      await Storage.upsertWeekly({
        id: undefined,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        strongCravings: data.strongCravings,
        avgIntensity: data.avgIntensity,
        commonEmotion: data.commonEmotion,
        daysWithSnack: data.daysWithSnack,
        wins: data.wins ?? '',
        challenges: data.challenges ?? '',
        insights: data.insights ?? '',
        adjustment: data.adjustment ?? ''
      }, session?.user?.id)
      router.push('/')
    } catch (error) {
      alert('Failed to save. Please try again.')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24 md:pb-8">
      <div className="section space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Week start</label>
            <input type="date" className="input" {...register('weekStart')} />
          </div>
          <div>
            <label className="label">Week end</label>
            <input type="date" className="input" {...register('weekEnd')} />
          </div>
        </div>
        <div>
          <label className="label">Number of strong cravings</label>
          <input type="number" className="input" min={0} {...register('strongCravings')} />
        </div>
        <div>
          <label className="label">Average craving intensity (0–10)</label>
          <input type="number" className="input" min={0} max={10} step={0.1} {...register('avgIntensity')} />
        </div>
        <div>
          <label className="label">Most common emotion</label>
          <select className="select" {...register('commonEmotion')}>
            {['Calm','Content','Neutral','Stressed','Anxious','Sad','Irritable','Tired','Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Days with afternoon snack (0–7)</label>
          <input type="number" className="input" min={0} max={7} {...register('daysWithSnack')} />
        </div>
        <div>
          <label className="label">Weekly wins</label>
          <textarea className="textarea" rows={3} placeholder="What went well?" {...register('wins')} />
        </div>
        <div>
          <label className="label">Challenges</label>
          <textarea className="textarea" rows={3} placeholder="What was tough?" {...register('challenges')} />
        </div>
        <div>
          <label className="label">Insights</label>
          <textarea className="textarea" rows={3} placeholder="What did you notice?" {...register('insights')} />
        </div>
        <div>
          <label className="label">Adjustment for next week</label>
          <textarea className="textarea" rows={3} placeholder="A gentle plan or experiment" {...register('adjustment')} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Weekly Reflection'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={()=>router.back()}>Cancel</button>
        </div>
      </div>
    </form>
  )
}
