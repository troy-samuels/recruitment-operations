import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

type RangeKey = 'week' | 'month' | 'quarter' | 'year' | 'all'

const DAY_MS = 24 * 60 * 60 * 1000
const RANGE_WINDOWS: Record<Exclude<RangeKey, 'all'>, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
}

interface StageAccumulator {
  stage: string
  stageName: string
  rolesCount: number
  totalDurationMs: number
  durations: number[]
  maxDurationMs: number
}

interface StageSummary {
  stage: string
  stageName: string
  rolesCount: number
  avgDays: number
  medianDays: number
  maxDays: number
  totalDays: number
}

interface StageComputationResult {
  stages: StageSummary[]
  totalRoles: number
  overallAvgDays: number
}

const getRangeWindows = (range: RangeKey, now: Date) => {
  if (range === 'all') {
    const start = new Date('2020-01-01T00:00:00Z')
    return { start, prevStart: null, prevEnd: null }
  }

  const days = RANGE_WINDOWS[range] ?? RANGE_WINDOWS.quarter
  const durationMs = days * DAY_MS
  const start = new Date(now.getTime() - durationMs)
  const prevEnd = new Date(start.getTime() - 1)
  const prevStart = new Date(prevEnd.getTime() - durationMs + 1)
  return { start, prevStart, prevEnd }
}

const processStageEvents = (events: any[] | null, periodEnd: Date): StageComputationResult => {
  type StageTransition = {
    roleId: string
    stage: string
    stageName: string
    enteredAt: number
    exitedAt: number | null
    durationMs: number | null
  }

  const sortedEvents = (events || []).slice().sort((a, b) => {
    const roleCompare = (a.role_id as string).localeCompare(b.role_id as string)
    if (roleCompare !== 0) return roleCompare
    return new Date(a.ts as string).getTime() - new Date(b.ts as string).getTime()
  })

  const transitions: StageTransition[] = []
  const roleStageMap = new Map<string, { stage: string; stageName: string; enteredAt: number }>()
  const periodEndMs = periodEnd.getTime()

  for (const event of sortedEvents) {
    const roleId = event.role_id as string
    const ts = new Date(event.ts as string).getTime()
    const meta = (event.meta || {}) as Record<string, any>

    if (event.event_name === 'stage_entered') {
      const stage = String(meta.stage ?? '0')
      const stageName = meta.stage_name || `Stage ${stage}`
      roleStageMap.set(roleId, { stage, stageName, enteredAt: ts })
      continue
    }

    if (event.event_name === 'stage_changed') {
      const fromStage = String(meta.from_stage)
      const toStage = String(meta.to_stage)
      const toStageName = meta.to_stage_name || `Stage ${toStage}`

      const previous = roleStageMap.get(roleId)
      if (previous && previous.stage === fromStage) {
        const durationMs = ts - previous.enteredAt
        if (durationMs > 0) {
          transitions.push({
            roleId,
            stage: previous.stage,
            stageName: previous.stageName,
            enteredAt: previous.enteredAt,
            exitedAt: ts,
            durationMs,
          })
        }
      }

      roleStageMap.set(roleId, { stage: toStage, stageName: toStageName, enteredAt: ts })
    }
  }

  roleStageMap.forEach((stageInfo, roleId) => {
    const durationMs = periodEndMs - stageInfo.enteredAt
    if (durationMs <= 0) return
    transitions.push({
      roleId,
      stage: stageInfo.stage,
      stageName: stageInfo.stageName,
      enteredAt: stageInfo.enteredAt,
      exitedAt: null,
      durationMs,
    })
  })

  const stageStats = new Map<string, StageAccumulator>()
  let totalDurationMsAll = 0

  for (const transition of transitions) {
    if (transition.durationMs === null || transition.durationMs <= 0) continue

    const key = transition.stage
    if (!stageStats.has(key)) {
      stageStats.set(key, {
        stage: transition.stage,
        stageName: transition.stageName,
        rolesCount: 0,
        totalDurationMs: 0,
        durations: [],
        maxDurationMs: 0,
      })
    }

    const stats = stageStats.get(key)!
    stats.rolesCount += 1
    stats.totalDurationMs += transition.durationMs
    stats.durations.push(transition.durationMs)
    stats.maxDurationMs = Math.max(stats.maxDurationMs, transition.durationMs)
    totalDurationMsAll += transition.durationMs
  }

  const stages: StageSummary[] = Array.from(stageStats.values()).map((stats) => {
    const totalDays = stats.totalDurationMs / DAY_MS
    const avgDays = stats.rolesCount > 0 ? totalDays / stats.rolesCount : 0
    const sortedDurations = stats.durations.slice().sort((a, b) => a - b)
    const medianMs = sortedDurations.length
      ? sortedDurations[Math.floor(sortedDurations.length / 2)]
      : 0

    return {
      stage: stats.stage,
      stageName: stats.stageName,
      rolesCount: stats.rolesCount,
      avgDays: Number(avgDays.toFixed(1)),
      medianDays: Number((medianMs / DAY_MS).toFixed(1)),
      maxDays: Number((stats.maxDurationMs / DAY_MS).toFixed(1)),
      totalDays: Number(totalDays.toFixed(1)),
    }
  })

  stages.sort((a, b) => {
    const numA = parseInt(a.stage, 10)
    const numB = parseInt(b.stage, 10)
    return (isNaN(numA) ? 0 : numA) - (isNaN(numB) ? 0 : numB)
  })

  const rolesSet = new Set(transitions.map((t) => t.roleId))
  const overallAvgDays =
    transitions.length > 0
      ? Number(((totalDurationMsAll / DAY_MS) / transitions.length).toFixed(1))
      : 0

  return {
    stages,
    totalRoles: rolesSet.size,
    overallAvgDays,
  }
}

export async function GET(req: NextRequest) {
  try {
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const key = `stage-duration:${ip}`
      // @ts-expect-error globalThis store
      const store = (globalThis.__rate || (globalThis.__rate = new Map<string, { c: number; t: number }>()))
      const nowTs = Date.now()
      const cur = store.get(key)
      if (!cur || nowTs - cur.t > 60_000) {
        store.set(key, { c: 1, t: nowTs })
      } else {
        if (cur.c >= 60) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
        cur.c += 1
      }
    } catch {}

    const { searchParams } = new URL(req.url)
    const rangeRaw = (searchParams.get('range') || 'quarter') as RangeKey
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })
    }

    const now = new Date()
    const { start, prevStart, prevEnd } = getRangeWindows(rangeRaw, now)
    const admin = getSupabaseAdmin()

    const { data: stageEvents, error: eventsError } = await admin
      .from('events')
      .select('role_id, ts, event_name, meta')
      .eq('workspace_id', workspaceId)
      .in('event_name', ['stage_changed', 'stage_entered'])
      .gte('ts', start.toISOString())
      .lte('ts', now.toISOString())
      .order('role_id', { ascending: true })
      .order('ts', { ascending: true })

    if (eventsError) {
      console.error('[stage-duration] Query error:', eventsError)
      return NextResponse.json({ stages: [], totalRoles: 0, overallAvgDays: 0, range: rangeRaw }, { status: 200 })
    }

    const currentStats = processStageEvents(stageEvents, now)
    let previousStats: StageComputationResult | null = null

    if (prevStart && prevEnd) {
      const { data: prevEvents, error: prevError } = await admin
        .from('events')
        .select('role_id, ts, event_name, meta')
        .eq('workspace_id', workspaceId)
        .in('event_name', ['stage_changed', 'stage_entered'])
        .gte('ts', prevStart.toISOString())
        .lte('ts', prevEnd.toISOString())
        .order('role_id', { ascending: true })
        .order('ts', { ascending: true })

      if (!prevError) {
        previousStats = processStageEvents(prevEvents, prevEnd)
      }
    }

    const prevStageMap = new Map<string, StageSummary>()
    previousStats?.stages.forEach((stage) => prevStageMap.set(stage.stage, stage))

    const stagesWithDelta = currentStats.stages.map((stage) => {
      const prev = prevStageMap.get(stage.stage)
      let deltaPct: number | null = null

      if (prev) {
        if (prev.avgDays === 0 && stage.avgDays === 0) {
          deltaPct = 0
        } else if (prev.avgDays === 0 && stage.avgDays > 0) {
          deltaPct = 100
        } else if (prev.avgDays > 0) {
          deltaPct = Number((((stage.avgDays - prev.avgDays) / prev.avgDays) * 100).toFixed(1))
        }
      }

      return {
        ...stage,
        prevAvgDays: prev?.avgDays ?? null,
        deltaPct,
      }
    })

    return NextResponse.json({
      stages: stagesWithDelta,
      totalRoles: currentStats.totalRoles,
      overallAvgDays: currentStats.overallAvgDays,
      range: rangeRaw,
      comparison: prevStart && prevEnd ? {
        from: prevStart.toISOString(),
        to: prevEnd.toISOString(),
      } : null,
    })
  } catch (e: any) {
    console.error('[stage-duration] Error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
