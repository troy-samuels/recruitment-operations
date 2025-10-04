'use client'

import React from 'react'
import {
  Kanban,
  CheckSquare,
  Users,
  BarChart3,
  Eye,
  UserPlus,
  Activity,
  Trophy,
  Plus,
  FileText,
  Settings,
  Zap,
  User
} from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { useWorkspace } from '@/components/WorkspaceProvider'

interface LeftNavigationProps {
  collapsed?: boolean
  activeKey?: 'add-role' | null
  urgentCount?: number
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ collapsed = false, activeKey = null, urgentCount = 0 }) => {
  const { workspaceTier } = useWorkspace()
  const [openMyWork, setOpenMyWork] = React.useState(false)
  const [openTeam, setOpenTeam] = React.useState(false)
  const [dynamicUrgent, setDynamicUrgent] = React.useState<number>(urgentCount)
  const [nudgeDismissed, setNudgeDismissed] = React.useState(false)

  // Listen for urgent count updates from the board
  React.useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as any
      const count = Number(anyEvent.detail?.count || 0)
      setDynamicUrgent(count)
    }
    window.addEventListener('urgent-count-update', handler as EventListener)
    return () => window.removeEventListener('urgent-count-update', handler as EventListener)
  }, [])

  // Initialize and auto-dismiss green nudge when Add Role is opened from anywhere
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const init = () => {
      try {
        const dismissed = localStorage.getItem('first_role_nudge_dismissed') === '1'
        const added = !!localStorage.getItem('first_role_added')
        setNudgeDismissed(dismissed || added)
      } catch {}
    }
    init()
    const onOpen = () => {
      try { localStorage.setItem('first_role_nudge_dismissed', '1') } catch {}
      setNudgeDismissed(true)
    }
    window.addEventListener('open-add-role', onOpen as EventListener)
    window.addEventListener('open-add-role-now', onOpen as EventListener)
    return () => {
      window.removeEventListener('open-add-role', onOpen as EventListener)
      window.removeEventListener('open-add-role-now', onOpen as EventListener)
    }
  }, [])

  // Collapsed: minimalist icon-only layout with clear section separation
  if (collapsed) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-0 md:p-2">
          <nav className="flex flex-col items-center gap-1">
            {/* Section: Quick Actions */}
            <button title="Urgent Actions" className="relative p-2 rounded-lg hover:bg-gray-100" onClick={()=> window.dispatchEvent(new Event('expand-sidebar'))}>
              <Zap className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {dynamicUrgent > 0 && (
                <span className="absolute -bottom-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">{dynamicUrgent}</span>
              )}
            </button>
            <button
              title="Add Role"
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                const anchorY = rect.top + rect.height / 2
                const evt = new CustomEvent('open-add-role', { detail: { expandSidebar: true, anchorY } })
                try { localStorage.setItem('first_role_nudge_dismissed','1') } catch {}
                setNudgeDismissed(true)
                window.dispatchEvent(evt)
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button title="Quick Notes" className="p-2 rounded-lg hover:bg-gray-100">
              <FileText className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-2" />

            {/* Section: People views */}
            <button title="Individual" className="p-2 rounded-lg hover:bg-gray-100">
              <User className="w-4 h-4" />
            </button>
            <button title="Team" className="p-2 rounded-lg hover:bg-gray-100">
              <Users className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-2" />

            {/* Section: Analytics */}
            <a href="/analytics" title="Analytics" className="p-2 rounded-lg hover:bg-gray-100">
              <BarChart3 className="w-4 h-4" />
            </a>
          </nav>
        </div>

        {/* Bottom Settings */}
        <div className="mt-auto p-0 md:p-2">
          <button title="Settings" className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* QUICK ACTIONS - Top priority */}
      <div className={`${collapsed ? 'p-2' : 'p-4'}`}>
        <nav className="space-y-1">
          {/* Urgent Actions - flashing indicator */}
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors`}
            title={collapsed ? "Urgent Actions" : ""}
            onClick={(e)=> { e.preventDefault(); window.dispatchEvent(new Event('open-urgent-actions')); window.dispatchEvent(new Event('expand-sidebar')) }}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span>Urgent Actions</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">{dynamicUrgent}</span>
                </span>
              </>
            )}
          </a>

          {/* Add Role */}
          <a
            href="#"
              className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Add Role" : ""}
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new Event('expand-sidebar'))
              try { localStorage.setItem('first_role_nudge_dismissed','1') } catch {}
              setNudgeDismissed(true)
              window.dispatchEvent(new Event('open-add-role'))
            }}
          >
            <span className="relative">
              <Plus className="w-4 h-4 flex-shrink-0" />
              {!nudgeDismissed && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              )}
            </span>
            {!collapsed && <span>Add Role</span>}
            {/* Wedge connector when active */}
            {/* connector removed */}
          </a>

          {/* Quick Notes */}
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Quick Notes" : ""}
            onClick={(e) => { e.preventDefault() }}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Quick Notes</span>}
          </a>
        </nav>
      </div>
      {/* MY WORK Section */}
      <div className={`${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed && (
          <button
            onClick={() => setOpenMyWork(v => !v)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 hover:text-gray-900"
          >
            <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> MY WORK</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openMyWork ? 'rotate-180' : ''}`} />
          </button>
        )}
        <nav className={`${collapsed ? '' : (openMyWork ? 'block' : 'hidden')} space-y-1`}>
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors`}
            title={collapsed ? "My Pipeline" : ""}
          >
            <Kanban className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>My Pipeline</span>}
          </a>
          {/* Add Role inside My Work */}
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? 'Add Role' : ''}
            onClick={(e) => {
              e.preventDefault()
              const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect()
              const anchorY = rect.top + rect.height / 2
              const evt = new CustomEvent('open-add-role', { detail: { expandSidebar: false, anchorY } })
              try { localStorage.setItem('first_role_nudge_dismissed','1') } catch {}
              setNudgeDismissed(true)
              window.dispatchEvent(evt)
            }}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Add Role</span>}
          </a>
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Task Center" : ""}
            onClick={(e)=>{ e.preventDefault(); window.dispatchEvent(new Event('open-task-center')); window.dispatchEvent(new Event('expand-sidebar')) }}
          >
            <CheckSquare className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span>Task Center</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full" id="all-tasks-count">0</span>
                  <span className="relative">
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" id="urgent-dot"></span>
                  </span>
                </span>
              </>
            )}
          </a>
          <a
            href="/analytics"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Analytics" : ""}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Analytics</span>}
          </a>
          <a
            href="/messages"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Messages" : ""}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Messages</span>}
          </a>
        </nav>
      </div>

      {/* TEAM Section */}
      <div className={`${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed && (
          <button
            onClick={() => setOpenTeam(v => !v)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 hover:text-gray-900"
          >
            <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> TEAM</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openTeam ? 'rotate-180' : ''}`} />
          </button>
        )}
        <nav className={`${collapsed ? '' : (openTeam ? 'block' : 'hidden')} space-y-1`}>
          <a
            href="#"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Team Overview" : ""}
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Team Overview</span>}
          </a>
          <a
            href="/analytics"
            className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={collapsed ? "Analytics" : ""}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Analytics</span>}
          </a>
        </nav>
      </div>

      {/* QUICK ACTIONS Section removed and consolidated at top */}

      {/* Settings at bottom */}
      <div className={`mt-auto ${collapsed ? 'p-2' : 'p-4'}`}>
        <button className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'} text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors`}
                title={collapsed ? "Settings" : ""}>
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  )
}

export default LeftNavigation