'use client'

import React, { useMemo, useState } from 'react'
import { trackEvent } from '@/lib/metrics'
import { X } from 'lucide-react'

export interface AddRoleFormValues {
  jobTitle: string
  company: string
  directHmContact: boolean
  cvPresentationCall: boolean
  interviewTimesConfirmed: boolean
  roleExclusivity: boolean
  clearJobDescription: boolean
  employmentType: 'permanent' | 'contract' | ''
  compensation: string
  assigneesInput: string
}

interface AddRoleSlideOverProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: {
    id: string
    jobTitle: string
    company: string
    stage: number
    controlScore: number
    controlLevel: 'high' | 'medium' | 'low'
    flags: {
      hasHmContact: boolean
      interviewsScheduled: boolean
      exclusive: boolean
    }
    owner?: string
    assignees?: string[]
  }) => void
  sidebarWidthPx?: number
  topOffsetPx?: number
}

const initialValues: AddRoleFormValues = {
  jobTitle: '',
  company: '',
  directHmContact: false,
  cvPresentationCall: false,
  interviewTimesConfirmed: false,
  roleExclusivity: false,
  clearJobDescription: false,
  employmentType: '',
  compensation: '',
  assigneesInput: '',
}

function computeControlScore(values: AddRoleFormValues): number {
  let score = 0
  // Weighted by impact; totals 100
  if (values.roleExclusivity) score += 30
  // Swap weights: HM contact now higher impact than interview times
  if (values.directHmContact) score += 25
  if (values.cvPresentationCall) score += 20
  if (values.interviewTimesConfirmed) score += 15
  if (values.clearJobDescription) score += 7
  return Math.min(100, score)
}

function controlLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

const AddRoleSlideOver: React.FC<AddRoleSlideOverProps> = ({ open, onClose, onSubmit, sidebarWidthPx = 256, topOffsetPx = 64 }) => {
  const [values, setValues] = useState<AddRoleFormValues>(initialValues)

  const score = useMemo(() => computeControlScore(values), [values])
  const level = useMemo(() => controlLevel(score), [score])

  const generateId = React.useCallback(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    return `role-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value as AddRoleFormValues['employmentType'] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.jobTitle || !values.company) return
    const owner = typeof window !== 'undefined' ? (localStorage.getItem('user_name') || 'You') : 'You'
    const assignees = values.assigneesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const roleId = generateId()
    // Emit global event as well so listeners can always capture
    const detail = {
      id: roleId,
      jobTitle: values.jobTitle,
      company: values.company,
      stage: 0,
      controlScore: score,
      controlLevel: level,
      flags: {
        hasHmContact: values.directHmContact,
        interviewsScheduled: values.interviewTimesConfirmed,
        exclusive: values.roleExclusivity,
      },
      compensation: values.compensation,
      employmentType: values.employmentType,
      owner,
      assignees,
    }
    try { window.dispatchEvent(new CustomEvent('kanban-add-role', { detail })) } catch {}
    onSubmit(detail as any)
    try { trackEvent('role_added', { jobTitle: values.jobTitle, company: values.company }) } catch {}
    try { (window as any)?.datafast?.('role_added') } catch {}
    setValues(initialValues)
    onClose()
  }

  if (!open) return null

  const canSave = Boolean(values.jobTitle.trim() && values.company.trim())

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* No dark scrim for inline extension feel */}
      <div className="w-full max-w-lg bg-white border-l border-gray-200 rounded-r-xl shadow-md flex flex-col pointer-events-auto transition-transform duration-200 ease-out"
           style={{ position: 'absolute', top: topOffsetPx, left: sidebarWidthPx, transform: open ? 'translateX(0)' : 'translateX(-8px)', height: `calc(100vh - ${topOffsetPx}px)` }}>
        <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="font-heading text-lg font-semibold">Add Role</div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
        </div>

        <form id="add-role-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Role title</label>
            <input name="jobTitle" value={values.jobTitle} onChange={handleChange} placeholder="e.g., Senior React Developer" className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Company</label>
            <input name="company" value={values.company} onChange={handleChange} placeholder="e.g., TechFlow Ltd" className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Type & Compensation */}
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Type</label>
              <select
                name="employmentType"
                value={values.employmentType}
                onChange={handleSelectChange}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            {values.employmentType !== '' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">{values.employmentType === 'permanent' ? 'Salary' : 'Day rate'}</label>
                <input
                  name="compensation"
                  value={values.compensation}
                  onChange={handleChange}
                  placeholder={values.employmentType === 'permanent' ? 'e.g., £65,000' : 'e.g., £500/day'}
                  className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Assign to teammates (optional) */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Assign to (optional)</label>
            <input
              name="assigneesInput"
              value={values.assigneesInput}
              onChange={handleChange}
              placeholder="Enter names/emails, comma separated"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Example: alex@firm.co, Jamie Lee</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {/* Ordered by weight: exclusivity, interview times, CV call, HM contact, JD, salary */}
              <label className="flex items-center justify-between text-sm text-gray-800">
                <span>Job Role Exclusivity</span>
                <input type="checkbox" name="roleExclusivity" checked={values.roleExclusivity} onChange={handleChange} />
              </label>
              <label className="flex items-center justify-between text-sm text-gray-800">
                <span>Direct Hiring Manager Contact</span>
                <input type="checkbox" name="directHmContact" checked={values.directHmContact} onChange={handleChange} />
              </label>
              <label className="flex items-center justify-between text-sm text-gray-800">
                <span>CV Presentation Call Confirmed</span>
                <input type="checkbox" name="cvPresentationCall" checked={values.cvPresentationCall} onChange={handleChange} />
              </label>
              <label className="flex items-center justify-between text-sm text-gray-800">
                <span>Interview Times Confirmed</span>
                <input type="checkbox" name="interviewTimesConfirmed" checked={values.interviewTimesConfirmed} onChange={handleChange} />
              </label>
              <label className="flex items-center justify-between text-sm text-gray-800">
                <span>Clear Job Description</span>
                <input type="checkbox" name="clearJobDescription" checked={values.clearJobDescription} onChange={handleChange} />
              </label>
            </div>
          </div>

          <div className="h-4" />
        </form>
        <div className="px-4 py-3 border-t bg-white sticky bottom-0 z-10 flex items-center gap-2">
          <button type="button" onClick={onClose} className="text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-lg">Cancel</button>
          <button type="submit" form="add-role-form" disabled={!canSave} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  )
}

export default AddRoleSlideOver
