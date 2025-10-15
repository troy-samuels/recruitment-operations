"use client"
import React from 'react'
import { trackEvent } from '@/lib/metrics'
import { useWorkspace } from '@/components/WorkspaceProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

type RangeKey = 'week' | 'month' | 'year' | 'all'

const AnalyticsInner: React.FC = () => {
  const { view, setView, workspaceTier } = useWorkspace()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [range, setRange] = React.useState<RangeKey>('month')
  // simplified analytics: focused tiles
  const [summary, setSummary] = React.useState<any>(null)
  const initialRangeRef = React.useRef(range)
  const initialViewRef = React.useRef(view)

  // no dropdowns in simplified view

  React.useEffect(() => {
    fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: [] }) })
      .catch(()=>{})
    try { trackEvent('analytics_viewed', { range: initialRangeRef.current, view: initialViewRef.current }) } catch {}
  }, [])
  React.useEffect(() => {
    if (workspaceTier !== 'team' && view === 'team') setView('individual')
  }, [workspaceTier, view, setView])

  // Initialize from URL
  React.useEffect(() => {
    const r = searchParams.get('range') as any
    const v = searchParams.get('view') as any
    if (r && ['week','month','year','all'].includes(r)) setRange(r)
    if (v && ['individual','team'].includes(v)) {
      if (v === 'team' && workspaceTier !== 'team') {
        // ignore if not allowed
      } else {
        setView(v)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist filters to URL
  React.useEffect(() => {
    const qs = new URLSearchParams()
    qs.set('range', range)
    qs.set('view', view)
    router.replace(`/analytics?${qs.toString()}`)
  }, [range, view, router])

  // SWR-based caching for analytics data
  const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const qsBase = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}&range=${range}` : null
  const { data: swrSummary } = useSWR(qsBase ? `/api/analytics/summary${qsBase}` : null, fetcher)
  const { data: swrStageDuration } = useSWR(qsBase ? `/api/analytics/stage-duration${qsBase}` : null, fetcher)

  React.useEffect(() => { setSummary(swrSummary || null) }, [swrSummary])

  // exports trimmed in v1; can add later per-table

  // timeseries removed in simplified v1

  // Visual helpers
  const brandColors = {
    primary: '#152B3C',
    accent: '#D46240',
    success: '#2F906A',
    blue100: '#dbeafe',
    blue500: '#3b82f6',
    gray200: '#e5e7eb',
    gray400: '#9ca3af',
  }

  const Donut: React.FC<{ parts: Array<{ name: string; value: number }> }> = ({ parts }) => {
    const data = parts && parts.length>0 ? parts : [
      { name: 'New', value: 4 },
      { name: 'Contacted', value: 6 },
      { name: 'Interview', value: 3 },
      { name: 'Placed', value: 2 },
    ]
    const colors = [brandColors.blue100, '#c7d2fe', '#fde68a', '#bbf7d0']
    return (
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} stroke="#fff" strokeWidth={1}>
              {data.map((_,i)=> <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const rangeLabels: Record<RangeKey, string> = {
    week: 'Past 7 days',
    month: 'Past 30 days',
    year: 'Past 365 days',
    all: 'All time',
  }
  const compareLabelMap: Record<RangeKey, string> = {
    week: 'last week',
    month: 'last month',
    year: 'last year',
    all: 'previous period',
  }
  const stageStats: Array<any> = swrStageDuration?.stages || []
  const totalRolesTracked = swrStageDuration?.totalRoles || 0
  const currencyFormatter = React.useMemo(
    () => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
    []
  )
  const placementsCount = Number(summary?.kpis?.placementsRange ?? summary?.kpis?.placementsQTD ?? 0)
  const placementsCommissionValue = currencyFormatter.format(Number(summary?.kpis?.placementsCommissionRange ?? 0))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-gray-900">Analytics</h1>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={()=>{ window.location.href='/dashboard' }} className="text-sm px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Back to Dashboard</button>
              {workspaceTier==='team' && (
                <button onClick={()=>{ try { localStorage.setItem('dashboard_view','team') } catch {}; window.location.href='/dashboard' }} className="text-sm px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Team Dashboard</button>
              )}
            </div>
          </div>
        <div className="flex items-center gap-2">
          <select value={view} onChange={(e)=> setView(e.target.value as any)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="individual">Individual</option>
              {workspaceTier==='team' && <option value="team">Team</option>}
            </select>
          <select value={range} onChange={(e)=> setRange(e.target.value as any)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="all">All time</option>
          </select>
          </div>
        </div>
        {/* Placements + Stage Performance */}
        <div className="mt-6 grid gap-4 xl:grid-cols-[280px_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <div className="text-xs uppercase tracking-wide text-gray-500">Placements</div>
            <div className="text-5xl font-extrabold text-gray-900">
              {placementsCount}
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {placementsCommissionValue}
            </div>
            <div className="text-xs text-gray-400">
              Range: {rangeLabels[range]}
            </div>
          </div>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Stage Performance</h2>
                <p className="text-xs text-gray-500">
                  Average time per kanban column • {rangeLabels[range]}
                </p>
              </div>
              {totalRolesTracked > 0 && (
                <div className="text-xs text-gray-500">
                  {totalRolesTracked} {totalRolesTracked === 1 ? 'role' : 'roles'} analysed
                  {typeof swrStageDuration?.overallAvgDays === 'number' && swrStageDuration.overallAvgDays > 0 && (
                    <span className="ml-2 text-gray-400">
                      overall avg {swrStageDuration.overallAvgDays}d
                    </span>
                  )}
                </div>
              )}
            </div>

            {stageStats.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stageStats.map((stage: any, idx: number) => {
                  const delta = typeof stage.deltaPct === 'number' ? stage.deltaPct : null
                  const direction = delta === null ? 'neutral' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
                  const compareLabel = compareLabelMap[range]
                  const previousAvg = typeof stage.prevAvgDays === 'number' ? stage.prevAvgDays : null
                  const palette = [
                    { bg: 'bg-blue-50', text: 'text-blue-600' },
                    { bg: 'bg-emerald-50', text: 'text-emerald-600' },
                    { bg: 'bg-amber-50', text: 'text-amber-600' },
                    { bg: 'bg-purple-50', text: 'text-purple-600' },
                    { bg: 'bg-sky-50', text: 'text-sky-600' },
                    { bg: 'bg-rose-50', text: 'text-rose-600' },
                    { bg: 'bg-slate-100', text: 'text-slate-600' },
                  ]
                  const colors = palette[idx % palette.length]
                  const deltaColor =
                    direction === 'neutral'
                      ? 'text-gray-400'
                      : direction === 'down'
                        ? 'text-emerald-600'
                        : direction === 'flat'
                          ? 'text-gray-500'
                          : 'text-rose-600'
                  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : direction === 'flat' ? '→' : ''

                  return (
                    <div key={stage.stage} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors.bg}`}>
                            <span className={`text-sm font-semibold ${colors.text}`}>
                              {(stage.stageName || stage.stage || '').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500">Column</div>
                            <div className="text-sm font-semibold text-gray-900">{stage.stageName}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {stage.rolesCount || 0} {stage.rolesCount === 1 ? 'role' : 'roles'}
                        </div>
                      </div>

                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {stage.avgDays}
                          <span className="ml-1 text-base font-medium text-gray-400">d</span>
                        </span>
                        {typeof stage.medianDays === 'number' && (
                          <span className="text-xs text-gray-400">median {stage.medianDays}d</span>
                        )}
                      </div>

                      <div className="mt-3 text-sm">
                        {delta === null ? (
                          <span className="text-gray-400">No prior data for comparison</span>
                        ) : (
                          <span className={`font-semibold ${deltaColor}`}>
                            {arrow && <span className="mr-1 align-middle">{arrow}</span>}
                            {Math.abs(delta).toFixed(1)}%
                            <span className="ml-1 font-normal text-gray-500">
                              vs {range === 'all' ? 'previous period' : compareLabel}
                            </span>
                          </span>
                        )}
                      </div>

                      {previousAvg !== null && (
                        <div className="mt-1 text-xs text-gray-400">
                          Prev avg {previousAvg}d
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
                No stage movement data yet. Move roles through your pipeline to see column insights.
              </div>
            )}
          </section>
        </div>

        {/* Stage distribution overview */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-800 mb-2">Stage distribution</div>
          <Donut parts={summary?.stageDistribution || []} />
        </div>

        {/* Companies leaderboard and activity feed removed in v1 */}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>}>
      <AnalyticsInner />
    </React.Suspense>
  )
}
