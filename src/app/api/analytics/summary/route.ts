import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

type RangeKey = 'week' | 'month' | 'quarter' | 'year' | 'all'

const mapRange = (raw: string): RangeKey => {
  const normalized = raw.toLowerCase()
  if (normalized === 'week' || normalized === '7d') return 'week'
  if (normalized === 'month' || normalized === '30d') return 'month'
  if (normalized === 'quarter' || normalized === '90d') return 'quarter'
  if (normalized === 'year' || normalized === '365d') return 'year'
  if (normalized === 'all') return 'all'
  return 'month'
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const range = mapRange(searchParams.get('range') || 'month')
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()

    const parseNumeric = (value: any): number => {
      if (value === null || value === undefined) return 0
      const num = Number(value)
      return Number.isFinite(num) ? num : 0
    }

    const computeRoleCommission = (role: any): number => {
      const feeAmount = parseNumeric(role.fee_amount)
      if (feeAmount > 0) return feeAmount

      const feePct = parseNumeric(role.fee_percentage)
      if (feePct <= 0) return 0

      const salaryMin = parseNumeric(role.salary_min)
      const salaryMax = parseNumeric(role.salary_max)
      let base = 0

      if (salaryMin > 0 && salaryMax > 0) {
        base = (salaryMin + salaryMax) / 2
      } else {
        base = salaryMax > 0 ? salaryMax : salaryMin
      }

      if (base <= 0) {
        const dayRate = parseNumeric(role.contract_day_rate)
        if (dayRate > 0) {
          base = dayRate * 20 // rough monthly conversion
        }
      }

      if (base <= 0) return 0
      return base * (feePct / 100)
    }

    const sumCommissionForWindow = async (windowStart: Date, windowEnd: Date): Promise<number> => {
      const { data: placementEvents, error: placementError } = await admin
        .from('events')
        .select('role_id')
        .eq('workspace_id', workspaceId)
        .eq('event_name', 'placement_created')
        .gte('ts', windowStart.toISOString())
        .lte('ts', windowEnd.toISOString())

      if (placementError || !placementEvents || placementEvents.length === 0) return 0

      const roleIds = Array.from(
        new Set(
          (placementEvents as Array<{ role_id: string | null }>).map(evt => evt.role_id).filter(Boolean) as string[]
        )
      )
      if (roleIds.length === 0) return 0

      const { data: rolesData, error: rolesError } = await admin
        .from('roles')
        .select('id, fee_amount, fee_percentage, salary_min, salary_max, contract_day_rate')
        .in('id', roleIds)

      if (rolesError || !rolesData) return 0

      let total = 0
      for (const role of rolesData) {
        total += computeRoleCommission(role)
      }
      return Number(total.toFixed(2))
    }

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
    const daysByRange: Record<Exclude<RangeKey, 'all'>, number> = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    }
    const useAllTime = range === 'all'
    const days = useAllTime ? null : daysByRange[range]
    const start = new Date(now)
    let prevStart: Date | null = null
    let prevEnd: Date | null = null

    if (useAllTime) {
      start.setFullYear(2020, 0, 1)
      start.setHours(0, 0, 0, 0)
    } else if (days) {
      start.setDate(now.getDate() - days + 1)
      prevEnd = new Date(start)
      prevEnd.setDate(start.getDate() - 1)
      prevStart = new Date(prevEnd)
      prevStart.setDate(prevEnd.getDate() - days + 1)
    }

    const curRangeQuery = admin
      .from('events_daily_counts')
      .select('ct, day')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('day', start.toISOString())
      .lte('day', now.toISOString())
    const prevRangeQuery = prevStart && prevEnd
      ? admin
        .from('events_daily_counts')
        .select('ct, day')
        .eq('workspace_id', workspaceId)
        .eq('event_name', 'placement_created')
        .gte('day', prevStart.toISOString())
        .lte('day', prevEnd.toISOString())
      : null
    const { data: curRows } = await curRangeQuery
    const prevRows = prevRangeQuery ? (await prevRangeQuery).data : undefined
    const placementsRange = (curRows || []).reduce((s, r) => s + (r as any).ct, 0)
    const placementsPrev = (prevRows || []).reduce((s, r) => s + (r as any).ct, 0)
    const placementsRangeDelta = prevRangeQuery ? placementsRange - placementsPrev : 0
    const placementsRangePct = prevRangeQuery
      ? (placementsPrev === 0 ? (placementsRange > 0 ? 100 : 0) : Math.round(((placementsRange - placementsPrev) / Math.max(1, placementsPrev)) * 100))
      : 0

    const placementsCommissionRange = await sumCommissionForWindow(start, now)
    const hasPrevWindow = Boolean(prevStart && prevEnd)
    const placementsCommissionPrev = hasPrevWindow && prevStart && prevEnd
      ? await sumCommissionForWindow(prevStart, prevEnd)
      : 0
    const placementsCommissionRangeDelta = hasPrevWindow ? placementsCommissionRange - placementsCommissionPrev : 0
    const placementsCommissionRangePct = hasPrevWindow
      ? (placementsCommissionPrev === 0 ? (placementsCommissionRange > 0 ? 100 : 0) : Math.round(((placementsCommissionRange - placementsCommissionPrev) / Math.max(1, placementsCommissionPrev)) * 100))
      : 0

    // Interviews and CVs sent (range + deltas)
    const fetchMetricTotal = async (eventName: string) => {
      const curPromise = admin
        .from('events_daily_counts')
        .select('ct, day')
        .eq('workspace_id', workspaceId)
        .eq('event_name', eventName)
        .gte('day', start.toISOString())
        .lte('day', now.toISOString())
      const prevPromise = prevStart && prevEnd
        ? admin
          .from('events_daily_counts')
          .select('ct, day')
          .eq('workspace_id', workspaceId)
          .eq('event_name', eventName)
          .gte('day', prevStart.toISOString())
          .lte('day', prevEnd.toISOString())
        : null

      const { data: cur } = await curPromise
      const prevData = prevPromise ? (await prevPromise).data : undefined
      const curTotal = (cur || []).reduce((s, r) => s + (r as any).ct, 0)
      const prevTotal = (prevData || []).reduce((s, r) => s + (r as any).ct, 0)
      const delta = prevPromise ? curTotal - prevTotal : 0
      const pct = prevPromise
        ? (prevTotal === 0 ? (curTotal > 0 ? 100 : 0) : Math.round(((curTotal - prevTotal) / Math.max(1, prevTotal)) * 100))
        : 0
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

    // Placeholder calculations for additional KPIs (replace with SQL/materialized views as needed)
    const weightedPipelineGBP = 0 // TODO: sum of role values * stage probability
    const cycleTimeP50Days = undefined as any // TODO: median from stage_transitions
    const cycleTimeP90Days = undefined as any
    const slaPct = undefined as any // TODO: % roles within stage time limits
    const followupOnTimePct = undefined as any // TODO: % tasks completed on/before due

    // Sparklines: small arrays; for now, derive trivial series from placement counts when absent
    const sparkFromCounts = (rows?: Array<{ ct: number; day: string }>) => {
      const src = rows || []
      const mapped = src.slice(-12).map(r => ({ t: r.day, v: (r as any).ct }))
      return mapped.length ? mapped : Array.from({ length: 12 }).map((_, i) => ({ t: String(i), v: 0 }))
    }

    // Fetch placement day counts for sparkline using current range window
    const { data: sparkRows } = await admin
      .from('events_daily_counts')
      .select('ct, day')
      .eq('workspace_id', workspaceId)
      .eq('event_name', 'placement_created')
      .gte('day', start.toISOString())
      .lte('day', now.toISOString())

    // Stage distribution placeholder (replace with live view)
    const stageDistribution = [
      { name: 'New', value: 0 },
      { name: 'Contacted', value: 0 },
      { name: 'Interview', value: 0 },
      { name: 'Placed', value: placementsRange },
    ]

    return NextResponse.json({
      kpis: {
        placementsQTD: placementsQTD ?? 0,
        rolesInProgress: rolesInProgress ?? 0,
        urgentCount: urgentCount ?? 0,
        placementsRange,
        placementsCommissionRange,
        interviewsRange: intv.curTotal,
        cvSentRange: cvs.curTotal,
        quarterProgressPct,
        daysLeftInQuarter,
        weightedPipelineGBP,
        cycleTimeP50Days,
        cycleTimeP90Days,
        slaPct,
        followupOnTimePct,
      },
      deltas: {
        placementsRangeDelta,
        placementsRangePct,
        placementsCommissionRangeDelta,
        placementsCommissionRangePct,
        interviewsRangeDelta: intv.delta,
        interviewsRangePct: intv.pct,
        cvSentRangeDelta: cvs.delta,
        cvSentRangePct: cvs.pct,
      },
      sparks: {
        placements: sparkFromCounts(sparkRows as any),
        pipeline: [],
        cycle: [],
        sla: [],
        followups: [],
      },
      stageDistribution,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
