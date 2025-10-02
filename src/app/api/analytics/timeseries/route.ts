import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const metric = (searchParams.get('metric') || 'placements') as 'placements'|'interviews'|'cv_sent'|'tasks_completed'
    const range = (searchParams.get('range') || '30d') as '7d'|'30d'|'90d'
    const workspaceId = searchParams.get('workspaceId')
    const isPrev = searchParams.get('prev') === '1'
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()
    const nowReal = new Date()
    const now = new Date(isPrev ? (new Date().setDate(nowReal.getDate() - (range === '7d' ? 7 : range === '30d' ? 30 : 90))) : nowReal)
    const start = new Date(now)
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    start.setDate(now.getDate() - days + 1)

    const nameMap: Record<string, string[]> = {
      placements: ['placement_created'],
      interviews: ['interview_scheduled'],
      cv_sent: ['cv_sent'],
      tasks_completed: ['task_completed']
    }
    const names = nameMap[metric]

    // Prefer materialized view for faster aggregation
    const { data, error } = await admin
      .from('events_daily_counts')
      .select('day, ct')
      .eq('workspace_id', workspaceId)
      .in('event_name', names)
      .gte('day', start.toISOString())
      .lte('day', now.toISOString())

    const buckets: Record<string, number> = {}
    for (let i=0;i<days;i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      buckets[d.toISOString().slice(0,10)] = 0
    }
    if (error && error.message) {
      // fallback: no view
      const { data: raw, error: e2 } = await admin
        .from('events')
        .select('ts')
        .eq('workspace_id', workspaceId)
        .in('event_name', names)
        .gte('ts', start.toISOString())
        .lte('ts', now.toISOString())
      if (e2) {
        // Gracefully return empty results if table not present locally
        return NextResponse.json({ points: [] })
      }
      for (const row of raw || []) {
        const key = new Date(row.ts as any).toISOString().slice(0,10)
        if (key in buckets) buckets[key]++
      }
    } else {
      for (const row of data || []) {
        const key = new Date(row.day as any).toISOString().slice(0,10)
        buckets[key] = (buckets[key] || 0) + (row.ct as any as number)
      }
    }
    const points = Object.entries(buckets).map(([d,v])=>({ t: d, v }))
    return NextResponse.json({ points })
  } catch (e: any) {
    // In local dev without schema, return empty results
    return NextResponse.json({ points: [] })
  }
}


