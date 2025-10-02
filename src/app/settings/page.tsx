"use client"
import React from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<any>({})
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('onboarding_settings')
    if (raw) try { setSettings(JSON.parse(raw)) } catch {}
  }, [])

  const update = (path: string[], value: any) => {
    setSettings((prev: any) => {
      const next = { ...(prev || {}) }
      let ref = next
      for (let i = 0; i < path.length - 1; i++) {
        ref[path[i]] = ref[path[i]] || {}
        ref = ref[path[i]]
      }
      ref[path[path.length-1]] = value
      if (typeof window !== 'undefined') localStorage.setItem('onboarding_settings', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Quarter end date</label>
            <input type="date" value={settings?.quarterEndDate || ''} onChange={(e)=> update(['quarterEndDate'], e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Individual target (Q)</label>
            <input type="number" min={1} value={settings?.targets?.individualPlacements || 10} onChange={(e)=> update(['targets','individualPlacements'], Number(e.target.value))} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Source within (days)</label>
            <input type="number" min={1} value={Math.max(1, Math.round((settings?.sourcing?.sourceWithinHours || 72)/24))} onChange={(e)=> update(['sourcing','sourceWithinHours'], Number(e.target.value)*24)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Max hours in any stage</label>
            <input type="number" min={12} value={settings?.urgentRules?.maxStageHours || 72} onChange={(e)=> update(['urgentRules','maxStageHours'], Number(e.target.value))} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">Per-stage SLAs (hours)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="block text-xs text-gray-600 mb-1">New Leads</span>
                <input
                  type="number"
                  min={1}
                  value={(settings?.urgentRules?.perStageHours?.[0] ?? settings?.urgentRules?.maxStageHours ?? 24)}
                  onChange={(e)=> {
                    const v = Number(e.target.value)
                    const arr = [v, (settings?.urgentRules?.perStageHours?.[1] ?? settings?.urgentRules?.maxStageHours ?? 48), (settings?.urgentRules?.perStageHours?.[2] ?? settings?.urgentRules?.maxStageHours ?? 72)]
                    update(['urgentRules','perStageHours'], arr)
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-gray-600 mb-1">Contacted</span>
                <input
                  type="number"
                  min={1}
                  value={(settings?.urgentRules?.perStageHours?.[1] ?? settings?.urgentRules?.maxStageHours ?? 48)}
                  onChange={(e)=> {
                    const v = Number(e.target.value)
                    const arr = [(settings?.urgentRules?.perStageHours?.[0] ?? settings?.urgentRules?.maxStageHours ?? 24), v, (settings?.urgentRules?.perStageHours?.[2] ?? settings?.urgentRules?.maxStageHours ?? 72)]
                    update(['urgentRules','perStageHours'], arr)
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-gray-600 mb-1">Interview</span>
                <input
                  type="number"
                  min={1}
                  value={(settings?.urgentRules?.perStageHours?.[2] ?? settings?.urgentRules?.maxStageHours ?? 72)}
                  onChange={(e)=> {
                    const v = Number(e.target.value)
                    const arr = [(settings?.urgentRules?.perStageHours?.[0] ?? settings?.urgentRules?.maxStageHours ?? 24), (settings?.urgentRules?.perStageHours?.[1] ?? settings?.urgentRules?.maxStageHours ?? 48), v]
                    update(['urgentRules','perStageHours'], arr)
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Placed is excluded from SLAs.</p>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">Auto-generated tasks</div>
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" checked={settings?.autoTasks?.stageTriggerChaseEnabled ?? true} onChange={(e)=> update(['autoTasks','stageTriggerChaseEnabled'], e.target.checked)} />
              Enable “Chase client feedback” when moving to Contacted
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-800 mt-2">
              <input type="checkbox" checked={settings?.autoTasks?.escalationsEnabled ?? true} onChange={(e)=> update(['autoTasks','escalationsEnabled'], e.target.checked)} />
              Enable “Check in” tasks when a role exceeds stage SLA
            </label>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">Analytics</div>
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" checked={settings?.analytics?.enabled ?? true} onChange={(e)=> update(['analytics','enabled'], e.target.checked)} />
              Enable anonymous usage analytics
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Who can create roles?</label>
            <select value={settings?.permissions?.whoCanCreateRoles || 'admin_only'} onChange={(e)=> update(['permissions','whoCanCreateRoles'], e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="admin_only">Admins only</option>
              <option value="any_member">Anyone on my team</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}


