"use client"
import React from 'react'
import AnimatedKanban from '@/components/AnimatedKanban'
import AddRoleSlideOver from '@/components/AddRoleSlideOver'
import RoleEditorPopup from '@/components/RoleEditorPopup'
import TeamInviteModal from '@/components/TeamInviteModal'
import { trackEvent } from '@/lib/metrics'

export default function DashboardPage() {
	const [editPayload, setEditPayload] = React.useState<{ card: any; candidates: any[]; tasks?: any[] } | null>(null)
	const [addRoleOpen, setAddRoleOpen] = React.useState(false)
	const [showCoachmark, setShowCoachmark] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [urgentOpen, setUrgentOpen] = React.useState(false)
  const [urgentItems, setUrgentItems] = React.useState<Array<{ id: string; jobTitle: string; company?: string; stage: string; hoursOver: number }>>([])
  const [urgentTasks, setUrgentTasks] = React.useState<Array<{ id: string; taskId: string; title: string; jobTitle: string; company?: string; dueAt: number; dueInHours: number; overdue: boolean; roleId: string }>>([])
  const [tasksOpen, setTasksOpen] = React.useState(false)
  const [allTasks, setAllTasks] = React.useState<Array<{ id: string; title: string; dueAt?: number; status?: string; roleId?: string; jobTitle?: string; source?: string }>>([])

	React.useEffect(() => {
		if (typeof window === 'undefined') return
		const hideCoachmark = () => setShowCoachmark(false)
		window.addEventListener('open-add-role', hideCoachmark as EventListener)
		if (localStorage.getItem('just_onboarded') === '1') {
			setShowCoachmark(true)
			localStorage.removeItem('just_onboarded')
			// auto open and then hide coachmark so it does not obstruct the form
			setTimeout(() => {
				setShowCoachmark(false)
				window.dispatchEvent(new CustomEvent('open-add-role', { detail: { expandSidebar: true, anchorY: 120 } }))
			}, 800)
		}
		return () => window.removeEventListener('open-add-role', hideCoachmark as EventListener)
	}, [])

  React.useEffect(() => {
    const handler = () => setInviteOpen(true)
    window.addEventListener('open-invite-modal', handler)
    return () => window.removeEventListener('open-invite-modal', handler)
  }, [])

  // Task Center modal
  React.useEffect(() => {
    const openTasks = () => {
      setTasksOpen(true)
      window.dispatchEvent(new Event('request-all-tasks'))
    }
    const respond = (e: Event) => {
      const any = e as any
      const items = any?.detail?.items || []
      setAllTasks(items)
      // update counts in sidebar badges if present
      const allCountEl = document.getElementById('all-tasks-count')
      if (allCountEl) allCountEl.textContent = String(items.filter((t:any)=> t.status!=='done').length)
      const urgent = items.filter((t:any)=> t.status!=='done' && t.dueAt && (t.dueAt - Date.now()) <= 24*3600*1000)
      const urgentDot = document.getElementById('urgent-dot')
      if (urgentDot) urgentDot.style.opacity = urgent.length>0 ? '1' : '0.3'
    }
    window.addEventListener('open-task-center', openTasks)
    window.addEventListener('respond-all-tasks', respond as EventListener)
    return () => {
      window.removeEventListener('open-task-center', openTasks)
      window.removeEventListener('respond-all-tasks', respond as EventListener)
    }
  }, [])

  // Remove any auto-open behavior; Add Role opens only when user triggers it.

  // Urgent Actions modal
  React.useEffect(() => {
    const openUrgent = () => {
      setUrgentOpen(true)
      window.dispatchEvent(new Event('request-urgent-actions'))
      try { trackEvent('urgent_opened') } catch {}
    }
    const respond = (e: Event) => {
      const any = e as any
      const items = any?.detail?.items || []
      const tasks = any?.detail?.tasks || []
      setUrgentItems(items)
      setUrgentTasks(Array.isArray(tasks) ? tasks : [])
      // Also render tasks in Task Center list
      if (Array.isArray(tasks)) {
        setAllTasks(prev => {
          const others = prev.filter(t => t.source !== 'urgent-inline')
          const mapped = tasks.map((t:any)=> ({
            id: t.id,
            title: t.title,
            dueAt: t.dueAt,
            status: 'open',
            roleId: t.roleId,
            jobTitle: t.jobTitle,
            source: 'urgent-inline'
          }))
          return [...others, ...mapped]
        })
      }
    }
    window.addEventListener('open-urgent-actions', openUrgent)
    window.addEventListener('respond-urgent-actions', respond as EventListener)
    return () => {
      window.removeEventListener('open-urgent-actions', openUrgent)
      window.removeEventListener('respond-urgent-actions', respond as EventListener)
    }
  }, [])

	return (
		<div className="h-full w-full overflow-hidden">
			<AnimatedKanban
				disabled={!!editPayload}
				onOpenEditor={(payload)=> setEditPayload(payload as any)}
				initialCards={[]}
			/>
			<AddRoleSlideOver open={addRoleOpen} onClose={()=> setAddRoleOpen(false)} onSubmit={()=> setAddRoleOpen(false)} sidebarWidthPx={256} topOffsetPx={64} />
			<RoleEditorPopup open={!!editPayload} onClose={()=> setEditPayload(null)} card={editPayload?.card} candidates={editPayload?.candidates || []} tasks={editPayload?.tasks || []} />
			<TeamInviteModal open={inviteOpen} onClose={()=> setInviteOpen(false)} />

			{urgentOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={()=> setUrgentOpen(false)} />
					<div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">
						<div className="flex items-center justify-between mb-3">
							<div className="font-heading text-lg font-semibold">Urgent actions</div>
							<button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={()=> setUrgentOpen(false)}>Close</button>
						</div>
            <div className="space-y-4 max-h-[60vh] overflow-auto">
              {urgentItems.length === 0 && urgentTasks.length === 0 && (
                <div className="text-sm text-primary-400">No urgent actions right now based on your rules.</div>
              )}
              {urgentItems.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Stage alerts</div>
                  <div className="space-y-2">
                    {urgentItems.map(item => (
                      <div key={item.id} className="rounded-md border border-cream-200 p-3 text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary-500">{item.jobTitle}</div>
                          <div className="text-primary-400">{item.company} • {item.stage}</div>
                        </div>
                        <div className="text-red-600 text-xs">{item.hoursOver}h over</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {urgentTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Due soon</div>
                    <div className="text-xs text-gray-500">Sorted: Overdue first</div>
                  </div>
                  <div className="space-y-2">
                    {urgentTasks.map(t => (
                      <div key={t.id} className="rounded-md border border-cream-200 p-3 text-sm flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary-500">{t.title}</div>
                          <div className="text-primary-400">{t.jobTitle}{t.company ? ` • ${t.company}` : ''}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`${t.overdue ? 'text-red-600' : 'text-amber-600'} text-xs`}>
                            {t.overdue ? 'Overdue' : 'Due soon'} • {new Date(t.dueAt).toLocaleString()}
                          </div>
                          <button
                            className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('kanban-mark-task-done', { detail: { roleId: t.roleId, taskId: t.taskId } }))
                              // Hide immediately in the modal view
                              setUrgentTasks(prev => prev.filter(x => x.id !== t.id))
                            }}
                          >Mark done</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

      {tasksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=> setTasksOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-heading text-lg font-semibold">Task Center</div>
              <button className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50" onClick={()=> setTasksOpen(false)}>Close</button>
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {allTasks.length === 0 && (
                <div className="text-sm text-primary-400">No tasks yet.</div>
              )}
              {allTasks
                .sort((a,b)=> (a.dueAt||0) - (b.dueAt||0))
                .map(t => (
                <div key={t.id} className="rounded-md border border-cream-200 p-3 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary-500">{t.title}</div>
                    <div className="text-primary-400">{t.jobTitle || 'Role'} • {t.source==='auto'?'Auto':'Manual'}</div>
                  </div>
                  <div className="text-xs">
                    {t.dueAt ? (
                      <span className={(t.dueAt - Date.now()) <= 24*3600*1000 ? 'text-red-600' : 'text-gray-600'}>
                        Due {new Date(t.dueAt).toLocaleString()}
                      </span>
                    ) : <span className="text-gray-400">No due</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
							{urgentItems.map(item => (
								<div key={item.id} className="rounded-md border border-cream-200 p-3 text-sm flex items-center justify-between">
									<div>
										<div className="font-medium text-primary-500">{item.jobTitle}</div>
										<div className="text-primary-400">{item.company} • {item.stage}</div>
									</div>
									<div className="text-red-600 text-xs">{item.hoursOver}h over</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{showCoachmark && (
				<div className="pointer-events-none fixed inset-0 z-40">
					<div className="absolute inset-0 bg-black/30 animate-[fadeIn_200ms_ease-out]" />
					<div className="absolute left-16 top-80">
						<div className="relative bg-white border border-cream-200 shadow-xl rounded-xl p-4 w-72 animate-[slideIn_300ms_ease-out]">
							<div className="text-sm font-medium text-primary-500 mb-1">Great — setup complete</div>
							<div className="text-sm text-primary-400 mb-3">Add your first role to get your pipeline moving.</div>
							<div className="flex items-center gap-2 text-xs text-primary-400">
								<span className="w-2 h-2 bg-accent-500 rounded-full animate-ping" />
								<span>This will open the Add Role panel for you.</span>
							</div>
							<div className="absolute -left-2 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white" />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}


