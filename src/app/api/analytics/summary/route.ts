import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const range = (searchParams.get('range') || '30d') as '7d'|'30d'|'90d'
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()

    // Quarter dates (approximate: calendar quarter)
    const now = new Date()
    const q = Math.floor(now.getMonth() / 3)
    const quarterStart = new Date(now.getFullYear(), q * 3, 1)
    const quarterEnd = new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999)

    // Placements QTD
    const { count: placementsQTD } = await admin
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('ts', quarterStart.toISOString())
      .lte('ts', quarterEnd.toISOString())

    // Range placements and delta vs previous equal-length window
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const start = new Date(now)
    start.setDate(now.getDate() - days + 1)
    const prevEnd = new Date(start)
    prevEnd.setDate(start.getDate() - 1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevEnd.getDate() - days + 1)

    const { data: curRows } = await admin
      .from('events_daily_counts')
      .select('ct, day')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('day', start.toISOString())
      .lte('day', now.toISOString())
    const { data: prevRows } = await admin
      .from('events_daily_counts')
      .select('ct, day')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('day', prevStart.toISOString())
      .lte('day', prevEnd.toISOString())
    const placementsRange = (curRows || []).reduce((s, r) => s + (r as any).ct, 0)
    const placementsPrev = (prevRows || []).reduce((s, r) => s + (r as any).ct, 0)
    const placementsRangeDelta = placementsRange - placementsPrev
    const placementsRangePct = placementsPrev === 0 ? (placementsRange > 0 ? 100 : 0) : Math.round(((placementsRange - placementsPrev) / Math.max(1, placementsPrev)) * 100)

    // Interviews and CVs sent (range + deltas)
    const fetchMetricTotal = async (eventName: string) => {
      const { data: cur } = await admin
        .from('events_daily_counts')
        .select('ct, day')
        .eq('workspace_id', workspaceId)
        .eq('event_name', eventName)
        .gte('day', start.toISOString())
        .lte('day', now.toISOString())
      const { data: prev } = await admin
        .from('events_daily_counts')
        .select('ct, day')
        .eq('workspace_id', workspaceId)
        .eq('event_name', eventName)
        .gte('day', prevStart.toISOString())
        .lte('day', prevEnd.toISOString())
      const curTotal = (cur || []).reduce((s, r) => s + (r as any).ct, 0)
      const prevTotal = (prev || []).reduce((s, r) => s + (r as any).ct, 0)
      const delta = curTotal - prevTotal
      const pct = prevTotal === 0 ? (curTotal > 0 ? 100 : 0) : Math.round(((curTotal - prevTotal) / Math.max(1, prevTotal)) * 100)
      return { curTotal, delta, pct }
    }

    const [intv, cvs] = await Promise.all([
      fetchMetricTotal('interview_scheduled'),
      fetchMetricTotal('cv_sent'),
    ])

    // Roles in progress (fallback uses roles.status)
    const { count: rolesInProgress } = await admin
      .from('roles')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .not('status', 'in', '("closed","lost")')

    // Urgent actions
    const { count: urgentCount } = await admin
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('priority', ['high', 'urgent'])

    // Quarter progress
    const quarterProgressPct = Math.min(100, Math.max(0, Math.round(((now.getTime() - quarterStart.getTime()) / (quarterEnd.getTime() - quarterStart.getTime())) * 100)))
    const daysLeftInQuarter = Math.max(0, Math.ceil((quarterEnd.getTime() - now.getTime()) / (24 * 3600 * 1000)))

    return NextResponse.json({
      kpis: {
        placementsQTD: placementsQTD ?? 0,
        rolesInProgress: rolesInProgress ?? 0,
        urgentCount: urgentCount ?? 0,
        placementsRange,
        interviewsRange: intv.curTotal,
        cvSentRange: cvs.curTotal,
        quarterProgressPct,
        daysLeftInQuarter,
      },
      deltas: {
        placementsRangeDelta,
        placementsRangePct,
        interviewsRangeDelta: intv.delta,
        interviewsRangePct: intv.pct,
        cvSentRangeDelta: cvs.delta,
        cvSentRangePct: cvs.pct,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


