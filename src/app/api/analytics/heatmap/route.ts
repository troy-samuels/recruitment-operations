import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    // Simple IP-based rate limit: max 60 requests per 60s per IP
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const key = `heatmap:${ip}`
      // @ts-expect-error globalThis for ephemeral in-memory edge/runtime
      const store = (globalThis.__rate || (globalThis.__rate = new Map<string, { c: number; t: number }>()));
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
    const metric = (searchParams.get('metric') || 'stage_moves') as 'stage_moves'|'tasks_completed'
    const range = (searchParams.get('range') || '90d') as '7d'|'30d'|'90d'
    const workspaceId = searchParams.get('workspaceId')
    if (!workspaceId) return NextResponse.json({ error: 'workspaceId required' }, { status: 400 })

    const admin = getSupabaseAdmin()
    const now = new Date()
    const start = new Date(now)
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    start.setDate(now.getDate() - days + 1)

    const names = metric === 'tasks_completed' ? ['task_completed'] : ['stage_changed', 'candidate_moved']
    const { data, error } = await admin
      .from('events')
      .select('ts')
      .eq('workspace_id', workspaceId)
      .in('event_name', names)
      .gte('ts', start.toISOString())
      .lte('ts', now.toISOString())
    if (error) {
      // Gracefully return empty in local dev w/o schema
      return NextResponse.json({ cells: [] })
    }

    const cells: Record<string, number> = {}
    for (const row of data || []) {
      const key = new Date(row.ts as any).toISOString().slice(0,10)
      cells[key] = (cells[key] || 0) + 1
    }
    const out = Object.entries(cells).map(([d,v]) => ({ d, v }))
    return NextResponse.json({ cells: out })
  } catch (e: any) {
    return NextResponse.json({ cells: [] })
  }
}


