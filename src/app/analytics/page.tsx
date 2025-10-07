"use client"
import React from 'react'
import { trackEvent } from '@/lib/metrics'
import { useWorkspace } from '@/components/WorkspaceProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  ReferenceLine,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const AnalyticsInner: React.FC = () => {
  const { view, setView, workspaceTier } = useWorkspace()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [range, setRange] = React.useState<'month'|'quarter'|'year'|'all'>('quarter')
  // simplified analytics: focused tiles
  const [summary, setSummary] = React.useState<any>(null)
  const [heat, setHeat] = React.useState<Array<{ d: string; v: number }>>([])
  const [leadersTeam, setLeadersTeam] = React.useState<Array<{ userId: string; placements: number }>>([])
  const [lbTeamOffset] = React.useState(0)

  // no dropdowns in simplified view

  React.useEffect(() => {
    fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: [] }) })
      .catch(()=>{})
    try { trackEvent('analytics_viewed', { range, view }) } catch {}
  }, [])

  React.useEffect(() => {
    if (workspaceTier !== 'team' && view === 'team') setView('individual')
  }, [workspaceTier])

  // Initialize from URL
  React.useEffect(() => {
    const r = searchParams.get('range') as any
    const v = searchParams.get('view') as any
    if (r && ['month','quarter','year','all'].includes(r)) setRange(r)
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
  const { data: swrHeat } = useSWR(qsBase ? `/api/analytics/heatmap${qsBase}&metric=stage_moves` : null, fetcher)
  const { data: swrLbT } = useSWR(qsBase ? `/api/analytics/leaderboard${qsBase}&type=teammates&limit=8&offset=${lbTeamOffset}` : null, fetcher)
  const { data: swrPlacementsTs } = useSWR(workspaceId ? `/api/analytics/timeseries?workspaceId=${encodeURIComponent(workspaceId)}&metric=placements&range=quarter` : null, fetcher)

  React.useEffect(() => { setSummary(swrSummary || null) }, [swrSummary])
  React.useEffect(() => { setHeat(swrHeat?.cells || []) }, [swrHeat])
  React.useEffect(() => { setLeadersTeam(swrLbT?.rows || []) }, [swrLbT])

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

  const Sparkline: React.FC<{ data?: Array<{ t: string; v: number }> }> = ({ data }) => {
    const rows = (data && data.length>0 ? data : Array.from({length:12}).map((_,i)=>({ t: String(i), v: Math.max(0, Math.round(10+5*Math.sin(i))) })) )
    return (
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <Area type="monotone" dataKey="v" stroke={brandColors.accent} fill={brandColors.accent} fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
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

  const Gauge: React.FC<{ pct: number }> = ({ pct }) => {
    const value = Math.max(0, Math.min(100, pct||0))
    const data = [{ value }, { value: 100 - value }]
    const colors = [brandColors.success, brandColors.gray200]
    return (
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} startAngle={180} endAngle={0} innerRadius={55} outerRadius={70} dataKey="value" stroke="none">
              {data.map((_,i)=> <Cell key={i} fill={colors[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const BarLeaders: React.FC<{ rows: Array<{ userId: string; placements: number }> }> = ({ rows }) => {
    const data = (rows || []).slice(0,8).map(r=> ({ name: r.userId?.slice(0,6) || '—', v: r.placements || 0 }))
    return (
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} width={24} tick={{ fontSize: 12 }} />
            <Bar dataKey="v" fill={brandColors.accent} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const Heatmap: React.FC<{ cells: Array<{ d: string; v: number }> }> = ({ cells }) => {
    // Build a contiguous 12x7 (84-day) window ending today
    const today = new Date()
    const start = new Date(today)
    start.setHours(0,0,0,0)
    start.setDate(start.getDate() - 83)
    const valueByDate = new Map<string, number>()
    for (const c of (cells || [])) valueByDate.set(c.d, c.v)
    const days: Array<{ d: string; v: number }> = []
    for (let i=0;i<84;i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const iso = d.toISOString().slice(0,10)
      days.push({ d: iso, v: valueByDate.get(iso) || 0 })
    }
    const vals = days.map(c => c.v)
    const max = Math.max(...vals, 1)
    // Gentle scale so a few large values don't wash out the rest
    const bucket = (v: number) => Math.min(4, Math.floor(Math.sqrt(v / max) * 4))
    const ramp = ['bg-gray-100','bg-blue-100','bg-blue-300','bg-blue-500','bg-blue-700']
    const dayLabels = ['M','','W','','F','','']

    return (
      <div>
        <div className="flex items-start gap-2">
          {/* Y axis labels (Mon/Wed/Fri) */}
          <div className="flex flex-col gap-1 pt-4">
            {dayLabels.map((lbl, i) => (
              <div key={i} className="h-4 text-[10px] text-gray-400 leading-4">{lbl}</div>
            ))}
          </div>
          {/* Heatmap grid: 12 columns x 7 rows */}
          <div className="grid grid-cols-12 gap-1 flex-1">
            {Array.from({ length: 12 }).map((_, col) => (
              <div key={col} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((__, row) => {
                  const idx = col*7 + row
                  const cell = days[idx]
                  const cls = ramp[bucket(cell.v)]
                  return (
                    <div
                      key={row}
                      className={`w-full aspect-square rounded ${cls} hover:ring-1 hover:ring-blue-400 cursor-pointer`}
                      title={`${cell.d}: ${cell.v}`}
                      onClick={()=>{ try { trackEvent('analytics_heat_click', { date: cell.d, value: cell.v }) } catch {} }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
          <span>Low</span>
          <span className="w-4 h-2 rounded bg-gray-100" />
          <span className="w-4 h-2 rounded bg-blue-100" />
          <span className="w-4 h-2 rounded bg-blue-300" />
          <span className="w-4 h-2 rounded bg-blue-500" />
          <span className="w-4 h-2 rounded bg-blue-700" />
          <span>High</span>
          <span className="ml-2">(max {max})</span>
        </div>
      </div>
    )
  }

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
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
            <option value="all">All time</option>
          </select>
          </div>
        </div>
        {/* KPI strip with simplified Placements tile */}
        <div className="grid md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between">
              <div className="text-xs text-gray-500">Placements</div>
              <select value={range} onChange={(e)=> setRange(e.target.value as any)} className="text-xs border border-gray-200 rounded px-1 py-0.5">
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="mt-2 text-4xl font-extrabold text-gray-900 text-center">
              {summary?.kpis?.placementsRange ?? summary?.kpis?.placementsQTD ?? 0}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Weighted pipeline</div>
            <div className="text-xl font-semibold text-gray-900">{typeof summary?.kpis?.weightedPipelineGBP==='number' ? new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(summary.kpis.weightedPipelineGBP/100) : '—'}</div>
            <Sparkline data={summary?.sparks?.pipeline} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Cycle time P50/P90</div>
            <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.cycleTimeP50Days ?? '—'}<span className="text-gray-400 text-base">d</span> / {summary?.kpis?.cycleTimeP90Days ?? '—'}<span className="text-gray-400 text-base">d</span></div>
            <Sparkline data={summary?.sparks?.cycle} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">SLA adherence</div>
            <div className="text-2xl font-semibold text-gray-900">{typeof summary?.kpis?.slaPct==='number' ? `${summary.kpis.slaPct}%` : '—'}</div>
            <Sparkline data={summary?.sparks?.sla} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">On‑time follow‑ups</div>
            <div className="text-2xl font-semibold text-gray-900">{typeof summary?.kpis?.followupOnTimePct==='number' ? `${summary.kpis.followupOnTimePct}%` : '—'}</div>
            <Sparkline data={summary?.sparks?.followups} />
          </div>
        </div>

        {/* Optional secondary KPIs could go here (kept minimal for v1) */}

        {/* Funnel + Stage distribution + SLA gauge */}
        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">Stage distribution</div>
            <Donut parts={summary?.stageDistribution || []} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">SLA adherence</div>
            <Gauge pct={summary?.kpis?.slaPct ?? 0} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">Cumulative placements (quarter)</div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(swrPlacementsTs?.points || []).reduce((acc: Array<{t:string; v:number}>, p: {t:string; v:number}) => {
                  const last = acc.length ? acc[acc.length-1].v : 0
                  acc.push({ t: p.t, v: last + (p.v || 0) })
                  return acc
                }, [])} margin={{ top: 4, right: 8, left: 8, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} hide={false} />
                  <YAxis allowDecimals={false} width={28} tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="v" stroke={brandColors.accent} strokeWidth={2} dot={false} />
                  {(() => {
                    let target = 0
                    try {
                      const s = JSON.parse(localStorage.getItem('onboarding_settings') || 'null')
                      target = Number(s?.targets?.individualPlacements || 0)
                    } catch {}
                    return target > 0 ? <ReferenceLine y={target} stroke={brandColors.gray400} strokeDasharray="4 4" label={{ value: `Target ${target}`, position: 'right', fill: '#6b7280', fontSize: 11 }} /> : null
                  })()}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stage aging heatmap */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium text-gray-800 mb-2">Activity heatmap</div>
          <Heatmap cells={heat} />
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


