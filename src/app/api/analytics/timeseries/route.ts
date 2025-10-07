import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    // Simple rate limiter: 90 req/min per IP
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const key = `timeseries:${ip}`
      // @ts-expect-error global
      const store = (globalThis.__rate || (globalThis.__rate = new Map<string, { c: number; t: number }>()));
      const nowTs = Date.now()
      const cur = store.get(key)
      if (!cur || nowTs - cur.t > 60_000) {
        store.set(key, { c: 1, t: nowTs })
      } else {
        if (cur.c >= 90) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
        cur.c += 1
      }
    } catch {}

    const { searchParams } = new URL(req.url)
    const metric = (searchParams.get('metric') || 'placements') as 'placements'|'interviews'|'cv_sent'|'tasks_completed'
    const rangeRaw = (searchParams.get('range') || '30d').toLowerCase()
    const workspaceId = searchParams.get('workspaceId')
    const isPrev = searchParams.get('prev') === '1'
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()
    const nowReal = new Date()
    const now = new Date(isPrev ? (new Date().setDate(nowReal.getDate() - 1)) : nowReal)
    let start = new Date(now)
    let days = 30
    const setQuarterStart = () => {
      const q = Math.floor(now.getMonth() / 3)
      const startMonth = q * 3
      start = new Date(now.getFullYear(), startMonth, 1)
      const diffMs = now.getTime() - start.getTime()
      days = Math.max(1, Math.floor(diffMs / (1000*60*60*24)) + 1)
    }
    switch (rangeRaw) {
      case '7d': start.setDate(now.getDate() - 6); days = 7; break
      case '30d':
      case 'month': start.setDate(now.getDate() - 29); days = 30; break
      case '90d': start.setDate(now.getDate() - 89); days = 90; break
      case '365d':
      case 'year': start.setDate(now.getDate() - 364); days = 365; break
      case 'quarter': setQuarterStart(); break
      case 'all': {
        // Determine earliest available day for this metric
        let minDay: string | null = null
        try {
          const { data: minView } = await admin
            .from('events_daily_counts')
            .select('day')
            .eq('workspace_id', workspaceId)
            .in('event_name', ['placement_created','interview_scheduled','cv_sent','task_completed'].includes(metric)
              ? (metric==='placements' ? ['placement_created'] : metric==='interviews' ? ['interview_scheduled'] : metric==='cv_sent' ? ['cv_sent'] : ['task_completed'])
              : ['placement_created'])
            .order('day', { ascending: true })
            .limit(1)
            .maybeSingle()
          if (minView?.day) minDay = new Date(minView.day as any).toISOString().slice(0,10)
        } catch {}
        if (!minDay) {
          try {
            const { data: minEvt } = await admin
              .from('events')
              .select('ts')
              .eq('workspace_id', workspaceId)
              .order('ts', { ascending: true })
              .limit(1)
              .maybeSingle()
            if (minEvt?.ts) minDay = new Date(minEvt.ts as any).toISOString().slice(0,10)
          } catch {}
        }
        if (!minDay) {
          // no data
          return NextResponse.json({ points: [] })
        }
        start = new Date(minDay + 'T00:00:00Z')
        const diffMs = now.getTime() - start.getTime()
        days = Math.max(1, Math.floor(diffMs / (1000*60*60*24)) + 1)
        break
      }
      default: start.setDate(now.getDate() - 29); days = 30
    }

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


