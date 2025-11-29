'use client'
import { useEffect, useState } from 'react'
import { Storage } from '@/lib/storage'

export default function SettingsPage() {
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  const [checkInHour, setCheckInHour] = useState(15)
  const [name, setName] = useState('')

  useEffect(() => {
    const prefs = Storage.getPrefs()
    setRemindersEnabled(prefs.remindersEnabled)
    setCheckInHour(prefs.checkInHour)
    setName(prefs.name || '')
  }, [])

  const save = () => {
    Storage.setPrefs({ remindersEnabled, checkInHour, name })
    if (remindersEnabled && 'Notification' in window) {
      Notification.requestPermission()
    }
    alert('Preferences saved')
  }

  const exportData = () => {
    const blob = new Blob([Storage.exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cravings_data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try { Storage.importAll(reader.result as string); alert('Import complete. Refresh the page to see updates.')} catch { alert('Invalid file') }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
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
