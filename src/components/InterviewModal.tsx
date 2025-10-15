"use client"
import React from 'react'

type InterviewData = {
  roleId: string
  jobTitle?: string
  candidateId?: string
  candidateName?: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  timezone: string
  locationOrLink?: string
  notes?: string
}

const timezones = [
  'Europe/London',
  'UTC',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
]

export default function InterviewModal({
  open,
  onClose,
  context,
}: {
  open: boolean
  onClose: (saved?: InterviewData) => void
  context?: { roleId: string; jobTitle?: string; candidateId?: string; candidateName?: string }
}) {
  const [date, setDate] = React.useState('')
  const [time, setTime] = React.useState('')
  const [tz, setTz] = React.useState('Europe/London')
  const [where, setWhere] = React.useState('')
  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    // initialise with next business day 10:00
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    setDate(`${y}-${m}-${dd}`)
    setTime('10:00')
  }, [open])

  if (!open) return null

  const save = () => {
    if (!context?.roleId || !date || !time) return onClose()
    const payload: InterviewData = {
      roleId: context.roleId,
      jobTitle: context.jobTitle,
      candidateId: context.candidateId,
      candidateName: context.candidateName,
      date,
      time,
      timezone: tz,
      locationOrLink: where,
      notes,
    }
    try {
      const key = 'interviews_v1'
      const raw = localStorage.getItem(key)
      const list = raw ? JSON.parse(raw) : []
      list.push({ ...payload, createdAt: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(list))
    } catch {}
    onClose(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={()=> onClose()} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-heading text-lg font-semibold">Schedule interview</div>
          <button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={()=> onClose()}>Close</button>
        </div>
        {context?.jobTitle && (
          <div className="text-sm text-primary-500 mb-3">Role: <span className="font-medium">{context.jobTitle}</span></div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Time</label>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Timezone</label>
            <select value={tz} onChange={e=>setTz(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              {timezones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Location / Video link</label>
            <input value={where} onChange={e=>setWhere(e.target.value)} placeholder="Office or Zoom/Meet URL" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={3} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-lg text-sm bg-cream-100 text-primary-500 hover:bg-cream-200" onClick={()=> onClose()}>Cancel</button>
          <button className="px-4 py-2 rounded-lg text-sm bg-accent-500 text-white hover:bg-accent-600" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}



