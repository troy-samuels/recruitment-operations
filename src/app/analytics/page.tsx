"use client"
import React from 'react'
import { trackEvent } from '@/lib/metrics'
import { useWorkspace } from '@/components/WorkspaceProvider'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import useSWR from 'swr'

const AnalyticsInner: React.FC = () => {
  const { view, setView, workspaceTier } = useWorkspace()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [range, setRange] = React.useState<'7d'|'30d'|'90d'>('30d')
  const [events, setEvents] = React.useState<Array<{ name: string; ts: number; props?: any }>>([])
  const [filterDay, setFilterDay] = React.useState<string | null>(null)
  const [summary, setSummary] = React.useState<any>(null)
  const [series, setSeries] = React.useState<Array<{ t: string; v: number }>>([])
  const [seriesPrev, setSeriesPrev] = React.useState<Array<{ t: string; v: number }>>([])
  const [heat, setHeat] = React.useState<Array<{ d: string; v: number }>>([])
  const [leadersTeam, setLeadersTeam] = React.useState<Array<{ userId: string; placements: number }>>([])
  const [leadersCompany, setLeadersCompany] = React.useState<Array<{ company: string; conversionPct: number; placements: number }>>([])
  const [lbTeamTotal, setLbTeamTotal] = React.useState(0)
  const [lbCompanyTotal, setLbCompanyTotal] = React.useState(0)
  const [lbTeamOffset, setLbTeamOffset] = React.useState(0)
  const [lbCompanyOffset, setLbCompanyOffset] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [metric, setMetric] = React.useState<'placements'|'interviews'|'cv_sent'|'tasks_completed'>('placements')
  const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false)
  const [isManageMenuOpen, setIsManageMenuOpen] = React.useState(false)

  // Close dropdowns on outside click
  React.useEffect(() => {
    const onDocClick = () => { setIsExportMenuOpen(false); setIsManageMenuOpen(false) }
    window.addEventListener('click', onDocClick)
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setIsExportMenuOpen(false); setIsManageMenuOpen(false) } }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('click', onDocClick)
  }, [])

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
    const m = searchParams.get('metric') as any
    const v = searchParams.get('view') as any
    if (r && ['7d','30d','90d'].includes(r)) setRange(r)
    if (m && ['placements','interviews','cv_sent','tasks_completed'].includes(m)) setMetric(m)
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
    qs.set('metric', metric)
    qs.set('view', view)
    router.replace(`/analytics?${qs.toString()}`)
  }, [range, metric, view, router])

  // SWR-based caching for analytics data
  const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const qsBase = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}&range=${range}` : null
  const { data: swrSummary } = useSWR(qsBase ? `/api/analytics/summary${qsBase}` : null, fetcher)
  const { data: swrTs } = useSWR(qsBase ? `/api/analytics/timeseries${qsBase}&metric=${metric}` : null, fetcher)
  const { data: swrTsPrev } = useSWR(qsBase ? `/api/analytics/timeseries${qsBase}&metric=${metric}&prev=1` : null, fetcher)
  const { data: swrHeat } = useSWR(qsBase ? `/api/analytics/heatmap${qsBase}&metric=stage_moves` : null, fetcher)
  const { data: swrLbT } = useSWR(qsBase ? `/api/analytics/leaderboard${qsBase}&type=teammates&limit=8&offset=${lbTeamOffset}` : null, fetcher)
  const { data: swrLbC } = useSWR(qsBase ? `/api/analytics/leaderboard${qsBase}&type=companies&limit=10&offset=${lbCompanyOffset}` : null, fetcher)

  React.useEffect(() => { setSummary(swrSummary || null) }, [swrSummary])
  React.useEffect(() => { setSeries(swrTs?.points || []); setSeriesPrev(swrTsPrev?.points || []) }, [swrTs, swrTsPrev])
  React.useEffect(() => { setHeat(swrHeat?.cells || []) }, [swrHeat])
  React.useEffect(() => { setLeadersTeam(swrLbT?.rows || []); setLbTeamTotal(swrLbT?.total || 0) }, [swrLbT])
  React.useEffect(() => { setLeadersCompany(swrLbC?.rows || []); setLbCompanyTotal(swrLbC?.total || 0) }, [swrLbC])

  const exportCsv = () => {
    const header = 'name,ts\n'
    const rows = events.map(e => `${e.name},${new Date(e.ts).toISOString()}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${view}_${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const TimeseriesChart: React.FC<{ data: Array<{ t: string; v: number }>, compare?: Array<{ t: string; v: number }> }> = ({ data, compare }) => {
    if (!data || data.length === 0) return <div className="text-xs text-gray-500">No data</div>
    const rows = data.map(d => ({ t: d.t.slice(5), v: d.v, v2: 0 }))
    if (compare && compare.length === rows.length) {
      for (let i=0;i<rows.length;i++) rows[i].v2 = compare[i].v
    }
    return (
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="t" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} width={28} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val, name)=>[val as any, name==='v'?'Current':'Previous']} labelFormatter={(l)=>`Date: ${l}`} />
            <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
            {compare && compare.length>0 && <Line type="monotone" dataKey="v2" stroke="#94a3b8" strokeDasharray="4 3" dot={false} />}
          </LineChart>
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
                      onClick={async ()=>{
                        setFilterDay(cell.d)
                        try {
                          const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
                          if (!workspaceId) return
                          const q = new URLSearchParams({ workspaceId, date: cell.d, metric })
                          const res = await fetch(`/api/analytics/events?${q.toString()}`)
                          const j = await res.json()
                          if (res.ok && Array.isArray(j?.events)) {
                            setEvents(j.events.map((e: any) => ({ name: e.name, ts: new Date(e.ts).getTime(), props: { company: e.company, stage: e.stage } })))
                          }
                        } catch {}
                      }}
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
              <div className="relative" onClick={(e)=> e.stopPropagation()}>
                <button onClick={(e)=>{ e.stopPropagation(); setIsManageMenuOpen(v=>!v); setIsExportMenuOpen(false) }} className="text-sm px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50 flex items-center gap-1">Manage <ChevronDown className="w-3.5 h-3.5 text-gray-600" /></button>
                {isManageMenuOpen && (
                  <div className="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                    <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50" onClick={()=>{ window.location.href='/settings'; setIsManageMenuOpen(false) }}>Settings</button>
                    <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50" onClick={()=>{ window.location.href='/billing'; setIsManageMenuOpen(false) }}>Billing</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={view} onChange={(e)=> setView(e.target.value as any)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="individual">Individual</option>
              {workspaceTier==='team' && <option value="team">Team</option>}
            </select>
            <select value={range} onChange={(e)=> setRange(e.target.value as any)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <select value={metric} onChange={(e)=> setMetric(e.target.value as any)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="placements">Placements</option>
              <option value="interviews">Interviews</option>
              <option value="cv_sent">CVs Sent</option>
              <option value="tasks_completed">Tasks Completed</option>
            </select>
            <div className="relative" onClick={(e)=> e.stopPropagation()}>
              <button onClick={(e)=>{ e.stopPropagation(); setIsExportMenuOpen(v=>!v); setIsManageMenuOpen(false) }} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-1">Export <ChevronDown className="w-3.5 h-3.5 text-gray-600" /></button>
              {isExportMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1">
                  <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50" onClick={()=>{ exportCsv(); setIsExportMenuOpen(false) }}>Export CSV</button>
                  <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50" onClick={()=>{ window.print(); setIsExportMenuOpen(false) }}>Print report</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Placements (QTD)</div>
            <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.placementsQTD ?? 0}</div>
            {!summary && <div className="text-xs text-gray-400 mt-1">No data</div>}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Roles in progress</div>
            <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.rolesInProgress ?? 0}</div>
            {!summary && <div className="text-xs text-gray-400 mt-1">No data</div>}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Urgent actions</div>
            <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.urgentCount ?? 0}</div>
            {!summary && <div className="text-xs text-gray-400 mt-1">No data</div>}
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Placements (range)</div>
                <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.placementsRange ?? 0}</div>
              </div>
              {typeof summary?.deltas?.placementsRangePct === 'number' && (
                <span className={`text-xs px-2 py-1 rounded-full ${summary.deltas.placementsRangePct>=0?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>
                  {summary.deltas.placementsRangePct>=0?'+':''}{summary.deltas.placementsRangePct}%
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Interviews (range)</div>
                <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.interviewsRange ?? 0}</div>
              </div>
              {typeof summary?.deltas?.interviewsRangePct === 'number' && (
                <span className={`text-xs px-2 py-1 rounded-full ${summary.deltas.interviewsRangePct>=0?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>
                  {summary.deltas.interviewsRangePct>=0?'+':''}{summary.deltas.interviewsRangePct}%
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">CVs Sent (range)</div>
                <div className="text-2xl font-semibold text-gray-900">{summary?.kpis?.cvSentRange ?? 0}</div>
              </div>
              {typeof summary?.deltas?.cvSentRangePct === 'number' && (
                <span className={`text-xs px-2 py-1 rounded-full ${summary.deltas.cvSentRangePct>=0?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>
                  {summary.deltas.cvSentRangePct>=0?'+':''}{summary.deltas.cvSentRangePct}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800 capitalize">{metric.replace('_',' ')} over time</div>
            </div>
            <TimeseriesChart data={series} compare={seriesPrev} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">Quarter progress</div>
            <div className="text-sm text-gray-600">Days left in Q: <span className="font-semibold">{summary?.kpis?.daysLeftInQuarter ?? '-'}</span></div>
            <div className="mt-3 h-2 w-full bg-gray-100 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${summary?.kpis?.quarterProgressPct || 0}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 lg:col-span-2">
            <div className="text-sm font-medium text-gray-800 mb-2">Activity heatmap</div>
            <Heatmap cells={heat} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">Teammates (placements)</div>
            <div className="space-y-2 text-sm">
              {leadersTeam.length === 0 && <div className="text-gray-500">No data</div>}
              {[...leadersTeam].sort((a,b)=> b.placements - a.placements).slice(0,8).map((r, i) => (
                <div key={r.userId || i} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1"
                     onClick={async ()=>{
                       try {
                         const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
                         if (!workspaceId) return
                         const q = new URLSearchParams({ workspaceId, range, metric, userId: r.userId || '' })
                         const res = await fetch(`/api/analytics/events?${q.toString()}`)
                         const j = await res.json()
                         if (res.ok && Array.isArray(j?.events)) {
                           setFilterDay(null)
                           setEvents(j.events.map((e: any) => ({ name: e.name, ts: new Date(e.ts).getTime(), props: { company: e.company, stage: e.stage } })))
                         }
                       } catch {}
                     }}
                >
                  <span className="text-gray-700">{r.userId?.slice(0,8) || 'unknown'}</span>
                  <span className="font-medium text-gray-900">{r.placements}</span>
                </div>
              ))}
              <div className="pt-2 flex items-center gap-2">
                <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled={lbTeamOffset<=0} onClick={()=> setLbTeamOffset(Math.max(0, lbTeamOffset - 8))}>Prev</button>
                <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled={!(lbTeamTotal > lbTeamOffset + leadersTeam.length)} onClick={()=> setLbTeamOffset(lbTeamOffset + 8)}>Next</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-800 mb-2">Companies (conversion)</div>
            <div className="space-y-2 text-sm">
              {leadersCompany.length === 0 && <div className="text-gray-500">No data</div>}
              {[...leadersCompany].sort((a,b)=> b.conversionPct - a.conversionPct).slice(0,10).map((r, i) => (
                <div key={r.company || i} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1"
                     onClick={async ()=>{
                       try {
                         const workspaceId = (typeof window !== 'undefined' && localStorage.getItem('workspace_id')) || ''
                         if (!workspaceId) return
                         const q = new URLSearchParams({ workspaceId, range, metric, company: r.company })
                         const res = await fetch(`/api/analytics/events?${q.toString()}`)
                         const j = await res.json()
                         if (res.ok && Array.isArray(j?.events)) {
                           setFilterDay(null)
                           setEvents(j.events.map((e: any) => ({ name: e.name, ts: new Date(e.ts).getTime(), props: { company: e.company, stage: e.stage } })))
                         }
                       } catch {}
                     }}
                >
                  <span className="text-gray-700">{r.company}</span>
                  <span className="font-medium text-gray-900">{r.conversionPct}%</span>
                </div>
              ))}
              <div className="pt-2 flex items-center gap-2">
                <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled={lbCompanyOffset<=0} onClick={()=> setLbCompanyOffset(Math.max(0, lbCompanyOffset - 10))}>Prev</button>
                <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled={!(lbCompanyTotal > lbCompanyOffset + leadersCompany.length)} onClick={()=> setLbCompanyOffset(lbCompanyOffset + 10)}>Next</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-800">{filterDay ? `Activity on ${filterDay}` : 'Recent activity'}</div>
            {filterDay && <button className="text-xs text-blue-600 hover:text-blue-700" onClick={()=>{ setFilterDay(null); setEvents([]) }}>Clear</button>}
          </div>
          <div className="space-y-2 max-h-[40vh] overflow-auto">
            {events.length === 0 && (
              <div className="text-sm text-gray-500">No activity yet.</div>
            )}
            {events.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="text-gray-800">{e.name}{e?.props?.company ? ` • ${e.props.company}` : ''}{e?.props?.stage ? ` • ${e.props.stage}` : ''}</div>
                <div className="text-gray-500">{new Date(e.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
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


