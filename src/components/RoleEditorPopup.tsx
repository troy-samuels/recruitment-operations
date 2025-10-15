'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { trackEvent } from '@/lib/metrics'
import { Calendar, Pencil, User, X, Phone, Mail, MessageSquare, FileText, Clock, Trash2 } from 'lucide-react'

interface CandidateRow {
  id: string
  name: string
  callBooked: boolean
  refsCount: number
}

interface TaskItem {
  id: string
  title: string
  done: boolean
  dueAt?: number
  status?: 'open' | 'in_progress' | 'blocked' | 'done'
}

interface ActivityLogEntry {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'feedback'
  candidateName?: string
  note: string
  timestamp: number
  user: string
}

interface RoleEditorPopupProps {
  open: boolean
  onClose: () => void
  card?: {
    id: string
    jobTitle: string
    company: string
    salary?: string
    owner?: string
    assignees?: string[]
    controlLevel?: 'high' | 'medium' | 'low'
  } | null
  candidates?: CandidateRow[]
  tasks?: TaskItem[]
  activityLog?: ActivityLogEntry[]
}

const RoleEditorPopup: React.FC<RoleEditorPopupProps> = ({ open, onClose, card, candidates = [], tasks = [], activityLog = [] }) => {
  const [localTitle, setLocalTitle] = useState(card?.jobTitle || '')
  const [localCompany, setLocalCompany] = useState(card?.company || '')
  const [localSalary, setLocalSalary] = useState(card?.salary || '')
  const [localCandidates, setLocalCandidates] = useState<CandidateRow[]>(candidates)
  const [localTasks, setLocalTasks] = useState<TaskItem[]>(tasks)
  const [localActivityLog, setLocalActivityLog] = useState<ActivityLogEntry[]>(activityLog)
  const [activityType, setActivityType] = useState<'call' | 'email' | 'meeting' | 'note' | 'feedback'>('note')
  const [activityNote, setActivityNote] = useState('')
  const [activityCandidate, setActivityCandidate] = useState('')

  const isAdmin = React.useCallback(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('user_role') === 'admin'
  }, [])

  useEffect(() => {
    if (card) {
      setLocalTitle(card.jobTitle || '')
      setLocalCompany(card.company || '')
      setLocalSalary(card.salary || '')
    }
    setLocalCandidates(candidates || [])
    setLocalTasks(tasks || [])
    setLocalActivityLog(activityLog || [])
  }, [card, candidates, tasks, activityLog])

  if (!open || !card) return null

  const ensureCandidateId = React.useCallback(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    return `candidate-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
  }, [])

  const handleToggleCall = (id: string) => {
    setLocalCandidates(prev => prev.map(c => c.id === id ? { ...c, callBooked: !c.callBooked } : c))
  }

  const handleRefsChange = (id: string, delta: number) => {
    setLocalCandidates(prev => prev.map(c => {
      if (c.id !== id) return c
      const next = Math.max(0, Math.min(2, (c.refsCount || 0) + delta))
      return { ...c, refsCount: next }
    }))
  }

  const handleCandidateNameChange = (id: string, value: string) => {
    setLocalCandidates(prev => prev.map(c => c.id === id ? { ...c, name: value } : c))
  }

  const handleCandidateDirectRefsChange = (id: string, value: number) => {
    if (!Number.isFinite(value)) return
    setLocalCandidates(prev => prev.map(c => c.id === id ? { ...c, refsCount: Math.max(0, Math.min(2, value)) } : c))
  }

  const handleRemoveCandidate = (id: string) => {
    setLocalCandidates(prev => prev.filter(c => c.id !== id))
  }

  const handleAddCandidate = () => {
    setLocalCandidates(prev => [...prev, { id: ensureCandidateId(), name: '', callBooked: false, refsCount: 0 }])
  }

  const handleAddActivity = () => {
    if (!activityNote.trim()) return
    const userName = localStorage.getItem('user_name') || 'You'
    const newActivity: ActivityLogEntry = {
      id: `activity-${Date.now()}`,
      type: activityType,
      candidateName: activityCandidate || undefined,
      note: activityNote.trim(),
      timestamp: Date.now(),
      user: userName,
    }
    setLocalActivityLog(prev => [newActivity, ...prev])
    setActivityNote('')
    setActivityCandidate('')
  }

  const handleSave = () => {
    const payload = {
      card: {
        ...card,
        jobTitle: localTitle,
        company: localCompany,
        salary: localSalary,
      },
      candidates: localCandidates,
      tasks: localTasks,
      activityLog: localActivityLog,
    }
    const evt = new CustomEvent('kanban-update-card', { detail: payload })
    window.dispatchEvent(evt)
    try { trackEvent('role_saved', { id: card.id }) } catch {}
    onClose()
  }

  const handleDelete = () => {
    if (!card) return
    const ok = window.confirm('Delete this role? This cannot be undone.')
    if (!ok) return
    const evt = new CustomEvent('kanban-delete-card', { detail: { id: card.id } })
    window.dispatchEvent(evt)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 animate-[fadeIn_150ms_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <div className="font-heading text-lg font-semibold">Edit role</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={handleSave}>Save</button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700" onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Role Section */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Role title</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={localTitle} onChange={(e)=> setLocalTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Company</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={localCompany} onChange={(e)=> setLocalCompany(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Salary / Day rate</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={localSalary} onChange={(e)=> setLocalSalary(e.target.value)} />
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800">Candidates</div>
            <button className="text-sm text-blue-600 hover:text-blue-700" onClick={handleAddCandidate}>Add candidate</button>
          </div>
          <div className="space-y-2">
            {localCandidates.map(c=> (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 px-3 py-3">
                <div className="flex-1 min-w-0">
                  <input
                    value={c.name}
                    onChange={e => handleCandidateNameChange(c.id, e.target.value)}
                    placeholder="Candidate name"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${c.callBooked ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    onClick={()=> handleToggleCall(c.id)}
                    type="button"
                  >
                    {c.callBooked ? 'Call booked' : 'Mark call booked'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                      onClick={()=> handleRefsChange(c.id, -1)}
                      aria-label="Decrease references collected"
                    >
                      –
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={2}
                      value={c.refsCount || 0}
                      onChange={e => handleCandidateDirectRefsChange(c.id, Number(e.target.value))}
                      className="w-14 text-center border border-gray-200 rounded-md py-1 text-sm"
                    />
                    <span className="text-xs text-gray-500">refs</span>
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                      onClick={()=> handleRefsChange(c.id, 1)}
                      aria-label="Increase references collected"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={()=> handleRemoveCandidate(c.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove candidate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {localCandidates.length === 0 && (
              <div className="text-xs text-gray-500 border border-dashed rounded-lg px-3 py-6 text-center">No candidates yet.</div>
            )}
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800">Activity Log</div>
          </div>

          {/* Add Activity Form */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="feedback">Feedback</option>
              </select>

              <input
                type="text"
                value={activityCandidate}
                onChange={(e) => setActivityCandidate(e.target.value)}
                placeholder="Candidate name (optional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <input
                type="text"
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                placeholder="Add note..."
                className="flex-[2] px-3 py-2 border border-gray-300 rounded-md text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddActivity()
                  }
                }}
              />

              <button
                onClick={handleAddActivity}
                disabled={!activityNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localActivityLog
              .slice()
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(entry => {
                const iconMap = {
                  call: <Phone className="w-4 h-4" />,
                  email: <Mail className="w-4 h-4" />,
                  meeting: <Calendar className="w-4 h-4" />,
                  note: <MessageSquare className="w-4 h-4" />,
                  feedback: <FileText className="w-4 h-4" />,
                }
                const colorMap = {
                  call: 'bg-green-50 border-green-200 text-green-700',
                  email: 'bg-blue-50 border-blue-200 text-blue-700',
                  meeting: 'bg-purple-50 border-purple-200 text-purple-700',
                  note: 'bg-gray-50 border-gray-200 text-gray-700',
                  feedback: 'bg-orange-50 border-orange-200 text-orange-700',
                }
                return (
                  <div key={entry.id} className={`flex items-start gap-3 p-3 rounded-lg border ${colorMap[entry.type]}`}>
                    <div className="flex-shrink-0 mt-0.5">{iconMap[entry.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium capitalize">{entry.type}</span>
                        {entry.candidateName && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium">{entry.candidateName}</span>
                          </>
                        )}
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{entry.user}</span>
                        <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(entry.timestamp).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{entry.note}</p>
                    </div>
                  </div>
                )
              })}
            {localActivityLog.length === 0 && (
              <div className="text-xs text-gray-500 border border-dashed rounded-lg px-3 py-6 text-center">
                No activity yet. Add your first note above.
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section (collapsible) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800">Tasks</div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => {
                const title = prompt('Task title?')
                if (!title) return
                const due = prompt('Due date (YYYY-MM-DD, optional)?') || ''
                const dueAt = due && !isNaN(Date.parse(due)) ? new Date(due + 'T17:00:00').getTime() : undefined
                setLocalTasks(prev => [...prev, { id: `${Date.now()}`, title, done: false, status: 'open', dueAt }])
              }}>Add task</button>
            </div>
          </div>
          <div className="space-y-2">
            {localTasks
              .slice()
              .sort((a,b)=> (a.done===b.done ? ((a.dueAt||Infinity)-(b.dueAt||Infinity)) : (a.done?1:-1)))
              .map(t => (
              <div key={t.id} className="rounded-lg border border-gray-200 px-3 py-2 text-sm flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <input type="checkbox" checked={t.done} onChange={() => { setLocalTasks(prev => prev.map(x => x.id===t.id ? { ...x, done: !x.done, status: !x.done ? 'done':'open' } : x)); try { trackEvent('task_toggled', { roleId: card.id, taskId: t.id, done: !t.done }) } catch {} }} />
                  <select value={t.status || (t.done?'done':'open')} onChange={(e)=> setLocalTasks(prev => prev.map(x => x.id===t.id ? { ...x, status: e.target.value as any, done: e.target.value==='done' } : x))} className="border border-gray-300 rounded-md text-xs px-1.5 py-1">
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                  <span className={`truncate ${t.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>{t.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md text-xs px-1.5 py-1"
                    value={t.dueAt ? new Date(t.dueAt).toISOString().slice(0,10) : ''}
                    onChange={(e)=>{
                      const v = e.target.value
                      const ts = v ? new Date(v + 'T17:00:00').getTime() : undefined
                      setLocalTasks(prev => prev.map(x => x.id===t.id ? { ...x, dueAt: ts } : x))
                    }}
                  />
                  <button className="text-xs text-red-600 hover:text-red-700" onClick={()=> setLocalTasks(prev=> prev.filter(x=> x.id!==t.id))}>Remove</button>
                </div>
              </div>
            ))}
            {localTasks.length === 0 && (
              <div className="text-xs text-gray-500 border border-dashed rounded-lg px-3 py-6 text-center">No tasks yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between">
        {isAdmin() ? (
          <button onClick={handleDelete} className="text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-md">Delete role</button>
        ) : <span />}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
          <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default RoleEditorPopup
