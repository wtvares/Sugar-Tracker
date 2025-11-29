'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Storage } from '@/lib/storage'
import { CravingReason, FeelAfter, UsedPause } from '@/lib/types'
import { todayISO } from '@/lib/date'

const schema = z.object({
  date: z.string(),
  afternoonSnack: z.enum(['Yes','No']).transform(v => v === 'Yes'),
  cravingIntensity: z.coerce.number().min(0).max(10),
  stressLevel: z.coerce.number().min(0).max(10),
  reasons: z.array(z.string()).min(0),
  usedPause: z.enum(['Yes','No',"Didn't need to"]) as z.ZodType<UsedPause>,
  whatAte: z.string().max(200).optional().default(''),
  feelAfter: z.enum(['Relieved','Neutral','Guilty','Still craving','Calm','Other']) as z.ZodType<FeelAfter>,
  goodThing: z.string().max(300).optional().default(''),
  hardThing: z.string().max(300).optional().default('')
})

type FormData = z.infer<typeof schema>

const REASONS: CravingReason[] = ['Stress','Boredom','Emotional comfort','Hunger','Habit','Fatigue','Not sure']

export default function DailyNewPage() {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: todayISO(),
      afternoonSnack: 'No' as any,
      cravingIntensity: 0,
      stressLevel: 0,
      reasons: [],
      usedPause: 'No',
      feelAfter: 'Neutral'
    }
  })

  const onSubmit = (data: FormData) => {
    Storage.upsertDaily({
      id: undefined,
      date: data.date,
      afternoonSnack: data.afternoonSnack,
      cravingIntensity: data.cravingIntensity,
      stressLevel: data.stressLevel,
      reasons: data.reasons as CravingReason[],
      usedPause: data.usedPause,
      whatAte: data.whatAte ?? '',
      feelAfter: data.feelAfter,
      goodThing: data.goodThing ?? '',
      hardThing: data.hardThing ?? ''
    })
    router.push('/')
  }

  const toggleReason = (r: string) => {
    const current = new Set(watch('reasons') as string[])
    if (current.has(r)) {
      current.delete(r)
    } else {
      current.add(r)
    }
    const updated = Array.from(current) as string[]
    setValue('reasons', updated, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="section space-y-3">
        <div>
          <label className="label">Date</label>
          <input type="date" className="input" {...register('date')} />
        </div>
        <div>
          <label className="label">Afternoon snack eaten?</label>
          <select className="select" {...register('afternoonSnack')}>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div>
          <label className="label">Craving intensity (0–10)</label>
          <input type="range" min={0} max={10} className="w-full" {...register('cravingIntensity')} />
          <div className="text-sm text-warmgray-600">{watch('cravingIntensity')}</div>
        </div>
        <div>
          <label className="label">Stress level (0–10)</label>
          <input type="range" min={0} max={10} className="w-full" {...register('stressLevel')} />
          <div className="text-sm text-warmgray-600">{watch('stressLevel')}</div>
        </div>
        <div>
          <label className="label">Reason for craving</label>
          <div className="flex flex-wrap gap-2">
            {REASONS.map(r => (
              <button type="button" key={r} onClick={()=>toggleReason(r)} className={`badge ${watch('reasons').includes(r) ? 'bg-mint-200 text-mint-900' : ''}`}>{r}</button>
            ))}
          </div>
          {errors.reasons && <p className="text-red-600 text-sm mt-1">{String(errors.reasons.message)}</p>}
        </div>
        <div>
          <label className="label">Did you use the 5-minute pause?</label>
          <select className="select" {...register('usedPause')}>
            <option>Yes</option>
            <option>No</option>
            <option>Didn't need to</option>
          </select>
        </div>
        <div>
          <label className="label">What did you eat?</label>
          <input className="input" placeholder="e.g., apple, cookies, yogurt" {...register('whatAte')} />
        </div>
        <div>
          <label className="label">How did you feel afterward?</label>
          <select className="select" {...register('feelAfter')}>
            {['Relieved','Neutral','Guilty','Still craving','Calm','Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">One good thing today</label>
          <textarea className="textarea" rows={2} placeholder="Celebrate a small win" {...register('goodThing')} />
        </div>
        <div>
          <label className="label">One hard thing today</label>
          <textarea className="textarea" rows={2} placeholder="Name a challenge without judgment" {...register('hardThing')} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">Save Daily Check-In</button>
          <button className="btn btn-ghost" type="button" onClick={()=>history.back()}>Cancel</button>
        </div>
      </div>
    </form>
  )
}
