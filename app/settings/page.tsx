'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Storage } from '@/lib/storage'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  const [checkInHour, setCheckInHour] = useState(15)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const prefs = await Storage.getPrefs(session?.user?.id)
        setRemindersEnabled(prefs.remindersEnabled)
        setCheckInHour(prefs.checkInHour)
        setName(prefs.name || '')
      } catch (error) {
        console.error('Failed to load preferences', error)
      } finally {
        setLoading(false)
      }
    }
    loadPrefs()
  }, [session?.user?.id])

  const save = async () => {
    try {
      await Storage.setPrefs({ remindersEnabled, checkInHour, name }, session?.user?.id)
      if (remindersEnabled && typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission()
      }
      alert('Preferences saved')
    } catch (error) {
      alert('Failed to save preferences. Please try again.')
      console.error(error)
    }
  }

  const exportData = async () => {
    try {
      const data = await Storage.exportAll(session?.user?.id)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cravings_data.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export data. Please try again.')
      console.error(error)
    }
  }

  const importData = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await Storage.importAll(reader.result as string, session?.user?.id)
        alert('Import complete. Refresh the page to see updates.')
        // Reload preferences
        const prefs = await Storage.getPrefs(session?.user?.id)
        setRemindersEnabled(prefs.remindersEnabled)
        setCheckInHour(prefs.checkInHour)
        setName(prefs.name || '')
      } catch (error) {
        alert('Invalid file or failed to import. Please try again.')
        console.error(error)
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="space-y-4 pb-24 md:pb-8">
        <div className="section">
          <div className="empty-state">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <div className="section space-y-3">
        <div className="section-title">Preferences</div>
        <div>
          <label className="label">Your name (optional)</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Helps personalize messages" />
        </div>
        <div>
          <label className="label">Daily check-in reminder</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={remindersEnabled} onChange={e=>setRemindersEnabled(e.target.checked)} /> Enable reminders</label>
            <select className="select max-w-[120px]" value={checkInHour} onChange={e=>setCheckInHour(parseInt(e.target.value))}>
              {Array.from({length:24}, (_,i)=>i).map(h => <option key={h} value={h}>{h.toString().padStart(2,'0')}:00</option>)}
            </select>
          </div>
          <p className="text-xs text-warmgray-600 mt-1">Browser notifications require permission and may only fire while the app is open.</p>
        </div>
        <button className="btn btn-primary" onClick={save}>Save Preferences</button>
      </div>

      <div className="section space-y-3">
        <div className="section-title">Data</div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={exportData}>Export JSON</button>
          <label className="btn btn-ghost"><input type="file" accept="application/json" className="hidden" onChange={e=>e.target.files && importData(e.target.files[0])} /> Import JSON</label>
        </div>
      </div>
    </div>
  )
}
