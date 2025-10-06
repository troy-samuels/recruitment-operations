'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, User, Users, BarChart3, Settings, CreditCard, HelpCircle, LogOut, Zap, Clock } from 'lucide-react'
import { useWorkspace } from '@/components/WorkspaceProvider'

const DashboardTopBar: React.FC = () => {
  const { workspaceTier, userRole, canInvite, seatsPurchased, seatsUsed, seatsLeft, view, setView } = useWorkspace()
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false)
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const [isTimeframeMenuOpen, setIsTimeframeMenuOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('quarter')

  const timeframeLabel = timeframe === 'week' ? 'Week' : timeframe === 'month' ? 'Month' : 'Quarter'
  // Demo achieved counts (would be fetched/calculated in real app)
  // In a real app, achieved would come from data. Keep demo values.
  const achieved = view === 'individual' ? 3 : 18

  // Base quarterly targets (could be user/team settings)
  const individualQuarterTarget = (() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('onboarding_settings')
      if (s) try {
        const j = JSON.parse(s)
        if (j?.targets?.individualPlacements) return j.targets.individualPlacements
      } catch {}
    }
    return 10
  })()
  const teamQuarterTarget = 50

  const getQuarterBounds = (now: Date) => {
    const q = Math.floor(now.getMonth() / 3)
    const startMonth = q * 3
    const start = new Date(now.getFullYear(), startMonth, 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), startMonth + 3, 0, 23, 59, 59, 999)
    return { start, end }
  }

  const getWeeksInQuarter = (now: Date) => {
    const { start, end } = getQuarterBounds(now)
    const ms = end.getTime() - start.getTime()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, Math.ceil(days / 7))
  }

  const getTargetForTimeframe = (): number => {
    const base = view === 'individual' ? individualQuarterTarget : teamQuarterTarget
    if (timeframe === 'quarter') return base
    if (timeframe === 'month') return Math.max(1, Math.round(base / 3))
    // week
    const weeks = getWeeksInQuarter(new Date())
    return Math.max(1, Math.round(base / weeks))
  }

  const placementsTarget = getTargetForTimeframe()
  const placementsValue = `${achieved}/${placementsTarget}`

  // Optional revenue target surfaced from onboarding settings
  const revenueTargetGBP = (() => {
    if (typeof window !== 'undefined') {
      try {
        const s = JSON.parse(localStorage.getItem('onboarding_settings') || 'null')
        return s?.targets?.revenueGBP as number | undefined
      } catch {}
    }
    return undefined
  })()

  const getDaysLeft = (): number => {
    const now = new Date()
    // Prefer user-provided quarter end from onboarding
    const stored = typeof window !== 'undefined' ? localStorage.getItem('onboarding_settings') : null
    if (stored) {
      try {
        const s = JSON.parse(stored)
        if (s && typeof s.quarterEndDate === 'string' && s.quarterEndDate) {
          const end = new Date(s.quarterEndDate + 'T23:59:59')
          const ms = end.getTime() - now.getTime()
          const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
          return Math.max(0, days)
        }
      } catch {}
    }
    // Fallback: calendar quarter end
    const q = Math.floor(now.getMonth() / 3)
    const endMonth = q * 3 + 2
    const end = new Date(now.getFullYear(), endMonth + 1, 0, 23, 59, 59, 999)
    const ms = end.getTime() - now.getTime()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const daysLeft = getDaysLeft()
  const timeLeftLabel = `Days left in Q: ${daysLeft}`

  return (
    <div className="hidden md:flex bg-white border-b border-gray-200 px-6 lg:px-8 py-4 items-center justify-between">
      {/* Left Section - Brand and Analytics */}
      <div className="flex items-center gap-4 md:gap-8">
        <div className="font-heading text-xl font-bold text-gray-900">
          Recruitment-Operations
        </div>

        <div className="hidden md:flex items-center gap-3 md:gap-4 text-sm">
          {/* View Selector */}
          <div className="relative">
            <button
              onClick={() => { setIsViewMenuOpen(v => !v); setIsAvatarMenuOpen(false); setIsTimeframeMenuOpen(false) }}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-white"
              title="Select view"
            >
              <span className="text-gray-600">View:</span>
              <span className="font-semibold text-gray-900 capitalize">{view}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {isViewMenuOpen && (
              <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                <button className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${view==='individual'?'font-semibold text-gray-900':'text-gray-700'}`} onClick={() => { setView('individual'); setIsViewMenuOpen(false) }}>Individual</button>
                <button
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${view==='team'?'font-semibold text-gray-900':'text-gray-700'}`}
                  onClick={() => {
                    if (workspaceTier==='team') { setView('team'); setIsViewMenuOpen(false) }
                    else { window.location.href='/billing' }
                  }}
                >
                  Team{workspaceTier!=='team' && <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">Upgrade</span>}
                </button>
              </div>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="relative">
            <button
              onClick={() => { setIsTimeframeMenuOpen(t => !t); setIsViewMenuOpen(false); setIsAvatarMenuOpen(false) }}
              className="flex items-center gap-2 px-2.5 py-1 h-8 rounded-md border border-gray-200 bg-gray-50 hover:bg-white"
              title="Select timeframe"
              aria-haspopup="menu"
              aria-expanded={isTimeframeMenuOpen}
            >
              <span className="text-gray-600">Timeframe:</span>
              <span className="font-semibold text-gray-900">{timeframeLabel}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {isTimeframeMenuOpen && (
              <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                {(['week','month','quarter'] as const).map(key => (
                  <button key={key} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${timeframe===key?'font-semibold text-gray-900':'text-gray-700'}`} onClick={() => { setTimeframe(key); setIsTimeframeMenuOpen(false) }}>{key[0].toUpperCase()+key.slice(1)}</button>
                ))}
              </div>
            )}
          </div>

          {/* Placements count by view */}
          <div className="flex items-center gap-2 px-2.5 py-1 h-8 rounded-md border border-gray-200 bg-gray-50" title="Placements in selected view and timeframe">
            <span className="text-gray-600">Placements:</span>
            <span className="font-semibold text-gray-900">{placementsValue}</span>
          </div>

        {typeof revenueTargetGBP === 'number' && revenueTargetGBP > 0 && (
          <div className="flex items-center gap-2 px-2.5 py-1 h-8 rounded-md border border-gray-200 bg-gray-50" title="Revenue target for the quarter">
            <span className="text-gray-600">Revenue target:</span>
            <span className="font-semibold text-gray-900">£{new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(revenueTargetGBP)}</span>
          </div>
        )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 h-8 rounded-md border border-gray-200 bg-gray-50" title="Time remaining in selected timeframe">
            <span className="text-orange-600 font-semibold">{timeLeftLabel}</span>
          </div>
        </div>

      </div>

      {/* Right Section - KPI and Avatar */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Overdue actions chip removed per request */}

        {canInvite() && (
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">Seats: {seatsUsed}/{seatsPurchased}</div>
            <button onClick={()=> window.dispatchEvent(new CustomEvent('open-invite-modal'))} className="px-3 py-1.5 rounded-md bg-accent-500 text-white text-sm hover:bg-accent-600" disabled={seatsLeft<=0}>
              {seatsLeft>0 ? 'Invite teammates' : 'No seats left'}
            </button>
          </div>
        )}
        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setIsAvatarMenuOpen(o => !o); setIsViewMenuOpen(false); setIsTimeframeMenuOpen(false) }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isAvatarMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="font-medium text-gray-900">John Smith</div>
                <div className="text-sm text-gray-500">john@company.com</div>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/profile'; setIsAvatarMenuOpen(false) }}>
                <User className="w-4 h-4" />
                Your Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('dashboard_view','team') } catch {}; window.location.href='/dashboard'; setIsAvatarMenuOpen(false) }}>
                <Users className="w-4 h-4" />
                Team Dashboard
              </button>

              {workspaceTier==='team' && (
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/team'; setIsAvatarMenuOpen(false) }}>
                  <Users className="w-4 h-4" />
                  Manage Team
                </button>
              )}

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/'; setIsAvatarMenuOpen(false) }}>
                <Zap className="w-4 h-4" />
                Switch Workspace
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/analytics'; setIsAvatarMenuOpen(false) }}>
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/settings'; setIsAvatarMenuOpen(false) }}>
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/billing'; setIsAvatarMenuOpen(false) }}>
                <CreditCard className="w-4 h-4" />
                Billing
                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Admin</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>{ window.location.href='/help'; setIsAvatarMenuOpen(false) }}>
                <HelpCircle className="w-4 h-4" />
                Help
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={()=>{ try { localStorage.clear() } catch {}; window.location.href='/' }}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile summary row */}
      <div className="md:hidden px-4 pt-2 pb-3">
        <div className="flex items-center gap-2.5 text-xs text-gray-700">
          {/* View Selector */}
          <div className="relative">
            <button
              onClick={() => { setIsViewMenuOpen(v => !v); setIsAvatarMenuOpen(false); setIsTimeframeMenuOpen(false) }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-white"
              title="Select view"
            >
              <span className="text-gray-600">View:</span>
              <span className="font-semibold text-gray-900 capitalize">{view}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {isViewMenuOpen && (
              <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                <button className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${view==='individual'?'font-semibold text-gray-900':'text-gray-700'}`} onClick={() => { setView('individual'); setIsViewMenuOpen(false) }}>Individual</button>
                <button className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${view==='team'?'font-semibold text-gray-900':'text-gray-700'}`} onClick={() => { setView('team'); setIsViewMenuOpen(false) }}>Team</button>
              </div>
            )}
          </div>
          <span className="opacity-30">•</span>
          {/* Timeframe Selector (compact) */}
          <div className="relative">
            <button
              onClick={() => { setIsTimeframeMenuOpen(t => !t); setIsViewMenuOpen(false); setIsAvatarMenuOpen(false) }}
              className="flex items-center gap-1.5 px-2 py-1 h-7 rounded-md border border-gray-200 bg-gray-50 hover:bg-white"
              title="Select timeframe"
            >
              <span className="text-gray-600">Timeframe:</span>
              <span className="font-semibold text-gray-900">{timeframeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {isTimeframeMenuOpen && (
              <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                {(['week','month','quarter'] as const).map(key => (
                  <button key={key} className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${timeframe===key?'font-semibold text-gray-900':'text-gray-700'}`} onClick={() => { setTimeframe(key); setIsTimeframeMenuOpen(false) }}>{key[0].toUpperCase()+key.slice(1)}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-2 h-7 border border-gray-200 bg-gray-50 text-gray-900 rounded-md">
            <span className="text-gray-600">Placements:</span>
            <span className="font-semibold">{placementsValue}</span>
          </div>
          {typeof revenueTargetGBP === 'number' && revenueTargetGBP > 0 && (
            <div className="flex items-center gap-2 px-2 h-7 border border-gray-200 bg-gray-50 text-gray-900 rounded-md">
              <span className="text-gray-600">Revenue target:</span>
              <span className="font-semibold">£{new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(revenueTargetGBP)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 h-7 border border-gray-200 bg-gray-50 text-orange-600 rounded-md">
            <span className="font-semibold">{timeLeftLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTopBar